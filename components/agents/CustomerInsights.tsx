'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
    Sparkles,
    MessageSquare,
    ShieldAlert,
    Heart,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    Zap,
    Gift,
    BarChart3,
    User,
    Loader2
} from 'lucide-react'

interface InsightResult {
    sentiment: 'Positive' | 'Neutral' | 'Negative'
    sentiment_score: number
    severity_level: 'Low' | 'Medium' | 'High'
    churn_risk: 'Low' | 'Medium' | 'High'
    complaint_category: string
    response_tone: string
    compensation_suggestion: string
    email_reply: {
        subject: string
        body: string
    }
    long_term_improvement: string
    business_risk_impact: 'Low' | 'Moderate' | 'High'
}

export function CustomerInsights() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<InsightResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [emailError, setEmailError] = useState<{ message: string, details?: string } | null>(null)
    const [isSending, setIsSending] = useState(false)
    const [sendSuccess, setSendSuccess] = useState(false)

    const [formData, setFormData] = useState({
        business_name: '',
        category: 'Electronics',
        customer_name: '',
        customer_email: '',
        customer_message: '',
        revenue_trend: 'Stable',
        customer_satisfaction: 'Medium',
        complaint_frequency: 'Low'
    })

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const isEmailValid = validateEmail(formData.customer_email)

    const sendEmail = async (to: string, subject: string, body: string) => {
        setIsSending(true)
        setSendSuccess(false)
        setEmailError(null)
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, subject, body })
            })

            const data = await response.json()

            if (!response.ok) {
                setEmailError({
                    message: data.error || 'Send failed',
                    details: data.details
                })
                throw new Error(data.error || 'Send failed')
            }

            setSendSuccess(true)
            setTimeout(() => setSendSuccess(false), 5000)
            return true
        } catch (err) {
            console.error('Email send failed:', err)
            return false
        } finally {
            setIsSending(false)
        }
    }

    const analyzeInsights = async () => {
        if (!formData.customer_message.trim() || !isEmailValid) return
        setLoading(true)
        setError(null)
        setResult(null)
        setEmailError(null) // Clear previous email errors on new analysis
        try {
            const response = await fetch('/api/agents/customer-insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Analysis failed')

            setResult(data)

            // INSTANT AUTOMATIC EXECUTION
            if (data.email_reply) {
                sendEmail(formData.customer_email, data.email_reply.subject, data.email_reply.body)
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setLoading(false)
        }
    }

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            case 'Medium':
            case 'Moderate': return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
            case 'High':
            case 'Risky': return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
            default: return 'text-white/40'
        }
    }

    const getSentimentIcon = (sentiment: string) => {
        switch (sentiment) {
            case 'Positive': return <Heart className="text-emerald-400" size={24} />
            case 'Negative': return <ShieldAlert className="text-rose-400" size={24} />
            default: return <MessageSquare className="text-blue-400" size={24} />
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-white/5">
                <div>
                    <h1 className="text-3xl font-black text-[var(--text-primary)]">Sentiment Intelligence</h1>
                    <p className="text-[var(--text-secondary)] mt-1 uppercase tracking-[0.15em] text-[10px] font-bold">Autonomous Reputation Management & Brand Protection</p>
                </div>
            </div>

            {/* About the Service Section - Relocated to Top */}
            <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-blue-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative space-y-4 p-6 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-blue-500/30 transition-all h-full">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Zap size={20} />
                            </div>
                            <h3 className="font-bold text-[var(--text-primary)] uppercase tracking-widest text-[10px]">Instant Resolution</h3>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                Automatically acknowledges and addresses customer concerns within milliseconds of submission.
                            </p>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-emerald-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative space-y-4 p-6 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-emerald-500/30 transition-all h-full">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <ShieldAlert size={20} />
                            </div>
                            <h3 className="font-bold text-[var(--text-primary)] uppercase tracking-widest text-[10px]">Risk Mitigation</h3>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                Detects high-severity feedback and suggests strategic revenue protection measures.
                            </p>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-purple-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative space-y-4 p-6 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-purple-500/30 transition-all h-full">
                            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <TrendingUp size={20} />
                            </div>
                            <h3 className="font-bold text-[var(--text-primary)] uppercase tracking-widest text-[10px]">Operational Scale</h3>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                Built for scale, ensuring consistent professional quality across all customer touchpoints.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border border-blue-500/10">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest">Autonomous Workflow</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="text-blue-500 font-black text-[10px] uppercase tracking-widest">01. Deep Analysis</div>
                                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">Deciphers emotional tone and churn probability from raw text.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-blue-500 font-black text-[10px] uppercase tracking-widest">02. Auto-Dispatch</div>
                                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">Generates and dispatches a context-aware professional response.</p>
                                </div>
                            </div>
                        </div>
                        <div className="h-px w-full md:h-12 md:w-px bg-[var(--border-color)]" />
                        <div className="flex-1">
                            <blockquote className="text-[var(--text-secondary)] italic text-xs leading-relaxed max-w-sm">
                                &quot;Bridging human sentiment with automated efficiency to ensure every voice is prioritized.&quot;
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Panel */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-6">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur opacity-30" />
                        <div className="relative p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl space-y-6">
                            <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
                                <User className="text-blue-500" size={20} />
                                <h2 className="font-bold text-lg text-[var(--text-primary)]">Customer & Context</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1.5 block">Customer Details</label>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Customer Name"
                                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            value={formData.customer_name}
                                            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                        />
                                        <div className="relative">
                                            <input
                                                type="email"
                                                placeholder="Email Address (Required for Auto-Reply)"
                                                className={`w-full bg-[var(--card-bg)] border rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 transition-all ${formData.customer_email && !isEmailValid
                                                    ? 'border-rose-500/50 focus:ring-rose-500/30'
                                                    : 'border-[var(--border-color)] focus:ring-blue-500/50'
                                                    }`}
                                                value={formData.customer_email}
                                                required
                                                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                                            />
                                            {formData.customer_email && !isEmailValid && (
                                                <span className="absolute right-3 top-3.5 text-[10px] text-rose-400 font-bold uppercase">Invalid</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1.5 block">Business Context</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                        <input
                                            type="text"
                                            placeholder="Store Name"
                                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            value={formData.business_name}
                                            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                        />
                                        <select
                                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="Electronics" className="bg-[#0c0c0c]">Electronics</option>
                                            <option value="Food & Bev" className="bg-[#0c0c0c]">Food & Bev</option>
                                            <option value="Clothing" className="bg-[#0c0c0c]">Clothing</option>
                                            <option value="Services" className="bg-[#0c0c0c]">Services</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            value={formData.revenue_trend}
                                            onChange={(e) => setFormData({ ...formData, revenue_trend: e.target.value })}
                                        >
                                            <option value="Increasing" className="bg-[#0c0c0c]">Revenue: Increasing</option>
                                            <option value="Stable" className="bg-[#0c0c0c]">Revenue: Stable</option>
                                            <option value="Decreasing" className="bg-[#0c0c0c]">Revenue: Decreasing</option>
                                        </select>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                            value={formData.complaint_frequency}
                                            onChange={(e) => setFormData({ ...formData, complaint_frequency: e.target.value })}
                                        >
                                            <option value="Low" className="bg-[#0c0c0c]">Complaints: Low</option>
                                            <option value="Medium" className="bg-[#0c0c0c]">Complaints: Medium</option>
                                            <option value="High" className="bg-[#0c0c0c]">Complaints: High</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1.5 block">Feedback Submission</label>
                                <textarea
                                    value={formData.customer_message}
                                    onChange={(e) => setFormData({ ...formData, customer_message: e.target.value })}
                                    placeholder="Paste customer message here..."
                                    className="w-full h-32 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] opacity-50 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none text-sm leading-relaxed"
                                />
                            </div>

                            <Button
                                onClick={analyzeInsights}
                                disabled={loading || !formData.customer_message.trim() || !isEmailValid}
                                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 group uppercase tracking-widest text-[10px]"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" size={16} /> Processing...
                                    </div>
                                ) : (
                                    <>
                                        Analyze & Dispatch Reply <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-6">
                    {result ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            {/* Top Stats Bar */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl flex items-center gap-4">
                                    {getSentimentIcon(result.sentiment)}
                                    <div>
                                        <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Sentiment</div>
                                        <div className="font-black text-[var(--text-primary)]">{result.sentiment} ({result.sentiment_score}%)</div>
                                    </div>
                                </div>
                                <div className={`p-5 rounded-2xl border flex items-center gap-4 ${getRiskColor(result.severity_level)}`}>
                                    <AlertCircle size={24} />
                                    <div>
                                        <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Severity</div>
                                        <div className="font-black">{result.severity_level} Level</div>
                                    </div>
                                </div>
                                <div className={`p-5 rounded-2xl border flex items-center gap-4 ${getRiskColor(result.churn_risk)}`}>
                                    <TrendingUp size={24} />
                                    <div>
                                        <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Churn Risk</div>
                                        <div className="font-black">{result.churn_risk} Risk</div>
                                    </div>
                                </div>
                            </div>

                            {/* Automatic Status Shield */}
                            <div className="relative group">
                                <div className={`absolute -inset-0.5 rounded-[2rem] blur opacity-40 ${emailError ? 'bg-amber-500/30' : 'bg-gradient-to-r from-blue-500/20 to-emerald-500/30'}`} />
                                <div className="relative p-10 rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl flex flex-col items-center text-center space-y-6">
                                    <div className={`h-24 w-24 rounded-full flex items-center justify-center border shadow-lg ${emailError
                                        ? 'bg-amber-500/10 border-amber-500/20 shadow-amber-500/10'
                                        : 'bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/20'
                                        }`}>
                                        {isSending ? (
                                            <Loader2 className="animate-spin text-blue-500" size={48} />
                                        ) : emailError ? (
                                            <AlertCircle className="text-amber-500" size={48} />
                                        ) : (
                                            <CheckCircle2 className="text-emerald-500 animate-in zoom-in duration-500" size={48} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
                                            {isSending ? 'Processing Dispatch...' : emailError ? 'Action Required' : 'Resolution Acknowledged'}
                                        </h3>
                                        {emailError ? (
                                            <div className="mt-3 space-y-2">
                                                <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto font-medium">
                                                    {emailError.message === 'Verification Required'
                                                        ? 'Testing mode active: Please check your Gmail App Password configuration in environment variables.'
                                                        : emailError.message}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-[var(--text-secondary)] mt-3 max-w-sm mx-auto text-sm leading-relaxed font-medium italic">
                                                A brand-consistent resolution message has been dispatched to <strong>{formData.customer_email}</strong>.
                                            </p>
                                        )}
                                    </div>
                                    {sendSuccess && !emailError && (
                                        <div className="px-6 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2">
                                            Operational Success: Delivery Confirmed
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Mitigation Footer */}
                            <div className="mt-8 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4 p-5 rounded-3xl bg-amber-500/5 border border-amber-500/10">
                                    <Gift className="text-amber-400 mt-1 shrink-0" size={24} />
                                    <div>
                                        <div className="text-[10px] font-bold text-amber-400/60 uppercase tracking-widest mb-1">Recommended Compensation</div>
                                        <p className="text-sm text-amber-100/70 font-medium leading-relaxed">{result.compensation_suggestion || 'No compensation needed.'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                                    <BarChart3 className="text-emerald-400 mt-1 shrink-0" size={24} />
                                    <div>
                                        <div className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest mb-1">Long-Term Mitigation</div>
                                        <p className="text-sm text-emerald-100/70 font-medium leading-relaxed">{result.long_term_improvement}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] border border-white/5 bg-white/[0.01] rounded-[3rem] flex flex-col items-center justify-center text-center p-8 space-y-6">
                            <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-2">
                                <Sparkles size={48} className="text-white/10 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white/40">Reputation Engine Idle</h3>
                                <p className="text-sm text-white/20 max-w-sm mt-2 mx-auto">
                                    Configure customer feedback on the left to activate automatic acknowledgments and business analysis.
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-6 w-full max-w-md pt-6 opacity-20">
                                <div className="h-1 bg-white/10 rounded-full" />
                                <div className="h-1 bg-white/10 rounded-full" />
                                <div className="h-1 bg-white/10 rounded-full" />
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm animate-in fade-in max-w-max mx-auto">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}
        </div>
    )
}
