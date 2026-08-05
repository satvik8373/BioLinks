/**
 * Feature Variant: Card Variant Registry
 */

export interface CardVariantSpec {
  id: string
  name: string
  variant: 'flat' | 'elevated' | 'glass' | 'outline'
  radius: string
  shadow: string
}

export const CARD_ELEVATED: CardVariantSpec = {
  id: 'card-elevated',
  name: 'Elevated Soft Shadow Card',
  variant: 'elevated',
  radius: 'radius-md',
  shadow: 'shadow-soft'
}

export const CARD_GLASS: CardVariantSpec = {
  id: 'card-glass',
  name: 'Translucent Frosted Glass Card',
  variant: 'glass',
  radius: 'radius-md',
  shadow: 'shadow-glass'
}

export const CARD_FLAT: CardVariantSpec = {
  id: 'card-flat',
  name: 'Flat Clean Card',
  variant: 'flat',
  radius: 'radius-md',
  shadow: 'shadow-none'
}

export const CARD_OUTLINE: CardVariantSpec = {
  id: 'card-outline',
  name: 'Bordered Outline Card',
  variant: 'outline',
  radius: 'radius-md',
  shadow: 'shadow-none'
}

export const CARD_VARIANTS: Record<string, CardVariantSpec> = {
  'card-elevated': CARD_ELEVATED,
  'card-glass': CARD_GLASS,
  'card-flat': CARD_FLAT,
  'card-outline': CARD_OUTLINE
}

export function resolveCardVariant(input: any): CardVariantSpec {
  const variantId = typeof input === 'string' ? input : (typeof input === 'object' && input !== null ? (input.variant || input.id) : undefined)

  if (variantId) {
    const key = variantId.startsWith('card-') ? variantId : `card-${variantId}`
    const baseSpec = CARD_VARIANTS[key] || CARD_VARIANTS[variantId]
    if (baseSpec) {
      if (typeof input === 'object' && input !== null) {
        return { ...baseSpec, ...input }
      }
      return baseSpec
    }
  }

  if (typeof input === 'object' && input !== null) {
    return {
      id: input.id || 'custom-card',
      name: input.name || 'Custom Card',
      variant: input.variant || 'elevated',
      radius: input.radius || 'radius-md',
      shadow: input.shadow || 'shadow-soft'
    }
  }

  return CARD_ELEVATED
}
