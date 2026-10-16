/**
 * Theme Compatibility Layer
 * 
 * This file provides backward compatibility for code that uses the old Theme type.
 * All themes are now stored as JSON in themes slash star slash config.json
 * Bundled presets are compiled once through the shared adapter in themes/index.ts.
 */

import { ThemeService } from './theme-engine/ThemeService'
import { Renderer } from './theme-engine/runtime/Renderer'
import { loadGoogleFonts } from './fonts'
import type { ThemeCategory } from './theme-engine/types'
import { MODULAR_THEMES } from '@/themes'

// ─── Legacy Theme Type (kept for backward compatibility) ───────────────────
export interface Theme {
  id: string
  name: string
  category: ThemeCategory
  colors: {
    background: string
    backgroundGradient?: { from: string; to: string; direction?: string }
    backgroundMesh?: string
    backgroundImage?: string
    backgroundVideo?: string
    backgroundIframe?: string
    backgroundType?: 'color' | 'gradient' | 'mesh' | 'image' | 'video' | 'iframe' | 'fill'
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
    boxShadow?: string
    style: 'solid' | 'clay' | 'outline' | 'soft' | 'glass' | 'hard-shadow' | 'fill' | 'wood' | 'carved' | 'raised' | 'leather' | 'retro-lcd' | 'button-retro-lcd' | string
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
  avatarStyle?: { shape: 'circle' | 'rounded' | 'square' | 'blob' | 'hexagon'; size: number; borderWidth: number }
  effects?: { glass?: boolean; clay?: boolean; noise?: boolean; glow?: boolean; blur?: number }
  specialty?: {
    styleId?: string
    accentFont?: string
    accentNote?: string
    autoUrlEmbeds?: boolean
    cardGlow?: string
    cardFx?: string
    borderGradient?: string
    // Template card tokens remain available for compatibility. The profile
    // content container uses padding and width; the page owns the wallpaper.
    cardBackground?: string
    cardBorderRadius?: string
    cardBoxShadow?: string
    cardMaxWidth?: string
    cardPadding?: string
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
  
  if (typeof rawTheme === 'string') {
    return getThemeById(rawTheme)
  }

  // Always re-merge from the current preset when an id is present.
  // This ensures structural properties (buttonStyle.style, specialty, fonts)
  // always reflect the latest theme definition, while user-customized
  // color/background fields stored in rawTheme.colors are preserved on top.
  if (rawTheme.id) {
    const preset = THEMES.find(theme => theme.id === rawTheme.id)
    const base: Theme = preset || {
      ...getDefaultTheme(), id: rawTheme.id, name: rawTheme.name || 'Custom',
      category: rawTheme.category || 'custom', specialty: rawTheme.specialty, isCurated: false,
      avatarStyle: rawTheme.avatarStyle, effects: rawTheme.effects, headerLayout: rawTheme.headerLayout,
    }

    // User-customizable color overrides — only background/wallpaper fields
    // and explicit color picks should survive a re-merge.
    // Structural palette tokens (buttonDefault, profileText etc.) always reset
    // to the current preset so old stale saves can't break the theme.
    const userColorOverrides = rawTheme.colors ? {
      // Wallpaper / background customizations set by the editor panels
      ...(rawTheme.colors.backgroundType     !== undefined && { backgroundType:     rawTheme.colors.backgroundType }),
      ...(rawTheme.colors.backgroundImage    !== undefined && { backgroundImage:    rawTheme.colors.backgroundImage }),
      ...(rawTheme.colors.backgroundVideo    !== undefined && { backgroundVideo:    rawTheme.colors.backgroundVideo }),
      ...(rawTheme.colors.backgroundIframe   !== undefined && { backgroundIframe:   rawTheme.colors.backgroundIframe }),
      ...(rawTheme.colors.backgroundMesh     !== undefined && { backgroundMesh:     rawTheme.colors.backgroundMesh }),
      ...(rawTheme.colors.backgroundGradient !== undefined && { backgroundGradient: rawTheme.colors.backgroundGradient }),
      ...(rawTheme.colors.backgroundOverlay  !== undefined && { backgroundOverlay:  rawTheme.colors.backgroundOverlay }),
      ...(rawTheme.colors.background         !== undefined && { background:         rawTheme.colors.background }),
      // User-overridden palette tokens (from Colors panel)
      ...(rawTheme.colors.buttonDefault && rawTheme.colors.buttonDefault !== base.colors.buttonDefault && { buttonDefault: rawTheme.colors.buttonDefault, buttonHover: rawTheme.colors.buttonDefault }),
      ...(rawTheme.colors.buttonText    && rawTheme.colors.buttonText    !== base.colors.buttonText    && { buttonText:    rawTheme.colors.buttonText }),
      ...(rawTheme.colors.profileText   && rawTheme.colors.profileText   !== base.colors.profileText   && { profileText:   rawTheme.colors.profileText }),
      ...(rawTheme.colors.profileBio    && rawTheme.colors.profileBio    !== base.colors.profileBio    && { profileBio:    rawTheme.colors.profileBio }),
      ...(rawTheme.colors.accent        && rawTheme.colors.accent        !== base.colors.accent        && { accent:        rawTheme.colors.accent }),
    } : {}

    // User-customizable buttonStyle overrides — only radius/border/shadow/animation
    // are user-editable. The variant style is always locked to the preset.
    const userButtonOverrides = rawTheme.buttonStyle ? {
      ...(rawTheme.buttonStyle.borderRadius !== undefined && { borderRadius: rawTheme.buttonStyle.borderRadius }),
      ...(rawTheme.buttonStyle.borderWidth  !== undefined && { borderWidth:  rawTheme.buttonStyle.borderWidth }),
      ...(rawTheme.buttonStyle.borderColor  !== undefined && { borderColor:  rawTheme.buttonStyle.borderColor }),
      ...(rawTheme.buttonStyle.shadow       !== undefined && { shadow:       rawTheme.buttonStyle.shadow }),
      ...(rawTheme.buttonStyle.shadowStyle  !== undefined && { shadowStyle:  rawTheme.buttonStyle.shadowStyle }),
      ...(rawTheme.buttonStyle.boxShadow    !== undefined && { boxShadow:    rawTheme.buttonStyle.boxShadow }),
      ...(rawTheme.buttonStyle.style        !== undefined && { style:        rawTheme.buttonStyle.style }),
      ...(rawTheme.buttonStyle.animation    !== undefined && { animation:    rawTheme.buttonStyle.animation }),
      ...(rawTheme.buttonStyle.enableAnimations !== undefined && { enableAnimations: rawTheme.buttonStyle.enableAnimations }),
    } : {}

    return {
      ...base,
      // specialty always from preset — contains cardBackground, cardBorderRadius etc.
      specialty: preset?.specialty || rawTheme.specialty,
      colors: {
        ...base.colors,
        ...userColorOverrides,
      },
      buttonStyle: {
        ...base.buttonStyle,
        ...userButtonOverrides,
        style: (() => {
          let s = rawTheme.buttonStyle?.style || base.buttonStyle.style
          if (typeof s === 'string' && s.startsWith('button-')) {
            s = s.substring(7)
          }
          return s as any
        })(),
      },
      // fonts can be user-overridden but fall back to preset
      fonts: { ...base.fonts, ...rawTheme.fonts },
    }
  }
  
  // No ID at all — legacy config with only colors directly.
  if (rawTheme.colors) {
    const base = getDefaultTheme()
    return {
      ...base,
      colors: { ...base.colors, ...rawTheme.colors },
      buttonStyle: rawTheme.buttonStyle || base.buttonStyle,
      fonts: rawTheme.fonts || base.fonts,
    }
  }

  return getDefaultTheme()
}

// ─── CSS Variable Applier ───────────────────────────────────────────────────
export function applyThemeToCSSVariables(theme?: Theme, targetElement?: HTMLElement | null): void {
  if (typeof window === 'undefined') return
  
  const safeTheme = theme || getDefaultTheme()
  if (!safeTheme) return

  const root = targetElement || document.documentElement
  const c = safeTheme.colors || DEFAULT_FALLBACK_THEME.colors
  const b = safeTheme.buttonStyle || DEFAULT_FALLBACK_THEME.buttonStyle
  const f = safeTheme.fonts || DEFAULT_FALLBACK_THEME.fonts

  // Colors & Rich Graphical Background Mesh / Image Support
  const bgGraphic = c.backgroundMesh || (c.backgroundGradient ? `linear-gradient(${c.backgroundGradient.direction || '135deg'}, ${c.backgroundGradient.from}, ${c.backgroundGradient.to})` : c.background)
  const raw = ThemeService.getConfig(safeTheme.id)
  if (raw) {
    const compiled = ThemeService.compile({ ...raw, buttonColor: c.buttonDefault, buttonText: c.buttonText, accent: c.accent }, {
      palette: { brand: c.accent, text: c.profileText, textMuted: c.profileBio, border: b.borderColor || c.accent },
      background: { type: c.backgroundType || 'color', value: bgGraphic, image: c.backgroundImage || '', overlay: c.backgroundOverlay || '' },
      typography: { font: `${f.body}, sans-serif`, headingFont: `${f.heading}, sans-serif` },
      components: { button: { variant: b.style, radius: b.borderRadius, shadow: b.shadow ? b.boxShadow || 'shadow-soft' : 'shadow-none', borderWidth: b.borderWidth } },
    })
    if (compiled) Renderer.render(compiled, root)
  } else {
    loadGoogleFonts([f.body, f.heading, safeTheme.specialty?.accentFont || ''])
  }
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

  // Theme shapes retain the radius values selected by the author or editor.
  const minimalBtnRadius = b.borderRadius
  const minimalCardRadius = parseFloat(safeTheme.specialty?.cardBorderRadius || '') || b.borderRadius

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
    : b.boxShadow ? b.boxShadow
    : b.shadowStyle === 'hard' ? shadowHard
    : b.shadowStyle === 'strong' ? shadowStrong
    : safeTheme.id?.includes('neon') || safeTheme.id?.includes('galaxy') || safeTheme.id?.includes('cosmic') ? shadowGlow
    : shadowSoft

  root.style.setProperty('--shadow-button', btnShadowVal)
  root.style.setProperty('--shadow-button-clay', '6px 6px 12px rgba(163,177,198,0.55), -6px -6px 12px rgba(255,255,255,0.5)')
  root.style.setProperty('--shadow-button-soft', shadowSoft)
  root.style.setProperty('--shadow-button-glow', shadowGlow)

  // ── Card Shape ────────────────────────────────────────────────────────
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
