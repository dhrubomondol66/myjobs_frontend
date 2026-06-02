import { useState, useMemo } from 'react'
import { Mail, Lock, User, Briefcase, CalendarClock, Eye, EyeOff } from 'lucide-react'
import AuthLayout from './AuthLayout.jsx'
import { registerUser, loginUser } from '../service/auth.js'
import { setAuthTokens } from './authStorage.js'

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
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [industry, setIndustry] = useState('')
  const [yearsOfExperience, setYearsOfExperience] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const strength = useMemo(() => getPasswordStrength(password), [password])
  const passwordsMatch = !confirm || password === confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agreed || password !== confirm) return
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        username,
        email,
        password,
        industry,
        years_of_experience: yearsOfExperience === '' ? null : Number(yearsOfExperience),
      }
      await registerUser(payload)

      // Auto-login after successful registration (best UX).
      const { data } = await loginUser({ email, password })
      setAuthTokens({ access: data?.access, refresh: data?.refresh })
      onAuthenticated?.()
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Registration failed. Please check your details and try again.'
      setError(String(message))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join MYJOBS to share reviews and unlock workplace insights."
    >
      {error && (
        <div className="auth-alert auth-alert--info" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)' }}>
          {error}
        </div>
      )}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="register-username">
            Username
          </label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">
              <User size={16} />
            </span>
            <input
              id="register-username"
              className="auth-input"
              type="text"
              placeholder="ahmed_karim"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="register-industry">
            Industry
          </label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">
              <Briefcase size={16} />
            </span>
            <input
              id="register-industry"
              className="auth-input"
              type="text"
              placeholder="e.g. Telecom, Banking, Tech"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="register-yoe">
            Years of experience
          </label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">
              <CalendarClock size={16} />
            </span>
            <input
              id="register-yoe"
              className="auth-input"
              type="number"
              min={0}
              max={60}
              step={1}
              placeholder="e.g. 5"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
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
