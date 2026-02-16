import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { auth } from './lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { ThemeProvider } from './context/ThemeContext'

import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import NewEntryPage from './pages/NewEntryPage'
import EntriesPage from './pages/EntriesPage'
import ProfilePage from './pages/ProfilePage'

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

        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Layout user={user}>
                  <DashboardPage user={user} />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-entry"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Layout user={user}>
                  <NewEntryPage user={user} />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/entries"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Layout user={user}>
                  <EntriesPage user={user} />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Layout user={user}>
                  <ProfilePage user={user} />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
