import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadGoogleFonts } from '@/lib/fonts'

afterEach(() => vi.unstubAllGlobals())

describe('theme font loading', () => {
  it('loads a registered accent font with its supported weights and avoids duplicate requests', () => {
    const links = new Map<string, HTMLLinkElement>()
    vi.stubGlobal('document', {
      getElementById: (id: string) => links.get(id),
      createElement: () => ({}),
      head: { appendChild: (link: HTMLLinkElement) => links.set(link.id, link) },
    })
    loadGoogleFonts(['Caveat', 'Caveat', 'Inter', 'system-ui'])
    expect(links.size).toBe(2)
    expect(links.get('google-font-caveat')?.href).toBe('https://fonts.googleapis.com/css2?family=Caveat:wght@400&display=swap')
    expect(links.get('google-font-inter')?.href).toContain('wght@400;500;600;700;800')
  })
})
