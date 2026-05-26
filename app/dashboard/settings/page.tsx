'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, User, Shield, Palette, ChevronRight } from 'lucide-react'
import { ProfileSettings } from '@/components/dashboard/settings/ProfileSettings'
import { SecuritySettings } from '@/components/dashboard/settings/SecuritySettings'
import { AppearanceSettings } from '@/components/dashboard/settings/AppearanceSettings'

type SettingsTab = 'profile' | 'security' | 'appearance'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

    const tabs = [
        {
            id: 'profile' as SettingsTab,
            icon: User,
            title: 'Profile Settings',
            desc: 'Avatar, personal details',
            gradient: 'from-indigo-500 to-purple-600'
        },
        {
            id: 'security' as SettingsTab,
            icon: Shield,
            title: 'Security',
            desc: 'Password, authentication',
            gradient: 'from-emerald-500 to-green-600'
        },
        {
            id: 'appearance' as SettingsTab,
            icon: Palette,
            title: 'Appearance',
            desc: 'Theme, customization',
            gradient: 'from-orange-500 to-amber-600'
        },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Header */}
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-2xl opacity-50" />
                <div className="relative">
                    <div className="flex items-center gap-4 mb-1">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <SettingsIcon size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)]">Settings</h1>
                            <p className="text-[var(--text-secondary)] mt-1 font-medium">Manage your account and preferences</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-80 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative overflow-hidden
                                    ${isActive 
                                        ? 'bg-[var(--sidebar-active)] border border-[var(--border-color)] shadow-xl' 
                                        : 'hover:bg-[var(--sidebar-active)] border border-transparent opacity-60 hover:opacity-100 hover:border-[var(--border-color)]'
                                    }
                                `}
                            >
                                {isActive && (
                                    <div className={`absolute left-0 inset-y-0 w-1 bg-gradient-to-b ${tab.gradient}`} />
                                )}
                                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${tab.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    <Icon size={20} className="text-white" />
                                </div>
                                <div className="text-left flex-1">
                                    <h3 className="text-sm font-bold text-[var(--text-primary)]">{tab.title}</h3>
                                    <p className="text-[10px] text-[var(--text-secondary)] font-medium">{tab.desc}</p>
                                </div>
                                <ChevronRight size={14} className={`text-[var(--text-secondary)] opacity-20 transition-transform ${isActive ? 'translate-x-1 opacity-100 text-[var(--text-primary)]' : ''}`} />
                            </button>
                        )
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1 min-h-[500px] p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-3xl relative overflow-hidden transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <SettingsIcon size={200} className="text-[var(--text-primary)]" />
                    </div>

                    
                    <div className="relative animate-in fade-in slide-in-from-right-4 duration-500">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <ProfileSettings />
                            </div>
                        )}
                        {activeTab === 'security' && <SecuritySettings />}
                        {activeTab === 'appearance' && <AppearanceSettings />}
                    </div>
                </div>
            </div>
        </div>
    )
}


