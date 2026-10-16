/**
 * Feature Variant: Avatar Variant Registry
 */

export interface AvatarVariantSpec {
  id: string
  name: string
  variant: 'circle' | 'rounded' | 'square' | 'blob' | 'hexagon'
  size: number
  borderWidth: number
}

export const AVATAR_CIRCLE: AvatarVariantSpec = {
  id: 'avatar-circle',
  name: 'Circular Avatar',
  variant: 'circle',
  size: 96,
  borderWidth: 2
}

export const AVATAR_ROUNDED: AvatarVariantSpec = {
  id: 'avatar-rounded',
  name: 'Rounded Square Avatar',
  variant: 'rounded',
  size: 96,
  borderWidth: 2
}

export const AVATAR_SQUARE: AvatarVariantSpec = {
  id: 'avatar-square',
  name: 'Sharp Square Avatar',
  variant: 'square',
  size: 96,
  borderWidth: 2
}

export const AVATAR_VARIANTS: Record<string, AvatarVariantSpec> = {
  'avatar-circle': AVATAR_CIRCLE,
  'avatar-rounded': AVATAR_ROUNDED,
  'avatar-square': AVATAR_SQUARE,
  'avatar-blob': { ...AVATAR_CIRCLE, id: 'avatar-blob', name: 'Blob Avatar', variant: 'blob' },
  'avatar-hexagon': { ...AVATAR_CIRCLE, id: 'avatar-hexagon', name: 'Hexagon Avatar', variant: 'hexagon' },
}

export function resolveAvatarVariant(input: any): AvatarVariantSpec {
  const variantId = typeof input === 'string' ? input : (typeof input === 'object' && input !== null ? (input.variant || input.id) : undefined)

  if (variantId) {
    const key = variantId.startsWith('avatar-') ? variantId : `avatar-${variantId}`
    const baseSpec = AVATAR_VARIANTS[key] || AVATAR_VARIANTS[variantId]
    if (baseSpec) {
      if (typeof input === 'object' && input !== null) {
        return { ...baseSpec, ...input, variant: baseSpec.variant, borderWidth: input.borderWidth ?? input.border?.width ?? baseSpec.borderWidth }
      }
      return baseSpec
    }
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

  return AVATAR_CIRCLE
}
