import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../lib/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import toast from 'react-hot-toast'
import '../styles/login.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields.')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
        toast.success('Account created! Welcome to Reflekt.')
        navigate('/dashboard')
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        toast.success('Welcome back!')
        navigate('/dashboard')
      }
    } catch (error) {
      const msg = getFriendlyError(error.code)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left side — branding */}
        <div className="login-hero">
          <div className="hero-content">
            <span className="hero-icon">◆</span>
            <h1 className="hero-title">Reflekt</h1>
            <p className="hero-subtitle">
              Your thoughts, beautifully preserved.<br />
              A private space to journal, reflect, and grow.
            </p>
          </div>
          <div className="hero-glow" />
        </div>

        {/* Right side — form */}
        <div className="login-form-wrapper">
          <div className="login-card">
            <h2 className="form-title">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="form-subtitle">
              {isSignUp
                ? 'Start your journaling journey today.'
                : 'Sign in to continue writing.'}
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading
                  ? 'Please wait...'
                  : isSignUp
                    ? 'Create Account'
                    : 'Sign In'}
              </button>
            </form>

            <div className="form-divider">
              <span>or</span>
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Map Firebase error codes to user-friendly messages */
function getFriendlyError(code) {
  switch (code) {
    case 'auth/user-not-found':
      return 'No account found with this email.'
    case 'auth/wrong-password':
      return 'Incorrect password.'
    case 'auth/invalid-credential':
      return 'Invalid email or password.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    default:
      return 'Authentication failed. Please try again.'
  }
}
