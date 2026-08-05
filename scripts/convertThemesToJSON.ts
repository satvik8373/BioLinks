/**
 * Migration Script: Convert lib/themes.ts to JSON format
 * 
 * Run with: npx ts-node scripts/convertThemesToJSON.ts
 */

import { THEMES } from '../lib/themes'
import type { Theme } from '../lib/themes'
import type { ThemeConfig } from '../lib/themeEngine'
import * as fs from 'fs'
import * as path from 'path'

function convertToThemeConfig(theme: Theme): ThemeConfig {
  // Map button style to variant
  const buttonVariantMap: Record<string, any> = {
    'solid': 'filled',
    'fill': 'filled',
    'glass': 'glass',
    'clay': 'clay',
    'outline': 'outline',
    'soft': 'soft',
    'hard-shadow': 'filled',
  }

  // Map shadow style
  const shadowMap: Record<string, any> = {
    'none': 'none',
    'soft': 'shadow-soft',
    'strong': 'shadow-md',
    'hard': 'shadow-lg',
  }

  // Determine background
  let background = theme.colors.background
  
  if (theme.colors.backgroundGradient) {
    const { from, to, direction = '135deg' } = theme.colors.backgroundGradient
    background = `linear-gradient(${direction}, ${from} 0%, ${to} 100%)`
  } else if (theme.colors.backgroundMesh) {
    background = theme.colors.backgroundMesh
  }

  // Determine category
  const categoryMap: Record<string, ThemeConfig['category']> = {
    'minimal': 'minimal',
    'dark': 'minimal',
    'gradient': 'gradient',
    'mesh': 'gradient',
    'image': 'minimal',
    'vibrant': 'glass',
  }

  const config: ThemeConfig = {
    id: theme.id,
    name: theme.name,
    category: categoryMap[theme.category] || 'minimal',
    isPro: theme.isPremium || false,
    colors: {
      background,
      surface: theme.colors.background,
      text: theme.colors.profileText,
      textSecondary: theme.colors.profileBio,
      primary: theme.colors.buttonDefault,
      primaryHover: theme.colors.buttonHover,
      border: theme.buttonStyle.borderColor || 'rgba(0, 0, 0, 0.1)',
      accent: theme.colors.accent,
    },
    button: {
      variant: buttonVariantMap[theme.buttonStyle.style] || 'filled',
      radius: theme.buttonStyle.borderRadius,
      shadow: theme.buttonStyle.shadow 
        ? (shadowMap[theme.buttonStyle.shadowStyle || 'soft'] || 'md')
        : 'none',
      borderWidth: theme.buttonStyle.borderWidth || 0,
    },
    card: {
      variant: 'flat',
      radius: 16,
    },
    avatar: {
      variant: 'circle',
      size: 96,
      border: true,
    },
    typography: {
      fontFamily: `${theme.fonts.body}, system-ui, sans-serif`,
      headingFamily: `${theme.fonts.heading}, system-ui, sans-serif`,
    },
    spacing: 'comfortable',
    layout: {
      style: 'centered',
      maxWidth: 680,
    },
  }

  // Add metadata for special backgrounds
  if (theme.colors.backgroundImage) {
    (config as any).backgroundImage = theme.colors.backgroundImage
  }
  if (theme.colors.backgroundOverlay) {
    (config as any).backgroundOverlay = theme.colors.backgroundOverlay
  }
  if (theme.colors.backgroundVideo) {
    (config as any).backgroundVideo = theme.colors.backgroundVideo
  }
  if (theme.colors.backgroundIframe) {
    (config as any).backgroundIframe = theme.colors.backgroundIframe
  }
  if (theme.headerLayout) {
    (config as any).headerLayout = theme.headerLayout
  }

  return config
}

function main() {
  const themesDir = path.join(__dirname, '../themes')
  
  // Create themes directory if it doesn't exist
  if (!fs.existsSync(themesDir)) {
    fs.mkdirSync(themesDir, { recursive: true })
  }

  let convertedCount = 0
  let skippedCount = 0

  THEMES.forEach((theme) => {
    const themeFolder = path.join(themesDir, theme.id)
    const configPath = path.join(themeFolder, 'config.json')

    // Skip if already exists
    if (fs.existsSync(configPath)) {
      console.log(`⏭️  Skipping ${theme.id} (already exists)`)
      skippedCount++
      return
    }

    // Create folder
    if (!fs.existsSync(themeFolder)) {
      fs.mkdirSync(themeFolder, { recursive: true })
    }

    // Convert and save
    const config = convertToThemeConfig(theme)
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')
    
    console.log(`✅ Converted ${theme.id} (${theme.name})`)
    convertedCount++
  })

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ Converted: ${convertedCount}`)
  console.log(`⏭️  Skipped:   ${skippedCount}`)
  console.log(`📦 Total:     ${THEMES.length}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
}

main()
