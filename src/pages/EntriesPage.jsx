import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getEntries, deleteEntry } from '../lib/entries'
import EntryCard from '../components/EntryCard'
import toast from 'react-hot-toast'
import '../styles/entries.css'

export default function EntriesPage({ user }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const { data, error } = await getEntries(user.uid)
      if (error) throw error
      setEntries(data)
    } catch (error) {
      console.error('Error fetching entries:', error)
      toast.error('Failed to load entries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [user.uid])

  const handleDelete = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
      return
    }

    try {
      const { error } = await deleteEntry(entryId)
      if (error) throw error
      setEntries((prev) => prev.filter((e) => e.id !== entryId))
      toast.success('Entry deleted.')
    } catch (error) {
      console.error('Error deleting entry:', error)
      toast.error('Failed to delete entry.')
    }
  }

  // Filter entries by search query
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries
    const q = searchQuery.toLowerCase()
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q)
    )
  }, [entries, searchQuery])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading your entries...</p>
      </div>
    )
  }

  return (
    <div className="entries-page fade-in">
      <header className="entries-header">
        <div className="entries-title-row">
          <h1>My Entries</h1>
          <span className="entry-count">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
        </div>

        {/* Search */}
        {entries.length > 0 && (
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search entries by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </header>

      {entries.length === 0 ? (
        <div className="entries-empty fade-in-up">
          <div className="empty-icon">📝</div>
          <h3>No entries yet</h3>
          <p>Start capturing your thoughts by writing your first entry.</p>
          <Link to="/new-entry" className="btn-primary">
            Write Your First Entry
          </Link>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="entries-empty fade-in-up">
          <div className="empty-icon">🔍</div>
          <h3>No matches</h3>
          <p>No entries match "{searchQuery}". Try a different search.</p>
        </div>
      ) : (
        <div className="entries-grid">
          {filteredEntries.map((entry, i) => (
            <div key={entry.id} className="fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <EntryCard entry={entry} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
