import { useState } from 'react'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import AuthLayout from './AuthLayout.jsx'
import { forgotPassword } from '../service/auth.js'
import { sendPasswordResetEmail } from '../service/emailService.js'

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // Option 1: Call backend to validate email and get reset token
      const response = await forgotPassword({ email })
      
      // Option 2: Send reset email via EmailJS with reset link/code
      const resetToken = response?.data?.reset_token || 'reset-code-here'
      const resetLink = `${import.meta.env.VITE_RESET_PASSWORD_URL}?token=${resetToken}`
      
      await sendPasswordResetEmail(email, resetLink, email.split('@')[0])
      
      setSent(true)
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to send reset email. Please try again.'
      setError(String(message))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        sent
          ? 'Check your inbox for a link to choose a new password.'
          : 'Enter the email linked to your account and we will send reset instructions.'
      }
    >
      {error && (
        <div className="auth-alert auth-alert--info" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)' }}>
          {error}
        </div>
      )}
      {sent ? (
        <>
          <div className="auth-alert auth-alert--success">
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>
              If <strong>{email}</strong> is registered, you will receive an email shortly.
            </span>
          </div>
          <button
            type="button"
            className="auth-btn auth-btn--primary"
            onClick={() => onNavigate?.('reset-password')}
          >
            Continue
          </button>
          <p className="auth-footer">
            <button type="button" className="auth-link" onClick={() => setSent(false)}>
              Try a different email
            </button>
          </p>
        </>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="forgot-email">
              Email
            </label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                <Mail size={16} />
              </span>
              <input
                id="forgot-email"
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

          <button
            type="submit"
            className="auth-btn auth-btn--primary"
            disabled={submitting}
          >
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

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
