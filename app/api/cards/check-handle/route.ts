import { NextRequest, NextResponse } from 'next/server'
import { isHandleTaken } from '@/lib/cardStore'
import { getUsernameOwner } from '@/lib/usernameRegistry'

// Prevent static generation - this route needs runtime access
export const dynamic = 'force-dynamic'

const RESERVED = new Set([
  'admin', 'api', 'login', 'signup', 'create', 'editor', 'my-cards',
  'onboarding', 'settings', 'dashboard', 'card', 'preview', 'debug',
  'status', 'terms', 'privacy', 'r', 'help', 'support', 'www',
])

function validateHandle(handle: string): string | null {
  if (!handle) return 'Handle is required'
  if (handle.length < 3) return 'Must be at least 3 characters'
  if (handle.length > 30) return 'Must be 30 characters or fewer'
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(handle) && !/^[a-z0-9]$/.test(handle)) {
    return 'Only lowercase letters, numbers and hyphens allowed'
  }
  if (RESERVED.has(handle)) return 'This name is reserved'
  return null
}

// GET /api/cards/check-handle?handle=satvik&excludeId=abc123
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const raw = (searchParams.get('handle') || '').toLowerCase().trim()
  const excludeId = searchParams.get('excludeId') || searchParams.get('excludeHandle') || undefined
  const ownerId = searchParams.get('ownerId') || undefined

  const validationError = validateHandle(raw)
  if (validationError) {
    return NextResponse.json(
      { available: false, reason: validationError },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  }

  const registeredOwner = await getUsernameOwner(raw).catch(() => null)
  const taken = Boolean(
    (registeredOwner && registeredOwner !== ownerId) ||
    isHandleTaken(raw, excludeId)
  )
  return NextResponse.json(
    { available: !taken, handle: raw, reason: taken ? 'Already taken' : null },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
