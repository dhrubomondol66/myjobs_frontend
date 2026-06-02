import { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'
import { getMyProfile, updateProfile } from '../service/myprofile.js'

const emptyProfile = {
  id: null,
  user: null,
  full_name: '',
  current_work_status: 'UNEMPLOYED',
  current_designation: '',
  current_industry: '',
  current_company: '',
  current_salary: '',
  city: '',
  is_verified: false,
  created_at: '',
  updated_at: '',
}

const cardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: '20px 24px',
  boxShadow: 'var(--shadow-card)',
}

export default function MyProfile({ onLogout }) {
  const [profile, setProfile] = useState(emptyProfile)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const { data } = await getMyProfile()
        if (!mounted) return
        setProfile({
          ...emptyProfile,
          ...data,
        })
        setActivities(data?.recent_activity || [])
      } catch (e) {
        if (!mounted) return
        setError('Failed to load profile.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleChange = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        full_name: profile.full_name || '',
        current_work_status: profile.current_work_status || 'UNEMPLOYED',
        current_designation: profile.current_designation || null,
        current_industry: profile.current_industry || null,
        current_company: profile.current_company || null,
        current_salary: profile.current_salary ? Number(profile.current_salary) : null,
        city: profile.city || null,
      }
      const { data } = await updateProfile(payload)
      setProfile((prev) => ({ ...prev, ...data }))
      setSuccess('Profile updated successfully.')
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Failed to update profile. Please try again.'
      setError(String(message))
    } finally {
      setSaving(false)
    }
  }

  const initials = (profile.full_name || 'U?')
    .split(/[\s.@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  const formatDate = (isoString) => {
    if (!isoString) return ''
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: "100%" }}>
      {/* Profile Header Card */}
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
                {profile.full_name || 'Anonymous User'}
              </h2>
              {profile.is_verified ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 8px',
                  borderRadius: 12,
                  background: 'rgba(34, 197, 94, 0.1)',
                  color: 'var(--accent-green)',
                  fontSize: 11,
                  fontWeight: 600,
                }}>
                  ✓ Verified
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 8px',
                  borderRadius: 12,
                  background: 'var(--bg-hover)',
                  color: 'var(--text-muted)',
                  fontSize: 11,
                  fontWeight: 500,
                  border: '1px solid var(--border-subtle)',
                }}>
                  Unverified
                </span>
              )}
            </div>
            {(profile.created_at || profile.updated_at) && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                {profile.created_at && `Member since ${formatDate(profile.created_at)}`}
                {profile.updated_at && ` · Last updated ${formatDate(profile.updated_at)}`}
              </div>
            )}
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

      {error && (
        <div style={{ ...cardStyle, borderColor: 'rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.04)', color: '#ef4444', fontSize: 13 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ ...cardStyle, borderColor: 'rgba(34,197,94,0.35)', background: 'rgba(34,197,94,0.04)', color: 'var(--accent-green)', fontSize: 13 }}>
          {success}
        </div>
      )}

      {/* Profile Settings Card */}
      <div style={cardStyle}>
        <div style={{ fontSize: 14, fontWeight: 650, color: 'var(--text-primary)', marginBottom: 18 }}>
          Profile Settings
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>Full Name</div>
              <input
                value={profile.full_name || ''}
                onChange={(e) => handleChange('full_name', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-base)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ width: 180 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>Work Status</div>
              <select
                value={profile.current_work_status || 'UNEMPLOYED'}
                onChange={(e) => handleChange('current_work_status', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-base)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
              >
                <option value="UNEMPLOYED">Unemployed</option>
                <option value="WORKING">Working</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>Designation</div>
              <input
                value={profile.current_designation || ''}
                onChange={(e) => handleChange('current_designation', e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-base)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>Company</div>
              <input
                value={profile.current_company || ''}
                onChange={(e) => handleChange('current_company', e.target.value)}
                placeholder="e.g. Google, Acme Corp"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-base)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>Industry</div>
              <input
                value={profile.current_industry || ''}
                onChange={(e) => handleChange('current_industry', e.target.value)}
                placeholder="e.g. Tech, Finance, Healthcare"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-base)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>Monthly Salary (BDT)</div>
              <input
                type="number"
                value={profile.current_salary || ''}
                onChange={(e) => handleChange('current_salary', e.target.value)}
                placeholder="e.g. 75000"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-base)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>City</div>
              <input
                value={profile.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="e.g. Dhaka, Chittagong"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-base)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-blue)',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                fontWeight: 650,
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'background 0.15s, opacity 0.15s',
                opacity: saving ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.background = '#2563eb'
              }}
              onMouseLeave={(e) => {
                if (!saving) e.currentTarget.style.background = 'var(--accent-blue)'
              }}
            >
              {saving ? 'Saving changes...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Stats Row */}
      {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent-blue)', fontFamily: 'var(--font-display)' }}>
            {profile.credits ?? 0}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
            Credits available
          </div>
        </div>

        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'var(--font-display)' }}>
            {profile.reviews_submitted ?? profile.reviewsSubmitted ?? 0}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
            Reviews submitted
          </div>
        </div>

        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent-amber)', fontFamily: 'var(--font-display)' }}>
            {profile.insights_unlocked ?? profile.insightsUnlocked ?? 0}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
            Insights unlocked
          </div>
        </div>
      </div> */}

      {/* Activity History Card */}
      {/* <div style={{ ...cardStyle, padding: '20px 24px' }}>
        <div style={{ fontSize: 14, fontWeight: 650, color: 'var(--text-primary)', marginBottom: 18 }}>
          Activity history
        </div>
        {loading ? (
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading activity…</div>
        ) : activities?.length ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {activities.map((activity) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: 12,
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      background: 'var(--bg-hover)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      color: activity.color || 'var(--text-secondary)',
                      flexShrink: 0,
                    }}
                  >
                    {activity.initials || '•'}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {activity.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                      {activity.time}
                    </div>
                  </div>
                </div>
                {activity.change != null && (
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: activity.change > 0 ? 'var(--accent-green)' : '#ef4444',
                    }}
                  >
                    {activity.change > 0 ? `+${activity.change}` : activity.change}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No recent activity yet.</div>
        )}
      </div> */}
    </div>
  )
}
