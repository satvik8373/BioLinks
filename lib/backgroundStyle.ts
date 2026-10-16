import type { CSSProperties } from 'react'

// Theme paint values contain a color, image layers, or image layers followed by
// a base color. Split only top-level commas, preserving gradient and URL commas.
export function getBackgroundPaint(value?: string): Pick<CSSProperties, 'backgroundColor' | 'backgroundImage'> {
  if (!value?.trim()) return {}

  const layers: string[] = []
  let depth = 0
  let quote = ''
  let start = 0
  for (let i = 0; i < value.length; i++) {
    const char = value[i]
    if (char === '\\') {
      i++
      continue
    }
    if (quote) {
      if (char === quote) quote = ''
    } else if (char === '"' || char === "'") {
      quote = char
    } else if (char === '(') {
      depth++
    } else if (char === ')') {
      depth--
    } else if (char === ',' && depth === 0) {
      layers.push(value.slice(start, i).trim())
      start = i + 1
    }
  }
  layers.push(value.slice(start).trim())

  const last = layers[layers.length - 1]
  const isImage = /^(?:none$|(?:[\w-]*gradient|url|image|image-set|-webkit-image-set|cross-fade|element|paint)\()/i.test(last)
  const backgroundColor = isImage ? 'transparent' : layers.pop()!

  // Explicitly reset the other paint property when switching theme types.
  return { backgroundColor, backgroundImage: layers.join(', ') || 'none' }
}
