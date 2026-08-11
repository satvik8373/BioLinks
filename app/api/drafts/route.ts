import { NextRequest, NextResponse } from 'next/server'
import { getDraft, saveDraft } from '@/lib/profileService'

// Prevent static generation - this route needs runtime access
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const draft = await getDraft(userId)
    return NextResponse.json({ draft })
  } catch (error: any) {
    console.error('Error getting draft:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, draftData } = body

    if (!userId || !draftData) {
      return NextResponse.json({ error: 'Missing userId or draftData' }, { status: 400 })
    }

    const result = await saveDraft(userId, draftData)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error saving draft:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
