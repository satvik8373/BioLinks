/**
 * Semantic Palette Registry (10/10 Pure Architecture)
 * 
 * Maps semantic color IDs to full color palettes.
 * Features brand, surface, surfaceAlt, text, textMuted, border, success, warning, danger.
 */

export interface SemanticPalette {
  id: string
  name: string
  brand: string
  surface: string
  surfaceAlt: string
  text: string
  textMuted: string
  border: string
  success: string
  warning: string
  danger: string
}

export const PALETTE_REGISTRY: Record<string, SemanticPalette> = {
  'palette-arctic': {
    id: 'palette-arctic',
    name: 'Arctic Clean Light',
    brand: '#0284C7',
    surface: '#FFFFFF',
    surfaceAlt: '#F8FAFC',
    text: '#0F172A',
    textMuted: '#64748B',
    border: 'rgba(226, 232, 240, 0.9)',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444'
  },
  'palette-coffee': {
    id: 'palette-coffee',
    name: 'Coffee Warm Paper',
    brand: '#D2691E',
    surface: '#FFF9F0',
    surfaceAlt: '#F5EBE0',
    text: '#3E2723',
    textMuted: '#8D6E63',
    border: 'rgba(210, 105, 30, 0.3)',
    success: '#2E7D32',
    warning: '#E65100',
    danger: '#C62828'
  },
  'palette-mono': {
    id: 'palette-mono',
    name: 'Monochrome Cyber',
    brand: '#FFFFFF',
    surface: '#0A0A0A',
    surfaceAlt: '#1A1A1A',
    text: '#FFFFFF',
    textMuted: '#CCCCCC',
    border: '#FFFFFF',
    success: '#FFFFFF',
    warning: '#FFFFFF',
    danger: '#FFFFFF'
  },
  'palette-forest': {
    id: 'palette-forest',
    name: 'Emerald Forest',
    brand: '#52B788',
    surface: '#1B4332',
    surfaceAlt: 'rgba(255, 255, 255, 0.1)',
    text: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.85)',
    border: '#95D5B2',
    success: '#52B788',
    warning: '#FFD166',
    danger: '#FF6B6B'
  },
  'palette-midnight': {
    id: 'palette-midnight',
    name: 'Midnight Glass Nebula',
    brand: '#818CF8',
    surface: '#0F172A',
    surfaceAlt: 'rgba(129, 140, 248, 0.12)',
    text: '#F1F5F9',
    textMuted: 'rgba(241, 245, 249, 0.85)',
    border: 'rgba(129, 140, 248, 0.45)',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171'
  },
  'palette-sunset': {
    id: 'palette-sunset',
    name: 'Sunset Twilight',
    brand: '#FF7B00',
    surface: '#240046',
    surfaceAlt: 'rgba(255, 255, 255, 0.15)',
    text: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.85)',
    border: '#FF9E00',
    success: '#38B000',
    warning: '#FFAA00',
    danger: '#FF0054'
  },
  'palette-neon': {
    id: 'palette-neon',
    name: 'Cyberpunk Neon',
    brand: '#00F0FF',
    surface: '#0A0E27',
    surfaceAlt: '#000000',
    text: '#FFFFFF',
    textMuted: '#00F0FF',
    border: '#00F0FF',
    success: '#00FF66',
    warning: '#FFBE0B',
    danger: '#FF006E'
  },
  'palette-brutalist': {
    id: 'palette-brutalist',
    name: 'Brutalist Pop',
    brand: '#FF6B9D',
    surface: '#FFE66D',
    surfaceAlt: '#FFE66D',
    text: '#000000',
    textMuted: '#1A1A1A',
    border: '#000000',
    success: '#00F5D4',
    warning: '#FFB703',
    danger: '#FF0054'
  },
  'palette-y2k': {
    id: 'palette-y2k',
    name: 'Y2K Holographic Chrome',
    brand: '#5B46E0',
    surface: '#FFFFFF',
    surfaceAlt: '#EAEAEA',
    text: '#1A0033',
    textMuted: '#4A1875',
    border: 'rgba(255, 255, 255, 0.6)',
    success: '#00E676',
    warning: '#FFAB00',
    danger: '#FF1744'
  },
  'palette-pastel': {
    id: 'palette-pastel',
    name: 'Kawaii Pastel Cloud',
    brand: '#FFB3D9',
    surface: '#FFF0F5',
    surfaceAlt: '#E8F4FF',
    text: '#4A1942',
    textMuted: '#8B5A8E',
    border: '#C996CC',
    success: '#A8E6CF',
    warning: '#FFD3B6',
    danger: '#FF8B94'
  },
  'palette-neumorphic': {
    id: 'palette-neumorphic',
    name: 'Neumorphic Clay',
    brand: '#5A67D8',
    surface: '#E0E5EC',
    surfaceAlt: '#D1D9E6',
    text: '#2D3748',
    textMuted: '#718096',
    border: '#CBD5E0',
    success: '#48BB78',
    warning: '#ED8936',
    danger: '#E53E3E'
  },
  'palette-cosmic': {
    id: 'palette-cosmic',
    name: 'Cosmic Galaxy',
    brand: '#A78BFA',
    surface: '#0B0C1A',
    surfaceAlt: 'rgba(139, 92, 246, 0.15)',
    text: '#FFFFFF',
    textMuted: 'rgba(233, 213, 255, 0.85)',
    border: 'rgba(167, 139, 250, 0.4)',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EC4899'
  },
  'palette-luxury': {
    id: 'palette-luxury',
    name: 'Gold Obsidian Luxury',
    brand: '#D4AF37',
    surface: '#120C0B',
    surfaceAlt: '#241410',
    text: '#F3E5AB',
    textMuted: 'rgba(243, 229, 171, 0.85)',
    border: '#D4AF37',
    success: '#D4AF37',
    warning: '#F3E5AB',
    danger: '#C59B27'
  },
  'palette-holographic': {
    id: 'palette-holographic',
    name: 'Iridescent Holographic',
    brand: '#FF00FF',
    surface: 'rgba(255, 255, 255, 0.3)',
    surfaceAlt: 'rgba(255, 255, 255, 0.45)',
    text: '#1A1A1A',
    textMuted: '#4A4A4A',
    border: 'rgba(255, 0, 255, 0.35)',
    success: '#00FFFF',
    warning: '#FFFF00',
    danger: '#FF0066'
  },
  'palette-retro': {
    id: 'palette-retro',
    name: '70s Retro Amber',
    brand: '#F4B860',
    surface: '#F4E9CD',
    surfaceAlt: '#E88D67',
    text: '#2C1810',
    textMuted: '#6B4423',
    border: '#2C1810',
    success: '#4E9F3D',
    warning: '#F4B860',
    danger: '#D64045'
  },
  'palette-cyberpunk': {
    id: 'palette-cyberpunk',
    name: 'Tokyo Rain Cityscape',
    brand: '#00F0FF',
    surface: 'rgba(10, 14, 39, 0.85)',
    surfaceAlt: 'rgba(10, 14, 39, 0.95)',
    text: '#FFFFFF',
    textMuted: '#00F0FF',
    border: '#00F0FF',
    success: '#00FF66',
    warning: '#FFBE0B',
    danger: '#FF006E'
  },
  'palette-emerald': {
    id: 'palette-emerald',
    name: 'Emerald Mountain Mist',
    brand: '#52B788',
    surface: 'rgba(12, 35, 24, 0.65)',
    surfaceAlt: 'rgba(255, 255, 255, 0.15)',
    text: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.85)',
    border: 'rgba(255, 255, 255, 0.4)',
    success: '#52B788',
    warning: '#FFD166',
    danger: '#E63946'
  },
  'palette-waves': {
    id: 'palette-waves',
    name: '3D Liquid Gradient',
    brand: '#EC4899',
    surface: 'rgba(15, 23, 42, 0.45)',
    surfaceAlt: 'rgba(255, 255, 255, 0.2)',
    text: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.9)',
    border: 'rgba(255, 255, 255, 0.5)',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444'
  },
  'palette-skyline': {
    id: 'palette-skyline',
    name: 'Futuristic Night Skyline',
    brand: '#38BDF8',
    surface: 'rgba(8, 10, 24, 0.8)',
    surfaceAlt: 'rgba(8, 10, 24, 0.9)',
    text: '#FFFFFF',
    textMuted: '#38BDF8',
    border: '#38BDF8',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171'
  },
  'palette-banner': {
    id: 'palette-banner',
    name: 'Architectural Studio Banner',
    brand: '#0F172A',
    surface: '#FFFFFF',
    surfaceAlt: '#F8FAFC',
    text: '#0F172A',
    textMuted: '#475569',
    border: '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444'
  },
  'palette-clay': {
    id: 'palette-clay',
    name: 'Soft Clay Neumorphic',
    brand: '#2f6fed',
    surface: '#f4f5f7',
    surfaceAlt: '#eef0f3',
    text: '#161821',
    textMuted: '#6b7280',
    border: 'rgba(163,168,178,0.3)',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444'
  }
}

export function resolvePalette(paletteInput: any): SemanticPalette {
  if (typeof paletteInput === 'string' && PALETTE_REGISTRY[paletteInput]) {
    return PALETTE_REGISTRY[paletteInput]
  }

  if (typeof paletteInput === 'object' && paletteInput !== null) {
    const fallback = PALETTE_REGISTRY['palette-arctic']
    return {
      id: paletteInput.id || 'custom-palette',
      name: paletteInput.name || 'Custom Palette',
      brand: paletteInput.brand || paletteInput.primary || fallback.brand,
      surface: paletteInput.surface || fallback.surface,
      surfaceAlt: paletteInput.surfaceAlt || paletteInput.surface || fallback.surfaceAlt,
      text: paletteInput.text || fallback.text,
      textMuted: paletteInput.textMuted || paletteInput.textSecondary || fallback.textMuted,
      border: paletteInput.border || fallback.border,
      success: paletteInput.success || fallback.success,
      warning: paletteInput.warning || fallback.warning,
      danger: paletteInput.danger || fallback.danger
    }
  }

  return PALETTE_REGISTRY['palette-arctic']
}
