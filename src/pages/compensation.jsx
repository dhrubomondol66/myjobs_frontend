import { useState } from 'react'
import { ShieldCheck, CheckCircle2 } from 'lucide-react'

const FRINGE = ['No benefits', '৳5k–৳15k', '৳15k–৳30k', '৳30k+']
const BONUS = ['No bonus', '1 festival bonus', '2 festival bonuses', '2 bonuses + performance']
const FAIRNESS = ['Way below market', 'Slightly below', 'Fair', 'Above market', 'Well above market']

const card = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 22px',
}

export default function Compensation({ requireAuth }) {
    const [data, setData] = useState({
        salary: '75000',
        fringe: '৳5k–৳15k',
        allowances: '',
        bonus: '2 festival bonuses',
        fairness: '',
    })
    const [submitted, setSubmitted] = useState(false)

    const answered = [data.salary, data.fringe, data.allowances, data.bonus, data.fairness].filter(Boolean).length
    const progress = Math.round((answered / 5) * 100)

    const set = (k, v) => setData(d => ({ ...d, [k]: v }))

    const handleSubmit = () => {
        if (progress !== 100) return
        const complete = () => setSubmitted(true)
        if (requireAuth) requireAuth(complete)
        else complete()
    }

    if (submitted) {
        return (
            <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 60 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-green-dim)', border: '1px solid rgba(34,201,122,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={28} color="var(--accent-green)" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Compensation data submitted!</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>You earned +15 credits. Your data is aggregated anonymously.</p>
                <button onClick={() => { setSubmitted(false); setData({ salary: '', fringe: '', allowances: '', bonus: '', fairness: '' }) }} style={{
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
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Compensation overview — 5 questions</div>
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

            {/* Q1: Base salary */}
            <div style={card}>
                <QLabel n={1} label="Base salary (monthly, BDT)" />
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

            {/* Q2: Fringe benefits */}
            <div style={card}>
                <QLabel n={2} label="Fringe benefits value (monthly estimate)" />
                <ChipGroup options={FRINGE} value={data.fringe} onChange={v => set('fringe', v)} />
            </div>

            {/* Q3: Other allowances */}
            <div style={card}>
                <QLabel n={3} label="Other allowances (transport, food, mobile)" />
                <input
                    type="number"
                    value={data.allowances}
                    onChange={e => set('allowances', e.target.value)}
                    placeholder="e.g. 10000"
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}
                />
            </div>

            {/* Q4: Bonus */}
            <div style={card}>
                <QLabel n={4} label="Annual bonus structure" />
                <ChipGroup options={BONUS} value={data.bonus} onChange={v => set('bonus', v)} />
            </div>

            {/* Q5: Fairness */}
            <div style={card}>
                <QLabel n={5} label="How fair is your pay vs. market?" />
                <ChipGroup options={FAIRNESS} value={data.fairness} onChange={v => set('fairness', v)} />
            </div>

            <button
                onClick={handleSubmit}
                style={{
                    padding: '13px',
                    borderRadius: 'var(--radius-md)',
                    background: progress === 100 ? 'var(--accent-blue)' : 'var(--bg-card)',
                    color: progress === 100 ? '#fff' : 'var(--text-muted)',
                    fontWeight: 600, fontSize: 14,
                    border: `1px solid ${progress === 100 ? 'transparent' : 'var(--border)'}`,
                    transition: 'all 0.2s',
                    cursor: progress === 100 ? 'pointer' : 'not-allowed',
                    marginBottom: 8,
                }}
            >
                Submit data {progress < 100 ? `(${5 - answered} remaining)` : '· Earn +15 credits'}
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
                const sel = value === opt
                return (
                    <button key={opt} onClick={() => onChange(opt)} style={{
                        padding: '6px 16px', borderRadius: 99,
                        border: `1px solid ${sel ? 'var(--accent-blue)' : 'var(--border)'}`,
                        background: sel ? 'var(--accent-blue-dim)' : 'var(--bg-base)',
                        color: sel ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        fontSize: 13, fontWeight: sel ? 500 : 400,
                        transition: 'all 0.15s',
                    }}>{opt}</button>
                )
            })}
        </div>
    )
}