import React from 'react'

const MOOD_MAP = {
  Calm: { icon: 'nights_stay', color: '#60a5fa' },
  Happy: { icon: 'sentiment_satisfied_alt', color: '#34d399' },
  Productive: { icon: 'bolt', color: '#fbbf24' },
  Motivated: { icon: 'local_fire_department', color: '#f87171' },
  Reflective: { icon: 'self_improvement', color: '#a78bfa' },
  Sad: { icon: 'cloud', color: '#94a3b8' },
}

function getRelativeDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function EntryCard({ entry, onDelete, isFirst }) {
  const mood = MOOD_MAP[entry.mood] || MOOD_MAP.Calm
  const relativeDate = getRelativeDate(entry.created_at)
  const time = new Date(entry.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  // Robustly handle images array (ensure it exists)
  const images = Array.isArray(entry.images) ? entry.images : []
  const hasImages = images.length > 0
  const coverImage = hasImages ? images[0] : null

  return (
    <article className={`entry-card-rich ${isFirst ? 'first' : ''}`}>
      {/* Header */}
      <div className="ec-header">
        <div className="ec-header-left">
          <span className={`ec-date-badge ${isFirst ? 'primary' : ''}`}>
            {relativeDate}
          </span>
          <span className="ec-time">{time}</span>
        </div>
        <div className="ec-mood">
          <span className="material-icons ec-mood-icon" style={{ color: mood.color }}>{mood.icon}</span>
          <span className="ec-mood-label">Feeling {entry.mood}</span>
        </div>
      </div>

      {/* Image Thumbnail (if present) */}
      {coverImage && (
        <div className="ec-image-container">
          <img src={coverImage} alt="Entry attachment" className="ec-image" />
          {images.length > 1 && (
            <span className="ec-image-count">+{images.length - 1}</span>
          )}
        </div>
      )}

      {/* Title & Content */}
      <h2 className="ec-title">{entry.title || 'Untitled Entry'}</h2>
      <p className="ec-content">{entry.content}</p>

      {/* Footer */}
      <div className="ec-footer">
        <div className="ec-tags">
          {(entry.tags || []).map((tag) => (
            <span key={tag} className="ec-tag">#{tag}</span>
          ))}
        </div>
        <div className="ec-actions">
          {onDelete && (
            <button
              onClick={() => onDelete(entry.id)}
              className="ec-delete"
              aria-label={`Delete entry: ${entry.title}`}
            >
              <span className="material-icons" style={{ fontSize: 16 }}>delete_outline</span>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
