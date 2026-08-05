/**
 * PROPER Theme Conversion - Captures ALL design features
 * Run with: node scripts/convertThemesProperly.js
 */

const fs = require('fs')
const path = require('path')

// Read themes.ts and extract full theme objects
const themesFile = fs.readFileSync(path.join(__dirname, '../lib/themes.ts'), 'utf-8')

// Extract the entire THEMES array
const themesArrayMatch = themesFile.match(/export const THEMES: Theme\[\] = \[([\s\S]*?)\n\]/m)
if (!themesArrayMatch) {
  console.error('❌ Could not find THEMES array')
  process.exit(1)
}

// Parse each theme block manually
const themesText = themesArrayMatch[1]

// Split by theme comment headers (// ── N. NAME ──)
const themeBlocks = themesText.split(/\/\/ ── \d+\./g).filter(b => b.trim())

console.log(`📊 Found ${themeBlocks.length} theme blocks\n`)

const themes = []

themeBlocks.forEach((block, index) => {
  try {
    // Extract theme ID
    const idMatch = block.match(/id:\s*'([^']+)'/)
    if (!idMatch) return
    
    const id = idMatch[1]
    
    // Extract name
    const nameMatch = block.match(/name:\s*'([^']+)'/)
    const name = nameMatch ? nameMatch[1] : id
    
    // Extract category
    const categoryMatch = block.match(/category:\s*'([^']+)'/)
    const category = categoryMatch ? categoryMatch[1] : 'minimal'
    
    // Extract isPremium
    const isPremiumMatch = block.match(/isPremium[?:]?\s*(true|false)/)
    const isPro = isPremiumMatch ? isPremiumMatch[1] === 'true' : false
    
    // Extract colors
    const bgMatch = block.match(/background:\s*'([^']+)'/)
    const bgImageMatch = block.match(/backgroundImage:\s*'([^']+)'/)
    const bgOverlayMatch = block.match(/backgroundOverlay:\s*'([^']+)'/)
    const bgMeshMatch = block.match(/backgroundMesh:\s*mesh\(([\s\S]*?)\)/)
    const bgGradientMatch = block.match(/backgroundGradient:\s*\{[^}]*from:\s*'([^']+)'[^}]*to:\s*'([^']+)'[^}]*(?:direction:\s*'([^']+)')?/)
    
    const buttonDefaultMatch = block.match(/buttonDefault:\s*'([^']+)'/)
    const buttonHoverMatch = block.match(/buttonHover:\s*'([^']+)'/)
    const buttonTextMatch = block.match(/buttonText:\s*'([^']+)'/)
    const profileTextMatch = block.match(/profileText:\s*'([^']+)'/)
    const profileBioMatch = block.match(/profileBio:\s*'([^']+)'/)
    const accentMatch = block.match(/accent:\s*'([^']+)'/)
    
    // Extract buttonStyle
    const borderRadiusMatch = block.match(/borderRadius:\s*(\d+)/)
    const borderWidthMatch = block.match(/borderWidth:\s*(\d+)/)
    const borderColorMatch = block.match(/borderColor:\s*'([^']+)'/)
    const shadowMatch = block.match(/shadow:\s*(true|false)/)
    const shadowStyleMatch = block.match(/shadowStyle[?:]?\s*'([^']+)'/)
    const styleMatch = block.match(/style:\s*'([^']+)'/)
    
    // Extract fonts
    const headingFontMatch = block.match(/heading:\s*'([^']+)'/)
    const bodyFontMatch = block.match(/body:\s*'([^']+)'/)
    
    // Build background
    let background = bgMatch ? bgMatch[1] : '#FFFFFF'
    
    if (bgGradientMatch) {
      const direction = bgGradientMatch[3] || '135deg'
      background = `linear-gradient(${direction}, ${bgGradientMatch[1]} 0%, ${bgGradientMatch[2]} 100%)`
    } else if (bgMeshMatch) {
      // Extract mesh gradient strings
      const meshContent = bgMeshMatch[1]
      const gradients = meshContent.match(/'([^']+)'/g)
      if (gradients) {
        background = gradients.map(g => g.replace(/'/g, '')).join(', ')
      }
    }
    
    // Map button style
    const buttonStyle = styleMatch ? styleMatch[1] : 'solid'
    const variantMap = {
      'solid': 'filled',
      'fill': 'filled',
      'glass': 'glass',
      'clay': 'clay',
      'outline': 'outline',
      'soft': 'soft',
      'hard-shadow': 'filled'
    }
    
    // Map shadow
    const hasShadow = shadowMatch ? shadowMatch[1] === 'true' : false
    const shadowStyle = shadowStyleMatch ? shadowStyleMatch[1] : 'soft'
    const shadowMap = {
      'none': 'none',
      'soft': 'sm',
      'strong': 'md',
      'hard': 'lg'
    }
    
    const config = {
      id,
      name,
      category,
      isPro,
      colors: {
        background,
        surface: bgMatch ? bgMatch[1] : '#FFFFFF',
        text: profileTextMatch ? profileTextMatch[1] : '#000000',
        textSecondary: profileBioMatch ? profileBioMatch[1] : '#666666',
        primary: buttonDefaultMatch ? buttonDefaultMatch[1] : '#000000',
        primaryHover: buttonHoverMatch ? buttonHoverMatch[1] : '#333333',
        border: borderColorMatch ? borderColorMatch[1] : 'rgba(0, 0, 0, 0.1)',
        accent: accentMatch ? accentMatch[1] : '#000000'
      },
      button: {
        variant: variantMap[buttonStyle] || 'filled',
        radius: borderRadiusMatch ? parseInt(borderRadiusMatch[1]) : 12,
        shadow: hasShadow ? (shadowMap[shadowStyle] || 'md') : 'none',
        borderWidth: borderWidthMatch ? parseInt(borderWidthMatch[1]) : 0,
        style: buttonStyle // Keep original for reference
      },
      card: {
        variant: 'flat',
        radius: 16
      },
      avatar: {
        variant: 'circle',
        size: 96,
        border: true
      },
      typography: {
        fontFamily: bodyFontMatch ? `${bodyFontMatch[1]}, system-ui, sans-serif` : 'Inter, system-ui, sans-serif',
        headingFamily: headingFontMatch ? `${headingFontMatch[1]}, system-ui, sans-serif` : 'Inter, system-ui, sans-serif'
      },
      layout: {
        style: 'centered',
        maxWidth: 680,
        spacing: 'comfortable'
      }
    }
    
    // Add special properties
    if (bgImageMatch) {
      config.backgroundImage = bgImageMatch[1]
    }
    if (bgOverlayMatch) {
      config.backgroundOverlay = bgOverlayMatch[1]
    }
    if (bgMeshMatch) {
      config.backgroundMesh = background
    }
    
    themes.push(config)
    
  } catch (error) {
    console.error(`❌ Error parsing theme block ${index + 1}:`, error.message)
  }
})

console.log(`✅ Parsed ${themes.length} themes\n`)

// Create themes directory
const themesDir = path.join(__dirname, '../themes')
if (!fs.existsSync(themesDir)) {
  fs.mkdirSync(themesDir, { recursive: true })
}

let count = 0

themes.forEach(theme => {
  const themeFolder = path.join(themesDir, theme.id)
  if (!fs.existsSync(themeFolder)) {
    fs.mkdirSync(themeFolder, { recursive: true })
  }
  
  const configPath = path.join(themeFolder, 'config.json')
  fs.writeFileSync(configPath, JSON.stringify(theme, null, 2), 'utf-8')
  
  console.log(`✅ ${theme.id} (${theme.name}) - ${theme.button.style} style, ${theme.typography.headingFamily.split(',')[0]} font`)
  count++
})

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
console.log(`✅ Created ${count} complete theme configs`)
console.log(`📁 Location: themes/*/config.json`)
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
