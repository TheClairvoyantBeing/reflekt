import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { signOut } from 'firebase/auth'
import { useTheme } from '../context/ThemeContext'
import '../styles/layout.css'

export default function Layout({ children, user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="layout">
      <nav className="navbar">
        <Link to="/dashboard" className="nav-brand">
          <span className="brand-icon">◆</span>
          Reflekt
        </Link>

        {/* Hamburger button (mobile only) */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation links */}
        <div className={`nav-menu ${menuOpen ? 'show' : ''}`}>
          <div className="nav-links">
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Dashboard
            </Link>
            <Link
              to="/new-entry"
              className={`nav-link ${isActive('/new-entry') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              New Entry
            </Link>
            <Link
              to="/entries"
              className={`nav-link ${isActive('/entries') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              My Entries
            </Link>
            <Link
              to="/profile"
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Profile
            </Link>
          </div>

          <div className="nav-user">
            <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link to="/profile" className="user-email" onClick={closeMenu}>
              {user?.email}
            </Link>
            <button onClick={() => { handleLogout(); closeMenu() }} className="btn-logout">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">{children}</main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Reflekt. Your thoughts, beautifully preserved.</p>
      </footer>
    </div>
  )
}
