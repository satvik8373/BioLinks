/**
 * 🏆 ThemeService — Single Unified Public Facade API (10/10 Enterprise SaaS Architecture)
 * 
 * Pipeline:
 * Theme JSON → Validator → Migration → Resolver → Compiler → Cache → Renderer → DOM
 */

import { ThemeResolver, UserThemeOverride } from './runtime/ThemeResolver'
import { ThemeCompiler } from './runtime/ThemeCompiler'
import { ResolvedTheme } from './runtime/ResolvedTheme'
import { Renderer } from './runtime/Renderer'
import { ThemeRegistry } from './runtime/ThemeRegistry'
import { ThemeValidator } from './runtime/Validator'
import { ThemeMigration } from './runtime/ThemeMigration'
import { ThemeCache } from './runtime/ThemeCache'
import { ThemeEventEmitter, ThemeEventType, ThemeEventListener } from './runtime/ThemeEventEmitter'
import { ThemeInspector } from './runtime/ThemeInspector'
import { ThemeEditorSession } from './editor/ThemeEditorSession'
import { ThemeExporter } from './builder/ThemeExporter'
import { ThemeImporter } from './builder/ThemeImporter'
import { ALL_JSON_CONFIGS } from '@/themes'
import themeManifest from '@/themes/manifest.json'

export interface ThemeConfig {
  version?: string
  id: string
  name: string
  namespace?: string
  order?: number
  extends?: string
  category: 'minimal' | 'glass' | 'clay' | 'luxury' | 'gradient' | 'custom' | 'skeuomorphic'
  license?: { type: 'free' | 'pro' | 'marketplace' | 'community' }
  compatibility?: { minVersion?: string }
  preview?: { thumbnail?: string; cover?: string }
  supports?: any
  visibility?: any
  meta?: any
  a11y?: any
  background?: any
  palette?: any
  typography?: any
  spacing?: any
  layout?: any
  link?: any
  components?: any
  isPro?: boolean
  colors?: any
  button?: any
  card?: any
  avatar?: any
}

export interface ThemeMetadata {
  id: string
  name: string
  category: string
  isPro: boolean
  previewUrl?: string
}

export class ThemeService {
  public static init(): void {
    const reg = ThemeRegistry.getInstance()
    ALL_JSON_CONFIGS.forEach(t => reg.registerTheme(t))
  }

  /**
   * Complete Pipeline:
   * Theme JSON → Validator → Migration → Resolver → Compiler → ResolvedTheme
   */
  public static async load(themeId: string): Promise<ResolvedTheme | null> {
    this.init()
    const cache = ThemeCache.getInstance()
    const reg = ThemeRegistry.getInstance()

    // 1. Check ThemeCache
    const cachedTheme = cache.getResolvedTokens(themeId)
    if (cachedTheme) return cachedTheme

    let rawConfig = reg.getTheme(themeId) || ALL_JSON_CONFIGS.find(t => t.id === themeId)

    if (!rawConfig) {
      try {
        const response = await fetch(`/themes/${themeId}/config.json`)
        if (!response.ok) return null
        rawConfig = await response.json()
        reg.registerTheme(rawConfig)
      } catch {
        return null
      }
    }

    if (!rawConfig) return null

    // 2. Migration
    const migrated = ThemeMigration.migrate(rawConfig)

    // 3. Validator
    const validation = ThemeValidator.validate(migrated)
    if (!validation.valid) {
      console.warn(`Theme ${themeId} validation warnings:`, validation.errors)
    }

    // 4. Resolver
    const resolvedRaw = ThemeResolver.resolve(migrated)

    // 5. Compiler
    const compiledTheme = ThemeCompiler.compile(resolvedRaw)

    // Cache compiled theme
    cache.setResolvedTokens(themeId, compiledTheme)

    // Emit event
    ThemeEventEmitter.getInstance().emit('loaded', compiledTheme)

    return compiledTheme
  }

