/**
 * Enterprise Template-Centric Design System Interfaces
 * Inspired by Bento, Framer, Beacons & Linktree Pro
 */

export interface ThemeMetadata {
  id: string
  name: string
  author: string
  version: string
  category: 'minimal' | 'dark' | 'glass' | 'luxury' | 'gradient' | 'clay' | 'custom'
  license: 'free' | 'pro'
  preview?: string
  tags?: string[]
}

export interface DesignTokens {
  colors: {
    primary: string
    secondary?: string
    accent?: string
    background: string
    surface: string
    card?: string
    text: string
    textMuted: string
    border?: string
  }
  radius: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    pill?: string
    card?: string
    button?: string
    avatar?: string
  }
  shadows: {
    card?: string
    button?: string
    avatar?: string
    pill?: string
  }
  spacing: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    cardPadding?: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    headingWeight?: number | string
    bodyWeight?: number | string
    headingSize?: string
    bodySize?: string
  }
}

export interface EditorSchema {
  header?: {
    enabled: boolean
    variants: Array<'classic' | 'hero' | 'banner' | 'cover' | 'floating' | 'shape'>
  }
  avatar?: {
    enabled: boolean
    shapes: Array<'circle' | 'rounded' | 'blob' | 'square' | 'hexagon'>
    maxSize: number
    border: boolean
    shadow: boolean
  }
  buttons?: {
    variants: Array<'filled' | 'glass' | 'clay' | 'outline' | 'minimal' | 'gradient'>
    radius: boolean
    shadow: boolean
    icon: boolean
  }
  background?: {
    types: Array<'solid' | 'gradient' | 'image' | 'video' | 'mesh' | 'svg' | 'canvas' | 'lottie' | 'pattern'>
  }
}

export interface ThemeCapabilities {
  supportsVideoBackground: boolean
  supportsParticles: boolean
  supportsGlass: boolean
  supportsClay: boolean
  supportsHero: boolean
  supportsAnimations: boolean
  supportsCustomFonts: boolean
  supportsFloatingObjects: boolean
  supportsMusicPlayer?: boolean
  supportsWallpaperSwitcher?: boolean
}

export interface LayoutSlots {
  header: 'classic' | 'hero' | 'banner' | 'cover' | 'floating'
  profile: 'center' | 'left' | 'compact'
  links: 'stack' | 'grid' | 'carousel' | 'bento'
  social: 'bottom' | 'header' | 'floating-dock'
  footer: 'minimal' | 'full' | 'hidden'
  width?: 'compact' | 'normal' | 'wide' | 'full' | 'custom'
  alignment?: 'center' | 'left'
}

export interface ThemeAssets {
  wallpapers?: string[]
  patterns?: string[]
  decorations?: Array<'blobs' | 'noise' | 'glass-spheres' | 'particles' | 'mesh' | 'stars' | 'aurora'>
  icons?: string[]
}

export interface ThemeMotion {
  hover: 'lift' | 'glow' | 'scale' | 'bounce' | 'none'
  button: 'scale' | 'glow' | 'lift'
  page: 'fade' | 'slide' | 'zoom'
  card: 'float' | 'tilt' | 'static'
  duration?: string
  easing?: string
}

export interface ComponentOverrides {
  Button?: string
  Card?: string
  Avatar?: string
  Header?: string
}

export interface ThemeManifest {
  schemaVersion: '2.1.0' | string
  entry: string
  config: string
  tokens: string
  layout: string
  editor: string
  capabilities: string
  assets: string
  motion: string
  preview: string
}

export interface UserOverrideRules {
  colors?: boolean
  radius?: boolean
  buttons?: boolean
  wallpaper?: boolean
  decorations?: boolean
  typography?: boolean
  layout?: boolean
}

export interface ThemePackage {
  schemaVersion: '2.1.0' | string
  manifest?: ThemeManifest
  config: ThemeMetadata
  tokens: DesignTokens
  editor: EditorSchema
  capabilities: ThemeCapabilities
  slots: LayoutSlots
  assets?: ThemeAssets
  motion?: ThemeMotion
  overrides?: ComponentOverrides
  userOverrideRules?: UserOverrideRules
}
