import { LogOut } from 'lucide-react'

const PROFILE_DATA = {
  name: 'Ahmed Karim',
  role: 'Software engineer',
  experience: '5 years experience',
  email: 'ahmed.karim@gmail.com',
  initials: 'AK',
  credits: 45,
  reviewsSubmitted: 3,
  insightsUnlocked: 12,
}

const ACTIVITIES = [
  {
    id: 1,
    title: 'Reviewed Grameenphone Ltd.',
    time: '2 days ago',
    change: 10,
    type: 'review',
    initials: 'GR',
    color: 'var(--accent-blue)',
  },
  {
    id: 2,
    title: 'Submitted compensation data',
    time: '5 days ago',
    change: 15,
    type: 'salary',
    initials: '৳',
    color: 'var(--accent-green)',
  },
  {
    id: 3,
    title: 'Unlocked BRAC salary data',
    time: '1 week ago',
    change: -5,
    type: 'unlock',
    initials: 'BR',
    color: 'var(--accent-purple)',
  },
  {
    id: 4,
    title: 'Reviewed Dutch-Bangla Bank',
    time: '2 weeks ago',
    change: 10,
    type: 'review',
    initials: 'DU',
    color: 'var(--accent-blue)',
  },
]

const cardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: '20px 24px',
  boxShadow: 'var(--shadow-card)',
}

export default function MyProfile({ onLogout }) {
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
          {PROFILE_DATA.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            {PROFILE_DATA.name}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            {PROFILE_DATA.role} · {PROFILE_DATA.experience}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            {PROFILE_DATA.email}
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
            {PROFILE_DATA.credits}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
            Credits available
          </div>
        </div>

        {/* Reviews */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'var(--font-display)' }}>
            {PROFILE_DATA.reviewsSubmitted}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
            Reviews submitted
          </div>
        </div>

        {/* Insights */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent-amber)', fontFamily: 'var(--font-display)' }}>
            {PROFILE_DATA.insightsUnlocked}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
            Insights unlocked
          </div>
        </div>
      </div>

      {/* Activity History Card */}
      <div style={{ ...cardStyle, padding: '20px 24px' }}>
        <div style={{ fontSize: 14, fontWeight: 650, color: 'var(--text-primary)', marginBottom: 18 }}>
          Activity history
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {ACTIVITIES.map((activity) => (
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
                {/* Visual placeholder box for brand/activity type */}
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
                  {activity.initials}
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
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: activity.change > 0 ? 'var(--accent-green)' : '#ef4444',
                }}
              >
                {activity.change > 0 ? `+${activity.change}` : activity.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
