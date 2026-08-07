import { NextRequest, NextResponse } from 'next/server'
import { publishProfile } from '@/lib/profileService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, draftData } = body

    if (!userId || !draftData) {
      return NextResponse.json({ error: 'Missing userId or draftData' }, { status: 400 })
    }

    const result = await publishProfile(userId, draftData)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error publishing profile:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
