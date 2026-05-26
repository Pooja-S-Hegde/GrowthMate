'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Shield, Eye, EyeOff, Loader2, Key } from 'lucide-react'

export function SecuritySettings() {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [passwords, setPasswords] = useState({
        new: '',
        confirm: ''
    })
    const [message, setMessage] = useState({ type: '', text: '' })

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: 'Passwords do not match' })
            return
        }

        if (passwords.new.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
            return
        }

        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.new
            })

            if (error) throw error
            
            setMessage({ type: 'success', text: 'Password updated successfully!' })
            setPasswords({ new: '', confirm: '' })
        } catch (error: unknown) {
            setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update password' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Shield size={28} className="text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Security Settings</h2>
                    <p className="text-[var(--text-secondary)] text-sm font-medium">Update your password and protect your account</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--text-secondary)] ml-1">New Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Key size={18} className="text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-12 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/30 focus:outline-none focus:border-emerald-500/50 focus:bg-[var(--sidebar-active)] transition-all font-medium"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/20 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--text-secondary)] ml-1">Confirm New Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Key size={18} className="text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-12 text-[var(--text-primary)] placeholder-[var(--text-secondary)]/30 focus:outline-none focus:border-emerald-500/50 focus:bg-[var(--sidebar-active)] transition-all font-medium"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 w-full px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Shield size={18} />
                        )}
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>

                    {message.text && (
                        <div className={`mt-4 p-4 rounded-xl text-sm ${
                            message.type === 'success' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                            {message.text}
                        </div>
                    )}
                </div>
            </form>

            <div className="mt-12 p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl">
                <h3 className="text-[var(--text-primary)] font-bold mb-2">Account Security</h3>
                <p className="text-[var(--text-secondary)] text-sm mb-4 font-medium">
                    GrowthMate AI uses enterprise-grade encryption and secure authentication via Supabase. 
                    Your password is salted and hashed before being stored.
                </p>
                <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase font-black">
                    <Shield size={12} />
                    <span>Securely stored via Supabase Auth</span>
                </div>
            </div>
        </div>
    )
}
