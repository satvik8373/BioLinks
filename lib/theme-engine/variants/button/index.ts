/**
 * Feature Variant: Button Variant Registry
 */

export interface ButtonVariantSpec {
  id: string
  name: string
  variant: 'filled' | 'glass' | 'clay' | 'outline' | 'soft' | 'gradient' | 'hard-shadow' | 'retro-lcd' | 'wood' | 'carved' | 'raised' | 'leather'
  radius: string | number
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

export const BUTTON_WOOD: ButtonVariantSpec = {
  id: 'button-wood',
  name: 'Wood Plank Button',
  variant: 'wood',
  radius: 'radius-md',
  shadow: 'shadow-soft',
  borderWidth: 1,
  states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
}

export const BUTTON_CARVED: ButtonVariantSpec = {
  id: 'button-carved',
  name: 'Carved Inset Wood Button',
  variant: 'carved',
  radius: 'radius-md',
  shadow: 'shadow-none',
  borderWidth: 0,
  states: { hover: 'none', active: 'scale', focus: 'ring', disabled: 'opacity' }
}

export const BUTTON_RAISED: ButtonVariantSpec = {
  id: 'button-raised',
  name: 'Extruded Wood Button',
  variant: 'raised',
  radius: 'radius-md',
  shadow: 'shadow-md',
  borderWidth: 1,
  states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
}

export const BUTTON_LEATHER: ButtonVariantSpec = {
  id: 'button-leather',
  name: 'Leather Stitched Button',
  variant: 'leather',
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
  'button-soft': BUTTON_SOFT,
  'button-wood': BUTTON_WOOD,
  'button-carved': BUTTON_CARVED,
  'button-raised': BUTTON_RAISED,
  'button-leather': BUTTON_LEATHER,
  'button-gradient': { ...BUTTON_FILLED, id: 'button-gradient', name: 'Gradient Button', variant: 'gradient' },
  'button-hard-shadow': { ...BUTTON_FILLED, id: 'button-hard-shadow', name: 'Hard Shadow Button', variant: 'hard-shadow', radius: 'radius-none', shadow: 'shadow-hard', borderWidth: 2 },
  'button-retro-lcd': { ...BUTTON_OUTLINE, id: 'button-retro-lcd', name: 'Retro LCD Button', variant: 'retro-lcd' },
}

export function resolveButtonVariant(input: any): ButtonVariantSpec {
  const variantId = typeof input === 'string' ? input : (typeof input === 'object' && input !== null ? (input.variant || input.id) : undefined)

  if (variantId) {
    const key = variantId.startsWith('button-') ? variantId : `button-${variantId}`
    const baseSpec = BUTTON_VARIANTS[key] || BUTTON_VARIANTS[variantId]
    if (baseSpec) {
      if (typeof input === 'object' && input !== null) {
        return { 
          ...baseSpec, 
          ...input,
          variant: baseSpec.variant,
          borderWidth: input.borderWidth ?? input.border?.width ?? baseSpec.borderWidth,
          states: { ...baseSpec.states, ...input.states },
        }
      }
      return baseSpec
    }
  }

  if (typeof input === 'object' && input !== null) {
    return {
      id: input.id || 'custom-button',
      name: input.name || 'Custom Button',
      variant: input.variant || 'filled',
      radius: input.radius ?? 'radius-md',
      shadow: input.shadow || 'shadow-soft',
      borderWidth: input.border?.width ?? input.borderWidth ?? 0,
      states: input.states || { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
    }
  }

  return BUTTON_FILLED
}
