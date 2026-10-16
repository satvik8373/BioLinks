/**
 * Border Radius Scale Registry (10/10 Pure Architecture)
 * 
 * Maps radius IDs (`radius-none`, `radius-sm`, `radius-md`, `radius-lg`, `radius-xl`, `radius-full`) to pixel values.
 */

export const RADIUS_REGISTRY: Record<string, number> = {
  'radius-none': 0,
  'radius-sm': 6,
  'radius-md': 8,
  'radius-lg': 12,
  'radius-xl': 16,
  'radius-full': 9999
}

export function resolveRadius(radiusInput: any, defaultVal: number = 8): number {
  if (typeof radiusInput === 'number') return Number.isFinite(radiusInput) ? Math.max(0, radiusInput) : defaultVal
  if (typeof radiusInput === 'string') {
    const key = radiusInput.startsWith('radius-') ? radiusInput : `radius-${radiusInput}`
    if (RADIUS_REGISTRY[key] !== undefined) return RADIUS_REGISTRY[key]
    if (RADIUS_REGISTRY[radiusInput] !== undefined) return RADIUS_REGISTRY[radiusInput]
    if (/^\d+(\.\d+)?px$/.test(radiusInput)) return parseFloat(radiusInput)
  }
  return defaultVal
}
