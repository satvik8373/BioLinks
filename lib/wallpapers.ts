/**
 * Curated Wallpapers, Patterns, Blur Meshes, and Video background presets
 */

export interface PatternPreset {
  id: string
  name: string
  cssPattern: string
  backgroundSize: string
  defaultBgColor: string
}

export interface WallpaperPreset {
  id: string
  name: string
  category: 'Abstract' | 'Dark Neon' | 'Pastel' | 'Nature' | 'Cyberpunk' | 'Minimalist' | 'Architecture'
  url: string
  thumbnail: string
}

export interface VideoPreset {
  id: string
  name: string
  category: string
  url: string
  thumbnail: string
}

export interface BlurMeshPreset {
  id: string
  name: string
  cssMesh: string
}

export const PATTERN_PRESETS: PatternPreset[] = [
  {
    id: 'polka-dots',
    name: 'Polka Dots',
    cssPattern: 'radial-gradient(circle, rgba(120,119,198,0.45) 18%, transparent 19%)',
    backgroundSize: '20px 20px',
    defaultBgColor: '#4F46E5',
  },
  {
    id: 'grid-lines',
    name: 'Grid Lines',
    cssPattern: 'linear-gradient(to right, rgba(120,119,198,0.3) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(120,119,198,0.3) 1.5px, transparent 1.5px)',
    backgroundSize: '24px 24px',
    defaultBgColor: '#0F172A',
  },
  {
    id: 'diagonal-stripes',
    name: 'Diagonal Stripes',
    cssPattern: 'repeating-linear-gradient(45deg, rgba(120,119,198,0.25), rgba(120,119,198,0.25) 8px, transparent 8px, transparent 16px)',
    backgroundSize: '100% 100%',
    defaultBgColor: '#1E1B4B',
  },
  {
    id: 'isometric-cubes',
    name: 'Isometric Cubes',
    cssPattern: 'linear-gradient(30deg, rgba(120,119,198,0.3) 12%, transparent 12.5%, transparent 87%, rgba(120,119,198,0.3) 87.5%, rgba(120,119,198,0.3)), linear-gradient(150deg, rgba(120,119,198,0.3) 12%, transparent 12.5%, transparent 87%, rgba(120,119,198,0.3) 87.5%, rgba(120,119,198,0.3))',
    backgroundSize: '32px 56px',
    defaultBgColor: '#090D16',
  },
  {
    id: 'wave-lines',
    name: 'Wave Lines',
    cssPattern: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(120,119,198,0.35) 41%, rgba(120,119,198,0.35) 48%, transparent 49%)',
    backgroundSize: '24px 24px',
    defaultBgColor: '#064E3B',
  },
  {
    id: 'hexagons',
    name: 'Hexagons',
    cssPattern: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(120,119,198,0.35) 31%, rgba(120,119,198,0.35) 45%, transparent 46%)',
    backgroundSize: '26px 26px',
    defaultBgColor: '#4C1D95',
  },
  {
    id: 'stars-sparkles',
    name: 'Stars & Sparkles',
    cssPattern: 'radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.95), rgba(0,0,0,0)), radial-gradient(2px 2px at 40px 70px, rgba(120,119,198,0.85), rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 40px, rgba(255,255,255,0.95), rgba(0,0,0,0)), radial-gradient(2px 2px at 130px 80px, rgba(120,119,198,0.85), rgba(0,0,0,0))',
    backgroundSize: '140px 100px',
    defaultBgColor: '#090D16',
  },
  {
    id: 'crosshatch',
    name: 'Crosshatch',
    cssPattern: 'linear-gradient(45deg, rgba(120,119,198,0.3) 25%, transparent 25%, transparent 75%, rgba(120,119,198,0.3) 75%), linear-gradient(-45deg, rgba(120,119,198,0.3) 25%, transparent 25%, transparent 75%, rgba(120,119,198,0.3) 75%)',
    backgroundSize: '20px 20px',
    defaultBgColor: '#831843',
  },
]

