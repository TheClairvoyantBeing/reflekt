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
  limit,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

const ENTRIES_COLLECTION = 'entries'

/**
 * Create a new diary entry for the user.
 * 
 * @param {string} userId 
 * @param {string} title 
 * @param {string} content 
 * @param {string} [mood='Calm'] 
 * @param {string[]} [tags=[]] 
 * @param {string[]} [images=[]] - Array of base64 image strings
 */
export async function createEntry(userId, title, content, mood = 'Calm', tags = [], images = []) {
  try {
    const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), {
      user_id: userId,
      title: title.trim(),
      content: content.trim(),
      mood,
      tags: Array.isArray(tags) ? tags : [],
      images: Array.isArray(images) ? images : [], // Store images directly in document (Firestore limit 1MB)
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    return { data: { id: docRef.id, title, content, mood, tags, images }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Fetch entries for the user with optional pagination limit.
 */
export async function getEntries(userId, pageSize = 50) {
  try {
    const q = query(
      collection(db, ENTRIES_COLLECTION),
      where('user_id', '==', userId),
      limit(pageSize)
    )
    const snapshot = await getDocs(q)
    const entries = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      mood: d.data().mood || 'Calm',
      tags: d.data().tags || [],
      images: d.data().images || [],
      created_at: d.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      updated_at: d.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
    }))
    entries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return { data: entries, error: null }
  } catch (error) {
    return { data: [], error }
  }
}

/**
 * Filters an array of entries by text query across title, content, and tags.
 */
export function filterEntries(entries, searchQuery) {
  if (!searchQuery || !searchQuery.trim()) return entries
  const term = searchQuery.toLowerCase().trim()
  return entries.filter(
    (e) =>
      e.title?.toLowerCase().includes(term) ||
      e.content?.toLowerCase().includes(term) ||
      e.tags?.some((t) => t.toLowerCase().includes(term))
  )
}

export async function deleteEntry(entryId) {
  try {
    await deleteDoc(doc(db, ENTRIES_COLLECTION, entryId))
    return { error: null }
  } catch (error) {
    return { error }
  }
}

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
