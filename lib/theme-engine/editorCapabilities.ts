import { ThemePackage, ThemeCapabilities, EditorSchema } from './template-types'

/**
 * Enterprise Capabilities Engine
 * Allows the Theme Editor to automatically show/hide controls without hardcoding.
 */

export function canCustomizeControl(
  themePkg: Partial<ThemePackage>,
  section: keyof EditorSchema,
  control?: string
): boolean {
  const schema = themePkg.editor?.[section]
  if (!schema) return true // Default fallback if no explicit schema restriction
  if ('enabled' in schema && !schema.enabled) return false
  if (control && control in schema) {
    return Boolean((schema as any)[control])
  }
  return true
}

export function getSupportedHeaderVariants(themePkg: Partial<ThemePackage>): string[] {
  return themePkg.editor?.header?.variants || ['classic', 'hero', 'banner', 'shape']
}

export function getSupportedAvatarShapes(themePkg: Partial<ThemePackage>): string[] {
  return themePkg.editor?.avatar?.shapes || ['circle', 'rounded', 'square', 'blob']
}

export function getSupportedButtonVariants(themePkg: Partial<ThemePackage>): string[] {
  return themePkg.editor?.buttons?.variants || ['filled', 'glass', 'outline', 'minimal']
}

export function getSupportedBackgroundTypes(themePkg: Partial<ThemePackage>): string[] {
  return themePkg.editor?.background?.types || ['solid', 'gradient', 'mesh', 'image', 'video', 'pattern']
}

export function hasCapability(
  themePkg: Partial<ThemePackage>,
  capability: keyof ThemeCapabilities
): boolean {
  return Boolean(themePkg.capabilities?.[capability])
}
