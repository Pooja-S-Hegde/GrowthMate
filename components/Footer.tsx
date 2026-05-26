"use client";

import { useState, ReactNode, useEffect } from "react";
import Link from "next/link";
import { X, Mail, Rocket, Target, Briefcase, Zap, Cpu, Search } from "lucide-react";

type ModalType = "FEATURES" | "ABOUT" | "PRIVACY" | "TERMS" | "CONTACT" | null;

export default function Footer() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const closeModal = () => setActiveModal(null);

  if (!mounted) return null;

  return (
    <>
      <footer className="relative z-10 w-full bg-[var(--glass-bg)] border-t border-[var(--border-color)] pt-16 pb-8 text-[var(--text-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {/* Brand Column */}
            <div className="space-y-6 lg:pl-4">
              <Link href="/" className="flex items-center group cursor-pointer inline-block">
                <img 
                  src="/logo.png" 
                  alt="GrowthMate AI Logo" 
                  className="h-14 w-auto filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform" 
                />
              </Link>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-xs font-medium">
                Your AI-powered business growth platform. Automate pricing strategy, analyze markets, and showcase your business decisions all in one place.
              </p>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-bold text-[var(--text-primary)] mb-6 text-sm">Features</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <button 
                    onClick={() => setActiveModal("FEATURES")} 
                    className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50"></span>
                    Our Features
                  </button>
                </li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="font-bold text-[var(--text-primary)] mb-6 text-sm">About</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <button 
                    onClick={() => setActiveModal("ABOUT")} 
                    className="text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2 text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50"></span>
                    About Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-[var(--text-primary)] mb-6 text-sm">Legal</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li>
                  <button onClick={() => setActiveModal("PRIVACY")} className="text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</button>
                </li>
                <li>
                  <button onClick={() => setActiveModal("TERMS")} className="text-slate-400 hover:text-emerald-400 transition-colors">Terms of Service</button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal("CONTACT")} 
                    className="text-slate-400 hover:text-pink-400 transition-colors text-left mt-2"
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)] text-center">
            <p className="font-medium">© {new Date().getFullYear()} GrowthMate AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activeModal && (
        <ModalWrapper title={getModalTitle(activeModal)} onClose={closeModal} subtitle={getModalSubtitle(activeModal)}>
          {getModalContent(activeModal)}
        </ModalWrapper>
      )}
    </>
  );
}

function getModalTitle(type: ModalType) {
  switch (type) {
    case "FEATURES": return "Our Features";
    case "ABOUT": return "About Us";
    case "PRIVACY": return "Privacy Policy";
    case "TERMS": return "Terms of Service";
    case "CONTACT": return "Contact Us";
    default: return "";
  }
}

function getModalSubtitle(type: ModalType) {
   switch (type) {
     case "FEATURES": return "What GrowthMate AI offers you";
     case "ABOUT": return "Meet the team behind GrowthMate AI";
     case "PRIVACY": return "Last updated: " + new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
     case "TERMS": return "Last updated: " + new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
     case "CONTACT": return "Get in touch with our team";
     default: return "";
   }
}

