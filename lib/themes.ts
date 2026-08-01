export interface Theme {
  id: string
  name: string
  category: 'minimal' | 'dark' | 'gradient' | 'mesh' | 'image' | 'vibrant'
  colors: {
    background: string
    // Simple linear gradient
    backgroundGradient?: { from: string; to: string; direction?: string }
    // Mesh gradient — multiple radial stops layered via CSS
    backgroundMesh?: string          // full CSS background value (multi-radial)
    // Unsplash / CDN image background
    backgroundImage?: string         // URL
    backgroundOverlay?: string       // rgba overlay on top of image
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
  // Optional CSS filter applied to the whole page background
  backgroundFilter?: string
  // Grain/noise overlay opacity (0–1)
  noiseOpacity?: number
  preview: string
  isPremium?: boolean
}

// ─── Mesh gradient helper ─────────────────────────────────────────────────
// Builds a CSS background string from multiple radial-gradient stops
function mesh(...stops: string[]): string {
  return stops.join(', ')
}

export const THEMES: Theme[] = [

  // ── 1. CUSTOM ─────────────────────────────────────────────────────────────
  {
    id: 'custom',
    name: 'Custom',
    category: 'minimal',
    colors: {
      background: '#FFFFFF',
      buttonDefault: '#F3F4F6',
      buttonHover: '#E5E7EB',
      buttonText: '#111827',
      profileText: '#111827',
      profileBio: '#6B7280',
      accent: '#6366F1',
    },
    buttonStyle: { borderRadius: 8, borderWidth: 0, shadow: false, style: 'solid' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#F9FAFB',
  },

  // ── 2. AIR — pure white minimal ───────────────────────────────────────────
  {
    id: 'air',
    name: 'Air',
    category: 'minimal',
    colors: {
      background: '#FFFFFF',
      buttonDefault: '#F3F4F6',
      buttonHover: '#E5E7EB',
      buttonText: '#111827',
      profileText: '#111827',
      profileBio: '#6B7280',
      accent: '#111827',
    },
    buttonStyle: { borderRadius: 12, borderWidth: 0, shadow: true, style: 'soft' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#FFFFFF',
  },

  // ── 3. MINERAL — warm off-white with grain ────────────────────────────────
  {
    id: 'mineral',
    name: 'Mineral',
    category: 'minimal',
    colors: {
      background: '#F5F0E8',
      buttonDefault: 'rgba(0,0,0,0.07)',
      buttonHover: 'rgba(0,0,0,0.12)',
      buttonText: '#2C2416',
      profileText: '#2C2416',
      profileBio: '#7A6E5F',
      accent: '#8B7355',
    },
    buttonStyle: { borderRadius: 14, borderWidth: 0, shadow: false, style: 'soft' },
    fonts: { heading: 'Inter', body: 'Inter' },
    noiseOpacity: 0.04,
    preview: '#F5F0E8',
  },

  // ── 4. HAVEN — warm sand with grain ──────────────────────────────────────
  {
    id: 'haven',
    name: 'Haven',
    category: 'minimal',
    colors: {
      background: '#D4C5A9',
      buttonDefault: 'rgba(0,0,0,0.1)',
      buttonHover: 'rgba(0,0,0,0.16)',
      buttonText: '#2C2416',
      profileText: '#2C2416',
      profileBio: '#5C4F3A',
      accent: '#8B6914',
    },
    buttonStyle: { borderRadius: 12, borderWidth: 0, shadow: false, style: 'soft' },
    fonts: { heading: 'Inter', body: 'Inter' },
    noiseOpacity: 0.05,
    preview: '#D4C5A9',
  },

  // ── 5. LAKE — pure black ──────────────────────────────────────────────────
  {
    id: 'lake',
    name: 'Lake',
    category: 'dark',
    colors: {
      background: '#000000',
      buttonDefault: 'rgba(255,255,255,0.1)',
      buttonHover: 'rgba(255,255,255,0.16)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.65)',
      accent: '#FFFFFF',
    },
    buttonStyle: { borderRadius: 12, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#000000',
  },

  // ── 6. ASTRID — near-black with outline buttons ───────────────────────────
  {
    id: 'astrid',
    name: 'Astrid',
    category: 'dark',
    colors: {
      background: '#0D0D0D',
      buttonDefault: 'rgba(255,255,255,0.06)',
      buttonHover: 'rgba(255,255,255,0.1)',
      buttonText: '#E5E7EB',
      profileText: '#F9FAFB',
      profileBio: 'rgba(255,255,255,0.55)',
      accent: '#F9FAFB',
    },
    buttonStyle: { borderRadius: 10, borderWidth: 1, shadow: false, style: 'outline' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#0D0D0D',
  },

  // ── 7. ENCORE — dark zinc with emerald accent ─────────────────────────────
  {
    id: 'encore',
    name: 'Encore',
    category: 'dark',
    colors: {
      background: '#18181B',
      buttonDefault: 'rgba(255,255,255,0.05)',
      buttonHover: 'rgba(255,255,255,0.09)',
      buttonText: '#F4F4F5',
      profileText: '#FAFAFA',
      profileBio: 'rgba(255,255,255,0.55)',
      accent: '#10B981',
    },
    buttonStyle: { borderRadius: 8, borderWidth: 1, shadow: false, style: 'outline' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#18181B',
  },

  // ── 8. GRID — brutalist yellow ────────────────────────────────────────────
  {
    id: 'grid',
    name: 'Grid',
    category: 'vibrant',
    colors: {
      background: '#FDE047',
      buttonDefault: '#FFFFFF',
      buttonHover: '#F9FAFB',
      buttonText: '#000000',
      profileText: '#000000',
      profileBio: '#1F2937',
      accent: '#000000',
    },
    buttonStyle: { borderRadius: 0, borderWidth: 3, shadow: true, style: 'hard-shadow' },
    fonts: { heading: 'Space Grotesk', body: 'Space Grotesk' },
    preview: '#FDE047',
  },

  // ── 9. BREEZE — soft pink ─────────────────────────────────────────────────
  {
    id: 'breeze',
    name: 'Breeze',
    category: 'vibrant',
    colors: {
      background: '#FDF2F8',
      backgroundGradient: { from: '#FDF2F8', to: '#FCE7F3', direction: '180deg' },
      buttonDefault: '#FBCFE8',
      buttonHover: '#F9A8D4',
      buttonText: '#831843',
      profileText: '#831843',
      profileBio: '#9F1239',
      accent: '#EC4899',
    },
    buttonStyle: { borderRadius: 20, borderWidth: 0, shadow: false, style: 'soft' },
    fonts: { heading: 'Poppins', body: 'Poppins' },
    preview: '#FDF2F8',
  },

  // ── 10. SWEAT — blue→pink linear (fitness) ────────────────────────────────
  {
    id: 'sweat',
    name: 'Sweat',
    category: 'gradient',
    colors: {
      background: '#3B82F6',
      backgroundGradient: { from: '#3B82F6', to: '#EC4899', direction: '180deg' },
      buttonDefault: 'rgba(255,255,255,0.2)',
      buttonHover: 'rgba(255,255,255,0.3)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.9)',
      accent: '#FFFFFF',
    },
    buttonStyle: { borderRadius: 12, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#3B82F6',
    isPremium: true,
  },

  // ── 11. BLOCKS — purple→pink ──────────────────────────────────────────────
  {
    id: 'blocks',
    name: 'Blocks',
    category: 'gradient',
    colors: {
      background: '#7C3AED',
      backgroundGradient: { from: '#7C3AED', to: '#EC4899', direction: '135deg' },
      buttonDefault: 'rgba(255,255,255,0.2)',
      buttonHover: 'rgba(255,255,255,0.3)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.85)',
      accent: '#EC4899',
    },
    buttonStyle: { borderRadius: 8, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#7C3AED',
    isPremium: true,
  },

  // ── 12. AGATE — dark green→lime ───────────────────────────────────────────
  {
    id: 'agate',
    name: 'Agate',
    category: 'gradient',
    colors: {
      background: '#052E16',
      backgroundGradient: { from: '#052E16', to: '#65A30D', direction: '160deg' },
      buttonDefault: 'rgba(255,255,255,0.15)',
      buttonHover: 'rgba(255,255,255,0.25)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.8)',
      accent: '#84CC16',
    },
    buttonStyle: { borderRadius: 16, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#052E16',
    isPremium: true,
  },

  // ── 13. GROOVE — orange→violet ────────────────────────────────────────────
  {
    id: 'groove',
    name: 'Groove',
    category: 'gradient',
    colors: {
      background: '#F97316',
      backgroundGradient: { from: '#F97316', to: '#7C3AED', direction: '45deg' },
      buttonDefault: 'rgba(255,255,255,0.22)',
      buttonHover: 'rgba(255,255,255,0.32)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.9)',
      accent: '#FFFFFF',
    },
    buttonStyle: { borderRadius: 20, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Poppins', body: 'Poppins' },
    preview: '#F97316',
    isPremium: true,
  },

  // ── 14. BLOOM — red→indigo ────────────────────────────────────────────────
  {
    id: 'bloom',
    name: 'Bloom',
    category: 'gradient',
    colors: {
      background: '#DC2626',
      backgroundGradient: { from: '#DC2626', to: '#4338CA', direction: '135deg' },
      buttonDefault: 'rgba(0,0,0,0.22)',
      buttonHover: 'rgba(0,0,0,0.32)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.9)',
      accent: '#FFFFFF',
    },
    buttonStyle: { borderRadius: 14, borderWidth: 0, shadow: true, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#DC2626',
    isPremium: true,
  },

  // ── 15. TWILIGHT — deep purple→lavender mesh ──────────────────────────────
  {
    id: 'twilight',
    name: 'Twilight',
    category: 'mesh',
    colors: {
      background: '#1E1035',
      backgroundMesh: mesh(
        'radial-gradient(ellipse 80% 60% at 20% 10%, #6D28D9 0%, transparent 60%)',
        'radial-gradient(ellipse 60% 80% at 80% 90%, #7C3AED 0%, transparent 55%)',
        'radial-gradient(ellipse 70% 50% at 50% 50%, #4C1D95 0%, transparent 70%)',
        'linear-gradient(160deg, #1E1035 0%, #2D1B69 100%)',
      ),
      buttonDefault: 'rgba(255,255,255,0.15)',
      buttonHover: 'rgba(255,255,255,0.25)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.75)',
      accent: '#A78BFA',
    },
    buttonStyle: { borderRadius: 14, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#1E1035',
    isPremium: true,
  },

  // ── 16. AURORA — teal/green/blue mesh ─────────────────────────────────────
  {
    id: 'aurora',
    name: 'Aurora',
    category: 'mesh',
    colors: {
      background: '#0A1628',
      backgroundMesh: mesh(
        'radial-gradient(ellipse 90% 60% at 10% 20%, #0D9488 0%, transparent 55%)',
        'radial-gradient(ellipse 70% 70% at 85% 15%, #0EA5E9 0%, transparent 50%)',
        'radial-gradient(ellipse 60% 80% at 40% 80%, #059669 0%, transparent 55%)',
        'radial-gradient(ellipse 50% 50% at 70% 60%, #0284C7 0%, transparent 50%)',
        'linear-gradient(180deg, #0A1628 0%, #0F2744 100%)',
      ),
      buttonDefault: 'rgba(255,255,255,0.12)',
      buttonHover: 'rgba(255,255,255,0.2)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.7)',
      accent: '#2DD4BF',
    },
    buttonStyle: { borderRadius: 16, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#0A1628',
    isPremium: true,
  },

  // ── 17. NOURISH — warm earth mesh ─────────────────────────────────────────
  {
    id: 'nourish',
    name: 'Nourish',
    category: 'mesh',
    colors: {
      background: '#1C0A00',
      backgroundMesh: mesh(
        'radial-gradient(ellipse 80% 60% at 15% 25%, #92400E 0%, transparent 55%)',
        'radial-gradient(ellipse 70% 70% at 80% 10%, #B45309 0%, transparent 50%)',
        'radial-gradient(ellipse 60% 80% at 50% 85%, #78350F 0%, transparent 55%)',
        'radial-gradient(ellipse 50% 50% at 75% 65%, #D97706 0%, transparent 45%)',
        'linear-gradient(160deg, #1C0A00 0%, #3B1A00 100%)',
      ),
      buttonDefault: 'rgba(255,255,255,0.15)',
      buttonHover: 'rgba(255,255,255,0.25)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.75)',
      accent: '#F59E0B',
    },
    buttonStyle: { borderRadius: 12, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    noiseOpacity: 0.03,
    preview: '#1C0A00',
    isPremium: true,
  },

  // ── 18. RISE — coral/peach mesh ───────────────────────────────────────────
  {
    id: 'rise',
    name: 'Rise',
    category: 'mesh',
    colors: {
      background: '#FFF1F0',
      backgroundMesh: mesh(
        'radial-gradient(ellipse 80% 60% at 20% 20%, #FCA5A5 0%, transparent 55%)',
        'radial-gradient(ellipse 70% 70% at 80% 80%, #FDBA74 0%, transparent 55%)',
        'radial-gradient(ellipse 60% 50% at 60% 30%, #FCD34D 0%, transparent 50%)',
        'radial-gradient(ellipse 50% 60% at 30% 70%, #F9A8D4 0%, transparent 50%)',
        'linear-gradient(135deg, #FFF1F0 0%, #FEF3C7 100%)',
      ),
      buttonDefault: 'rgba(0,0,0,0.08)',
      buttonHover: 'rgba(0,0,0,0.14)',
      buttonText: '#7C2D12',
      profileText: '#7C2D12',
      profileBio: '#92400E',
      accent: '#F97316',
    },
    buttonStyle: { borderRadius: 20, borderWidth: 0, shadow: false, style: 'soft' },
    fonts: { heading: 'Poppins', body: 'Poppins' },
    preview: '#FFF1F0',
    isPremium: true,
  },

  // ── 19. BLISS — cool lavender mesh ────────────────────────────────────────
  {
    id: 'bliss',
    name: 'Bliss',
    category: 'mesh',
    colors: {
      background: '#F5F3FF',
      backgroundMesh: mesh(
        'radial-gradient(ellipse 80% 60% at 15% 20%, #DDD6FE 0%, transparent 55%)',
        'radial-gradient(ellipse 70% 70% at 85% 80%, #C4B5FD 0%, transparent 55%)',
        'radial-gradient(ellipse 60% 50% at 55% 40%, #E0E7FF 0%, transparent 50%)',
        'radial-gradient(ellipse 50% 60% at 35% 75%, #BAE6FD 0%, transparent 50%)',
        'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
      ),
      buttonDefault: 'rgba(109,40,217,0.1)',
      buttonHover: 'rgba(109,40,217,0.18)',
      buttonText: '#4C1D95',
      profileText: '#3B0764',
      profileBio: '#6D28D9',
      accent: '#7C3AED',
    },
    buttonStyle: { borderRadius: 16, borderWidth: 0, shadow: false, style: 'soft' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#F5F3FF',
    isPremium: true,
  },

  // ── 20. FOREST — deep green image-style mesh ──────────────────────────────
  {
    id: 'forest',
    name: 'Forest',
    category: 'mesh',
    colors: {
      background: '#052E16',
      backgroundMesh: mesh(
        'radial-gradient(ellipse 90% 60% at 10% 10%, #14532D 0%, transparent 55%)',
        'radial-gradient(ellipse 70% 80% at 85% 85%, #166534 0%, transparent 55%)',
        'radial-gradient(ellipse 60% 60% at 50% 50%, #15803D 0%, transparent 50%)',
        'radial-gradient(ellipse 40% 50% at 70% 20%, #4ADE80 0%, transparent 40%)',
        'linear-gradient(160deg, #052E16 0%, #14532D 100%)',
      ),
      buttonDefault: 'rgba(255,255,255,0.12)',
      buttonHover: 'rgba(255,255,255,0.2)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.75)',
      accent: '#4ADE80',
    },
    buttonStyle: { borderRadius: 14, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    noiseOpacity: 0.03,
    preview: '#052E16',
    isPremium: true,
  },

  // ── 21. OCEAN — deep blue image-style mesh ────────────────────────────────
  {
    id: 'ocean',
    name: 'Ocean',
    category: 'mesh',
    colors: {
      background: '#0C1445',
      backgroundMesh: mesh(
        'radial-gradient(ellipse 90% 60% at 10% 10%, #1E3A8A 0%, transparent 55%)',
        'radial-gradient(ellipse 70% 80% at 85% 85%, #1D4ED8 0%, transparent 55%)',
        'radial-gradient(ellipse 60% 60% at 50% 50%, #2563EB 0%, transparent 50%)',
        'radial-gradient(ellipse 40% 50% at 70% 20%, #38BDF8 0%, transparent 40%)',
        'linear-gradient(160deg, #0C1445 0%, #1E3A8A 100%)',
      ),
      buttonDefault: 'rgba(255,255,255,0.12)',
      buttonHover: 'rgba(255,255,255,0.2)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.75)',
      accent: '#38BDF8',
    },
    buttonStyle: { borderRadius: 14, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#0C1445',
    isPremium: true,
  },

  // ── 22. CANDY — hot pink mesh ─────────────────────────────────────────────
  {
    id: 'candy',
    name: 'Candy',
    category: 'mesh',
    colors: {
      background: '#4A0020',
      backgroundMesh: mesh(
        'radial-gradient(ellipse 80% 60% at 20% 20%, #BE185D 0%, transparent 55%)',
        'radial-gradient(ellipse 70% 70% at 80% 80%, #9D174D 0%, transparent 55%)',
        'radial-gradient(ellipse 60% 50% at 55% 40%, #EC4899 0%, transparent 50%)',
        'radial-gradient(ellipse 50% 60% at 30% 70%, #F472B6 0%, transparent 45%)',
        'linear-gradient(135deg, #4A0020 0%, #831843 100%)',
      ),
      buttonDefault: 'rgba(255,255,255,0.18)',
      buttonHover: 'rgba(255,255,255,0.28)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.8)',
      accent: '#F472B6',
    },
    buttonStyle: { borderRadius: 20, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Poppins', body: 'Poppins' },
    preview: '#4A0020',
    isPremium: true,
  },

  // ── 23. DUSK — sunset image background (Unsplash) ─────────────────────────
  {
    id: 'dusk',
    name: 'Dusk',
    category: 'image',
    colors: {
      background: '#1a0a2e',
      backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
      backgroundOverlay: 'rgba(10,5,30,0.55)',
      buttonDefault: 'rgba(255,255,255,0.18)',
      buttonHover: 'rgba(255,255,255,0.28)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.8)',
      accent: '#F59E0B',
    },
    buttonStyle: { borderRadius: 14, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#1a0a2e',
    isPremium: true,
  },

  // ── 24. NATURE — forest image background ─────────────────────────────────
  {
    id: 'nature',
    name: 'Nature',
    category: 'image',
    colors: {
      background: '#052E16',
      backgroundImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80&auto=format&fit=crop',
      backgroundOverlay: 'rgba(5,46,22,0.6)',
      buttonDefault: 'rgba(255,255,255,0.18)',
      buttonHover: 'rgba(255,255,255,0.28)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.8)',
      accent: '#4ADE80',
    },
    buttonStyle: { borderRadius: 14, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#052E16',
    isPremium: true,
  },

  // ── 25. CITY — urban night image background ───────────────────────────────
  {
    id: 'city',
    name: 'City',
    category: 'image',
    colors: {
      background: '#0A0A0A',
      backgroundImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80&auto=format&fit=crop',
      backgroundOverlay: 'rgba(0,0,0,0.6)',
      buttonDefault: 'rgba(255,255,255,0.15)',
      buttonHover: 'rgba(255,255,255,0.25)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.75)',
      accent: '#F59E0B',
    },
    buttonStyle: { borderRadius: 10, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#0A0A0A',
    isPremium: true,
  },

]

export const getThemesByCategory = (category: Theme['category']) =>
  THEMES.filter(t => t.category === category)

export const getThemeById = (id: string) =>
  THEMES.find(t => t.id === id)

export const getDefaultTheme = () => THEMES[0]
