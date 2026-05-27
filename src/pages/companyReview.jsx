import { useState, useEffect } from 'react'
import { ShieldCheck, ChevronDown } from 'lucide-react'
import { createReview } from '../api/reviews.js'
import { fetchCompanies } from '../api/companies.js'

const QUESTIONS = [
    { id: 'company', label: 'Which company are you reviewing?', type: 'dropdown' },
    { id: 'brand_value', label: 'Company brand value', type: 'rating' },
    { id: 'work_environment', label: 'Work environment score', type: 'rating' },
    { id: 'career_growth', label: 'Career growth opportunities', type: 'rating' },
    { id: 'salary_range_perception', label: 'Salary & benefits satisfaction', type: 'rating' },
    { id: 'fringe_benefits', label: 'Fringe benefits quality', type: 'rating' },
    { id: 'job_security', label: 'Job security', type: 'rating' },
    { id: 'employee_respect', label: 'Employee respect & management quality', type: 'rating' },
    { id: 'overall_recommendation', label: 'Would you recommend this company?', type: 'chips', options: ['Yes', 'No'] },
]

const card = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 22px',
}

export default function CompanyReview({ requireAuth }) {
    const [companies, setCompanies] = useState([])
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchCompanies()
            .then((data) => {
                const list = (Array.isArray(data) ? data : data.results || [])
                setCompanies(list)
                if (list.length > 0) {
                    setAnswers((a) => ({ ...a, company: list[0].name }))
                }
            })
            .catch(() => {})
    }, [])

    const answered = Object.keys(answers).length
    const progress = Math.round((answered / QUESTIONS.length) * 100)

    const set = (id, val) => setAnswers(a => ({ ...a, [id]: val }))

    const handleSubmit = () => {
        if (progress !== 100) return
        const doSubmit = async () => {
            setSubmitting(true)
            setError('')
            try {
                await createReview({
                    company: answers.company,
                    brand_value: answers.brand_value,
                    work_environment: answers.work_environment,
                    career_growth: answers.career_growth,
                    salary_range_perception: answers.salary_range_perception,
                    fringe_benefits: answers.fringe_benefits,
                    job_security: answers.job_security,
                    employee_respect: answers.employee_respect,
                    overall_recommendation: answers.overall_recommendation === 'Yes',
                    is_anonymous: true,
                })
                setSubmitted(true)
            } catch (err) {
                setError(err.data?.detail || 'Failed to submit review. Please try again.')
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
                    <ShieldCheck size={28} color="var(--accent-green)" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Review submitted!</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>You earned +10 credits. Your identity stays completely anonymous.</p>
                <button onClick={() => { setSubmitted(false); setAnswers(companies.length ? { company: companies[0].name } : {}) }} style={{
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
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Company overview — {QUESTIONS.length} questions</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 14 }}>Your identity stays completely anonymous. Earn +10 credits on submit.</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span>{answered}/{QUESTIONS.length} answered</span>
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

            {error && (
                <div style={{ ...card, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px 18px' }}>
                    <div style={{ color: '#ef4444', fontSize: 13 }}>{error}</div>
                </div>
            )}

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
                                {companies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
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
                disabled={submitting}
                style={{
                    padding: '13px',
                    borderRadius: 'var(--radius-md)',
                    background: progress === 100 ? 'var(--accent-blue)' : 'var(--bg-card)',
                    color: progress === 100 ? '#fff' : 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: 14,
                    border: `1px solid ${progress === 100 ? 'transparent' : 'var(--border)'}`,
                    transition: 'all 0.2s',
                    cursor: progress === 100 && !submitting ? 'pointer' : 'not-allowed',
                    marginBottom: 8,
                }}
            >
                {submitting
                    ? 'Submitting…'
                    : progress < 100
                        ? `Submit review (${QUESTIONS.length - answered} remaining)`
                        : 'Submit review · Earn +10 credits'
                }
            </button>
        </div>
    )
}
