import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { signOut } from 'firebase/auth'
import { useTheme } from '../context/ThemeContext'
import '../styles/sidebar.css'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Home', icon: 'home' },
  { path: '/entries', label: 'My Entries', icon: 'auto_stories' },
  { path: '/new-entry', label: 'New Entry', icon: 'edit_note' },
  { path: '/calendar', label: 'Calendar', icon: 'calendar_month' },
  { path: '/profile', label: 'Profile', icon: 'person' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
]

const MIN_WIDTH = 200
const MAX_WIDTH = 400
const DEFAULT_WIDTH = 260
const COLLAPSED_WIDTH = 64

export default function Sidebar({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Collapsed state
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('reflekt-sidebar-collapsed') === 'true'
  })

  // Resizable width (only when not collapsed)
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem('reflekt-sidebar-width')
    return saved ? Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, parseInt(saved, 10))) : DEFAULT_WIDTH
  })
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef(null)

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem('reflekt-sidebar-collapsed', String(collapsed))
    const w = collapsed ? COLLAPSED_WIDTH : width
    document.documentElement.style.setProperty('--sidebar-width', `${w}px`)
  }, [collapsed, width])

  // Persist width
  useEffect(() => {
    if (!collapsed) {
      localStorage.setItem('reflekt-sidebar-width', String(width))
    }
  }, [width, collapsed])

  // Resize handlers
  const startResize = useCallback((e) => {
    if (collapsed) return
    e.preventDefault()
    setIsResizing(true)
  }, [collapsed])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e) => {
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX))
      setWidth(newWidth)
    }

    const handleMouseUp = () => setIsResizing(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path
  const closeMobile = () => setMobileOpen(false)
  const firstName = user?.email?.split('@')[0] || 'User'

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className={`sidebar-hamburger ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        <span className="material-icons">{mobileOpen ? 'close' : 'menu'}</span>
      </button>

      {/* Overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} />}

      <aside
        ref={sidebarRef}
        className={`sidebar ${mobileOpen ? 'show' : ''} ${collapsed ? 'collapsed' : ''}`}
        style={{ width: collapsed ? `${COLLAPSED_WIDTH}px` : `${width}px` }}
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <Link to="/dashboard" className="brand-link" onClick={closeMobile}>
            <span className="brand-icon-box">
              <span className="material-icons">auto_stories</span>
            </span>
            {!collapsed && <span className="brand-name">Reflekt</span>}
          </Link>
          <button
            className="collapse-toggle"
            onClick={() => setCollapsed((p) => !p)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="material-icons">
              {collapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={closeMobile}
              title={collapsed ? item.label : ''}
            >
              <span className="material-icons sidebar-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="sidebar-bottom">
          <button className="theme-toggle-sidebar" onClick={toggleTheme} title={collapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : ''}>
            <span className="material-icons">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          <div className="sidebar-user">
            <div className="user-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="user-info">
                <span className="user-name">{firstName}</span>
              </div>
            )}
            <button onClick={() => { handleLogout(); closeMobile() }} className="sidebar-logout" title="Sign Out">
              <span className="material-icons">logout</span>
            </button>
          </div>
        </div>

        {/* Resize Handle (only when expanded) */}
        {!collapsed && (
          <div
            className={`sidebar-resize-handle ${isResizing ? 'active' : ''}`}
            onMouseDown={startResize}
          />
        )}
      </aside>
    </>
  )
}
