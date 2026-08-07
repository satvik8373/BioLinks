export function getLocalUserId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const profileStr = localStorage.getItem('userProfile')
    if (profileStr) {
      const profile = JSON.parse(profileStr)
      if (profile.id || profile.uid) return profile.id || profile.uid
    }
  } catch { /* ignore */ }
  let localId = localStorage.getItem('localUserId')
  if (!localId) {
    localId = 'user_' + Math.random().toString(36).substring(2, 11)
    localStorage.setItem('localUserId', localId)
  }
  return localId
}

export async function saveUserProfile(profile: Record<string, any>) {
  const userId = profile.id || profile.uid || getLocalUserId()
  if (!userId) return { success: false }

  const username = String(profile.username || '').toLowerCase().trim()
  if (!username) return { success: false }

  // Persist locally so the app can read it back immediately
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('userProfile', JSON.stringify({ ...profile, id: userId }))
    } catch { /* ignore */ }
  }

  return { success: true, userId }
}
