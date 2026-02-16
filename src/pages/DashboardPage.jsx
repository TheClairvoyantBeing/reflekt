import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEntries } from '../lib/entries'
import '../styles/dashboard.css'

const QUOTES = [
  { text: 'Journal writing is a voyage to the interior.', author: 'Christina Baldwin' },
  { text: 'Fill your paper with the breathings of your heart.', author: 'William Wordsworth' },
  { text: 'Writing is the painting of the voice.', author: 'Voltaire' },
  { text: 'The journal is a vehicle for my sense of selfhood.', author: 'Susan Sontag' },
  { text: 'Start writing, no matter what. The water does not flow until the faucet is turned on.', author: 'Louis L\'Amour' },
  { text: 'One day I will find the right words, and they will be simple.', author: 'Jack Kerouac' },
]

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
    <div className="dashboard-page fade-in">
      <header className="dashboard-header">
        <h1 className="dashboard-greeting">
          {greeting}, <span className="highlight">{firstName}</span>
        </h1>
        <p className="dashboard-subtitle">What would you like to do today?</p>
      </header>

      {/* Stats Row */}
      {entryCount !== null && (
        <div className="dashboard-stats fade-in-up">
          <div className="stat-card">
            <span className="stat-number">{entryCount}</span>
            <span className="stat-label">{entryCount === 1 ? 'Entry' : 'Entries'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{getStreak()}</span>
            <span className="stat-label">Day Streak</span>
          </div>
        </div>
      )}

      <div className="dashboard-cards">
        <Link to="/new-entry" className="dashboard-card card-create fade-in-up stagger-1">
          <div className="card-icon">✍️</div>
          <h3>New Entry</h3>
          <p>Capture your thoughts, ideas, or reflections in a new journal entry.</p>
          <span className="card-arrow">→</span>
        </Link>

        <Link to="/entries" className="dashboard-card card-browse fade-in-up stagger-2">
          <div className="card-icon">📖</div>
          <h3>My Entries</h3>
          <p>Browse through your past journal entries and revisit your memories.</p>
          <span className="card-arrow">→</span>
        </Link>
      </div>

      <section className="dashboard-quote fade-in-up stagger-3">
        <blockquote>
          "{quote.text}"
          <cite>— {quote.author}</cite>
        </blockquote>
      </section>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getStreak() {
  // Simple streak placeholder — could be expanded with real date tracking
  const today = new Date()
  return today.getDay() || 1 // Placeholder
}
