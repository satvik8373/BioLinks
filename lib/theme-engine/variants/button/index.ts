/**
 * Feature Variant: Button Variant Registry
 */

export interface ButtonVariantSpec {
  id: string
  name: string
  variant: 'filled' | 'glass' | 'clay' | 'outline' | 'soft'
  radius: string
  shadow: string
  borderWidth: number
  states: {
    hover: string
    active: string
    focus: string
    disabled: string
  }
}

export const BUTTON_FILLED: ButtonVariantSpec = {
  id: 'button-filled',
  name: 'Solid Filled Button',
  variant: 'filled',
  radius: 'radius-md',
  shadow: 'shadow-soft',
  borderWidth: 0,
  states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
}

export const BUTTON_GLASS: ButtonVariantSpec = {
  id: 'button-glass',
  name: 'Translucent Glass Button',
  variant: 'glass',
  radius: 'radius-md',
  shadow: 'shadow-glass',
  borderWidth: 1,
  states: { hover: 'glow', active: 'scale', focus: 'ring', disabled: 'opacity' }
}

export const BUTTON_CLAY: ButtonVariantSpec = {
  id: 'button-clay',
  name: 'Tactile Neumorphic Clay Button',
  variant: 'clay',
  radius: 'radius-md',
  shadow: 'shadow-clay',
  borderWidth: 0,
  states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
}

export const BUTTON_OUTLINE: ButtonVariantSpec = {
  id: 'button-outline',
  name: 'Monochrome Outline Button',
  variant: 'outline',
  radius: 'radius-md',
  shadow: 'shadow-none',
  borderWidth: 2,
  states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
}

export const BUTTON_SOFT: ButtonVariantSpec = {
  id: 'button-soft',
  name: 'Soft Tinted Button',
  variant: 'soft',
  radius: 'radius-md',
  shadow: 'shadow-soft',
  borderWidth: 1,
  states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
}

export const BUTTON_VARIANTS: Record<string, ButtonVariantSpec> = {
  'button-filled': BUTTON_FILLED,
  'button-glass': BUTTON_GLASS,
  'button-clay': BUTTON_CLAY,
  'button-outline': BUTTON_OUTLINE,
  'button-soft': BUTTON_SOFT
}

export function resolveButtonVariant(input: any): ButtonVariantSpec {
  const variantId = typeof input === 'string' ? input : (typeof input === 'object' && input !== null ? (input.variant || input.id) : undefined)

  if (variantId) {
    const key = variantId.startsWith('button-') ? variantId : `button-${variantId}`
    const baseSpec = BUTTON_VARIANTS[key] || BUTTON_VARIANTS[variantId]
    if (baseSpec) {
      if (typeof input === 'object' && input !== null) {
        return { ...baseSpec, ...input }
      }
      return baseSpec
    }
  }

  if (typeof input === 'object' && input !== null) {
    return {
      id: input.id || 'custom-button',
      name: input.name || 'Custom Button',
      variant: input.variant || 'filled',
      radius: input.radius || 'radius-md',
      shadow: input.shadow || 'shadow-soft',
      borderWidth: input.border?.width ?? input.borderWidth ?? 0,
      states: input.states || { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
    }
  }

  return BUTTON_FILLED
}
