/**
 * Production Background Registry (10/10 Architecture)
 * 
 * Reusable background presets for BioLinks theme engine.
 * Themes only reference `"preset": "forest-gradient"` without duplicating CSS values.
 */

export interface BackgroundPreset {
  id: string
  name: string
  type: 'gradient' | 'mesh' | 'image' | 'video' | 'solid'
  value: string
  overlay?: string
  image?: string
  video?: string
  blur?: number
  opacity?: number
}

export const BACKGROUND_PRESETS: Record<string, BackgroundPreset> = {
  'bg-luxe-aesthetic': {
    id: 'bg-luxe-aesthetic',
    name: 'Luxe Alabaster & Silk Light',
    type: 'mesh',
    value: 'radial-gradient(circle at 15% 15%, #FFFFFF 0%, rgba(248, 250, 252, 0.8) 55%, transparent 85%), radial-gradient(circle at 85% 85%, #F1F5F9 0%, rgba(241, 245, 249, 0.7) 50%, transparent 85%), linear-gradient(180deg, #FAF8F5 0%, #F1F5F9 100%)',
    overlay: 'transparent',
    blur: 0,
    opacity: 1
  },
  'bg-nature-serenity': {
    id: 'bg-nature-serenity',
    name: 'Nature Serenity Forest Soft',
    type: 'gradient',
    value: 'linear-gradient(180deg, #F0F7F4 0%, #E2EFE9 100%)',
    overlay: 'transparent',
    blur: 0,
    opacity: 1
  },
  'bg-ariana-grande': {
    id: 'bg-ariana-grande',
    name: 'Ariana Grande Minimal Dark Slate',
    type: 'mesh',
    value: 'radial-gradient(circle at 50% 20%, #27272A 0%, rgba(24, 24, 27, 0.95) 50%, #09090B 100%)',
    overlay: 'transparent',
    blur: 0,
    opacity: 1
  },
  'bg-olivia-rodrigo': {
    id: 'bg-olivia-rodrigo',
    name: 'Olivia Rodrigo Floral Pink',
    type: 'mesh',
    value: 'radial-gradient(circle at 80% 20%, #FCE7F3 0%, transparent 55%), radial-gradient(circle at 20% 80%, #FBCFE8 0%, transparent 55%), linear-gradient(180deg, #FFF1F2 0%, #FCE7F3 100%)',
    overlay: 'transparent',
    blur: 0,
    opacity: 1
  },
  'bg-billie-eilish': {
    id: 'bg-billie-eilish',
    name: 'Billie Eilish Ocean Deep',
    type: 'mesh',
    value: 'radial-gradient(ellipse at 50% 20%, #0369A1 0%, transparent 70%), linear-gradient(180deg, #0C4A6E 0%, #082F49 60%, #02131D 100%)',
    overlay: 'transparent',
    blur: 0,
    opacity: 1
  },
  'bg-selena-benny': {
    id: 'bg-selena-benny',
    name: 'Selena + Benny Polaroid Warm',
    type: 'mesh',
    value: 'radial-gradient(circle at 50% 30%, #FEF3C7 0%, transparent 60%), linear-gradient(180deg, #FEFCE8 0%, #FEF9C3 100%)',
    overlay: 'transparent',
    blur: 0,
    opacity: 1
  },
  'bg-daniel-triendl': {
    id: 'bg-daniel-triendl',
    name: 'Daniel Triendl Abstract Floral',
    type: 'mesh',
    value: 'radial-gradient(circle at 30% 30%, #1E3A8A 0%, transparent 60%), radial-gradient(circle at 70% 70%, #065F46 0%, transparent 60%), linear-gradient(135deg, #1E1B4B 0%, #064E3B 100%)',
    overlay: 'transparent',
    blur: 0,
    opacity: 1
  },
  'bg-luke-john': {
    id: 'bg-luke-john',
    name: 'Luke John Doodle Confetti Sky',
    type: 'mesh',
    value: 'radial-gradient(circle at 20% 20%, #E0F2FE 0%, transparent 50%), radial-gradient(circle at 80% 80%, #BAE6FD 0%, transparent 50%), linear-gradient(180deg, #E0F2FE 0%, #38BDF8 100%)',
    overlay: 'transparent',
    blur: 0,
    opacity: 1
  },
  'bg-starry-night': {
    id: 'bg-starry-night',
    name: 'Starry Night Cosmic Violet',
    type: 'mesh',
    value: 'radial-gradient(circle at 50% 30%, #4C1D95 0%, transparent 50%), radial-gradient(circle at 80% 80%, #312E81 0%, transparent 50%), linear-gradient(180deg, #0F0A1E 0%, #1E1B4B 60%, #090514 100%)',
    overlay: 'transparent',
    blur: 0,
    opacity: 1
  },
  'obsidian-slate-gradient': {
    id: 'obsidian-slate-gradient',
    name: 'Obsidian Slate Bone White',
    type: 'gradient',
    value: 'linear-gradient(180deg, #FAFAF9 0%, #F4F4F3 100%)',
    blur: 0,
    opacity: 1
  },
  'arctic-icy': {
    id: 'arctic-icy',
    name: 'Arctic Icy Highlight',
    type: 'mesh',
    value: 'radial-gradient(circle at 10% 20%, rgba(224, 242, 254, 0.8) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(240, 249, 255, 0.9) 0%, transparent 50%), linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    blur: 0,
    opacity: 1
  },
  'coffee-paper': {
    id: 'coffee-paper',
    name: 'Coffee Warm Paper',
    type: 'mesh',
    value: 'radial-gradient(circle at 80% 20%, rgba(210, 105, 30, 0.15) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(141, 110, 99, 0.2) 0%, transparent 50%), linear-gradient(135deg, #FFF9F0 0%, #F5EBE0 100%)',
    blur: 0,
    opacity: 1
  },
  'mono-grid': {
    id: 'mono-grid',
    name: 'Monochrome Cyber Grid',
    type: 'mesh',
    value: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 65%), linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px), #0A0A0A',
    blur: 0,
    opacity: 1
  },
  'forest-gradient': {
    id: 'forest-gradient',
    name: 'Emerald Forest Mesh',
    type: 'mesh',
    value: 'radial-gradient(circle at 30% 20%, rgba(149, 213, 178, 0.25) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(82, 183, 136, 0.2) 0%, transparent 50%), linear-gradient(145deg, #1B4332 0%, #2C5F2D 50%, #081C15 100%)',
    blur: 0,
    opacity: 1
  },
  'midnight-nebula': {
    id: 'midnight-nebula',
    name: 'Midnight Indigo Nebula',
    type: 'mesh',
    value: 'radial-gradient(circle at 15% 15%, rgba(129, 140, 248, 0.35) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(192, 132, 252, 0.3) 0%, transparent 50%), linear-gradient(140deg, #0F172A 0%, #1E1B4B 60%, #020617 100%)',
    blur: 0,
    opacity: 1
  },
  'sunset-mesh': {
    id: 'sunset-mesh',
    name: 'Sunset Twilight Mesh',
    type: 'mesh',
    value: 'radial-gradient(circle at 20% 20%, rgba(255, 123, 0, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(157, 78, 221, 0.35) 0%, transparent 50%), linear-gradient(135deg, #240046 0%, #3C096C 50%, #10002B 100%)',
    blur: 0,
    opacity: 1
  },
  'neon-glow': {
    id: 'neon-glow',
    name: 'Cyberpunk Neon Glow',
    type: 'mesh',
    value: 'radial-gradient(circle at 20% 30%, rgba(255, 0, 110, 0.35) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0, 240, 255, 0.3) 0%, transparent 50%), linear-gradient(180deg, #0A0E27 0%, #1B1B3A 50%, #050515 100%)',
    blur: 0,
    opacity: 1
  },
  'brutalist-pop': {
    id: 'brutalist-pop',
    name: 'Pop Art Yellow & Pink',
    type: 'mesh',
    value: 'radial-gradient(circle at 90% 10%, rgba(255, 107, 157, 0.4) 0%, transparent 40%), linear-gradient(135deg, #FFE66D 0%, #FFD166 100%)',
    blur: 0,
    opacity: 1
  },
  'y2k-chrome': {
    id: 'y2k-chrome',
    name: 'Y2K Holographic Chrome',
    type: 'mesh',
    value: 'radial-gradient(ellipse 100% 60% at 50% 0%, #B8B8FF 0%, transparent 50%), radial-gradient(ellipse 80% 80% at 80% 100%, #FFB8D1 0%, transparent 60%), linear-gradient(135deg, #EAEAEA 0%, #C7C7FF 50%, #FFCCE0 100%)',
    blur: 0,
    opacity: 1
  },
  'pastel-cloud': {
    id: 'pastel-cloud',
    name: 'Pastel Kawaii Cloud',
    type: 'mesh',
    value: 'radial-gradient(ellipse 90% 70% at 30% 20%, #FFD6E8 0%, transparent 60%), radial-gradient(ellipse 70% 90% at 70% 80%, #D6E8FF 0%, transparent 60%), linear-gradient(135deg, #FFF0F5 0%, #E8F4FF 100%)',
    blur: 0,
    opacity: 1
  },
  'neumorphic-clay': {
    id: 'neumorphic-clay',
    name: 'Neumorphic Soft Clay',
    type: 'mesh',
    value: '#FFFFFF',
    blur: 0,
    opacity: 1
  },
  'cosmic-galaxy': {
    id: 'cosmic-galaxy',
    name: 'Cosmic Galaxy Nebula',
    type: 'mesh',
    value: 'radial-gradient(ellipse 40% 30% at 70% 20%, #8B5CF6 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 30% 70%, #EC4899 0%, transparent 50%), radial-gradient(ellipse 30% 50% at 50% 50%, #3B82F6 0%, transparent 70%), linear-gradient(180deg, #0B0C1A 0%, #1E1B4B 100%)',
    blur: 0,
    opacity: 1
  },
  'luxury-gold': {
    id: 'luxury-gold',
    name: 'Luxury Gold Obsidian',
    type: 'mesh',
    value: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.25) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(244, 229, 194, 0.15) 0%, transparent 50%), linear-gradient(135deg, #120C0B 0%, #241410 50%, #0D0807 100%)',
    blur: 0,
    opacity: 1
  },
  'holographic-iridescent': {
    id: 'holographic-iridescent',
    name: 'Holographic Iridescent Rainbow',
    type: 'mesh',
    value: 'radial-gradient(ellipse 100% 70% at 30% 30%, rgba(255, 0, 255, 0.35) 0%, transparent 50%), radial-gradient(ellipse 100% 70% at 70% 70%, rgba(0, 255, 255, 0.35) 0%, transparent 50%), linear-gradient(45deg, rgba(255, 0, 0, 0.12) 0%, rgba(255, 255, 0, 0.12) 20%, rgba(0, 255, 0, 0.12) 40%, rgba(0, 255, 255, 0.12) 60%, rgba(0, 0, 255, 0.12) 80%, rgba(255, 0, 255, 0.12) 100%)',
    blur: 0,
    opacity: 1
  },
  'retro-sunset': {
    id: 'retro-sunset',
    name: '70s Retro Sunset',
    type: 'mesh',
    value: 'radial-gradient(ellipse 80% 60% at 30% 30%, #E88D67 0%, transparent 50%), radial-gradient(ellipse 70% 80% at 70% 70%, #F4B860 0%, transparent 50%), linear-gradient(135deg, #F4E9CD 0%, #E88D67 50%, #6B4423 100%)',
    blur: 0,
    opacity: 1
  },
  'cyberpunk-rain': {
    id: 'cyberpunk-rain',
    name: 'Cyberpunk Tokyo Rain',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    overlay: 'rgba(10, 14, 39, 0.75)',
    blur: 0,
    opacity: 1
  },
  'emerald-landscape': {
    id: 'emerald-landscape',
    name: 'Emerald Mountain Mist',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&auto=format&fit=crop&q=80',
    overlay: 'rgba(12, 35, 24, 0.65)',
    blur: 0,
    opacity: 1
  },
  'abstract-waves': {
    id: 'abstract-waves',
    name: '3D Liquid Gradient Artwork',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
    overlay: 'rgba(15, 23, 42, 0.45)',
    blur: 0,
    opacity: 1
  },
  'neon-skyline': {
    id: 'neon-skyline',
    name: 'Futuristic Night City Skyline',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80',
    overlay: 'rgba(8, 10, 24, 0.7)',
    blur: 0,
    opacity: 1
  },
  'minimal-studio': {
    id: 'minimal-studio',
    name: 'Architectural Studio Space',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80',
    overlay: 'rgba(248, 250, 252, 0.85)',
    blur: 0,
    opacity: 1
  },
  'bg-retro-lcd': {
    id: 'bg-retro-lcd',
    name: 'Retro LCD GameBoy Screen Pattern',
    type: 'mesh',
    value: 'repeating-linear-gradient(rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 3px), radial-gradient(120% 90% at 30% 0%, #c7d2ab, #b7c495 70%)',
    overlay: 'radial-gradient(120% 90% at 50% 0%, transparent 55%, rgba(0,0,0,0.16) 100%)',
    blur: 0,
    opacity: 1
  }
}

