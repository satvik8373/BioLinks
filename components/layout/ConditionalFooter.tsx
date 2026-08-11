'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  
  // Hide global footer on editor, card view, redirect, or profile pages
  const hideFooter = 
    pathname?.startsWith('/card/') || 
    pathname?.startsWith('/editor') ||
    pathname?.startsWith('/r/') ||
    (pathname?.match(/^\/[a-z0-9-]+$/i) && pathname !== '/' && pathname !== '/login' && pathname !== '/signup' && pathname !== '/create' && pathname !== '/my-cards')
  
  if (hideFooter) {
    return null
  }
  
  return <Footer />
}
