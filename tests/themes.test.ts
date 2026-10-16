import { describe, expect, it, vi, afterEach } from 'vitest'
import { ALL_JSON_CONFIGS, MODULAR_THEMES } from '@/themes'
import { ThemeService } from '@/lib/theme-engine/ThemeService'
import { ThemeValidator } from '@/lib/theme-engine/runtime/Validator'
import { CSSVariableGenerator } from '@/lib/theme-engine/runtime/CSSVariableGenerator'
import { formatAndNormalizeTheme, applyThemeToCSSVariables } from '@/lib/themes'
import { ThemeResolver } from '@/lib/theme-engine/runtime/ThemeResolver'
import { resolveRadius } from '@/lib/theme-engine/radius'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import BioCard, { type BioCardProps } from '@/components/card/BioCard'
import { getBackgroundPaint } from '@/lib/backgroundStyle'
import { resolveBackground } from '@/lib/backgrounds'

vi.mock('@/lib/fonts', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/fonts')>(), loadGoogleFonts: vi.fn(),
}))
afterEach(() => vi.unstubAllGlobals())

describe('theme catalog', () => {
  it('includes every bundled theme with the same metadata in both APIs', () => {
    const metadata = ThemeService.getAvailableThemes()
    expect(metadata.map(theme => theme.id)).toEqual(MODULAR_THEMES.map(theme => theme.id))
    expect(metadata.find(theme => theme.id === 'neo-glass')?.isPro).toBe(true)
    expect(MODULAR_THEMES.find(theme => theme.id === 'neo-glass')?.isPremium).toBe(true)
    expect(metadata.find(theme => theme.id === 'retro-lcd')?.isCurated).toBe(true)
    expect(MODULAR_THEMES[0].id).toBe('pop-brutalist')
  })

  for (const config of ALL_JSON_CONFIGS) {
    it(`validates, loads, exports and reimports ${config.id} without losing its appearance`, async () => {
      expect(ThemeValidator.validate(config)).toEqual({ valid: true, errors: [] })
      const loaded = await ThemeService.load(config.id)
      expect(loaded).not.toBeNull()
      const imported = ThemeService.import(ThemeService.export(config.id))
      expect(imported.success, imported.error).toBe(true)
      const roundTrip = ThemeService.compile(imported.config!)!
      expect(CSSVariableGenerator.generate(roundTrip)).toEqual(CSSVariableGenerator.generate(loaded!))
      expect(roundTrip.specialty).toEqual(loaded!.specialty)
      expect(roundTrip.components.card).toEqual(loaded!.components.card)
      expect(roundTrip.components.avatar).toEqual(loaded!.components.avatar)
      expect(roundTrip.effects).toEqual(loaded!.effects)
      const legacy = MODULAR_THEMES.find(theme => theme.id === config.id)!
      expect(legacy.colors.profileText).toBe(loaded!.palette.text)
      expect(legacy.fonts.heading).toBe(loaded!.typography.headingFamily.split(',')[0].trim())
    })
  }

  it('keeps palette, typography and radius values consistent across compilation and cards', async () => {
    const ariana = await ThemeService.load('ariana-grande')
    expect(ariana?.palette.text).toBe('#FFFFFF')
    const coffee = await ThemeService.load('warm-coffee')
    expect(coffee?.typography.headingFamily).toContain('Fraunces')
    expect(ThemeService.compile('neo-glass')?.typography.headingFamily).toContain('Space Grotesk')
    expect(ThemeService.compile('pastel-dream')?.typography.fontFamily).toContain('Plus Jakarta Sans')
    const retro = await ThemeService.load('retro-lcd')
    expect(retro?.components.button.variant).toBe('retro-lcd')
    expect(retro?.components.card.radius).toBe(22)
    expect(CSSVariableGenerator.generate(retro!)['--radius-button']).toBe('12px')
    expect(resolveRadius(44)).toBe(44)
    expect(resolveRadius('28px')).toBe(28)
    expect(resolveRadius(0)).toBe(0)
  })

  it('merges partial editor overrides without losing other tokens or mutating the preset', () => {
    const raw = ALL_JSON_CONFIGS.find(theme => theme.id === 'soft-clay')!
    const original = structuredClone(raw)
    const theme = ThemeService.compile(raw, { palette: { brand: '#123456' }, components: { button: { radius: 0 } } })!
    expect(theme.palette.brand).toBe('#123456')
    expect(theme.palette.text).toBe('#161821')
    expect(theme.components.button.variant).toBe('clay')
    expect(theme.components.button.radius).toBe(0)
    expect(theme.components.button.shadow).toBe('shadow-pill-clay')
    expect(raw).toEqual(original)
  })

  it('isolates returned themes from the registry and cache', async () => {
    const theme = (await ThemeService.load('soft-clay'))!
    theme.palette.text = '#BADBAD'
    expect((await ThemeService.load('soft-clay'))?.palette.text).toBe('#161821')
    const raw = ThemeService.getConfig('soft-clay')!
    raw.name = 'Mutated'
    expect(ThemeService.getConfig('soft-clay')?.name).toBe('Soft Clay')
  })

  it('invalidates cached custom configurations when they are replaced', async () => {
    const config = { ...ALL_JSON_CONFIGS[0], id: 'test-custom', name: 'Test Custom' }
    ThemeService.register(config)
    expect((await ThemeService.load(config.id))?.name).toBe('Test Custom')
    ThemeService.register({ ...config, name: 'Updated Custom' })
    ThemeService.init()
    expect((await ThemeService.load(config.id))?.name).toBe('Updated Custom')
  })

  it('rejects malformed imports and unknown base IDs before rendering', async () => {
    for (const input of [null, [], 1, { id: '../escape', name: 'Bad', category: 'minimal' },
      { id: 'bad', name: 'Bad', category: 'minimal', extends: 'missing-base' },
      { ...ALL_JSON_CONFIGS[0], components: { button: { radius: -2 } } }]) {
      expect(ThemeService.import(JSON.stringify(input)).success).toBe(false)
    }
    expect(await ThemeService.load('does-not-exist')).toBeNull()
    expect(() => ThemeService.compile({ ...ALL_JSON_CONFIGS[0], name: '' })).toThrow()
  })

  it('preserves custom identity, typography and surface settings when normalizing saved data', () => {
    const current = MODULAR_THEMES.find(theme => theme.id === 'neo-glass')!
    const custom = { ...structuredClone(current), id: 'custom', name: 'Custom' }
    custom.colors.buttonDefault = '#123456'
    expect(formatAndNormalizeTheme(custom)).toMatchObject({ id: 'custom', specialty: current.specialty, colors: { buttonDefault: '#123456' } })
    const fontOverride = formatAndNormalizeTheme({ ...current, fonts: { body: 'Manrope' } })
    expect(fontOverride.fonts).toEqual({ body: 'Manrope', heading: current.fonts.heading })
  })

  it('replaces arrays when merging theme data', () => {
    const resolved = ThemeResolver.resolve({ ...ALL_JSON_CONFIGS[0], specialty: { decorations: ['noise'] } })
    expect(resolved.specialty.decorations).toEqual(['noise'])
  })
})

