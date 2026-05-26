'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    TrendingUp,
    Megaphone,
    Handshake,
    Users,
    Settings,
    Activity
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SidebarProps {
    isOpen: boolean
}

export function Sidebar({ isOpen }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()

    const navItems = [
        { name: 'Business Orchestrator', href: '/dashboard/orchestrator', icon: Activity },
        { name: 'Pricing Intelligence', href: '/dashboard/pricing', icon: TrendingUp },
        { name: 'Marketing Studio', href: '/dashboard/marketing', icon: Megaphone },
        { name: 'Negotiation Lab', href: '/dashboard/negotiation', icon: Handshake },
        { name: 'Customer Insights', href: '/dashboard/insights', icon: Users },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]

    return (
        <aside className="w-full h-full transition-all duration-300 border-r border-[var(--border-color)] glass relative z-20 shadow-xl overflow-hidden">
            <div className="flex flex-col h-full">
                <div className="h-44 flex items-center px-6 border-b border-[var(--border-color)]">
                    <div className="flex items-center group cursor-pointer w-full" onClick={() => router.push('/')}>
                        <img 
                            src="/logo.png" 
                            alt="GrowthMate Logo" 
                            className={`${isOpen ? 'h-32' : 'h-12'} w-auto transition-all duration-300 filter dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`} 
                        />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                                    ${isActive
                                        ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                                        : 'text-[var(--text-secondary)] hover:text-indigo-600 dark:hover:text-white hover:bg-white/5'
                                    }
                                `}
                            >
                                <Icon
                                    size={20}
                                    className={`${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-secondary)] group-hover:text-indigo-600 dark:group-hover:text-white'} transition-colors`}
                                />
                                {isOpen && (
                                    <span className="font-bold text-sm">
                                        {item.name}
                                    </span>
                                )}
                                {isActive && isOpen && (
                                    <div className="ml-auto h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                                )}
                            </Link>
                        )
                    })}
                </nav>


            </div>
        </aside>
    )
}
