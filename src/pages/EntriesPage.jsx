import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEntries, deleteEntry } from '../lib/entries'
import EntryCard from '../components/EntryCard'
import toast from 'react-hot-toast'
import '../styles/entries.css'

export default function EntriesPage({ user }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const { data, error } = await getEntries(user.id)
      if (error) throw error
      setEntries(data)
    } catch (error) {
      toast.error('Failed to load entries.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (entryId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this entry? This cannot be undone.'
    )
    if (!confirmed) return

    try {
      const { error } = await deleteEntry(entryId)
      if (error) throw error
      setEntries((prev) => prev.filter((e) => e.id !== entryId))
      toast.success('Entry deleted.')
    } catch (error) {
      toast.error('Failed to delete entry.')
    }
  }

  if (loading) {
    return (
      <div className="entries-page">
        <div className="loading-screen">
          <div className="loading-spinner" />
          <p>Loading your entries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="entries-page">
      <header className="entries-header">
        <div>
          <h1>My Entries</h1>
          <p className="entries-count">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <Link to="/new-entry" className="btn-primary">
          + New Entry
        </Link>
      </header>

      {entries.length > 0 ? (
        <div className="entries-grid">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="entries-empty">
          <div className="empty-icon">📝</div>
          <h3>No entries yet</h3>
          <p>Start capturing your thoughts by creating your first journal entry.</p>
          <Link to="/new-entry" className="btn-primary">
            Write Your First Entry
          </Link>
        </div>
      )}
    </div>
  )
}
