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
import type { ProfileDocument } from '@/lib/profileService'
// Note: saveCard from storage.ts now routes through the /api/cards HTTP endpoint,
// so we call the API directly below rather than via the storage helper.
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
      if (s.isDirty && s.config) {
        s.saveDraftNow()
      }
    }, 500)

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
        // 1. Try Firestore draft via API
        const res = await fetch(`/api/drafts?userId=${encodeURIComponent(userId)}`)
        if (!res.ok) {
          throw new Error(`Failed to load draft: ${res.status}`)
        }
        const data = await res.json()
        let draft = data.draft

        // 2. If no draft, try legacy migration from localStorage
        if (!draft && typeof window !== 'undefined') {
          const configStr = localStorage.getItem('currentBioLinkConfig')
          if (configStr) {
            try {
              const config = JSON.parse(configStr)
              if (config && config.profile) {
                const migratedDraft = {
                  version: 1,
                  theme: config.theme,
                  profile: config.profile,
                  links: config.links || [],
                  socialLinks: config.socialLinks || {},
                  socialIconPosition: config.socialIconPosition,
                  settings: {},
                }
                const saveRes = await fetch('/api/drafts', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId, draftData: migratedDraft }),
                })
                if (!saveRes.ok) {
                  throw new Error(`Failed to save migrated draft: ${saveRes.status}`)
                }
                const saveResult = await saveRes.json()
                if (saveResult.success) {
                  draft = {
                    ...migratedDraft,
                    version: saveResult.version,
                    updatedAt: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                  } as any
                }
              }
            } catch (err) {
              console.error('[useDraftStore] migrateLegacyData error:', err)
            }
          }
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
      if (!state.config) return

      const userId = state.userId || getAccountUsername() || 'anonymous_user'
      const handleSlug =
        resolveCardKey(state.config.profile?.handle, state.config.profile?.title) ||
        getAccountUsername() ||
        'user'

      const localCardPayload = {
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
        updatedAt: new Date().toISOString(),
        userId: userId,
      }

      // Always save to localStorage immediately so no user changes are ever lost locally
      try {
        localStorage.setItem('currentBioLinkConfig', JSON.stringify(state.config))
        localStorage.setItem('bioLinkDraft', JSON.stringify(state.config))
        localStorage.setItem('editorPreviewCardId', handleSlug)
        localStorage.setItem('activeBioCardId', handleSlug)

        const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
        cards[handleSlug] = localCardPayload
        localStorage.setItem('bioCards', JSON.stringify(cards))
      } catch (err) {
        console.warn('⚠️ Local auto-save failed:', err)
      }

      try {
        const draftDoc: any = {
          version: state.version,
          theme: state.config.theme,
          profile: state.config.profile,
          links: state.config.links,
          socialLinks: state.config.socialLinks,
          socialIconPosition: state.config.socialIconPosition,
          settings: {},
          lastEditor: userId,
          updatedAt: new Date().toISOString(),
        }

        // 1. Save draft
        const saveRes = await fetch('/api/drafts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, draftData: draftDoc }),
        })

        let currentVer = state.version
        if (saveRes.ok) {
          const result = await saveRes.json()
          if (result.success && result.version) {
            currentVer = result.version
          }
        }

        // 2. AUTO-PUBLISH: Sync directly to live published page & cards store (Linktree auto-save architecture)
        await Promise.allSettled([
          fetch(`/api/cards/${handleSlug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              config: localCardPayload.config,
              handle: handleSlug,
              ownerId: userId,
            }),
          }),
          fetch('/api/published', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, draftData: { ...draftDoc, version: currentVer } }),
          }),
          fetch('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cardId: handleSlug,
              handle: handleSlug,
              config: localCardPayload.config,
              analytics: localCardPayload.analytics,
              ownerId: userId,
            }),
          }),
        ])

        set({
          isDirty: false,
          version: currentVer,
          lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
        return
      } catch (err) {
        console.warn('[useDraftStore] Remote auto-save warning:', err)
      }

      set({
        isDirty: false,
        lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    },

    // ── publishProfile (Auto-save alias) ───────────────────────────────────
    publishProfile: async () => {
      const state = get()
      if (!state.config) {
        return { success: false, error: 'No config found to save' }
      }

      await state.saveDraftNow()

      const handleSlug =
        resolveCardKey(state.config.profile?.handle, state.config.profile?.title) ||
        getAccountUsername() ||
        'user'

      return { success: true, cardId: handleSlug }
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
