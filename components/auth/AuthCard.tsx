import { Card } from "@/components/ui/Card"
import Link from "next/link"
import Footer from "@/components/Footer"
interface AuthCardProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

export function AuthCard({ children, title, description }: AuthCardProps) {
    return (
        <div className="flex flex-col min-h-screen bg-transparent relative overflow-x-hidden">
            {/* Ambient Background Glows - Only visible in dark mode via opacity-0 in light */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse dark:opacity-100 opacity-0 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-1000 dark:opacity-100 opacity-0 pointer-events-none" />

            <div className="absolute top-4 left-4 z-50">
                <Link href="/">
                    <img src="/logo.png" alt="GrowthMate Logo" className="h-32 w-auto hover:scale-105 transition-transform cursor-pointer filter dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                </Link>
            </div>

            <div className="w-full flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500 relative z-10 my-20">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
                            {title}
                        </h1>
                        <p className="text-[var(--text-secondary)] font-bold">
                            {description}
                        </p>
                    </div>

                    <Card className="p-8 glass-card border-[var(--border-color)] shadow-2xl">
                        <div className="relative z-10">
                            {children}
                        </div>
                    </Card>

                    <p className="text-center text-sm text-[var(--text-secondary)] font-bold tracking-wide opacity-50 hidden">
                        &copy; {new Date().getFullYear()} GrowthMate AI. All rights reserved.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    )
}