export const BLUR_MESH_PRESETS: BlurMeshPreset[] = [
  {
    id: 'purple-aura',
    name: 'Purple Aura',
    cssMesh: 'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(109,40,217,0.85) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 90%, rgba(236,72,153,0.75) 0%, transparent 55%), linear-gradient(160deg, #1E1035 0%, #2D1B69 100%)',
  },
  {
    id: 'midnight-neon',
    name: 'Midnight Neon',
    cssMesh: 'radial-gradient(circle at 10% 20%, rgba(59,130,246,0.8) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(168,85,247,0.8) 0%, transparent 50%), linear-gradient(135deg, #090D16 0%, #0F172A 100%)',
  },
  {
    id: 'cyberpunk-glow',
    name: 'Cyberpunk Glow',
    cssMesh: 'radial-gradient(circle at 80% 20%, rgba(236,72,153,0.85) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(6,182,212,0.85) 0%, transparent 45%), linear-gradient(180deg, #180B28 0%, #070B19 100%)',
  },
  {
    id: 'cosmic-dust',
    name: 'Cosmic Dust',
    cssMesh: 'radial-gradient(circle at 50% 30%, rgba(244,114,182,0.7) 0%, transparent 60%), radial-gradient(circle at 20% 70%, rgba(99,102,241,0.8) 0%, transparent 55%), linear-gradient(135deg, #111827 0%, #311042 100%)',
  },
  {
    id: 'sunset-haze',
    name: 'Sunset Haze',
    cssMesh: 'radial-gradient(ellipse at top left, rgba(251,146,60,0.85) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(225,29,72,0.85) 0%, transparent 50%), linear-gradient(135deg, #4C0519 0%, #1E1B4B 100%)',
  },
  {
    id: 'emerald-glass',
    name: 'Emerald Glass',
    cssMesh: 'radial-gradient(circle at 30% 20%, rgba(16,185,129,0.8) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(6,182,212,0.75) 0%, transparent 50%), linear-gradient(160deg, #022C22 0%, #0F172A 100%)',
  },
  {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    cssMesh: 'radial-gradient(circle at 20% 30%, rgba(253,164,175,0.9) 0%, transparent 55%), radial-gradient(circle at 80% 70%, rgba(196,181,253,0.9) 0%, transparent 55%), linear-gradient(135deg, #FFF1F2 0%, #F5F3FF 100%)',
  },
]

export const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: 'abstract-1',
    name: 'Fluid Waves',
    category: 'Abstract',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&q=80',
  },
  {
    id: 'abstract-2',
    name: 'Cosmic Gradient',
    category: 'Abstract',
    url: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=300&q=80',
  },
  {
    id: 'dark-neon-1',
    name: 'Neon Grid',
    category: 'Dark Neon',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&q=80',
  },
  {
    id: 'dark-neon-2',
    name: 'Cyber Horizon',
    category: 'Dark Neon',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&q=80',
  },
  {
    id: 'pastel-1',
    name: 'Cotton Soft',
    category: 'Pastel',
    url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&q=80',
  },
  {
    id: 'pastel-2',
    name: 'Sunset Clouds',
    category: 'Pastel',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80',
  },
  {
    id: 'nature-1',
    name: 'Mist Mountains',
    category: 'Nature',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80',
  },
  {
    id: 'nature-2',
    name: 'Forest Pines',
    category: 'Nature',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80',
  },
  {
    id: 'cyberpunk-1',
    name: 'Tokyo Rain',
    category: 'Cyberpunk',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300&q=80',
  },
  {
    id: 'minimalist-1',
    name: 'Clean Texture',
    category: 'Minimalist',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80',
  },
]

export const VIDEO_PRESETS: VideoPreset[] = [
  {
    id: 'abstract-fluid-loop',
    name: 'Fluid Gradient Loop',
    category: 'Abstract',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-fast-flowing-smoke-41584-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&q=80',
  },
  {
    id: 'cyberpunk-neon-loop',
    name: 'Cyberpunk Neon Motion',
    category: 'Cyberpunk',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-neon-lights-41551-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&q=80',
  },
  {
    id: 'space-stars-loop',
    name: 'Starry Galaxy Loop',
    category: 'Cosmic',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-41604-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=300&q=80',
  },
  {
    id: 'ocean-waves-loop',
    name: 'Calming Ocean Waves',
    category: 'Nature',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-ocean-waves-41549-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80',
  },
]
