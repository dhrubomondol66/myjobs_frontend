import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { getCompanies } from '../service/companies.js'
import { getReviews } from '../service/companyReviews.js'
import { getCompensation } from '../service/compensation.js'

const getTagStyles = (tag) => {
  switch (tag) {
    case 'MNC':
      return { color: 'var(--accent-blue)', background: 'var(--accent-blue-dim)' }
    case 'NGO':
      return { color: 'var(--accent-purple)', background: 'var(--accent-purple-dim)' }
    case 'Local':
    default:
      return { color: 'var(--accent-amber)', background: 'var(--accent-amber-dim)' }
  }
}

const initialsFromName = (name) => {
  const safe = String(name || '').trim()
  if (!safe) return '—'
  const parts = safe.split(/[\s.]+/).filter(Boolean)
  const a = parts[0]?.[0] || ''
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : (parts[0]?.[1] || '')
  return (a + b).toUpperCase()
}

function toNumber(x) {
  const n = typeof x === 'number' ? x : Number(x)
  return Number.isFinite(n) ? n : null
}

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('All')

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [companiesRes, reviewsRes, compRes] = await Promise.allSettled([
          getCompanies(),
          getReviews(),
          getCompensation(),
        ])

        const companiesValue = companiesRes.status === 'fulfilled' ? companiesRes.value?.data : []
        const reviewsValue = reviewsRes.status === 'fulfilled' ? reviewsRes.value?.data : []
        const compensationValue = compRes.status === 'fulfilled' ? compRes.value?.data : []

        if (!mounted) return
        setCompanies((companiesValue || []).map((c) => {
          // If backend already returns reputation/recommend, use them.
          const rep = toNumber(c.reputation)
          const rec = toNumber(c.recommend)

          if (rep != null && rec != null) {
            return c
          }

          // Otherwise attempt generic computation:
          const companyKeyCandidates = [
            c.id,
            c.company_id,
            c.name,
            c.company_name,
          ].filter(Boolean)

          const isSameCompany = (item) => {
            const itemKeys = [item?.company_id, item?.companyId, item?.company, item?.company_name, item?.companyName]
            return companyKeyCandidates.some((ck) => itemKeys.includes(ck))
          }

          const companyReviews = (reviewsValue || []).filter(isSameCompany)
          const companyComp = (compensationValue || []).filter(isSameCompany)

          const numericReviewScores = []
          const recommendScores = []

          for (const r of companyReviews) {
            for (const val of Object.values(r || {})) {
              if (typeof val === 'number' && val >= 1 && val <= 5) numericReviewScores.push(val)
              if (typeof val === 'string') {
                const v = val.toLowerCase()
                if (v.includes('definitely') || v === '5') recommendScores.push(5)
                if (v.includes('probably') || v === '4') recommendScores.push(4)
                if (v.includes('neutral') || v === '3') recommendScores.push(3)
                if (v.includes('probably not') || v.includes('probably-not') || v === '2') recommendScores.push(2)
                if (v === 'no' || v.includes('no') || v === '1') recommendScores.push(1)
              }
            }
          }

          const fairnessToScore = (fairness) => {
            const map = [
              ['way below', 1],
              ['slightly', 2],
              ['fair', 3],
              ['above', 4],
              ['well above', 5],
            ]
            const s = String(fairness || '').toLowerCase()
            for (const [k, score] of map) if (s.includes(k)) return score
            return null
          }

          const compScores = []
          for (const cc of companyComp) {
            const fairnessField = cc?.fairness ?? cc?.pay_fairness ?? cc?.fair_pay
            const score = fairnessToScore(fairnessField)
            if (score != null) compScores.push(score)
          }

          const reviewAvg = numericReviewScores.length ? numericReviewScores.reduce((a, b) => a + b, 0) / numericReviewScores.length : null
          const compAvg = compScores.length ? compScores.reduce((a, b) => a + b, 0) / compScores.length : null

          const reputationComputed =
            reviewAvg == null && compAvg == null
              ? null
              : Math.round((((reviewAvg ?? compAvg) * 0.7) + ((compAvg ?? reviewAvg) * 0.3)) / 5 * 100)

          const recommendComputed =
            recommendScores.length
              ? Math.round(recommendScores.reduce((a, b) => a + b, 0) / recommendScores.length / 5 * 100)
              : null

          return {
            ...c,
            reputation: reputationComputed ?? c.reputation ?? 0,
            recommend: recommendComputed ?? c.recommend ?? 0,
          }
        }))
      } catch (e) {
        if (!mounted) return
        setError('Failed to load companies.')
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

  const industries = useMemo(() => {
    const set = new Set(companies.map((c) => c.industry).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [companies])

  const filteredCompanies = useMemo(() => {
    const s = search.toLowerCase()
    return companies.filter((company) => {
      const name = String(company.name || company.company_name || '')
      const companyIndustry = company.industry || company.tag || ''
      const matchesSearch = !s || name.toLowerCase().includes(s)
      const matchesIndustry = industry === 'All' || companyIndustry === industry
      return matchesSearch && matchesIndustry
    })
  }, [companies, search, industry])

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
            {industries.map((opt) => (
              <option key={opt} value={opt}>
                {opt === 'All' ? 'All industries' : opt}
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

      {/* Companies List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
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
            Loading companies…
          </div>
        ) : error ? (
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
            {error}
          </div>
        ) : filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => {
            const name = String(company.name || company.company_name || 'Company');
            const tag = company.tag || company.company_type || company.industry || 'Local';
            const initials = company.initials || initialsFromName(name);
            const reputation = toNumber(company.reputation) ?? 0;
            const recommend = toNumber(company.recommend) ?? 0;
            const rating = company.rating != null ? Number(company.rating).toFixed(1) : '—';
            const manpower = company.manpower_size || company.employees || '—';
            const headquarters = company.headquarters || '—';
            const isVerified = company.is_verified;
            return (
              <div
                key={company.id || name}
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
                  {initials}
                </div>

                {/* Info Column */}
                <div style={{ flex: 1, marginLeft: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {name}
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 99,
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        ...getTagStyles(tag),
                      }}
                    >
                      {tag}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    {company.industry || tag} · {manpower} · {headquarters} {isVerified && <span style={{color: 'var(--accent-green)', marginLeft: 4}}>✔️</span>}
                  </div>
                </div>

                {/* Scores Column */}
                <div style={{ display: 'flex', gap: 32 }}>
                  {/* Reputation */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-blue)' }}>{reputation}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>reputation</span>
                  </div>

                  {/* Recommend */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-green)' }}>{recommend}%</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>recommend</span>
                  </div>
                </div>
              </div>
            )
          })
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
