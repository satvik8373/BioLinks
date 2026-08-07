/**
 * Button Component Variant Registry (10/10 Pure Architecture)
 * 
 * Defines implementation specs for button-soft, button-filled, button-glass, button-clay, button-outline.
 */

export interface ButtonVariantSpec {
  id: string
  name: string
  variant: 'filled' | 'glass' | 'clay' | 'outline' | 'soft' | 'gradient' | 'wood' | 'carved' | 'raised' | 'leather'
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

export const BUTTON_VARIANTS: Record<string, ButtonVariantSpec> = {
  'button-soft': {
    id: 'button-soft',
    name: 'Soft Tinted Button',
    variant: 'soft',
    radius: 'radius-md',
    shadow: 'shadow-soft',
    borderWidth: 1,
    states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
  },
  'button-filled': {
    id: 'button-filled',
    name: 'Solid Filled Button',
    variant: 'filled',
    radius: 'radius-md',
    shadow: 'shadow-soft',
    borderWidth: 0,
    states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
  },
  'button-glass': {
    id: 'button-glass',
    name: 'Translucent Glass Button',
    variant: 'glass',
    radius: 'radius-md',
    shadow: 'shadow-glass',
    borderWidth: 1,
    states: { hover: 'glow', active: 'scale', focus: 'ring', disabled: 'opacity' }
  },
  'button-clay': {
    id: 'button-clay',
    name: 'Tactile Neumorphic Clay Button',
    variant: 'clay',
    radius: 'radius-md',
    shadow: 'shadow-clay',
    borderWidth: 0,
    states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
  },
  'button-outline': {
    id: 'button-outline',
    name: 'Monochrome Outline Button',
    variant: 'outline',
    radius: 'radius-md',
    shadow: 'shadow-none',
    borderWidth: 2,
    states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
  },
  'button-gradient': {
    id: 'button-gradient',
    name: 'Vibrant Gradient Button',
    variant: 'gradient',
    radius: 'radius-md',
    shadow: 'shadow-soft',
    borderWidth: 0,
    states: { hover: 'glow', active: 'scale', focus: 'ring', disabled: 'opacity' }
  },
  'button-wood': {
    id: 'button-wood',
    name: 'Wood Plank Button',
    variant: 'wood',
    radius: 'radius-md',
    shadow: 'shadow-soft',
    borderWidth: 1,
    states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
  },
  'button-carved': {
    id: 'button-carved',
    name: 'Carved Inset Wood Button',
    variant: 'carved',
    radius: 'radius-md',
    shadow: 'shadow-none',
    borderWidth: 0,
    states: { hover: 'none', active: 'scale', focus: 'ring', disabled: 'opacity' }
  },
  'button-raised': {
    id: 'button-raised',
    name: 'Extruded Wood Button',
    variant: 'raised',
    radius: 'radius-md',
    shadow: 'shadow-md',
    borderWidth: 1,
    states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
  },
  'button-leather': {
    id: 'button-leather',
    name: 'Leather Stitched Button',
    variant: 'leather',
    radius: 'radius-md',
    shadow: 'shadow-soft',
    borderWidth: 1,
    states: { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
  }
}

export function resolveButtonVariant(input: any): ButtonVariantSpec {
  if (typeof input === 'string') {
    const key = input.startsWith('button-') ? input : `button-${input}`
    if (BUTTON_VARIANTS[key]) return BUTTON_VARIANTS[key]
    if (BUTTON_VARIANTS[input]) return BUTTON_VARIANTS[input]
  }

  if (typeof input === 'object' && input !== null) {
    const variantId = input.variant || input.id
    let baseSpec = BUTTON_VARIANTS['button-filled']
    if (variantId) {
      const key = variantId.startsWith('button-') ? variantId : `button-${variantId}`
      if (BUTTON_VARIANTS[key]) baseSpec = BUTTON_VARIANTS[key]
      else if (BUTTON_VARIANTS[variantId]) baseSpec = BUTTON_VARIANTS[variantId]
    }
    return {
      id: input.id || baseSpec.id || 'custom-button',
      name: input.name || baseSpec.name || 'Custom Button',
      variant: baseSpec.variant, // Lock to the resolved standard variant keyword
      radius: input.radius || baseSpec.radius || 'radius-md',
      shadow: input.shadow || baseSpec.shadow || 'shadow-soft',
      borderWidth: input.border?.width ?? input.borderWidth ?? baseSpec.borderWidth ?? 0,
      states: input.states || baseSpec.states || { hover: 'lift', active: 'scale', focus: 'ring', disabled: 'opacity' }
    }
  }

  return BUTTON_VARIANTS['button-filled']
}
