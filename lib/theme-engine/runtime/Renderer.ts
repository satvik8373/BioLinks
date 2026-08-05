/**
 * Runtime: Theme Renderer Stage
 * 
 * Translates compiled ResolvedTheme objects into scoped `--bl-` CSS variables and applies them to the DOM root.
 */

import { ResolvedTheme } from './ResolvedTheme'
import { CSSVariableGenerator } from './CSSVariableGenerator'
import { loadGoogleFonts } from '@/lib/fonts'

export class Renderer {
  public static render(theme: ResolvedTheme): void {
    if (typeof document === 'undefined' || !theme) return
    const root = document.documentElement

    // 1. Dynamically Load Google Fonts
    if (theme.typography) {
      loadGoogleFonts([theme.typography.fontFamily, theme.typography.headingFamily])
    }

    // 2. Set Namespace CSS Class
    const namespaceClass = theme.namespace || `theme-${theme.id}`
    root.className = root.className.replace(/theme-[a-z0-9-]+/g, '').trim()
    root.classList.add(namespaceClass)

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
