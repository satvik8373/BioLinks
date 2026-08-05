import * as fs from 'fs'
import * as path from 'path'

const THEMES_SPEC: Record<string, any> = {
  'arctic': { palette: 'palette-arctic', font: 'font-plus-jakarta', headingFont: 'font-plus-jakarta', layout: 'layout-centered', button: 'button-soft', card: 'card-elevated', avatar: 'avatar-circle', isPro: false },
  'coffee': { palette: 'palette-coffee', font: 'font-source-serif', headingFont: 'font-merriweather', layout: 'layout-centered', button: 'button-filled', card: 'card-elevated', avatar: 'avatar-circle', isPro: false },
  'mono': { palette: 'palette-mono', font: 'font-ibm-plex-mono', headingFont: 'font-space-mono', layout: 'layout-centered', button: 'button-outline', card: 'card-outline', avatar: 'avatar-square', isPro: false },
  'forest': { palette: 'palette-forest', font: 'font-open-sans', headingFont: 'font-raleway', layout: 'layout-centered', button: 'button-filled', card: 'card-elevated', avatar: 'avatar-circle', isPro: false },
  'midnight': { palette: 'palette-midnight', font: 'font-inter', headingFont: 'font-space-grotesk', layout: 'layout-centered', button: 'button-glass', card: 'card-glass', avatar: 'avatar-circle', isPro: true },
  'sunset': { palette: 'palette-sunset', font: 'font-plus-jakarta', headingFont: 'font-outfit', layout: 'layout-centered', button: 'button-filled', card: 'card-elevated', avatar: 'avatar-circle', isPro: true },
  'neon': { palette: 'palette-neon', font: 'font-rajdhani', headingFont: 'font-orbitron', layout: 'layout-centered', button: 'button-outline', card: 'card-outline', avatar: 'avatar-circle', isPro: true },
  'brutalist': { palette: 'palette-brutalist', font: 'font-space-grotesk', headingFont: 'font-archivo-black', layout: 'layout-centered', button: 'button-filled', card: 'card-outline', avatar: 'avatar-square', isPro: true },
  'y2k': { palette: 'palette-y2k', font: 'font-open-sans', headingFont: 'font-outfit', layout: 'layout-centered', button: 'button-filled', card: 'card-elevated', avatar: 'avatar-circle', isPro: true },
  'pastel': { palette: 'palette-pastel', font: 'font-nunito', headingFont: 'font-quicksand', layout: 'layout-centered', button: 'button-soft', card: 'card-elevated', avatar: 'avatar-circle', isPro: true },
  'neumorphic': { palette: 'palette-neumorphic', font: 'font-inter', headingFont: 'font-plus-jakarta', layout: 'layout-centered', button: 'button-clay', card: 'card-flat', avatar: 'avatar-circle', isPro: true },
  'cosmic': { palette: 'palette-cosmic', font: 'font-inter', headingFont: 'font-exo2', layout: 'layout-centered', button: 'button-glass', card: 'card-glass', avatar: 'avatar-circle', isPro: true },
  'luxury': { palette: 'palette-luxury', font: 'font-lora', headingFont: 'font-playfair', layout: 'layout-centered', button: 'button-filled', card: 'card-elevated', avatar: 'avatar-circle', isPro: true },
  'holographic': { palette: 'palette-holographic', font: 'font-inter', headingFont: 'font-syne', layout: 'layout-centered', button: 'button-glass', card: 'card-glass', avatar: 'avatar-circle', isPro: true },
  'retro': { palette: 'palette-retro', font: 'font-karla', headingFont: 'font-righteous', layout: 'layout-shape', button: 'button-filled', card: 'card-elevated', avatar: 'avatar-circle', isPro: true },
  'cyberpunk-city': { palette: 'palette-cyberpunk', font: 'font-rajdhani', headingFont: 'font-orbitron', layout: 'layout-hero', button: 'button-glass', card: 'card-glass', avatar: 'avatar-circle', isPro: true },
  'emerald-landscape': { palette: 'palette-emerald', font: 'font-open-sans', headingFont: 'font-raleway', layout: 'layout-banner', button: 'button-glass', card: 'card-glass', avatar: 'avatar-circle', isPro: true },
  'abstract-waves': { palette: 'palette-waves', font: 'font-inter', headingFont: 'font-plus-jakarta', layout: 'layout-shape', button: 'button-glass', card: 'card-glass', avatar: 'avatar-circle', isPro: true },
  'neon-skyline': { palette: 'palette-skyline', font: 'font-inter', headingFont: 'font-space-grotesk', layout: 'layout-hero', button: 'button-glass', card: 'card-glass', avatar: 'avatar-circle', isPro: true },
  'minimal-banner': { palette: 'palette-banner', font: 'font-plus-jakarta', headingFont: 'font-plus-jakarta', layout: 'layout-banner', button: 'button-filled', card: 'card-elevated', avatar: 'avatar-circle', isPro: false }
}

