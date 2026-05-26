'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Shield, Save, Loader2, Camera } from 'lucide-react'

export function ProfileSettings() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null)
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        website: '',
        avatar_url: ''
    })
    const [message, setMessage] = useState({ type: '', text: '' })
    const fileInputRef = useRef<HTMLInputElement>(null)

    const supabase = createClient()

    useEffect(() => {
        async function loadProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user)

                if (user) {
                    const { data } = await supabase
                        .from('profiles')
                        .select('full_name, username, website, avatar_url')
                        .eq('id', user.id)
                        .single()

                    if (data) {
                        setFormData({
                            full_name: data.full_name || '',
                            username: data.username || '',
                            website: data.website || '',
                            avatar_url: data.avatar_url || ''
                        })
                    }
                }
            } catch (error) {
                console.error('Error loading profile:', error)
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [supabase])

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Please select an image file.' })
            return
        }
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image must be smaller than 2MB.' })
            return
        }

        setUploading(true)
        setMessage({ type: '', text: '' })

        try {
            const fileExt = file.name.split('.').pop()
            const filePath = `${user.id}/avatar.${fileExt}`

            // Upload to Supabase Storage bucket "avatars"
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true })

            if (uploadError) throw uploadError

            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    avatar_url: publicUrl,
                    updated_at: new Date().toISOString(),
                })

            if (updateError) throw updateError

            setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
            setMessage({ type: 'success', text: 'Profile photo updated!' })
        } catch (error: unknown) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to upload image. Make sure the "avatars" storage bucket exists in Supabase.'
            })
        } finally {
            setUploading(false)
            // Reset input so same file can be re-selected
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage({ type: '', text: '' })

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    ...formData,
                    updated_at: new Date().toISOString(),
                })

            if (error) throw error
            setMessage({ type: 'success', text: 'Profile updated successfully!' })
        } catch (error: unknown) {
            setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update profile' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="relative group">
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                    />
                    <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 overflow-hidden">
                        {formData.avatar_url ? (
                            <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User size={40} className="text-white" />
                        )}
                        {/* Upload overlay spinner */}
                        {uploading && (
                            <div className="absolute inset-0 rounded-3xl bg-black/60 flex items-center justify-center">
                                <Loader2 className="animate-spin text-white" size={24} />
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        title="Change profile photo"
                        className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 hover:bg-indigo-700 border border-white/20 rounded-xl text-white transition-all shadow-lg disabled:opacity-50 active:scale-95"
                    >
                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                    </button>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">{formData.full_name || 'Your Profile'}</h2>
                    <p className="text-[var(--text-secondary)] text-sm">{user?.email}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-1 opacity-60">Click the camera icon to change photo</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Full Name</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User size={18} className="text-[var(--text-secondary)] opacity-30 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] opacity-50 focus:opacity-100 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Username</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-[var(--text-secondary)] opacity-30 font-bold group-focus-within:text-indigo-400">@</span>
                        </div>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                            placeholder="johndoe"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Email Address</label>
                    <div className="relative group opacity-50">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail size={18} className="text-[var(--text-secondary)] opacity-30" />
                        </div>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-4 text-[var(--text-primary)] cursor-not-allowed font-medium"
                        />
                    </div>
                    <p className="text-[10px] text-[var(--text-secondary)] opacity-50 ml-1">Email cannot be changed directly.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Website</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Shield size={18} className="text-[var(--text-secondary)] opacity-30 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                            placeholder="https://example.com"
                        />
                    </div>
                </div>

                <div className="md:col-span-2 pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Save size={18} />
                        )}
                        {saving ? 'Saving...' : 'Save Changes'}
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
        </div>
    )
}
