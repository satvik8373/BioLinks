import { BASE_THEMES } from '@/lib/baseThemes'
import { mergeThemeValues } from '../merge'
import { getLicenseType } from '../types'
import { resolvePalette } from '../palettes'
import { resolveSpacing } from '../spacing'
import { resolveLayout } from '../layouts'
import { resolveBackground } from '@/lib/backgrounds'
import { resolveButtonVariant } from '../variants/button'
import { resolveCardVariant } from '../variants/card'
import { resolveAvatarVariant } from '../variants/avatar'

export interface UserThemeOverride {
  palette?: any
  background?: any
  typography?: any
  spacing?: any
  layout?: any
  components?: any
}

export class ThemeResolver {
  public static resolve(childTheme: any, userOverride?: UserThemeOverride): any {
    if (!childTheme) return childTheme
    const baseKey = childTheme.extends || 'base-minimal'
    const base = BASE_THEMES[baseKey] || BASE_THEMES['base-minimal']
    const child = { ...childTheme }
    child.palette = child.palette ?? child.colors ?? base.palette
    if (child.typography && typeof child.typography === 'object') {
      child.typography = { ...child.typography,
        font: child.typography.font ?? child.typography.bodyFont ?? child.typography.fontFamily,
        headingFont: child.typography.headingFont ?? child.typography.heading ?? child.typography.headingFamily,
      }
      for (const key of Object.keys(child.typography)) {
        if (child.typography[key] === undefined) delete child.typography[key]
      }
    }
    child.components = { ...child.components }
    for (const key of ['button', 'card', 'avatar', 'badge', 'social']) {
      if (child[key] !== undefined && child.components[key] === undefined) child.components[key] = child[key]
    }
    const inherited = mergeThemeValues(base, child)
    // A partial override on a registry ID must merge with that preset's
    // resolved tokens, rather than replacing the ID with an incomplete object.
    if (userOverride) {
      for (const [key, resolver] of Object.entries({ palette: resolvePalette, spacing: resolveSpacing, layout: resolveLayout, background: resolveBackground })) {
        if (typeof (userOverride as any)[key] === 'object' && typeof inherited[key] === 'string') inherited[key] = resolver(inherited[key])
      }
      if (typeof userOverride.typography === 'object' && typeof inherited.typography === 'string') {
        inherited.typography = { font: inherited.typography, headingFont: inherited.typography }
      }
      for (const [key, resolver] of Object.entries({ button: resolveButtonVariant, card: resolveCardVariant, avatar: resolveAvatarVariant })) {
        if (typeof userOverride.components?.[key] === 'object' && typeof inherited.components?.[key] === 'string') inherited.components[key] = resolver(inherited.components[key])
      }
    }
    const merged = mergeThemeValues(inherited, userOverride || {})
    return {
      ...merged,
      id: child.id,
      name: child.name,
      namespace: child.namespace || `theme-${child.id}`,
      extends: baseKey,
      license: { type: getLicenseType({ license: child.license ?? base.license, isPro: child.isPro }) },
      preview: child.preview || {},
      visibility: { avatar: true, bio: true, social: true, footer: true, ...merged.visibility },
      meta: { author: 'BioLinks', tags: [child.id], ...merged.meta },
      a11y: { contrast: 'AA', reducedMotion: true, ...merged.a11y },
    }
  }
}
