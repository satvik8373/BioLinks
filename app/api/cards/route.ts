import { NextRequest, NextResponse } from 'next/server'
import { saveCard } from '@/lib/firestore'

// POST - Save a new card to Firestore
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cardId, config, analytics } = body

    if (!cardId || !config) {
      return NextResponse.json(
        { error: 'Missing cardId or config' },
        { status: 400 }
      )
    }

    // Save to Firestore
    const result = await saveCard(cardId, {
      config,
      analytics: analytics || { views: 0, clicks: 0 },
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      cardId: result.cardId,
      url: `/card/${result.cardId}`,
    })
  } catch (error: any) {
    console.error('Error saving card:', error)
    return NextResponse.json(
      { error: 'Failed to save card', message: error.message },
      { status: 500 }
    )
  }
}
