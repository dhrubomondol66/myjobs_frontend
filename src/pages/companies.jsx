import { useState, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { fetchCompanies } from '../api/companies.js'

const getTagStyles = (tag) => {
  switch (tag) {
    case 'MNC':
      return {
        color: 'var(--accent-blue)',
        background: 'var(--accent-blue-dim)',
      }
    case 'NGO':
      return {
        color: 'var(--accent-purple)',
        background: 'var(--accent-purple-dim)',
      }
    case 'LOCAL':
    case 'Local':
    default:
      return {
        color: 'var(--accent-amber)',
        background: 'var(--accent-amber-dim)',
      }
  }
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('All')

  useEffect(() => {
    let cancelled = false
    fetchCompanies()
      .then((data) => {
        if (cancelled) return
        const list = (Array.isArray(data) ? data : data.results || []).map((c) => ({
          id: c.id,
          name: c.name,
          tag: c.type || 'Local',
          industry: c.industry || '',
          employees: c.manpower_size ? `${c.manpower_size} employees` : '',
          initials: getInitials(c.name),
          reputation: c.rating ?? '—',
          headquarters: c.headquarters || '',
        }))
        setCompanies(list)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const industries = ['All', ...new Set(companies.map((c) => c.industry).filter(Boolean))]

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase())
    const matchesIndustry = industry === 'All' || company.industry === industry
    return matchesSearch && matchesIndustry
  })

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Search and Filters Bar */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: 14,
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-blue)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
          />
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
        </div>
        <div style={{ position: 'relative', width: 180 }}>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 32px 10px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              appearance: 'none',
              outline: 'none',
              cursor: 'pointer',
              fontSize: 14,
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-blue)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
          >
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind === 'All' ? 'All industries' : ind}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40, fontSize: 14 }}>
          Loading companies…
        </div>
      )}

      {/* Companies List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {!loading && filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <div
              key={company.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
                transition: 'transform 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
              }}
            >
              {/* Logo / Initials */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--accent-blue)',
                  flexShrink: 0,
                }}
              >
                {company.initials}
              </div>

              {/* Info Column */}
              <div style={{ flex: 1, marginLeft: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {company.name}
                  </span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 99,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      ...getTagStyles(company.tag),
                    }}
                  >
                    {company.tag}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {[company.industry, company.employees, company.headquarters].filter(Boolean).join(' · ')}
                </div>
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)' }}>
                  {company.reputation}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                  rating
                </span>
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              No companies found matching search criteria.
            </div>
          )
        )}
      </div>
    </div>
  )
}
