/**
 * Base Themes Registry (10/10 Enterprise SaaS Architecture)
 * 
 * Provides foundational design token presets that themes extend (`"extends": "base-gradient"`).
 * Child themes override ONLY what changes, keeping files small, clean, and 100% maintainable.
 */

export const BASE_THEMES: Record<string, any> = {
  'base-minimal': {
    version: '1.0.0',
    extends: 'base-minimal',
    category: 'minimal',
    license: { type: 'free' },
    preview: { thumbnail: 'minimal.webp', cover: 'minimal-cover.webp' },
    supports: { videoBackground: true, glass: false, clay: false, animatedGradient: false, particles: false },
    a11y: { contrast: 'AA', reducedMotion: true },
    effects: { glass: false, clay: false, noise: false, glow: false, blur: 0 },
    animation: { hover: 'lift', page: 'fade', duration: 180, easing: 'ease-out' },
    spacing: 'comfortable',
    icon: { style: 'filled', size: 20 },
    typography: {
      font: 'inter',
      headingFont: 'inter',
      fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
      headingFamily: 'Inter, -apple-system, system-ui, sans-serif',
      headingWeight: 700,
      bodyWeight: 400,
      buttonWeight: 600
    },
    background: { type: 'mesh', preset: 'arctic-icy' },
    palette: {
      surface: '#FFFFFF',
      text: '#0F172A',
      textSecondary: '#64748B',
      primary: '#FFFFFF',
      primaryHover: '#F1F5F9',
      border: '#E2E8F0',
      accent: '#0284C7'
    },
    link: { style: 'card', icon: 'left', arrow: true },
    components: {
      button: {
        variant: 'filled',
        size: 'large',
        iconPosition: 'left',
        radius: 'md',
        shadow: 'shadow-soft',
        border: { width: 1, color: '#E2E8F0', style: 'solid' },
        states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
      },
      card: { variant: 'elevated', radius: 'md', shadow: 'shadow-soft' },
      avatar: { variant: 'circle', size: 96, border: { width: 2, color: '#E2E8F0', style: 'solid' } },
      badge: { variant: 'soft' },
      social: { variant: 'rounded', style: 'filled' }
    },
    layout: { style: 'centered', maxWidth: 680, headerLayout: 'classic' }
  },

  'base-glass': {
    version: '1.0.0',
    extends: 'base-glass',
    category: 'glass',
    license: { type: 'pro' },
    preview: { thumbnail: 'glass.webp', cover: 'glass-cover.webp' },
    supports: { videoBackground: true, glass: true, clay: false, animatedGradient: true, particles: false },
    a11y: { contrast: 'AA', reducedMotion: true },
    effects: { glass: true, clay: false, noise: false, glow: true, blur: 14 },
    animation: { hover: 'glow', page: 'fade', duration: 200, easing: 'ease-out' },
    spacing: 'comfortable',
    icon: { style: 'outlined', size: 20 },
    typography: {
      font: 'inter',
      headingFont: 'space-grotesk',
      fontFamily: 'Inter, sans-serif',
      headingFamily: 'Space Grotesk, sans-serif',
      headingWeight: 700,
      bodyWeight: 400,
      buttonWeight: 600
    },
    background: { type: 'mesh', preset: 'midnight-nebula' },
    palette: {
      surface: 'rgba(129, 140, 248, 0.12)',
      text: '#F1F5F9',
      textSecondary: 'rgba(241, 245, 249, 0.85)',
      primary: 'rgba(129, 140, 248, 0.22)',
      primaryHover: 'rgba(129, 140, 248, 0.35)',
      border: 'rgba(129, 140, 248, 0.45)',
      accent: '#818CF8'
    },
    link: { style: 'card', icon: 'left', arrow: true },
    components: {
      button: {
        variant: 'glass',
        size: 'large',
        iconPosition: 'left',
        radius: 'md',
        shadow: 'shadow-glass',
        border: { width: 1, color: 'rgba(255, 255, 255, 0.3)', style: 'solid' },
        states: { hover: 'glow', active: 'scale', focus: 'ring', disabled: 'opacity' }
      },
      card: { variant: 'glass', radius: 'md', shadow: 'shadow-glass' },
      avatar: { variant: 'circle', size: 96, border: { width: 2, color: 'rgba(255, 255, 255, 0.5)', style: 'solid' } },
      badge: { variant: 'glass' },
      social: { variant: 'circle', style: 'glass' }
    },
    layout: { style: 'centered', maxWidth: 680, headerLayout: 'classic' }
  },

  'base-gradient': {
    version: '1.0.0',
    extends: 'base-gradient',
    category: 'gradient',
    license: { type: 'free' },
    preview: { thumbnail: 'gradient.webp', cover: 'gradient-cover.webp' },
    supports: { videoBackground: true, glass: false, clay: false, animatedGradient: true, particles: false },
    a11y: { contrast: 'AA', reducedMotion: true },
    effects: { glass: false, clay: false, noise: false, glow: false, blur: 0 },
    animation: { hover: 'lift', page: 'fade', duration: 180, easing: 'ease-out' },
    spacing: 'comfortable',
    icon: { style: 'filled', size: 20 },
    typography: {
      font: 'open-sans',
      headingFont: 'raleway',
      fontFamily: 'Open Sans, sans-serif',
      headingFamily: 'Raleway, sans-serif',
      headingWeight: 700,
      bodyWeight: 400,
      buttonWeight: 600
    },
    background: { type: 'mesh', preset: 'forest-gradient' },
    palette: {
      surface: 'rgba(255, 255, 255, 0.1)',
      text: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.85)',
      primary: '#52B788',
      primaryHover: '#40916C',
      border: '#95D5B2',
      accent: '#95D5B2'
    },
    link: { style: 'card', icon: 'left', arrow: true },
    components: {
      button: {
        variant: 'filled',
        size: 'large',
        iconPosition: 'left',
        radius: 'md',
        shadow: 'shadow-soft',
        border: { width: 0, color: 'transparent', style: 'solid' },
        states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
      },
      card: { variant: 'elevated', radius: 'md', shadow: 'shadow-soft' },
      avatar: { variant: 'circle', size: 96, border: { width: 2, color: 'rgba(255, 255, 255, 0.4)', style: 'solid' } },
      badge: { variant: 'filled' },
      social: { variant: 'rounded', style: 'filled' }
    },
    layout: { style: 'centered', maxWidth: 680, headerLayout: 'classic' }
  },

  'base-luxury': {
    version: '1.0.0',
    extends: 'base-luxury',
    category: 'luxury',
    license: { type: 'pro' },
    preview: { thumbnail: 'luxury.webp', cover: 'luxury-cover.webp' },
    supports: { videoBackground: true, glass: false, clay: false, animatedGradient: true, particles: false },
    a11y: { contrast: 'AAA', reducedMotion: true },
    effects: { glass: false, clay: false, noise: false, glow: true, blur: 4 },
    animation: { hover: 'lift-scale', page: 'fade', duration: 220, easing: 'ease-out' },
    spacing: 'comfortable',
    icon: { style: 'filled', size: 20 },
    typography: {
      font: 'lora',
      headingFont: 'playfair',
      fontFamily: 'Lora, serif',
      headingFamily: 'Playfair Display, serif',
      headingWeight: 700,
      bodyWeight: 400,
      buttonWeight: 600
    },
    background: { type: 'mesh', preset: 'luxury-gold' },
    palette: {
      surface: '#120C0B',
      text: '#F3E5AB',
      textSecondary: 'rgba(243, 229, 171, 0.85)',
      primary: 'linear-gradient(135deg, #D4AF37 0%, #F3E5AB 50%, #C59B27 100%)',
      primaryHover: 'linear-gradient(135deg, #E5C158 0%, #FFF8DC 50%, #D4AF37 100%)',
      border: '#D4AF37',
      accent: '#D4AF37'
    },
    link: { style: 'card', icon: 'left', arrow: true },
    components: {
      button: {
        variant: 'filled',
        size: 'large',
        iconPosition: 'left',
        radius: 'md',
        shadow: 'shadow-xl',
        border: { width: 1, color: '#D4AF37', style: 'solid' },
        states: { hover: 'lift-scale', active: 'scale', focus: 'ring', disabled: 'opacity' }
      },
      card: { variant: 'elevated', radius: 'md', shadow: 'shadow-xl' },
      avatar: { variant: 'circle', size: 96, border: { width: 2, color: '#D4AF37', style: 'solid' } },
      badge: { variant: 'outline' },
      social: { variant: 'circle', style: 'outline' }
    },
    layout: { style: 'centered', maxWidth: 680, headerLayout: 'classic' }
  },

  'base-brutalist': {
    version: '1.0.0',
    extends: 'base-brutalist',
    category: 'custom',
    license: { type: 'pro' },
    preview: { thumbnail: 'brutalist.webp', cover: 'brutalist-cover.webp' },
    supports: { videoBackground: true, glass: false, clay: false, animatedGradient: false, particles: false },
    a11y: { contrast: 'AAA', reducedMotion: false },
    effects: { glass: false, clay: false, noise: false, glow: false, blur: 0 },
    animation: { hover: 'none', page: 'fade', duration: 100, easing: 'linear' },
    spacing: 'comfortable',
    icon: { style: 'filled', size: 20 },
    typography: {
      font: 'space-grotesk',
      headingFont: 'archivo-black',
      fontFamily: 'Space Grotesk, sans-serif',
      headingFamily: 'Archivo Black, sans-serif',
      headingWeight: 900,
      bodyWeight: 500,
      buttonWeight: 700
    },
    background: { type: 'mesh', preset: 'brutalist-pop' },
    palette: {
      surface: '#FFE66D',
      text: '#000000',
      textSecondary: '#1A1A1A',
      primary: '#FF6B9D',
      primaryHover: '#FF5A8D',
      border: '#000000',
      accent: '#00B4D8'
    },
    link: { style: 'card', icon: 'left', arrow: true },
    components: {
      button: {
        variant: 'filled',
        size: 'large',
        iconPosition: 'left',
        radius: 'none',
        shadow: 'shadow-hard',
        border: { width: 4, color: '#000000', style: 'solid' },
        states: { hover: 'none', active: 'scale', focus: 'ring', disabled: 'opacity' }
      },
      card: { variant: 'outline', radius: 'none', shadow: 'shadow-hard' },
      avatar: { variant: 'square', size: 96, border: { width: 4, color: '#000000', style: 'solid' } },
      badge: { variant: 'outline' },
      social: { variant: 'square', style: 'filled' }
    },
    layout: { style: 'centered', maxWidth: 680, headerLayout: 'classic' }
  },

  'base-clay': {
    version: '1.0.0',
    extends: 'base-clay',
    category: 'clay',
    license: { type: 'free' },
    preview: { thumbnail: 'clay.webp', cover: 'clay-cover.webp' },
    supports: { videoBackground: false, glass: false, clay: true, animatedGradient: false, particles: false },
    a11y: { contrast: 'AA', reducedMotion: true },
    effects: { glass: false, clay: true, noise: false, glow: false, blur: 0 },
    animation: { hover: 'lift', page: 'fade', duration: 180, easing: 'ease-out' },
    spacing: 'comfortable',
    icon: { style: 'filled', size: 20 },
    typography: {
      font: 'inter',
      headingFont: 'inter',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      headingFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      headingWeight: 800,
      bodyWeight: 500,
      buttonWeight: 700
    },
    background: 'neumorphic-clay',
    palette: 'palette-clay',
    link: { style: 'button', icon: 'left', arrow: true },
    components: {
      button: {
        variant: 'clay',
        size: 'large',
        iconPosition: 'left',
        radius: 'radius-xl',
        shadow: 'shadow-pill-clay',
        border: { width: 0, color: 'transparent', style: 'solid' },
        states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
      },
      card: { variant: 'clay', radius: 'radius-xl', shadow: 'shadow-card-clay' },
      avatar: { variant: 'circle', size: 150, border: { width: 6, color: '#ffffff', style: 'solid' } },
      badge: { variant: 'soft' },
      social: { variant: 'rounded', style: 'clay' }
    },
    layout: { style: 'centered', maxWidth: 390, headerLayout: 'classic' }
  },

  'base-skeuo': {
    version: '1.0.0',
    extends: 'base-skeuo',
    category: 'custom',
    license: { type: 'free' },
    preview: { thumbnail: 'skeuo-wood.webp', cover: 'skeuo-wood-cover.webp' },
    supports: { videoBackground: false, glass: false, clay: false, animatedGradient: false, particles: false },
    a11y: { contrast: 'AA', reducedMotion: true },
    effects: { glass: false, clay: false, noise: false, glow: false, blur: 0 },
    animation: { hover: 'lift', page: 'fade', duration: 180, easing: 'ease-out' },
    spacing: 'comfortable',
    icon: { style: 'filled', size: 20 },
    typography: {
      font: 'inter',
      headingFont: 'playfair',
      fontFamily: 'Inter, sans-serif',
      headingFamily: 'Playfair Display, serif',
      headingWeight: 700,
      bodyWeight: 400,
      buttonWeight: 700
    },
    background: { type: 'image', value: '/wallpapers/light-wood.webp', image: '/wallpapers/light-wood.webp' },
    palette: {
      surface: '#FFF8F0',
      text: '#2B1F16',
      textMuted: '#6F5746',
      brand: '#8B5A2B',
      border: '#D6C2A6',
      surfaceAlt: '#F2E9DC',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444'
    },
    link: { style: 'button', icon: 'left', arrow: true },
    components: {
      button: {
        variant: 'wood',
        size: 'large',
        iconPosition: 'left',
        radius: 'md',
        shadow: 'shadow-soft',
        border: { width: 1, color: '#D6C2A6', style: 'solid' },
        states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
      },
      card: { variant: 'elevated', radius: 'lg', shadow: 'shadow-soft' },
      avatar: { variant: 'circle', size: 120, border: { width: 3, color: '#8B5A2B', style: 'solid' } },
      badge: { variant: 'soft' },
      social: { variant: 'rounded', style: 'filled' }
    },
    layout: { style: 'centered', maxWidth: 680, headerLayout: 'classic' }
  }
}

