/** Authoring contract. JSON is validated before it enters the runtime. */
export type ThemeCategory = 'minimal' | 'dark' | 'glass' | 'clay' | 'luxury' | 'gradient' | 'mesh' | 'image' | 'vibrant' | 'custom' | 'skeuomorphic' | 'nature'
export type ThemeLicense = 'free' | 'pro' | 'marketplace' | 'community'

export interface ThemeConfig {
  version?: string
  id: string
  name: string
  category: ThemeCategory
  extends?: string
  namespace?: string
  order?: number
  license?: ThemeLicense | { type: ThemeLicense }
  isPro?: boolean
  isCurated?: boolean
  preview?: { thumbnail?: string; cover?: string }
  meta?: { author?: string; collaborator?: string; description?: string; tags?: string[]; isCurated?: boolean; [key: string]: unknown }
  // Token inputs can be registry IDs or inline specifications. Registries
  // resolve these into the typed ResolvedTheme contract.
  background?: any
  palette?: any
  typography?: any
  spacing?: any
  layout?: any
  components?: any
  [key: string]: any
}

export interface ThemeMetadata {
  id: string
  name: string
  category: ThemeCategory
  isPro: boolean
  isCurated: boolean
  previewUrl?: string
}

export function getLicenseType(config: Pick<ThemeConfig, 'license' | 'isPro'>): ThemeLicense {
  if (config.isPro) return 'pro'
  return typeof config.license === 'string' ? config.license : config.license?.type || 'free'
}
