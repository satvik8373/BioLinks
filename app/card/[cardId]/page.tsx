'use client'

import BioCard from '@/components/card/BioCard'

export default function CardPage({ 
  params 
}: { 
  params: { cardId: string } 
}) {
  return <BioCard cardId={params.cardId} />
}