// Historical IDs used by the existing JSON themes.
BASE_THEMES['base-light'] = BASE_THEMES['base-minimal']
BASE_THEMES['base-dark'] = {
  ...BASE_THEMES['base-minimal'],
  category: 'dark',
  palette: 'palette-midnight',
  background: '#0F172A',
}

export function extendTheme(childTheme: any): any {
  if (!childTheme) return childTheme
  const baseKey = childTheme.extends || 'base-minimal'
  const base = BASE_THEMES[baseKey] || BASE_THEMES['base-minimal']

  const childPalette = childTheme.palette || childTheme.colors || {}

  return {
    version: childTheme.version || base.version || '1.0.0',
    id: childTheme.id,
    name: childTheme.name,
    namespace: childTheme.namespace || `theme-${childTheme.id}`,
    order: childTheme.order ?? 1,
    compatibility: { minVersion: '2.0.0', ...base.compatibility, ...childTheme.compatibility },
    extends: baseKey,
    category: childTheme.category || base.category,
    license: { type: childTheme.isPro ? 'pro' : (childTheme.license?.type || base.license?.type || 'free') },
    preview: { thumbnail: `${childTheme.id}.webp`, cover: `${childTheme.id}-cover.webp`, ...base.preview, ...childTheme.preview },
    supports: {
      imageBackground: true,
      videoBackground: true,
      animatedGradient: true,
      glass: baseKey === 'base-glass',
      particles: false,
      customCursor: false,
      ...base.supports,
      ...childTheme.supports
    },
    visibility: {
      avatar: true,
      bio: true,
      social: true,
      footer: true,
      musicPlayer: false,
      ...base.visibility,
      ...childTheme.visibility
    },
    meta: {
      author: childTheme.meta?.author || 'BioLinks',
      createdAt: childTheme.meta?.createdAt || '2026-08-04',
      updatedAt: childTheme.meta?.updatedAt || '2026-08-04',
      tags: childTheme.meta?.tags || [childTheme.id, childTheme.category || 'theme']
    },
    a11y: {
      contrast: childTheme.a11y?.contrast || base.a11y?.contrast || 'AA',
      reducedMotion: childTheme.a11y?.reducedMotion ?? base.a11y?.reducedMotion ?? true
    },
    palette: childTheme.palette || childTheme.colors || base.palette,
    colors: {
      ...base.palette,
      ...childPalette,
      background: childTheme.background || childPalette.background || base.background
    },
    background: childTheme.background || base.background,
    effects: { ...base.effects, ...childTheme.effects },
    animation: { ...base.animation, ...childTheme.animation },
    typography: childTheme.typography || base.typography,
    spacing: childTheme.spacing || base.spacing,
    icon: { ...base.icon, ...childTheme.icon },
    link: { style: 'card', icon: 'left', arrow: true, ...base.link, ...childTheme.link },
    components: {
      button: childTheme.components?.button || childTheme.button || base.components?.button || 'button-filled',
      card: childTheme.components?.card || childTheme.card || base.components?.card || 'card-elevated',
      avatar: childTheme.components?.avatar || childTheme.avatar || base.components?.avatar || 'avatar-circle',
      badge: childTheme.components?.badge || childTheme.badge || base.components?.badge || 'badge-soft',
      social: childTheme.components?.social || childTheme.social || base.components?.social || 'social-rounded',
      iconContainer: childTheme.components?.iconContainer || base.components?.iconContainer || 'circle'
    },
    layout: typeof childTheme.layout === 'object'
      ? { ...base.layout, ...childTheme.layout }
      : { ...base.layout, width: childTheme.layoutWidth || base.layout?.width || 'normal' },
    specialty: {
      ...(base.specialty || {}),
      ...(childTheme.specialty || {}),
      decorations: childTheme.specialty?.decorations || childTheme.decorations || base.specialty?.decorations || (baseKey === 'base-glass' ? ['glass-spheres', 'mesh'] : [])
    }
  }
}
