import { db } from './firebase'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'

const ENTRIES_COLLECTION = 'entries'

/**
 * Create a new diary entry for the authenticated user.
 * @param {string} userId - The authenticated user's UID
 * @param {string} title - Entry title
 * @param {string} content - Entry body text
 * @returns {{ data: object|null, error: object|null }}
 */
export async function createEntry(userId, title, content) {
  try {
    const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), {
      user_id: userId,
      title,
      content,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    return { data: { id: docRef.id, title, content }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Fetch all diary entries for the authenticated user, newest first.
 * @param {string} userId - The authenticated user's UID
 * @returns {{ data: Array, error: object|null }}
 */
export async function getEntries(userId) {
  try {
    const q = query(
      collection(db, ENTRIES_COLLECTION),
      where('user_id', '==', userId)
    )
    const snapshot = await getDocs(q)
    const entries = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      // Convert Firestore Timestamp to ISO string for consistent rendering
      created_at: d.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      updated_at: d.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
    }))
    // Sort newest first (client-side — no composite index required)
    entries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return { data: entries, error: null }
  } catch (error) {
    return { data: [], error }
  }
}

/**
 * Delete a diary entry by its ID.
 * @param {string} entryId - The Firestore document ID
 * @returns {{ error: object|null }}
 */
export async function deleteEntry(entryId) {
  try {
    await deleteDoc(doc(db, ENTRIES_COLLECTION, entryId))
    return { error: null }
  } catch (error) {
    return { error }
  }
}

/**
 * Update an existing diary entry.
 * @param {string} entryId - The Firestore document ID
 * @param {object} updates - Fields to update ({ title, content })
 * @returns {{ data: object|null, error: object|null }}
 */
export async function updateEntry(entryId, updates) {
  try {
    const docRef = doc(db, ENTRIES_COLLECTION, entryId)
    await updateDoc(docRef, {
      ...updates,
      updated_at: serverTimestamp(),
    })
    return { data: { id: entryId, ...updates }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
