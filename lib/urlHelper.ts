/**
 * Dynamic URL helper for BioLink / Linktree app
 * URL is tied to the account username (Linktree-style), not a random card id.
 */

export function getCleanUsernameSlug(usernameOrTitle?: string): string {
  if (!usernameOrTitle) return ''

  return usernameOrTitle
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')
}

/** Read account username from localStorage (client only). */
export function getAccountUsername(): string {
  if (typeof window === 'undefined') return ''
  try {
    const profileStr = localStorage.getItem('userProfile')
    if (!profileStr) return ''
    const profile = JSON.parse(profileStr)
    return getCleanUsernameSlug(profile.username || profile.handle || '')
  } catch {
    return ''
  }
}

/** Resolve the canonical card key — always the account username / handle slug. */
export function resolveCardKey(handle?: string, fallback?: string): string {
  return (
    getCleanUsernameSlug(handle) ||
    getCleanUsernameSlug(fallback) ||
    getAccountUsername() ||
    ''
  )
}

export function getCardPublicUrl(_cardIdOrHandle?: string, usernameOrTitle?: string): string {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'

  const slug =
    getCleanUsernameSlug(usernameOrTitle) ||
    getCleanUsernameSlug(_cardIdOrHandle) ||
    getAccountUsername()

  if (!slug) return `${origin}/create`
  return `${origin}/${slug}`
}

export function getDisplayUrlSlug(_cardIdOrHandle?: string, usernameOrTitle?: string): string {
  const slug =
    getCleanUsernameSlug(usernameOrTitle) ||
    getCleanUsernameSlug(_cardIdOrHandle) ||
    getAccountUsername()
  return slug ? `biolink.ee/${slug}` : 'biolink.ee/username'
}
