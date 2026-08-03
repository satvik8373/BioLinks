// Global server card store (persists published cards in-memory and filesystem for instant cross-device sharing)
import fs from 'fs'
import path from 'path'

export interface StoredCard {
  id: string
  handle?: string
  config: any
  analytics: { views: number; clicks: number }
  createdAt: string
  updatedAt?: string
}

// In-memory global map
const globalCardsMap = new Map<string, StoredCard>()

// Path for server-side JSON persistence file
const DATA_DIR = path.join(process.cwd(), '.data')
const CARDS_FILE = path.join(DATA_DIR, 'cards.json')

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  } catch (err) {
    console.warn('Could not create data dir:', err)
  }
}

function loadCardsFromFile() {
  try {
    ensureDataDir()
    globalCardsMap.clear()
    if (fs.existsSync(CARDS_FILE)) {
      const data = fs.readFileSync(CARDS_FILE, 'utf-8')
      if (data && data.trim()) {
        try {
          const json = JSON.parse(data)
          Object.entries(json).forEach(([key, card]: [string, any]) => {
            globalCardsMap.set(key, card)
          })
        } catch (jsonErr) {
          console.error('cards.json contains invalid JSON:', jsonErr)
        }
      }
    }
  } catch (err) {
    console.warn('Error reading cards file:', err)
  }
}

function saveCardsToFile() {
  try {
    ensureDataDir()
    const obj: Record<string, StoredCard> = {}
    globalCardsMap.forEach((val, key) => {
      obj[key] = val
    })
    fs.writeFileSync(CARDS_FILE, JSON.stringify(obj, null, 2), 'utf-8')
  } catch (err) {
    console.warn('Error saving cards file:', err)
  }
}

// Initialize on module load
loadCardsFromFile()

function resolveHandle(cardData: StoredCard): string {
  return (
    cardData.handle ||
    cardData.config?.profile?.handle ||
    (cardData.config?.profile?.title
      ? cardData.config.profile.title.toLowerCase().replace(/[^a-z0-9]/g, '')
      : '') ||
    cardData.id ||
    ''
  ).toLowerCase()
}

export function storeCardGlobal(cardData: StoredCard, previousHandle?: string): StoredCard {
  const handle = resolveHandle(cardData)
  const canonicalId = handle || cardData.id?.toLowerCase() || ''

  const record: StoredCard = {
    ...cardData,
    id: canonicalId,
    handle: canonicalId,
    analytics: cardData.analytics || { views: 0, clicks: 0 },
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Remove stale alias keys when username changes
  if (previousHandle && previousHandle.toLowerCase() !== canonicalId) {
    deleteCardGlobal(previousHandle)
  }
  if (cardData.id && cardData.id.toLowerCase() !== canonicalId) {
    const staleId = cardData.id.toLowerCase()
    if (globalCardsMap.has(staleId)) {
      globalCardsMap.delete(staleId)
    }
  }

  if (canonicalId) {
    globalCardsMap.set(canonicalId, record)
  }

  saveCardsToFile()
  return record
}

export function getCardGlobal(identifier: string): StoredCard | null {
  if (!identifier) return null
  const key = identifier.toLowerCase()

  // 1. Direct match in memory map
  if (globalCardsMap.has(key)) {
    return globalCardsMap.get(key)!
  }

  // 2. Search by handle or title slug match
  const cardsList = Array.from(globalCardsMap.values())
  for (const card of cardsList) {
    if (card.id?.toLowerCase() === key) return card
    if (card.handle?.toLowerCase() === key) return card
    const titleSlug = card.config?.profile?.title?.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (titleSlug && titleSlug === key) return card
  }

  // Reload file in case another request saved it
  loadCardsFromFile()
  if (globalCardsMap.has(key)) {
    return globalCardsMap.get(key)!
  }

  return null
}

export function getAllCardsGlobal(): StoredCard[] {
  loadCardsFromFile()
  const uniqueMap = new Map<string, StoredCard>()
  const list = Array.from(globalCardsMap.values())
  list.forEach((card) => {
    if (!card) return
    const key = resolveHandle(card) || card.id?.toLowerCase()
    if (key) uniqueMap.set(key, card)
  })
  return Array.from(uniqueMap.values())
}

// Delete every key in globalCardsMap that belongs to a card with the given id or handle.
export function deleteCardGlobal(identifier: string): void {
  const key = identifier.toLowerCase()
  const target = getCardGlobal(key)
  if (!target) return

  const targetId     = target.id?.toLowerCase()
  const targetHandle = target.handle?.toLowerCase()

  const keysToDelete: string[] = []
  globalCardsMap.forEach((val, k) => {
    const valId     = val.id?.toLowerCase()
    const valHandle = val.handle?.toLowerCase()
    if (
      k === key ||
      (targetId     && (k === targetId     || valId     === targetId)) ||
      (targetHandle && (k === targetHandle || valHandle === targetHandle))
    ) {
      keysToDelete.push(k)
    }
  })
  keysToDelete.forEach(k => globalCardsMap.delete(k))
  saveCardsToFile()
}

// Returns true when the handle slug is already used by a different card (i.e. not available).
// Pass `excludeHandle` to skip the card that currently owns the handle (for rename checks).
export function isHandleTaken(handle: string, excludeHandle?: string): boolean {
  if (!handle) return false
  const slug = handle.toLowerCase().replace(/[^a-z0-9-]/g, '')
  loadCardsFromFile()
  const cards = Array.from(globalCardsMap.values())
  return cards.some(card => {
    const cardKey = resolveHandle(card)
    if (excludeHandle && cardKey === excludeHandle.toLowerCase()) return false
    if (excludeHandle && card.id?.toLowerCase() === excludeHandle.toLowerCase()) return false
    return cardKey === slug
  })
}
