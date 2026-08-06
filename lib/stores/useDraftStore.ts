/**
 * useDraftStore.ts
 * ----------------
 * Central Zustand store for the BioLinks editor.
 *
 * ✅ Zustand is the live editing source of truth during a session.
 * ✅ Firestore is the persistent source of truth across sessions.
 * ✅ Preview renders directly from this store — never fetches Firestore.
 *
 * Single API:  update(path, value)
 *   update("profile.title", "Satvik")
 *   update("theme.palette", "forest")
 *   update("links.2.title", "Portfolio")
 *
 * Auto-save: dirty flag + 800ms debounce + beforeunload flush.
 * Undo/Redo: history stack (max 30).
 * Versioning: every Firestore write increments version.
 */

import { create } from 'zustand'
import {
  getDraft,
  saveDraft,
  publishProfile as publishProfileService,
  migrateLegacyData,
  type ProfileDocument,
} from '@/lib/profileService'
import { saveCard as saveCardToFirestore } from '@/lib/storage'
import { resolveCardKey, getCleanUsernameSlug, getAccountUsername } from '@/lib/urlHelper'
import type { Theme } from '@/lib/themes'

// ── Types ────────────────────────────────────────────────────────────────────

export interface BioLinkConfig {
  theme: Theme
  profile: {
    avatar: string
    title: string
    handle?: string
    bio: string
    location?: string
    website?: string
    profession?: string
  }
  links: any[]
  socialLinks: Record<string, string>
  socialIconPosition?: 'top' | 'bottom'
}

interface DraftState {
  // ── Data ──
  config: BioLinkConfig | null
  isLoading: boolean
  isDirty: boolean
  lastSavedAt: string
  version: number
  userId: string

  // ── Undo/Redo ──
  _past: BioLinkConfig[]
  _future: BioLinkConfig[]
  _isUndoRedo: boolean

  // ── Auto-save internals ──
  _debounceTimer: ReturnType<typeof setTimeout> | null
  _beforeUnloadBound: boolean

  // ── Actions ──
  loadDraft: (userId: string) => Promise<void>
  update: (path: string, value: any) => void
  batchUpdate: (updates: Array<{ path: string; value: any }>) => void
  setConfig: (config: BioLinkConfig) => void
  undo: () => void
  redo: () => void
  saveDraftNow: () => Promise<void>
  publishProfile: () => Promise<{ success: boolean; error?: string }>
  flushBeforeUnload: () => void
}

// ── Deep-set helper ──────────────────────────────────────────────────────────

