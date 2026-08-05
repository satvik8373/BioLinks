/**
 * Theme Engine Plugins Framework
 * 
 * Provides extensible plugin interfaces for optional theme features:
 * - Custom Cursor Plugin
 * - Particles Canvas Plugin
 * - Music Player Widget Plugin
 */

export interface ThemePlugin {
  id: string
  name: string
  enabled: boolean
  mount?: (container: HTMLElement, options?: any) => void
  unmount?: (container: HTMLElement) => void
}

export const CURSOR_PLUGIN: ThemePlugin = {
  id: 'plugin-cursor',
  name: 'Custom Cursor Effect',
  enabled: false
}

export const PARTICLES_PLUGIN: ThemePlugin = {
  id: 'plugin-particles',
  name: 'Interactive Particle Canvas',
  enabled: false
}

export const MUSIC_PLAYER_PLUGIN: ThemePlugin = {
  id: 'plugin-music-player',
  name: 'Embedded Floating Music Player',
  enabled: false
}

export const THEME_PLUGINS: Record<string, ThemePlugin> = {
  'plugin-cursor': CURSOR_PLUGIN,
  'plugin-particles': PARTICLES_PLUGIN,
  'plugin-music-player': MUSIC_PLAYER_PLUGIN
}
