import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import supabase from '../lib/supabase'
import '../styles/layout.css'

/**
 * App shell layout with responsive navigation bar.
 * Wraps all authenticated pages.
 */
export default function Layout({ children, user }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="layout">
      <nav className="navbar">
        <Link to="/dashboard" className="nav-brand">
          <span className="brand-icon">◆</span>
          Reflekt
        </Link>

        <div className="nav-links">
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/new-entry"
            className={`nav-link ${isActive('/new-entry') ? 'active' : ''}`}
          >
            New Entry
          </Link>
          <Link
            to="/entries"
            className={`nav-link ${isActive('/entries') ? 'active' : ''}`}
          >
            My Entries
          </Link>
        </div>

        <div className="nav-user">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">
            Sign Out
          </button>
        </div>
      </nav>

      <main className="main-content">{children}</main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Reflekt. Your thoughts, beautifully preserved.</p>
      </footer>
    </div>
  )
}
