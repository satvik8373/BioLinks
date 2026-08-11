import { getDb } from './firebase'
import { deleteDoc, doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore'

const USERNAMES_COLLECTION = 'usernames'

export class UsernameTakenError extends Error {
  constructor() {
    super('Username is already taken')
    this.name = 'UsernameTakenError'
  }
}

export async function getUsernameOwner(handle: string): Promise<string | null> {
  const db = getDb()
  const snapshot = await getDoc(doc(db, USERNAMES_COLLECTION, handle))
  return snapshot.exists() ? snapshot.data().ownerId || null : null
}

/** Atomically claim a username and release the caller's previous username. */
export async function claimUsername(handle: string, ownerId: string, previousHandle?: string) {
  const db = getDb()
  const nextRef = doc(db, USERNAMES_COLLECTION, handle)
  const previousRef = previousHandle && previousHandle !== handle
    ? doc(db, USERNAMES_COLLECTION, previousHandle)
    : null

  await runTransaction(db, async transaction => {
    const existing = await transaction.get(nextRef)
    const previous = previousRef ? await transaction.get(previousRef) : null
    if (existing.exists() && existing.data().ownerId !== ownerId) {
      throw new UsernameTakenError()
    }

    transaction.set(nextRef, {
      ownerId,
      username: handle,
      updatedAt: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
    }, { merge: true })

    if (previousRef && previous?.exists() && previous.data().ownerId === ownerId) {
      transaction.delete(previousRef)
    }
  })
}

export async function releaseUsername(handle: string, ownerId: string) {
  const db = getDb()
  const ref = doc(db, USERNAMES_COLLECTION, handle)
  const snapshot = await getDoc(ref)
  if (snapshot.exists() && snapshot.data().ownerId === ownerId) {
    await deleteDoc(ref)
  }
}
