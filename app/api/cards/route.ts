import { NextRequest, NextResponse } from 'next/server'
import { saveCard } from '@/lib/firestore'
import { storeCardGlobal } from '@/lib/cardStore'

// POST - Save a card globally for cross-device availability
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cardId, handle, config, analytics } = body

    if (!cardId || !config) {
      return NextResponse.json(
        { error: 'Missing cardId or config' },
        { status: 400 }
      )
    }

    const payload = {
      id: cardId,
      handle: handle || (config?.profile?.handle) || (config?.profile?.title ? config.profile.title.toLowerCase().replace(/[^a-z0-9]/g, '') : ''),
      config,
      analytics: analytics || { views: 0, clicks: 0 },
      createdAt: new Date().toISOString(),
    }

    // 1. Store globally in server cardStore (file & memory persistence)
    storeCardGlobal(payload)

    // 2. Try saving to Firestore if available
    try {
      await saveCard(cardId, {
        config,
        analytics: payload.analytics,
        createdAt: payload.createdAt,
      })
    } catch (fsErr) {
      console.warn('Firestore save notice:', fsErr)
    }

    return NextResponse.json({
      success: true,
      cardId,
      handle: payload.handle,
      url: `/card/${payload.handle || cardId}`,
    })
  } catch (error: any) {
    console.error('Error saving card:', error)
    return NextResponse.json(
      { error: 'Failed to save card', message: error.message },
      { status: 500 }
    )
  }
}
