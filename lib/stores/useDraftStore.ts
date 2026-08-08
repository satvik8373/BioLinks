/**
 * useDraftStore.ts
 * ----------------
 * Central Zustand store for the BioLinks editor.
 *
 * ✅ Zustand is the live editing source of truth during a session.
 * ✅ Firestore is the persistent source of truth across sessions.
 * ✅ Preview renders directly from this store — never fetches Firestore.
 *
 * Save model (explicit, NOT auto-save):
 *   - Every edit updates Zustand + localStorage only. Zero server requests.
 *   - isDirty = true signals unsaved changes to the UI.
 *   - saveDraftNow() — called only when user clicks Save. Writes to server.
 *   - discardChanges() — reloads the last saved server state, resets isDirty.
 *   - beforeunload — shows the native browser "Leave site?" prompt when dirty.
 *
 * Undo/Redo: history stack (max 30).
 * Versioning: every Firestore write increments version.
 */

import { create } from 'zustand'
import type { ProfileDocument } from '@/lib/profileService'
import { resolveCardKey, getAccountUsername } from '@/lib/urlHelper'
import type { Theme } from '@/lib/themes'

// ── Types ────────────────────────────────────────────────────────────────────

export interface SplashScreenConfig {
  enabled?: boolean
  template?: 'framer-preload' | 'load-screen'
  tagline?: string
  frequency?: 'always' | 'session'
}

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
    showBadge?: boolean
    badgeType?: string
    badgeText?: string
    isVerified?: boolean
  }
  links: any[]
  socialLinks: Record<string, string>
  socialIconPosition?: 'top' | 'bottom'
  stickers?: any[]
  splashScreen?: SplashScreenConfig
}

interface DraftState {
  // ── Data ──
  config: BioLinkConfig | null
  /** Snapshot of the last successfully saved config — used by discardChanges */
  savedConfig: BioLinkConfig | null
  isLoading: boolean
  isDirty: boolean
  isSaving: boolean
  lastSavedAt: string
  saveError: string | null
  version: number
  userId: string

  // ── Undo/Redo ──
  _past: BioLinkConfig[]
  _future: BioLinkConfig[]
  _isUndoRedo: boolean

  // ── beforeunload guard ──
  _beforeUnloadBound: boolean

  // ── Actions ──
  loadDraft: (userId: string) => Promise<void>
  update: (path: string, value: any) => void
  batchUpdate: (updates: Array<{ path: string; value: any }>) => void
  setConfig: (config: BioLinkConfig) => void
  undo: () => void
  redo: () => void
  /** Explicit save — called only from the Save button. Writes to Firestore + card store. */
  saveDraftNow: () => Promise<void>
  /** Explicit publish — same as saveDraftNow but also triggers the share modal. */
  publishProfile: () => Promise<{ success: boolean; error?: string }>
  /** Discard all unsaved changes and restore the last saved config. */
  discardChanges: () => void
}

// ── Deep-set helper ──────────────────────────────────────────────────────────