function getModalContent(type: ModalType) {
  switch (type) {
    case "FEATURES":
      return (
        <div className="space-y-4">
          <FeatureItem
            icon={<Zap className="w-5 h-5 text-indigo-400" />}
            title="AI-Powered Business Orchestrator"
            desc="Automatically coordinate complex strategies. Our AI analyzes market shifts and highlights your most relevant moves."
          />
          <FeatureItem
            icon={<Target className="w-5 h-5 text-emerald-400" />}
            title="Smart Pricing Intelligence"
            desc="Our intelligent matching algorithm finds the absolute best price points that align with your margins and market demands."
          />
          <FeatureItem
            icon={<Briefcase className="w-5 h-5 text-orange-400" />}
            title="Marketing Content Engine"
            desc="Track all your marketing campaigns in one place. Generate multi-channel copy that converts."
          />
          <FeatureItem
            icon={<Search className="w-5 h-5 text-blue-400" />}
            title="Negotiation Lab"
            desc="Run simulated negotiations using advanced game theory models to find minimum and maximum price thresholds."
          />
        </div>
      );
    case "ABOUT":
      return (
        <div className="space-y-4 flex flex-col items-center">
          <div className="w-full text-left bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 shadow-inner">
            <h5 className="font-semibold text-white flex items-center gap-2 mb-3">
              <Rocket className="w-4 h-4 text-purple-400" /> A Professional Platform
            </h5>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              GrowthMate AI is an advanced multi-agent platform developed by a team of aspiring AI enthusiasts and business operators.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed mt-2 font-medium">
              Our goal is to simplify market intelligence for fresh businesses and experienced enterprises alike, using the power of Artificial Intelligence and modern web technologies.
            </p>
          </div>
          <div className="w-full text-left bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 shadow-inner">
            <h5 className="font-semibold text-white flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-blue-400" /> Technology Stack
            </h5>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Built with Next.js, Supabase, Tailwind CSS, and integrated with Google Gemini AI for intelligent features.
            </p>
          </div>
        </div>
      );
    case "PRIVACY":
      return (
        <div className="space-y-5 text-sm text-slate-300 font-medium">
          <div>
            <h5 className="font-bold text-white mb-2">1. Information We Collect</h5>
            <p className="text-slate-400 leading-relaxed">We collect information you provide directly, including your name, email address, profile details, business data, skills, and corporate preferences. We also collect related API activity when you connect your accounts.</p>
          </div>
          <div>
            <h5 className="font-bold text-white mb-2">2. How We Use Your Information</h5>
            <p className="text-slate-400 leading-relaxed">Your information is used solely to provide our services: generating strategies, predicting pricing, and simulating negotiations. We use AI to analyze and improve your business presentation.</p>
          </div>
          <div>
            <h5 className="font-bold text-white mb-2">3. Data Protection</h5>
            <div className="space-y-1.5 text-emerald-400">
               <p>✓ We do NOT sell your corporate data to third parties.</p>
               <p>✓ We do NOT share your information with advertisers.</p>
               <p>✓ Your data is encrypted and stored securely.</p>
               <p>✓ Private API keys are stored in secure, isolated storage.</p>
            </div>
          </div>
        </div>
      );
    case "TERMS":
      return (
        <div className="space-y-5 text-sm text-slate-300 font-medium">
          <div>
             <h5 className="font-bold text-white mb-2">1. Acceptance of Terms</h5>
             <p className="text-slate-400 leading-relaxed">By accessing and using GrowthMate AI, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </div>
          <div>
            <h5 className="font-bold text-white mb-2">2. Description of Service</h5>
            <p className="text-slate-400 leading-relaxed">GrowthMate AI provides AI-powered business tools including pricing generation, market analysis, and intelligent match generation. This is a SaaS product and services may be modified or discontinued.</p>
          </div>
          <div>
            <h5 className="font-bold text-white mb-2">3. User Responsibilities</h5>
            <div className="pl-4 space-y-1">
               <p className="text-slate-400">• Provide accurate and truthful information</p>
               <p className="text-slate-400">• Keep your account credentials secure</p>
               <p className="text-slate-400">• Use the service for lawful purposes only</p>
               <p className="text-slate-400">• Not misuse or attempt to exploit the platform</p>
            </div>
          </div>
          <div>
             <h5 className="font-bold text-white mb-2">4. Intellectual Property</h5>
             <p className="text-slate-400 leading-relaxed">Content you create (strategies, generations, portfolios) belongs to you. The GrowthMate AI platform, design, and AI models are the property of the development team.</p>
          </div>
        </div>
      );
    case "CONTACT":
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800/30 rounded-xl border border-slate-700/50 shadow-inner space-y-5">
           <div className="w-16 h-16 bg-[#1a2b4b] rounded-md flex items-center justify-center border border-blue-500/20 shadow-lg">
             <Mail className="w-8 h-8 text-blue-400" />
           </div>
           <div className="text-center">
             <h5 className="font-bold text-white mb-1">Email Us</h5>
             <a href="mailto:growthmateai@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-semibold tracking-wide">growthmateai@gmail.com</a>
           </div>
           <p className="text-xs text-slate-400 text-center max-w-[200px] font-medium leading-relaxed">
             We typically respond within 24-48 hours.
           </p>
        </div>
      );
    default:
      return null;
  }
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/80 transition-colors border border-slate-700/30 hover:border-slate-700/80 cursor-default shadow-sm">
      <div className="mt-1 flex-shrink-0">{icon}</div>
      <div>
        <h5 className="font-bold text-white text-sm mb-1.5">{title}</h5>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}

function ModalWrapper({ children, title, subtitle, onClose }: { children: ReactNode, title: string, subtitle?: string, onClose: () => void }) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-[var(--foreground)]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Dialog */}
      <div 
        className="relative w-full max-w-[420px] bg-[#202124] lg:bg-[#18191c] border border-slate-700/60 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 block"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-700/60 bg-[#202124] lg:bg-[#18191c] z-10 sticky top-0">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-400 mt-1 font-medium">{subtitle}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors border border-transparent hover:border-slate-600/50 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {children}
        </div>
      </div>
    </div>
  );
}
