import type { Theme } from '@/lib/themes'
import type { ThemeConfig } from '@/lib/theme-engine/types'
import { ThemeResolver } from '@/lib/theme-engine/runtime/ThemeResolver'
import { ThemeCompiler } from '@/lib/theme-engine/runtime/ThemeCompiler'
import { resolveRadius } from '@/lib/theme-engine/radius'
import { resolveShadow } from '@/lib/theme-engine/shadows'
import { ALL_JSON_CONFIGS } from './generated'

export { ALL_JSON_CONFIGS } from './generated'

/** One adapter for saved card/editor compatibility; all tokens use the compiler. */
export function jsonToLegacyTheme(config: ThemeConfig): Theme {
  const compiled = ThemeCompiler.compile(ThemeResolver.resolve(config))
  const { palette, background, components } = compiled
  const card = components.card
  const cardBackground = card.background && (/^(\/|\.\/|https?:\/\/)/.test(card.background) ? `url(${card.background})` : card.background)
  const shadow = resolveShadow(components.button.shadow)
  const specialty = {
    ...compiled.specialty,
    cardBackground: compiled.specialty?.cardBackground || cardBackground || (card.variant === 'glass' ? 'rgba(255,255,255,0.08)' : palette.surface),
    cardBorderRadius: `${resolveRadius(card.radius)}px`,
    cardBoxShadow: resolveShadow(card.shadow),
    ...(card.maxWidth && { cardMaxWidth: card.maxWidth }),
    cardPadding: card.padding || '24px 20px',
  }
  return {
    id: compiled.id, name: compiled.name, category: config.category,
    headerLayout: compiled.layout.headerLayout,
    colors: {
      background: background.value,
      backgroundMesh: ['mesh', 'pattern', 'gradient'].includes(background.type) ? background.value : undefined,
      backgroundType: (background.type === 'solid' ? 'color' : background.type === 'pattern' ? 'mesh' : background.type) as Theme['colors']['backgroundType'],
      backgroundImage: background.image, backgroundOverlay: background.overlay,
      buttonDefault: compiled.buttonColor, buttonHover: compiled.buttonColor, buttonText: compiled.buttonText,
      profileText: palette.text, profileBio: palette.textMuted, accent: compiled.accent,
    },
    buttonStyle: {
      borderRadius: resolveRadius(components.button.radius), borderWidth: components.button.borderWidth,
      borderColor: palette.border, shadow: shadow !== 'none',
      shadowStyle: shadow.includes('4px 4px') ? 'hard' : 'soft',
      boxShadow: shadow !== 'none' ? shadow : undefined, style: components.button.variant,
    },
    fonts: { heading: compiled.typography.headingFamily.split(',')[0].trim(), body: compiled.typography.fontFamily.split(',')[0].trim() },
    specialty,
    preview: background.value, isPremium: compiled.license.type === 'pro', isCurated: compiled.isCurated,
    author: String(config.meta?.collaborator || compiled.meta.author),
    avatarStyle: { shape: components.avatar.variant, size: components.avatar.size, borderWidth: components.avatar.borderWidth },
    effects: compiled.effects,
  }
}

export const MODULAR_THEMES: Theme[] = ALL_JSON_CONFIGS.map(jsonToLegacyTheme)