export function resolveBackground(bgConfig: any): { value: string; image?: string; overlay?: string; type: string } {
  if (!bgConfig) return { value: '#FFFFFF', type: 'solid' }

  if (typeof bgConfig === 'string') {
    if (BACKGROUND_PRESETS[bgConfig]) {
      const p = BACKGROUND_PRESETS[bgConfig]
      return { value: p.value, image: p.image, overlay: p.overlay, type: p.type }
    }
    return { value: bgConfig, type: bgConfig.includes('gradient') || bgConfig.includes('radial') ? 'mesh' : 'solid' }
  }

  const presetKey = bgConfig.preset || (typeof bgConfig === 'object' ? bgConfig.id : undefined)
  if (presetKey && BACKGROUND_PRESETS[presetKey]) {
    const p = BACKGROUND_PRESETS[presetKey]
    return {
      value: bgConfig.value || p.value,
      image: bgConfig.image || p.image,
      overlay: bgConfig.overlay || p.overlay,
      type: bgConfig.type || p.type
    }
  }

  return {
    value: bgConfig.value || bgConfig.image || bgConfig.video || '#FFFFFF',
    image: bgConfig.image || undefined,
    overlay: bgConfig.overlay || undefined,
    type: bgConfig.type || 'gradient'
  }
}
