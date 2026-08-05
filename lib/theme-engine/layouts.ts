/**
 * Layout Component Registry (10/10 Pure Architecture)
 * 
 * Maps layout IDs (`layout-centered`, `layout-hero`, `layout-banner`, `layout-shape`) to header styles & specs.
 */

export interface LayoutConfig {
  id: string
  name: string
  style: 'centered' | 'wide' | 'compact'
  headerLayout: 'classic' | 'hero' | 'banner' | 'shape'
  maxWidth: number
}

export const LAYOUT_REGISTRY: Record<string, LayoutConfig> = {
  'layout-centered': {
    id: 'layout-centered',
    name: 'Classic Centered Profile Layout',
    style: 'centered',
    headerLayout: 'classic',
    maxWidth: 680
  },
  'layout-hero': {
    id: 'layout-hero',
    name: 'Full Width Hero Showcase Layout',
    style: 'centered',
    headerLayout: 'hero',
    maxWidth: 680
  },
  'layout-banner': {
    id: 'layout-banner',
    name: 'Wide Cover Banner Layout',
    style: 'centered',
    headerLayout: 'banner',
    maxWidth: 680
  },
  'layout-shape': {
    id: 'layout-shape',
    name: 'Geometric Shape Backdrop Layout',
    style: 'centered',
    headerLayout: 'shape',
    maxWidth: 680
  },
  'layout-wide': {
    id: 'layout-wide',
    name: 'Wide Canvas Layout',
    style: 'wide',
    headerLayout: 'classic',
    maxWidth: 780
  },
  'layout-compact': {
    id: 'layout-compact',
    name: 'Compact Minimal Layout',
    style: 'compact',
    headerLayout: 'classic',
    maxWidth: 580
  }
}

export function resolveLayout(layoutInput: any): LayoutConfig {
  if (typeof layoutInput === 'string') {
    const key = layoutInput.startsWith('layout-') ? layoutInput : `layout-${layoutInput}`
    if (LAYOUT_REGISTRY[key]) return LAYOUT_REGISTRY[key]
    if (LAYOUT_REGISTRY[layoutInput]) return LAYOUT_REGISTRY[layoutInput]
  }

  if (typeof layoutInput === 'object' && layoutInput !== null) {
    return {
      id: layoutInput.id || 'custom-layout',
      name: layoutInput.name || 'Custom Layout',
      style: layoutInput.style || 'centered',
      headerLayout: layoutInput.headerLayout || 'classic',
      maxWidth: layoutInput.maxWidth || 680
    }
  }

  return LAYOUT_REGISTRY['layout-centered']
}
