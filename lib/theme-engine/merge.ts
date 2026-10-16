/** Merge plain token objects; strings and arrays replace the previous value. */
export function mergeThemeValues(base: any, override: any): any {
  if (override === undefined) return structuredClone(base)
  if (!isRecord(base) || !isRecord(override)) return structuredClone(override)
  const result = structuredClone(base)
  for (const key of Object.keys(override)) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) continue
    result[key] = mergeThemeValues(base[key], override[key])
  }
  return result
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
