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
    if (fs.existsSync(CARDS_FILE)) {
      const data = fs.readFileSync(CARDS_FILE, 'utf-8')
      const json = JSON.parse(data)
      Object.entries(json).forEach(([key, card]: [string, any]) => {
        globalCardsMap.set(key, card)
      })
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

export function storeCardGlobal(cardData: StoredCard): StoredCard {
  const { id, handle } = cardData
  const existingById = id ? globalCardsMap.get(id.toLowerCase()) : null
  const existingByHandle = handle ? globalCardsMap.get(handle.toLowerCase()) : null
  const existing = existingById || existingByHandle

  const record: StoredCard = {
    ...existing,
    ...cardData,
    analytics: cardData.analytics || existing?.analytics || { views: 0, clicks: 0 },
    createdAt: existing?.createdAt || cardData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Store under ID
  if (id) {
    globalCardsMap.set(id.toLowerCase(), record)
  }
  // Store under handle slug
  if (handle) {
    globalCardsMap.set(handle.toLowerCase(), record)
  }

  // Also save to disk
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
    if (card && card.id) {
      uniqueMap.set(card.id.toLowerCase(), card)
    }
  })
  return Array.from(uniqueMap.values())
}
