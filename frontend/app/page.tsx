import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play, FileText, History, TrendingUp, Mic, Check, Upload, Building, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFCFF] flex flex-col font-sans text-slate-900">
      {/* 1. Dark Hero Section with Globe Aesthetic (Matching Mockup Left Top) */}
      <div className="bg-[#080E1E] text-white relative overflow-hidden">
        {/* Subtle Background Glow Grid / Earth Globe Mesh Simulation */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />

        {/* Top Bar Navigation */}
        <header className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <img src="/logo-icon.png" alt="foresightAI" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl tracking-tight text-white">foresight<span className="text-[#3B82F6]">AI</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#home" className="text-white font-medium hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-5 text-sm">
            <Link href="/login" className="text-slate-300 hover:text-white transition-colors">
              Log In
            </Link>
            <Link href="/dashboard" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-blue-500/20">
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero Banner Content */}
        <div className="max-w-7xl mx-auto px-8 pt-16 pb-28 relative z-10 grid md:grid-cols-2 items-center gap-12">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-6">
              Smarter decisions.<br />
              <span className="text-[#60A5FA]">A clearer tomorrow.</span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              <strong className="text-white font-semibold">foresightAI</strong> monitors global events, understands how they affect your business, and gives you personalized insights — so you can stay ahead, reduce risks and find new opportunities.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/onboarding" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3.5 rounded-full font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="border border-slate-700 hover:border-slate-500 bg-slate-900/50 text-white px-6 py-3.5 rounded-full font-medium transition-all flex items-center gap-2">
                <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
                Watch Demo
              </a>
            </div>
          </div>

          {/* Hero Earth Globe Illustration */}
          <div className="relative flex justify-center items-center">
            <div className="w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-blue-900/40 via-blue-600/20 to-cyan-400/40 border border-blue-500/30 flex items-center justify-center relative shadow-2xl backdrop-blur-sm">
              <div className="w-64 h-64 md:w-72 md:h-72 rounded-full border border-blue-400/20 animate-spin-slow flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-blue-300/30 border-dashed" />
              </div>
              <img src="/logo-icon.png" alt="Globe Core" className="w-24 h-24 object-contain absolute opacity-90 drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Features Grid (Matching Mockup Left Center) */}
      <section id="features" className="py-20 px-8 max-w-7xl mx-auto w-full">
        <div className="text-left mb-12">
          <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">Key Features</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">Everything you need to stay ahead</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Daily AI Briefing */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">Daily AI Briefing</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Get a concise, personalized summary of what's happening in the world and how it impacts your business.
              </p>
            </div>
            <Link href="/dashboard" className="text-[#2563EB] hover:text-blue-700 font-semibold text-sm flex items-center gap-1.5 mt-auto">
              Learn more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Historical Scenario Intelligence */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-6">
                <History className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">Historical Scenario Intelligence</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                See how similar events played out in the past and learn from real-world business outcomes.
              </p>
            </div>
            <Link href="/dashboard" className="text-[#2563EB] hover:text-blue-700 font-semibold text-sm flex items-center gap-1.5 mt-auto">
              Learn more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Impact & Risk Prediction */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">Impact & Risk Prediction</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Understand potential risks and opportunities with AI-driven analysis based on your business data.
              </p>
            </div>
            <Link href="/dashboard" className="text-[#2563EB] hover:text-blue-700 font-semibold text-sm flex items-center gap-1.5 mt-auto">
              Learn more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 4: AI Business Advisor */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-6">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">AI Business Advisor</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Ask questions, get instant answers, and speak naturally with your AI advisor — anytime, anywhere.
              </p>
            </div>
            <Link href="/dashboard" className="text-[#2563EB] hover:text-blue-700 font-semibold text-sm flex items-center gap-1.5 mt-auto">
              Learn more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Personalization Banner (Matching Mockup Left Bottom) */}
      <section className="py-12 px-8 max-w-7xl mx-auto w-full mb-16">
        <div className="bg-gradient-to-r from-blue-50/80 via-white to-blue-50/50 border border-blue-100 rounded-3xl p-8 md:p-12 grid md:grid-cols-2 items-center gap-10 shadow-sm">
          <div>
            <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">Get Started</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">
              Personalize foresightAI for your business
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-md">
              Tell us about your business and upload your data. We'll tailor insights to your unique needs.
            </p>
            <Link href="/onboarding" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3.5 rounded-full font-medium transition-all inline-flex items-center gap-2 shadow-md shadow-blue-500/20">
              Customize Your Business
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Graphic Cards Illustration */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="font-bold text-slate-900 flex items-center gap-2 text-sm border-b border-slate-100 pb-2">
                <Building className="w-4 h-4 text-blue-600" /> Business Profile
              </div>
              <div className="flex justify-between items-center text-slate-600"><span>Industry</span> <Check className="w-3.5 h-3.5 text-emerald-500" /></div>
              <div className="flex justify-between items-center text-slate-600"><span>Business model</span> <Check className="w-3.5 h-3.5 text-emerald-500" /></div>
              <div className="flex justify-between items-center text-slate-600"><span>Location</span> <Check className="w-3.5 h-3.5 text-emerald-500" /></div>
              <div className="flex justify-between items-center text-slate-600"><span>Products & customers</span> <Check className="w-3.5 h-3.5 text-emerald-500" /></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="font-bold text-slate-900 flex items-center gap-2 text-sm border-b border-slate-100 pb-2">
                <Upload className="w-4 h-4 text-blue-600" /> Upload 3 Files
              </div>
              <div className="flex justify-between items-center text-slate-600"><span>Sales data (required)</span> <Check className="w-3.5 h-3.5 text-emerald-500" /></div>
              <div className="flex justify-between items-center text-slate-600"><span>Inventory data (required)</span> <Check className="w-3.5 h-3.5 text-emerald-500" /></div>
              <div className="flex justify-between items-center text-slate-600"><span>Financial data (optional)</span> <Check className="w-3.5 h-3.5 text-emerald-500" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Matching Mockup Left Bottom Footer) */}
      <footer className="bg-white border-t border-slate-200 py-8 px-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo-icon.png" alt="foresightAI" className="w-6 h-6 object-contain" />
              <span className="font-bold text-slate-900 text-sm">foresight<span className="text-[#2563EB]">AI</span></span>
            </div>
            <span className="text-slate-400">|</span>
            <span>Better insights. Stronger businesses.</span>
          </div>

          <div className="flex items-center gap-6 text-slate-600">
            <a href="#home" className="hover:text-slate-900">Home</a>
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#about" className="hover:text-slate-900">About</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
