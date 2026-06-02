import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, Users, Building2, BarChart2, Loader2 } from 'lucide-react'
import { getDashboardStats } from '../service/dashboard.js'

const FALLBACK_STATS = [
    { label: 'Total reviews', value: '—', delta: '', icon: BarChart2, color: 'var(--accent-blue)' },
    { label: 'Companies listed', value: '—', delta: '', icon: Building2, color: 'var(--accent-purple)' },
    { label: 'Salary data points', value: '—', delta: '', icon: TrendingUp, color: 'var(--accent-green)' },
    { label: 'Active users', value: '—', delta: '', icon: Users, color: 'var(--accent-amber)' },
]

const BAR_COLORS = ['#3b7ff5', '#8b5cf6', '#22c97a', '#f5a623', '#f5524a', '#06b6d4']

function fmt(n) {
    if (n == null) return '—'
    return Number(n).toLocaleString()
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 2 }}>{label}</div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>৳{payload[0].value.toLocaleString()}</div>
        </div>
    )
}

const card = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 22px',
    boxShadow: 'var(--shadow-card)',
}

export default function Dashboard({ onNavigate }) {
    const [stats, setStats] = useState(FALLBACK_STATS)
    const [topCompanies, setTopCompanies] = useState([])
    const [salaryBenchmarks, setSalaryBenchmarks] = useState([])
    const [industryData, setIndustryData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let mounted = true
        async function load() {
            setLoading(true)
            setError('')
            try {
                const { data } = await getDashboardStats()
                if (!mounted) return

                // Map API response to stat cards
                setStats([
                    {
                        label: 'Total reviews',
                        value: fmt(data.total_reviews),
                        delta: '',
                        icon: BarChart2,
                        color: 'var(--accent-blue)',
                    },
                    {
                        label: 'Companies listed',
                        value: fmt(data.companies_listed),
                        delta: '',
                        icon: Building2,
                        color: 'var(--accent-purple)',
                    },
                    {
                        label: 'Salary data points',
                        value: fmt(data.salary_data_points),
                        delta: '',
                        icon: TrendingUp,
                        color: 'var(--accent-green)',
                    },
                    {
                        label: 'Active users',
                        value: fmt(data.active_users),
                        delta: '',
                        icon: Users,
                        color: 'var(--accent-amber)',
                    },
                ])
                // Top companies
                setTopCompanies(
                    (data.top_rated_companies || []).map(c => ({
                        name: c.name,
                        sub: `${c.industry || ''} · ${c.type || ''}`.replace(' · ', ' · ').trim(),
                        score: c.reviews || 0,
                    }))
                )

                // Salary benchmarks
                setSalaryBenchmarks(
                    (data.salary_benchmarks || []).map(b => ({
                        role: b.job_title,
                        range: `৳${Number(b.min_salary).toLocaleString()} – ৳${Number(b.max_salary).toLocaleString()}`,
                        median: b.max_salary,
                    }))
                )

                // Industry chart
                setIndustryData(
                    (data.average_salary_by_industry || []).map(d => ({
                        industry: d.industry || 'Other',
                        avg: d.average_salary || 0,
                    }))
                )

            } catch (e) {
                if (!mounted) return
                setError('Failed to load dashboard data.')
            } finally {
                if (!mounted) return
                setLoading(false)
            }
        }
        load()
        return () => { mounted = false }
    }, [])

    if (loading) {
        return (
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 300 }}>
                <Loader2 size={28} color="var(--accent-blue)" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading dashboard…</span>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ padding: 24 }}>
                <div style={{ ...card, textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ marginBottom: 8, fontSize: 14 }}>{error}</div>
                    <button
                        onClick={() => onNavigate('login')}
                        style={{
                            padding: '8px 18px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--accent-blue)',
                            color: '#fff',
                            border: 'none',
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        Please login to view the dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                {stats.map(({ label, value, delta, icon: Icon, color }) => (
                    <div key={label} style={card}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{label}</span>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={14} color={color} />
                            </div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>{value}</div>
                        {delta && <div style={{ color: 'var(--accent-green)', fontSize: 12 }}>{delta}</div>}
                    </div>
                ))}
            </div>

            {/* Middle row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Top companies */}
                <div style={card}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 18, color: 'var(--text-primary)' }}>Top-rated companies</div>
                    {topCompanies.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {topCompanies.map(({ name, sub, score }, i) => (
                                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ width: 20, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>#{i + 1}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{sub}</div>
                                    </div>
                                    <div style={{ width: 80, height: 3, background: 'var(--bg-hover)', borderRadius: 99, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.min(score, 100)}%`, background: 'var(--accent-blue)', borderRadius: 99 }} />
                                    </div>
                                    <span style={{ width: 24, textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'var(--accent-blue)' }}>{score}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No company data available yet.</div>
                    )}
                </div>

                {/* Salary benchmarks */}
                <div style={card}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 18 }}>Salary benchmarks (monthly)</div>
                    {salaryBenchmarks.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {salaryBenchmarks.map(({ role, range, median }) => (
                                <div key={role} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 500 }}>{role}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{range}</div>
                                    </div>
                                    <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--accent-green)' }}>৳{(median / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}k</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No salary data available yet.</div>
                    )}
                </div>
            </div>

            {/* Salary histogram */}
            {salaryBenchmarks.length > 0 && (
                <div style={card}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 20 }}>Salary distribution</div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={salaryBenchmarks.slice(0, 6)} barSize={40}>
                            <XAxis dataKey="role" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={v => `৳${v / 1000}k`} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Bar dataKey="median" radius={[4, 4, 0, 0]} fill="var(--accent-blue)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Industry chart */}
            {industryData.length > 0 && (
                <div style={card}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 20 }}>Average salary by industry</div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={industryData} barSize={36}>
                            <XAxis dataKey="industry" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={v => `৳${v / 1000}k`} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                                {industryData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    )
}