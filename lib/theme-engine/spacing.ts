/**
 * Spacing Scale Registry (10/10 Pure Architecture)
 * 
 * Maps spacing IDs (`spacing-tight`, `spacing-comfortable`, `spacing-loose`) to numeric tokens.
 */

export interface SpacingConfig {
  id: string
  name: string
  section: number
  component: number
  buttonGap: number
}

export const SPACING_REGISTRY: Record<string, SpacingConfig> = {
  'spacing-tight': {
    id: 'spacing-tight',
    name: 'Tight Compact Spacing',
    section: 24,
    component: 16,
    buttonGap: 8
  },
  'spacing-comfortable': {
    id: 'spacing-comfortable',
    name: 'Comfortable Standard Spacing',
    section: 32,
    component: 20,
    buttonGap: 12
  },
  'spacing-loose': {
    id: 'spacing-loose',
    name: 'Loose Airy Spacing',
    section: 40,
    component: 24,
    buttonGap: 16
  }
}

export function resolveSpacing(spacingInput: any): SpacingConfig {
  if (typeof spacingInput === 'string') {
    const key = spacingInput.startsWith('spacing-') ? spacingInput : `spacing-${spacingInput}`
    if (SPACING_REGISTRY[key]) return SPACING_REGISTRY[key]
    if (SPACING_REGISTRY[spacingInput]) return SPACING_REGISTRY[spacingInput]
  }

  if (typeof spacingInput === 'object' && spacingInput !== null) {
    return {
      id: 'custom-spacing',
      name: 'Custom Spacing',
      section: spacingInput.section || 32,
      component: spacingInput.component || 20,
      buttonGap: spacingInput.buttonGap || 12
    }
  }

  return SPACING_REGISTRY['spacing-comfortable']
}
