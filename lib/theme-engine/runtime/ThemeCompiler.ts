/**
 * Runtime: Theme Compiler Stage
 * 
 * Compiles raw/merged theme configurations into immutable, typed ResolvedTheme objects.
 * Resolves all registry IDs (palette, spacing, radius, shadow, font, layout, button, card, avatar) into object references.
 */

import { ResolvedTheme } from './ResolvedTheme'
import { resolvePalette } from '../palettes'
import { resolveSpacing } from '../spacing'
import { resolveLayout } from '../layouts'
import { resolveBackground } from '@/lib/backgrounds'
import { resolveFontFamily } from '@/lib/fonts'
import { resolveButtonVariant } from '../variants/button'
import { resolveCardVariant } from '../variants/card'
import { resolveAvatarVariant } from '../variants/avatar'
import { resolveBadgeVariant, resolveSocialVariant } from '../badge-variants'

export class ThemeCompiler {
  public static compile(mergedConfig: any): ResolvedTheme {
    const palette = resolvePalette(mergedConfig.palette || mergedConfig.colors)
    const spacing = resolveSpacing(mergedConfig.spacing)
    const layout = resolveLayout(mergedConfig.layout)
    const background = resolveBackground(mergedConfig.background || palette.surface)

    const fontObj = typeof mergedConfig.typography === 'object' ? mergedConfig.typography : { font: mergedConfig.typography, headingFont: mergedConfig.typography }
    const bodyFontFamily = resolveFontFamily(fontObj?.font || fontObj?.bodyFont || fontObj?.fontFamily, 'Inter, sans-serif')
    const headingFontFamily = resolveFontFamily(fontObj?.headingFont || fontObj?.heading || fontObj?.headingFamily, bodyFontFamily)

    const buttonVariant = resolveButtonVariant(mergedConfig.components?.button || mergedConfig.button)
    const cardVariant = resolveCardVariant(mergedConfig.components?.card || mergedConfig.card)
    const avatarVariant = resolveAvatarVariant(mergedConfig.components?.avatar || mergedConfig.avatar)
    const badgeVariant = resolveBadgeVariant(mergedConfig.components?.badge || mergedConfig.badge)
    const socialVariant = resolveSocialVariant(mergedConfig.components?.social || mergedConfig.social)

    const compiled: ResolvedTheme = {
      version: mergedConfig.version || '1.0.0',
      id: mergedConfig.id,
      name: mergedConfig.name,
      namespace: mergedConfig.namespace || `theme-${mergedConfig.id}`,
      order: mergedConfig.order ?? 1,
      extends: mergedConfig.extends || 'base-minimal',
      category: mergedConfig.category || 'minimal',
      license: mergedConfig.license || { type: 'free' },
      compatibility: mergedConfig.compatibility || { minVersion: '2.0.0' },
      preview: mergedConfig.preview || { thumbnail: `${mergedConfig.id}.webp`, cover: `${mergedConfig.id}-cover.webp` },
      supports: mergedConfig.supports || { videoBackground: true, glass: false, clay: false },
      visibility: mergedConfig.visibility || { avatar: true, bio: true, social: true, footer: true },
      meta: mergedConfig.meta || { author: 'BioLinks', createdAt: '2026-08-04', updatedAt: '2026-08-04', tags: [mergedConfig.id] },
      a11y: mergedConfig.a11y || { contrast: 'AA', reducedMotion: true },
      background,
      palette,
      typography: {
        font: fontObj?.font || 'font-inter',
        headingFont: fontObj?.headingFont || fontObj?.heading || 'font-inter',
        fontFamily: bodyFontFamily,
        headingFamily: headingFontFamily,
        headingWeight: fontObj?.headingWeight || 700,
        bodyWeight: fontObj?.bodyWeight || 400,
        buttonWeight: fontObj?.buttonWeight || 600
      },
      spacing,
      layout,
      link: mergedConfig.link || { style: 'card', icon: 'left', arrow: true },
      components: {
        button: buttonVariant,
        card: cardVariant,
        avatar: avatarVariant,
        badge: badgeVariant,
        social: socialVariant
      },
      effects: mergedConfig.effects,
      animation: mergedConfig.animation,
      buttonColor: mergedConfig.buttonColor ?? palette.brand,
      buttonText: mergedConfig.buttonText ?? palette.text,
      accent: mergedConfig.accent ?? palette.brand,
      specialty: mergedConfig.specialty,
      isCurated: Boolean(mergedConfig.isCurated ?? mergedConfig.meta?.isCurated),
    }

    return compiled
  }
}
