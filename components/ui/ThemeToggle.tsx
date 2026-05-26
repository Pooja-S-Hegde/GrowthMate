'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
    const [isLight, setIsLight] = useState(false)

    useEffect(() => {
        // Read current theme from html class
        setIsLight(document.documentElement.classList.contains('light'))
    }, [])

    const toggle = () => {
        const root = document.documentElement
        if (root.classList.contains('light')) {
            root.classList.remove('light')
            localStorage.setItem('theme', 'dark')
            setIsLight(false)
        } else {
            root.classList.add('light')
            localStorage.setItem('theme', 'light')
            setIsLight(true)
        }
    }

    return (
        <button
            onClick={toggle}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] hover:bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all active:scale-95"
        >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    )
}
