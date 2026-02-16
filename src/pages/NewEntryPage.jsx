import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEntry } from '../lib/entries'
import toast from 'react-hot-toast'
import '../styles/entry.css'

export default function NewEntryPage({ user }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('Please write something before saving.')
      return
    }

    setSaving(true)

    try {
      const { error } = await createEntry(
        user.id,
        title.trim() || 'Untitled Entry',
        content.trim()
      )

      if (error) throw error

      toast.success('Entry saved successfully!')
      navigate('/entries')
    } catch (error) {
      toast.error(error.message || 'Failed to save entry.')
    } finally {
      setSaving(false)
    }
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  return (
    <div className="new-entry-page">
      <header className="entry-header">
        <h1>New Entry</h1>
        <span className="word-count">{wordCount} words</span>
      </header>

      <form onSubmit={handleSubmit} className="entry-form">
        <div className="input-group">
          <label htmlFor="entry-title">Title (optional)</label>
          <input
            id="entry-title"
            type="text"
            placeholder="Give your entry a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
          />
        </div>

        <div className="input-group">
          <label htmlFor="entry-content">Your Thoughts</label>
          <textarea
            id="entry-content"
            placeholder="Start writing... What's on your mind today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
          />
        </div>

        <div className="entry-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving || !content.trim()}
          >
            {saving ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  )
}
