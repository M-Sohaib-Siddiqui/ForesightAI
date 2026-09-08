import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, TrendingUp, History, AlertTriangle, Mic, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Navigation */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-xs tracking-wider">
              FAI
            </div>
            <span className="font-semibold text-slate-900 tracking-tight text-lg">ForesightAI</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#security" className="hover:text-slate-900 transition-colors">Data Security</a>
            <Link href="/login" className="text-slate-700 hover:text-slate-900 font-medium">
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary">
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-medium text-slate-700 mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
          Enterprise AI Business Early-Warning Platform
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
          See what could affect your business <br className="hidden sm:inline" /> before it becomes a problem.
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          ForesightAI continuously monitors external macroeconomic & supply chain developments, compares them against historical scenario intelligence, and evaluates concrete risk & opportunity impacts personalized to your business data.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/onboarding" className="btn-primary text-base px-6 py-3">
            Customize Your Business
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#how-it-works" className="btn-secondary text-base px-6 py-3">
            See How It Works
          </a>
        </div>
      </section>

      {/* 5 Core Capabilities Section - Boxed Cards (3 Top & 2 Bottom Centered) */}
      <section id="features" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Five Core Product Capabilities</h2>
            <p className="text-slate-600 text-sm mt-2">Delivering grounded, explainable decision support without unverified claims.</p>
          </div>

          {/* Row 1: 3 Boxed Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-6 max-w-6xl mx-auto">
            <div className="enterprise-card">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">1. Daily AI Business Briefing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Prioritized daily briefing showing what happened, why it matters, short/medium-term impact, risk level, evidence source, and recommended actions.
              </p>
            </div>

            <div className="enterprise-card">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 mb-4">
                <History className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">2. Historical Scenario Intelligence</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Semantic retrieval matching current events to historical inflation periods, shipping bottlenecks, and geopolitical events with cited precedent evidence.
              </p>
            </div>

            <div className="enterprise-card">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">3. Impact & Risk Prediction</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Combines external news with internal sales, inventory, and cost files to estimate supply, cost, demand, revenue risk, and emerging opportunities.
              </p>
            </div>
          </div>

          {/* Row 2: 2 Boxed Cards (Centered) */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="enterprise-card">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 mb-4">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">4. AI Advisor with Voice</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Conversational advisor supporting text and microphone voice input, clearly separating retrieved facts, model estimates, and practical recommendations.
              </p>
            </div>

            <div className="enterprise-card">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">5. Competitor & Market Intelligence</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Auto-detects competitors + custom competitor URL addition to compare catalog pricing, MSRP benchmarks, and active promotional campaigns.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Logical Intelligence Pipeline</h2>
          <p className="text-slate-600 text-sm mt-2">How raw business data transforms into daily decision briefings.</p>
        </div>

        <div className="space-y-4">
          <div className="enterprise-card flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
            <div>
              <h4 className="font-medium text-slate-900">Personalized Business Profile & File Import</h4>
              <p className="text-slate-600 text-sm mt-1">Single clean form collecting operational context + high-speed validation for Sales, Inventory, and Financial CSV/XLSX files.</p>
            </div>
          </div>

          <div className="enterprise-card flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
            <div>
              <h4 className="font-medium text-slate-900">External Intelligence & Historical Matching</h4>
              <p className="text-slate-600 text-sm mt-1">Continuous ingestion of macro developments paired with vector-based historical scenario matching to surface proven lessons.</p>
            </div>
          </div>

          <div className="enterprise-card flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
            <div>
              <h4 className="font-medium text-slate-900">Explainable Risk Scoring & Interactive Advisor</h4>
              <p className="text-slate-600 text-sm mt-1">Deterministic risk modeling combined with grounded LLM reasoning accessible via daily briefing dashboard or hands-free voice chat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Statement */}
      <section id="security" className="py-12 bg-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ShieldCheck className="w-8 h-8 text-slate-900 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-900 text-lg mb-2">Enterprise Security & Data Privacy</h3>
          <p className="text-slate-600 text-sm leading-relaxed max-w-2xl mx-auto">
            Your uploaded sales, inventory, and cost files are strictly isolated per business tenant. All API keys and credentials are stored in secure environment variables and never exposed to client-side code.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-6 mt-auto text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>© 2026 ForesightAI Platform. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/onboarding" className="hover:text-white transition-colors">Demo Onboarding</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Direct Dashboard View</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
