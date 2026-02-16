import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

const FONTS = {
  inter: { name: 'Inter', family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  sora: { name: 'Sora', family: '"Sora", -apple-system, sans-serif' },
  'space-grotesk': { name: 'Space Grotesk', family: '"Space Grotesk", -apple-system, sans-serif' },
  outfit: { name: 'Outfit', family: '"Outfit", -apple-system, sans-serif' },
  lexend: { name: 'Lexend', family: '"Lexend", -apple-system, sans-serif' },
  'dm-sans': { name: 'DM Sans', family: '"DM Sans", -apple-system, sans-serif' },
  'plus-jakarta': { name: 'Plus Jakarta Sans', family: '"Plus Jakarta Sans", -apple-system, sans-serif' },
  nunito: { name: 'Nunito', family: '"Nunito", -apple-system, sans-serif' },
}

const DEFAULTS = {
  theme: 'dark',
  aesthetic: 'minimalist',
  font: 'inter',
}

/**
 * Provides theme, aesthetic, and font state to the app.
 * All preferences persist in localStorage.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('reflekt-theme') || DEFAULTS.theme
  )
  const [aesthetic, setAesthetic] = useState(() =>
    localStorage.getItem('reflekt-aesthetic') || DEFAULTS.aesthetic
  )
  const [font, setFont] = useState(() =>
    localStorage.getItem('reflekt-font') || DEFAULTS.font
  )

  // Apply all preferences to <html> element
  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-theme', theme)
    html.setAttribute('data-aesthetic', aesthetic)
    html.style.setProperty('--font-family', FONTS[font]?.family || FONTS.inter.family)

    localStorage.setItem('reflekt-theme', theme)
    localStorage.setItem('reflekt-aesthetic', aesthetic)
    localStorage.setItem('reflekt-font', font)
  }, [theme, aesthetic, font])

  const toggleTheme = () => setTheme((p) => (p === 'dark' ? 'light' : 'dark'))
  const setThemeMode = (mode) => setTheme(mode)

  return (
    <ThemeContext.Provider
      value={{
        theme,
        aesthetic,
        font,
        toggleTheme,
        setThemeMode,
        setAesthetic,
        setFont,
        fonts: FONTS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to access theme, aesthetic, font, and their setters.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
