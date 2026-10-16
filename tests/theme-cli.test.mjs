import { describe, it, expect, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, basename } from 'node:path'
import { createTheme, generateThemes } from '../scripts/themes.mjs'

const fixtures = []
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'biolinks-theme-test-'))
  fixtures.push(root)
  mkdirSync(join(root, 'themes', 'pop-brutalist'), { recursive: true })
  writeFileSync(join(root, 'themes', 'pop-brutalist', 'config.json'), JSON.stringify({
    id: 'pop-brutalist', name: 'Default', category: 'minimal', extends: 'base-minimal', palette: 'palette-brutalist',
  }))
  return root
}
afterEach(() => {
  for (const root of fixtures.splice(0)) {
    // Only remove temporary directories created by this test process.
    const absolute = resolve(root)
    if (absolute.startsWith(resolve(tmpdir()) + '\\') || absolute.startsWith(resolve(tmpdir()) + '/')) {
      if (basename(absolute).startsWith('biolinks-theme-test-')) rmSync(absolute, { recursive: true, force: true })
    }
  }
})

describe('theme authoring CLI', () => {
  it('creates and registers a cloned theme without manual imports', () => {
    const root = fixture()
    const config = createTheme('ocean-blue', { name: 'Ocean Blue' }, root)
    expect(config.name).toBe('Ocean Blue')
    expect(config.palette).toBe('palette-brutalist')
    expect(config.namespace).toBe('theme-ocean-blue')
    expect(generateThemes(root, true).map(theme => theme.id)).toEqual(['pop-brutalist', 'ocean-blue'])
    expect(readFileSync(join(root, 'themes', 'generated.ts'), 'utf8')).toContain("'./ocean-blue/config.json'")
  })

  it('blocks traversal, reserved IDs, unknown sources and overwrites', () => {
    const root = fixture()
    for (const id of ['../outside', 'Bad ID', 'custom']) expect(() => createTheme(id, {}, root)).toThrow()
    expect(() => createTheme('valid', { from: '../outside' }, root)).toThrow()
    expect(() => createTheme('valid', { from: 'missing' }, root)).toThrow()
    expect(() => createTheme('pop-brutalist', {}, root)).toThrow('already exists')
  })

  it('discovers optional theme styles and detects an out-of-date style catalog', () => {
    const root = fixture()
    generateThemes(root)
    writeFileSync(join(root, 'themes', 'pop-brutalist', 'styles.css'), '.bl-profile-theme[data-theme-style="pop-brutalist"] { color: black; }')
    expect(() => generateThemes(root, true)).toThrow('generated.css is stale')
    generateThemes(root)
    expect(readFileSync(join(root, 'themes', 'generated.css'), 'utf8')).toContain("@import './pop-brutalist/styles.css';")
    expect(() => generateThemes(root, true)).not.toThrow()
  })

  it('detects stale registrations and folder/config mismatches', () => {
    const root = fixture()
    generateThemes(root)
    writeFileSync(join(root, 'themes', 'generated.ts'), '// stale')
    expect(() => generateThemes(root, true)).toThrow('stale')
    mkdirSync(join(root, 'themes', 'mismatch'))
    writeFileSync(join(root, 'themes', 'mismatch', 'config.json'), JSON.stringify({ id: 'other', name: 'Other', category: 'glass' }))
    expect(() => generateThemes(root)).toThrow('must match its folder')
  })
})
