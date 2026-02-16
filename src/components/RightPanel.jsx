import React from 'react'
import '../styles/right-panel.css'

const QUOTES = [
  { text: "Keep your face always toward the sunshine.", author: "Walt Whitman" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In three words I can sum up everything I learned about life: it goes on.", author: "Robert Frost" },
]

export default function RightPanel({ entryCount }) {
  const today = new Date()
  const dayOfWeek = today.getDay() || 1
  const quote = QUOTES[today.getDate() % QUOTES.length]

  return (
    <aside className="right-panel">
      {/* Stats */}
      <div className="rp-section">
        <h3 className="rp-title">Your Progress</h3>

        <div className="rp-stat-card">
          <div className="rp-stat-icon orange">
            <span className="material-icons">local_fire_department</span>
          </div>
          <div className="rp-stat-info">
            <span className="rp-stat-number">{dayOfWeek} Days</span>
            <span className="rp-stat-label">Current Streak</span>
          </div>
        </div>

        <div className="rp-stat-card">
          <div className="rp-stat-icon primary">
            <span className="material-icons">bar_chart</span>
          </div>
          <div className="rp-stat-info">
            <span className="rp-stat-number">{entryCount ?? '–'}</span>
            <span className="rp-stat-label">Total Entries</span>
          </div>
        </div>
      </div>

      {/* On This Day */}
      <div className="rp-section">
        <h3 className="rp-title">Daily Thought</h3>
        <div className="rp-memory-card">
          <span className="rp-memory-tag">Today's Quote</span>
          <p className="rp-memory-text">"{quote.text}"</p>
          <span className="rp-memory-author">— {quote.author}</span>
        </div>
      </div>
    </aside>
  )
}
