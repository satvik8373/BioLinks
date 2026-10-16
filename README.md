# BioLinks

A Next.js 15 application for creating and editing bio link cards. The editor uses React, TypeScript, Zustand, Tailwind CSS and Firebase. Nine bundled templates share one theme compilation pipeline.

## Run locally

```powershell
npm ci
Copy-Item .env.example .env.local
# Fill in your Firebase and media configuration in .env.local.
npm run dev
```

Use the installed Node.js 22 toolchain for this project. The app opens at http://localhost:3000. Environment setup is described by .env.example; never commit .env.local.

## Add a template

```powershell
npm run theme:create -- ocean-blue --from soft-clay --name "Ocean Blue"
```

Edit `themes/ocean-blue/config.json`. The command creates the folder, validates the configuration, and updates the registry and catalog. The new template inherits the source template's design and license. No React imports or manual catalog edits are needed.

```powershell
npm run themes:sync   # Discover and register theme folders.
npm run themes:check  # Validate configs and detect stale generated files.
npm run check         # Theme checks, TypeScript, ESLint and regression tests.
npm run build         # Production Next.js build.
```

Development and build commands refresh the registry automatically. If you add a folder manually while development is already running, run `npm run themes:sync`.

## Project layout

```text
app/                       Next.js pages, layouts and API routes
components/card/           Public card rendering and block renderers
components/editor/         Editor panels and block editors
components/ui/             Shared UI controls
contexts/                  React providers
lib/stores/                Draft state, undo/redo and explicit save actions
lib/theme-engine/          Validation, inheritance, compilation and rendering
lib/theme-engine/variants/ Canonical component variant registries
lib/theme-engine/registries/palette/ Canonical semantic color palettes
themes/<id>/config.json    Authoritative template configuration
themes/generated.ts       Generated static imports; do not edit
themes/manifest.json      Generated catalog; do not edit
scripts/themes.mjs         Template creation and catalog generation
tests/                     Theme, renderer and authoring regression tests
public/                    Shared assets, including wallpapers
```

Read [THEME_SYSTEM.md](./THEME_SYSTEM.md) for authoring examples and [ARCHITECTURE.md](./ARCHITECTURE.md) for module responsibilities and maintenance rules.

## Bundled templates

Pop Brutalist, Ariana Grande, Sunset Vibes, Pastel Dream, Soft Clay, Warm Coffee, Retro LCD GameBoy, Neo Glassmorphism and Skeuo Wood. Neo Glass is marked Pro; Retro LCD is curated. Catalog metadata comes from each configuration.

## Deployment

For a Node host, build with `npm run build` and run `npm start`. The repository also contains Vercel configuration and OpenNext/Cloudflare commands: `npm run preview`, `npm run deploy`, and `npm run upload`. Configure environment variables and Firebase rules for your chosen deployment. Hosting commands are separate from local validation.

The Next.js build downloads the app's configured Google Fonts, so it needs network access. Dynamic theme fonts also load from Google Fonts in the browser.
