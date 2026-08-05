/**
 * Single Responsibility: Theme Registry & Singleton Store
 */

export class ThemeRegistry {
  private static instance: ThemeRegistry
  private themesMap: Map<string, any> = new Map()

  private constructor() {}

  public static getInstance(): ThemeRegistry {
    if (!ThemeRegistry.instance) {
      ThemeRegistry.instance = new ThemeRegistry()
    }
    return ThemeRegistry.instance
  }

  public registerTheme(config: any): void {
    if (config?.id) {
      this.themesMap.set(config.id, config)
    }
  }

  public getTheme(id: string): any | undefined {
    return this.themesMap.get(id)
  }

  public getAllThemes(): any[] {
    return Array.from(this.themesMap.values())
  }
}
