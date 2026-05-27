import { useState, useMemo } from 'react'
import { Lock, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react'
import AuthLayout from './AuthLayout.jsx'
import { resetPassword as resetPasswordApi } from '../api/auth.js'

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

export default function ResetPassword({ onNavigate, onAuthenticated }) {
  const [uid, setUid] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const strength = useMemo(() => getPasswordStrength(password), [password])
  const passwordsMatch = !confirm || password === confirm

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) return
    setSubmitting(true)
    setError('')
    try {
      await resetPasswordApi({
        uid,
        token,
        new_password: password,
        confirm_password: confirm,
      })
      onAuthenticated?.()
    } catch (err) {
      const d = err.data
      if (Array.isArray(d)) {
        setError(d[0])
      } else {
        setError(d?.detail || d?.non_field_errors?.[0] || 'Reset failed. Check your code and try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Enter the UID and token from your reset email and choose a new password."
    >
      <div className="auth-alert auth-alert--info">
        <KeyRound size={18} style={{ flexShrink: 0 }} />
        <span>Reset links expire after 30 minutes for your security.</span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && (
          <div className="auth-alert auth-alert--error">
            <span>{error}</span>
          </div>
        )}

        <div className="auth-field">
          <label className="auth-label" htmlFor="reset-uid">
            UID (from reset link)
          </label>
          <input
            id="reset-uid"
            className="auth-input auth-input--icon"
            type="text"
            placeholder="UID from email link"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="reset-token">
            Token (from reset link)
          </label>
          <input
            id="reset-token"
            className="auth-input auth-input--icon"
            type="text"
            placeholder="Token from email link"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="reset-password">
            New password
          </label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon" aria-hidden="true">
              <Lock size={16} />
            </span>
            <input
              id="reset-password"
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
          <label className="auth-label" htmlFor="reset-confirm">
            Confirm new password
          </label>
          <input
            id="reset-confirm"
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

        <button
          type="submit"
          className="auth-btn auth-btn--primary"
          disabled={submitting || !passwordsMatch || !uid || !token}
        >
          {submitting ? 'Updating…' : 'Update password'}
        </button>
      </form>

      <p className="auth-footer">
        <button
          type="button"
          className="auth-link"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          onClick={() => onNavigate?.('login')}
        >
          <ArrowLeft size={14} />
          Back to sign in
        </button>
      </p>
    </AuthLayout>
  )
}
