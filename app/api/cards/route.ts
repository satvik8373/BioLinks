import { NextRequest, NextResponse } from 'next/server'
import { saveCard } from '@/lib/firestore'
import { storeCardGlobal, getAllCardsGlobal } from '@/lib/cardStore'
import { claimUsername, UsernameTakenError } from '@/lib/usernameRegistry'

// GET - Get all cards published on server
export async function GET() {
  try {
    const cards = getAllCardsGlobal()
    return NextResponse.json({ cards })
  } catch (error: any) {
    console.error('Error fetching cards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cards', message: error.message },
      { status: 500 }
    )
  }
}

// POST - Save a card globally for cross-device availability
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cardId, handle, config, analytics, previousHandle, ownerId } = body

    if (!cardId || !config || !ownerId) {
      return NextResponse.json(
        { error: 'Missing cardId, config, or ownerId' },
        { status: 400 }
      )
    }

    const handleSlug = (
      handle ||
      config?.profile?.handle ||
      (config?.profile?.title
        ? config.profile.title.toLowerCase().replace(/[^a-z0-9]/g, '')
        : '') ||
      cardId
    ).toLowerCase()

    const payload = {
      id: handleSlug,
      handle: handleSlug,
      config,
      analytics: analytics || { views: 0, clicks: 0 },
      createdAt: new Date().toISOString(),
    }

    const oldHandle = previousHandle?.toLowerCase()
    try {
      await claimUsername(handleSlug, ownerId, oldHandle)
    } catch (error) {
      if (error instanceof UsernameTakenError) {
        return NextResponse.json({ error: 'Username is already taken' }, { status: 409 })
      }
      throw error
    }
    storeCardGlobal(payload, oldHandle && oldHandle !== handleSlug ? oldHandle : undefined)

    try {
      await saveCard(handleSlug, {
        config,
        analytics: payload.analytics,
        createdAt: payload.createdAt,
      })
    } catch (fsErr) {
      console.warn('Firestore save notice:', fsErr)
    }

    return NextResponse.json({
      success: true,
      cardId: handleSlug,
      handle: handleSlug,
      url: `/${handleSlug}`,
    })
  } catch (error: any) {
    console.error('Error saving card:', error)
    return NextResponse.json(
      { error: 'Failed to save card', message: error.message },
      { status: 500 }
    )
  }
}
