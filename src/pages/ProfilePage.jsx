import React, { useState } from 'react'
import { auth } from '../lib/firebase'
import {
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import '../styles/profile.css'

export default function ProfilePage({ user }) {
  const { theme, toggleTheme } = useTheme()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')

  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown'

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      // Re-authenticate before sensitive operations
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)
      toast.success('Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
    } catch (error) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast.error('Current password is incorrect.')
      } else {
        toast.error('Failed to update password. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password to confirm.')
      return
    }

    setLoading(true)
    try {
      const credential = EmailAuthProvider.credential(user.email, deletePassword)
      await reauthenticateWithCredential(user, credential)
      await deleteUser(user)
      toast.success('Account deleted. Goodbye!')
    } catch (error) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast.error('Incorrect password.')
      } else {
        toast.error('Failed to delete account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-page fade-in">
      <header className="profile-header">
        <h1>Profile & Settings</h1>
        <p className="profile-subtitle">Manage your account and preferences</p>
      </header>

      {/* Profile Info */}
      <section className="profile-section">
        <h2 className="section-title">Account Info</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">User ID</span>
            <span className="info-value info-uid">{user?.uid}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Member Since</span>
            <span className="info-value">{joinDate}</span>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="profile-section">
        <h2 className="section-title">Preferences</h2>
        <div className="pref-row">
          <div className="pref-info">
            <span className="pref-label">Theme</span>
            <span className="pref-desc">Switch between dark and light mode</span>
          </div>
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            <span className="toggle-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="toggle-text">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </section>

      {/* Change Password */}
      <section className="profile-section">
        <h2 className="section-title">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="password-form">
          <div className="input-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password (6+ chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="profile-section danger-section">
        <h2 className="section-title danger-title">Danger Zone</h2>
        <p className="danger-desc">
          Permanently delete your account and all journal entries. This action cannot be undone.
        </p>
        {!deleteConfirm ? (
          <button
            className="btn-delete"
            onClick={() => setDeleteConfirm(true)}
          >
            Delete Account
          </button>
        ) : (
          <div className="delete-confirm">
            <div className="input-group">
              <label htmlFor="deletePassword">Confirm your password</label>
              <input
                id="deletePassword"
                type="password"
                placeholder="Enter password to confirm"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
            </div>
            <div className="delete-actions">
              <button
                className="btn-delete"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
              <button
                className="btn-secondary"
                onClick={() => { setDeleteConfirm(false); setDeletePassword('') }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
