import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, Users, Building2, BarChart2 } from 'lucide-react'

const stats = [
    { label: 'Total reviews', value: '2,847', delta: '↑ 12% this month', icon: BarChart2, color: 'var(--accent-blue)' },
    { label: 'Companies listed', value: '412', delta: '↑ 8 this week', icon: Building2, color: 'var(--accent-purple)' },
    { label: 'Salary data points', value: '1,193', delta: '↑ 34 this week', icon: TrendingUp, color: 'var(--accent-green)' },
    { label: 'Active users', value: '5,621', delta: '↑ 3% this week', icon: Users, color: 'var(--accent-amber)' },
]

const topCompanies = [
    { name: 'Grameenphone Ltd.', sub: 'Telecom · MNC', score: 88 },
    { name: 'BRAC', sub: 'NGO · National', score: 83 },
    { name: 'Dutch-Bangla Bank', sub: 'Banking · Local', score: 79 },
    { name: 'Robi Axiata', sub: 'Telecom · MNC', score: 76 },
    { name: 'Square Group', sub: 'Conglomerate', score: 74 },
]

const salaryBenchmarks = [
    { role: 'Software engineer', range: '±40k–±1,20k', median: 72000 },
    { role: 'HR manager', range: '±35k–±90k', median: 55000 },
    { role: 'Marketing executive', range: '±25k–±70k', median: 42000 },
    { role: 'Finance analyst', range: '±30k–±85k', median: 58000 },
    { role: 'Product manager', range: '±60k–±1,50k', median: 95000 },
]

const industryData = [
    { industry: 'Tech', avg: 72000 },
    { industry: 'Banking', avg: 63000 },
    { industry: 'Telecom', avg: 58000 },
    { industry: 'FMCG', avg: 45000 },
    { industry: 'NGO', avg: 38000 },
    { industry: 'Garments', avg: 35000 },
]

const BAR_COLORS = ['#3b7ff5', '#8b5cf6', '#22c97a', '#f5a623', '#f5524a', '#06b6d4']

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
                        <div style={{ color: 'var(--accent-green)', fontSize: 12 }}>{delta}</div>
                    </div>
                ))}
            </div>

            {/* Middle row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Top companies */}
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

                {/* Salary benchmarks */}
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
            </div>

            {/* Industry chart */}
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
        </div>
    )
}