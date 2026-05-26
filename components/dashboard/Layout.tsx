'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import Footer from '@/components/Footer'
export default function DashboardLayoutUI({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div className="flex h-screen bg-transparent text-[var(--foreground)] overflow-hidden transition-colors duration-300">
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:relative top-0 left-0 h-full z-50 transition-all duration-300
                ${sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 md:translate-x-0 md:w-20'}
            `}>
                <Sidebar isOpen={sidebarOpen} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-10 w-full md:w-auto">
                <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                <main className="flex-1 overflow-y-auto flex flex-col w-full">
                    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
                        {children}
                    </div>
                    <div className="mt-8">
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    )
}
