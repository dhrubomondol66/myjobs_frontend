import { Bell, Coins } from 'lucide-react'

const PAGE_LABELS = {
  dashboard: 'Dashboard',
  'company-review': 'Company review',
  compensation: 'Compensation',
  companies: 'Companies',
  'my-profile': 'My profile',
}

const ghostBtn = {
  padding: '6px 14px',
  borderRadius: 'var(--radius-md)',
  fontSize: 13,
  fontWeight: 500,
  fontFamily: 'inherit',
  cursor: 'pointer',
  transition: 'background 0.15s, color 0.15s, opacity 0.15s',
  border: 'none',
}

export default function Topbar({
  activePage,
  onNavigate,
  onNavigateAuth,
  isAuthenticated,
  userInitials = 'AK',
}) {
  const goToProfile = () => {
    onNavigate('my-profile')
  }

  return (
    <header
      style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--text-secondary)',
          fontSize: 13,
        }}
      >
        <span>MYJOBS</span>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
          {PAGE_LABELS[activePage]}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isAuthenticated && (
          <button
            type="button"
            onClick={goToProfile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 99,
              background: 'var(--accent-green-dim)',
              border: '1px solid rgba(34,201,122,0.25)',
              color: 'var(--accent-green)',
              fontSize: 13,
              fontWeight: 500,
              transition: 'opacity 0.15s',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            <Coins size={13} />
            45 credits
          </button>
        )}

        <button
          type="button"
          style={{
            width: 34,
            height: 34,
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            position: 'relative',
            transition: 'background 0.15s, color 0.15s',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-hover)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <Bell size={16} />
          {isAuthenticated && (
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 6,
                height: 6,
                background: 'var(--accent-blue)',
                borderRadius: '50%',
                border: '1.5px solid var(--bg-surface)',
              }}
            />
          )}
        </button>

        {isAuthenticated ? (
          <button
            type="button"
            onClick={goToProfile}
            aria-label="My profile"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--accent-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: 12,
              color: '#fff',
              letterSpacing: '0.03em',
              transition: 'opacity 0.15s',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.85'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            {userInitials}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onNavigateAuth('login')}
              style={{
                ...ghostBtn,
                background: 'transparent',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-hover)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => onNavigateAuth('register')}
              style={{
                ...ghostBtn,
                background: 'var(--accent-blue)',
                color: '#fff',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  )
}
