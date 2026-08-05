# Official Theme System

## Architecture

This project uses the **production-grade JSON + CSS Variables** pattern, following the same architecture as Linktree, Notion, and other modern SaaS products.

```
JSON Theme Files → Theme Engine → CSS Variables → Components
```

### Why This Pattern?

| Method | Scalability | Database Storage | Admin Panel | Theme Marketplace |
|--------|-------------|------------------|-------------|-------------------|
| CSS files per theme | ❌ Poor | ❌ No | ❌ No | ❌ No |
| Tailwind per theme | ⚠️ Medium | ❌ No | ❌ No | ❌ No |
| **JSON + CSS Vars** | ✅ Excellent | ✅ Yes | ✅ Yes | ✅ Yes |

### Benefits

- **Scalable**: Add hundreds of themes without changing React code
- **Storable**: Save themes in MongoDB/PostgreSQL
- **Editable**: Build admin panels for theme management
- **Shareable**: Import/export themes as JSON
- **Marketable**: Build a theme marketplace later
- **Type-safe**: Full TypeScript support

---

## Directory Structure

```
themes/
  ├── minimal-light/
  │   ├── config.json       # Theme definition
  │   └── preview.webp      # (optional) Preview image
  ├── minimal-dark/
  │   └── config.json
  ├── glass-dark/
  │   └── config.json
  ├── clay-soft/
  │   └── config.json
  ├── luxury-gold/
  │   └── config.json
  └── gradient-sunset/
      └── config.json

lib/
  └── themeEngine.ts        # Theme loader & CSS variable applier

public/                      # (themes/ can be here in production)
```

---

## Theme Config Format

Every theme is a JSON file following this schema:

```json
{
  "id": "minimal-light",
  "name": "Minimal Light",
  "category": "minimal",
  "isPro": false,
  
  "colors": {
    "background": "#F7F7F8",
    "surface": "#FFFFFF",
    "text": "#111827",
    "textSecondary": "#6B7280",
    "primary": "#6366F1",
    "primaryHover": "#4F46E5",
    "border": "#E5E7EB",
    "accent": "#8B5CF6"
  },
  
  "button": {
    "variant": "filled",    // filled | glass | clay | outline | soft
    "radius": 12,
    "shadow": "sm",         // none | sm | md | lg | glass | clay
    "borderWidth": 0
  },
  
  "card": {
    "variant": "flat",      // flat | elevated | glass | outline
    "radius": 16
  },
  
  "avatar": {
    "variant": "circle",    // circle | rounded | square
    "size": 96,
    "border": true
  },
  
  "typography": {
    "fontFamily": "Inter, system-ui, sans-serif",
    "headingFamily": "Inter, system-ui, sans-serif"
  },
  
  "layout": {
    "style": "centered",    // centered | wide | compact
    "maxWidth": 680,
    "spacing": "comfortable" // tight | comfortable | loose
  }
}
```

---

## Usage

### 1. Load and Activate a Theme

```typescript
import { activateTheme } from '@/lib/themeEngine'

// Activate by ID
await activateTheme('minimal-light')
```

### 2. List Available Themes

```typescript
import { getAvailableThemes } from '@/lib/themeEngine'

const themes = getAvailableThemes()
// [{ id: 'minimal-light', name: 'Minimal Light', category: 'minimal', isPro: false }, ...]
```

### 3. Load Theme Config

```typescript
import { loadThemeConfig } from '@/lib/themeEngine'

const config = await loadThemeConfig('glass-dark')
if (config) {
  console.log(config.colors.primary) // rgba(255, 255, 255, 0.15)
}
```

### 4. Apply Theme Manually

```typescript
import { loadThemeConfig, applyThemeToDOM } from '@/lib/themeEngine'

const config = await loadThemeConfig('clay-soft')
if (config) {
  applyThemeToDOM(config) // Writes CSS variables to :root
}
```

---

## CSS Variables Emitted

When you call `applyThemeToDOM()`, these CSS variables are written to `:root`:

### Colors
```css
--color-background
--color-surface
--color-text
--color-text-secondary
--color-primary
--color-primary-hover
--color-border
--color-accent
--color-button
--color-button-hover
--color-button-text
```

