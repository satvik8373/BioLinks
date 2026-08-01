'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function ConditionalNavigation() {
  const pathname = usePathname()
  
  // Hide navigation on card view pages (for clean bio link display)
  // Also hide on editor (has its own navigation)
  const hideNavigation = 
    pathname?.startsWith('/card/') || 
    pathname?.startsWith('/editor') ||
    pathname?.startsWith('/r/') // tracking redirects
  
  if (hideNavigation) {
    return null
  }
  
  return <Navigation />
}
