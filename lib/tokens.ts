/**
 * Global Design Tokens Registry
 * 
 * Centralized design tokens for Shadows, Border Radii, and Spacing presets.
 */

export const SHADOW_TOKENS: Record<string, string> = {
  'none': 'none',
  'shadow-soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
  'shadow-md': '0 4px 12px rgba(0, 0, 0, 0.12)',
  'shadow-lg': '0 10px 25px rgba(0, 0, 0, 0.15)',
  'shadow-xl': '0 20px 30px rgba(0, 0, 0, 0.2)',
  'shadow-glass': '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
  'shadow-clay': '8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.5)',
  'shadow-hard': '4px 4px 0px rgba(0, 0, 0, 1)'
}

export const RADIUS_TOKENS: Record<string, number> = {
  'none': 0,
  'sm': 6,
  'md': 8,
  'lg': 12,
  'xl': 16,
  'full': 9999
}

export const SPACING_TOKENS: Record<string, { section: number; component: number; buttonGap: number }> = {
  'tight': { section: 24, component: 16, buttonGap: 8 },
  'comfortable': { section: 32, component: 20, buttonGap: 12 },
  'loose': { section: 40, component: 24, buttonGap: 16 }
}

export function resolveRadiusToken(val: string | number | undefined, defaultVal: number = 8): number {
  if (typeof val === 'number') return val > 20 ? 10 : Math.min(val, 8)
  if (typeof val === 'string' && RADIUS_TOKENS[val] !== undefined) {
    return RADIUS_TOKENS[val]
  }
  return defaultVal
}

export function resolveShadowToken(val: string | undefined): string {
  if (!val) return SHADOW_TOKENS['shadow-soft']
  return SHADOW_TOKENS[val] || val
}
