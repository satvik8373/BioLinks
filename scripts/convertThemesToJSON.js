/**
 * Migration Script: Convert lib/themes.ts to JSON format
 * Run with: node scripts/convertThemesToJSON.js
 */

const fs = require('fs')
const path = require('path')

// Read and parse the themes.ts file
const themesFilePath = path.join(__dirname, '../lib/themes.ts')
const themesContent = fs.readFileSync(themesFilePath, 'utf-8')

// Extract THEMES array using regex
const themesArrayMatch = themesContent.match(/export const THEMES: Theme\[\] = \[([\s\S]*?)\n\]/m)
if (!themesArrayMatch) {
  console.error('❌ Could not find THEMES array')
  process.exit(1)
}

// Parse theme objects
const themesText = themesArrayMatch[1]
const themeMatches = themesText.matchAll(/\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?\},?\s*(?=\/\/|$|\{)/g)

const themes = []
for (const match of themeMatches) {
  const themeBlock = match[0]
  const id = match[1]
  
  // Extract fields using regex
  const nameMatch = themeBlock.match(/name:\s*'([^']+)'/)
  const categoryMatch = themeBlock.match(/category:\s*'([^']+)'/)
  const isPremiumMatch = themeBlock.match(/isPremium:\s*(true|false)/)
  
  // Extract colors
  const backgroundMatch = themeBlock.match(/background:\s*'([^']+)'/)
  const buttonDefaultMatch = themeBlock.match(/buttonDefault:\s*'([^']+)'/)
  const buttonHoverMatch = themeBlock.match(/buttonHover:\s*'([^']+)'/)
  const buttonTextMatch = themeBlock.match(/buttonText:\s*'([^']+)'/)
  const profileTextMatch = themeBlock.match(/profileText:\s*'([^']+)'/)
  const profileBioMatch = themeBlock.match(/profileBio:\s*'([^']+)'/)
  const accentMatch = themeBlock.match(/accent:\s*'([^']+)'/)
  
  // Extract button style
  const borderRadiusMatch = themeBlock.match(/borderRadius:\s*(\d+)/)
  const borderWidthMatch = themeBlock.match(/borderWidth:\s*(\d+)/)
  const borderColorMatch = themeBlock.match(/borderColor:\s*'([^']+)'/)
  const shadowMatch = themeBlock.match(/shadow:\s*(true|false)/)
  const styleMatch = themeBlock.match(/style:\s*'([^']+)'/)
  
  // Extract fonts
  const headingFontMatch = themeBlock.match(/heading:\s*'([^']+)'/)
  const bodyFontMatch = themeBlock.match(/body:\s*'([^']+)'/)
  
  if (!nameMatch || !categoryMatch) continue
  
  const theme = {
    id,
    name: nameMatch[1],
    category: categoryMatch[1],
    isPro: isPremiumMatch ? isPremiumMatch[1] === 'true' : false,
    colors: {
      background: backgroundMatch ? backgroundMatch[1] : '#FFFFFF',
      surface: backgroundMatch ? backgroundMatch[1] : '#FFFFFF',
      text: profileTextMatch ? profileTextMatch[1] : '#000000',
      textSecondary: profileBioMatch ? profileBioMatch[1] : '#666666',
      primary: buttonDefaultMatch ? buttonDefaultMatch[1] : '#000000',
      primaryHover: buttonHoverMatch ? buttonHoverMatch[1] : '#333333',
      border: borderColorMatch ? borderColorMatch[1] : 'rgba(0, 0, 0, 0.1)',
      accent: accentMatch ? accentMatch[1] : '#000000',
    },
    button: {
      variant: styleMatch ? (styleMatch[1] === 'solid' || styleMatch[1] === 'fill' ? 'filled' : styleMatch[1]) : 'filled',
      radius: borderRadiusMatch ? parseInt(borderRadiusMatch[1]) : 12,
      shadow: shadowMatch && shadowMatch[1] === 'true' ? 'md' : 'none',
      borderWidth: borderWidthMatch ? parseInt(borderWidthMatch[1]) : 0,
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
      fontFamily: bodyFontMatch ? `${bodyFontMatch[1]}, system-ui, sans-serif` : 'Inter, system-ui, sans-serif',
      headingFamily: headingFontMatch ? `${headingFontMatch[1]}, system-ui, sans-serif` : 'Inter, system-ui, sans-serif',
    },
    layout: {
      style: 'centered',
      maxWidth: 680,
      spacing: 'comfortable',
    },
  }
  
  themes.push(theme)
}

console.log(`📊 Found ${themes.length} themes\n`)

// Create themes directory
const themesDir = path.join(__dirname, '../themes')
if (!fs.existsSync(themesDir)) {
  fs.mkdirSync(themesDir, { recursive: true })
}

let convertedCount = 0
let skippedCount = 0

themes.forEach((theme) => {
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

  // Save config
  fs.writeFileSync(configPath, JSON.stringify(theme, null, 2), 'utf-8')
  console.log(`✅ Converted ${theme.id} (${theme.name})`)
  convertedCount++
})

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
console.log(`✅ Converted: ${convertedCount}`)
console.log(`⏭️  Skipped:   ${skippedCount}`)
console.log(`📦 Total:     ${themes.length}`)
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
