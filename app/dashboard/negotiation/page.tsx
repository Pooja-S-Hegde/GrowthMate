'use client'

import { useState } from 'react'
import { Handshake, Sparkles, Info, Play, RotateCcw, CheckCircle2, XCircle, MessageSquare } from 'lucide-react'

interface Message {
    role: 'buyer' | 'seller'
    content: string
    price?: number
    isDeal?: boolean
}

export default function NegotiationPage() {
    const [showInfo, setShowInfo] = useState(true)

    // Product name and optional manual price
    const [productName, setProductName] = useState('')
    const [manualPrice, setManualPrice] = useState('')

    const [messages, setMessages] = useState<Message[]>([])
    const [isNegotiating, setIsNegotiating] = useState(false)
    const [dealFixed, setDealFixed] = useState(false)
    const [roundCount, setRoundCount] = useState(0)
    const [finalPrice, setFinalPrice] = useState<number | null>(null)
    const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)

    const resetNegotiation = () => {
        setMessages([])
        setIsNegotiating(false)
        setDealFixed(false)
        setRoundCount(0)
        setFinalPrice(null)
        setEstimatedPrice(null)
        setManualPrice('')
    }

    const startNegotiation = async () => {
        resetNegotiation()
        setIsNegotiating(true)

        try {
            const response = await fetch('/api/agents/ai-vs-ai-negotiation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_name: productName,
                    manual_price: manualPrice
                })
            })

            if (!response.ok) throw new Error('Negotiation failed')

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()

            if (!reader) throw new Error('No response stream')

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value)
                const lines = chunk.split('\n\n')

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = JSON.parse(line.slice(6))

                        if (data.type === 'estimated_price') {
                            setEstimatedPrice(data.price)
                        } else if (data.type === 'message') {
                            setMessages(prev => [...prev, data.message])
                        } else if (data.type === 'deal') {
                            setDealFixed(true)
                            setFinalPrice(data.price)
                            setRoundCount(data.rounds)
                        } else if (data.type === 'no_deal') {
                            setDealFixed(false)
                            setRoundCount(data.rounds)
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Negotiation error:', error)
        } finally {
            setIsNegotiating(false)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header */}
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20 blur-2xl opacity-50" />
                <div className="relative">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Handshake size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text-primary)]">
                                DealFixer: AI vs AI Negotiation
                            </h1>
                            <p className="text-[var(--text-secondary)] mt-1 font-bold">Watch two AI agents negotiate in real-time</p>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-600 dark:text-emerald-300 backdrop-blur-sm">
                        <Sparkles size={14} />
                        REAL-TIME AI BATTLE
                    </div>
                </div>
            </div>

            {/* Info Section */}
            {showInfo && (
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-3xl blur opacity-30" />
                    <div className="relative p-8 glass-card">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 dark:border-blue-500/30">
                                    <Info size={20} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-[var(--text-primary)]">How It Works</h2>
                                    <p className="text-sm text-[var(--text-secondary)] font-bold">Strategic AI Commerce Simulation</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowInfo(false)}
                                className="h-8 w-8 rounded-full bg-[var(--input-bg)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <p className="text-[var(--text-secondary)] font-bold leading-relaxed">
                                    Simply enter a product name - that&apos;s it! Our AI will automatically estimate the market price,
                                    generate product details, and set up a realistic negotiation between two AI agents (Buyer and Seller).
                                    Watch them negotiate in real-time over up to 10 rounds!
                                </p>

                                <div className="p-5 rounded-2xl bg-[var(--input-bg)] border border-[var(--input-border)] shadow-inner">
                                    <p className="text-blue-800 dark:text-blue-100 text-sm leading-relaxed">
                                        <span className="font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mr-2">The Process:</span>
                                        Estimates market price → Sets negotiation range (80%-100% of estimate) →
                                        Two AI agents negotiate → You see the final deal (or no deal)!
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-[var(--input-bg)] border border-[var(--input-border)] shadow-inner">
                                <p className="text-sm font-black text-purple-600 dark:text-purple-300 mb-4 uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles size={16} /> Product Categories:
                                </p>
                                <div className="grid grid-cols-2 gap-3 text-xs text-[var(--text-primary)] font-bold">
                                    {['Electronics', 'Vehicles', 'Furniture', 'Accessories', 'Fashion', 'Gaming', 'Appliances', 'Collectibles'].map(cat => (
                                        <div key={cat} className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-purple-500" /> 
                                            {cat}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-md">
                                <h3 className="font-black text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                    🤖 AI Buyer
                                </h3>
                                <ul className="text-sm space-y-1 text-[var(--text-secondary)] font-bold">
                                    <li>• Has maximum budget limit</li>
                                    <li>• Tries to get lowest price</li>
                                    <li>• Makes counter-offers</li>
                                    <li>• Can accept or walk away</li>
                                </ul>
                            </div>

                            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md">
                                <h3 className="font-black text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                    🤖 AI Seller
                                </h3>
                                <ul className="text-sm space-y-1 text-[var(--text-secondary)] font-bold">
                                    <li>• Has minimum reserve price</li>
                                    <li>• Tries to get highest price</li>
                                    <li>• Defends product value</li>
                                    <li>• Can accept or reject</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Entry */}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                <div className="relative p-8 glass-card">
                    <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">Configure Your Negotiation</h2>
                    <p className="text-[var(--text-secondary)] text-sm mb-6 font-bold">AI will estimate the market price and start negotiating automatically.</p>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Product Name *</label>
                                <input
                                    type="text"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="e.g., iPhone 15 Pro, Samsung TV..."
                                    className="w-full h-12 rounded-xl px-4 font-bold form-input"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Market Price (Optional)</label>
                                <input
                                    type="number"
                                    value={manualPrice}
                                    onChange={(e) => setManualPrice(e.target.value)}
                                    placeholder="Enter ₹ market price..."
                                    className="w-full h-12 rounded-xl px-4 font-bold form-input"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-2 font-black italic">
                            {manualPrice
                                ? `💡 Focus Mode: Using manual base price ₹${parseInt(manualPrice).toLocaleString('en-IN')}`
                                : '💡 Auto Mode: AI will estimate market value automatically'}
                        </p>

                        {estimatedPrice && (
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 animate-in fade-in slide-in-from-top-4 duration-500">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-black">
                                    Estimated Market Price: ₹{estimatedPrice.toLocaleString('en-IN')}
                                </p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-300/60 mt-1 font-bold">
                                    Negotiation range: ₹{Math.floor(estimatedPrice * 0.8).toLocaleString('en-IN')} - ₹{estimatedPrice.toLocaleString('en-IN')}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={startNegotiation}
                                disabled={isNegotiating || !productName.trim()}
                                className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black shadow-lg shadow-emerald-500/40 hover:scale-[1.02] transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isNegotiating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                        AI AGENTS NEGOTIATING...
                                    </>
                                ) : (
                                    <>
                                        <Play size={20} fill="currentColor" />
                                        START NEGOTIATION BATTLE
                                    </>
                                )}
                            </button>

                            {messages.length > 0 && (
                                <button
                                    onClick={resetNegotiation}
                                    className="px-8 py-4 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-black hover:bg-[var(--input-bg)] transition-all duration-300 flex items-center gap-2"
                                >
                                    <RotateCcw size={20} />
                                    RESET
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Interface */}
            {messages.length > 0 && (
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-3xl blur opacity-30" />
                    <div className="relative p-8 glass-card">
                        <div className="flex items-center gap-3 mb-6">
                            <MessageSquare size={24} className="text-blue-600 dark:text-blue-400" />
                            <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">Live Negotiation Battle</h2>
                            <div className="ml-auto px-4 py-1 rounded-full bg-[var(--input-bg)] text-xs text-[var(--text-secondary)] font-black border border-[var(--border-color)] uppercase tracking-widest">
                                Round {roundCount}
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto px-2 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'buyer' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-5 rounded-3xl shadow-sm dark:shadow-2xl ${msg.role === 'buyer'
                                            ? 'bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/20 dark:border-blue-500/40 rounded-tl-none'
                                            : 'bg-emerald-600/10 dark:bg-emerald-600/20 border border-emerald-500/20 dark:border-emerald-500/40 rounded-tr-none'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md ${msg.role === 'buyer' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                                }`}>
                                                {msg.role === 'buyer' ? 'Agent BUYER' : 'Agent SELLER'}
                                            </div>
                                            {msg.price && (
                                                <div className="text-sm font-black text-[var(--text-primary)]">
                                                    ₹{msg.price.toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-[var(--text-primary)] text-sm leading-relaxed font-bold opacity-90">
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Deal Status */}
            {!isNegotiating && messages.length > 0 && (
                <div className="relative group">
                    <div className={`absolute -inset-0.5 rounded-3xl blur opacity-30 ${dealFixed ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20' : 'bg-gradient-to-r from-red-500/10 to-pink-500/10 dark:from-red-500/20 dark:to-pink-500/20'
                        }`} />
                    <div className={`relative p-12 glass-card text-center border-2 ${dealFixed
                        ? 'border-emerald-500/30 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10'
                        : 'border-red-500/30 dark:border-red-500/40 bg-red-50 dark:bg-red-500/10'
                        }`}>
                        {dealFixed ? (
                            <>
                                <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-4" />
                                <h2 className="text-4xl md:text-5xl font-black text-emerald-900 dark:text-emerald-50 mb-4 uppercase tracking-tighter">Deal Secured!</h2>
                                <p className="text-2xl md:text-3xl text-emerald-700 dark:text-emerald-400 font-black mb-4">
                                    Final Agreed Price: ₹{finalPrice?.toLocaleString()}
                                </p>
                                <div className="inline-block px-6 py-2 rounded-full bg-white/50 dark:bg-black/20 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-sm font-bold">
                                    Agreement reached after {roundCount} cycles
                                </div>
                            </>
                        ) : (
                            <>
                                <XCircle size={64} className="text-red-500 mx-auto mb-4" />
                                <h2 className="text-4xl md:text-5xl font-black text-red-900 dark:text-red-50 mb-4 uppercase tracking-tighter">No Agreement</h2>
                                <p className="text-red-700 dark:text-red-200 font-bold text-lg mb-6">
                                    Maximum communication limit reached without a mutually beneficial deal.
                                </p>
                                <button
                                    onClick={resetNegotiation}
                                    className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs"
                                >
                                    Try New Session
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
