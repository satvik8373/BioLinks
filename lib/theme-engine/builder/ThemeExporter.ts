/**
 * Theme Exporter Utility
 * 
 * Exports active theme configuration or custom user overrides into a validated JSON file.
 */

export class ThemeExporter {
  public static exportToJSON(resolvedConfig: any): string {
    const exportPayload = {
      version: resolvedConfig.version || '1.0.0',
      id: resolvedConfig.id,
      name: resolvedConfig.name,
      namespace: resolvedConfig.namespace || `theme-${resolvedConfig.id}`,
      extends: resolvedConfig.extends || 'base-minimal',
      category: resolvedConfig.category || 'minimal',
      license: resolvedConfig.license || { type: 'free' },
      background: resolvedConfig.background,
      palette: resolvedConfig.palette,
      typography: resolvedConfig.typography,
      spacing: resolvedConfig.spacing,
      layout: resolvedConfig.layout,
      components: resolvedConfig.components,
      buttonColor: resolvedConfig.buttonColor,
      buttonText: resolvedConfig.buttonText,
      accent: resolvedConfig.accent,
      specialty: resolvedConfig.specialty,
      effects: resolvedConfig.effects,
      animation: resolvedConfig.animation,
      visibility: resolvedConfig.visibility,
      supports: resolvedConfig.supports,
      a11y: resolvedConfig.a11y,
      meta: resolvedConfig.meta,
      isCurated: resolvedConfig.isCurated,
    }

    return JSON.stringify(exportPayload, null, 2)
  }

  public static downloadThemeJSON(resolvedConfig: any): void {
    if (typeof window === 'undefined') return
    const jsonStr = this.exportToJSON(resolvedConfig)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resolvedConfig.id}-theme.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
