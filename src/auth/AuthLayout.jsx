import './auth.css'

const FEATURES = [
  'Anonymous company reviews from real employees',
  'Salary benchmarks across industries in Bangladesh',
  'Earn credits by contributing — unlock insights',
]

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="auth-page">
      <aside className="auth-brand" aria-hidden="true">
        <div className="auth-brand-logo">
          <div className="auth-brand-logo-mark">MJ</div>
          <span className="auth-brand-logo-text">MYJOBS</span>
        </div>

        <div className="auth-brand-content">
          <h1>Know before you join</h1>
          <p>
            Honest workplace insights and compensation data — built for professionals in Bangladesh.
          </p>
          <ul className="auth-brand-features">
            {FEATURES.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>

        <p className="auth-brand-footer">© {new Date().getFullYear()} MYJOBS. All rights reserved.</p>
      </aside>

      <div className="auth-main">
        <div className="auth-card">
          <div className="auth-mobile-logo">
            <div className="auth-mobile-logo-mark">MJ</div>
            <span className="auth-mobile-logo-text">MYJOBS</span>
          </div>

          {(title || subtitle) && (
            <header className="auth-header">
              {title && <h2>{title}</h2>}
              {subtitle && <p>{subtitle}</p>}
            </header>
          )}

          {children}
        </div>
      </div>
    </div>
  )
}