  /**
   * Pipeline: ResolvedTheme → Renderer → DOM
   */
  public static apply(themeInput: any, userOverride?: UserThemeOverride): void {
    this.init()
    const rawTheme = typeof themeInput === 'string'
      ? ThemeRegistry.getInstance().getTheme(themeInput) || ALL_JSON_CONFIGS.find(t => t.id === themeInput)
      : themeInput

    if (!rawTheme) return

    const migrated = ThemeMigration.migrate(rawTheme)
    const resolvedRaw = ThemeResolver.resolve(migrated, userOverride)
    const compiledTheme = ThemeCompiler.compile(resolvedRaw)

    Renderer.render(compiledTheme)
    ThemeEventEmitter.getInstance().emit('changed', compiledTheme)

    if (typeof window !== 'undefined' && compiledTheme.id) {
      localStorage.setItem('activeThemeId', compiledTheme.id)
    }
  }

  /**
   * Transient editor preview without mutating active storage
   */
  public static preview(themeInput: any, userOverride?: UserThemeOverride): void {
    this.init()
    const rawTheme = typeof themeInput === 'string'
      ? ThemeRegistry.getInstance().getTheme(themeInput) || ALL_JSON_CONFIGS.find(t => t.id === themeInput)
      : themeInput

    if (!rawTheme) return

    const migrated = ThemeMigration.migrate(rawTheme)
    const resolvedRaw = ThemeResolver.resolve(migrated, userOverride)
    const compiledTheme = ThemeCompiler.compile(resolvedRaw)

    Renderer.render(compiledTheme)
    ThemeEventEmitter.getInstance().emit('preview', compiledTheme)
  }

  /**
   * Subscribe to Theme Engine Events
   */
  public static on(event: ThemeEventType, listener: ThemeEventListener): void {
    ThemeEventEmitter.getInstance().on(event, listener)
  }

  /**
   * Unsubscribe from Theme Engine Events
   */
  public static off(event: ThemeEventType, listener: ThemeEventListener): void {
    ThemeEventEmitter.getInstance().off(event, listener)
  }

  /**
   * Enable Dev Mode Theme Inspector
   */
  public static enableInspector(): void {
    ThemeInspector.enable()
  }

  /**
   * Disable Dev Mode Theme Inspector
   */
  public static disableInspector(): void {
    ThemeInspector.disable()
  }

  /**
   * Create isolated Editor Session for transient customization
   */
  public static createEditorSession(initialTheme: any): ThemeEditorSession {
    return new ThemeEditorSession(initialTheme)
  }

  /**
   * Export theme to JSON string
   */
  public static export(themeInput: any): string {
    const rawTheme = typeof themeInput === 'string'
      ? ThemeRegistry.getInstance().getTheme(themeInput) || ALL_JSON_CONFIGS.find(t => t.id === themeInput)
      : themeInput
    const resolvedRaw = ThemeResolver.resolve(rawTheme)
    const compiledTheme = ThemeCompiler.compile(resolvedRaw)
    ThemeEventEmitter.getInstance().emit('export', compiledTheme)
    return ThemeExporter.exportToJSON(compiledTheme)
  }

  /**
   * Download theme JSON file
   */
  public static download(themeInput: any): void {
    const rawTheme = typeof themeInput === 'string'
      ? ThemeRegistry.getInstance().getTheme(themeInput) || ALL_JSON_CONFIGS.find(t => t.id === themeInput)
      : themeInput
    const resolvedRaw = ThemeResolver.resolve(rawTheme)
    const compiledTheme = ThemeCompiler.compile(resolvedRaw)
    ThemeExporter.downloadThemeJSON(compiledTheme)
  }

  /**
   * Import custom theme JSON payload
   */
  public static import(jsonString: string): { success: boolean; config?: any; error?: string } {
    return ThemeImporter.parseAndValidate(jsonString)
  }

  /**
   * Fast metadata listing via theme manifest
   */
  public static getAvailableThemes(): ThemeMetadata[] {
    return (themeManifest.themes as any[]).map(t => ({
      id: t.id,
      name: t.name,
      category: t.category,
      isPro: t.license === 'pro',
      previewUrl: t.preview
    }))
  }

  /**
   * Invalidate theme cache
   */
  public static clearCache(themeId?: string): void {
    ThemeCache.getInstance().invalidate(themeId)
  }
}
