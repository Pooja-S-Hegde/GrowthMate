'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarketingPosterProps {
    strategy: {
        sd_image_prompt: string
        poster_content: {
            headline: string
            subheadline: string
            offer_line: string
            call_to_action: string
        }
    }
    formData: {
        business_name: string
        product_name: string
        category: string
        logo_url?: string
        location?: string
    }
    isFullscreen?: boolean
    className?: string
    onGenerated?: (url: string) => void
    initialUrl?: string | null
}

export function MarketingPoster({ strategy, formData, isFullscreen = false, className, onGenerated, initialUrl }: MarketingPosterProps) {
    const [imgUrl, setImgUrl] = useState<string | null>(initialUrl || null);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Update internal state if initialUrl changes
    useEffect(() => {
        if (initialUrl) {
            setImgUrl(initialUrl);
        }
    }, [initialUrl]);

    const generatePoster = async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        setHasError(false);
        setImgLoaded(false);
        setImgUrl(null);

        try {
            const response = await fetch('/api/generate-poster', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: strategy.sd_image_prompt,
                    business_name: formData.business_name,
                    product_name: formData.product_name,
                    category: formData.category,
                    headline: strategy.poster_content.headline,
                    subheadline: strategy.poster_content.subheadline,
                    offer_line: strategy.poster_content.offer_line,
                    call_to_action: strategy.poster_content.call_to_action,
                })
            });
            const data = await response.json();
            if (data.url) {
                setImgUrl(data.url);
                if (onGenerated) onGenerated(data.url);
            } else {
                throw new Error('No URL returned');
            }
        } catch (err) {
            console.error('Poster generation error:', err);
            setHasError(true);
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (!initialUrl) {
            generatePoster();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [strategy.sd_image_prompt, formData.business_name, strategy.poster_content.headline, strategy.poster_content.subheadline, strategy.poster_content.offer_line, strategy.poster_content.call_to_action, formData.product_name, formData.category]);

    return (
        <>
            {/* Google Fonts Import */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap');
            `}</style>

            <div 
                id="marketing-poster-canvas"
                className={cn(
                    "relative bg-neutral-950 shadow-2xl overflow-hidden transition-all duration-500 select-none",
                    isFullscreen ? "w-full max-w-[500px] aspect-[2/3]" : "aspect-[2/3] border-[3px] border-white/5 rounded-2xl",
                    className
                )}
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {/* Background Image Container */}
                <div className="absolute inset-0 bg-neutral-950">
                    {(isGenerating || (!imgLoaded && imgUrl === null)) && !hasError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl z-20">
                            <div className="h-10 w-10 border-[3px] border-white/10 border-t-white rounded-full animate-spin" />
                            <div className="mt-5 flex flex-col items-center gap-1.5">
                                <span className="text-xs font-semibold text-white/90 tracking-[0.2em] uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>Creating Your Poster</span>
                                <span className="text-[9px] text-white/30 uppercase tracking-widest animate-pulse">Leonardo AI is painting...</span>
                            </div>
                        </div>
                    )}

                    {hasError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-30 p-8 text-center">
                            <div className="text-rose-400 mb-3 flex flex-col items-center gap-2">
                                <X size={32} strokeWidth={1.5} />
                                <span className="text-xs font-semibold tracking-[0.2em] uppercase">Generation Failed</span>
                            </div>
                            <p className="text-white/30 text-[9px] uppercase tracking-widest leading-relaxed mb-5">
                                Could not connect to AI designer.
                            </p>
                            <button
                                onClick={generatePoster}
                                className="px-5 py-2 rounded-full border border-white/15 text-white text-[9px] font-semibold uppercase tracking-[0.15em] hover:bg-white/5 transition-all flex items-center gap-2"
                            >
                                <RefreshCw size={10} /> Retry
                            </button>
                        </div>
                    )}

                    {imgUrl && (
                        <img
                            src={imgUrl}
                            crossOrigin="anonymous"
                            alt="AI Generated Marketing Poster"
                            onLoad={() => setImgLoaded(true)}
                            onError={() => {
                                setHasError(true);
                                setImgLoaded(false);
                            }}
                            className={cn(
                                "w-full h-full transition-all duration-1000",
                                isFullscreen ? "object-contain" : "object-cover",
                                imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                            )}
                        />
                    )}
                </div>

                {/* ===== PREMIUM TEXT OVERLAY ===== */}
                {imgUrl && imgLoaded && (
                    <div className="absolute inset-0 z-10 flex flex-col justify-between">
                        
                        {/* ── TOP BAR: Business Name + Location ── */}
                        <div className="flex items-center justify-between px-5 pt-4 pb-2">
                            <div className="flex items-center gap-2">
                                {formData.logo_url && (
                                    <div className="h-7 w-7 rounded-full border border-white/20 bg-black/30 backdrop-blur-md p-0.5 overflow-hidden flex items-center justify-center shadow-lg">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={formData.logo_url} alt="Logo" className="max-h-full max-w-full object-contain rounded-full" />
                                    </div>
                                )}
                                <span 
                                    className="text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                >
                                    {formData.business_name}
                                </span>
                            </div>
                            {formData.location && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[9px] md:text-[10px] font-semibold text-white/90 border border-white/10 tracking-wider uppercase shadow-lg">
                                    <span>📍</span> {formData.location}
                                </span>
                            )}
                        </div>

                        {/* ── SPACER: Keeps the top half of the image clean ── */}
                        <div className="flex-1" />

                        {/* ── BOTTOM: Floating Glassmorphic Content Card ── */}
                        <div className="px-3 pb-3">
                            <div 
                                className="rounded-[1.25rem] border border-white/[0.12] bg-black/[0.45] backdrop-blur-xl p-5 md:p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
                            >
                                {/* Category Tag */}
                                <div className="mb-3">
                                    <span 
                                        className="text-[8px] md:text-[9px] font-bold tracking-[0.3em] uppercase text-white/50"
                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                    >
                                        {formData.category || "Premium"}
                                    </span>
                                </div>

                                {/* Main Headline — Large, impactful serif */}
                                <h1 
                                    className="text-3xl md:text-4xl font-bold uppercase leading-[1.1] text-white tracking-tight mb-3"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    {strategy.poster_content.headline}
                                </h1>

                                {/* Subheadline */}
                                {strategy.poster_content.subheadline && (
                                    <p 
                                        className="text-[11px] md:text-xs font-normal text-white/70 leading-relaxed mb-4 max-w-[85%]"
                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                    >
                                        {strategy.poster_content.subheadline}
                                    </p>
                                )}

                                {/* Offer + CTA Row */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    {/* Offer Badge */}
                                    {strategy.poster_content.offer_line && (
                                        <div 
                                            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] md:text-xs font-extrabold uppercase tracking-wider shadow-lg"
                                            style={{ fontFamily: "'Outfit', sans-serif" }}
                                        >
                                            {strategy.poster_content.offer_line}
                                        </div>
                                    )}

                                    {/* CTA Button */}
                                    {strategy.poster_content.call_to_action && (
                                        <div 
                                            className="px-4 py-1.5 rounded-full bg-white text-black text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-lg"
                                            style={{ fontFamily: "'Outfit', sans-serif" }}
                                        >
                                            {strategy.poster_content.call_to_action}
                                        </div>
                                    )}
                                </div>

                                {/* Divider + Footer Branding */}
                                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                                    <span 
                                        className="text-[7px] md:text-[8px] font-medium text-white/25 tracking-[0.2em] uppercase"
                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                    >
                                        Designed by GrowthMate AI
                                    </span>
                                    {formData.product_name && (
                                        <span 
                                            className="text-[7px] md:text-[8px] font-medium text-white/25 tracking-[0.15em] uppercase"
                                            style={{ fontFamily: "'Outfit', sans-serif" }}
                                        >
                                            {formData.product_name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Subtle Grain Texture */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>
        </>
    )
}
