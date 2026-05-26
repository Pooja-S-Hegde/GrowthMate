'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { TrendingUp, AlertTriangle, CheckCircle, DollarSign, Sparkles } from 'lucide-react'

interface PricingResult {
    recommended_price: number
    minimum_safe_price: number
    safe_price_range: string
    expected_profit_margin: string
    competitor_analysis: string
    risk_level: 'Low' | 'Medium' | 'High'
    strategic_advice: string
    ai_powered?: boolean
    model?: string
}

export function PricingAdvisor() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<PricingResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        cost_price: '',
        current_price: '',
        competitor_price: '',
        demand_level: 'Medium',
        revenue_trend: 'Stable',
        monthly_sales_volume: '',
        customer_satisfaction: 'Medium'
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const response = await fetch('/api/agents/pricing-advisor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                if (response.status === 503 && data.error) {
                    throw new Error(data.error)
                }
                throw new Error(data.error || 'Failed to get pricing recommendation')
            }

            setResult(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Low': return 'from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20 border-emerald-500/30'
            case 'Medium': return 'from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20 border-orange-500/30'
            case 'High': return 'from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20 border-red-500/30'
            default: return 'from-slate-500/10 to-gray-500/10 dark:from-slate-500/20 dark:to-gray-500/20 border-slate-500/30'
        }
    }

    const getRiskIcon = (risk: string) => {
        switch (risk) {
            case 'Low': return <CheckCircle size={24} className="text-emerald-500" />
            case 'Medium': return <AlertTriangle size={24} className="text-orange-500" />
            case 'High': return <AlertTriangle size={24} className="text-red-500" />
            default: return null
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header */}
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 blur-2xl opacity-50" />
                <div className="relative">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <DollarSign size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">
                                AI Pricing Advisor
                            </h1>
                            <p className="text-[var(--text-secondary)] mt-1 font-bold">Intelligent pricing recommendations powered by advanced algorithms</p>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-black text-indigo-600 dark:text-indigo-300 backdrop-blur-sm">
                        <Sparkles size={14} />
                        AI-Powered Analysis
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur opacity-30" />
                <div className="relative p-8 glass-card">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <h2 className="text-2xl font-black text-[var(--text-primary)] flex items-center gap-3">
                                <TrendingUp className="text-indigo-500" />
                                About Pricing Intelligence
                            </h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed text-sm font-bold">
                                Our Pricing Intelligence service is an advanced AI-driven agent designed to help businesses optimize their revenue and market positioning. By processing multiple data points including costs, competitive benchmarks, and consumer demand patterns, it provides strategic recommendations that go beyond simple margins.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                {[
                                    { title: 'Smart Optimization', desc: 'Leverages advanced algorithms to find the perfect price-to-volume ratio.', color: 'text-indigo-600 dark:text-indigo-400' },
                                    { title: 'Market Adaptive', desc: 'Real-time adjustments based on competitor moves and demand shifts.', color: 'text-purple-600 dark:text-purple-400' },
                                    { title: 'Risk Mitigation', desc: 'Identifies potential pitfalls before they impact your bottom line.', color: 'text-blue-600 dark:text-blue-400' },
                                    { title: 'Strategic Insights', desc: 'Provides actionable business advice tailored to your market context.', color: 'text-emerald-600 dark:text-emerald-400' }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-1">
                                        <h4 className={`font-black uppercase tracking-widest text-[10px] ${item.color}`}>{item.title}</h4>
                                        <p className="text-[10px] text-[var(--text-secondary)] font-bold">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full md:w-1/4 aspect-square rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] flex items-center justify-center group/box transition-all">
                            <TrendingUp className="text-indigo-500/30 w-12 h-12" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                <div className="relative p-8 glass-card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: 'Cost Price (₹)', field: 'cost_price', placeholder: '1000' },
                                { label: 'Current Selling Price (₹)', field: 'current_price', placeholder: '1500' },
                                { label: 'Competitor Price (₹)', field: 'competitor_price', placeholder: '1400' },
                                { label: 'Monthly Sales Volume', field: 'monthly_sales_volume', placeholder: '100' }
                            ].map((input) => (
                                <div key={input.field} className="space-y-2">
                                    <label className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">
                                        {input.label} <span className="text-indigo-500">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder={input.placeholder}
                                        value={formData[input.field as keyof typeof formData]}
                                        onChange={(e) => handleInputChange(input.field, e.target.value)}
                                        required={input.field !== 'monthly_sales_volume'}
                                        className="h-12 rounded-xl font-bold form-input"
                                    />
                                </div>
                            ))}

                            <div className="space-y-2">
                                <label className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Demand Level *</label>
                                <select
                                    className="flex h-12 w-full rounded-xl form-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold appearance-none"
                                    value={formData.demand_level}
                                    onChange={(e) => handleInputChange('demand_level', e.target.value)}
                                    required
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Revenue Trend *</label>
                                <select
                                    className="flex h-12 w-full rounded-xl form-input px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold appearance-none"
                                    value={formData.revenue_trend}
                                    onChange={(e) => handleInputChange('revenue_trend', e.target.value)}
                                    required
                                >
                                    <option value="Increasing">Increasing</option>
                                    <option value="Stable">Stable</option>
                                    <option value="Decreasing">Decreasing</option>
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-black animate-in fade-in">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-500/20 rounded-xl transition-all"
                            isLoading={loading}
                        >
                            {loading ? 'Analyzing...' : 'Get Pricing Recommendation'}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Results */}
            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Recommended Price */}
                        <div className="glass-card p-6 border-indigo-500/20">
                            <h3 className="font-black text-[var(--text-secondary)] uppercase tracking-widest text-[10px] mb-2">Recommended Price</h3>
                            <p className="text-4xl font-black text-indigo-600">₹{result.recommended_price}</p>
                        </div>
                        {/* Profit Margin */}
                        <div className="glass-card p-6 border-emerald-500/20">
                            <h3 className="font-black text-[var(--text-secondary)] uppercase tracking-widest text-[10px] mb-2">Profit Margin</h3>
                            <p className="text-4xl font-black text-emerald-600">{result.expected_profit_margin}</p>
                        </div>
                        {/* Risk Level */}
                        <div className={`glass-card p-6 border-[var(--border-color)] bg-gradient-to-br ${getRiskColor(result.risk_level)}`}>
                            <h3 className="font-black text-[var(--text-secondary)] uppercase tracking-widest text-[10px] mb-2">Risk Level</h3>
                            <div className="flex items-center gap-2">
                                {getRiskIcon(result.risk_level)}
                                <p className="text-2xl font-black text-[var(--text-primary)]">{result.risk_level}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <h3 className="font-black text-[var(--text-primary)] mb-6 flex items-center gap-2">
                            <Sparkles className="text-purple-500" /> Strategic Advice
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-bold">{result.strategic_advice}</p>
                        
                        <div className="mt-8 pt-6 border-t border-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-[var(--text-secondary)]">Min Safe Price</span>
                                <span className="font-black text-[var(--text-primary)]">₹{result.minimum_safe_price}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-[var(--text-secondary)]">Price Range</span>
                                <span className="font-black text-[var(--text-primary)]">{result.safe_price_range}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
