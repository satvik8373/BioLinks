/**
 * Public Facade API Delegate -> ThemeService
 * 
 * Re-exports ThemeService methods for backward compatibility across the codebase.
 */

import { ThemeService } from './theme-engine/ThemeService'

export type { ThemeConfig, ThemeMetadata } from './theme-engine/ThemeService'
import type { ThemeMetadata } from './theme-engine/types'
import type { ResolvedTheme } from './theme-engine/runtime/ResolvedTheme'

export async function loadThemeConfig(themeId: string): Promise<ResolvedTheme | null> {
  return ThemeService.load(themeId)
}

export function getAvailableThemes(): ThemeMetadata[] {
  return ThemeService.getAvailableThemes()
}

export function getThemeMetadata(themeId: string): ThemeMetadata | undefined {
  return getAvailableThemes().find(t => t.id === themeId)
}

export function applyThemeToDOM(rawConfig: any, userOverride?: any): void {
  ThemeService.apply(rawConfig, userOverride)
}

export async function activateTheme(themeId: string, userOverride?: any): Promise<boolean> {
  const config = await loadThemeConfig(themeId)
  if (!config) return false
  ThemeService.apply(config, userOverride)
  return true
}

export function getActiveThemeId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('activeThemeId')
}

export { ThemeService }
