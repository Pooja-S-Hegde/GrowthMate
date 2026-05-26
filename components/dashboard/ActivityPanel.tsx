'use client'

import React from 'react'
import { AlertCircle, Zap, Target, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const activities = [
    {
        id: 1,
        type: 'drop',
        message: 'Revenue dropped 12% in the last 24h',
        time: '2 hours ago',
        icon: AlertCircle,
        color: 'text-red-500',
        bg: 'bg-red-50'
    },
    {
        id: 2,
        type: 'suggestion',
        message: 'New marketing campaign suggested',
        time: '5 hours ago',
        icon: Zap,
        color: 'text-amber-500',
        bg: 'bg-amber-50'
    },
    {
        id: 3,
        type: 'adjustment',
        message: 'Pricing adjusted for Q4 seasonal trends',
        time: 'Yesterday',
        icon: Target,
        color: 'text-indigo-500',
        bg: 'bg-indigo-50'
    },
    {
        id: 4,
        type: 'insight',
        message: 'Customer sentiment improved by 8%',
        time: '2 days ago',
        icon: Zap,
        color: 'text-emerald-500',
        bg: 'bg-emerald-50'
    }
]

export default function ActivityPanel() {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900">Recent Activity</h3>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 group">
                    View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="space-y-6">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 relative group">
                        <div className={cn(
                            "h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                            activity.bg,
                            activity.color
                        )}>
                            <activity.icon size={18} />
                        </div>
                        <div className="flex-1 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors cursor-pointer">
                                {activity.message}
                            </p>
                            <span className="text-xs text-slate-400 font-medium">{activity.time}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-center text-slate-500 font-medium italic">
                    &quot;GrowthMate AI detected 3 new optimization opportunities today.&quot;
                </p>
            </div>
        </div>
    )
}
