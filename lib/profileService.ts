/**
 * profileService.ts
 * -----------------
 * Firestore CRUD for draft / published profile documents.
 *
 * Collections:
 *   profiles/{userId}/draft      – current editing session
 *   profiles/{userId}/published  – live public card
 *
 * Each document follows the ProfileDocument shape.
 * Versioning: every save increments `version` for conflict detection.
 */

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { getDb } from './firebase'
import type { Theme } from './themes'

// ── Types ────────────────────────────────────────────────────────────────────

export interface ProfileProfile {
  avatar: string
  title: string
  handle?: string
  bio: string
  location?: string
  website?: string
  profession?: string
}

export interface ProfileLink {
  id: string
  type: string
  text: string
  url: string
  icon: string
  isVisible: boolean
  platform?: string
  description?: string
  [key: string]: any
}

export interface ProfileDocument {
  version: number
  theme: Theme
  profile: ProfileProfile
  links: ProfileLink[]
  socialLinks: Record<string, string>
  socialIconPosition?: 'top' | 'bottom'
  settings: Record<string, any>
  updatedAt: any // Firestore Timestamp or ISO string
  createdAt: any
  lastEditor?: string // userId of last editor
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function profilesRef(userId: string, docType: 'draft' | 'published') {
  const db = getDb()
  return doc(db, 'profiles', userId, docType, 'data')
}

function normalizeTimestamp(val: any): string {
  if (!val) return new Date().toISOString()
  if (val instanceof Timestamp) return val.toDate().toISOString()
  if (typeof val === 'string') return val
  return new Date().toISOString()
}

function stripUndefined(obj: any): any {
  return structuredClone(obj)
}

// ── Read ─────────────────────────────────────────────────────────────────────

/**
 * Load the draft profile from Firestore.
 * Returns null if no draft exists yet.
 */
export async function getDraft(userId: string): Promise<ProfileDocument | null> {
  try {
    const snap = await getDoc(profilesRef(userId, 'draft'))
    if (!snap.exists()) return null

    const data = snap.data()
    return {
      ...data,
      version: data.version ?? 1,
      updatedAt: normalizeTimestamp(data.updatedAt),
      createdAt: normalizeTimestamp(data.createdAt),
    } as ProfileDocument
  } catch (err) {
    console.error('[profileService] getDraft error:', err)
    return null
  }
}

/**
 * Load the published profile from Firestore.
 */
export async function getPublished(userId: string): Promise<ProfileDocument | null> {
  try {
    const snap = await getDoc(profilesRef(userId, 'published'))
    if (!snap.exists()) return null

    const data = snap.data()
    return {
      ...data,
      version: data.version ?? 1,
      updatedAt: normalizeTimestamp(data.updatedAt),
      createdAt: normalizeTimestamp(data.createdAt),
    } as ProfileDocument
  } catch (err) {
    console.error('[profileService] getPublished error:', err)
    return null
  }
}

// ── Write ────────────────────────────────────────────────────────────────────

/**
 * Save the draft profile to Firestore.
 * Increments the version number on each save.
 */
export async function saveDraft(
  userId: string,
  data: Omit<ProfileDocument, 'updatedAt' | 'createdAt'>,
): Promise<{ success: boolean; version: number }> {
  try {
    const nextVersion = (data.version ?? 0) + 1
    const payload = stripUndefined({
      ...data,
      version: nextVersion,
      lastEditor: userId,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(), // merge: true preserves existing createdAt
    })

    await setDoc(profilesRef(userId, 'draft'), payload, { merge: true })
    return { success: true, version: nextVersion }
  } catch (err) {
    console.error('[profileService] saveDraft error:', err)
    return { success: false, version: data.version ?? 0 }
  }
}

/**
 * Publish: copy the current draft to the published profile.
 * Increments version on the published copy.
 */
export async function publishProfile(
  userId: string,
  draft: ProfileDocument,
): Promise<{ success: boolean; version: number }> {
  try {
    const nextVersion = (draft.version ?? 0) + 1
    const payload = stripUndefined({
      ...draft,
      version: nextVersion,
      lastEditor: userId,
      updatedAt: serverTimestamp(),
      createdAt: draft.createdAt || serverTimestamp(),
    })

    // Write to published document
    await setDoc(profilesRef(userId, 'published'), payload, { merge: true })

    // Also update the draft version to stay in sync
    await setDoc(profilesRef(userId, 'draft'), { version: nextVersion, updatedAt: serverTimestamp() }, { merge: true })

    return { success: true, version: nextVersion }
  } catch (err) {
    console.error('[profileService] publishProfile error:', err)
    return { success: false, version: draft.version ?? 0 }
  }
}

// ── Migration ────────────────────────────────────────────────────────────────

/**
 * One-time migration: read localStorage legacy data and write it as a
 * Firestore draft if no draft exists yet.
 * Returns the migrated config or null if nothing to migrate.
 */
export async function migrateLegacyData(userId: string): Promise<ProfileDocument | null> {
  if (typeof window === 'undefined') return null

  try {
    // Check if draft already exists — don't overwrite
    const existing = await getDraft(userId)
    if (existing) return existing

    const configStr = localStorage.getItem('currentBioLinkConfig')
    if (!configStr) return null

    const config = JSON.parse(configStr)
    if (!config || !config.profile) return null

    const draft: Omit<ProfileDocument, 'updatedAt' | 'createdAt'> = {
      version: 0,
      theme: config.theme,
      profile: config.profile,
      links: config.links || [],
      socialLinks: config.socialLinks || {},
      socialIconPosition: config.socialIconPosition,
      settings: {},
      lastEditor: userId,
    }

    const result = await saveDraft(userId, draft)
    if (result.success) {
      console.log('[profileService] Legacy data migrated to Firestore draft, version:', result.version)
      // Don't delete localStorage keys yet — user might revert
    }

    return {
      ...draft,
      version: result.version,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
  } catch (err) {
    console.error('[profileService] migrateLegacyData error:', err)
    return null
  }
}
