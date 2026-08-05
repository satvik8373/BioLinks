/**
 * Theme Compatibility Layer
 * 
 * This file provides backward compatibility for code that uses the old Theme type.
 * All themes are now stored as JSON in themes slash star slash config.json
 * All functions delegate to themeEngine.ts
 */

import { getAvailableThemes as getJSONThemes, loadThemeConfig, applyThemeToDOM } from './themeEngine'
import type { ThemeConfig } from './themeEngine'
import { ThemeService } from './theme-engine/ThemeService'
import { MODULAR_THEMES } from '@/themes'
import { extendTheme } from './baseThemes'
import { resolveBackground } from './backgrounds'
import { resolveFontFamily } from './fonts'
import { resolvePalette } from './theme-engine/palettes'
import { resolveLayout } from './theme-engine/layouts'
import { resolveButtonVariant } from './theme-engine/button-variants'
import { resolveRadius } from './theme-engine/radius'
import { resolveShadow } from './theme-engine/shadows'

// ─── Legacy Theme Type (kept for backward compatibility) ───────────────────
export interface Theme {
  id: string
  name: string
  category: 'minimal' | 'dark' | 'gradient' | 'mesh' | 'image' | 'vibrant'
  colors: {
    background: string
    backgroundGradient?: { from: string; to: string; direction?: string }
    backgroundMesh?: string
    backgroundImage?: string
    backgroundVideo?: string
    backgroundIframe?: string
    backgroundType?: 'color' | 'gradient' | 'mesh' | 'image' | 'video' | 'iframe'
    backgroundOverlay?: string
    buttonDefault: string
    buttonHover: string
    buttonText: string
    profileText: string
    profileBio: string
    accent: string
  }
  buttonStyle: {
    borderRadius: number
    borderWidth: number
    borderColor?: string
    shadow: boolean
    shadowStyle?: 'none' | 'soft' | 'strong' | 'hard'
    style: 'solid' | 'clay' | 'outline' | 'soft' | 'glass' | 'hard-shadow' | 'fill'
    animation?: 'none' | 'bounce' | 'pulse' | 'wobble' | 'slide'
    enableAnimations?: boolean
  }
  fonts: { heading: string; body: string }
  backgroundFilter?: string
  noiseOpacity?: number
  preview: string
  isPremium?: boolean
  isCurated?: boolean
  author?: string
  headerLayout?: 'classic' | 'hero' | 'banner' | 'shape'
}

// ─── Convert JSON ThemeConfig to Legacy Theme format ───────────────────────
function jsonToLegacyTheme(rawConfig: any): Theme {
  const config = extendTheme(rawConfig)
  const palette = resolvePalette(config.palette || config.colors)
  const layout = resolveLayout(config.layout)
  const btnSpec = resolveButtonVariant(config.components?.button || config.button)
  const resolvedBg = resolveBackground(config.background || palette.surface)
  const bgStr = resolvedBg.value
  const bgImage = resolvedBg.image
  const bgOverlay = resolvedBg.overlay
  const isMeshOrGradient = bgStr.includes('gradient') || bgStr.includes('radial')

  const btnRadius = resolveRadius(btnSpec.radius, 8)
  const btnShadow = resolveShadow(btnSpec.shadow)

  return {
    id: config.id,
    name: config.name,
    category: config.category as any,
    headerLayout: layout.headerLayout,
    colors: {
      background: bgStr,
      backgroundImage: bgImage,
      backgroundOverlay: bgOverlay,
      backgroundMesh: isMeshOrGradient ? bgStr : undefined,
      buttonDefault: palette.brand,
      buttonHover: palette.brand,
      buttonText: palette.text,
      profileText: palette.text,
      profileBio: palette.textMuted,
      accent: palette.brand,
    },
    buttonStyle: {
      borderRadius: btnRadius,
      borderWidth: btnSpec.borderWidth,
      borderColor: palette.border,
      shadow: btnShadow !== 'none',
      shadowStyle: btnShadow.includes('4px') ? 'hard' : 'soft',
      style: btnSpec.variant as any,
    },
    fonts: {
      heading: resolveFontFamily(typeof config.typography === 'object' ? config.typography?.headingFont : config.typography).split(',')[0].trim(),
      body: resolveFontFamily(typeof config.typography === 'object' ? config.typography?.font : config.typography).split(',')[0].trim(),
    },
    preview: bgStr,
    isPremium: config.license?.type === 'pro' || config.isPro,
  }
}

