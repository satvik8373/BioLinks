import type { ThemeConfig } from '@/lib/themeEngine'
import type { Theme } from '@/lib/themes'
import { resolveBackground } from '@/lib/backgrounds'
import { resolveFontFamily } from '@/lib/fonts'
import { resolvePalette } from '@/lib/theme-engine/registries/palette'
import { resolveButtonVariant } from '@/lib/theme-engine/variants/button'
import { resolveRadius } from '@/lib/theme-engine/radius'
import { resolveShadow } from '@/lib/theme-engine/shadows'

// ── Theme Imports ────────────────────────────────────────────────────────────
import popBrutalistConfig from './pop-brutalist/config.json'
import arianaGrandeConfig from './ariana-grande/config.json'
import sunsetVibesConfig from './sunset-vibes/config.json'
import pastelDreamConfig from './pastel-dream/config.json'
import warmCoffeeConfig from './warm-coffee/config.json'
import softClayConfig from './soft-clay/config.json'
import skeuoWoodConfig from './skeuo-wood/config.json'
import retroLcdConfig from './retro-lcd/config.json'

export const ALL_JSON_CONFIGS: ThemeConfig[] = [
  popBrutalistConfig as unknown as ThemeConfig,
  arianaGrandeConfig as unknown as ThemeConfig,
  sunsetVibesConfig as unknown as ThemeConfig,
  pastelDreamConfig as unknown as ThemeConfig,
  warmCoffeeConfig as unknown as ThemeConfig,
  softClayConfig as unknown as ThemeConfig,
  skeuoWoodConfig as unknown as ThemeConfig,
  retroLcdConfig as unknown as ThemeConfig,
]

export function jsonToLegacyTheme(config: any): Theme {
  const palette = resolvePalette(config.palette || config.colors)
  const bgObj = resolveBackground(config.background || palette.surface)
  const fontObj = typeof config.typography === 'object'
    ? config.typography
    : { font: config.typography, headingFont: config.typography }
  const btnSpec = resolveButtonVariant(config.components?.button || config.button)
  const btnRadiusPx = resolveRadius(btnSpec.radius, 8)
  const btnShadowCss = resolveShadow(btnSpec.shadow)

  // Map category for display grouping
  const cat = config.category || 'minimal'
  const mappedCat = (cat === 'luxury' || cat === 'glass') ? 'dark' : cat

  return {
    id: config.id,
    name: config.name,
    category: mappedCat as any,
    colors: {
      background: bgObj.value,
      backgroundMesh: (config.background as any)?.mesh || (bgObj.type === 'mesh' || bgObj.type === 'pattern' ? bgObj.value : undefined),
      backgroundType: (config.background as any)?.type || bgObj.type,
      backgroundImage: bgObj.image,
      backgroundOverlay: bgObj.overlay,
      buttonDefault: config.buttonColor || palette.brand,
      buttonHover: config.buttonColor || palette.brand,
      // config.buttonText lets a theme override the auto-computed text colour
      buttonText: config.buttonText || palette.text,
      profileText: palette.text,
      profileBio: palette.textMuted,
      // config.accent lets a theme set a distinct accent colour that differs from buttonDefault
      accent: config.accent || palette.brand,
    },
    buttonStyle: {
      borderRadius: btnRadiusPx,
      borderWidth: btnSpec.borderWidth ?? 1,
      borderColor: palette.border,
      shadow: btnShadowCss !== 'none',
      shadowStyle: btnShadowCss.includes('4px') ? 'hard' : 'soft',
      // Store the full resolved CSS string so buildBtnStyle can use it directly
      boxShadow: btnShadowCss !== 'none' ? btnShadowCss : undefined,
      style: btnSpec.variant as any,
    },
    fonts: {
      heading: resolveFontFamily(fontObj?.heading || fontObj?.headingFont, 'Inter').split(',')[0].trim(),
      body: resolveFontFamily(fontObj?.font || fontObj?.bodyFont, 'Inter').split(',')[0].trim(),
    },
    specialty: config.specialty
      ? { ...config.specialty }
      : undefined,
    // ── Card panel specialty tokens ────────────────────────────────────────
    // Populated from config.components.card so each theme controls its own
    // card surface appearance without any hardcoded values in BioCard.
    // NOTE: We intentionally do NOT call resolveBackground() on card.background
    //       because resolveBackground is designed for page-level backgrounds and
    //       sets a `.image` property which would bleed into colors.backgroundImage
    //       and cause a duplicate full-page background overlay.
    ...(config.components?.card && (() => {
      const card = config.components.card

      // If specialty.cardBackground is already explicitly set in the JSON config,
      // skip computing it from components.card.background to avoid duplication.
      const specialtyAlreadyHasCardBg = Boolean(config.specialty?.cardBackground)

      let cardBg: string | undefined = undefined
      if (!specialtyAlreadyHasCardBg && card.background) {
        const rawBg = card.background as string
        // For image file paths (e.g. /wallpapers/light-wood.webp), wrap in url()
        // For gradients and solid colors, use as-is
        if (
          rawBg.startsWith('/') ||
          rawBg.startsWith('./') ||
          rawBg.startsWith('http') ||
          (rawBg.includes('.webp') || rawBg.includes('.jpg') || rawBg.includes('.png') || rawBg.includes('.gif'))
        ) {
          cardBg = `url(${rawBg})`
        } else if (!rawBg.startsWith('url(')) {
          // gradient or solid color — use directly
          cardBg = rawBg
        } else {
          cardBg = rawBg
        }
      }

      const cardRadius = card.radius != null
        ? (typeof card.radius === 'number' ? `${card.radius}px` : resolveRadius(card.radius, 8) + 'px')
        : undefined
      const cardShadow = card.shadow ? resolveShadow(card.shadow) : undefined
      if (!cardBg && !cardRadius && !cardShadow) return {}
      return {
        specialty: {
          ...(config.specialty || {}),
          ...(cardBg     && { cardBackground:   cardBg }),
          ...(cardRadius && { cardBorderRadius: cardRadius }),
          ...(cardShadow && { cardBoxShadow:    cardShadow }),
          ...(card.maxWidth  && { cardMaxWidth:  card.maxWidth }),
          ...(card.padding   && { cardPadding:   card.padding }),
        }
      }
    })()),
    preview: bgObj.value,
    isPremium: config.license?.type === 'pro' || config.isPro || false,
    isCurated: false,
    author: config.meta?.collaborator || config.meta?.author || 'Julien Vier',
  }
}

export const MODULAR_THEMES: Theme[] = ALL_JSON_CONFIGS.map(jsonToLegacyTheme)
