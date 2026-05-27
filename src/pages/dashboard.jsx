import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, Users, Building2, BarChart2 } from 'lucide-react'
import { fetchDashboardSummary } from '../api/analytics.js'
import { readAuthenticated } from '../auth/authStorage.js'

const FALLBACK_STATS = [
    { label: 'Total reviews', value: '—', delta: '', icon: BarChart2, color: 'var(--accent-blue)' },
    { label: 'Companies listed', value: '—', delta: '', icon: Building2, color: 'var(--accent-purple)' },
    { label: 'Salary data points', value: '—', delta: '', icon: TrendingUp, color: 'var(--accent-green)' },
    { label: 'Active users', value: '—', delta: '', icon: Users, color: 'var(--accent-amber)' },
]

const BAR_COLORS = ['#3b7ff5', '#8b5cf6', '#22c97a', '#f5a623', '#f5524a', '#06b6d4']

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 2 }}>{label}</div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>৳{Number(payload[0].value).toLocaleString()}</div>
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

export default function Dashboard() {
    const isLoggedIn = readAuthenticated()
    const [stats, setStats] = useState(FALLBACK_STATS)
    const [topCompanies, setTopCompanies] = useState([])
    const [salaryBenchmarks, setSalaryBenchmarks] = useState([])
    const [industryData, setIndustryData] = useState([])
    const [loading, setLoading] = useState(isLoggedIn)

    useEffect(() => {
        if (!isLoggedIn) return
        let cancelled = false
        fetchDashboardSummary()
            .then((data) => {
                if (cancelled) return
                setStats([
                    { label: 'Total reviews', value: Number(data.total_reviews).toLocaleString(), delta: '', icon: BarChart2, color: 'var(--accent-blue)' },
                    { label: 'Companies listed', value: Number(data.companies_listed).toLocaleString(), delta: '', icon: Building2, color: 'var(--accent-purple)' },
                    { label: 'Salary data points', value: Number(data.salary_data_points).toLocaleString(), delta: '', icon: TrendingUp, color: 'var(--accent-green)' },
                    { label: 'Active users', value: Number(data.active_users).toLocaleString(), delta: '', icon: Users, color: 'var(--accent-amber)' },
                ])
                setTopCompanies(
                    (data.top_rated_companies || []).map((c, i) => ({
                        name: c.name,
                        sub: `${c.industry} · ${c.type}`,
                        score: Math.max(0, 100 - i * 5),
                    }))
                )
                setSalaryBenchmarks(
                    (data.salary_benchmarks || []).map((sb) => ({
                        role: sb.job_title,
                        range: `৳${Number(sb.min_salary).toLocaleString()}–৳${Number(sb.max_salary).toLocaleString()}`,
                        median: Math.round((Number(sb.min_salary) + Number(sb.max_salary)) / 2),
                    }))
                )
                setIndustryData(
                    (data.average_salary_by_industry || []).map((item) => ({
                        industry: item.industry,
                        avg: Math.round(Number(item.average_salary)),
                    }))
                )
            })
            .catch(() => {})
            .finally(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
    }, [isLoggedIn])

    return (
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {loading && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40, fontSize: 14 }}>
                    Loading dashboard data…
                </div>
            )}

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
            {(topCompanies.length > 0 || salaryBenchmarks.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {/* Top companies */}
                    {topCompanies.length > 0 && (
                        <div style={card}>
                            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 18, color: 'var(--text-primary)' }}>Top-rated companies</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {topCompanies.map(({ name, sub, score }, i) => (
                                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{ width: 20, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>#{i + 1}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{sub}</div>
                                        </div>
                                        <div style={{ width: 80, height: 3, background: 'var(--bg-hover)', borderRadius: 99, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${score}%`, background: 'var(--accent-blue)', borderRadius: 99 }} />
                                        </div>
                                        <span style={{ width: 24, textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'var(--accent-blue)' }}>{score}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Salary benchmarks */}
                    {salaryBenchmarks.length > 0 && (
                        <div style={card}>
                            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 18 }}>Salary benchmarks (monthly)</div>
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
                        </div>
                    )}
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
