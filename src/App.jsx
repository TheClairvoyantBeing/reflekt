import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { auth } from './lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { ThemeProvider } from './context/ThemeContext'

import Sidebar from './components/Sidebar'
import FloatingNav from './components/FloatingNav'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import NewEntryPage from './pages/NewEntryPage'
import EntriesPage from './pages/EntriesPage'
import CalendarPage from './pages/CalendarPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'

/**
 * Inner layout: sidebar + floating nav + main content.
 * Editor and login are full-screen (no sidebar/nav).
 */
function AppLayout({ user, loading }) {
  const location = useLocation()
  const isEditor = location.pathname === '/new-entry'
  const isLogin = location.pathname === '/login'
  const showChrome = !isEditor && !isLogin && user

  return (
    <div className="app-shell" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {showChrome && <Sidebar user={user} />}

      <div className="app-main" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              backdropFilter: 'blur(12px)',
            },
          }}
        />

        {showChrome && <FloatingNav user={user} />}

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute user={user} loading={loading}><DashboardPage user={user} /></ProtectedRoute>} />
            <Route path="/new-entry" element={<ProtectedRoute user={user} loading={loading}><NewEntryPage user={user} /></ProtectedRoute>} />
            <Route path="/entries" element={<ProtectedRoute user={user} loading={loading}><EntriesPage user={user} /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute user={user} loading={loading}><CalendarPage user={user} /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute user={user} loading={loading}><ProfilePage user={user} /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute user={user} loading={loading}><SettingsPage user={user} /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout user={user} loading={loading} />
      </BrowserRouter>
    </ThemeProvider>
  )
}
