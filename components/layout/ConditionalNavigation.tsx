'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function ConditionalNavigation() {
  const pathname = usePathname()
  
  // Hide global navigation on editor, card view, redirect, or public profile pages
  const hideNavigation = 
    pathname?.startsWith('/card/') || 
    pathname?.startsWith('/editor') ||
    pathname?.startsWith('/r/') ||
    (pathname?.match(/^\/[a-z0-9-]+$/i) && pathname !== '/' && pathname !== '/login' && pathname !== '/signup' && pathname !== '/create' && pathname !== '/my-cards')
  
  if (hideNavigation) {
    return null
  }
  
  return <Navigation />
}
