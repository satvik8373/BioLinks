# Application architecture

## Module responsibilities

The project keeps Next.js route conventions in `app/`, rendering components in `components/`, and shared state and services in `lib/`. Existing editor panels and block renderers remain separate modules. Template authoring has one canonical entry point and shares the compilation path used by public cards.

```text
Authoring: themes/<id>/config.json
          -> scripts/themes.mjs validates and discovers folders
          -> themes/generated.ts + themes/manifest.json

Runtime:  generated JSON -> ThemeService
          -> validation -> migration -> inheritance + user overrides
          -> ThemeCompiler -> ResolvedTheme -> scoped CSS variables

Cards:    generated JSON -> resolver + compiler
          -> themes/index.ts compatibility adapter -> Theme
          -> draft store / saved card -> BioCard
```

## Theme boundaries

- `lib/theme-engine/types.ts`: raw theme metadata and authoring contract.
- `lib/theme-engine/schemas/theme.schema.json`: shared structural validation contract.
- `ThemeService`: runtime registration, validation, compilation, caching, preview/application, import/export and events.
- `runtime/ThemeResolver.ts`: one runtime merge implementation. It preserves nested tokens and resolves preset IDs before applying partial object overrides.
- `runtime/ThemeCompiler.ts`: converts token IDs into the typed compiled shape.
- `runtime/Renderer.ts`: writes variables and namespace attributes to the selected element, retaining unrelated classes.
- `themes/index.ts`: the single compiler-to-saved-card adapter. It preserves specialized surfaces, button colors, fonts and metadata.
- `lib/themes.ts` and `lib/themeEngine.ts`: existing public compatibility functions. Keep application callers on these facades or ThemeService.
- `variants/{button,card,avatar}` and `registries/palette`: canonical registries. Old top-level variant and palette paths re-export these registries.

Bundled JSON is imported statically, with no filesystem dependencies in the browser. Registry and cache values are cloned at their boundaries. Runtime registration invalidates the affected cache. Unknown themes are handled explicitly instead of requesting a path that is not served by Next.js.

## Editor and saved designs

`lib/stores/useDraftStore.ts` owns the live draft, dirty state, undo/redo and explicit saving. Editor panels update that draft; the preview renders the draft directly. Template selection replaces theme design data while preserving profile and link content. Theme preview and CSS application do not save drafts or publish profiles.

Profile settings can override a template's header layout. Saved cards continue to accept the legacy Theme shape; normalization merges their user customizations over current preset definitions. The reserved `custom` ID is a user design rather than a bundled catalog entry.

Public card and preview roots own their theme CSS variables. App shell styles continue to use `--app-*` variables, avoiding accidental restyling when a creator edits a template.

## Adding features

For a new visual template using existing layouts and variants, create one configuration with `npm run theme:create`. No JSX edits are required. Put shared media in `public/`; use declarative token values in the template.

For a genuinely new component variant, implement it in the canonical variant registry and its renderer, then select it from configuration. Add fields to the raw schema, compiled interface and adapter only when the feature needs new tokens. Keep variant-specific styling together rather than branching on a template ID across several files.

For a new content block, extend `lib/types/link.ts`, add its editor through `BlockEditorDispatcher`, and add its display renderer under `components/card/renderers/`. Keep reusable business logic out of route/page components.

The existing editor page and BioCard are still large components. Further block extraction should be incremental and preserve saved-card compatibility. The template package/capability types are historical groundwork and are not the active authoring contract; consult THEME_SYSTEM.md before extending them.

## Maintenance

Use `npm run check` for registry freshness, TypeScript, lint and regression tests. Use `npm run build` to validate the Next.js production bundle. Development and hosting build commands run theme generation first. ESLint currently reports existing image optimization and JSX text escaping warnings; they do not block a build.

Use [THEME_SYSTEM.md](./THEME_SYSTEM.md) as the current template setup guide. Earlier migration and catalog documents describe historical states and may contain obsolete counts or file names.