const PRESET_MAP: Record<string, string> = {
  'arctic': 'arctic-icy',
  'coffee': 'coffee-paper',
  'mono': 'mono-grid',
  'forest': 'forest-gradient',
  'midnight': 'midnight-nebula',
  'sunset': 'sunset-mesh',
  'neon': 'neon-glow',
  'brutalist': 'brutalist-pop',
  'y2k': 'y2k-chrome',
  'pastel': 'pastel-cloud',
  'neumorphic': 'neumorphic-clay',
  'cosmic': 'cosmic-galaxy',
  'luxury': 'luxury-gold',
  'holographic': 'holographic-iridescent',
  'retro': 'retro-sunset',
  'cyberpunk-city': 'cyberpunk-rain',
  'emerald-landscape': 'emerald-landscape',
  'abstract-waves': 'abstract-waves',
  'neon-skyline': 'neon-skyline',
  'minimal-banner': 'minimal-studio'
}

let idx = 1
for (const [id, spec] of Object.entries(THEMES_SPEC)) {
  const file = path.resolve(process.cwd(), 'themes', id, 'config.json')
  if (!fs.existsSync(file)) continue

  const old = JSON.parse(fs.readFileSync(file, 'utf-8'))
  const isGlass = id.includes('midnight') || id.includes('neon') || id.includes('cosmic') || id.includes('holographic') || id.includes('city') || id.includes('landscape') || id.includes('waves') || id.includes('skyline')
  const isClay = id.includes('neumorphic')
  const baseExtend = isGlass ? 'base-glass' : (isClay ? 'base-clay' : (id.includes('brutalist') ? 'base-brutalist' : (id.includes('luxury') ? 'base-luxury' : 'base-minimal')))

  const pureConfig = {
    version: '1.0.0',
    id: id,
    name: old.name || id,
    namespace: `theme-${id}`,
    order: idx++,
    extends: baseExtend,
    category: old.category || 'minimal',
    license: { type: spec.isPro ? 'pro' : 'free' },
    compatibility: { minVersion: '2.0.0' },
    preview: { thumbnail: `${id}.webp`, cover: `${id}-cover.webp` },
    supports: {
      imageBackground: id.includes('city') || id.includes('landscape') || id.includes('waves') || id.includes('skyline') || id.includes('banner'),
      videoBackground: true,
      animatedGradient: true,
      glass: isGlass,
      clay: isClay,
      particles: false,
      customCursor: false
    },
    visibility: {
      avatar: true,
      bio: true,
      social: true,
      footer: true,
      musicPlayer: false
    },
    meta: old.meta || { author: 'BioLinks', createdAt: '2026-08-04', updatedAt: '2026-08-04', tags: [id] },
    a11y: old.a11y || { contrast: 'AA', reducedMotion: true },
    background: { preset: PRESET_MAP[id] || id },
    palette: spec.palette,
    typography: {
      font: spec.font,
      headingFont: spec.headingFont
    },
    spacing: 'spacing-comfortable',
    layout: spec.layout,
    link: { style: 'card', icon: 'left', arrow: true },
    components: {
      button: spec.button,
      card: spec.card,
      avatar: spec.avatar,
      badge: 'badge-soft',
      social: 'social-rounded'
    }
  }

  fs.writeFileSync(file, JSON.stringify(pureConfig, null, 2), 'utf-8')
  console.log(`✅ Upgraded ${id} to Pure Registry Schema`)
}
