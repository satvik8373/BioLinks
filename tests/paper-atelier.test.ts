import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ThemeService } from '@/lib/theme-engine/ThemeService'
import { MODULAR_THEMES } from '@/themes'
import BioCard, { type BioCardProps } from '@/components/card/BioCard'

describe('Paper Atelier template', () => {
  it('uses the supplied palette, typography and local wallpaper', () => {
    const theme = ThemeService.compile('paper-atelier')!
    expect(theme.palette.brand).toBe('#59604A')
    expect(theme.palette.text).toBe('#2D2D2D')
    expect(theme.typography.headingFamily).toContain('Playfair Display')
    expect(theme.typography.headingWeight).toBe(600)
    expect(theme.background.value).toContain('/themes/paper-atelier/textures/handmade-paper.png')
    expect(theme.components.button.radius).toBe(16)
    expect(theme.components.avatar.size).toBe(132)
    expect(theme.specialty?.accentFont).toBe('Caveat')
  })

  it('ships all supplied SVG assets and resolves every stylesheet asset', () => {
    const assets = resolve('public/themes/paper-atelier')
    const source = JSON.parse(readFileSync(resolve('themes/paper-atelier/source-theme.json'), 'utf8')) as { assets: Record<string, string[]> }
    for (const folder of ['textures', 'decorations', 'icons']) {
      for (const file of source.assets[folder]) expect(existsSync(resolve(assets, folder, file)), file).toBe(true)
    }
    expect(existsSync(resolve(assets, 'textures/handmade-paper.png'))).toBe(true)
    expect(existsSync(resolve(assets, 'decorations/pressed-olive-clean.png'))).toBe(true)
    const css = readFileSync(resolve('themes/paper-atelier/styles.css'), 'utf8')
    for (const match of Array.from(css.matchAll(/url\(['"]?(\/themes\/paper-atelier\/[^)'"\s]+)['"]?\)/g))) {
      expect(existsSync(resolve('public', match[1].slice(1))), match[1]).toBe(true)
    }
  })

  it('keeps paper textures and link style hooks when the theme is customized', () => {
    const preset = MODULAR_THEMES.find(theme => theme.id === 'paper-atelier')!
    for (const id of ['paper-atelier', 'custom']) {
      const html = renderToStaticMarkup(createElement(BioCard, {
        isPreview: true,
        overrideConfig: {
          theme: { ...structuredClone(preset), id },
          profile: { title: 'Paper Studio', avatar: 'user', bio: 'Objects, stories and everyday rituals.' },
          socialLinks: {},
          links: [
            { id: 'journal', type: 'link', text: 'Read the journal', description: 'Stories and ideas', url: 'https://example.com/journal', icon: 'document', thumbnail: '/my-project.jpg', isVisible: true },
            { id: 'spotify', type: 'link', text: 'Listen', url: 'https://open.spotify.com/', icon: 'spotify', isVisible: true },
            { id: 'coffee', type: 'link', text: 'Buy me a coffee', url: 'https://example.com/support', isVisible: true },
            { id: 'youtube', type: 'link', text: 'YouTube', url: 'https://www.youtube.com/watch?v=abcdefghijk', isVisible: true },
          ],
        } as BioCardProps['overrideConfig'],
      }))
      expect(html).toContain(`data-theme="${id}"`)
      expect(html).toContain('data-theme-style="paper-atelier"')
      expect(html).toContain('/themes/paper-atelier/textures/handmade-paper.png')
      expect(html).toContain('data-profile-link="classic"')
      expect(html).toContain('data-link-icon="document"')
      expect(html).toContain('data-has-thumbnail="true"')
      expect(html).toContain('src="/my-project.jpg"')
      expect(html).toContain('data-link-platform="spotify"')
      expect(html).toContain('data-link-platform="coffee"')
      expect(html).toContain('data-link-platform="youtube"')
      expect(html).toContain('data-profile-avatar="true"')
      expect(html).toContain('aria-hidden="true" data-theme-accent-note="true"')
      const frame = html.match(/<div\b[^>]*class="[^"]*\bcard-frame\b[^>]*>/)![0]
      expect(frame).not.toMatch(/background[^:;]*:|border-radius:|box-shadow:/)
    }
  })

  it('keeps explicitly selected music blocks interactive', () => {
    const theme = MODULAR_THEMES.find(theme => theme.id === 'paper-atelier')!
    const html = renderToStaticMarkup(createElement(BioCard, {
      isPreview: true,
      overrideConfig: {
        theme,
        profile: { title: 'Paper Studio', avatar: 'user' }, socialLinks: {},
        links: [{ id: 'song', type: 'music', text: 'My Song', url: 'https://open.spotify.com/track/demo', isVisible: true }],
      } as BioCardProps['overrideConfig'],
    }))
    expect(html).toContain('Song • Stream everywhere')
    expect(html).not.toContain('data-profile-link="classic"')
  })
})
