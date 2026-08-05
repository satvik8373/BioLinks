/**
 * Single Responsibility: Theme Applier
 * 
 * Injects CSS variables, root namespace classes, and DOM attributes onto document.documentElement.
 */

import { CSSVariableGenerator } from './CSSVariableGenerator'
import { ResolvedTheme } from '../runtime/ResolvedTheme'

export class ThemeApplier {
  public static apply(theme: ResolvedTheme): void {
    if (typeof document === 'undefined' || !theme) return
    const root = document.documentElement

    // 1. Set Namespace CSS Class (e.g. .theme-arctic)
    const namespaceClass = theme.namespace || `theme-${theme.id}`
    root.className = root.className.replace(/theme-[a-z0-9-]+/g, '').trim()
    root.classList.add(namespaceClass)

    // 2. Set Attributes
    root.setAttribute('data-theme-version', theme.version || '1.0.0')
    root.setAttribute('data-theme-id', theme.id)
    root.setAttribute('data-theme-extends', theme.extends || 'base-minimal')
    root.setAttribute('data-theme-license', theme.license?.type || 'free')
    root.setAttribute('data-min-version', theme.compatibility?.minVersion || '2.0.0')
    root.setAttribute('data-header-layout', theme.layout.headerLayout || 'classic')

    // 3. Inject Scoped CSS Variables (--bl-color-brand, --bl-button-radius, etc.)
    const variables = CSSVariableGenerator.generate(theme)
    for (const [key, value] of Object.entries(variables)) {
      root.style.setProperty(key, value)
    }
  }
}
