import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/dashboard.css'

export default function DashboardPage({ user }) {
  const greeting = getGreeting()
  const firstName = user?.email?.split('@')[0] || 'there'

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-greeting">
          {greeting}, <span className="highlight">{firstName}</span>
        </h1>
        <p className="dashboard-subtitle">What would you like to do today?</p>
      </header>

      <div className="dashboard-cards">
        <Link to="/new-entry" className="dashboard-card card-create">
          <div className="card-icon">✍️</div>
          <h3>New Entry</h3>
          <p>Capture your thoughts, ideas, or reflections in a new journal entry.</p>
          <span className="card-arrow">→</span>
        </Link>

        <Link to="/entries" className="dashboard-card card-browse">
          <div className="card-icon">📖</div>
          <h3>My Entries</h3>
          <p>Browse through your past journal entries and revisit your memories.</p>
          <span className="card-arrow">→</span>
        </Link>
      </div>

      <section className="dashboard-quote">
        <blockquote>
          "Journal writing is a voyage to the interior."
          <cite>— Christina Baldwin</cite>
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