describe('scoped rendering', () => {
  function makeElement() {
    const attributes = new Map<string, string>()
    const styles = new Map<string, string>()
    const classes = new Set<string>(['keep-me'])
    return {
      attributes, styles, classes,
      setAttribute: (key: string, value: string) => attributes.set(key, value),
      getAttribute: (key: string) => attributes.get(key) || null,
      style: { setProperty: (key: string, value: string) => styles.set(key, value) },
      classList: { add: (value: string) => classes.add(value), remove: (value: string) => classes.delete(value) },
    }
  }

  it('applies each theme to an isolated preview without changing the app or saved selection', () => {
    const app = makeElement()
    const preview = makeElement()
    const save = vi.fn()
    vi.stubGlobal('window', {})
    vi.stubGlobal('document', { documentElement: app })
    vi.stubGlobal('localStorage', { setItem: save })
    for (const theme of MODULAR_THEMES) {
      applyThemeToCSSVariables(theme, preview as unknown as HTMLElement)
      expect(preview.attributes.get('data-theme-id')).toBe(theme.id)
      expect(preview.styles.get('--color-button')).toBe(theme.colors.buttonDefault)
      expect(preview.styles.get('--color-profile-text')).toBe(theme.colors.profileText)
      expect(preview.styles.get('--radius-button')).toBe(`${theme.buttonStyle.borderRadius}px`)
    }
    expect(app.styles.size).toBe(0)
    expect(save).not.toHaveBeenCalled()
    expect(preview.classes).toEqual(new Set(['keep-me', `theme-${MODULAR_THEMES[MODULAR_THEMES.length - 1].id}`]))
  })

  it('preview does not write storage; activation does', () => {
    const app = makeElement()
    const save = vi.fn()
    vi.stubGlobal('window', {})
    vi.stubGlobal('document', { documentElement: app })
    vi.stubGlobal('localStorage', { setItem: save })
    ThemeService.preview('retro-lcd')
    expect(save).not.toHaveBeenCalled()
    ThemeService.apply('neo-glass')
    expect(save).toHaveBeenCalledWith('activeThemeId', 'neo-glass')
    expect(app.classes).toEqual(new Set(['keep-me', 'theme-neo-glass']))
  })
})

