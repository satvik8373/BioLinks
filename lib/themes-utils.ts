/**
 * Theme Utility Functions (No theme data)
 * These are helper functions that don't depend on theme definitions
 */

// ─── Helper to transform YouTube / Spotify / SoundCloud / Vimeo URLs to embed format ───
export function getEmbedIframeUrl(url: string): string {
  if (!url) return ''
  const trimmed = url.trim()

  // YouTube single video match
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1]
    return `https://www.youtube.com/embed/${videoId}?playsinline=1`
  }

  // YouTube channel ID match
  const ytChannelMatch = trimmed.match(/youtube\.com\/channel\/(UC[\w-]{22})/)
  if (ytChannelMatch && ytChannelMatch[1]) {
    const channelId = ytChannelMatch[1]
    const uploadsPlaylistId = 'UU' + channelId.substring(2)
    return `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}&playsinline=1`
  }

  // YouTube channel handle / user match
  const ytUserMatch = trimmed.match(/youtube\.com\/(?:c\/|user\/|@)([\w-]+)/)
  if (ytUserMatch && ytUserMatch[1]) {
    return `https://www.youtube.com/embed?listType=user_uploads&list=${ytUserMatch[1]}&playsinline=1`
  }

  // Spotify match
  const spotifyMatch = trimmed.match(/open\.spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/)
  if (spotifyMatch && spotifyMatch[1] && spotifyMatch[2]) {
    return `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}?utm_source=generator`
  }

  // SoundCloud match
  if (trimmed.includes('soundcloud.com') && !trimmed.includes('w.soundcloud.com/player')) {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(trimmed)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:.*#|.*\/)?([0-9]+)/)
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?byline=0&title=0`
  }

  // Google Drive match
  const driveMatch = trimmed.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)([a-zA-Z0-9_-]+)/)
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
  }

  return trimmed
}

// ─── Helper to parse Google Drive URLs for direct image/media viewing ───
export function parseGoogleDriveUrl(url: string): { fileId: string | null; directUrl: string; previewUrl: string } {
  if (!url) return { fileId: null, directUrl: '', previewUrl: '' }
  const trimmed = url.trim()

  if (!trimmed.includes('drive.google.com') && !trimmed.includes('lh3.googleusercontent.com')) {
    return { fileId: null, directUrl: trimmed, previewUrl: trimmed }
  }

  const match = trimmed.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/)
  if (match && match[1]) {
    const fileId = match[1]
    const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`
    const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(thumbnailUrl)}`
    return {
      fileId,
      directUrl: proxiedUrl,
      previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    }
  }

  return { fileId: null, directUrl: trimmed, previewUrl: trimmed }
}
