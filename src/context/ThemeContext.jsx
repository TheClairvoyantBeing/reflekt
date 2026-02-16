import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

/**
 * Provides theme state and toggle function to the app.
 * Persists preference in localStorage.
 * Applies `data-theme` attribute on <html> for CSS to react to.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('reflekt-theme')
    return saved || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('reflekt-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to access theme state and toggle.
 * @returns {{ theme: 'dark' | 'light', toggleTheme: () => void }}
 */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
