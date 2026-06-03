import { useState, useEffect } from 'react'
import { ShieldCheck, ChevronDown, Loader2 } from 'lucide-react'
import { createReview } from '../service/companyReviews.js'
import { getCompanies } from '../service/companies.js'

const TYPES = ['Local', 'MNC', 'Startup', 'NGO', 'Government']

const recommendationMap = {
    'Definitely': 'definitely',
    'Probably': 'probably',
    'Neutral': 'neutral',
    'Probably not': 'probably_not',
    'No': 'no',
}

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

// FIX: added onNavigate prop
export default function CompanyReview({ requireAuth, onReviewComplete, onNavigate }) {
    const [companies, setCompanies] = useState([])
    const [loadingCompanies, setLoadingCompanies] = useState(true)
    const [answers, setAnswers] = useState({ q3: 'MNC' })
    const [submitted, setSubmitted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')

    // FIX: removed the stray top-level `await createReview(payload)` and related
    // dead code that was executing outside any function on every render

    useEffect(() => {
        let mounted = true
        async function loadCompanies() {
            setLoadingCompanies(true)
            try {
                const { data } = await getCompanies()
                if (!mounted) return
                const list = (data || []).map(c => ({
                    id: c.id,
                    name: c.name || c.company_name || 'Unknown',
                }))
                setCompanies(list)
                if (list.length > 0) {
                    setAnswers(a => ({ ...a, q1: list[0].name }))
                }
            } catch {
                if (!mounted) return
                setCompanies([])
            } finally {
                if (!mounted) return
                setLoadingCompanies(false)
            }
        }
        loadCompanies()
        return () => { mounted = false }
    }, [])

    const isAnswered = (qId) => {
        const val = answers[qId]
        return val !== undefined && val !== null && val !== ''
    }

    const allQuestionsAnswered = QUESTIONS.every(q => isAnswered(q.id))
    const answered = QUESTIONS.filter(q => isAnswered(q.id)).length
    const progress = Math.round((answered / QUESTIONS.length) * 100)

    const set = (id, val) => setAnswers(a => ({ ...a, [id]: val }))

    const handleSubmit = async (e) => {
        e?.preventDefault?.()

        if (!allQuestionsAnswered) {
            setSubmitError(`Please answer all questions. (${answered}/${QUESTIONS.length} answered)`)
            return
        }

        setSubmitError('')
        setSubmitting(true)

        try {
            const payload = {
                company: answers.q1,
                is_anonymous: true,
                company_type: answers.q3.toLowerCase(),
                brand_value: Number(answers.q2),
                work_environment: Number(answers.q4),
                career_growth: Number(answers.q5),
                work_life_balance: Number(answers.q6),
                management_quality: Number(answers.q7),
                salary_benefits: Number(answers.q8),
                recommendation: recommendationMap[answers.q9],
                overall_experience: Number(answers.q10),
            }

            const hasNaN = Object.entries(payload).some(([, val]) =>
                typeof val === 'number' && isNaN(val)
            )
            if (hasNaN) {
                setSubmitError('Invalid rating values. Please check all questions are answered correctly.')
                setSubmitting(false)
                return
            }

            await createReview(payload)

            // FIX: removed duplicate createReview call and stray code from top level.
            // Now we find the company, store its id and name, and notify the parent to navigate.
            const selectedCompany = companies.find(c => c.name === answers.q1)
            if (selectedCompany) {
                localStorage.setItem('review_company_id', selectedCompany.id)
                localStorage.setItem('review_company_name', selectedCompany.name)
                onReviewComplete(selectedCompany.id)  // tells parent: review done, here's the id
                // FIX: use onNavigate (prop) instead of the undefined onNavigate from nowhere
                onNavigate('compensation')
                return
            }

            // Fallback: if company not found in list (e.g. typed manually), just show success
            setSubmitted(true)
        } catch (err) {
            const message =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                JSON.stringify(err?.response?.data) ||
                err?.message ||
                'Failed to submit review. Please try again.'
            setSubmitError(String(message))
        } finally {
            setSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 60 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-green-dim)', border: '1px solid rgba(34,201,122,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={28} color="var(--accent-green)" />
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Review submitted!</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>You earned +10 credits. Your identity stays completely anonymous.</p>
                <button
                    onClick={() => {
                        setSubmitted(false)
                        setAnswers(companies.length ? { q1: companies[0].name, q3: 'MNC' } : { q3: 'MNC' })
                        setSubmitError('')
                    }}
                    style={{ marginTop: 8, padding: '10px 22px', borderRadius: 'var(--radius-md)', background: 'var(--accent-blue)', color: '#fff', fontWeight: 500, fontSize: 14, border: 'none', cursor: 'pointer' }}
                >
                    Submit another review
                </button>
            </div>
        )
    }

    return (
        <div style={{ padding: 24, maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ ...card }}>
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

            <div style={{ ...card, background: 'rgba(34,201,122,0.08)', border: '1px solid rgba(34,201,122,0.2)', padding: '12px 18px' }}>
                <div style={{ color: 'var(--accent-green)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={14} />
                    Anonymous submission — your name will never be shown
                </div>
            </div>

            {submitError && (
                <div style={{ ...card, borderColor: 'rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.04)', color: '#ef4444', fontSize: 13 }}>
                    {submitError}
                </div>
            )}

            {QUESTIONS.map((q, qi) => (
                <div key={q.id} style={card}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--accent-blue-dim)', color: 'var(--accent-blue)', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>Q{qi + 1}</span>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{q.label}</span>
                    </div>

                    {q.type === 'dropdown' && (
                        <div style={{ position: 'relative' }}>
                            {loadingCompanies ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, padding: '10px 0' }}>
                                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                    Loading companies…
                                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                                </div>
                            ) : companies.length > 0 ? (
                                <>
                                    <select
                                        value={answers[q.id] || ''}
                                        onChange={e => set(q.id, e.target.value)}
                                        style={{ width: '100%', padding: '10px 36px 10px 14px', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 14, appearance: 'none', cursor: 'pointer', outline: 'none' }}
                                    >
                                        {companies.map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
                                    </select>
                                    <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                </>
                            ) : (
                                <input
                                    type="text"
                                    placeholder="Type company name…"
                                    value={answers[q.id] || ''}
                                    onChange={e => set(q.id, e.target.value)}
                                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                                />
                            )}
                        </div>
                    )}

                    {q.type === 'rating' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                            {[1, 2, 3, 4, 5].map(n => {
                                const sel = answers[q.id] === n
                                return (
                                    <button key={n} onClick={() => set(q.id, n)} style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${sel ? 'var(--accent-blue)' : 'var(--border)'}`, background: sel ? 'var(--accent-blue-dim)' : 'var(--bg-base)', color: sel ? 'var(--accent-blue)' : 'var(--text-secondary)', fontWeight: sel ? 600 : 400, fontSize: 14, transition: 'all 0.15s', cursor: 'pointer' }}>{n}</button>
                                )
                            })}
                        </div>
                    )}

                    {q.type === 'chips' && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {q.options.map(opt => {
                                const sel = answers[q.id] === opt
                                return (
                                    <button key={opt} onClick={() => set(q.id, opt)} style={{ padding: '6px 16px', borderRadius: 99, border: `1px solid ${sel ? 'var(--accent-blue)' : 'var(--border)'}`, background: sel ? 'var(--accent-blue-dim)' : 'var(--bg-base)', color: sel ? 'var(--accent-blue)' : 'var(--text-secondary)', fontSize: 13, fontWeight: sel ? 500 : 400, transition: 'all 0.15s', cursor: 'pointer' }}>{opt}</button>
                                )
                            })}
                        </div>
                    )}
                </div>
            ))}

            <button
                onClick={handleSubmit}
                disabled={submitting || !allQuestionsAnswered}
                style={{ padding: '13px', borderRadius: 'var(--radius-md)', background: allQuestionsAnswered ? 'var(--accent-blue)' : 'var(--bg-card)', color: allQuestionsAnswered ? '#fff' : 'var(--text-muted)', fontWeight: 600, fontSize: 14, border: `1px solid ${allQuestionsAnswered ? 'transparent' : 'var(--border)'}`, transition: 'all 0.2s', cursor: allQuestionsAnswered && !submitting ? 'pointer' : 'not-allowed', marginBottom: 8, opacity: submitting ? 0.7 : 1 }}
            >
                {submitting ? 'Submitting…' : allQuestionsAnswered ? 'Submit review' : `Complete form (${answered}/${QUESTIONS.length})`}
            </button>
        </div>
    )
}