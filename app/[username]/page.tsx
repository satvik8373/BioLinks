'use client'

import BioCard from '@/components/card/BioCard'

export default function DirectUsernameCardPage({ 
  params 
}: { 
  params: { username: string } 
}) {
  return <BioCard cardId={params.username} />
}
