import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const CLOUD_NAME  = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const API_KEY     = process.env.CLOUDINARY_API_KEY!
const API_SECRET  = process.env.CLOUDINARY_API_SECRET!

/**
 * POST /api/cloudinary/delete
 * Body: { public_id: string }
 *
 * Deletes an image from Cloudinary using the Admin API (signed request).
 * API_SECRET never leaves the server.
 */
export async function POST(req: NextRequest) {
  try {
    const { public_id } = await req.json()

    if (!public_id || typeof public_id !== 'string') {
      return NextResponse.json({ error: 'public_id is required' }, { status: 400 })
    }
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return NextResponse.json({ error: 'Cloudinary env vars not configured' }, { status: 500 })
    }

    // Build signed request
    const timestamp = Math.floor(Date.now() / 1000)
    const toSign    = `public_id=${public_id}&timestamp=${timestamp}${API_SECRET}`
    const signature = crypto.createHash('sha256').update(toSign).digest('hex')

    const form = new URLSearchParams()
    form.append('public_id', public_id)
    form.append('timestamp', String(timestamp))
    form.append('api_key',   API_KEY)
    form.append('signature', signature)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
      { method: 'POST', body: form }
    )

    const data = await res.json()

    if (data.result === 'ok' || data.result === 'not found') {
      // "not found" is fine — image was already deleted or never existed
      return NextResponse.json({ success: true, result: data.result })
    }

    return NextResponse.json({ error: data.result || 'Delete failed' }, { status: 400 })
  } catch (err: any) {
    console.error('Cloudinary delete error:', err)
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
