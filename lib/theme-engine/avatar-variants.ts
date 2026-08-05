/**
 * Avatar Component Variant Registry (10/10 Pure Architecture)
 * 
 * Defines implementation specs for avatar-circle, avatar-rounded, avatar-square.
 */

export interface AvatarVariantSpec {
  id: string
  name: string
  variant: 'circle' | 'rounded' | 'square'
  size: number
  borderWidth: number
}

export const AVATAR_VARIANTS: Record<string, AvatarVariantSpec> = {
  'avatar-circle': {
    id: 'avatar-circle',
    name: 'Circular Avatar',
    variant: 'circle',
    size: 96,
    borderWidth: 2
  },
  'avatar-rounded': {
    id: 'avatar-rounded',
    name: 'Rounded Square Avatar',
    variant: 'rounded',
    size: 96,
    borderWidth: 2
  },
  'avatar-square': {
    id: 'avatar-square',
    name: 'Sharp Square Avatar',
    variant: 'square',
    size: 96,
    borderWidth: 2
  }
}

export function resolveAvatarVariant(input: any): AvatarVariantSpec {
  if (typeof input === 'string') {
    const key = input.startsWith('avatar-') ? input : `avatar-${input}`
    if (AVATAR_VARIANTS[key]) return AVATAR_VARIANTS[key]
    if (AVATAR_VARIANTS[input]) return AVATAR_VARIANTS[input]
  }

  if (typeof input === 'object' && input !== null) {
    return {
      id: input.id || 'custom-avatar',
      name: input.name || 'Custom Avatar',
      variant: input.variant || 'circle',
      size: input.size || 96,
      borderWidth: input.border?.width ?? input.borderWidth ?? 2
    }
  }

  return AVATAR_VARIANTS['avatar-circle']
}
