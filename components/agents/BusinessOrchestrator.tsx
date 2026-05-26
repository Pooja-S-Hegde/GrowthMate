'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
    LayoutDashboard,
    AlertCircle,
    CheckCircle2,
    Zap,
    Activity,
    ShieldAlert,
    BarChart3,
    ArrowRight,
    Sparkles
} from 'lucide-react'

interface OrchestratorResult {
    activate_service: string
    priority_level: 'Low' | 'Medium' | 'High'
    reason: string
    immediate_action: string
    business_health_status: 'Good' | 'Moderate' | 'Risky'
}

export function BusinessOrchestrator() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<OrchestratorResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const autoMode = false

    const [formData, setFormData] = useState({
        revenue_trend: 'Stable',
        profit_margin: '25',
        competitor_position: 'Similar',
        demand_level: 'Medium',
        customer_satisfaction: 'Medium',
        complaint_frequency: 'Low',
        negotiation_pressure: 'Low'
    })

    const runOrchestrator = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('/api/agents/business-orchestrator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Orchestration failed')
            setResult(data)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setLoading(false)
        }
    }

    const getHealthColor = (status: string) => {
        switch (status) {
            case 'Good': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            case 'Moderate': return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
            case 'Risky': return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
            default: return 'text-white/40 bg-white/5 border-white/10'
        }
    }

    const getPriorityColor = (level: string) => {
        switch (level) {
            case 'High': return 'text-rose-400 border-rose-500/30 bg-rose-500/10'
            case 'Medium': return 'text-amber-400 border-amber-500/30 bg-amber-500/10'
            case 'Low': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
            default: return 'text-white/40 border-white/10 bg-white/5'
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header */}
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-2xl opacity-50" />
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Activity size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">
                                Business Orchestrator
                            </h1>
                            <p className="text-[var(--text-secondary)] mt-1">AI Decision Engine for growth and stability</p>
                        </div>
                    </div>


                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-30" />
                        <div className="relative p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl space-y-6">
                            <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4 mb-2">
                                <BarChart3 className="text-indigo-400" size={20} />
                                <h2 className="font-bold text-lg text-[var(--text-primary)]">Business State</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Revenue Trend</label>
                                    <select
                                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                        value={formData.revenue_trend}
                                        onChange={(e) => setFormData({ ...formData, revenue_trend: e.target.value })}
                                    >
                                        <option value="Increasing" className="bg-[#0c0c0c]">Growing</option>
                                        <option value="Stable" className="bg-[#0c0c0c]">Stable</option>
                                        <option value="Decreasing by 10%" className="bg-[#0c0c0c]">Slight Decline (10%)</option>
                                        <option value="Decreasing by 25%" className="bg-[#0c0c0c]">Severe Decline (25%)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Profit Margin (%)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        value={formData.profit_margin}
                                        onChange={(e) => setFormData({ ...formData, profit_margin: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Competitor Position</label>
                                    <select
                                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                        value={formData.competitor_position}
                                        onChange={(e) => setFormData({ ...formData, competitor_position: e.target.value })}
                                    >
                                        <option value="Higher" className="bg-[#0c0c0c]">We are More Expensive</option>
                                        <option value="Similar" className="bg-[#0c0c0c]">Market Average</option>
                                        <option value="Lower" className="bg-[#0c0c0c]">Aggressive Pricing</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Customer Sentiment</label>
                                    <select
                                        className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                        value={formData.customer_satisfaction}
                                        onChange={(e) => setFormData({ ...formData, customer_satisfaction: e.target.value })}
                                    >
                                        <option value="High" className="bg-[#0c0c0c]">Delighted</option>
                                        <option value="Medium" className="bg-[#0c0c0c]">Satisfied</option>
                                        <option value="Low" className="bg-[#0c0c0c]">Unhappy</option>
                                    </select>
                                </div>
                            </div>

                            <Button
                                onClick={runOrchestrator}
                                disabled={loading}
                                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20"
                            >
                                {loading ? 'Analyzing...' : 'Run Analysis'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Results Display */}
                <div className="lg:col-span-2 space-y-6">
                    {result ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            {/* Status Bar */}
                            <div className={`p-4 rounded-2xl border flex items-center justify-between ${getHealthColor(result.business_health_status)}`}>
                                <div className="flex items-center gap-3">
                                    {result.business_health_status === 'Good' ? <CheckCircle2 size={20} /> : <ShieldAlert size={20} />}
                                    <span className="font-bold tracking-wide uppercase text-sm">Business Health: {result.business_health_status}</span>
                                </div>
                                <div className="text-xs opacity-60 font-medium">Updated just now</div>
                            </div>

                            {/* Recommended Action Card */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-[2rem] blur opacity-40" />
                                <div className="relative p-8 rounded-[2rem] border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-2xl">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-2xl font-black text-[var(--text-primary)]">{result.activate_service}</h3>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getPriorityColor(result.priority_level)} shadow-sm`}>
                                                    {result.priority_level} Priority
                                                </span>
                                            </div>
                                            <p className="text-[var(--text-secondary)] font-medium">Recommended automated strategic activation</p>
                                        </div>
                                        <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                            <Zap size={24} className="text-indigo-500" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Strategy Reasoning</div>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                                                {result.reason}
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Immediate Action</div>
                                            <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border-color)] text-indigo-500 font-bold text-sm italic">
                                                “{result.immediate_action}”
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-[var(--border-color)] flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                            <Sparkles size={14} />
                                            AI Suggestion derived from 6 real-world data indices
                                        </div>
                                        {autoMode ? (
                                            <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm animate-pulse">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                Service Executing Automatically
                                            </div>
                                        ) : (
                                            <Button className="bg-[var(--text-primary)] text-[var(--background)] hover:opacity-90 rounded-xl px-6 h-10 text-xs font-bold group">
                                                Initialize Service <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] border border-[var(--border-color)] bg-[var(--card-bg)] rounded-[2rem] flex flex-col items-center justify-center text-center p-8 space-y-4">
                            <div className="h-20 w-20 rounded-full bg-[var(--background)] border border-[var(--border-color)] flex items-center justify-center mb-2">
                                <LayoutDashboard size={40} className="text-[var(--text-secondary)] opacity-20" />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-secondary)]">Engine Idle</h3>
                            <p className="text-sm text-[var(--text-secondary)] opacity-60 max-w-xs font-medium">
                                Configure your business state and run the analysis to receive strategic recommendations.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm animate-in fade-in">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}
        </div>
    )
}