describe('background paint', () => {
  it('keeps an explicit pattern when the theme inherits a background preset', () => {
    const mesh = 'repeating-linear-gradient(#0001 0px, transparent 3px)'
    expect(resolveBackground({ preset: 'arctic-icy', value: '#c7d2ab', mesh, type: 'pattern' }).value).toBe(mesh)
  })

  it('resets images and colors when switching between solid and image themes', () => {
    expect(getBackgroundPaint('rgba(255, 255, 255, 0.08)')).toEqual({
      backgroundColor: 'rgba(255, 255, 255, 0.08)', backgroundImage: 'none',
    })
    expect(getBackgroundPaint('url("/wallpaper,a(b).png")')).toEqual({
      backgroundColor: 'transparent', backgroundImage: 'url("/wallpaper,a(b).png")',
    })
    expect(getBackgroundPaint(undefined)).toEqual({})
  })

  it('preserves layered gradients and the trailing base color', () => {
    const layers = 'radial-gradient(circle, rgba(0, 0, 0, 0.3), transparent), linear-gradient(135deg, #123456, transparent)'
    expect(getBackgroundPaint(`${layers}, #0F172A`)).toEqual({
      backgroundColor: '#0F172A', backgroundImage: layers,
    })
    expect(getBackgroundPaint(layers)).toEqual({
      backgroundColor: 'transparent', backgroundImage: layers,
    })
  })
})

describe('public card rendering', () => {
  function renderCard(id: string, isPreview = true) {
    const theme = MODULAR_THEMES.find(theme => theme.id === id)!
    return renderToStaticMarkup(createElement(BioCard, {
      isPreview,
      overrideConfig: { theme, profile: { title: 'Theme Test', avatar: 'user', bio: 'Preview' }, links: [], socialLinks: {} } as BioCardProps['overrideConfig'],
    }))
  }

  it('retains the clay template content padding and avatar size', () => {
    const html = renderCard('soft-clay')
    expect(html).toContain('padding:16px 16px 20px')
    expect(html).toContain('width:150px;height:150px')
  })

  it('preserves the retro wallpaper scanlines without a nested painted panel', () => {
    for (const isPreview of [true, false]) {
      const html = renderCard('retro-lcd', isPreview)
      const root = html.match(/<div\b[^>]*class="bl-profile-theme[^>]*>/)![0]
      const frame = html.match(/<div\b[^>]*class="[^"]*\bcard-frame\b[^>]*>/)![0]
      expect(root).toContain('repeating-linear-gradient')
      expect(frame).not.toMatch(/background[^:;]*:|border-radius:|box-shadow:|backdrop-filter:/)
      expect(frame).toContain('max-width:340px')
      expect(frame).toContain('padding:18px 18px 22px')
      expect(html).toContain('width:126px;height:126px')
    }
  })

  it('retains the glass template gradient wallpaper and header layout', () => {
    const html = renderCard('neo-glass')
    expect(html).toContain('data-header-layout="hero"')
    expect(html).toContain('background-color:#0F172A;background-image:radial-gradient')
  })

  it('uses only longhand background properties on theme roots and card frames', () => {
    for (const theme of MODULAR_THEMES) {
      const html = renderCard(theme.id)
      const tags = html.match(/<div\b[^>]*>/g) || []
      const frames = tags.filter(tag => /class="[^"]*\b(?:bl-profile-theme|card-frame)\b/.test(tag))
      expect(frames, theme.id).toHaveLength(2)
      for (const frame of frames) {
        expect(frame, theme.id).not.toMatch(/(?:style="|;)background:/)
      }
    }
  })

  it('removes the extra panel for every template while preserving wallpaper and content spacing', () => {
    for (const theme of MODULAR_THEMES) {
      for (const isPreview of [true, false]) {
        const html = renderCard(theme.id, isPreview)
        const frame = html.match(/<div\b[^>]*class="[^"]*\bcard-frame\b[^>]*>/)![0]
        const panel = theme.specialty!
        expect(frame, theme.id).not.toMatch(/background[^:;]*:|border(?:-radius)?:|box-shadow:|backdrop-filter:/)
        expect(frame, theme.id).toContain(`padding:${panel.cardPadding}`)
        if (theme.colors.backgroundMesh) {
          const paint = getBackgroundPaint(theme.colors.backgroundMesh)
          expect(html, theme.id).toContain(`background-image:${paint.backgroundImage}`)
          expect(html, theme.id).toContain(`background-color:${paint.backgroundColor}`)
        }
        if (theme.colors.backgroundImage) expect(html, theme.id).toContain(theme.colors.backgroundImage)
      }
    }
  })

  it('renders the square avatar declared by the brutalist template', () => {
    expect(renderCard('pop-brutalist')).toContain('width:96px;height:96px;border-radius:0')
  })
})
