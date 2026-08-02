import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Allowed hostnames we will proxy (whitelist for security)
const ALLOWED_HOSTS = [
  'drive.google.com',
  'lh3.googleusercontent.com',
  'drive.usercontent.google.com',
]

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const url = searchParams.get('url')

  if (!url) {
    return new NextResponse('Missing url param', { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return new NextResponse('Invalid URL', { status: 400 })
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return new NextResponse('Host not allowed', { status: 403 })
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        // Impersonate a browser to avoid Google blocking bot requests
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: 'https://drive.google.com/',
      },
      redirect: 'follow',
    })

    if (!upstream.ok) {
      return new NextResponse(`Upstream error: ${upstream.status} ${upstream.statusText}`, {
        status: upstream.status,
      })
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg'
    const body = await upstream.arrayBuffer()

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err: any) {
    return new NextResponse(`Proxy error: ${err.message}`, { status: 500 })
  }
}
