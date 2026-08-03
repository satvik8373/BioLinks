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
    // Image, Video, or iframe embed background
    backgroundImage?: string         // Image URL
    backgroundVideo?: string         // MP4 / WebM video URL
    backgroundIframe?: string        // YouTube / Vimeo / iframe embed URL
    backgroundType?: 'color' | 'gradient' | 'mesh' | 'image' | 'video' | 'iframe'
    backgroundOverlay?: string       // rgba overlay
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
  headerLayout?: 'classic' | 'hero' | 'banner' | 'shape'
}

// ─── Helper to transform YouTube / Spotify / SoundCloud / Vimeo URLs to embed format ───
export function getEmbedIframeUrl(url: string): string {
  if (!url) return ''
  const trimmed = url.trim()

  // YouTube single video match
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1]
    return `https://www.youtube.com/embed/${videoId}?playsinline=1`
  }

  // YouTube channel ID match (UC... -> UU... uploads playlist for latest video)
  const ytChannelMatch = trimmed.match(/youtube\.com\/channel\/(UC[\w-]{22})/)
  if (ytChannelMatch && ytChannelMatch[1]) {
    const channelId = ytChannelMatch[1]
    const uploadsPlaylistId = 'UU' + channelId.substring(2)
    return `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}&playsinline=1`
  }

  // YouTube channel handle / user match (@handle, /c/name, /user/name)
  const ytUserMatch = trimmed.match(/youtube\.com\/(?:c\/|user\/|@)([\w-]+)/)
  if (ytUserMatch && ytUserMatch[1]) {
    return `https://www.youtube.com/embed?listType=user_uploads&list=${ytUserMatch[1]}&playsinline=1`
  }

  // Spotify match
  const spotifyMatch = trimmed.match(/open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/)
  if (spotifyMatch && spotifyMatch[1] && spotifyMatch[2]) {
    return `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}?utm_source=generator`
  }

  // SoundCloud match
  if (trimmed.includes('soundcloud.com') && !trimmed.includes('w.soundcloud.com/player')) {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(trimmed)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:.*#|.*\/)?([0-9]+)/)
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?byline=0&title=0`
  }

  // Google Drive match — convert share/view URL to embeddable /preview URL
  const driveMatch = trimmed.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)([a-zA-Z0-9_-]+)/)
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
  }

  return trimmed
}

// ─── Helper to parse Google Drive URLs for direct image/media viewing ───
export function parseGoogleDriveUrl(url: string): { fileId: string | null; directUrl: string; previewUrl: string } {
  if (!url) return { fileId: null, directUrl: '', previewUrl: '' }
  const trimmed = url.trim()

  // If already a non-Drive URL (direct image/video link), return as-is
  if (!trimmed.includes('drive.google.com') && !trimmed.includes('lh3.googleusercontent.com')) {
    return { fileId: null, directUrl: trimmed, previewUrl: trimmed }
  }

  const match = trimmed.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/)
  if (match && match[1]) {
    const fileId = match[1]
    // Use our proxy to bypass CORS + content-disposition blocks on Google Drive
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

  // ── 2. AGATE ─────────────────────────────────────────────────────────────
  {
    id: 'agate',
    name: 'Agate',
    category: 'vibrant',
    colors: {
      background: '#042F2E',
      backgroundMesh: mesh(
        'radial-gradient(ellipse 90% 70% at 20% 20%, #10B981 0%, transparent 60%)',
        'radial-gradient(ellipse 70% 80% at 80% 80%, #84CC16 0%, transparent 55%)',
        'linear-gradient(160deg, #042F2E 0%, #065F46 100%)'
      ),
      buttonDefault: '#84CC16',
      buttonHover: '#65A30D',
      buttonText: '#042F2E',
      profileText: '#84CC16',
      profileBio: '#A7F3D0',
      accent: '#84CC16',
    },
    buttonStyle: { borderRadius: 9999, borderWidth: 0, shadow: true, style: 'solid' },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    preview: '#042F2E',
  },

  // ── 3. AIR ───────────────────────────────────────────────────────────────
  {
    id: 'air',
    name: 'Air',
    category: 'minimal',
    colors: {
      background: '#F8FAFC',
      buttonDefault: '#FFFFFF',
      buttonHover: '#F1F5F9',
      buttonText: '#0F172A',
      profileText: '#0F172A',
      profileBio: '#64748B',
      accent: '#0F172A',
    },
    buttonStyle: { borderRadius: 12, borderWidth: 0, shadow: true, style: 'soft' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#FFFFFF',
  },

  // ── 4. ASTRID ────────────────────────────────────────────────────────────
  {
    id: 'astrid',
    name: 'Astrid',
    category: 'dark',
    colors: {
      background: '#0D0D0D',
      backgroundImage: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=800&q=80&auto=format&fit=crop',
      backgroundOverlay: 'rgba(13,13,13,0.7)',
      buttonDefault: 'rgba(255,255,255,0.12)',
      buttonHover: 'rgba(255,255,255,0.22)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.7)',
      accent: '#FFFFFF',
    },
    buttonStyle: { borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', shadow: false, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#0D0D0D',
  },

  // ── 5. AURA ───────────────────────────────────────────────────────────────
  {
    id: 'aura',
    name: 'Aura',
    category: 'minimal',
    colors: {
      background: '#EAE5D9',
      backgroundImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80&auto=format&fit=crop',
      backgroundOverlay: 'rgba(234,229,217,0.75)',
      buttonDefault: 'rgba(255,255,255,0.5)',
      buttonHover: 'rgba(255,255,255,0.7)',
      buttonText: '#3B332A',
      profileText: '#3B332A',
      profileBio: '#6E6254',
      accent: '#3B332A',
    },
    buttonStyle: { borderRadius: 16, borderWidth: 0, shadow: false, style: 'soft' },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    preview: '#EAE5D9',
  },

  // ── 6. BLISS ──────────────────────────────────────────────────────────────
  {
    id: 'bliss',
    name: 'Bliss',
    category: 'minimal',
    colors: {
      background: '#18181B',
      backgroundImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&auto=format&fit=crop',
      backgroundOverlay: 'rgba(0,0,0,0.4)',
      buttonDefault: 'rgba(255,255,255,0.3)',
      buttonHover: 'rgba(255,255,255,0.45)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.85)',
      accent: '#FFFFFF',
    },
    buttonStyle: { borderRadius: 9999, borderWidth: 0, shadow: false, style: 'glass' },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    preview: '#18181B',
  },

  // ── 7. BLOCKS ─────────────────────────────────────────────────────────────
  {
    id: 'blocks',
    name: 'Blocks',
    category: 'vibrant',
    colors: {
      background: '#7C3AED',
      buttonDefault: '#EC4899',
      buttonHover: '#DB2777',
      buttonText: '#000000',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.9)',
      accent: '#EC4899',
    },
    buttonStyle: {
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#000000',
      shadow: true,
      shadowStyle: 'hard',
      style: 'hard-shadow'
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#7C3AED',
  },

  // ── 8. BLOOM ──────────────────────────────────────────────────────────────
  {
    id: 'bloom',
    name: 'Bloom',
    category: 'gradient',
    colors: {
      background: '#831843',
      backgroundGradient: { from: '#9D174D', to: '#312E81', direction: '160deg' },
      buttonDefault: 'rgba(255,255,255,0.18)',
      buttonHover: 'rgba(255,255,255,0.28)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.85)',
      accent: '#F472B6',
    },
    buttonStyle: { borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', shadow: false, style: 'glass' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#831843',
  },

  // ── 9. BREEZE ─────────────────────────────────────────────────────────────
  {
    id: 'breeze',
    name: 'Breeze',
    category: 'vibrant',
    colors: {
      background: '#FCE7F3',
      buttonDefault: '#FBCFE8',
      buttonHover: '#F9A8D4',
      buttonText: '#831843',
      profileText: '#831843',
      profileBio: '#9F1239',
      accent: '#EC4899',
    },
    buttonStyle: { borderRadius: 16, borderWidth: 0, shadow: false, style: 'soft' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#FCE7F3',
  },

  // ── 10. ENCORE ────────────────────────────────────────────────────────────
  {
    id: 'encore',
    name: 'Encore',
    category: 'dark',
    colors: {
      background: '#09090B',
      backgroundImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80&auto=format&fit=crop',
      backgroundOverlay: 'rgba(9,9,11,0.75)',
      buttonDefault: 'transparent',
      buttonHover: 'rgba(217,119,6,0.15)',
      buttonText: '#F59E0B',
      profileText: '#F59E0B',
      profileBio: '#FCD34D',
      accent: '#F59E0B',
    },
    buttonStyle: { borderRadius: 8, borderWidth: 1, borderColor: '#F59E0B', shadow: false, style: 'outline' },
    fonts: { heading: 'Space Grotesk', body: 'Inter' },
    preview: '#09090B',
  },

  // ── 11. GRID ──────────────────────────────────────────────────────────────
  {
    id: 'grid',
    name: 'Grid',
    category: 'vibrant',
    colors: {
      background: '#D9F99D',
      buttonDefault: '#FFFFFF',
      buttonHover: '#F7FEE7',
      buttonText: '#000000',
      profileText: '#000000',
      profileBio: '#1A2E05',
      accent: '#000000',
    },
    buttonStyle: { borderRadius: 0, borderWidth: 3, borderColor: '#000000', shadow: true, shadowStyle: 'hard', style: 'hard-shadow' },
    fonts: { heading: 'Space Grotesk', body: 'Space Grotesk' },
    preview: '#D9F99D',
  },

  // ── 12. GROOVE ────────────────────────────────────────────────────────────
  {
    id: 'groove',
    name: 'Groove',
    category: 'vibrant',
    colors: {
      background: '#EA580C',
      backgroundMesh: mesh(
        'radial-gradient(ellipse 90% 70% at 20% 20%, #F97316 0%, transparent 60%)',
        'radial-gradient(ellipse 70% 80% at 80% 80%, #3B82F6 0%, transparent 55%)',
        'linear-gradient(135deg, #EA580C 0%, #7C3AED 100%)'
      ),
      buttonDefault: 'rgba(255,255,255,0.22)',
      buttonHover: 'rgba(255,255,255,0.32)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.9)',
      accent: '#FFFFFF',
    },
    buttonStyle: { borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', shadow: false, style: 'glass' },
    fonts: { heading: 'Space Grotesk', body: 'Inter' },
    preview: '#EA580C',
  },

  // ── 13. HAVEN ─────────────────────────────────────────────────────────────
  {
    id: 'haven',
    name: 'Haven',
    category: 'minimal',
    colors: {
      background: '#D4C5A9',
      backgroundImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop',
      backgroundOverlay: 'rgba(212,197,169,0.7)',
      buttonDefault: 'rgba(0,0,0,0.08)',
      buttonHover: 'rgba(0,0,0,0.14)',
      buttonText: '#2C2416',
      profileText: '#2C2416',
      profileBio: '#5C4F3A',
      accent: '#8B6914',
    },
    buttonStyle: { borderRadius: 12, borderWidth: 0, shadow: false, style: 'soft' },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    noiseOpacity: 0.05,
    preview: '#D4C5A9',
  },

  // ── 14. LAKE ──────────────────────────────────────────────────────────────
  {
    id: 'lake',
    name: 'Lake',
    category: 'dark',
    colors: {
      background: '#111827',
      buttonDefault: '#1F2937',
      buttonHover: '#374151',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: '#9CA3AF',
      accent: '#60A5FA',
    },
    buttonStyle: { borderRadius: 12, borderWidth: 0, shadow: false, style: 'solid' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#111827',
  },

  // ── 15. MINERAL ───────────────────────────────────────────────────────────
  {
    id: 'mineral',
    name: 'Mineral',
    category: 'minimal',
    colors: {
      background: '#F5F0E8',
      buttonDefault: 'rgba(0,0,0,0.05)',
      buttonHover: 'rgba(0,0,0,0.09)',
      buttonText: '#2C2416',
      profileText: '#2C2416',
      profileBio: '#7A6E5F',
      accent: '#8B7355',
    },
    buttonStyle: { borderRadius: 12, borderWidth: 1, borderColor: 'rgba(44,36,22,0.15)', shadow: false, style: 'soft' },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    noiseOpacity: 0.04,
    preview: '#F5F0E8',
  },

  // ── 16. NOURISH ───────────────────────────────────────────────────────────
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
        'linear-gradient(160deg, #1C0A00 0%, #3B1A00 100%)'
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
  },

  // ── 17. RISE ──────────────────────────────────────────────────────────────
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
        'linear-gradient(135deg, #FFF1F0 0%, #FEF3C7 100%)'
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
  },

  // ── 18. SWEAT ─────────────────────────────────────────────────────────────
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
  },

  // ── 19. TRESS ─────────────────────────────────────────────────────────────
  {
    id: 'tress',
    name: 'Tress',
    category: 'dark',
    colors: {
      background: '#14281D',
      backgroundGradient: { from: '#14281D', to: '#1F3A2B', direction: '180deg' },
      buttonDefault: 'rgba(255,255,255,0.12)',
      buttonHover: 'rgba(255,255,255,0.2)',
      buttonText: '#E2E8F0',
      profileText: '#F8FAFC',
      profileBio: 'rgba(255,255,255,0.7)',
      accent: '#4ADE80',
    },
    buttonStyle: { borderRadius: 14, borderWidth: 0, shadow: false, style: 'soft' },
    fonts: { heading: 'Inter', body: 'Inter' },
    preview: '#14281D',
  },

  // ── 20. TWILIGHT ──────────────────────────────────────────────────────────
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
        'linear-gradient(160deg, #1E1035 0%, #2D1B69 100%)'
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
  },

  // ── 21. VOX ───────────────────────────────────────────────────────────────
  {
    id: 'vox',
    name: 'Vox',
    category: 'dark',
    colors: {
      background: '#0F172A',
      backgroundGradient: { from: '#0F172A', to: '#1E1B4B', direction: '135deg' },
      buttonDefault: 'rgba(255,255,255,0.12)',
      buttonHover: 'rgba(255,255,255,0.22)',
      buttonText: '#F8FAFC',
      profileText: '#F8FAFC',
      profileBio: 'rgba(255,255,255,0.7)',
      accent: '#6366F1',
    },
    buttonStyle: { borderRadius: 12, borderWidth: 1, shadow: false, style: 'outline' },
    fonts: { heading: 'Space Grotesk', body: 'Space Grotesk' },
    preview: '#0F172A',
  },

  // ── 22. CYBERPUNK ─────────────────────────────────────────────────────────
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    category: 'mesh',
    colors: {
      background: '#0B001A',
      backgroundMesh: mesh(
        'radial-gradient(ellipse 90% 70% at 20% 20%, #EC4899 0%, transparent 60%)',
        'radial-gradient(ellipse 70% 80% at 80% 80%, #3B82F6 0%, transparent 55%)',
        'radial-gradient(ellipse 60% 60% at 50% 50%, #8B5CF6 0%, transparent 60%)',
        'linear-gradient(180deg, #0B001A 0%, #1A0033 100%)'
      ),
      buttonDefault: 'rgba(255,255,255,0.14)',
      buttonHover: 'rgba(255,255,255,0.26)',
      buttonText: '#FFFFFF',
      profileText: '#FFFFFF',
      profileBio: 'rgba(255,255,255,0.85)',
      accent: '#F472B6',
    },
    buttonStyle: { borderRadius: 16, borderWidth: 1, shadow: false, style: 'glass' },
    fonts: { heading: 'Space Grotesk', body: 'Inter' },
    noiseOpacity: 0.05,
    preview: '#0B001A',
  },

]

export const getThemesByCategory = (category: Theme['category']) =>
  THEMES.filter(t => t.category === category)

export const getThemeById = (id: string): Theme =>
  THEMES.find(t => t.id === id) || THEMES[0]

export const getDefaultTheme = (): Theme => THEMES[0]

/**
 * Bulletproof Theme Normalizer & Base Formatter:
 * Ensures any theme state (even from legacy localStorage or partial custom edits)
 * always conforms to full base formatting and never breaks when features are added.
 */
export function formatAndNormalizeTheme(rawTheme?: any): Theme {
  const basePreset = rawTheme?.id ? getThemeById(rawTheme.id) : THEMES[0]

  // Preserve preset image backgrounds when a theme is referenced only by id.
  // An explicitly empty backgroundImage still means the user removed it.
  const backgroundImage   = rawTheme?.colors?.backgroundImage   ?? basePreset.colors.backgroundImage ?? ''
  const backgroundVideo   = rawTheme?.colors?.backgroundVideo   ?? ''
  const backgroundIframe  = rawTheme?.colors?.backgroundIframe  ?? ''
  const backgroundOverlay = rawTheme?.colors?.backgroundOverlay ?? basePreset.colors.backgroundOverlay ?? ''
  const backgroundType    = rawTheme?.colors?.backgroundType    ?? ''

  // Mesh/gradient come from rawTheme first, then fall back to the preset's
  // built-in mesh/gradient — but only when there is no user image/video override.
  const hasUserBg = !!(backgroundImage || backgroundVideo || backgroundIframe)
  const backgroundGradient = rawTheme?.colors?.backgroundGradient
    ?? (!hasUserBg ? basePreset.colors.backgroundGradient : undefined)
  const backgroundMesh = rawTheme?.colors?.backgroundMesh
    ?? (!hasUserBg ? basePreset.colors.backgroundMesh : undefined)

  return {
    id: rawTheme?.id || basePreset.id || 'custom',
    name: rawTheme?.name || basePreset.name || 'Custom',
    category: rawTheme?.category || basePreset.category || 'minimal',
    colors: {
      background:        rawTheme?.colors?.background        || basePreset.colors.background,
      backgroundGradient,
      backgroundMesh,
      backgroundImage,
      backgroundVideo,
      backgroundIframe,
      backgroundOverlay,
      backgroundType,
      buttonDefault: rawTheme?.colors?.buttonDefault || basePreset.colors.buttonDefault,
      buttonHover:   rawTheme?.colors?.buttonHover   || basePreset.colors.buttonHover,
      buttonText:    rawTheme?.colors?.buttonText    || basePreset.colors.buttonText,
      profileText:   rawTheme?.colors?.profileText   || basePreset.colors.profileText,
      profileBio:    rawTheme?.colors?.profileBio    || basePreset.colors.profileBio,
      accent:        rawTheme?.colors?.accent        || basePreset.colors.accent,
    },
    buttonStyle: {
      borderRadius:     rawTheme?.buttonStyle?.borderRadius     ?? basePreset.buttonStyle.borderRadius     ?? 12,
      borderWidth:      rawTheme?.buttonStyle?.borderWidth      ?? basePreset.buttonStyle.borderWidth      ?? 0,
      borderColor:      rawTheme?.buttonStyle?.borderColor      || basePreset.buttonStyle.borderColor,
      shadow:           rawTheme?.buttonStyle?.shadow           ?? basePreset.buttonStyle.shadow           ?? false,
      shadowStyle:      rawTheme?.buttonStyle?.shadowStyle      || basePreset.buttonStyle.shadowStyle      || 'none',
      style:            rawTheme?.buttonStyle?.style            || basePreset.buttonStyle.style            || 'solid',
      animation:        rawTheme?.buttonStyle?.animation        || basePreset.buttonStyle.animation        || 'none',
      enableAnimations: rawTheme?.buttonStyle?.enableAnimations ?? basePreset.buttonStyle.enableAnimations ?? true,
    },
    fonts: {
      heading: rawTheme?.fonts?.heading || basePreset.fonts.heading || 'Inter',
      body:    rawTheme?.fonts?.body    || basePreset.fonts.body    || 'Inter',
    },
    backgroundFilter: rawTheme?.backgroundFilter || basePreset.backgroundFilter || '',
    noiseOpacity:     rawTheme?.noiseOpacity      ?? basePreset.noiseOpacity      ?? 0,
    preview:          rawTheme?.preview           || basePreset.preview           || '#FFFFFF',
    isPremium:        rawTheme?.isPremium          ?? basePreset.isPremium          ?? false,
  }
}
