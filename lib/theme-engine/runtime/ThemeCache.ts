/**
 * Runtime: High-Performance Theme Cache
 * 
 * Caches resolved design tokens and generated CSS variable dictionaries to eliminate redundant calculations.
 */

export class ThemeCache {
  private static instance: ThemeCache
  private resolvedTokensCache: Map<string, any> = new Map()
  private cssVariablesCache: Map<string, Record<string, string>> = new Map()

  private constructor() {}

  public static getInstance(): ThemeCache {
    if (!ThemeCache.instance) {
      ThemeCache.instance = new ThemeCache()
    }
    return ThemeCache.instance
  }

  public getResolvedTokens(key: string): any | undefined {
    return this.resolvedTokensCache.get(key)
  }

  public setResolvedTokens(key: string, tokens: any): void {
    this.resolvedTokensCache.set(key, tokens)
  }

  public getCSSVariables(key: string): Record<string, string> | undefined {
    return this.cssVariablesCache.get(key)
  }

  public setCSSVariables(key: string, vars: Record<string, string>): void {
    this.cssVariablesCache.set(key, vars)
  }

  public invalidate(key?: string): void {
    if (key) {
      this.resolvedTokensCache.delete(key)
      this.cssVariablesCache.delete(key)
    } else {
      this.resolvedTokensCache.clear()
      this.cssVariablesCache.clear()
    }
  }
}
