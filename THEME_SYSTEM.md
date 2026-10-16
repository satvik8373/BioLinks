# Theme authoring and management

`themes/<id>/config.json` is the authoritative input for each bundled template. All templates are discovered by the same authoring script. The generated registry provides static JSON imports that work in Next.js client bundles and on the server; runtime code does not read the filesystem or fetch an unpublished `/themes` URL.

## Create a theme

```powershell
npm run theme:create -- ocean-blue --from soft-clay --name "Ocean Blue"
```

Use a unique lowercase ID with hyphens. The folder and `config.id` must match. `custom` is reserved for user-edited designs. The command refuses path traversal, unknown source templates and existing folders. It clones the source design and license, resets authoring metadata and curated status, and refreshes the generated catalog.

To create a template manually, add a folder and `config.json`, then run `npm run themes:sync`. Do not edit `themes/generated.ts`, `themes/generated.css` or `themes/manifest.json` directly. Pop Brutalist remains the default; other themes are ordered by `order`, then ID.

Optional `themes/<id>/styles.css` files are also discovered automatically. Scope every rule to `.bl-profile-theme[data-theme-style="<id>"]`; never use global `:root`, body or unscoped component selectors. Set `specialty.styleId` to the style ID so customized copies retain the template's styling. Paper Atelier is an example. Use the `[data-profile-link]` and `[data-link-icon]` hooks for classic and featured link styling; `--profile-background-size` controls mesh/texture tiling.

Classic links expose `data-link-platform`, `data-link-title`, `data-link-description` and a thumbnail flag on the icon slot. `specialty.autoUrlEmbeds: false` keeps ordinary URL links as buttons; explicit Music and Video blocks retain their media behavior. A template may supply `specialty.accentFont` and a decorative `accentNote` for its classic portrait; these render only when supplied by that template.

## Minimal configuration

```json
{
  "version": "2.1.0",
  "id": "ocean-blue",
  "name": "Ocean Blue",
  "category": "minimal",
  "extends": "base-minimal",
  "license": { "type": "free" },
  "isCurated": false,
  "background": "#eff6ff",
  "palette": {
    "surface": "#ffffff",
    "surfaceAlt": "#dbeafe",
    "brand": "#2563eb",
    "text": "#0f172a",
    "textMuted": "#475569",
    "border": "#bfdbfe"
  },
  "buttonColor": "#2563eb",
  "buttonText": "#ffffff",
  "accent": "#2563eb",
  "typography": { "font": "font-inter", "heading": "font-inter" },
  "components": {
    "button": { "variant": "button-filled", "radius": 18, "shadow": "shadow-soft" },
    "card": { "variant": "card-elevated", "radius": 28, "background": "#ffffff", "maxWidth": "420px", "padding": "24px 20px" },
    "avatar": { "variant": "avatar-circle", "size": 112 }
  },
  "layout": "layout-centered"
}
```

Fields not provided inherit base defaults. Objects merge recursively; arrays and registry IDs replace previous values. Partial user overrides on a palette registry ID resolve the palette before merging, preserving all remaining colors.

Built-in bases: `base-minimal`, `base-light` (historical alias), `base-dark`, `base-glass`, `base-gradient`, `base-luxury`, `base-clay`, `base-brutalist`, and `base-skeuo`.

Supported categories: minimal, dark, glass, clay, luxury, gradient, mesh, image, vibrant, custom, skeuomorphic, and nature. Category controls appear automatically when the catalog contains that category. Set `isCurated: true` to list a template in the editor's Curated tab.

## Fonts, backgrounds and shapes

Fonts accept registry IDs or CSS font stacks. Historical `heading` and `bodyFont` fields normalize to the compiler's heading/body fonts. Font IDs with the `font-` prefix resolve consistently. Theme font stylesheets are loaded when a card renders.

Backgrounds accept presets or inline color, gradient, mesh and image definitions. For local images, put assets in `public/` and use a site-relative path such as `/wallpapers/light-wood.webp`. Profile wallpaper renders once on the page; card surface metadata is retained without drawing another inner frame.

Numeric radii retain their value, including zero. Presets such as `radius-full` remain available. Shadows can be a registry ID or a complete CSS shadow string. Profile backgrounds and textures render on the page; the inner content container applies the configured padding and maximum width without another background, rounded border, shadow or blur. Card surface tokens remain in exported configurations for compatibility. Button and avatar styling stays independent; classic avatars use the template's size and shape. Profile header choices override the template's default header layout.

## Application APIs

```typescript
import { ThemeService } from '@/lib/theme-engine/ThemeService'

const theme = await ThemeService.load('soft-clay')
ThemeService.preview('soft-clay', { palette: { brand: '#2563eb' } })
ThemeService.apply('soft-clay')

const result = ThemeService.import(jsonText)
if (result.success && result.config) ThemeService.register(result.config)
const exportedJSON = ThemeService.export('soft-clay')
```

`preview` renders without changing saved selection. `apply` writes the active ID when browser storage is available. `register` validates and invalidates that ID's cache. Returned configurations and cached themes are cloned so caller mutations do not alter future loads. Invalid JSON fails validation; unknown theme IDs return null when loaded.

Existing cards use the `Theme` compatibility shape from `lib/themes.ts`. `themes/index.ts` is its single conversion adapter. `formatAndNormalizeTheme` preserves user color, font and button customizations and restores preset surface metadata. User-created `custom` designs retain their identity and card surface.

Public cards and live previews apply variables to their own root element with `applyThemeToCSSVariables(theme, element)`. Applying a preview does not change the app shell or persist the active ID.

## Validation and checks

The authoring command and runtime importer use the same JSON Schema with Ajv. IDs, licenses, categories, component dimensions and basic token shapes are checked before compilation. The runtime additionally verifies known base IDs. This is structural validation, not a full contrast or CSS validity audit; check readability and actual assets when designing a new template.

```powershell
npm run themes:sync
npm run check
npm run build
```

Regression tests load every bundled theme, compare legacy/runtime colors and fonts, preserve appearance through export/import, exercise partial overrides and caches, check scoped rendering and public card markup, and test safe creation/stale registry detection. A newly discovered theme joins the catalog-wide tests automatically.

Some theme folders contain historical `tokens.json`, `layout.json`, `editor.json`, `assets.json`, `motion.json`, or package manifests. These remain reference material; this pipeline loads `config.json`. To change a live template, edit its configuration. Standalone package capability helpers are not connected to every editor control.

## Research references

Static imports and serializable JSON respect [Next.js server/client boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components). The shared schema follows [JSON Schema's object validation rules](https://json-schema.org/understanding-json-schema/reference/object), with [Ajv validators compiled once and reused](https://ajv.js.org/guide/getting-started). Semantic token organization is informed by the [Design Tokens Community Group](https://www.designtokens.org/); the project's existing JSON format is application-specific and does not claim DTCG format compliance.
