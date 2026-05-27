import { useState, useMemo } from 'react'
import { Lock, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react'
import AuthLayout from './AuthLayout.jsx'

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
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const strength = useMemo(() => getPasswordStrength(password), [password])
  const passwordsMatch = !confirm || password === confirm

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirm) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      onAuthenticated?.()
    }, 600)
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Enter the code from your email and choose a new password."
    >
      <div className="auth-alert auth-alert--info">
        <KeyRound size={18} style={{ flexShrink: 0 }} />
        <span>Reset codes expire after 30 minutes for your security.</span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="reset-code">
            Reset code
          </label>
          <input
            id="reset-code"
            className="auth-input auth-input--icon"
            type="text"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            minLength={6}
            maxLength={6}
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
          disabled={submitting || !passwordsMatch || code.length < 6}
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
