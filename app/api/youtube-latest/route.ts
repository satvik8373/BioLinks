import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Extract video ID if the URL is a direct video, shorts, or embed URL
 */
function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1).split('?')[0].split('/')[0] || null
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/watch')) {
        return u.searchParams.get('v')
      }
      if (u.pathname.startsWith('/shorts/')) {
        return u.pathname.split('/shorts/')[1]?.split('?')[0].split('/')[0] || null
      }
      if (u.pathname.startsWith('/live/')) {
        return u.pathname.split('/live/')[1]?.split('?')[0].split('/')[0] || null
      }
      if (u.pathname.startsWith('/embed/')) {
        return u.pathname.split('/embed/')[1]?.split('?')[0].split('/')[0] || null
      }
    }
    return null
  } catch {
    return null
  }
}

/**
 * Extract channel handle or channel ID from channel URLs:
 * - youtube.com/@handle
 * - youtube.com/channel/UCxxx
 * - youtube.com/c/channelname
 * - youtube.com/user/username
 */
function extractChannelInfoFromUrl(url: string): { type: 'id' | 'handle' | 'custom'; value: string } | null {
  try {
    const u = new URL(url)
    const path = u.pathname

    const handleMatch = path.match(/^\/@([^/]+)/)
    if (handleMatch) return { type: 'handle', value: handleMatch[1] }

    const channelMatch = path.match(/^\/channel\/([^/]+)/)
    if (channelMatch) return { type: 'id', value: channelMatch[1] }

    const customMatch = path.match(/^\/(?:c|user)\/([^/]+)/)
    if (customMatch) return { type: 'custom', value: customMatch[1] }

    return null
  } catch {
    return null
  }
}

/**
 * Resolve channel ID from a YouTube video URL by fetching the video page or oembed
 */
async function resolveChannelIdFromVideoUrl(videoId: string): Promise<string | null> {
  try {
    // Attempt 1: Fetch YouTube video page HTML
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      next: { revalidate: 3600 }
    })
    if (res.ok) {
      const html = await res.text()
      const match1 = html.match(/"channelId":"(UC[^"]+)"/)
      if (match1) return match1[1]

      const match2 = html.match(/externalChannelId":"(UC[^"]+)"/)
      if (match2) return match2[1]

      const match3 = html.match(/meta itemprop="channelId" content="(UC[^"]+)"/)
      if (match3) return match3[1]

      const match4 = html.match(/<link itemprop="name" href="https:\/\/www\.youtube\.com\/channel\/(UC[^"]+)">/)
      if (match4) return match4[1]
    }

    // Attempt 2: Oembed fallback
    const oembedRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
    if (oembedRes.ok) {
      const data = await oembedRes.json()
      if (data.author_url) {
        const authorInfo = extractChannelInfoFromUrl(data.author_url)
        if (authorInfo?.type === 'id') return authorInfo.value
        if (authorInfo?.type === 'handle') {
          return await resolveHandleToChannelId(authorInfo.value)
        }
      }
    }

    return null
  } catch {
    return null
  }
}

/**
 * Resolve a YouTube @handle or custom name to a channel ID
 */
async function resolveHandleToChannelId(handle: string): Promise<string | null> {
  try {
    const pageUrl = handle.startsWith('UC') ? `https://www.youtube.com/channel/${handle}` : `https://www.youtube.com/@${handle}`
    const res = await fetch(pageUrl, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      next: { revalidate: 3600 }
    })
    if (!res.ok) return null
    const html = await res.text()

    const match1 = html.match(/"channelId":"(UC[^"]+)"/)
    if (match1) return match1[1]

    const match2 = html.match(/externalId":"(UC[^"]+)"/)
    if (match2) return match2[1]

    const match3 = html.match(/meta itemprop="channelId" content="(UC[^"]+)"/)
    if (match3) return match3[1]

    return null
  } catch {
    return null
  }
}

/**
 * Fetch latest video URL and info from a YouTube channel using RSS feed
 */
async function fetchLatestVideoFromRSS(channelId: string): Promise<{ latestUrl: string; videoId: string; title: string } | null> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    const res = await fetch(rssUrl, { cache: 'no-store' })
    if (!res.ok) return null

    const xml = await res.text()
    const videoIdMatch = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)
    if (!videoIdMatch) return null

    const titleMatch = xml.match(/<title>([^<]+)<\/title>/g)
    // First title is channel title, second entry title is first video title
    let title = 'Latest Video'
    if (titleMatch && titleMatch.length > 1) {
      title = titleMatch[1].replace(/<\/?title>/g, '')
    }

    const videoId = videoIdMatch[1]
    return {
      latestUrl: `https://www.youtube.com/watch?v=${videoId}`,
      videoId,
      title
    }
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  try {
    let channelId: string | null = null

    // 1. Check if it's a direct video URL (e.g. youtube.com/watch?v=xxx or youtu.be/xxx)
    const videoId = extractVideoId(url)
    if (videoId) {
      channelId = await resolveChannelIdFromVideoUrl(videoId)
    }

    // 2. If not a video URL or channelId not resolved yet, check channel URL format
    if (!channelId) {
      const channelInfo = extractChannelInfoFromUrl(url)
      if (channelInfo) {
        if (channelInfo.type === 'id') {
          channelId = channelInfo.value
        } else {
          channelId = await resolveHandleToChannelId(channelInfo.value)
        }
      }
    }

    // 3. Fallback: try resolving full URL as channel page
    if (!channelId && url.toLowerCase().includes('youtube.com')) {
      try {
        const u = new URL(url)
        const path = u.pathname.replace(/^\//, '')
        if (path) {
          channelId = await resolveHandleToChannelId(path)
        }
      } catch {
        // ignore
      }
    }

    if (!channelId) {
      return NextResponse.json({ error: 'Could not extract channel ID', latestUrl: url })
    }

    const latest = await fetchLatestVideoFromRSS(channelId)
    if (!latest) {
      return NextResponse.json({ error: 'No latest video found for channel', channelId, latestUrl: url })
    }

    return NextResponse.json({
      latestUrl: latest.latestUrl,
      videoId: latest.videoId,
      title: latest.title,
      embedUrl: `https://www.youtube.com/embed/${latest.videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${latest.videoId}/hqdefault.jpg`,
      channelId
    })
  } catch (err) {
    console.error('[youtube-latest] Error:', err)
    return NextResponse.json({ error: 'Internal error', latestUrl: url }, { status: 500 })
  }
}
