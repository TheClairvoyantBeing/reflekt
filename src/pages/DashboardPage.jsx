import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEntries } from '../lib/entries'
import RightPanel from '../components/RightPanel'
import '../styles/dashboard.css'

const QUOTES = [
  { text: 'Journal writing is a voyage to the interior.', author: 'Christina Baldwin' },
  { text: 'Fill your paper with the breathings of your heart.', author: 'William Wordsworth' },
  { text: 'Writing is the painting of the voice.', author: 'Voltaire' },
  { text: 'The journal is a vehicle for my sense of selfhood.', author: 'Susan Sontag' },
  { text: 'Start writing, no matter what. The water does not flow until the faucet is turned on.', author: "Louis L'Amour" },
  { text: 'One day I will find the right words, and they will be simple.', author: 'Jack Kerouac' },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getDateString() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export default function DashboardPage({ user }) {
  const greeting = getGreeting()
  const firstName = user?.email?.split('@')[0] || 'there'
  const [entryCount, setEntryCount] = useState(null)
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)])

  useEffect(() => {
    async function fetchCount() {
      const { data } = await getEntries(user.uid)
      setEntryCount(data.length)
    }
    fetchCount()
  }, [user.uid])

  return (
    <div className="page-with-panel">
      <div className="page-main">
        {/* Header */}
        <header className="page-header fade-in">
          <div className="header-left">
            <h1 className="greeting-title">{greeting}, <span className="highlight">{firstName}</span></h1>
            <p className="greeting-date">{getDateString()}</p>
          </div>
          <Link to="/new-entry" className="btn-primary btn-with-icon">
            <span className="material-icons" style={{ fontSize: 16 }}>edit</span>
            Write New Entry
          </Link>
        </header>

        {/* Content */}
        <div className="page-content">
          {/* Stats */}
          <div className="stats-row fade-in-up stagger-1">
            <div className="stat-card-new">
              <div className="stat-icon-box stat-icon-primary">
                <span className="material-icons">bar_chart</span>
              </div>
              <div className="stat-info">
                <span className="stat-number">{entryCount ?? '–'}</span>
                <span className="stat-label">Total Entries</span>
              </div>
            </div>
            <div className="stat-card-new">
              <div className="stat-icon-box stat-icon-orange">
                <span className="material-icons">local_fire_department</span>
              </div>
              <div className="stat-info">
                <span className="stat-number">{new Date().getDay() || 1}</span>
                <span className="stat-label">Day Streak</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="actions-grid fade-in-up stagger-2">
            <Link to="/new-entry" className="action-card">
              <span className="material-icons action-icon">edit_note</span>
              <h3>New Entry</h3>
              <p>Capture your thoughts in a new journal entry.</p>
              <span className="action-arrow material-icons">arrow_forward</span>
            </Link>
            <Link to="/entries" className="action-card">
              <span className="material-icons action-icon">auto_stories</span>
              <h3>My Entries</h3>
              <p>Browse through your past entries and memories.</p>
              <span className="action-arrow material-icons">arrow_forward</span>
            </Link>
          </div>

          {/* Quote */}
          <div className="quote-card fade-in-up stagger-3">
            <span className="material-icons quote-icon">format_quote</span>
            <blockquote>"{quote.text}"</blockquote>
            <cite>— {quote.author}</cite>
          </div>
        </div>
      </div>

      <RightPanel entryCount={entryCount} />
    </div>
  )
}