### Layout
```css
--button-radius
--button-border-width
--button-shadow
--card-radius
--avatar-size
--avatar-radius
--avatar-border
--layout-max-width
--layout-spacing
```

### Typography
```css
--font-family
--font-family-heading
```

### Video Cards (derived)
```css
--color-video-card-bg
--color-video-card-border
--color-video-card-text
--color-video-card-play-button
--radius-video-card
```

---

## Component Usage

**Components NEVER read JSON directly.** They only use CSS variables:

```tsx
// ✅ CORRECT
const buttonStyle = {
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-text)',
  borderRadius: 'var(--button-radius)',
  boxShadow: 'var(--button-shadow)',
}

// ❌ WRONG - never do this
const buttonStyle = {
  backgroundColor: theme.colors.primary, // DON'T read theme object
}
```

This ensures:
- Instant theme switching (no re-renders)
- Works with any theme without code changes
- CSS variables cascade to all child elements

---

## Button Variants

The `button.variant` field maps to reusable component styles:

| Variant | Description | Example Theme |
|---------|-------------|---------------|
| `filled` | Solid background | Minimal Light |
| `glass` | Glassmorphism with backdrop blur | Glass Dark |
| `clay` | Neomorphism with inset/outset shadows | Clay Soft |
| `outline` | Border-only, transparent background | (custom) |
| `soft` | Subtle background, low contrast | (custom) |

Your button component maps the variant to the appropriate CSS:

```tsx
const variantStyles = {
  filled: { backgroundColor: 'var(--color-primary)' },
  glass: { 
    background: 'var(--color-primary)',
    backdropFilter: 'blur(10px)',
  },
  clay: { 
    background: 'var(--color-surface)',
    boxShadow: 'var(--button-shadow)',
  },
  // ...
}
```

---

## Adding New Themes

### Option 1: Create JSON File

1. Create `themes/my-theme/config.json`
2. Add metadata to `BUILT_IN_THEMES` in `lib/themeEngine.ts`:
   ```typescript
   { id: 'my-theme', name: 'My Theme', category: 'custom', isPro: false }
   ```
3. Done! The theme is now available via `activateTheme('my-theme')`

### Option 2: Load from Database

```typescript
// Later: fetch from API
async function loadThemeConfig(themeId: string): Promise<ThemeConfig | null> {
  const response = await fetch(`/api/themes/${themeId}`)
  return response.json()
}
```

---

## Migration from Old System

If you have themes in `lib/themes.ts` (TypeScript objects), use the converter:

```typescript
import { convertLegacyTheme } from '@/lib/themeEngine'
import { THEMES } from '@/lib/themes' // old file

const legacyTheme = THEMES.find(t => t.id === 'minimal')
const newConfig = convertLegacyTheme(legacyTheme)

// Save to JSON
await saveThemeConfig(newConfig)
```

---

## Production Deployment

### Development
Themes load from `public/themes/` or `themes/` folder.

### Production (Recommended)
1. Store theme JSON in database (MongoDB, PostgreSQL)
2. Build REST API: `GET /api/themes/:id`
3. Update `loadThemeConfig()` to fetch from API
4. Enable user-created themes with admin validation

### Theme Marketplace (Future)
1. User uploads theme JSON
2. Admin reviews/approves
3. Theme listed in marketplace
4. Users can purchase/install themes

---

## Best Practices

### DO ✅
- Store all themes as JSON files
- Use CSS variables in all components
- Keep theme definitions simple (no logic)
- Version themes (add `version: "1.0.0"` field)
- Validate JSON schema before applying

### DON'T ❌
- Don't hardcode colors in components
- Don't read theme objects directly in render
- Don't store CSS/SCSS files per theme
- Don't duplicate theme definitions
- Don't skip CSS variable fallbacks in `globals.css`

---

## Roadmap

- [x] JSON theme format
- [x] Theme engine with CSS variable applier
- [x] 6 example themes (minimal, glass, clay, luxury, gradient)
- [ ] Theme selector UI component
- [ ] Theme preview generator
- [ ] Database integration
- [ ] REST API for themes
- [ ] User-created themes
- [ ] Theme marketplace
- [ ] Theme versioning system
- [ ] A/B testing for themes

---

**Last Updated:** 2026-01-08  
**Version:** 2.0.0 (JSON-based architecture)
