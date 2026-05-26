'use client'

import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart, Smile, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardCardProps {
    title: string
    value: string
    change: string
    isPositive: boolean
    icon: 'DollarSign' | 'BarChart' | 'Smile' | 'Zap'
    color: 'indigo' | 'emerald' | 'orange' | 'cyan'
}

const iconMap = {
    DollarSign,
    BarChart,
    Smile,
    Zap,
}

const colorMap = {
    indigo: { 
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', 
        text: 'text-indigo-600 dark:text-indigo-400', 
        border: 'border-indigo-100 dark:border-indigo-500/30', 
        glow: 'shadow-indigo-500/20' 
    },
    emerald: { 
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', 
        text: 'text-emerald-600 dark:text-emerald-400', 
        border: 'border-emerald-100 dark:border-emerald-500/30', 
        glow: 'shadow-emerald-500/20' 
    },
    orange: { 
        bg: 'bg-orange-500/10 dark:bg-orange-500/20', 
        text: 'text-orange-600 dark:text-orange-400', 
        border: 'border-orange-100 dark:border-orange-500/30', 
        glow: 'shadow-orange-500/20' 
    },
    cyan: { 
        bg: 'bg-cyan-500/10 dark:bg-cyan-500/20', 
        text: 'text-cyan-600 dark:text-cyan-400', 
        border: 'border-cyan-100 dark:border-cyan-500/30', 
        glow: 'shadow-cyan-500/20' 
    },
}

export default function DashboardCard({ title, value, change, isPositive, icon, color }: DashboardCardProps) {
    const styles = colorMap[color]
    const Icon = iconMap[icon]

    return (
        <div className={cn(
            "p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden backdrop-blur-xl",
            styles.glow
        )}>
            {/* Background Micro-animation element */}
            <div className={cn(
                "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.05] group-hover:scale-150 transition-transform duration-700",
                styles.bg
            )} />

            <div className="flex justify-between items-start mb-4">
                <div className={cn(
                    "p-3 rounded-xl border transition-colors",
                    styles.bg,
                    styles.text,
                    styles.border
                )}>
                    <Icon size={24} />
                </div>

                <div className={cn(
                    "flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-full",
                    isPositive 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                )}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {change}
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-black text-[var(--text-primary)]">{value}</h3>
            </div>

            {/* Decorative mini Sparkline (SVG) */}
            <div className="mt-4 h-8 w-full opacity-50">
                <svg viewBox="0 0 100 20" className="w-full h-full">
                    <path
                        d={isPositive ? "M0 15 Q 10 5, 20 12 T 40 8 T 60 14 T 80 5 T 100 10" : "M0 5 Q 10 15, 20 8 T 40 12 T 60 6 T 80 15 T 100 10"}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className={isPositive ? "text-emerald-400/50" : "text-red-400/50"}
                    />
                </svg>
            </div>
        </div>
    )
}
