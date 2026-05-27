import { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

const COMPANIES_DATA = [
  {
    id: 'grameenphone',
    name: 'Grameenphone Ltd.',
    tag: 'MNC',
    industry: 'Telecom',
    employees: '5,000+ employees',
    reviewsCount: 312,
    reputation: 88,
    recommend: 87,
    initials: 'GR',
  },
  {
    id: 'brac',
    name: 'BRAC',
    tag: 'NGO',
    industry: 'Development',
    employees: '10,000+ employees',
    reviewsCount: 198,
    reputation: 83,
    recommend: 91,
    initials: 'BR',
  },
  {
    id: 'dutch-bangla',
    name: 'Dutch-Bangla Bank',
    tag: 'Local',
    industry: 'Banking',
    employees: '3,000+ employees',
    reviewsCount: 156,
    reputation: 79,
    recommend: 78,
    initials: 'DU',
  },
  {
    id: 'robi',
    name: 'Robi Axiata',
    tag: 'MNC',
    industry: 'Telecom',
    employees: '2,000+ employees',
    reviewsCount: 134,
    reputation: 76,
    recommend: 72,
    initials: 'RO',
  },
  {
    id: 'square',
    name: 'Square Group',
    tag: 'Local',
    industry: 'Conglomerate',
    employees: '8,000+ employees',
    reviewsCount: 210,
    reputation: 74,
    recommend: 75,
    initials: 'SQ',
  },
  {
    id: 'aci',
    name: 'ACI Limited',
    tag: 'Local',
    industry: 'FMCG',
    employees: '4,000+ employees',
    reviewsCount: 89,
    reputation: 71,
    recommend: 68,
    initials: 'AC',
  },
]

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
    case 'Local':
    default:
      return {
        color: 'var(--accent-amber)',
        background: 'var(--accent-amber-dim)',
      }
  }
}

export default function Companies() {
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('All')

  const filteredCompanies = COMPANIES_DATA.filter((company) => {
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
            <option value="All">All industries</option>
            <option value="Telecom">Telecom</option>
            <option value="Development">Development</option>
            <option value="Banking">Banking</option>
            <option value="Conglomerate">Conglomerate</option>
            <option value="FMCG">FMCG</option>
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

      {/* Companies List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredCompanies.length > 0 ? (
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
                  {company.industry} · {company.employees} · {company.reviewsCount} reviews
                </div>
              </div>

              {/* Scores Column */}
              <div style={{ display: 'flex', gap: 32 }}>
                {/* Reputation */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)' }}>
                    {company.reputation}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    reputation
                  </span>
                </div>

                {/* Recommend */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-green)' }}>
                    {company.recommend}%
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                    recommend
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
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
        )}
      </div>
    </div>
  )
}
