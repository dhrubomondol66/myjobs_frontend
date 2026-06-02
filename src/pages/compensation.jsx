import { useState, useEffect } from 'react'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import { createCompensation } from '../service/compensation'
import './compensation.css'

const FRINGE = [
    { label: 'No benefits', value: 'NO_BENEFITS' },
    { label: '৳5k–৳15k', value: '5K_15K' },
    { label: '৳15k–৳30k', value: '15K_30K' },
    { label: '৳30k+', value: '30K_PLUS' },
]
const BONUS = [
    { label: 'No bonus', value: 'NO' },
    { label: '1 festival bonus', value: 'ONE' },
    { label: '2 festival bonuses', value: 'TWO' },
    { label: '2 bonuses + performance', value: 'TWO_PLUS' },
]
const FAIRNESS = ['Way below market', 'Slightly below', 'Fair', 'Above market', 'Well above market']

export default function Compensation({ requireAuth, hasReviewed, onNavigate }) {
    const [data, setData] = useState({
        company: '',        // will be set as Number from localStorage
        job_title: '',
        department: '',
        salary: '',
        fringe: '',
        allowances: '',
        bonus: '',
        fairness: '',
        year: new Date().getFullYear(),
        is_anonymous: true,
    })

    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const companyName = localStorage.getItem('review_company_name')
        const companyId = localStorage.getItem('review_company_id')
        console.log("🔍 Review data in localStorage:")
        console.log("   - review_company_name:", companyName, typeof companyName)
        console.log("   - review_company_id:", companyId, typeof companyId)
        
        if (companyName && typeof companyName === 'string' && companyName.trim()) {
            console.log("✅ Setting company to:", companyName)
            setData(prev => ({ ...prev, company: companyName.trim() }))
        } else {
            console.warn("⚠️ No valid company name found in localStorage")
        }
    }, [])

    // If user hasn't submitted a review, show message
    if (!hasReviewed) {
        return (
            <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, marginTop: 60 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 32 }}>⚠️</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Submit a review first</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5 }}>You need to submit a company review before you can submit compensation data. This helps us verify the authenticity of the information.</p>
                </div>
                <button
                    onClick={() => onNavigate('company-review')}
                    style={{ 
                        padding: '12px 28px', 
                        borderRadius: 'var(--radius-md)', 
                        background: 'var(--accent-blue)', 
                        color: '#fff', 
                        fontWeight: 500, 
                        fontSize: 14, 
                        border: 'none', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}
                >
                    <ArrowLeft size={16} />
                    Go to review
                </button>
            </div>
        )
    }

    // FIX: progress counts filled fields correctly.
    // 'company', 'year', and 'is_anonymous' are always set so they always count.
    // The user-facing fields are: job_title, department, salary, fringe, allowances, bonus, fairness = 7 fields
    // Total tracked = 10 (same as before)
    const isFieldFilled = (k, v) => {
        return v !== '' && v !== null && v !== undefined
    }

    const answered = Object.entries(data).filter(([k, v]) => isFieldFilled(k, v)).length
    const progress = Math.round((answered / 10) * 100)

    const set = (k, v) => setData(d => ({ ...d, [k]: v }))

    const handleSubmit = async () => {
        // FIX: block submission if review hasn't been done
        if (!hasReviewed) return
        if (progress !== 100) return

        const submitData = async () => {
            setLoading(true)
            setError(null)
            try {
                // Validate company is a string
                if (typeof data.company !== 'string' || !data.company.trim()) {
                    setError('Company name not properly loaded. Please go back to review page and try again.')
                    setLoading(false)
                    return
                }
                
                const payload = {
                    company: String(data.company).trim(),  // Company name as string (e.g., "Grameenphone")
                    job_title: data.job_title,
                    department: data.department,
                    base_salary: Number(data.salary),
                    fringe_benefits_value: String(data.fringe),  // String code: "NO_BENEFITS", "5K_15K", etc.
                    annual_bonus_structure: String(data.bonus),  // String code: "NO", "ONE", "TWO", etc.
                    market_fairness_rating: Number(data.fairness),  // 1-5
                    other_allowances: Number(data.allowances) || 0,
                    year: data.year,
                    is_anonymous: data.is_anonymous,
                }
                console.log("📋 Validation - Company type:", typeof data.company, "Value:", data.company)
                console.log("📋 Validation - Bonus type:", typeof data.bonus, "Value:", data.bonus)
                console.log("📋 Validation - Fringe type:", typeof data.fringe, "Value:", data.fringe)
                console.log("📋 Final Compensation payload:", JSON.stringify(payload, null, 2))
                await createCompensation(payload)
                localStorage.removeItem('review_company_id')
                localStorage.removeItem('review_company_name')
                setSubmitted(true)
            } catch (err) {
                const errData = err.response?.data
                if (errData && typeof errData === 'object') {
                    const messages = Object.entries(errData)
                        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
                        .join(' | ')
                    setError(messages)
                } else {
                    setError(String(errData || 'Submission failed'))
                }
            } finally {
                setLoading(false)
            }
        }

        if (requireAuth) requireAuth(submitData)
        else submitData()
    }

    if (submitted) {
        return (
            <div className="success-container">
                <div className="success-icon">
                    <CheckCircle2 size={28} color="var(--accent-green)" />
                </div>
                <h2 className="success-title">Compensation data submitted!</h2>
                <p className="success-message">You earned +15 credits. Your data is aggregated anonymously.</p>
                <button
                    onClick={() => {
                        setSubmitted(false)
                        setData({
                            company: '',
                            job_title: '',
                            department: '',
                            salary: '',
                            fringe: '',
                            allowances: '',
                            bonus: '',
                            fairness: '',
                            year: new Date().getFullYear(),
                            is_anonymous: true,
                        })
                    }}
                    className="success-button"
                >
                    Submit again
                </button>
            </div>
        )
    }

    return (
        <div className="compensation-container">
            {error && (
                <div className="compensation-card error-notice">
                    <div className="error-notice-text">{error}</div>
                </div>
            )}

            {/* FIX: show company id as read-only info, not an editable text input.
                The company was pre-filled from the review flow via localStorage.
                If it's missing, that means no review was submitted — the warning below handles it. */}
            {data.company ? (
                <div className="compensation-card">
                    <div className="form-label">
                        <span className="question-number">Info</span>
                        <span className="form-label-text">Company</span>
                    </div>
                    <div style={{
                        padding: '10px 14px',
                        borderRadius: '5px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-container)',
                        color: 'var(--text-secondary)',
                        fontSize: 14,
                        opacity: 0.8,
                    }}>
                        Linked from your review ✓
                    </div>
                </div>
            ) : null}

            <div className="compensation-card">
                <div className="form-label"><span className="question-number">Info</span><span className="form-label-text">Job Title</span></div>
                <input
                    style={{ borderRadius: '5px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-container)' }}
                    className="text-input"
                    type="text"
                    value={data.job_title}
                    onChange={e => set('job_title', e.target.value)}
                    placeholder="e.g. Senior Developer"
                />
            </div>

            <div className="compensation-card">
                <div className="form-label"><span className="question-number">Info</span><span className="form-label-text">Department</span></div>
                <input
                    style={{ borderRadius: '5px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-container)' }}
                    className="text-input"
                    type="text"
                    value={data.department}
                    onChange={e => set('department', e.target.value)}
                    placeholder="e.g. Engineering"
                />
            </div>

            <div className="compensation-card">
                <div className="form-label"><span className="question-number">Q1</span><span className="form-label-text">Base salary (monthly, BDT)</span></div>
                <div className="input-group">
                    <span className="input-prefix">৳</span>
                    <input
                        style={{ borderRadius: '5px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-container)' }}
                        className="text-input"
                        type="number"
                        value={data.salary}
                        onChange={e => set('salary', e.target.value)}
                        placeholder="e.g. 75000"
                    />
                </div>
            </div>

            <div className="compensation-card">
                <div className="form-label"><span className="question-number">Q2</span><span className="form-label-text">Fringe benefits value (monthly estimate)</span></div>
                <div className="chip-group">
                    {FRINGE.map(f => (
                        <button
                            key={f.label}
                            className={`chip ${data.fringe === f.value ? 'active' : ''}`}
                            onClick={() => set('fringe', f.value)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="compensation-card">
                <div className="form-label"><span className="question-number">Q3</span><span className="form-label-text">Other allowances (transport, food, mobile)</span></div>
                <input
                    style={{ borderRadius: '5px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-container)' }}
                    className="text-input"
                    type="number"
                    value={data.allowances}
                    onChange={e => set('allowances', e.target.value)}
                    placeholder="e.g. 10000"
                />
            </div>

            <div className="compensation-card">
                <div className="form-label"><span className="question-number">Q4</span><span className="form-label-text">Annual bonus structure</span></div>
                <div className="chip-group">
                    {BONUS.map(b => (
                        <button
                            key={b.label}
                            className={`chip ${data.bonus === b.value ? 'active' : ''}`}
                            onClick={() => set('bonus', b.value)}
                        >
                            {b.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="compensation-card">
                <div className="form-label"><span className="question-number">Q5</span><span className="form-label-text">How fair is your pay vs. market?</span></div>
                <div className="chip-group">
                    {FAIRNESS.map((f, idx) => (
                        <button
                            key={f}
                            className={`chip ${data.fairness === idx + 1 ? 'active' : ''}`}
                            onClick={() => set('fairness', idx + 1)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                {progress}% complete • {10 - answered} fields remaining
            </div>

            {/* FIX: warning banner when no review submitted yet */}
            {!hasReviewed && (
                <div style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(251,191,36,0.08)',
                    border: '1px solid rgba(251,191,36,0.3)',
                    color: '#f59e0b',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                }}>
                    Please submit a company review first before adding compensation data.
                    <button
                        onClick={() => onNavigate('companyReview')}
                        style={{
                            marginLeft: 'auto',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-sm)',
                            background: '#f59e0b',
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Go review →
                    </button>
                </div>
            )}

            {/* FIX: only show submit when reviewed AND form is complete */}
            {hasReviewed && progress === 100 && (
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="submit-button enabled"
                    style={{ cursor: loading ? 'wait' : 'pointer' }}
                >
                    {loading ? 'Submitting...' : 'Submit · Earn +15 credits'}
                </button>
            )}
        </div>
    )
}