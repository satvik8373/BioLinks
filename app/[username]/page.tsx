'use client'

import ProfilePage from '@/components/profile/ProfilePage'
import { useEffect } from 'react'

export default function DirectUsernameCardPage({ 
  params 
}: { 
  params: { username: string } 
}) {
  useEffect(() => {
    // Hide body background for clean card display
    document.body.style.background = 'transparent'
    document.body.style.backgroundColor = 'transparent'
    document.documentElement.style.background = 'transparent'
    document.documentElement.style.backgroundColor = 'transparent'
    
    return () => {
      // Restore on unmount
      document.body.style.background = ''
      document.body.style.backgroundColor = ''
      document.documentElement.style.background = ''
      document.documentElement.style.backgroundColor = ''
    }
  }, [])
  
  return <ProfilePage cardId={params.username} />
}
