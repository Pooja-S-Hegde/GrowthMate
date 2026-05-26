/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ArrowRight, TrendingUp, Activity, Megaphone, Handshake, Users } from 'lucide-react'
import Footer from '@/components/Footer'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-[var(--foreground)] selection:bg-indigo-500/30">

      <header className="relative z-50 w-full max-w-7xl mx-auto px-6 h-32 flex items-center justify-between">
        <Link href="/" className="flex items-center group cursor-pointer">
          <img src="/logo.png" alt="GrowthMate Logo" className="h-32 w-auto group-hover:scale-105 transition-transform filter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
        </Link>
        <div className="hidden md:block flex-1" />
       <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
             <Link href="/dashboard">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 rounded-full px-6">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 rounded-full px-6">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="pt-12 pb-20 px-6 text-center max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.2] text-[var(--text-primary)]">
            Empower Your Business <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400">With AI Intelligence.</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto font-medium leading-relaxed">
            GrowthMate provides professional AI tools to help you manage pricing, marketing, and complex negotiations. Automate your daily operations and make data-driven decisions to grow your business effectively.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href={user ? "/dashboard" : "/signup"}>
              <Button className="h-14 px-10 text-lg rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xl shadow-indigo-500/20 group">
                {user ? "View Dashboard" : "Deploy Your First Agent"} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

        </section>

        {/* Features Section */}
        <section id="agents" className="py-32 px-6 max-w-7xl mx-auto w-full space-y-32">
          {/* Business Orchestrator */}
          <div id="orchestrator" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-600 dark:text-purple-400">
                <Activity size={14} />
                Strategic Core
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[var(--text-primary)]">
                Business Orchestrator <br />
                <span className="text-slate-400 dark:text-white/40">Your AI Strategy Officer.</span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                The terminal for your entire business. Define your goals, and let the Orchestrator coordinate your other agents. It monitors market shifts and automatically adjusts your tactical execution in real-time.
              </p>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute -inset-4 bg-purple-500/10 blur-3xl rounded-full" />
              <div className="relative aspect-video rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl bg-black">
                <img src="/orchestrator.png" alt="Orchestrator" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-black/80 to-transparent flex items-end p-6">
                  <div className="text-[10px] text-white/60 dark:text-white/40 font-black tracking-widest uppercase">System LOG_042</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl rounded-full" />
              <div className="relative aspect-square rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl group">
                <img src="/pricing.png" alt="Pricing Intelligence" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-black/60 to-transparent" />
              </div>
            </div>
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={14} />
                Neural Pricing
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[var(--text-primary)]">
                Pricing Intelligence <br />
                <span className="text-slate-400 dark:text-white/40">Maximum Revenue, Automated.</span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                Stop guessing your margins. Our AI analyzes competitor moves, seasonal trends, and demand elasticity to find your perfect price point—every single hour.
              </p>
            </div>
          </div>

          {/* Marketing Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-600 dark:text-orange-400">
                <Megaphone size={14} />
                Content Engine
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[var(--text-primary)]">
                Marketing Studio <br />
                <span className="text-slate-400 dark:text-white/40">AI-Generated Resonance.</span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                Generate complete multi-channel campaigns in seconds. From viral Instagram posters to high-converting WhatsApp scripts and professional ad copies, built to sell.
              </p>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute -inset-4 bg-orange-500/10 blur-3xl rounded-full" />
              <div className="relative aspect-[4/5] max-w-sm mx-auto rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl group">
                <img src="/marketing.png" alt="Marketing Studio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 dark:from-black/40 to-transparent" />
              </div>
            </div>
          </div>

          {/* Negotiation Lab */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div className="relative">
                <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full" />
                <div className="relative aspect-video rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl group">
                    <img src="/negotiation.png" alt="Negotiation Lab" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 dark:from-black/40 to-transparent" />
                </div>
            </div>
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400">
                <Handshake size={14} />
                Autonomous Commerce
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[var(--text-primary)]">
                Negotiation Lab <br />
                <span className="text-slate-400 dark:text-white/40">Win-Win deals, on autopilot.</span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                Watch our AI agents battle it out. Use the Negotiation Lab to find the absolute minimum price a buyer will accept or the maximum a seller can hold, using advanced game theory models.
              </p>
            </div>
          </div>

          {/* Customer Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-bold text-pink-600 dark:text-pink-400">
                <Users size={14} />
                Empathy Engine
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-[var(--text-primary)]">
                Customer Insights <br />
                <span className="text-slate-400 dark:text-white/40">Read Between the Lines.</span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                Go beyond survey results. Analyze customer sentiment, extract key pain points, and identify growth opportunities from raw communication data using our deep-learning empathy models.
              </p>
              <div className="p-6 glass-card">
                    <div className="text-xs font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest mb-2">Sentiment Shift</div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-gradient-to-r from-pink-500 to-rose-500" />
                    </div>
              </div>
            </div>
            <div className="relative">
                <div className="absolute -inset-4 bg-pink-500/20 blur-3xl rounded-full" />
                <div className="relative aspect-square rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl group">
                    <img src="/insights.png" alt="Customer Insights" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 dark:from-black/40 to-transparent" />
                </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
