import { useState, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import { fetchMyProfile } from '../api/profile.js'
import { getUser } from '../auth/authStorage.js'

const cardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: '20px 24px',
  boxShadow: 'var(--shadow-card)',
}

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function MyProfile({ onLogout }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const user = getUser()

  useEffect(() => {
    fetchMyProfile()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const displayName = profile?.full_name || user?.username || 'User'
  const email = user?.email || ''
  const designation = profile?.current_designation || ''
  const industry = profile?.current_industry || user?.industry || ''
  const company = profile?.current_company || ''
  const city = profile?.city || ''
  const workStatus = profile?.current_work_status || ''
  const credits = user?.credits ?? 0
  const initials = getInitials(displayName)

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
        Loading profile…
      </div>
    )
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 840 }}>
      {/* Profile Info Card */}
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.03em',
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            {displayName}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            {[designation, industry, company].filter(Boolean).join(' · ') || workStatus}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            {[email, city].filter(Boolean).join(' · ')}
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-base)',
            color: 'var(--text-secondary)',
            fontSize: 13,
            fontWeight: 500,
            fontFamily: 'inherit',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'background 0.15s, color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.35)'
            e.currentTarget.style.color = '#ef4444'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-base)'
            e.currentTarget.style.borderColor = 'var(--border-subtle)'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {/* Credits */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent-blue)', fontFamily: 'var(--font-display)' }}>
            {credits}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
            Credits available
          </div>
        </div>

        {/* Work status */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'var(--font-display)' }}>
            {workStatus === 'WORKING' ? 'Employed' : workStatus === 'UNEMPLOYED' ? 'Searching' : '—'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
            Work status
          </div>
        </div>

        {/* Verified */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: profile?.is_verified ? 'var(--accent-green)' : 'var(--accent-amber)', fontFamily: 'var(--font-display)' }}>
            {profile?.is_verified ? 'Yes' : 'No'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
            Verified
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      {profile && (
        <div style={{ ...cardStyle, padding: '20px 24px' }}>
          <div style={{ fontSize: 14, fontWeight: 650, color: 'var(--text-primary)', marginBottom: 18 }}>
            Profile details
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Full name', value: profile.full_name },
              { label: 'Designation', value: profile.current_designation },
              { label: 'Industry', value: profile.current_industry },
              { label: 'Company', value: profile.current_company },
              { label: 'City', value: profile.city },
              { label: 'Current salary', value: profile.current_salary ? `৳${Number(profile.current_salary).toLocaleString()}` : null },
            ]
              .filter((row) => row.value)
              .map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 12,
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{row.value}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
