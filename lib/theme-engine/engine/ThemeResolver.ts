/**
 * Single Responsibility: Theme Resolver
 * 
 * Performs 3-tier runtime cascading merge: Base Theme → Theme Config → User Override Layer.
 */

import { BASE_THEMES } from '@/lib/baseThemes'

export interface UserThemeOverride {
  palette?: any
  background?: any
  typography?: any
  spacing?: any
  layout?: any
  components?: any
}

export class ThemeResolver {
  /**
   * Cascading merge: Base → Theme → User Custom Overrides
   */
  public static resolve(childTheme: any, userOverride?: UserThemeOverride): any {
    if (!childTheme) return childTheme
    const baseKey = childTheme.extends || 'base-minimal'
    const base = BASE_THEMES[baseKey] || BASE_THEMES['base-minimal']

    const merged = {
      version: childTheme.version || base.version || '1.0.0',
      id: childTheme.id,
      name: childTheme.name,
      namespace: childTheme.namespace || `theme-${childTheme.id}`,
      order: childTheme.order ?? 1,
      compatibility: { minVersion: '2.0.0', ...base.compatibility, ...childTheme.compatibility },
      extends: baseKey,
      category: childTheme.category || base.category,
      license: { type: childTheme.isPro ? 'pro' : (childTheme.license?.type || base.license?.type || 'free') },
      preview: { thumbnail: `${childTheme.id}.webp`, cover: `${childTheme.id}-cover.webp`, ...base.preview, ...childTheme.preview },
      supports: {
        imageBackground: true,
        videoBackground: true,
        animatedGradient: true,
        glass: baseKey === 'base-glass',
        clay: baseKey === 'base-clay',
        particles: false,
        customCursor: false,
        ...base.supports,
        ...childTheme.supports
      },
      visibility: {
        avatar: true,
        bio: true,
        social: true,
        footer: true,
        musicPlayer: false,
        ...base.visibility,
        ...childTheme.visibility
      },
      meta: {
        author: childTheme.meta?.author || 'BioLinks',
        createdAt: childTheme.meta?.createdAt || '2026-08-04',
        updatedAt: childTheme.meta?.updatedAt || '2026-08-04',
        tags: childTheme.meta?.tags || [childTheme.id, childTheme.category || 'theme']
      },
      a11y: {
        contrast: childTheme.a11y?.contrast || base.a11y?.contrast || 'AA',
        reducedMotion: childTheme.a11y?.reducedMotion ?? base.a11y?.reducedMotion ?? true
      },
      palette: userOverride?.palette || childTheme.palette || childTheme.colors || base.palette,
      background: userOverride?.background || childTheme.background || base.background,
      effects: { ...base.effects, ...childTheme.effects },
      animation: { ...base.animation, ...childTheme.animation },
      typography: userOverride?.typography || childTheme.typography || base.typography,
      spacing: userOverride?.spacing || childTheme.spacing || base.spacing,
      icon: { ...base.icon, ...childTheme.icon },
      link: { style: 'card', icon: 'left', arrow: true, ...base.link, ...childTheme.link },
      components: {
        button: userOverride?.components?.button || childTheme.components?.button || childTheme.button || base.components?.button || 'button-filled',
        card: userOverride?.components?.card || childTheme.components?.card || childTheme.card || base.components?.card || 'card-elevated',
        avatar: userOverride?.components?.avatar || childTheme.components?.avatar || childTheme.avatar || base.components?.avatar || 'avatar-circle',
        badge: userOverride?.components?.badge || childTheme.components?.badge || childTheme.badge || base.components?.badge || 'badge-soft',
        social: userOverride?.components?.social || childTheme.components?.social || childTheme.social || base.components?.social || 'social-rounded'
      },
      layout: userOverride?.layout || childTheme.layout || base.layout || 'layout-centered'
    }

    return merged
  }
}
