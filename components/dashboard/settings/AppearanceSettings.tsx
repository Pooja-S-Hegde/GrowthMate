'use client'

import { useState, useEffect } from 'react'
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react'

type Theme = 'light' | 'dark' | 'system'

export function AppearanceSettings() {
    const [theme, setTheme] = useState<Theme>('dark') // Default project theme is dark

    useEffect(() => {
        const savedTheme = (localStorage.getItem('theme') || 'dark') as Theme
        setTheme(savedTheme)
        applyTheme(savedTheme)
    }, [])


    const applyTheme = (newTheme: Theme) => {
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        
        const root = window.document.documentElement
        
        if (newTheme === 'light') {
            root.classList.add('light')
        } else if (newTheme === 'dark') {
            root.classList.remove('light')
        } else if (newTheme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (isDark) {
                root.classList.remove('light')
            } else {
                root.classList.add('light')
            }
        }
    }


    const themeOptions = [
        { id: 'light' as Theme, name: 'Light Mode', icon: Sun, desc: 'Clean and bright' },
        { id: 'dark' as Theme, name: 'Dark Mode', icon: Moon, desc: 'Premium and sleek' },
        { id: 'system' as Theme, name: 'System', icon: Monitor, desc: 'Follows your OS' },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <Palette size={28} className="text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Appearance</h2>
                    <p className="text-[var(--text-secondary)] text-sm">Customize how your dashboard looks</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {themeOptions.map((option) => {
                    const Icon = option.icon
                    const isSelected = theme === option.id
                    
                    return (
                        <button
                            key={option.id}
                            onClick={() => applyTheme(option.id)}
                            className={`
                                relative p-6 rounded-3xl border transition-all text-left group
                                ${isSelected 
                                    ? 'bg-[var(--sidebar-active)] border-indigo-500 shadow-xl' 
                                    : 'bg-[var(--card-bg)] border-[var(--border-color)] hover:border-indigo-500/50'
                                }
                            `}
                        >
                            {isSelected && (
                                <div className="absolute top-4 right-4 h-6 w-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                    <Check size={14} className="text-white" />
                                </div>
                            )}
                            <div className={`
                                h-10 w-10 rounded-xl mb-4 flex items-center justify-center transition-all
                                ${isSelected ? 'bg-indigo-500 text-white' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] group-hover:text-indigo-500'}
                            `}>
                                <Icon size={20} />
                            </div>
                            <h3 className="text-sm font-bold text-[var(--text-primary)]">{option.name}</h3>
                            <p className="text-[10px] text-[var(--text-secondary)]">{option.desc}</p>
                        </button>
                    )
                })}
            </div>

            <div className="mt-8 p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                    <h3 className="text-[var(--text-primary)] font-bold text-sm">Pro Tip</h3>
                </div>
                <p className="text-[var(--text-secondary)] text-sm">
                    Dark mode is recommended for prolonged use as it reduces eye strain and helps focus on 
                    the vibrant AI insights and data charts.
                </p>
            </div>

        </div>
    )
}
