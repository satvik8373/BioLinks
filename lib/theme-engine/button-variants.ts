/**
 * Button Component Variant Registry (10/10 Pure Architecture)
 * 
 * Defines implementation specs for button-soft, button-filled, button-glass, button-clay, button-outline.
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
  }
}

export function resolveButtonVariant(input: any): ButtonVariantSpec {
  if (typeof input === 'string') {
    const key = input.startsWith('button-') ? input : `button-${input}`
    if (BUTTON_VARIANTS[key]) return BUTTON_VARIANTS[key]
    if (BUTTON_VARIANTS[input]) return BUTTON_VARIANTS[input]
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

  return BUTTON_VARIANTS['button-filled']
}
