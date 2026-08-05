# Architecture Documentation

## CSS Variable Theme System

This project implements a production-grade design token system using CSS variables, following industry patterns used by Linktree, Notion, and other modern web applications.

### Architecture Pattern

```
Design Tokens (TypeScript) → CSS Variables (:root) → Components (var())
```

**Benefits:**
- Instant theme switching without re-renders
- Universal styling (affects all elements including third-party components)
- Type-safe token definitions
- Single source of truth
- No prop drilling

### Implementation

#### 1. Design Tokens (`lib/themes.ts`)

Contains 22+ predefined themes with complete token sets:

```typescript
export interface Theme {
  id: string
  name: string
  colors: {
    background: string
    buttonBg: string
    buttonText: string
    buttonBorder?: string
    profileText: string
    profileBio: string
    accent: string
    // ... more tokens
  }
  fonts: {
    body: string
    heading: string
  }
  radius: {
    button: number
    card: number
  }
  shadows: {
    button: string
    card: string
  }
  // ... borders, dimensions, etc.
}
```

#### 2. CSS Variable Emission (`applyThemeToCSSVariables`)

Writes all design tokens to `:root` as CSS variables:

```typescript
export function applyThemeToCSSVariables(theme: Theme) {
  const root = document.documentElement
  
  // Colors
  root.style.setProperty('--color-button', theme.colors.buttonBg)
  root.style.setProperty('--color-button-text', theme.colors.buttonText)
  root.style.setProperty('--color-profile-text', theme.colors.profileText)
  root.style.setProperty('--color-accent', theme.colors.accent)
  
  // Typography
  root.style.setProperty('--font-family', theme.fonts.body)
  root.style.setProperty('--font-family-heading', theme.fonts.heading)
  
  // Spacing & Layout
  root.style.setProperty('--radius-button', `${theme.radius.button}px`)
  root.style.setProperty('--shadow-button', theme.shadows.button)
  
  // ... 20+ more variables
}
```

**Called on:**
- Theme change (ThemeContext)
- Config change (editor page)
- Initial load (both contexts)

#### 3. Component Consumption

Components reference CSS variables exclusively—no direct theme object access:

```typescript
// ✓ CORRECT - Pure CSS variable references
const buttonStyle = {
  backgroundColor: 'var(--color-button)',
  color: 'var(--color-button-text)',
  borderRadius: 'var(--radius-button)',
  boxShadow: 'var(--shadow-button)',
  fontFamily: 'var(--font-family)',
}

// ✗ WRONG - Direct theme reads (breaks reactivity)
const buttonStyle = {
  backgroundColor: theme.colors.buttonBg,  // DON'T DO THIS
  color: theme.colors.buttonText,
}
```

### CSS Variables Emitted

#### Colors
- `--color-button` - Button background
- `--color-button-hover` - Button hover state
- `--color-button-text` - Button text color
- `--color-button-glass` - Glass button overlay (rgba)
- `--color-profile-text` - Profile name color
- `--color-profile-bio` - Bio text color
- `--color-accent` - Accent/link color
- `--color-video-card-bg` - Video card background
- `--color-video-card-border` - Video card border
- `--color-video-card-text` - Video card text
- `--color-video-card-play-button` - Play button color

#### Borders
- `--border-button` - Full border declaration (e.g., "1px solid #000")
- `--border-button-color` - Border color only
- `--border-button-width` - Border width (px)

#### Shadows
- `--shadow-button` - Default button shadow
- `--shadow-button-clay` - Clay morphism shadow
- `--shadow-button-soft` - Soft shadow variant

#### Layout
- `--radius-button` - Button border radius
- `--radius-video-card` - Video card border radius
- `--radius-card` - Generic card border radius
- `--dimension-button-height` - Button height
- `--dimension-video-card-height` - Video card height

#### Typography
- `--font-family` - Body font family
- `--font-family-heading` - Heading font family

### Special Handling

#### Glass & Outline Buttons

When `buttonStyle` is `'glass'` or `'outline'` and `borderWidth` is 0, the system automatically applies a `1px solid` border fallback to ensure visibility:

```typescript
if ((buttonStyle === 'glass' || buttonStyle === 'outline') && borderWidth === 0) {
  root.style.setProperty('--border-button', `1px solid ${borderColor}`)
}
```

#### Video Cards

Video card tokens are derived from button palette to maintain theme consistency:

```typescript
const buttonBg = theme.colors.buttonBg
const videoCardBg = `${buttonBg}${theme.colors.buttonBg.startsWith('#') ? '1a' : ''}`  // +10% opacity
```

### File Structure

```
lib/
  themes.ts              # Single source - all themes + utilities
  
app/
  editor/page.tsx        # Calls applyThemeToCSSVariables on change
  globals.css            # CSS variable defaults (:root)
  
components/
  card/BioCard.tsx       # Pure var() consumption
  
contexts/
  ThemeContext.tsx       # Calls applyThemeToCSSVariables on theme change
```

### Adding New Tokens

1. Add to `Theme` interface in `lib/themes.ts`
2. Update `applyThemeToCSSVariables()` to emit the new CSS variable
3. Add default fallback in `app/globals.css`
4. Use in components via `var(--your-new-token)`
5. Update all 22 theme definitions with the new token value

### Migration Notes

**Removed:**
- `lib/themes/` subfolder (parallel JSON system, never fully wired)
- Direct theme property reads in components
- Hardcoded CSS in video cards
- Inline color/font calculations

**Why CSS Variables:**
- Industry standard (Linktree, Notion, Linear, etc.)
- Instant reactivity across all DOM elements
- Simpler component code (no theme prop drilling)
- Works with third-party components and iframes
- Easier to debug (inspect :root in DevTools)

---

**Last Updated:** 2026-01-08  
**Version:** 1.0.0
