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

export const ALL_JSON_CONFIGS: ThemeConfig[] = [
  popBrutalistConfig as unknown as ThemeConfig,
  arianaGrandeConfig as unknown as ThemeConfig,
  sunsetVibesConfig as unknown as ThemeConfig,
  pastelDreamConfig as unknown as ThemeConfig,
  warmCoffeeConfig as unknown as ThemeConfig,
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
      backgroundMesh: bgObj.type === 'mesh' ? bgObj.value : undefined,
      backgroundImage: bgObj.image,
      backgroundOverlay: bgObj.overlay,
      buttonDefault: palette.brand,
      buttonHover: palette.brand,
      buttonText: palette.text,
      profileText: palette.text,
      profileBio: palette.textMuted,
      accent: palette.brand,
    },
    buttonStyle: {
      borderRadius: btnRadiusPx,
      borderWidth: btnSpec.borderWidth ?? 1,
      borderColor: palette.border,
      shadow: btnShadowCss !== 'none',
      shadowStyle: btnShadowCss.includes('4px') ? 'hard' : 'soft',
      style: btnSpec.variant as any,
    },
    fonts: {
      heading: resolveFontFamily(fontObj?.heading || fontObj?.headingFont, 'Inter').split(',')[0].trim(),
      body: resolveFontFamily(fontObj?.font || fontObj?.bodyFont, 'Inter').split(',')[0].trim(),
    },
    preview: bgObj.value,
    isPremium: config.license?.type === 'pro' || config.isPro || false,
    isCurated: false,
    author: config.meta?.collaborator || config.meta?.author || 'Julien Vier',
  }
}

export const MODULAR_THEMES: Theme[] = ALL_JSON_CONFIGS.map(jsonToLegacyTheme)