// ─── Utility Functions (URL helpers) ────────────────────────────────────────
export function getEmbedIframeUrl(url: string): string {
  if (!url) return ''
  const trimmed = url.trim()

  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?playsinline=1`
  }

  const ytChannelMatch = trimmed.match(/youtube\.com\/channel\/(UC[\w-]{22})/)
  if (ytChannelMatch && ytChannelMatch[1]) {
    const uploadsPlaylistId = 'UU' + ytChannelMatch[1].substring(2)
    return `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}&playsinline=1`
  }

  const ytUserMatch = trimmed.match(/youtube\.com\/(?:c\/|user\/|@)([\w-]+)/)
  if (ytUserMatch && ytUserMatch[1]) {
    return `https://www.youtube.com/embed?listType=user_uploads&list=${ytUserMatch[1]}&playsinline=1`
  }

  const spotifyMatch = trimmed.match(/open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/)
  if (spotifyMatch && spotifyMatch[1] && spotifyMatch[2]) {
    return `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}?utm_source=generator`
  }

  if (trimmed.includes('soundcloud.com') && !trimmed.includes('w.soundcloud.com/player')) {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(trimmed)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:.*#|.*\/)?([0-9]+)/)
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?byline=0&title=0`
  }

  const driveMatch = trimmed.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)([a-zA-Z0-9_-]+)/)
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
  }

  return trimmed
}

export function parseGoogleDriveUrl(url: string): { fileId: string | null; directUrl: string; previewUrl: string } {
  if (!url) return { fileId: null, directUrl: '', previewUrl: '' }
  const trimmed = url.trim()

  if (!trimmed.includes('drive.google.com') && !trimmed.includes('lh3.googleusercontent.com')) {
    return { fileId: null, directUrl: trimmed, previewUrl: trimmed }
  }

  const match = trimmed.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/)
  if (match && match[1]) {
    const fileId = match[1]
    const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`
    const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(thumbnailUrl)}`
    return {
      fileId,
      directUrl: proxiedUrl,
      previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    }
  }

  return { fileId: null, directUrl: trimmed, previewUrl: trimmed }
}

// ─── Embedded Themes (Production-Ready) ────────────────────────────────────

export const BUILTIN_THEMES: Theme[] = MODULAR_THEMES
export const THEMES: Theme[] = BUILTIN_THEMES

export const DEFAULT_FALLBACK_THEME: Theme = {
  id: 'pop-brutalist',
  name: 'Pop Brutalist',
  category: 'minimal',
  colors: {
    background: 'radial-gradient(circle at 90% 10%, rgba(255, 107, 157, 0.4) 0%, transparent 40%), linear-gradient(135deg, #FFE66D 0%, #FFD166 100%)',
    backgroundMesh: 'radial-gradient(circle at 90% 10%, rgba(255, 107, 157, 0.4) 0%, transparent 40%), linear-gradient(135deg, #FFE66D 0%, #FFD166 100%)',
    buttonDefault: '#FF6B9D',
    buttonHover: '#FF5088',
    buttonText: '#000000',
    profileText: '#000000',
    profileBio: '#1A1A1A',
    accent: '#FF6B9D',
  },
  buttonStyle: {
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#000000',
    shadow: true,
    shadowStyle: 'hard',
    style: 'hard-shadow',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  preview: '#FFE66D',
  isPremium: false,
}

// ─── Theme Query Functions ──────────────────────────────────────────────────
export function getThemesByCategory(category: Theme['category']): Theme[] {
  return THEMES.filter(t => t.category === category)
}

export function getDefaultTheme(): Theme {
  return THEMES[0] || DEFAULT_FALLBACK_THEME
}

export function getThemeById(id: string): Theme {
  const theme = THEMES.find(t => t.id === id)
  return theme || getDefaultTheme()
}

// ─── Theme Normalization ────────────────────────────────────────────────────
export function formatAndNormalizeTheme(rawTheme?: any): Theme {
  if (!rawTheme) return getDefaultTheme()
  
  // If it's already a valid theme, return as-is
  if (rawTheme.id && rawTheme.colors && rawTheme.buttonStyle && rawTheme.fonts) {
    return rawTheme as Theme
  }
  
  // Try to find by ID
  if (rawTheme.id) {
    return getThemeById(rawTheme.id)
  }
  
  return getDefaultTheme()
}

// ─── CSS Variable Applier ───────────────────────────────────────────────────
export function applyThemeToCSSVariables(theme?: Theme, targetElement?: HTMLElement | null): void {
  if (typeof window === 'undefined') return
  
  const safeTheme = theme || getDefaultTheme()
  if (!safeTheme) return

  if (safeTheme.id && !targetElement) {
    try {
      ThemeService.apply(safeTheme as any)
    } catch {
      // Fallback
    }
  }

  const root = targetElement || document.documentElement
  const c = safeTheme.colors || DEFAULT_FALLBACK_THEME.colors
  const b = safeTheme.buttonStyle || DEFAULT_FALLBACK_THEME.buttonStyle
  const f = safeTheme.fonts || DEFAULT_FALLBACK_THEME.fonts

  // Colors & Rich Graphical Background Mesh / Image Support
  const bgGraphic = c.backgroundMesh || (c.backgroundGradient ? `linear-gradient(${c.backgroundGradient.direction || '135deg'}, ${c.backgroundGradient.from}, ${c.backgroundGradient.to})` : c.background)
  root.style.setProperty('--color-background', bgGraphic)
  root.style.setProperty('--background-mesh', c.backgroundMesh || 'none')
  root.style.setProperty('--background-image', c.backgroundImage ? `url(${c.backgroundImage})` : 'none')
  root.style.setProperty('--background-overlay', c.backgroundOverlay || 'transparent')
  root.style.setProperty('--color-button', c.buttonDefault)
  root.style.setProperty('--color-button-hover', c.buttonHover)
  root.style.setProperty('--color-button-text', c.buttonText)
  root.style.setProperty('--color-profile-text', c.profileText)
  root.style.setProperty('--color-profile-bio', c.profileBio)
  root.style.setProperty('--color-accent', c.accent)

  // ── Button & Card Shape (Minimal curvature — max 8px for buttons, max 6px for cards) ──
  const minimalBtnRadius = b.borderRadius === 0 ? 0 : Math.min(b.borderRadius, 8)
  const minimalCardRadius = b.borderRadius === 0 ? 0 : Math.min(b.borderRadius, 6)

  root.style.setProperty('--radius-button', `${minimalBtnRadius}px`)
  root.style.setProperty('--button-radius', `${minimalBtnRadius}px`)
  root.style.setProperty('--border-button-width', `${b.borderWidth}px`)
  root.style.setProperty('--border-button-color', b.borderColor || c.accent)

  // Glass-specific transparent button background
  const isGlass = b.style === 'glass'
  const isOutline = b.style === 'outline'
  const isHardShadow = b.style === 'hard-shadow'
  const isSoft = b.style === 'soft'
  const isDarkTheme = safeTheme.category === 'dark' || c.background.includes('#0') || c.background.includes('0A0') || c.background.includes('0F1') || c.background.includes('120')

  if (isGlass) {
    root.style.setProperty('--color-button-glass', isDarkTheme ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)')
    root.style.setProperty('--border-button', `1px solid ${b.borderColor || (isDarkTheme ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.12)')}`)
  } else if (isOutline) {
    root.style.setProperty('--color-button-glass', 'transparent')
    root.style.setProperty('--border-button', `${b.borderWidth || 2}px solid ${b.borderColor || c.buttonDefault}`)
  } else if (isHardShadow) {
    root.style.setProperty('--color-button-glass', c.buttonDefault)
    root.style.setProperty('--border-button', `${b.borderWidth || 2}px solid ${b.borderColor || c.buttonDefault}`)
  } else {
    root.style.setProperty('--color-button-glass', isDarkTheme ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)')
    root.style.setProperty('--border-button', 'none')
  }

  // ── Shadows (full per-theme map) ───────────────────────────────────────────
  const shadowSoft = '0 2px 12px rgba(0,0,0,0.09), 0 1px 3px rgba(0,0,0,0.06)'
  const shadowStrong = '0 6px 20px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.10)'
  const shadowGlow = `0 0 18px ${c.accent}55, 0 2px 8px rgba(0,0,0,0.20)`
  const shadowHard = isHardShadow ? `4px 4px 0px ${b.borderColor || c.buttonDefault}` : '4px 4px 0px rgba(0,0,0,1)'
  const shadowNone = 'none'

  const btnShadowVal = !b.shadow ? shadowNone
    : b.shadowStyle === 'hard' ? shadowHard
    : b.shadowStyle === 'strong' ? shadowStrong
    : safeTheme.id?.includes('neon') || safeTheme.id?.includes('galaxy') || safeTheme.id?.includes('cosmic') ? shadowGlow
    : shadowSoft

  root.style.setProperty('--shadow-button', btnShadowVal)
  root.style.setProperty('--shadow-button-clay', '6px 6px 12px rgba(163,177,198,0.55), -6px -6px 12px rgba(255,255,255,0.5)')
  root.style.setProperty('--shadow-button-soft', shadowSoft)
  root.style.setProperty('--shadow-button-glow', shadowGlow)

  // ── Card Shape (Minimal curvature — max 6px) ─────────────────────────────
  root.style.setProperty('--radius-card', `${minimalCardRadius}px`)
  root.style.setProperty('--radius-video-card', `${minimalCardRadius}px`)
  root.style.setProperty('--card-radius', `${minimalCardRadius}px`)

  // ── Typography ─────────────────────────────────────────────────────────────
  root.style.setProperty('--font-family', `${f.body || 'Inter'}, system-ui, sans-serif`)
  root.style.setProperty('--font-family-heading', `${f.heading || 'Inter'}, system-ui, sans-serif`)

  // ── Video Cards ────────────────────────────────────────────────────────────
  const defaultBg = isGlass
    ? 'rgba(255,255,255,0.08)'
    : isDarkTheme ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.88)'
  const videoCardBg = c.buttonDefault.startsWith('linear-gradient')
    ? defaultBg
    : c.buttonDefault.startsWith('#') ? `${c.buttonDefault}22` : defaultBg

  root.style.setProperty('--color-video-card-bg', videoCardBg)
  root.style.setProperty('--color-video-card-border', 'transparent')
  root.style.setProperty('--color-video-card-text', c.profileText)
  root.style.setProperty('--color-video-card-play-button', c.accent)
  root.style.setProperty('--dimension-video-card-height', '180px')
  root.style.setProperty('--dimension-button-height', '50px')
  root.style.setProperty('--dimension-button-min-height', '50px')

  // ── Theme-level glass/blur body effects ────────────────────────────────────
  root.style.setProperty('--theme-card-blur', isGlass ? '12px' : '0px')
  root.style.setProperty('--theme-card-glass-bg', isGlass
    ? (isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.72)')
    : (isDarkTheme ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.90)')
  )
  root.style.setProperty('--theme-card-border', isGlass
    ? (isDarkTheme ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(0,0,0,0.08)')
    : `1px solid ${b.borderColor || 'transparent'}`
  )
}

// ─── Theme Metadata for Selectors ───────────────────────────────────────────
export interface ThemeMeta {
  id: string
  name: string
  category: Theme['category']
  preview: string
  isPremium: boolean
}

export function getAvailableThemes(): ThemeMeta[] {
  return THEMES.map(t => ({
    id: t.id,
    name: t.name,
    category: t.category,
    preview: t.preview,
    isPremium: t.isPremium ?? false,
  }))
}