function deepSet(obj: any, path: string, value: any): any {
  const clone = JSON.parse(JSON.stringify(obj))
  const keys = path.split('.')
  let current = clone
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    if (current[k] === undefined || current[k] === null) {
      // If next key is a number, create array, otherwise object
      current[k] = /^\d+$/.test(keys[i + 1]) ? [] : {}
    }
    current = current[k]
  }
  current[keys[keys.length - 1]] = value
  return clone
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useDraftStore = create<DraftState>()((set, get) => {
  // ── Private: schedule auto-save ────────────────────────────────────────
  function scheduleSave() {
    const state = get()
    if (state._debounceTimer) clearTimeout(state._debounceTimer)

    const timer = setTimeout(() => {
      const s = get()
      if (s.isDirty && s.config && s.userId) {
        s.saveDraftNow()
      }
    }, 800)

    set({ _debounceTimer: timer })
  }

  // ── Private: push to undo history ──────────────────────────────────────
  function pushHistory(currentConfig: BioLinkConfig) {
    const state = get()
    if (state._isUndoRedo) return
    set({
      _past: [...state._past, JSON.parse(JSON.stringify(currentConfig))].slice(-30),
      _future: [],
    })
  }

  // ── Private: bind beforeunload ─────────────────────────────────────────
  function bindBeforeUnload() {
    if (typeof window === 'undefined') return
    const state = get()
    if (state._beforeUnloadBound) return

    window.addEventListener('beforeunload', () => {
      const s = get()
      if (s.isDirty && s.config && s.userId) {
        // Synchronous flush — use sendBeacon or last-effort setDoc
        s.flushBeforeUnload()
      }
    })

    set({ _beforeUnloadBound: true })
  }

  return {
    // ── Initial state ──
    config: null,
    isLoading: true,
    isDirty: false,
    lastSavedAt: '',
    version: 0,
    userId: '',
    _past: [],
    _future: [],
    _isUndoRedo: false,
    _debounceTimer: null,
    _beforeUnloadBound: false,

    // ── loadDraft ────────────────────────────────────────────────────────
    loadDraft: async (userId: string) => {
      set({ isLoading: true, userId })

      try {
        // 1. Try Firestore draft
        let draft = await getDraft(userId)

        // 2. If no draft, try legacy migration from localStorage
        if (!draft) {
          draft = await migrateLegacyData(userId)
        }

        if (draft) {
          const config: BioLinkConfig = {
            theme: draft.theme,
            profile: draft.profile,
            links: draft.links || [],
            socialLinks: draft.socialLinks || {},
            socialIconPosition: draft.socialIconPosition,
          }

          set({
            config,
            version: draft.version ?? 1,
            isLoading: false,
            isDirty: false,
            _past: [],
            _future: [],
          })

          // Also keep localStorage in sync as a fast-load cache
          try {
            localStorage.setItem('currentBioLinkConfig', JSON.stringify(config))
          } catch { /* quota exceeded — ignore */ }

          bindBeforeUnload()
        } else {
          // No data anywhere — will redirect to /create
          set({ config: null, isLoading: false })
        }
      } catch (err) {
        console.error('[useDraftStore] loadDraft error:', err)

        // Last resort: try localStorage
        try {
          const configStr = localStorage.getItem('currentBioLinkConfig')
          if (configStr) {
            const config = JSON.parse(configStr)
            set({ config, isLoading: false, isDirty: false, version: 0 })
            bindBeforeUnload()
            return
          }
        } catch { /* ignore */ }

        set({ config: null, isLoading: false })
      }
    },

    // ── update(path, value) ──────────────────────────────────────────────
    update: (path: string, value: any) => {
      const state = get()
      if (!state.config) return

      pushHistory(state.config)

      const newConfig = deepSet(state.config, path, value)
      set({ config: newConfig, isDirty: true })

      // Keep localStorage cache in sync
      try {
        localStorage.setItem('currentBioLinkConfig', JSON.stringify(newConfig))
      } catch { /* ignore */ }

      scheduleSave()
    },

    // ── batchUpdate ──────────────────────────────────────────────────────
    batchUpdate: (updates: Array<{ path: string; value: any }>) => {
      const state = get()
      if (!state.config) return

      pushHistory(state.config)

      let newConfig = JSON.parse(JSON.stringify(state.config))
      for (const { path, value } of updates) {
        newConfig = deepSet(newConfig, path, value)
      }

      set({ config: newConfig, isDirty: true })

      try {
        localStorage.setItem('currentBioLinkConfig', JSON.stringify(newConfig))
      } catch { /* ignore */ }

      scheduleSave()
    },

    // ── setConfig (full replace, no debounce) ────────────────────────────
    setConfig: (config: BioLinkConfig) => {
      const state = get()
      if (state.config) pushHistory(state.config)
      set({ config, isDirty: true })

      try {
        localStorage.setItem('currentBioLinkConfig', JSON.stringify(config))
      } catch { /* ignore */ }

      scheduleSave()
    },

    // ── Undo ─────────────────────────────────────────────────────────────
    undo: () => {
      const state = get()
      if (state._past.length === 0 || !state.config) return

      const previous = state._past[state._past.length - 1]
      const newPast = state._past.slice(0, -1)

      set({
        _isUndoRedo: true,
        _past: newPast,
        _future: [JSON.parse(JSON.stringify(state.config)), ...state._future],
        config: previous,
        isDirty: true,
      })

      try {
        localStorage.setItem('currentBioLinkConfig', JSON.stringify(previous))
      } catch { /* ignore */ }

      scheduleSave()

      // Reset flag after microtask
      setTimeout(() => set({ _isUndoRedo: false }), 0)
    },

    // ── Redo ─────────────────────────────────────────────────────────────
    redo: () => {
      const state = get()
      if (state._future.length === 0 || !state.config) return

      const next = state._future[0]
      const newFuture = state._future.slice(1)

      set({
        _isUndoRedo: true,
        _past: [...state._past, JSON.parse(JSON.stringify(state.config))],
        _future: newFuture,
        config: next,
        isDirty: true,
      })

      try {
        localStorage.setItem('currentBioLinkConfig', JSON.stringify(next))
      } catch { /* ignore */ }

      scheduleSave()
      setTimeout(() => set({ _isUndoRedo: false }), 0)
    },

    // ── saveDraftNow ─────────────────────────────────────────────────────
    saveDraftNow: async () => {
      const state = get()
      if (!state.config || !state.userId) return

      try {
        const draftDoc: any = {
          version: state.version,
          theme: state.config.theme,
          profile: state.config.profile,
          links: state.config.links,
          socialLinks: state.config.socialLinks,
          socialIconPosition: state.config.socialIconPosition,
          settings: {},
          lastEditor: state.userId,
        }

        const result = await saveDraft(state.userId, draftDoc)
        if (result.success) {
          set({
            isDirty: false,
            version: result.version,
            lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          })
        }
      } catch (err) {
        console.error('[useDraftStore] saveDraftNow error:', err)
      }
    },

    // ── publishProfile ───────────────────────────────────────────────────
    publishProfile: async () => {
      const state = get()
      if (!state.config || !state.userId) {
        return { success: false, error: 'Not signed in or no config' }
      }

      try {
        // 1. Ensure draft is saved first
        if (state.isDirty) {
          await state.saveDraftNow()
        }

        const handleSlug =
          resolveCardKey(state.config.profile?.handle, state.config.profile?.title) ||
          getAccountUsername() ||
          'user'

        // 2. Claim username via API (server-side validation)
        const response = await fetch(`/api/cards/${handleSlug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            config: {
              profile: state.config.profile,
              links: state.config.links,
              theme: state.config.theme,
              socialLinks: state.config.socialLinks,
            },
            handle: handleSlug,
            ownerId: state.userId,
          }),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || `Server error: ${response.status}`)
        }

        // 3. Publish to Firestore profiles/{uid}/published
        const draftDoc: ProfileDocument = {
          version: state.version,
          theme: state.config.theme,
          profile: state.config.profile,
          links: state.config.links,
          socialLinks: state.config.socialLinks,
          socialIconPosition: state.config.socialIconPosition,
          settings: {},
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          lastEditor: state.userId,
        }

        const pubResult = await publishProfileService(state.userId, draftDoc)

        // 4. Also save to bioCards collection (for public page rendering)
        const cardPayload = {
          id: handleSlug,
          handle: handleSlug,
          config: {
            profile: state.config.profile,
            links: state.config.links,
            theme: state.config.theme,
            socialLinks: state.config.socialLinks,
          },
          analytics: { views: 0, clicks: 0 },
          createdAt: new Date().toISOString(),
        }

        await saveCardToFirestore(handleSlug, cardPayload).catch(err =>
          console.warn('[useDraftStore] bioCards save warning:', err)
        )

        // 5. Also save to server-side card store (for API/SSR rendering)
        try {
          await fetch('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cardId: handleSlug,
              handle: handleSlug,
              config: cardPayload.config,
              analytics: cardPayload.analytics,
              ownerId: state.userId,
            }),
          })
        } catch { /* non-fatal */ }

        // Update store with new version
        if (pubResult.success) {
          set({ version: pubResult.version, isDirty: false })
        }

        // Keep localStorage references in sync
        localStorage.setItem('editorPreviewCardId', handleSlug)
        localStorage.setItem('activeBioCardId', handleSlug)

        return { success: true }
      } catch (err: any) {
        console.error('[useDraftStore] publishProfile error:', err)
        return { success: false, error: err.message || 'Failed to publish' }
      }
    },

    // ── flushBeforeUnload ────────────────────────────────────────────────
    flushBeforeUnload: () => {
      const state = get()
      if (!state.isDirty || !state.config || !state.userId) return

      // Use navigator.sendBeacon as a best-effort flush
      // Since we can't await Firestore in beforeunload, save to localStorage
      // and let the next session pick it up
      try {
        localStorage.setItem('currentBioLinkConfig', JSON.stringify(state.config))
        localStorage.setItem('_draftDirtyFlush', JSON.stringify({
          userId: state.userId,
          version: state.version,
          timestamp: Date.now(),
        }))
      } catch { /* ignore */ }
    },
  }
})

// ── Computed selectors ───────────────────────────────────────────────────────

export const useCanUndo = () => useDraftStore(s => s._past.length > 0)
export const useCanRedo = () => useDraftStore(s => s._future.length > 0)
export const useConfig = () => useDraftStore(s => s.config)
export const useIsLoading = () => useDraftStore(s => s.isLoading)
export const useIsDirty = () => useDraftStore(s => s.isDirty)
