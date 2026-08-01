import { NextRequest, NextResponse } from 'next/server'
import { getCard, updateCard, deleteCard, incrementViews, incrementClicks } from '@/lib/firestore'

// GET - Get a specific card by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const { cardId } = params
    const card = await getCard(cardId)

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await incrementViews(cardId)

    return NextResponse.json({ card })
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
    const { config, analytics } = body

    if (!config) {
      return NextResponse.json(
        { error: 'Missing config' },
        { status: 400 }
      )
    }

    await updateCard(cardId, {
      config,
      ...(analytics && { analytics }),
    })

    return NextResponse.json({
      success: true,
      cardId,
    })
  } catch (error: any) {
    console.error('Error updating card:', error)
    return NextResponse.json(
      { error: 'Failed to update card', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete a card
export async function DELETE(
  request: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    const { cardId } = params
    await deleteCard(cardId)

    return NextResponse.json({
      success: true,
      message: 'Card deleted',
    })
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
      await incrementClicks(cardId)
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
