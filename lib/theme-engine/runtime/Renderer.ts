/**
 * Runtime: Theme Renderer Stage
 * 
 * Translates compiled ResolvedTheme objects into scoped `--bl-` CSS variables and applies them to the DOM root.
 */

import { ResolvedTheme } from './ResolvedTheme'
import { CSSVariableGenerator } from './CSSVariableGenerator'
import { loadGoogleFonts } from '@/lib/fonts'

export class Renderer {
  public static render(theme: ResolvedTheme, targetElement?: HTMLElement): void {
    if (typeof document === 'undefined' || !theme) return
    const root = targetElement || document.documentElement

    // 1. Dynamically Load Google Fonts
    if (theme.typography) {
      loadGoogleFonts([theme.typography.fontFamily, theme.typography.headingFamily, theme.specialty?.accentFont || ''])
    }

    // 2. Set Namespace CSS Class
    const namespaceClass = theme.namespace || `theme-${theme.id}`
    const previousNamespace = root.getAttribute('data-theme-namespace')
    if (previousNamespace) root.classList.remove(previousNamespace)
    root.classList.add(namespaceClass)
    root.setAttribute('data-theme-namespace', namespaceClass)

    // 3. Set DOM Attributes
    root.setAttribute('data-theme-version', theme.version || '1.0.0')
    root.setAttribute('data-theme-id', theme.id)
    root.setAttribute('data-theme-extends', theme.extends || 'base-minimal')
    root.setAttribute('data-theme-license', theme.license?.type || 'free')
    root.setAttribute('data-min-version', theme.compatibility?.minVersion || '2.0.0')
    const headerLayout = (theme.layout as any)?.headerLayout || 'classic'
    root.setAttribute('data-header-layout', headerLayout)

    // 4. Inject CSS Custom Properties
    const variables = CSSVariableGenerator.generate(theme)
    for (const [key, value] of Object.entries(variables)) {
      root.style.setProperty(key, value)
    }
  }
}
