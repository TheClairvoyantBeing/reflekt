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
  const { theme, aesthetic, font, toggleTheme, setThemeMode, setAesthetic, setFont, fonts } = useTheme()
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
        toast.error('Failed to update password.')
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
        toast.error('Failed to delete account.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-page fade-in">
      <header className="profile-header">
        <h1>Profile & Settings</h1>
        <p className="profile-subtitle">Manage your account and customize your experience</p>
      </header>

      {/* Account Info */}
      <section className="profile-section fade-in-up stagger-1">
        <h2 className="section-title">Account</h2>
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

      {/* Appearance */}
      <section className="profile-section fade-in-up stagger-2">
        <h2 className="section-title">Appearance</h2>

        {/* Theme */}
        <div className="pref-row">
          <div className="pref-info">
            <span className="pref-label">Theme</span>
            <span className="pref-desc">Choose dark or light mode</span>
          </div>
          <div className="pref-options">
            <button
              className={`option-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setThemeMode('dark')}
            >
              🌙 Dark
            </button>
            <button
              className={`option-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setThemeMode('light')}
            >
              ☀️ Light
            </button>
          </div>
        </div>

        {/* Aesthetic */}
        <div className="pref-row">
          <div className="pref-info">
            <span className="pref-label">Aesthetic</span>
            <span className="pref-desc">Set the visual mood</span>
          </div>
          <div className="pref-options">
            <button
              className={`option-btn ${aesthetic === 'minimalist' ? 'active' : ''}`}
              onClick={() => setAesthetic('minimalist')}
            >
              ◇ Minimalist
            </button>
            <button
              className={`option-btn ${aesthetic === 'moody' ? 'active' : ''}`}
              onClick={() => setAesthetic('moody')}
            >
              ◆ Moody
            </button>
          </div>
        </div>

        {/* Font */}
        <div className="pref-row">
          <div className="pref-info">
            <span className="pref-label">Font</span>
            <span className="pref-desc">Choose your preferred typeface</span>
          </div>
          <div className="input-group" style={{ maxWidth: 200 }}>
            <select value={font} onChange={(e) => setFont(e.target.value)}>
              {Object.entries(fonts).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Change Password */}
      <section className="profile-section fade-in-up stagger-3">
        <h2 className="section-title">Security</h2>
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
      <section className="profile-section danger-section fade-in-up stagger-4">
        <h2 className="section-title danger-title">Danger Zone</h2>
        <p className="danger-desc">
          Permanently delete your account and all journal entries. This cannot be undone.
        </p>
        {!deleteConfirm ? (
          <button className="btn-delete" onClick={() => setDeleteConfirm(true)}>
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
