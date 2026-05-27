import { useState, useEffect } from 'react'
import { ShieldCheck, CheckCircle2 } from 'lucide-react'
import { createCompensation } from '../api/compensation.js'
import { fetchCompanies } from '../api/companies.js'

const FRINGE = [
    { label: 'No benefits', value: 'NONE' },
    { label: '৳5k–৳15k', value: '5K_15K' },
    { label: '৳15k–৳30k', value: '15K_30K' },
    { label: '৳30k+', value: '30K_PLUS' },
]
const BONUS = [
    { label: 'No bonus', value: 'NONE' },
    { label: '1 festival bonus', value: 'ONE' },
    { label: '2 festival bonuses', value: 'TWO' },
    { label: '2 bonuses + performance', value: 'TWO_PERFORMANCE' },
]
const FAIRNESS = [
    { label: 'Way below market', value: 1 },
    { label: 'Slightly below', value: 2 },
    { label: 'Fair', value: 3 },
    { label: 'Above market', value: 4 },
    { label: 'Well above market', value: 5 },
]

const card = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 22px',
}

export default function Compensation({ requireAuth }) {
    const [companies, setCompanies] = useState([])
    const [data, setData] = useState({
        company: '',
        job_title: '',
        department: '',
        salary: '',
        fringe: '',
        allowances: '',
        bonus: '',
        fairness: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchCompanies()
            .then((res) => {
                const list = (Array.isArray(res) ? res : res.results || [])
                setCompanies(list)
                if (list.length > 0) {
                    setData((d) => ({ ...d, company: String(list[0].id) }))
                }
            })
            .catch(() => {})
    }, [])

    const fields = [data.company, data.job_title, data.department, data.salary, data.fringe, data.allowances, data.bonus, data.fairness]
    const answered = fields.filter(Boolean).length
    const total = fields.length
    const progress = Math.round((answered / total) * 100)

    const set = (k, v) => setData(d => ({ ...d, [k]: v }))

    const handleSubmit = () => {
        if (progress !== 100) return
        const doSubmit = async () => {
            setSubmitting(true)
            setError('')
            try {
                await createCompensation({
                    company: Number(data.company),
                    job_title: data.job_title,
                    department: data.department,
                    base_salary: data.salary,
                    fringe_benefits_value: data.fringe,
                    other_allowances: data.allowances || '0',
                    bonus_amount: data.bonus,
                    market_fairness_rating: data.fairness,
                    is_anonymous: true,
                    year: new Date().getFullYear(),
                })
                setSubmitted(true)
            } catch (err) {
                setError(err.data?.detail || 'Failed to submit compensation data. Please try again.')
            } finally {
                setSubmitting(false)
            }
        }
        if (requireAuth) requireAuth(doSubmit)
        else doSubmit()
    }

    if (submitted) {
        return (
            <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 60 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-green-dim)', border: '1px solid rgba(34,201,122,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={28} color="var(--accent-green)" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Compensation data submitted!</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>You earned +15 credits. Your data is aggregated anonymously.</p>
                <button onClick={() => { setSubmitted(false); setData({ company: companies.length ? String(companies[0].id) : '', job_title: '', department: '', salary: '', fringe: '', allowances: '', bonus: '', fairness: '' }) }} style={{
                    marginTop: 8, padding: '10px 22px', borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-blue)', color: '#fff', fontWeight: 500, fontSize: 14,
                }}>Submit again</button>
            </div>
        )
    }

    return (
        <div style={{ padding: 24, maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header */}
            <div style={card}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Compensation overview — {total} questions</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 14 }}>Share salary data to unlock full benchmarks. Earn +15 credits.</div>
                <div style={{ height: 4, background: 'var(--bg-hover)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-green)', borderRadius: 99, transition: 'width 0.3s ease' }} />
                </div>
            </div>

            {/* Privacy notice */}
            <div style={{ ...card, background: 'rgba(34,201,122,0.08)', border: '1px solid rgba(34,201,122,0.2)', padding: '12px 18px' }}>
                <div style={{ color: 'var(--accent-green)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={14} />
                    Salary data is aggregated and anonymized — never shown individually
                </div>
            </div>

            {error && (
                <div style={{ ...card, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px 18px' }}>
                    <div style={{ color: '#ef4444', fontSize: 13 }}>{error}</div>
                </div>
            )}

            {/* Q1: Company */}
            <div style={card}>
                <QLabel n={1} label="Company" />
                <select
                    value={data.company}
                    onChange={e => set('company', e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                >
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            {/* Q2: Job title */}
            <div style={card}>
                <QLabel n={2} label="Job title" />
                <input
                    type="text"
                    value={data.job_title}
                    onChange={e => set('job_title', e.target.value)}
                    placeholder="e.g. Software Engineer"
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
            </div>

            {/* Q3: Department */}
            <div style={card}>
                <QLabel n={3} label="Department" />
                <input
                    type="text"
                    value={data.department}
                    onChange={e => set('department', e.target.value)}
                    placeholder="e.g. Engineering"
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
            </div>

            {/* Q4: Base salary */}
            <div style={card}>
                <QLabel n={4} label="Base salary (monthly, BDT)" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                    <span style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: 14, borderRight: '1px solid var(--border)', background: 'var(--bg-surface)' }}>৳</span>
                    <input
                        type="number"
                        value={data.salary}
                        onChange={e => set('salary', e.target.value)}
                        placeholder="e.g. 75000"
                        style={{ flex: 1, padding: '10px 14px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                    />
                </div>
            </div>

            {/* Q5: Fringe benefits */}
            <div style={card}>
                <QLabel n={5} label="Fringe benefits value (monthly estimate)" />
                <ChipGroup options={FRINGE} value={data.fringe} onChange={v => set('fringe', v)} />
            </div>

            {/* Q6: Other allowances */}
            <div style={card}>
                <QLabel n={6} label="Other allowances (transport, food, mobile)" />
                <input
                    type="number"
                    value={data.allowances}
                    onChange={e => set('allowances', e.target.value)}
                    placeholder="e.g. 10000"
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
            </div>

            {/* Q7: Bonus */}
            <div style={card}>
                <QLabel n={7} label="Annual bonus structure" />
                <ChipGroup options={BONUS} value={data.bonus} onChange={v => set('bonus', v)} />
            </div>

            {/* Q8: Fairness */}
            <div style={card}>
                <QLabel n={8} label="How fair is your pay vs. market?" />
                <ChipGroup options={FAIRNESS} value={data.fairness} onChange={v => set('fairness', v)} />
            </div>

            <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                    padding: '13px',
                    borderRadius: 'var(--radius-md)',
                    background: progress === 100 ? 'var(--accent-blue)' : 'var(--bg-card)',
                    color: progress === 100 ? '#fff' : 'var(--text-muted)',
                    fontWeight: 600, fontSize: 14,
                    border: `1px solid ${progress === 100 ? 'transparent' : 'var(--border)'}`,
                    transition: 'all 0.2s',
                    cursor: progress === 100 && !submitting ? 'pointer' : 'not-allowed',
                    marginBottom: 8,
                }}
            >
                {submitting
                    ? 'Submitting…'
                    : progress < 100
                        ? `Submit data (${total - answered} remaining)`
                        : 'Submit data · Earn +15 credits'
                }
            </button>
        </div>
    )
}

function QLabel({ n, label }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>Q{n}</span>
            <span style={{ fontWeight: 500, fontSize: 14 }}>{label}</span>
        </div>
    )
}

function ChipGroup({ options, value, onChange }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {options.map(opt => {
                const optValue = typeof opt === 'object' ? opt.value : opt
                const optLabel = typeof opt === 'object' ? opt.label : opt
                const sel = value === optValue
                return (
                    <button key={optValue} onClick={() => onChange(optValue)} style={{
                        padding: '6px 16px', borderRadius: 99,
                        border: `1px solid ${sel ? 'var(--accent-blue)' : 'var(--border)'}`,
                        background: sel ? 'var(--accent-blue-dim)' : 'var(--bg-base)',
                        color: sel ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        fontSize: 13, fontWeight: sel ? 500 : 400,
                        transition: 'all 0.15s',
                    }}>{optLabel}</button>
                )
            })}
        </div>
    )
}
