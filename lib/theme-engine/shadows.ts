/**
 * Shadow Token Registry (10/10 Pure Architecture)
 * 
 * Maps shadow IDs (`shadow-soft`, `shadow-glass`, `shadow-clay`, `shadow-hard`) to box-shadow CSS strings.
 */

export const SHADOW_REGISTRY: Record<string, string> = {
  'shadow-none': 'none',
  'shadow-soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
  'shadow-md': '0 4px 12px rgba(0, 0, 0, 0.12)',
  'shadow-lg': '0 10px 25px rgba(0, 0, 0, 0.15)',
  'shadow-xl': '0 20px 30px rgba(0, 0, 0, 0.2)',
  'shadow-glass': '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
  'shadow-clay': '8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.5)',
  'shadow-hard': '4px 4px 0px rgba(0, 0, 0, 1)'
}

export function resolveShadow(shadowInput?: string): string {
  if (!shadowInput) return SHADOW_REGISTRY['shadow-soft']
  const key = shadowInput.startsWith('shadow-') ? shadowInput : `shadow-${shadowInput}`
  if (SHADOW_REGISTRY[key]) return SHADOW_REGISTRY[key]
  if (SHADOW_REGISTRY[shadowInput]) return SHADOW_REGISTRY[shadowInput]
  return shadowInput
}
