import { useState, useMemo } from 'react'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import AuthLayout from './AuthLayout.jsx'
import { register as registerApi } from '../api/auth.js'
import { login as loginApi } from '../api/auth.js'
import { saveTokens, saveUser } from './authStorage.js'

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '' }
  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return { score, label: labels[score] }
}

export default function Register({ onNavigate, onAuthenticated }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const strength = useMemo(() => getPasswordStrength(password), [password])
  const passwordsMatch = !confirm || password === confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agreed || password !== confirm) return
    setSubmitting(true)
    setError('')
    try {
      await registerApi({ username: name, email, password })
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
      const d = err.data
      if (d) {
        const msg = d.email?.[0] || d.username?.[0] || d.password?.[0] || d.detail || 'Registration failed.'
        setError(msg)
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join MYJOBS to share reviews and unlock workplace insights."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && (
          <div className="auth-alert auth-alert--error">
            <span>{error}</span>
          </div>
        )}

        <div className="auth-field">
          <label className="auth-label" htmlFor="register-name">
            Full name
          </label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">
              <User size={16} />
            </span>
            <input
              id="register-name"
              className="auth-input"
              type="text"
              placeholder="Ahmed Karim"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="register-email">
            Email
          </label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">
              <Mail size={16} />
            </span>
            <input
              id="register-email"
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
          <label className="auth-label" htmlFor="register-password">
            Password
          </label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">
              <Lock size={16} />
            </span>
            <input
              id="register-password"
              className="auth-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
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
          {password && (
            <>
              <div className="auth-strength" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`auth-strength-bar ${
                      i <= strength.score
                        ? strength.score <= 1
                          ? 'auth-strength-bar--weak'
                          : 'auth-strength-bar--active'
                        : ''
                    }`}
                  />
                ))}
              </div>
              <div className="auth-strength-label">Strength: {strength.label}</div>
            </>
          )}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="register-confirm">
            Confirm password
          </label>
          <input
            id="register-confirm"
            className="auth-input auth-input--icon"
            type={showPassword ? 'text' : 'password'}
            placeholder="Repeat your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
          {!passwordsMatch && (
            <span style={{ fontSize: 12, color: '#ef4444' }}>Passwords do not match</span>
          )}
        </div>

        <label className="auth-checkbox-row">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
          />
          <span>
            I agree to the terms of service and understand that reviews are shared anonymously.
          </span>
        </label>

        <button
          type="submit"
          className="auth-btn auth-btn--primary"
          disabled={submitting || !agreed || !passwordsMatch}
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account?{' '}
        <button type="button" className="auth-link" onClick={() => onNavigate?.('login')}>
          Sign in
        </button>
      </p>
    </AuthLayout>
  )
}