function deepSet(obj: any, path: string, value: any): any {
  const clone = JSON.parse(JSON.stringify(obj))
  const keys = path.split('.')
  let current = clone
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    if (current[k] === undefined || current[k] === null) {
      current[k] = /^\d+$/.test(keys[i + 1]) ? [] : {}
    }
    current = current[k]
  }
  current[keys[keys.length - 1]] = value
  return clone
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useDraftStore = create<DraftState>()((set, get) => {
  // ── Private: push to undo history ──────────────────────────────────────
  function pushHistory(currentConfig: BioLinkConfig) {
    const state = get()
    if (state._isUndoRedo) return
    set({
      _past: [...state._past, JSON.parse(JSON.stringify(currentConfig))].slice(-30),
      _future: [],
    })
  }

  // ── Private: bind beforeunload native prompt ────────────────────────────
  // Shows the browser "Leave site? Changes you made may not be saved." dialog.
  // Does NOT attempt any network request — that causes race conditions.
  function bindBeforeUnload() {
    if (typeof window === 'undefined') return
    const state = get()
    if (state._beforeUnloadBound) return

    window.addEventListener('beforeunload', (e) => {
      if (get().isDirty) {
        e.preventDefault()
        // Legacy support — required by some browsers
        e.returnValue = ''
      }
    })

    set({ _beforeUnloadBound: true })
  }

  return {
    // ── Initial state ──
    config: null,
    savedConfig: null,
    isLoading: true,
    isDirty: false,
    isSaving: false,
    saveError: null,
    lastSavedAt: '',
    version: 0,
    userId: '',
    _past: [],
    _future: [],
    _isUndoRedo: false,
    _beforeUnloadBound: false,

    // ── loadDraft ────────────────────────────────────────────────────────
    loadDraft: async (userId: string) => {
      set({ isLoading: true, userId })

      try {
        const res = await fetch(`/api/drafts?userId=${encodeURIComponent(userId)}`)
        if (!res.ok) throw new Error(`Failed to load draft: ${res.status}`)
        const data = await res.json()
        let draft = data.draft

        // Legacy localStorage migration (one-time)
        if (!draft && typeof window !== 'undefined') {
          const configStr = localStorage.getItem('currentBioLinkConfig')
          if (configStr) {
            try {
              const parsed = JSON.parse(configStr)
              if (parsed?.profile) {
                const migratedDraft = {
                  version: 1,
                  theme: parsed.theme,
                  profile: parsed.profile,
                  links: parsed.links || [],
                  socialLinks: parsed.socialLinks || {},
                  socialIconPosition: parsed.socialIconPosition,
                  settings: {},
                }
                const saveRes = await fetch('/api/drafts', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId, draftData: migratedDraft }),
                })
                if (saveRes.ok) {
                  const result = await saveRes.json()
                  if (result.success) {
                    draft = { ...migratedDraft, version: result.version, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() }
                  }
                }
              }
            } catch (err) {
              console.error('[useDraftStore] migration error:', err)
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
            savedConfig: JSON.parse(JSON.stringify(config)),
            version: draft.version ?? 1,
            isLoading: false,
            isDirty: false,
            saveError: null,
            _past: [],
            _future: [],
          })
          try { localStorage.setItem('currentBioLinkConfig', JSON.stringify(config)) } catch { /* quota */ }
          bindBeforeUnload()
        } else {
          set({ config: null, isLoading: false })
        }
      } catch (err) {
        console.error('[useDraftStore] loadDraft error:', err)
        // Last resort: localStorage cache
        try {
          const configStr = localStorage.getItem('currentBioLinkConfig')
          if (configStr) {
            const config = JSON.parse(configStr)
            set({ config, savedConfig: JSON.parse(configStr), isLoading: false, isDirty: false, version: 0 })
            bindBeforeUnload()
            return
          }
        } catch { /* ignore */ }
        set({ config: null, isLoading: false })
      }
    },

    // ── update ───────────────────────────────────────────────────────────
    // Local-only. Zero network requests.
    update: (path: string, value: any) => {
      const state = get()
      if (!state.config) return
      pushHistory(state.config)
      const newConfig = deepSet(state.config, path, value)
      set({ config: newConfig, isDirty: true, saveError: null })
      try { localStorage.setItem('currentBioLinkConfig', JSON.stringify(newConfig)) } catch { /* ignore */ }
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
      set({ config: newConfig, isDirty: true, saveError: null })
      try { localStorage.setItem('currentBioLinkConfig', JSON.stringify(newConfig)) } catch { /* ignore */ }
    },

    // ── setConfig ────────────────────────────────────────────────────────
    setConfig: (config: BioLinkConfig) => {
      const state = get()
      if (state.config) pushHistory(state.config)
      set({ config, isDirty: true, saveError: null })
      try { localStorage.setItem('currentBioLinkConfig', JSON.stringify(config)) } catch { /* ignore */ }
    },

    // ── undo ─────────────────────────────────────────────────────────────
    undo: () => {
      const state = get()
      if (state._past.length === 0 || !state.config) return
      const previous = state._past[state._past.length - 1]
      set({
        _isUndoRedo: true,
        _past: state._past.slice(0, -1),
        _future: [JSON.parse(JSON.stringify(state.config)), ...state._future],
        config: previous,
        isDirty: true,
      })
      try { localStorage.setItem('currentBioLinkConfig', JSON.stringify(previous)) } catch { /* ignore */ }
      setTimeout(() => set({ _isUndoRedo: false }), 0)
    },

    // ── redo ─────────────────────────────────────────────────────────────
    redo: () => {
      const state = get()
      if (state._future.length === 0 || !state.config) return
      const next = state._future[0]
      set({
        _isUndoRedo: true,
        _past: [...state._past, JSON.parse(JSON.stringify(state.config))],
        _future: state._future.slice(1),
        config: next,
        isDirty: true,
      })
      try { localStorage.setItem('currentBioLinkConfig', JSON.stringify(next)) } catch { /* ignore */ }
      setTimeout(() => set({ _isUndoRedo: false }), 0)
    },

    // ── saveDraftNow — EXPLICIT SAVE ONLY ───────────────────────────────
    // Called exclusively from the Save button. Never called automatically.
    saveDraftNow: async () => {
      const state = get()
      if (!state.config) return

      set({ isSaving: true, saveError: null })

      const userId = state.userId || getAccountUsername() || 'anonymous_user'
      const handleSlug =
        resolveCardKey(state.config.profile?.handle, state.config.profile?.title) ||
        getAccountUsername() ||
        'user'

      const configPayload = {
        profile: state.config.profile,
        links: state.config.links,
        theme: state.config.theme,
        socialLinks: state.config.socialLinks,
        socialIconPosition: state.config.socialIconPosition,
        stickers: state.config.stickers,
        splashScreen: state.config.splashScreen,
      }

      // 1. Always persist to localStorage first (instant, zero-latency)
      try {
        localStorage.setItem('currentBioLinkConfig', JSON.stringify(state.config))
        localStorage.setItem('bioLinkDraft', JSON.stringify(state.config))
        localStorage.setItem('editorPreviewCardId', handleSlug)
        localStorage.setItem('activeBioCardId', handleSlug)
        const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
        cards[handleSlug] = { id: handleSlug, handle: handleSlug, config: configPayload, analytics: { views: 0, clicks: 0 }, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), userId }
        localStorage.setItem('bioCards', JSON.stringify(cards))
      } catch { /* quota exceeded */ }

      // 2. Write to Firestore draft + published + card store
      try {
        const draftDoc: any = {
          version: state.version,
          theme: state.config.theme,
          profile: state.config.profile,
          links: state.config.links,
          socialLinks: state.config.socialLinks,
          socialIconPosition: state.config.socialIconPosition,
          stickers: state.config.stickers,
          splashScreen: state.config.splashScreen,
          settings: {},
          lastEditor: userId,
          updatedAt: new Date().toISOString(),
        }

        // Save draft to Firestore
        const saveRes = await fetch('/api/drafts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, draftData: draftDoc }),
        })

        let currentVer = state.version
        if (saveRes.ok) {
          const result = await saveRes.json()
          if (result.version) currentVer = result.version
        }

        // Sync to live card store + published
        await Promise.allSettled([
          fetch(`/api/cards/${handleSlug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ config: configPayload, handle: handleSlug, ownerId: userId }),
          }),
          fetch('/api/published', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, draftData: { ...draftDoc, version: currentVer } }),
          }),
          fetch('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cardId: handleSlug, handle: handleSlug, config: configPayload, analytics: { views: 0, clicks: 0 }, ownerId: userId }),
          }),
        ])

        const savedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        set({
          isDirty: false,
          isSaving: false,
          saveError: null,
          version: currentVer,
          lastSavedAt: savedAt,
          // Snapshot the saved state so discard can restore it
          savedConfig: JSON.parse(JSON.stringify(state.config)),
        })
      } catch (err: any) {
        console.error('[useDraftStore] saveDraftNow error:', err)
        set({ isSaving: false, saveError: err?.message || 'Save failed. Please try again.' })
      }
    },

    // ── publishProfile — alias that calls saveDraftNow ──────────────────
    publishProfile: async () => {
      const state = get()
      if (!state.config) return { success: false, error: 'No config to save' }
      await state.saveDraftNow()
      const s = get()
      if (s.saveError) return { success: false, error: s.saveError }
      const handleSlug =
        resolveCardKey(state.config.profile?.handle, state.config.profile?.title) ||
        getAccountUsername() || 'user'
      return { success: true, cardId: handleSlug }
    },

    // ── discardChanges ───────────────────────────────────────────────────
    // Restores to the last saved config snapshot. Zero network requests.
    discardChanges: () => {
      const state = get()
      if (!state.savedConfig) return
      const restored = JSON.parse(JSON.stringify(state.savedConfig))
      set({
        config: restored,
        isDirty: false,
        saveError: null,
        _past: [],
        _future: [],
      })
      try { localStorage.setItem('currentBioLinkConfig', JSON.stringify(restored)) } catch { /* ignore */ }
    },
  }
})

// ── Computed selectors ───────────────────────────────────────────────────────

export const useCanUndo  = () => useDraftStore(s => s._past.length > 0)
export const useCanRedo  = () => useDraftStore(s => s._future.length > 0)
export const useConfig   = () => useDraftStore(s => s.config)
export const useIsLoading = () => useDraftStore(s => s.isLoading)
export const useIsDirty  = () => useDraftStore(s => s.isDirty)
