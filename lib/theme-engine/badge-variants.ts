/**
 * Badge & Social Component Variant Registries (10/10 Pure Architecture)
 */

export interface BadgeVariantSpec {
  id: string
  name: string
  variant: 'soft' | 'filled' | 'glass' | 'outline'
}

export interface SocialVariantSpec {
  id: string
  name: string
  variant: 'circle' | 'rounded' | 'square'
  style: 'filled' | 'outline' | 'glass' | 'clay'
}

export const BADGE_VARIANTS: Record<string, BadgeVariantSpec> = {
  'badge-soft': { id: 'badge-soft', name: 'Soft Badge', variant: 'soft' },
  'badge-filled': { id: 'badge-filled', name: 'Filled Badge', variant: 'filled' },
  'badge-glass': { id: 'badge-glass', name: 'Glass Badge', variant: 'glass' },
  'badge-outline': { id: 'badge-outline', name: 'Outline Badge', variant: 'outline' }
}

export const SOCIAL_VARIANTS: Record<string, SocialVariantSpec> = {
  'social-rounded': { id: 'social-rounded', name: 'Rounded Social Icon', variant: 'rounded', style: 'filled' },
  'social-circle': { id: 'social-circle', name: 'Circle Social Icon', variant: 'circle', style: 'filled' },
  'social-square': { id: 'social-square', name: 'Square Social Icon', variant: 'square', style: 'filled' },
  'social-glass': { id: 'social-glass', name: 'Glass Circle Social Icon', variant: 'circle', style: 'glass' },
  'social-clay': { id: 'social-clay', name: 'Clay Rounded Social Icon', variant: 'rounded', style: 'clay' },
  'social-outline': { id: 'social-outline', name: 'Outline Circle Social Icon', variant: 'circle', style: 'outline' }
}

export function resolveBadgeVariant(input: any): BadgeVariantSpec {
  if (typeof input === 'string') {
    const key = input.startsWith('badge-') ? input : `badge-${input}`
    if (BADGE_VARIANTS[key]) return BADGE_VARIANTS[key]
    if (BADGE_VARIANTS[input]) return BADGE_VARIANTS[input]
  }
  return BADGE_VARIANTS['badge-soft']
}

export function resolveSocialVariant(input: any): SocialVariantSpec {
  if (typeof input === 'string') {
    const key = input.startsWith('social-') ? input : `social-${input}`
    if (SOCIAL_VARIANTS[key]) return SOCIAL_VARIANTS[key]
    if (SOCIAL_VARIANTS[input]) return SOCIAL_VARIANTS[input]
  }
  return SOCIAL_VARIANTS['social-rounded']
}
