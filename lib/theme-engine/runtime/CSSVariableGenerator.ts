/**
 * Runtime: CSS Variable Generator Stage
 * 
 * Takes compiled ResolvedTheme object and outputs categorized, scoped `--bl-` CSS custom properties.
 */

import { ResolvedTheme } from './ResolvedTheme'
import { resolveRadius } from '../radius'
import { resolveShadow } from '../shadows'

export class CSSVariableGenerator {
  public static generate(theme: ResolvedTheme): Record<string, string> {
    const vars: Record<string, string> = {}

    // 1. Color Tokens (--bl-color-*)
    vars['--bl-color-brand'] = theme.palette.brand
    vars['--bl-color-surface'] = theme.palette.surface
    vars['--bl-color-surface-alt'] = theme.palette.surfaceAlt
    vars['--bl-color-text'] = theme.palette.text
    vars['--bl-color-text-secondary'] = theme.palette.textMuted
    vars['--bl-color-text-muted'] = theme.palette.textMuted
    vars['--bl-color-border'] = theme.palette.border
    vars['--bl-color-success'] = theme.palette.success
    vars['--bl-color-warning'] = theme.palette.warning
    vars['--bl-color-danger'] = theme.palette.danger
    vars['--bl-color-background'] = theme.background.value

    // Background Media & Graphics
    const bgImgUrl = theme.background.image ? (theme.background.image.startsWith('url(') ? theme.background.image : `url(${theme.background.image})`) : (theme.background.value.startsWith('url(') ? theme.background.value : 'none')
    vars['--bl-background-image'] = bgImgUrl
    vars['--bl-background-overlay'] = theme.background.overlay || 'transparent'

    // Legacy Color Fallbacks
    vars['--color-background'] = theme.background.value
    vars['--background-image'] = bgImgUrl
    vars['--background-overlay'] = theme.background.overlay || 'transparent'
    vars['--color-surface'] = theme.palette.surface
    vars['--color-text'] = theme.palette.text
    vars['--color-text-secondary'] = theme.palette.textMuted
    vars['--color-primary'] = theme.palette.brand
    vars['--color-primary-hover'] = theme.palette.brand
    vars['--color-border'] = theme.palette.border
    vars['--color-accent'] = theme.accent
    vars['--color-button'] = theme.buttonColor
    vars['--color-button-hover'] = theme.buttonColor
    vars['--color-button-text'] = theme.buttonText
    vars['--color-profile-text'] = theme.palette.text
    vars['--color-profile-bio'] = theme.palette.textMuted
    vars['--background-mesh'] = ['mesh', 'pattern', 'gradient'].includes(theme.background.type) ? theme.background.value : 'none'

    // 2. Font Tokens (--bl-font-*)
    vars['--bl-font-family'] = theme.typography.fontFamily
    vars['--bl-font-family-heading'] = theme.typography.headingFamily
    vars['--font-family'] = theme.typography.fontFamily
    vars['--font-family-heading'] = theme.typography.headingFamily

    // 3. Spacing Tokens (--bl-spacing-*)
    vars['--bl-spacing-section'] = `${theme.spacing.section}px`
    vars['--bl-spacing-component'] = `${theme.spacing.component}px`
    vars['--bl-spacing-button-gap'] = `${theme.spacing.buttonGap}px`
    vars['--spacing-section'] = `${theme.spacing.section}px`
    vars['--spacing-component'] = `${theme.spacing.component}px`
    vars['--spacing-button-gap'] = `${theme.spacing.buttonGap}px`
    vars['--layout-spacing'] = `${theme.spacing.buttonGap}px`

    // 4. Layout Tokens (--bl-layout-*)
    vars['--bl-layout-max-width'] = `${theme.layout.maxWidth}px`

    // 5. Component Tokens (--bl-button-*, --bl-card-*, --bl-avatar-*)
    const btnRadiusRaw = resolveRadius(theme.components.button.radius, 8)
    const cardRadiusRaw = resolveRadius(theme.components.card.radius, 6)
    const btnRadiusPx = btnRadiusRaw
    const cardRadiusPx = cardRadiusRaw
    const btnShadowCss = resolveShadow(theme.components.button.shadow)
    const cardShadowCss = resolveShadow(theme.components.card.shadow)

    vars['--bl-button-radius'] = `${btnRadiusPx}px`
    vars['--bl-button-border-width'] = `${theme.components.button.borderWidth}px`
    vars['--bl-button-variant'] = theme.components.button.variant
    vars['--bl-button-shadow'] = btnShadowCss

    vars['--button-radius'] = `${btnRadiusPx}px`
    vars['--radius-button'] = `${btnRadiusPx}px`
    vars['--button-border-width'] = `${theme.components.button.borderWidth}px`
    vars['--border-button-color'] = theme.palette.border
    vars['--button-variant'] = theme.components.button.variant
    vars['--button-shadow'] = btnShadowCss
    vars['--shadow-button'] = btnShadowCss

    vars['--bl-card-radius'] = `${cardRadiusPx}px`
    vars['--bl-card-variant'] = theme.components.card.variant
    vars['--bl-card-shadow'] = cardShadowCss
    vars['--card-radius'] = `${cardRadiusPx}px`
    vars['--radius-card'] = `${cardRadiusPx}px`
    vars['--radius-video-card'] = `${cardRadiusPx}px`
    vars['--card-variant'] = theme.components.card.variant

    vars['--bl-avatar-size'] = `${theme.components.avatar.size}px`
    vars['--bl-avatar-radius'] = theme.components.avatar.variant === 'circle' ? '50%' : (theme.components.avatar.variant === 'rounded' ? '12px' : '0px')
    vars['--avatar-size'] = `${theme.components.avatar.size}px`
    vars['--avatar-radius'] = theme.components.avatar.variant === 'circle' ? '50%' : (theme.components.avatar.variant === 'rounded' ? '12px' : '0px')

    // 6. Effects
    if (theme.effects) {
      vars['--effects-blur'] = `${theme.effects.blur || 0}px`
      vars['--effects-glass'] = theme.effects.glass ? '1' : '0'
      vars['--effects-clay'] = theme.effects.clay ? '1' : '0'
    }

    // 7. Video Card Styling
    const isDark = theme.category === 'glass' || theme.palette.surface === '#0A0A0A' || theme.palette.surface === '#0F172A' || String(theme.background.value).includes('#120c')
    const defaultBg = theme.components.button.variant === 'glass' ? 'rgba(255, 255, 255, 0.08)' : (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.85)')
    const videoCardBg = String(theme.palette.brand).startsWith('linear-gradient') ? defaultBg : (String(theme.palette.brand).startsWith('#') ? `${theme.palette.brand}22` : theme.palette.brand)

    vars['--color-video-card-bg'] = videoCardBg
    vars['--color-video-card-border'] = theme.palette.border
    vars['--color-video-card-text'] = theme.palette.text
    vars['--radius-video-card'] = `${cardRadiusPx}px`

    return vars
  }
}
