import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getEntries } from '../lib/entries'

const PAGE_TITLES = {
  '/dashboard': 'Home',
  '/entries': 'My Entries',
  '/new-entry': 'New Entry',
  '/calendar': 'Calendar',
  '/profile': 'Profile',
  '/settings': 'Settings',
}

/**
 * Floating navbar at the top of main content area.
 * Shows page title and global search.
 */
export default function FloatingNav({ user }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const searchRef = useRef(null)
  const debounceRef = useRef(null)

  const pageTitle = PAGE_TITLES[location.pathname] || 'Reflekt'

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false)
    setSearchQuery('')
    setResults([])
  }, [location.pathname])

  // Click outside to close
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || !user) {
      setResults([])
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const { data } = await getEntries(user.uid)
        const q = searchQuery.toLowerCase()
        const filtered = data.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.content.toLowerCase().includes(q) ||
            (e.mood || '').toLowerCase().includes(q)
        ).slice(0, 8)
        setResults(filtered)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [searchQuery, user])

  const handleResultClick = () => {
    navigate('/entries', { state: { searchQuery } })
    setSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <div className="floating-nav">
      <h2 className="fnav-title">{pageTitle}</h2>

      <div className="fnav-right" ref={searchRef}>
        <div className={`fnav-search ${searchOpen ? 'open' : ''}`}>
          {searchOpen ? (
            <>
              <span className="material-icons fnav-search-icon">search</span>
              <input
                type="text"
                className="fnav-search-input"
                placeholder="Search all entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button className="fnav-search-close" onClick={() => { setSearchOpen(false); setSearchQuery('') }}>
                <span className="material-icons">close</span>
              </button>

              {/* Results dropdown */}
              {searchQuery.trim() && (
                <div className="fnav-results">
                  {searching ? (
                    <div className="fnav-result-item muted">Searching...</div>
                  ) : results.length === 0 ? (
                    <div className="fnav-result-item muted">No results found</div>
                  ) : (
                    results.map((entry) => (
                      <button key={entry.id} className="fnav-result-item" onClick={handleResultClick}>
                        <span className="fnav-result-title">{entry.title || 'Untitled'}</span>
                        <span className="fnav-result-preview">
                          {entry.content.substring(0, 80)}...
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </>
          ) : (
            <button className="fnav-search-btn" onClick={() => setSearchOpen(true)} title="Search entries">
              <span className="material-icons">search</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
