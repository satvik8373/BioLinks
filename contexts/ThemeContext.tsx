'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  Theme,
  getThemeById,
  getDefaultTheme,
  formatAndNormalizeTheme,
  applyThemeToCSSVariables,
} from '@/lib/themes'

interface ThemeContextValue {
  /** The currently active saved theme object */
  theme: Theme
  /** The transient draft theme object for editor previews */
  draftTheme: Theme
  /** Switch to a theme by ID (from THEMES array) */
  setThemeById: (id: string) => void
  /** Apply a fully-formed or partial theme object directly */
  applyTheme: (raw: any) => void
  /** Apply transient draft theme updates without mutating saved active theme storage */
  applyDraftTheme: (raw: any) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

// ── Local-storage key ────────────────────────────────────────────────────
const LS_KEY = 'activeThemeId'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getDefaultTheme)
  const [draftTheme, setDraftTheme] = useState<Theme>(getDefaultTheme)

  // On first mount: restore saved theme and apply CSS variables
  useEffect(() => {
    const savedId = typeof window !== 'undefined'
      ? (localStorage.getItem(LS_KEY) || '')
      : ''
    const initial = savedId ? getThemeById(savedId) : getDefaultTheme()
    setTheme(initial)
    setDraftTheme(initial)
    applyThemeToCSSVariables(initial)
  }, [])

  const setThemeById = useCallback((id: string) => {
    const next = getThemeById(id)
    setTheme(next)
    setDraftTheme(next)
    applyThemeToCSSVariables(next)
    if (typeof window !== 'undefined') localStorage.setItem(LS_KEY, id)
  }, [])

  const applyTheme = useCallback((raw: any) => {
    const next = formatAndNormalizeTheme(raw)
    setTheme(next)
    setDraftTheme(next)
    applyThemeToCSSVariables(next)
    if (next.id && typeof window !== 'undefined') localStorage.setItem(LS_KEY, next.id)
  }, [])

  const applyDraftTheme = useCallback((raw: any) => {
    const next = formatAndNormalizeTheme(raw)
    setDraftTheme(next)
    applyThemeToCSSVariables(next)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, draftTheme, setThemeById, applyTheme, applyDraftTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
