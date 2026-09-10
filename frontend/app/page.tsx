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
            <span className="font-bold text-2xl tracking-tight text-white">
              f<span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent font-extrabold">o</span>resight<span className="text-[#3B82F6]">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#home" className="text-white font-medium hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
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
              <strong className="text-white font-semibold">f<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-extrabold">o</span>resight<span className="text-[#3B82F6]">AI</span></strong> monitors global events, understands how they affect your business, and gives you personalized insights — so you can stay ahead, reduce risks and find new opportunities.
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
          <div className="relative flex justify-center items-center lg:justify-end">
            <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px]">
              {/* Atmospheric Outer Glow */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-blue-600/30 via-cyan-400/20 to-transparent blur-2xl opacity-90 pointer-events-none" />
              
              {/* Photorealistic 3D Earth Globe Image */}
              <img 
                src="/earth-hero.jpg" 
                alt="ForesightAI World Earth Globe" 
                className="w-full h-full object-cover rounded-full shadow-[0_0_90px_rgba(37,99,235,0.5)] border border-blue-400/30 relative z-10" 
              />
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

      {/* 4. Pricing Section (Scroll Target for #pricing) */}
      <section id="pricing" className="py-20 px-8 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">Flexible Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-4">
            Plans built for every stage of business growth
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Start with our basic free plan or upgrade to Pro to unlock real-time macro signals, voice intelligence, and advance enterprise features.
          </p>
        </div>

        {/* 3 Pricing Option Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16 items-stretch">
          {/* Card 1: Basic Free */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Basic Starter</div>
              <h3 className="text-2xl font-bold text-slate-900">Free</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-slate-500 text-xs font-medium"> / forever</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Ideal for small businesses & store managers exploring AI-powered risk briefings and data file uploads.
              </p>

              <div className="space-y-3 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Daily AI Business Briefing</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>CSV File Upload (Sales & Inventory)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Standard Risk Index Meter</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Pre-loaded Demo Scenarios</span>
                </div>
              </div>
            </div>

            <Link href="/onboarding" className="mt-8 w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 px-4 rounded-xl text-xs transition-colors">
              Get Started Free
            </Link>
          </div>

          {/* Card 2: Growth Pro (Popular) */}
          <div className="bg-white p-8 rounded-3xl border-2 border-blue-600 shadow-xl flex flex-col justify-between relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Most Popular
            </div>

            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Growth Pro</div>
              <h3 className="text-2xl font-bold text-slate-900">Professional</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$99</span>
                <span className="text-slate-500 text-xs font-medium"> / month</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Built for apparel brands & commercial businesses requiring live news monitoring and voice advisor.
              </p>

              <div className="space-y-3 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Everything in Basic Starter</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Live News & Web Extraction (SerpApi)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Interactive Voice Advisor (ElevenLabs)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Competitor Price & Promo Tracking</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Revenue at Risk Audit Calculations</span>
                </div>
              </div>
            </div>

            <Link href="/onboarding" className="mt-8 w-full text-center bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-colors shadow-md shadow-blue-500/20">
              Start Pro Trial
            </Link>
          </div>

          {/* Card 3: Enterprise Pro / Advanced */}
          <div className="bg-[#0A1328] text-white p-8 rounded-3xl border border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Advance Features</div>
              <h3 className="text-2xl font-bold text-white">Enterprise Pro</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-extrabold text-white">$299</span>
                <span className="text-slate-400 text-xs font-medium"> / month</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Complete foresight suite equipped with next-generation autonomous AI capabilities & dedicated infra.
              </p>

              <div className="space-y-3 text-xs text-slate-200 font-medium">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Everything in Growth Pro</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Autonomous Supply Chain Reordering</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Satellite Commodity Yield Radar</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom Fine-Tuned Local LLM Deployment</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multi-Tenant Enterprise SSO & 24/7 SLA</span>
                </div>
              </div>
            </div>

            <Link href="/onboarding" className="mt-8 w-full text-center bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 px-4 rounded-xl text-xs transition-colors">
              Contact Enterprise Sales
            </Link>
          </div>
        </div>

        {/* Complete Feature Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Detailed Plan Feature Comparison</h3>
              <p className="text-xs text-slate-500">Compare all current capabilities and upcoming advance Pro features across plans.</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-bold text-xs">
              All Features Listed Below
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4 w-2/5">Feature Details</th>
                  <th className="p-4 text-center w-1/5">Basic Free</th>
                  <th className="p-4 text-center w-1/5">Growth Pro</th>
                  <th className="p-4 text-center w-1/5 bg-blue-50/40 text-blue-900">Enterprise Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {/* Section 1: Core Intelligence */}
                <tr className="bg-slate-50/80 font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                  <td colSpan={4} className="px-4 py-2 text-blue-900">1. Core Briefing & File Management</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Daily AI Business Briefing Feed</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">CSV Datasets Upload (Sales, Inventory, Financials)</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Pre-loaded Synthetic Business Profiles (Levi's, Apparel)</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>

                {/* Section 2: Predictive Risk & Advisor */}
                <tr className="bg-slate-50/80 font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                  <td colSpan={4} className="px-4 py-2 text-blue-900">2. Predictive Risk & Advisor Engine</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Historical Precedent Matching (2023-2024 Red Sea, Port Crises)</td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Interactive AI Voice Advisor (ElevenLabs Speech API)</td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Live News Extraction API (SerpApi Google News Feed)</td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Competitor Price Index & Active Promo Radar</td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Revenue at Risk Audit Formula Breakdown</td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>

                {/* Section 3: Advance Pro Features */}
                <tr className="bg-blue-50/80 font-bold text-blue-900 text-[11px] uppercase tracking-wider">
                  <td colSpan={4} className="px-4 py-2">3. Next-Gen Advance Pro Features (Enterprise Suite)</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">
                    <span className="flex items-center gap-2">
                      Autonomous Supply Chain Reordering Agents
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">Pro Advance</span>
                    </span>
                  </td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">
                    <span className="flex items-center gap-2">
                      Satellite Commodity Crop Yield Radar Integration
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">Pro Advance</span>
                    </span>
                  </td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">
                    <span className="flex items-center gap-2">
                      Custom Fine-Tuned On-Premise LLM Deployment
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">Pro Advance</span>
                    </span>
                  </td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">
                    <span className="flex items-center gap-2">
                      Multi-Tenant Enterprise SSO, Audit Logs & 24/7 SLA
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">Pro Advance</span>
                    </span>
                  </td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center bg-blue-50/20"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. About Section (Scroll Target for #about) */}
      <section id="about" className="py-20 px-8 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-[#2563EB]">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> About ForesightAI
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Building trust through data accuracy, transparency, and historical grounding.
          </h2>

          <div className="space-y-6 text-slate-600 text-base leading-relaxed text-left bg-white p-8 md:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
            <p>
              <strong className="text-slate-900 font-semibold">ForesightAI</strong> is an enterprise-grade decision intelligence platform engineered to protect organizations from supply chain vulnerabilities, commodity inflation, and global market volatility. By continuously ingesting verified real-time macro signals—from international freight indices and agricultural trade forecasts to competitor pricing feeds—ForesightAI translates overwhelming external data into concise, personalized operational guidance tailored specifically to your business model.
            </p>

            <p>
              Built on a foundation of mathematical rigor and strict fact-grounding, our AI models contextualize current disruptions against historical crisis databases and your company's actual internal inventory, sales, and financial records. Backed by verifiable calculation audits, live evidence citations, and enterprise-level security protocols, ForesightAI empowers executive leadership to make proactive decisions with absolute confidence—turning unpredictable global events into sustainable strategic advantages.
            </p>
          </div>
        </div>
      </section>

      {/* Footer (Matching Mockup Left Bottom Footer) */}
      <footer className="bg-white border-t border-slate-200 py-8 px-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base tracking-tight">
                f<span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent font-extrabold">o</span>resight<span className="text-[#2563EB]">AI</span>
              </span>
            </div>
            <span className="text-slate-400">|</span>
            <span>Better insights. Stronger businesses.</span>
          </div>

          <div className="flex items-center gap-6 text-slate-600">
            <a href="#home" className="hover:text-slate-900">Home</a>
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <a href="#about" className="hover:text-slate-900">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
