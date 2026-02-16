import React from 'react'

/**
 * Reusable card component for displaying a single diary entry.
 */
export default function EntryCard({ entry, onDelete }) {
  const formattedDate = new Date(entry.created_at).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formattedTime = new Date(entry.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <article className="entry-card">
      <div className="entry-card-header">
        <h3 className="entry-card-title">{entry.title || 'Untitled Entry'}</h3>
        <time className="entry-card-date" dateTime={entry.created_at}>
          {formattedDate} at {formattedTime}
        </time>
      </div>

      <p className="entry-card-content">{entry.content}</p>

      {onDelete && (
        <div className="entry-card-actions">
          <button
            onClick={() => onDelete(entry.id)}
            className="btn-delete"
            aria-label={`Delete entry: ${entry.title}`}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  )
}
