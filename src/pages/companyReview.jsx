import { useState } from 'react'
import { ShieldCheck, ChevronDown } from 'lucide-react'

const COMPANIES = ['Grameenphone Ltd.', 'BRAC', 'Dutch-Bangla Bank', 'Robi Axiata', 'Square Group', 'ACI Limited']
const TYPES = ['Local', 'MNC', 'Startup', 'NGO', 'Government']

const QUESTIONS = [
    { id: 'q1', label: 'Which company are you reviewing?', type: 'dropdown' },
    { id: 'q2', label: 'Company brand value', type: 'rating' },
    { id: 'q3', label: 'Type of company', type: 'chips', options: TYPES },
    { id: 'q4', label: 'Work environment score', type: 'rating' },
    { id: 'q5', label: 'Career growth opportunities', type: 'rating' },
    { id: 'q6', label: 'Work-life balance', type: 'rating' },
    { id: 'q7', label: 'Management quality', type: 'rating' },
    { id: 'q8', label: 'Salary & benefits satisfaction', type: 'rating' },
    { id: 'q9', label: 'Would you recommend this company?', type: 'chips', options: ['Definitely', 'Probably', 'Neutral', 'Probably not', 'No'] },
    { id: 'q10', label: 'Overall experience', type: 'rating' },
]

const card = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 22px',
}

export default function CompanyReview({ requireAuth }) {
    const [answers, setAnswers] = useState({ q1: 'Grameenphone Ltd.', q3: 'MNC' })
    const [submitted, setSubmitted] = useState(false)

    const answered = Object.keys(answers).length
    const progress = Math.round((answered / QUESTIONS.length) * 100)

    const set = (id, val) => setAnswers(a => ({ ...a, [id]: val }))

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
                    <ShieldCheck size={28} color="var(--accent-green)" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Review submitted!</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>You earned +10 credits. Your identity stays completely anonymous.</p>
                <button onClick={() => { setSubmitted(false); setAnswers({ q1: 'Grameenphone Ltd.', q3: 'MNC' }) }} style={{
                    marginTop: 8,
                    padding: '10px 22px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-blue)',
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: 14,
                }}>Submit another review</button>
            </div>
        )
    }

    return (
        <div style={{ padding: 24, maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header card */}
            <div style={{ ...card, background: 'var(--bg-card)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Company overview — 10 questions</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 14 }}>Your identity stays completely anonymous. Earn +10 credits on submit.</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span>{answered}/10 answered</span>
                    <span style={{ color: 'var(--accent-blue)' }}>{progress}%</span>
                </div>
                <div style={{ height: 4, background: 'var(--bg-hover)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-blue)', borderRadius: 99, transition: 'width 0.3s ease' }} />
                </div>
            </div>

            {/* Anonymous notice */}
            <div style={{ ...card, background: 'rgba(34,201,122,0.08)', border: '1px solid rgba(34,201,122,0.2)', padding: '12px 18px' }}>
                <div style={{ color: 'var(--accent-green)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={14} />
                    Anonymous submission — your name will never be shown
                </div>
            </div>

            {/* Questions */}
            {QUESTIONS.map((q, qi) => (
                <div key={q.id} style={card}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>Q{qi + 1}</span>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{q.label}</span>
                    </div>

                    {q.type === 'dropdown' && (
                        <div style={{ position: 'relative' }}>
                            <select
                                value={answers[q.id] || ''}
                                onChange={e => set(q.id, e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 36px 10px 14px',
                                    background: 'var(--bg-base)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-primary)',
                                    fontSize: 14,
                                    appearance: 'none',
                                    cursor: 'pointer',
                                    outline: 'none',
                                }}
                            >
                                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        </div>
                    )}

                    {q.type === 'rating' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                            {[1, 2, 3, 4, 5].map(n => {
                                const sel = answers[q.id] === n
                                return (
                                    <button key={n} onClick={() => set(q.id, n)} style={{
                                        width: 40, height: 40,
                                        borderRadius: 8,
                                        border: `1px solid ${sel ? 'var(--accent-blue)' : 'var(--border)'}`,
                                        background: sel ? 'var(--accent-blue-dim)' : 'var(--bg-base)',
                                        color: sel ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                        fontWeight: sel ? 600 : 400,
                                        fontSize: 14,
                                        transition: 'all 0.15s',
                                    }}>{n}</button>
                                )
                            })}
                        </div>
                    )}

                    {q.type === 'chips' && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {q.options.map(opt => {
                                const sel = answers[q.id] === opt
                                return (
                                    <button key={opt} onClick={() => set(q.id, opt)} style={{
                                        padding: '6px 16px',
                                        borderRadius: 99,
                                        border: `1px solid ${sel ? 'var(--accent-blue)' : 'var(--border)'}`,
                                        background: sel ? 'var(--accent-blue-dim)' : 'var(--bg-base)',
                                        color: sel ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                        fontSize: 13,
                                        fontWeight: sel ? 500 : 400,
                                        transition: 'all 0.15s',
                                    }}>{opt}</button>
                                )
                            })}
                        </div>
                    )}
                </div>
            ))}

            {/* Submit */}
            <button
                onClick={handleSubmit}
                style={{
                    padding: '13px',
                    borderRadius: 'var(--radius-md)',
                    background: progress === 100 ? 'var(--accent-blue)' : 'var(--bg-card)',
                    color: progress === 100 ? '#fff' : 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: 14,
                    border: `1px solid ${progress === 100 ? 'transparent' : 'var(--border)'}`,
                    transition: 'all 0.2s',
                    cursor: progress === 100 ? 'pointer' : 'not-allowed',
                    marginBottom: 8,
                }}
            >
                Submit review {progress < 100 ? `(${10 - answered} remaining)` : '· Earn +10 credits'}
            </button>
        </div>
    )
}