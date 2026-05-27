import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import AuthLayout from './AuthLayout.jsx'
import { login as loginApi } from '../api/auth.js'
import { saveTokens, saveUser } from './authStorage.js'

export default function Login({ onNavigate, onAuthenticated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const data = await loginApi(email, password)
      saveTokens({ access: data.access, refresh: data.refresh })
      saveUser({
        id: data.user_id,
        username: data.username,
        email: data.email,
        industry: data.industry,
        years_of_experience: data.years_of_experience,
        is_verified: data.is_verified,
        credits: data.credits,
      })
      onAuthenticated?.()
    } catch (err) {
      setError(err.data?.detail || 'Invalid email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to submit reviews and unlock salary insights."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && (
          <div className="auth-alert auth-alert--error">
            <span>{error}</span>
          </div>
        )}

        <div className="auth-field">
          <label className="auth-label" htmlFor="login-email">
            Email
          </label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">
              <Mail size={16} />
            </span>
            <input
              id="login-email"
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <div className="auth-label-row">
            <label className="auth-label" htmlFor="login-password">
              Password
            </label>
            <button
              type="button"
              className="auth-link"
              onClick={() => onNavigate?.('forgot-password')}
            >
              Forgot password?
            </button>
          </div>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">
              <Lock size={16} />
            </span>
            <input
              id="login-password"
              className="auth-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="auth-toggle-password"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <label className="auth-checkbox-row">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>Keep me signed in on this device</span>
        </label>

        <button
          type="submit"
          className="auth-btn auth-btn--primary"
          disabled={submitting}
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="auth-footer">
        Don&apos;t have an account?{' '}
        <button type="button" className="auth-link" onClick={() => onNavigate?.('register')}>
          Create account
        </button>
      </p>
    </AuthLayout>
  )
}
