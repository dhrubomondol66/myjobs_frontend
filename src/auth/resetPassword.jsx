import { useState, useMemo } from 'react'
import { Lock, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react'
import AuthLayout from './AuthLayout.jsx'
import { resetPassword } from '../service/auth.js'

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

export default function ResetPassword({ onNavigate }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Extract uid and token from hash: #/reset-password/uid/token/
  const hashParts = window.location.hash.replace(/^#\/?/, '').split('/')
  const uid = hashParts[1]
  const token = hashParts[2]

  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword])
  const passwordsMatch = !confirmPassword || newPassword === confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) return
    setError('')
    setSubmitting(true)
    try {
      await resetPassword({
        uid,
        token,
        new_password: newPassword,       // ← fixed
        confirm_password: confirmPassword, // ← fixed
      })
      onNavigate?.('login')
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to reset password. The link may be expired.'
      setError(String(message))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a new password for your account."
    >
      <div className="auth-alert auth-alert--info">
        <KeyRound size={18} style={{ flexShrink: 0 }} />
        <span>Reset links expire after 24 hours for your security.</span>
      </div>

      {error && (
        <div className="auth-alert auth-alert--info" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)' }}>
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
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
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
          {newPassword && (
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          disabled={submitting || !passwordsMatch}
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