import { NextRequest, NextResponse } from 'next/server'
import { getCard, saveCard, deleteCard, incrementViews, incrementClicks } from '@/lib/firestore'
import { getCardGlobal, storeCardGlobal, deleteCardGlobal } from '@/lib/cardStore'
import { claimUsername, UsernameTakenError } from '@/lib/usernameRegistry'

// GET - Get a specific card by ID or handle slug across any device/phone/browser
export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const { cardId } = params

    // 1. First check global server cardStore (works on any device/phone/browser!)
    let card = getCardGlobal(cardId)

    // 2. If not found in global cardStore, check Firestore
    if (!card) {
      try {
        const fsCard = await getCard(cardId)
        if (fsCard) {
          card = {
            id: fsCard.id,
            config: fsCard.config,
            analytics: fsCard.analytics || { views: 0, clicks: 0 },
            createdAt: typeof fsCard.createdAt === 'string' ? fsCard.createdAt : new Date().toISOString(),
          }
          // Cache into global cardStore for instant access
          storeCardGlobal(card)
        }
      } catch (fsErr) {
        console.warn('Firestore fetch notice:', fsErr)
      }
    }

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      )
    }

    // Increment view count in background
    try {
      if (card.analytics) {
        card.analytics.views = (card.analytics.views || 0) + 1
        storeCardGlobal(card)
      }
      await incrementViews(card.id)
    } catch {}

    return NextResponse.json({ card }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error: any) {
    console.error('Error getting card:', error)
    return NextResponse.json(
      { error: 'Failed to get card', message: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update a card
export async function PUT(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const { cardId } = params
    const body = await request.json()
    const { config, analytics, handle, previousHandle, ownerId } = body

    if (!config || !ownerId) {
      return NextResponse.json(
        { error: 'Missing config or ownerId' },
        { status: 400 }
      )
    }

    const existing = getCardGlobal(cardId)
    const handleSlug = (
      handle ||
      config?.profile?.handle ||
      (config?.profile?.title
        ? config.profile.title.toLowerCase().replace(/[^a-z0-9]/g, '')
        : '') ||
      existing?.handle ||
      cardId
    ).toLowerCase()

    const oldHandle = (previousHandle || existing?.handle || cardId).toLowerCase()

    try {
      await claimUsername(handleSlug, ownerId, oldHandle)
    } catch (error) {
      if (error instanceof UsernameTakenError) {
        return NextResponse.json({ error: 'Username is already taken' }, { status: 409 })
      }
      throw error
    }

    const updatedRecord = {
      id: handleSlug,
      handle: handleSlug,
      config,
      analytics: analytics || existing?.analytics || { views: 0, clicks: 0 },
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    storeCardGlobal(updatedRecord, oldHandle !== handleSlug ? oldHandle : undefined)

    try {
      // A renamed handle is a new Firestore document. Write it first so a
      // failed write never releases the existing username, then remove the
      // old document so it cannot be resurrected by a later read.
      await saveCard(handleSlug, {
        config,
        analytics: updatedRecord.analytics,
        createdAt: updatedRecord.createdAt,
      })
      if (oldHandle !== handleSlug) {
        await deleteCard(oldHandle)
      }
    } catch (fsErr) {
      console.warn('Firestore update notice:', fsErr)
    }

    return NextResponse.json({
      success: true,
      cardId: handleSlug,
      handle: handleSlug,
    })
  } catch (error: any) {
    console.error('Error updating card:', error)
    return NextResponse.json(
      { error: 'Failed to update card', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete a card (also removes old handle alias when renaming)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const { cardId } = params
    const { searchParams } = new URL(request.url)
    const oldHandle = searchParams.get('oldHandle')

    // Wipe the card itself
    deleteCardGlobal(cardId)
    if (oldHandle && oldHandle !== cardId) deleteCardGlobal(oldHandle)

    try { await deleteCard(cardId) } catch {}

    return NextResponse.json({ success: true, message: 'Card deleted' })
  } catch (error: any) {
    console.error('Error deleting card:', error)
    return NextResponse.json(
      { error: 'Failed to delete card', message: error.message },
      { status: 500 }
    )
  }
}

// POST - Track click analytics
export async function POST(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const { cardId } = params
    const body = await request.json()
    const { action } = body

    if (action === 'click') {
      const card = getCardGlobal(cardId)
      if (card && card.analytics) {
        card.analytics.clicks = (card.analytics.clicks || 0) + 1
        storeCardGlobal(card)
      }
      try {
        await incrementClicks(cardId)
      } catch {}
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error tracking analytics:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics', message: error.message },
      { status: 500 }
    )
  }
}
