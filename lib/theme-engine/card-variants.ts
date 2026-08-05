/**
 * Card Component Variant Registry (10/10 Pure Architecture)
 * 
 * Defines implementation specs for card-flat, card-elevated, card-glass, card-outline.
 */

export interface CardVariantSpec {
  id: string
  name: string
  variant: 'flat' | 'elevated' | 'glass' | 'outline'
  radius: string
  shadow: string
}

export const CARD_VARIANTS: Record<string, CardVariantSpec> = {
  'card-flat': {
    id: 'card-flat',
    name: 'Flat Clean Card',
    variant: 'flat',
    radius: 'radius-md',
    shadow: 'shadow-none'
  },
  'card-elevated': {
    id: 'card-elevated',
    name: 'Elevated Soft Shadow Card',
    variant: 'elevated',
    radius: 'radius-md',
    shadow: 'shadow-soft'
  },
  'card-glass': {
    id: 'card-glass',
    name: 'Translucent Frosted Glass Card',
    variant: 'glass',
    radius: 'radius-md',
    shadow: 'shadow-glass'
  },
  'card-outline': {
    id: 'card-outline',
    name: 'Bordered Outline Card',
    variant: 'outline',
    radius: 'radius-md',
    shadow: 'shadow-none'
  }
}

export function resolveCardVariant(input: any): CardVariantSpec {
  if (typeof input === 'string') {
    const key = input.startsWith('card-') ? input : `card-${input}`
    if (CARD_VARIANTS[key]) return CARD_VARIANTS[key]
    if (CARD_VARIANTS[input]) return CARD_VARIANTS[input]
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

  return CARD_VARIANTS['card-elevated']
}
