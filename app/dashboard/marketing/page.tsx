'use client'

import { useState } from 'react'
import {
    Megaphone,
    Sparkles,
    TrendingUp,
    Target,
    Rocket,
    MessageSquare,
    Instagram,
    Video,
    Layout,
    Loader2,
    Download,
    Share2,
    Maximize2,
    X
} from 'lucide-react'
import { MarketingPoster } from '@/components/MarketingPoster'

interface MarketingStrategy {
    campaign_strategy: string
    offer_type: string
    recommended_duration_days: number
    whatsapp_message: string
    instagram_caption: string
    short_ad_script: string
    poster_content: {
        headline: string
        subheadline: string
        offer_line: string
        call_to_action: string
    }
    hashtags: string[]
    reasoning: string
    sd_image_prompt: string
}

const CATEGORIES = ['Healthcare', 'Beauty & Wellness', 'Food & Beverage', 'Electronics', 'Clothes', 'Furniture', 'Services', 'Wholesale', 'SaaS', 'Rentals']
const LEVELS = ['Low', 'Medium', 'High']
const TRENDS = ['Increasing', 'Stable', 'Decreasing']

export default function MarketingPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [strategy, setStrategy] = useState<MarketingStrategy | null>(null)
    const [showFullscreen, setShowFullscreen] = useState(false)
    const [generatedPosterUrl, setGeneratedPosterUrl] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        business_name: '',
        product_name: '',
        category: 'Healthcare',
        revenue_trend: 'Stable',
        demand_level: 'Medium',
        customer_satisfaction: 'Medium',
        target_audience: '',
        budget_level: 'Medium',
        location: '',
        logo_url: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const generateCampaign = async () => {
        setIsLoading(true)
        setStrategy(null)
        setGeneratedPosterUrl(null)
        try {
            const response = await fetch('/api/agents/marketing-strategy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (data.error) throw new Error(data.error)
            setStrategy(data)
        } catch (error) {
            console.error('Error generating campaign:', error)
            alert('Failed to generate campaign. Please check your API keys.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDownloadPoster = async () => {
        const element = document.getElementById('marketing-poster-canvas');
        if (!element) return;
        try {
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(element, {
                useCORS: true,
                allowTaint: false,
                scale: 2,
                backgroundColor: null,
            });
            const dataUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = dataUrl;
            a.download = `poster-${formData.business_name || 'campaign'}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading image:', error);
            if (generatedPosterUrl) {
                window.open(generatedPosterUrl, '_blank');
            }
        }
    };

    const handleSharePoster = async () => {
        const element = document.getElementById('marketing-poster-canvas');
        if (!element) return;
        try {
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(element, {
                useCORS: true,
                allowTaint: false,
                scale: 2,
                backgroundColor: null,
            });
            const dataUrl = canvas.toDataURL('image/png');
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            const file = new File([blob], `poster-${formData.business_name || 'campaign'}.png`, { type: blob.type });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Campaign Poster',
                    text: `Check out our new campaign poster for ${formData.business_name}!`,
                    files: [file]
                });
            } else {
                navigator.clipboard.writeText(dataUrl);
                alert("Poster image copied to clipboard as Base64 data URL!");
            }
        } catch (error) {
            console.error('Error sharing:', error);
            if (generatedPosterUrl) {
                navigator.clipboard.writeText(generatedPosterUrl);
                alert("Poster background URL copied to clipboard!");
            }
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        alert(`${label} copied to clipboard!`);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Header */}
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-2xl opacity-50" />
                <div className="relative">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Megaphone size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">
                                GrowthMate AI
                            </h1>
                            <p className="text-[var(--text-secondary)] mt-1 font-medium">Intelligent Marketing Strategy & Poster Generation</p>
                        </div>
                    </div>

                    {/* Service Description */}
                    <div className="max-w-3xl mt-6 p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-sm">
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                            <strong className="text-indigo-500">GrowthMate AI</strong> is your automated marketing department. We use advanced AI to analyze your business performance, demand levels, and customer sentiment to create hyper-targeted marketing campaigns. From professional WhatsApp broadcasts and Instagram captions to fully-composed commercial posters, we provide everything a small business needs to scale effectively without the high cost of a marketing agency.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                        <div className="relative p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl">
                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                <Layout className="text-indigo-500" size={20} />
                                Business Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 ml-1">Business Name</label>
                                    <input
                                        name="business_name"
                                        value={formData.business_name}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                        placeholder="e.g. TechHaven"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 ml-1">Product/Service</label>
                                    <input
                                        name="product_name"
                                        value={formData.product_name}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                        placeholder="e.g. iPhone 15 Pro"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 ml-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 ml-1">Revenue Trend</label>
                                        <select
                                            name="revenue_trend"
                                            value={formData.revenue_trend}
                                            onChange={handleInputChange}
                                            className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm appearance-none"
                                        >
                                            {TRENDS.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 ml-1">Demand Level</label>
                                        <select
                                            name="demand_level"
                                            value={formData.demand_level}
                                            onChange={handleInputChange}
                                            className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm appearance-none"
                                        >
                                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 ml-1">Satisfaction</label>
                                        <select
                                            name="customer_satisfaction"
                                            value={formData.customer_satisfaction}
                                            onChange={handleInputChange}
                                            className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm appearance-none"
                                        >
                                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 ml-1">Budget level</label>
                                        <select
                                            name="budget_level"
                                            value={formData.budget_level}
                                            onChange={handleInputChange}
                                            className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm appearance-none"
                                        >
                                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 ml-1">Location</label>
                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                        placeholder="e.g. MG Road, Bengaluru"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5 ml-1">Business Logo (Optional)</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) {
                                                        const reader = new FileReader()
                                                        reader.onloadend = () => {
                                                            setFormData(prev => ({ ...prev, logo_url: reader.result as string }))
                                                        }
                                                        reader.readAsDataURL(file)
                                                    }
                                                }}
                                                className="hidden"
                                                id="logo-upload"
                                            />
                                            <label
                                                htmlFor="logo-upload"
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[var(--border-color)] hover:border-indigo-500/50 hover:bg-[var(--sidebar-active)] transition-all cursor-pointer text-[var(--text-secondary)] text-sm font-medium"
                                            >
                                                <Layout size={18} />
                                                {formData.logo_url ? 'Change Logo' : 'Upload Logo'}
                                            </label>
                                        </div>
                                        {formData.logo_url && (
                                            <div className="h-11 w-11 rounded-lg border border-[var(--border-color)] bg-[var(--background)] p-1">
                                                <img src={formData.logo_url} alt="Logo" className="h-full w-full object-contain" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 ml-1">Target Audience</label>
                                    <textarea
                                        name="target_audience"
                                        value={formData.target_audience}
                                        onChange={handleInputChange}
                                        className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all h-20 resize-none font-medium"
                                        placeholder="e.g. Young professionals age 25-35"
                                    />
                                </div>

                                <button
                                    onClick={generateCampaign}
                                    disabled={isLoading || !formData.business_name || !formData.product_name}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            Generate Strategy
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-8 space-y-6">
                    {!strategy && !isLoading && (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] text-center">
                            <div className="h-20 w-20 rounded-full bg-[var(--background)] border border-[var(--border-color)] flex items-center justify-center mb-6">
                                <Sparkles className="text-[var(--text-secondary)] opacity-20" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-secondary)] mb-2">Ready to Grow?</h3>
                            <p className="text-[var(--text-secondary)] opacity-40 max-w-sm font-medium">
                                Enter your business details on the left and our AI agent will craft a professional marketing strategy for you.
                            </p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full min-h-[600px] flex flex-col items-center justify-center p-12 rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl text-center space-y-8">
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="text-indigo-400 animate-pulse" size={40} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Analyzing Your Business...</h3>
                                <p className="text-[var(--text-secondary)] italic font-medium">&quot;Our strategist is reviewing your revenue trends and market demand...&quot;</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite]" />
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 animate-[loading_2s_ease-in-out_infinite_delay-100]" />
                                </div>
                            </div>
                        </div>
                    )}

                    {strategy && (
                        <div className="space-y-6 animate-in fade-in duration-1000">
                            {/* Strategy Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-3xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-xl">
                                    <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <TrendingUp size={14} />
                                        Campaign Strategy
                                    </h3>
                                    <p className="text-[var(--text-primary)] font-bold text-xl mb-2">{strategy.campaign_strategy}</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-[var(--text-secondary)]">Duration: <span className="text-[var(--text-primary)] font-bold">{strategy.recommended_duration_days} Days</span></span>
                                        <span className="text-[var(--text-secondary)]">Offer: <span className="text-[var(--text-primary)] font-bold">{strategy.offer_type}</span></span>
                                    </div>
                                </div>
                                <div className="p-6 rounded-3xl border border-purple-500/30 bg-purple-500/5 backdrop-blur-xl">
                                    <h3 className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Target size={14} />
                                        Strategic Reasoning
                                    </h3>
                                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">{strategy.reasoning}</p>
                                </div>
                            </div>

                            {/* Content Tabs */}
                            <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* WhatsApp */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                                            <MessageSquare size={18} />
                                            WhatsApp Blast
                                        </div>
                                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-[var(--text-primary)] text-sm whitespace-pre-wrap leading-relaxed italic font-medium">
                                            &quot;{strategy.whatsapp_message}&quot;
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(strategy.whatsapp_message, 'WhatsApp Message')}
                                            className="w-full py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Download size={14} /> Copy for WhatsApp
                                        </button>
                                    </div>

                                    {/* Instagram */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-pink-500 font-bold text-sm">
                                            <Instagram size={18} />
                                            Instagram Post
                                        </div>
                                        <div className="p-4 rounded-2xl bg-pink-500/5 border border-pink-500/20 text-[var(--text-primary)] text-sm leading-relaxed italic font-medium">
                                            {strategy.instagram_caption}
                                            <div className="mt-4 flex flex-wrap gap-1">
                                                {strategy.hashtags.map(h => (
                                                    <span key={h} className="text-pink-500/60 text-[10px] font-bold">#{h.replace('#', '')}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(`${strategy.instagram_caption}\n\n${strategy.hashtags.map(h => '#' + h.replace('#', '')).join(' ')}`, 'Instagram Post')}
                                            className="w-full py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Download size={14} /> Copy for Instagram
                                        </button>
                                    </div>

                                    {/* Ad Script */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-indigo-500 font-bold text-sm">
                                            <Video size={18} />
                                            20-Sec Ad Script
                                        </div>
                                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-[var(--text-primary)] text-sm italic leading-relaxed font-medium">
                                            {strategy.short_ad_script}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(strategy.short_ad_script, 'Ad Script')}
                                            className="w-full py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Download size={14} /> Copy Script
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Poster Generation Section */}
                            <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                                <div className="absolute top-0 right-0 p-4">
                                    <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/50 text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                                        AI Generated Poster
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    {/* Elite Freepik-Inspired Poster Visual */}
                                    <div
                                        onClick={() => setShowFullscreen(true)}
                                        className="relative cursor-pointer group/poster-container"
                                    >
                                        <MarketingPoster
                                            strategy={strategy}
                                            formData={formData}
                                            initialUrl={generatedPosterUrl}
                                            onGenerated={(url) => setGeneratedPosterUrl(url)}
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/poster-container:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px] z-20">
                                            <div className="h-16 w-16 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white backdrop-blur-md transform scale-90 group-hover/poster-container:scale-100 transition-transform duration-300">
                                                <Maximize2 size={32} />
                                            </div>
                                            <span className="text-white font-bold mt-4 tracking-widest uppercase text-xs">View Full Size</span>
                                        </div>
                                    </div>

                                    {/* Poster Controls */}
                                    <div className="p-8 flex flex-col justify-center space-y-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Campaign Poster</h3>
                                            <p className="text-[var(--text-secondary)] text-sm font-medium">
                                                We&apos;ve generated a high-converting poster layout for you. You can download the background or share it directly.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--background)] border border-[var(--border-color)]">
                                                <Layout className="text-indigo-500" size={20} />
                                                <div className="flex-1">
                                                    <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">Theme</div>
                                                    <div className="text-sm text-[var(--text-primary)] font-bold">Premium Commercial</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--background)] border border-[var(--border-color)]">
                                                <Sparkles className="text-purple-500" size={20} />
                                                <div className="flex-1">
                                                    <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">AI Background Prompt</div>
                                                    <div className="text-[10px] leading-tight text-[var(--text-secondary)] mt-1 italic line-clamp-2">
                                                        {strategy.sd_image_prompt}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4">
                                            <button
                                                onClick={handleDownloadPoster}
                                                className="py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                <Download size={20} /> Download
                                            </button>
                                            <button
                                                onClick={handleSharePoster}
                                                className="py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                                            >
                                                <Share2 size={20} /> Share
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    )}
                </div>
                {/* Fullscreen Modal */}
                {showFullscreen && strategy && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                        <div
                            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
                            onClick={() => setShowFullscreen(false)}
                        />

                        <button
                            onClick={() => setShowFullscreen(false)}
                            className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all z-[110]"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center z-[105] animate-in zoom-in-95 duration-500">
                            <MarketingPoster
                                strategy={strategy}
                                formData={formData}
                                isFullscreen={true}
                                initialUrl={generatedPosterUrl}
                                onGenerated={(url) => setGeneratedPosterUrl(url)}
                            />
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .delay-100 { animation-delay: 200ms; }
            `}</style>
        </div>
    )
}
