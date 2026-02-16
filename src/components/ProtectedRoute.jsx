import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * Route guard that redirects unauthenticated users to /login.
 * Wraps child routes in App.jsx.
 */
export default function ProtectedRoute({ user, loading, children }) {
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
