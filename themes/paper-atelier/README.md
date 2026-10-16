# Paper Atelier

Created from the supplied `paper_atelier_assets` pack. The original palette and asset index are retained in `source-theme.json`; `config.json` is the live theme definition.

Choose **Paper Atelier** in the editor's **Theme → Customizable** tab. It is a free Minimal template.

- Continuous photographic handmade-paper wallpaper, with no nested profile panel.
- Playfair Display headings, Inter body text, olive accents and ivory link surfaces.
- Pressed olive botanicals, torn paper corners, a wax seal and the supplied SVG link icons.
- 132px portrait with a frayed paper rim and a Caveat handwritten accent.
- Deckled stationery links, lifted shadows, thumbnail support and a paperclip on document links; Spotify and coffee links have olive and kraft variants.
- Keyboard focus and reduced-motion support.

Ordinary Spotify and YouTube URL links remain stationery buttons in this template (`specialty.autoUrlEmbeds: false`). Explicit Music and Video blocks keep their interactive players; select those block types when an embedded player is desired.

All 19 supplied SVG assets are retained in `public/themes/paper-atelier/`, under their original `textures`, `decorations` and `icons` folders. Photographic paper and botanical assets were created with the built-in image generation tool to follow the supplied UI concept. New editable SVGs provide the torn corner and portrait rim. Asset prompts and saved paths are documented in `ASSET_PROMPTS.md`.

After this update, reselect the template to apply its new default wallpaper to a previously saved card; existing wallpaper customizations are preserved.

The source starter CSS has been adapted into `styles.css`, scoped to `data-theme-style="paper-atelier"`. It does not style the app shell or other templates. A customized copy keeps this style identity.

After editing the configuration or adding/removing a theme stylesheet, run `npm run themes:sync`. The generator automatically imports optional `themes/<id>/styles.css` files through `themes/generated.css`.
