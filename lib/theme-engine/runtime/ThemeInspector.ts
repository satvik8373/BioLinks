/**
 * Runtime: Dev Mode Theme Inspector
 * 
 * Shows hover overlay inspecting active design tokens (palette, button variant, layout, radius, shadow) when enabled.
 */

export class ThemeInspector {
  private static active: boolean = false
  private static tooltipEl: HTMLElement | null = null

  public static enable(): void {
    if (typeof window === 'undefined' || this.active) return
    this.active = true

    this.tooltipEl = document.createElement('div')
    this.tooltipEl.id = 'theme-inspector-tooltip'
    this.tooltipEl.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(15, 23, 42, 0.92);
      color: #38BDF8;
      border: 1px solid #38BDF8;
      padding: 10px 16px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 999999;
      pointer-events: none;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    `
    this.tooltipEl.innerHTML = `🔍 <strong>Theme Inspector Active</strong><br/>Hover over elements to inspect tokens.`
    document.body.appendChild(this.tooltipEl)
  }

  public static disable(): void {
    if (!this.active) return
    this.active = false
    if (this.tooltipEl && this.tooltipEl.parentNode) {
      this.tooltipEl.parentNode.removeChild(this.tooltipEl)
      this.tooltipEl = null
    }
  }

  public static isEnabled(): boolean {
    return this.active
  }
}
