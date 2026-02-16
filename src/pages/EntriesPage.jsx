import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getEntries, deleteEntry } from '../lib/entries'
import EntryCard from '../components/EntryCard'
import RightPanel from '../components/RightPanel'
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
    if (!window.confirm('Are you sure? This cannot be undone.')) return
    try {
      const { error } = await deleteEntry(entryId)
      if (error) throw error
      setEntries((prev) => prev.filter((e) => e.id !== entryId))
      toast.success('Entry deleted.')
    } catch (error) {
      toast.error('Failed to delete entry.')
    }
  }

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries
    const q = searchQuery.toLowerCase()
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        (e.mood || '').toLowerCase().includes(q)
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
    <div className="page-with-panel">
      <div className="page-main">
        <header className="page-header fade-in">
          <div className="header-left">
            <h1 className="page-title">My Entries</h1>
            <span className="entry-count-badge">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
          </div>
          <Link to="/new-entry" className="btn-primary btn-with-icon">
            <span className="material-icons" style={{ fontSize: 16 }}>edit</span>
            Write New
          </Link>
        </header>

        <div className="page-content">
          {/* Search */}
          {entries.length > 0 && (
            <div className="search-bar fade-in-up">
              <span className="material-icons search-icon" style={{ fontSize: 18 }}>search</span>
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {entries.length === 0 ? (
            <div className="entries-empty fade-in-up">
              <span className="material-icons empty-icon">menu_book</span>
              <h3>No entries yet</h3>
              <p>Start capturing your thoughts by writing your first entry.</p>
              <Link to="/new-entry" className="btn-primary">Write Your First Entry</Link>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="entries-empty fade-in-up">
              <span className="material-icons empty-icon">search_off</span>
              <h3>No matches</h3>
              <p>No entries match "{searchQuery}".</p>
            </div>
          ) : (
            <div className="timeline">
              <div className="timeline-track" />
              {filteredEntries.map((entry, i) => (
                <div key={entry.id} className="timeline-item fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={`timeline-dot ${i === 0 ? 'active' : ''}`} />
                  <EntryCard entry={entry} onDelete={handleDelete} isFirst={i === 0} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <RightPanel entryCount={entries.length} />
    </div>
  )
}
