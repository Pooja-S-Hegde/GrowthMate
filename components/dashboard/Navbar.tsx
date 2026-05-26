'use client'

import { Menu, User as UserIcon, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface NavbarProps {
    onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [profile, setProfile] = useState<any>(null)
    const [, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        async function getUser() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user)

                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single()
                    setProfile(profile)

                    // Subscribe to real-time profile changes
                    const profileSubscription = supabase
                        .channel('profile_sync')
                        .on(
                            'postgres_changes',
                            {
                                event: '*',
                                schema: 'public',
                                table: 'profiles',
                                filter: `id=eq.${user.id}`,
                            },
                            (payload) => {
                                setProfile(payload.new)
                            }
                        )
                        .subscribe()

                    return () => {
                        supabase.removeChannel(profileSubscription)
                    }
                }
            } catch (error) {
                console.error('Error fetching user:', error)
            } finally {
                setLoading(false)
            }
        }

        getUser()

        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (!session) {
                setProfile(null)
            }
        })

        return () => {
            authSubscription.unsubscribe()
        }
    }, [supabase])


    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <header className="h-20 border-b border-[var(--border-color)] glass flex items-center justify-between px-6 md:px-8 relative z-10 transition-colors duration-300 shadow-xl">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-xl hover:bg-[var(--input-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all transform active:scale-95"
                >
                    <Menu size={20} />
                </button>


            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <ThemeToggle />



                {/* User Profile */}
                <div className="flex items-center gap-3 pl-3 border-l border-[var(--border-color)]">
                    <Link 
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] hover:bg-[var(--card-bg)] transition-all group active:scale-[0.98]"
                    >
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform overflow-hidden">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={18} className="text-white" />
                            )}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-bold text-[var(--text-primary)] truncate max-w-[120px]">
                                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                            </p>
                        </div>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="p-2.5 rounded-xl hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all transform active:scale-90"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    )
}
