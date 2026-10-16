import type { ThemeConfig } from '../types'

/** Owns raw configurations. Call ThemeService.register to invalidate caches. */
export class ThemeRegistry {
  private static instance: ThemeRegistry
  private themesMap = new Map<string, ThemeConfig>()
  private constructor() {}
  public static getInstance(): ThemeRegistry {
    if (!this.instance) this.instance = new ThemeRegistry()
    return this.instance
  }
  public registerTheme(config: ThemeConfig): void {
    this.themesMap.set(config.id, structuredClone(config))
  }
  public getTheme(id: string): ThemeConfig | undefined {
    const theme = this.themesMap.get(id)
    return theme ? structuredClone(theme) : undefined
  }
  public getAllThemes(): ThemeConfig[] {
    return Array.from(this.themesMap.values(), config => structuredClone(config))
  }
}
