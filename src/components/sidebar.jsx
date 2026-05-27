import { useState } from 'react'
import { LayoutDashboard, Star, DollarSign, Building2, User, ChevronLeft } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'company-review', label: 'Company review', icon: Star },
  { id: 'compensation', label: 'Compensation', icon: DollarSign },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'my-profile', label: 'My profile', icon: User },
]

export default function Sidebar({ activePage, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside style={{
      width: collapsed ? 64 : 224,
      minWidth: collapsed ? 64 : 224,
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease, min-width 0.25s ease',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '20px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderBottom: '1px solid var(--border-subtle)',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 32, height: 32,
          background: 'var(--accent-blue)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 13,
          color: '#fff',
        }}>MJ</div>
        {!collapsed && (
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
            MYJOBS
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activePage === id
          return (
            <button key={id} onClick={() => onNavigate(id)} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed ? '9px 0' : '9px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 'var(--radius-sm)',
              background: active ? 'var(--accent-blue-dim)' : 'transparent',
              color: active ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontWeight: active ? 500 : 400,
              fontSize: 14,
              transition: 'background 0.15s, color 0.15s',
              whiteSpace: 'nowrap',
              width: '100%',
              border: 'none',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}}
            >
              <Icon size={16} strokeWidth={1.8} />
              {!collapsed && <span>{label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-subtle)' }}>
        <button onClick={() => setCollapsed(c => !c)} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: collapsed ? '9px 0' : '9px 12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-secondary)',
          fontSize: 14,
          width: '100%',
          transition: 'background 0.15s, color 0.15s',
          border: 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          <ChevronLeft size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}