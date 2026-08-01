/**
 * Dynamic URL helper for BioLink / Linktree app
 * Constructs clean, custom URLs for both local development and production.
 */

export function getCleanUsernameSlug(usernameOrTitle?: string): string {
  if (!usernameOrTitle) return ''
  
  // Clean string: trim, lowercase, replace spaces & special chars with hyphen/letters
  const cleaned = usernameOrTitle
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '')

  return cleaned
}

export function getCardPublicUrl(cardId?: string, usernameOrTitle?: string): string {
  const origin = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'http://localhost:3000'

  // Prioritize custom handle / username slug over random internal cardId
  const customSlug = getCleanUsernameSlug(usernameOrTitle)
  const identifier = customSlug || cardId || 'satvikpatel8373'

  return `${origin}/card/${identifier}`
}

export function getDisplayUrlSlug(usernameOrTitle?: string, cardId?: string): string {
  const customSlug = getCleanUsernameSlug(usernameOrTitle)
  const identifier = customSlug || cardId || 'satvikpatel8373'
  return `biolink.ee/${identifier}`
}
