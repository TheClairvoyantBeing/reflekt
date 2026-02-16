import supabase from './supabase'

/**
 * Create a new diary entry for the authenticated user.
 * @param {string} userId - The authenticated user's UUID
 * @param {string} title - Entry title
 * @param {string} content - Entry body text
 * @returns {{ data: object|null, error: object|null }}
 */
export async function createEntry(userId, title, content) {
  const { data, error } = await supabase
    .from('entries')
    .insert([{ user_id: userId, title, content }])
    .select()
    .single()

  return { data, error }
}

/**
 * Fetch all diary entries for the authenticated user, newest first.
 * @param {string} userId - The authenticated user's UUID
 * @returns {{ data: Array|null, error: object|null }}
 */
export async function getEntries(userId) {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data: data || [], error }
}

/**
 * Delete a diary entry by its ID.
 * @param {string} entryId - The entry's UUID
 * @returns {{ error: object|null }}
 */
export async function deleteEntry(entryId) {
  const { error } = await supabase.from('entries').delete().eq('id', entryId)
  return { error }
}

/**
 * Update an existing diary entry.
 * @param {string} entryId - The entry's UUID
 * @param {object} updates - Fields to update ({ title, content })
 * @returns {{ data: object|null, error: object|null }}
 */
export async function updateEntry(entryId, updates) {
  const { data, error } = await supabase
    .from('entries')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', entryId)
    .select()
    .single()

  return { data, error }
}
