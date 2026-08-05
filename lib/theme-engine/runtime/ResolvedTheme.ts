/**
 * Immutable Compiled Theme Interface
 * 
 * Typed representation of a compiled theme where all registry IDs have been resolved into object references.
 */

import { SemanticPalette } from '../palettes'
import { SpacingConfig } from '../spacing'
import { LayoutConfig } from '../layouts'
import { ButtonVariantSpec } from '../variants/button'
import { CardVariantSpec } from '../variants/card'
import { AvatarVariantSpec } from '../variants/avatar'
import { BadgeVariantSpec, SocialVariantSpec } from '../badge-variants'

export interface ResolvedTheme {
  version: string
  id: string
  name: string
  namespace: string
  order: number
  extends: string
  category: string
  license: { type: 'free' | 'pro' | 'marketplace' | 'community' }
  compatibility: { minVersion: string }
  preview: { thumbnail: string; cover: string }
  supports: Record<string, boolean>
  visibility: Record<string, boolean>
  meta: { author: string; createdAt: string; updatedAt: string; tags: string[] }
  a11y: { contrast: 'AA' | 'AAA'; reducedMotion: boolean }
  
  // Compiled Typed Object References
  background: { value: string; image?: string; overlay?: string; type: string }
  palette: SemanticPalette
  typography: {
    font: string
    headingFont: string
    fontFamily: string
    headingFamily: string
    headingWeight: number
    bodyWeight: number
    buttonWeight: number
  }
  spacing: SpacingConfig
  layout: LayoutConfig
  link: { style: string; icon: string; arrow: boolean }
  components: {
    button: ButtonVariantSpec
    card: CardVariantSpec
    avatar: AvatarVariantSpec
    badge: BadgeVariantSpec
    social: SocialVariantSpec
  }
  effects?: { glass?: boolean; clay?: boolean; noise?: boolean; glow?: boolean; blur?: number }
  animation?: { hover?: string; page?: string; duration?: number; easing?: string }
}
