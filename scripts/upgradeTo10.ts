import * as fs from 'fs'
import * as path from 'path'

const THEME_MAP: Record<string, { extends: string; preset: string; font: string; headingFont: string; license: string }> = {
  'arctic': { extends: 'base-minimal', preset: 'arctic-icy', font: 'plus-jakarta', headingFont: 'plus-jakarta', license: 'free' },
  'coffee': { extends: 'base-minimal', preset: 'coffee-paper', font: 'source-serif', headingFont: 'merriweather', license: 'free' },
  'mono': { extends: 'base-minimal', preset: 'mono-grid', font: 'ibm-plex-mono', headingFont: 'space-mono', license: 'free' },
  'forest': { extends: 'base-gradient', preset: 'forest-gradient', font: 'open-sans', headingFont: 'raleway', license: 'free' },
  'midnight': { extends: 'base-glass', preset: 'midnight-nebula', font: 'inter', headingFont: 'space-grotesk', license: 'pro' },
  'sunset': { extends: 'base-gradient', preset: 'sunset-mesh', font: 'plus-jakarta', headingFont: 'outfit', license: 'pro' },
  'neon': { extends: 'base-glass', preset: 'neon-glow', font: 'rajdhani', headingFont: 'orbitron', license: 'pro' },
  'brutalist': { extends: 'base-brutalist', preset: 'brutalist-pop', font: 'space-grotesk', headingFont: 'archivo-black', license: 'pro' },
  'y2k': { extends: 'base-gradient', preset: 'y2k-chrome', font: 'open-sans', headingFont: 'outfit', license: 'pro' },
  'pastel': { extends: 'base-minimal', preset: 'pastel-cloud', font: 'nunito', headingFont: 'quicksand', license: 'pro' },
  'neumorphic': { extends: 'base-clay', preset: 'neumorphic-clay', font: 'inter', headingFont: 'plus-jakarta', license: 'pro' },
  'cosmic': { extends: 'base-glass', preset: 'cosmic-galaxy', font: 'inter', headingFont: 'exo2', license: 'pro' },
  'luxury': { extends: 'base-luxury', preset: 'luxury-gold', font: 'lora', headingFont: 'playfair', license: 'pro' },
  'holographic': { extends: 'base-glass', preset: 'holographic-iridescent', font: 'inter', headingFont: 'syne', license: 'pro' },
  'retro': { extends: 'base-gradient', preset: 'retro-sunset', font: 'karla', headingFont: 'righteous', license: 'pro' },
  'cyberpunk-city': { extends: 'base-glass', preset: 'cyberpunk-rain', font: 'rajdhani', headingFont: 'orbitron', license: 'pro' },
  'emerald-landscape': { extends: 'base-glass', preset: 'emerald-landscape', font: 'open-sans', headingFont: 'raleway', license: 'pro' },
  'abstract-waves': { extends: 'base-glass', preset: 'abstract-waves', font: 'inter', headingFont: 'plus-jakarta', license: 'pro' },
  'neon-skyline': { extends: 'base-glass', preset: 'neon-skyline', font: 'inter', headingFont: 'space-grotesk', license: 'pro' },
  'minimal-banner': { extends: 'base-minimal', preset: 'minimal-studio', font: 'plus-jakarta', headingFont: 'plus-jakarta', license: 'free' },
}

function upgradeTheme(id: string) {
  const meta = THEME_MAP[id] || { extends: 'base-minimal', preset: id, font: 'inter', headingFont: 'inter', license: 'free' }
  const file = path.resolve(process.cwd(), 'themes', id, 'config.json')
  if (!fs.existsSync(file)) return

  const old = JSON.parse(fs.readFileSync(file, 'utf-8'))

  const cleanConfig = {
    version: '1.0.0',
    id: old.id || id,
    name: old.name || id,
    extends: meta.extends,
    category: old.category || 'minimal',
    license: { type: meta.license },
    preview: { thumbnail: `${id}.webp`, cover: `${id}-cover.webp` },
    supports: { videoBackground: true, glass: meta.extends === 'base-glass', clay: meta.extends === 'base-clay', animatedGradient: true, particles: false },
    meta: old.meta || { author: 'BioLinks', createdAt: '2026-08-04', updatedAt: '2026-08-04', tags: [id] },
    a11y: old.a11y || { contrast: 'AA', reducedMotion: true },
    background: { preset: meta.preset },
    palette: {
      surface: old.colors?.surface || old.palette?.surface || '#FFFFFF',
      text: old.colors?.text || old.palette?.text || '#000000',
      textSecondary: old.colors?.textSecondary || old.palette?.textSecondary || '#666666',
      primary: old.colors?.primary || old.palette?.primary || '#000000',
      primaryHover: old.colors?.primaryHover || old.palette?.primaryHover || '#1A1A1A',
      border: old.colors?.border || old.palette?.border || 'rgba(0,0,0,0.1)',
      accent: old.colors?.accent || old.palette?.accent || '#000000'
    },
    typography: {
      font: meta.font,
      headingFont: meta.headingFont
    },
    spacing: 'comfortable',
    link: { style: 'card', icon: 'left', arrow: true },
    components: {
      button: {
        variant: old.components?.button?.variant || old.button?.variant || 'filled',
        radius: 'md',
        shadow: old.components?.button?.shadow || 'shadow-soft',
        border: old.components?.button?.border || {
          width: old.button?.borderWidth || 0,
          color: old.colors?.border || 'transparent',
          style: 'solid'
        },
        states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
      },
      card: {
        variant: old.components?.card?.variant || old.card?.variant || 'elevated',
        radius: 'md',
        shadow: old.components?.card?.shadow || 'shadow-soft'
      },
      avatar: {
        variant: old.components?.avatar?.variant || old.avatar?.variant || 'circle',
        size: 96,
        border: { width: 2, color: old.colors?.border || '#FFFFFF', style: 'solid' }
      },
      badge: { variant: 'soft' },
      social: { variant: 'rounded', style: 'filled' }
    },
    layout: old.layout || { style: 'centered', maxWidth: 680, headerLayout: 'classic' }
  }

  fs.writeFileSync(file, JSON.stringify(cleanConfig, null, 2), 'utf-8')
  console.log(`✅ Upgraded ${id} to 10/10 Schema`)
}

Object.keys(THEME_MAP).forEach(upgradeTheme)
