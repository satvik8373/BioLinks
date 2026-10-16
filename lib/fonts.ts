/**
 * Global Font References Registry
 * 
 * Centralized registry for web fonts, heading fonts, preloading, and fallback stacks.
 */

export interface FontDefinition {
  id: string
  name: string
  family: string
  category: 'sans-serif' | 'serif' | 'monospace' | 'display'
  weights?: number[]
}

export const FONT_TOKENS: Record<string, FontDefinition> = {
  'caveat': { id: 'caveat', name: 'Caveat', family: 'Caveat, cursive', category: 'display', weights: [400] },
  'font-outfit': {
    id: 'font-outfit',
    name: 'Outfit',
    family: 'Outfit, -apple-system, system-ui, sans-serif',
    category: 'sans-serif'
  },
  'font-syne': {
    id: 'font-syne',
    name: 'Syne Display',
    family: 'Syne, -apple-system, system-ui, sans-serif',
    category: 'display'
  },
  'font-manrope': {
    id: 'font-manrope',
    name: 'Manrope',
    family: 'Manrope, -apple-system, sans-serif',
    category: 'sans-serif'
  },
  'font-playfair': {
    id: 'font-playfair',
    name: 'Playfair Display',
    family: 'Playfair Display, Georgia, serif',
    category: 'serif'
  },
  'font-fraunces': {
    id: 'font-fraunces',
    name: 'Fraunces',
    family: 'Fraunces, Georgia, serif',
    category: 'serif'
  },
  'fraunces': {
    id: 'fraunces',
    name: 'Fraunces',
    family: 'Fraunces, Georgia, serif',
    category: 'serif'
  },
  'plus-jakarta': {
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    family: 'Plus Jakarta Sans, -apple-system, system-ui, sans-serif',
    category: 'sans-serif'
  },
  'inter': {
    id: 'inter',
    name: 'Inter',
    family: 'Inter, -apple-system, system-ui, sans-serif',
    category: 'sans-serif'
  },
  'space-grotesk': {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    family: 'Space Grotesk, sans-serif',
    category: 'sans-serif'
  },
  'space-mono': {
    id: 'space-mono',
    name: 'Space Mono',
    family: 'Space Mono, monospace',
    category: 'monospace'
  },
  'ibm-plex-mono': {
    id: 'ibm-plex-mono',
    name: 'IBM Plex Mono',
    family: 'IBM Plex Mono, monospace',
    category: 'monospace'
  },
  'orbitron': {
    id: 'orbitron',
    name: 'Orbitron',
    family: 'Orbitron, sans-serif',
    category: 'sans-serif'
  },
  'rajdhani': {
    id: 'rajdhani',
    name: 'Rajdhani',
    family: 'Rajdhani, sans-serif',
    category: 'sans-serif'
  },
  'playfair': {
    id: 'playfair',
    name: 'Playfair Display',
    family: 'Playfair Display, serif',
    category: 'serif'
  },
  'lora': {
    id: 'lora',
    name: 'Lora',
    family: 'Lora, serif',
    category: 'serif'
  },
  'merriweather': {
    id: 'merriweather',
    name: 'Merriweather',
    family: 'Merriweather, Georgia, serif',
    category: 'serif'
  },
  'source-serif': {
    id: 'source-serif',
    name: 'Source Serif Pro',
    family: 'Source Serif Pro, Georgia, serif',
    category: 'serif'
  },
  'outfit': {
    id: 'outfit',
    name: 'Outfit',
    family: 'Outfit, sans-serif',
    category: 'sans-serif'
  },
  'nunito': {
    id: 'nunito',
    name: 'Nunito',
    family: 'Nunito, sans-serif',
    category: 'sans-serif'
  },
  'quicksand': {
    id: 'quicksand',
    name: 'Quicksand',
    family: 'Quicksand, sans-serif',
    category: 'sans-serif'
  },
  'righteous': {
    id: 'righteous',
    name: 'Righteous',
    family: 'Righteous, sans-serif',
    category: 'sans-serif'
  },
  'karla': {
    id: 'karla',
    name: 'Karla',
    family: 'Karla, sans-serif',
    category: 'sans-serif'
  },
  'syne': {
    id: 'syne',
    name: 'Syne',
    family: 'Syne, sans-serif',
    category: 'sans-serif'
  },
  'raleway': {
    id: 'raleway',
    name: 'Raleway',
    family: 'Raleway, sans-serif',
    category: 'sans-serif'
  },
  'open-sans': {
    id: 'open-sans',
    name: 'Open Sans',
    family: 'Open Sans, sans-serif',
    category: 'sans-serif'
  },
  'archivo-black': {
    id: 'archivo-black',
    name: 'Archivo Black',
    family: 'Archivo Black, sans-serif',
    category: 'sans-serif'
  },
  'exo2': {
    id: 'exo2',
    name: 'Exo 2',
    family: 'Exo 2, sans-serif',
    category: 'sans-serif'
  },
  'font-silkscreen': {
    id: 'font-silkscreen',
    name: 'Silkscreen',
    family: 'Silkscreen, monospace',
    category: 'monospace'
  },
  'silkscreen': {
    id: 'silkscreen',
    name: 'Silkscreen',
    family: 'Silkscreen, monospace',
    category: 'monospace'
  }
}

export function resolveFontFamily(fontKey?: string, fallback: string = 'Inter, sans-serif'): string {
  if (!fontKey) return fallback
  if (FONT_TOKENS[fontKey]) return FONT_TOKENS[fontKey].family
  const normalizedKey = fontKey.replace(/^font-/, '')
  if (FONT_TOKENS[normalizedKey]) return FONT_TOKENS[normalizedKey].family
  const namedFont = Object.values(FONT_TOKENS).find(font => font.name.toLowerCase() === fontKey.toLowerCase() || font.family.split(',')[0].toLowerCase() === fontKey.toLowerCase())
  if (namedFont) return namedFont.family
  if (fontKey.includes(',') || fontKey.includes('sans-serif') || fontKey.includes('serif')) return fontKey
  return fallback
}

export function loadGoogleFonts(fontNames: string[]): void {
  if (typeof document === 'undefined') return

  fontNames.forEach(rawName => {
    if (!rawName) return
    const fontName = rawName.split(',')[0].replace(/['"]/g, '').trim()
    if (!fontName || ['system-ui', '-apple-system', 'sans-serif', 'serif', 'monospace'].includes(fontName.toLowerCase())) return

    const linkId = `google-font-${fontName.toLowerCase().replace(/\s+/g, '-')}`
    if (document.getElementById(linkId)) return

    const link = document.createElement('link')
    link.id = linkId
    link.rel = 'stylesheet'
    const encoded = fontName.replace(/\s+/g, '+')
    const weights = Object.values(FONT_TOKENS).find(font => font.name === fontName)?.weights || [400, 500, 600, 700, 800]
    link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@${weights.join(';')}&display=swap`
    document.head.appendChild(link)
  })
}
