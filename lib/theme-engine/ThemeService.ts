import { ThemeResolver, type UserThemeOverride } from './runtime/ThemeResolver'
import { ThemeCompiler } from './runtime/ThemeCompiler'
import type { ResolvedTheme } from './runtime/ResolvedTheme'
import { Renderer } from './runtime/Renderer'
import { ThemeRegistry } from './runtime/ThemeRegistry'
import { ThemeValidator } from './runtime/Validator'
import { ThemeMigration } from './runtime/ThemeMigration'
import { ThemeCache } from './runtime/ThemeCache'
import { ThemeEventEmitter, type ThemeEventType, type ThemeEventListener } from './runtime/ThemeEventEmitter'
import { ThemeInspector } from './runtime/ThemeInspector'
import { ThemeEditorSession } from './editor/ThemeEditorSession'
import { ThemeExporter } from './builder/ThemeExporter'
import { ThemeImporter } from './builder/ThemeImporter'
import { ALL_JSON_CONFIGS } from '@/themes/generated'
import { getLicenseType, type ThemeConfig, type ThemeMetadata } from './types'

export type { ThemeConfig, ThemeMetadata } from './types'

/** Public entry point for validation, compilation, registration and rendering. */
export class ThemeService {
  private static initialized = false

  public static init(): void {
    if (this.initialized) return
    const registry = ThemeRegistry.getInstance()
    for (const config of ALL_JSON_CONFIGS) registry.registerTheme(config)
    this.initialized = true
  }

  public static getConfig(themeId: string): ThemeConfig | undefined {
    this.init()
    return ThemeRegistry.getInstance().getTheme(themeId)
  }

  public static register(config: ThemeConfig): void {
    this.init()
    const validation = ThemeValidator.validate(config)
    if (!validation.valid) throw new Error(validation.errors.join('; '))
    ThemeRegistry.getInstance().registerTheme(config)
    this.clearCache(config.id)
  }

  public static compile(themeInput: ThemeConfig | ResolvedTheme | string, userOverride?: UserThemeOverride): ResolvedTheme | null {
    const input = typeof themeInput === 'string' ? this.getConfig(themeInput) : themeInput
    if (!input) return null
    const migrated = ThemeMigration.migrate(input)
    const validation = ThemeValidator.validate(migrated)
    if (!validation.valid) throw new Error(validation.errors.join('; '))
    return ThemeCompiler.compile(ThemeResolver.resolve(migrated, userOverride))
  }

  public static async load(themeId: string): Promise<ResolvedTheme | null> {
    this.init()
    const cache = ThemeCache.getInstance()
    const cached = cache.getResolvedTokens(themeId)
    if (cached) return structuredClone(cached)
    const compiled = this.compile(themeId)
    if (!compiled) return null
    cache.setResolvedTokens(themeId, structuredClone(compiled))
    ThemeEventEmitter.getInstance().emit('loaded', structuredClone(compiled))
    return compiled
  }

  public static apply(themeInput: ThemeConfig | ResolvedTheme | string, userOverride?: UserThemeOverride): void {
    const compiled = this.compile(themeInput, userOverride)
    if (!compiled) return
    Renderer.render(compiled)
    ThemeEventEmitter.getInstance().emit('changed', compiled)
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('activeThemeId', compiled.id) } catch { /* Storage may be unavailable. */ }
    }
  }

  public static preview(themeInput: ThemeConfig | ResolvedTheme | string, userOverride?: UserThemeOverride): void {
    const compiled = this.compile(themeInput, userOverride)
    if (!compiled) return
    Renderer.render(compiled)
    ThemeEventEmitter.getInstance().emit('preview', compiled)
  }

  public static on(event: ThemeEventType, listener: ThemeEventListener): void {
    ThemeEventEmitter.getInstance().on(event, listener)
  }

  public static off(event: ThemeEventType, listener: ThemeEventListener): void {
    ThemeEventEmitter.getInstance().off(event, listener)
  }

  public static enableInspector(): void { ThemeInspector.enable() }
  public static disableInspector(): void { ThemeInspector.disable() }
  public static createEditorSession(initialTheme: any): ThemeEditorSession { return new ThemeEditorSession(initialTheme) }

  public static export(themeInput: ThemeConfig | ResolvedTheme | string): string {
    const compiled = this.compile(themeInput)
    if (!compiled) throw new Error(`Unknown theme: ${themeInput}`)
    ThemeEventEmitter.getInstance().emit('export', compiled)
    return ThemeExporter.exportToJSON(compiled)
  }

  public static download(themeInput: ThemeConfig | ResolvedTheme | string): void {
    const compiled = this.compile(themeInput)
    if (!compiled) throw new Error(`Unknown theme: ${themeInput}`)
    ThemeExporter.downloadThemeJSON(compiled)
  }

  public static import(jsonString: string): { success: boolean; config?: ThemeConfig; error?: string } {
    return ThemeImporter.parseAndValidate(jsonString)
  }

  public static getAvailableThemes(): ThemeMetadata[] {
    this.init()
    return ThemeRegistry.getInstance().getAllThemes().map(config => ({
      id: config.id, name: config.name, category: config.category,
      isPro: getLicenseType(config) === 'pro',
      isCurated: Boolean(config.isCurated ?? config.meta?.isCurated),
      previewUrl: config.preview?.thumbnail,
    }))
  }

  public static clearCache(themeId?: string): void { ThemeCache.getInstance().invalidate(themeId) }
}
