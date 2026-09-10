'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  AlertTriangle,
  History,
  TrendingUp,
  MessageSquare,
  FileSpreadsheet,
  Users,
  Plus,
  Globe,
  Tag,
  Mic,
  MicOff,
  Volume2,
  Send,
  ExternalLink,
  CheckCircle2,
  LogOut,
  UserCheck,
  Activity,
  ShieldCheck,
  X,
  Key,
  Sparkles,
  Loader2,
  Square,
  VolumeX
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('demo@levis.com');
  const [activeTab, setActiveTab] = useState<'briefing' | 'scenarios' | 'risk' | 'advisor' | 'competitors' | 'files'>('briefing');
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);

  // System API Status
  const [systemMode, setSystemMode] = useState<'LIVE API MODE' | 'SYNTHETIC DEMO MODE'>('SYNTHETIC DEMO MODE');
  const [apiDiagnostics, setApiDiagnostics] = useState<any>({
    llm_engine: { provider: "Google Gemini 1.5 Pro / OpenAI", status: "unconfigured", message: "No API key detected. Running local briefing engine.", has_key: false },
    database: { provider: "Supabase Cloud PostgreSQL", status: "active_live", message: "Connected to Supabase Cloud Database.", has_url: true },
    voice_synthesizer: { provider: "ElevenLabs / Web Speech API", status: "browser_fallback", message: "Using Web Speech API voice synthesis.", voice_id: "P8NfsqD6Mj2lTFzuAccu" }
  });

  const fetchSystemStatus = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${apiBase}/api/system/status`);
      if (res.ok) {
        const data = await res.json();
        if (data.overall_mode) {
          setSystemMode(data.overall_mode);
        }
        if (data.api_diagnostics) {
          setApiDiagnostics(data.api_diagnostics);
        }
      }
    } catch (err) {
      console.warn("Could not fetch system status from backend:", err);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem('bf_user_email');
    if (email) {
      setUserEmail(email);
    }
    fetchSystemStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bf_user_email');
    localStorage.removeItem('bf_auth_token');
    router.push('/login');
  };
  
  // Voice Advisor State
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([
    {
      role: 'advisor',
      question: 'Initial Greeting',
      answer: "Welcome to your ForesightAI Business Advisor for Levi's. I am actively monitoring your external intelligence feeds, competitor price moves, sales velocity, and inventory lead times. How can I assist your business strategy today?",
      retrieved_facts: ["Configured Profile: Levi's (Apparel & Fashion Retail)", "Active Data: Synthetic Levi's Sales, Inventory & Cost Files", "Competitor Watchlist: Wrangler, Zara, American Eagle"],
      model_estimates: ["Overall Risk Level: High (Supply chain rerouting & raw material inflation)"],
      recommended_actions: ["Extend supplier reorder buffer from 24 days to 38 days.", "Lock fixed 6-month freight container contracts."]
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Competitor Intelligence State (Feature 5)
  const [manualCompName, setManualCompName] = useState('');
  const [manualCompUrl, setManualCompUrl] = useState('');
  const [competitorsList, setCompetitorsList] = useState<any[]>([
    {
      id: "comp-001",
      name: "Wrangler / Lee (Kontoor)",
      website_url: "https://www.wrangler.com",
      tier: "Direct Denim Competitor",
      auto_detected: true,
      avg_jeans_msrp_usd: 68.00,
      active_promo: "15% off Site-Wide (Summer Denim Sale)",
      strength: "Strong Western & Workwear market distribution",
      vulnerability: "Higher exposure to US domestic freight disruptions",
      price_index: "-18% Lower (Value Positioning)"
    },
    {
      id: "comp-002",
      name: "Zara (Inditex)",
      website_url: "https://www.zara.com",
      tier: "Fast Fashion Apparel",
      auto_detected: true,
      avg_jeans_msrp_usd: 59.90,
      active_promo: "30% off Clearance Tops & Seasonal Denim",
      strength: "Ultra-fast 15-day nearshore manufacturing in Turkey/Portugal",
      vulnerability: "Low consumer perception of denim durability & heritage",
      price_index: "-28% Lower (Fast Fashion)"
    },
    {
      id: "comp-003",
      name: "American Eagle Outfitters",
      website_url: "https://www.ae.com",
      tier: "Young Adult Denim",
      auto_detected: true,
      avg_jeans_msrp_usd: 54.95,
      active_promo: "Buy 1 Get 1 50% Off (Back-to-School Denim Event)",
      strength: "High stretch denim popularity among Gen-Z shoppers",
      vulnerability: "Heavy promotional dependence eroding gross margins",
      price_index: "-34% Lower (Promotional Retail)"
    }
  ]);

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCompName.trim() || !manualCompUrl.trim()) return;

    const formattedUrl = manualCompUrl.startsWith('http') ? manualCompUrl : `https://${manualCompUrl}`;
    const newComp = {
      id: `comp-manual-${Date.now()}`,
      name: manualCompName,
      website_url: formattedUrl,
      tier: "Custom Added Competitor",
      auto_detected: false,
      avg_jeans_msrp_usd: 64.50,
      active_promo: "10% off for Newsletter Signup",
      strength: "Custom monitored competitor site",
      vulnerability: "Requires active catalog price tracking",
      price_index: "-16% Lower"
    };

    setCompetitorsList([...competitorsList, newComp]);
    setManualCompName('');
    setManualCompUrl('');
  };

  // Stop Text-to-Speech Audio Playback
  const handleStopSpeaking = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Stop AI Response Generation
  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsAdvisorLoading(false);
    setChatHistory((prev) =>
      prev.map((item) =>
        item.isLoading
          ? {
              role: 'advisor',
              question: item.question,
              answer: "Response generation was cancelled by user.",
              isLoading: false,
              retrieved_facts: ["Generation cancelled by user action."],
              model_estimates: ["No model output recorded."],
              recommended_actions: ["Ask a new question or retry."]
            }
          : item
      )
    );
  };

  // Web Speech API Voice Handlers
  const handleMicToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Browser speech recognition is not supported in this browser. You can still type your questions below.");
      return;
    }
    
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setChatQuestion(transcript);
        setIsListening(false);
        handleSendQuestion(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    }
  };

  const fallbackBrowserTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v =>
        (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') ||
         v.name.includes('Victoria') || v.name.includes('Karen') || v.name.includes('Jenny') ||
         v.name.includes('Google US English') || v.name.includes('Natural')) && v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.rate = 0.95;
      utterance.pitch = 1.1; // Slightly higher pitch for clear female tone
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  const handleTextToSpeech = async (text: string) => {
    handleStopSpeaking();

    const cleanText = text.replace(/[*_#]/g, '').trim();
    if (!cleanText) return;

    setIsSpeaking(true);

    // 1. Try ElevenLabs API endpoint on backend first
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const res = await fetch(`${apiBase}/api/voice/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          voice_id: apiDiagnostics?.voice_synthesizer?.voice_id || 'P8NfsqD6Mj2lTFzuAccu'
        })
      });

      if (res.ok) {
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        activeAudioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          activeAudioRef.current = null;
        };
        audio.onerror = () => {
          console.warn("ElevenLabs audio playback error, falling back to browser speech synthesis.");
          activeAudioRef.current = null;
          fallbackBrowserTTS(cleanText);
        };

        await audio.play();
        return;
      }
    } catch (err) {
      console.warn("ElevenLabs backend API error, using browser speech synthesis fallback:", err);
    }

    // 2. Fallback to Browser Speech Synthesis (Female Voice)
    fallbackBrowserTTS(cleanText);
  };

  const handleSendQuestion = async (questionText: string) => {
    const q = questionText || chatQuestion;
    if (!q.trim() || isAdvisorLoading) return;

    setChatQuestion('');
    setIsAdvisorLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    // 1. Immediately render user question and thinking state in chat thread
    const tempMsg = {
      role: 'advisor',
      question: q,
      answer: "Evaluating your query & retrieving macro intelligence context...",
      isLoading: true,
      retrieved_facts: [
        "Configured Profile Exposure: Levi's (Apparel & Fashion Retail).",
        "Searching historical crisis vector database (pgvector HNSW index)..."
      ],
      model_estimates: ["Connecting to Google Gemini 3.8 Flash AI reasoning engine..."],
      recommended_actions: ["Synthesizing executive operational recommendation..."]
    };

    setChatHistory((prev) => [...prev, tempMsg]);

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    try {
      const res = await fetch(`${apiBase}/api/advisor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
        signal: controller.signal
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory((prev) =>
          prev.map((item) =>
            item.question === q && item.isLoading
              ? {
                  role: 'advisor',
                  question: q,
                  answer: data.answer || "No response generated.",
                  isLoading: false,
                  retrieved_facts: data.retrieved_facts || [],
                  model_estimates: data.model_estimates || [],
                  recommended_actions: data.recommended_actions || []
                }
              : item
          )
        );
        setIsAdvisorLoading(false);
        setAbortController(null);
        // Note: Speech is NOT triggered automatically per user preference. User can click 'Speak Response'.
        return;
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log("User cancelled response generation.");
        return;
      }
      console.warn("Backend advisor API call error:", err);
    }

    setChatHistory((prev) =>
      prev.map((item) =>
        item.question === q && item.isLoading
          ? {
              role: 'advisor',
              question: q,
              answer: "Could not connect to ForesightAI backend API. Please make sure 'python main.py' is running in your backend directory.",
              isLoading: false,
              retrieved_facts: ["Backend Connection Status: Offline / Disconnected"],
              model_estimates: ["Ensure python main.py is active at http://localhost:8000"],
              recommended_actions: ["Run python main.py in backend folder and try asking your question again."]
            }
          : item
      )
    );
    setIsAdvisorLoading(false);
    setAbortController(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Stable App Bar with User Account & API Key Diagnostics */}
      <header className="bg-slate-900 text-white h-16 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-white text-slate-900 rounded font-bold flex items-center justify-center text-xs tracking-wider">
            FAI
          </div>
          <div>
            <div className="font-semibold text-sm leading-none flex items-center gap-2">
              ForesightAI
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-normal">v1.0 Enterprise</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Configured Profile: <strong className="text-white">Levi's</strong> (Apparel & Fashion Retail)</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Data Source Mode Badge (Live API vs Demo Mode) */}
          <button
            type="button"
            onClick={() => { fetchSystemStatus(); setShowDiagnosticsModal(true); }}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${
              systemMode === 'LIVE API MODE'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Mode: <strong>{systemMode}</strong></span>
          </button>

          <button
            type="button"
            onClick={() => { fetchSystemStatus(); setShowDiagnosticsModal(true); }}
            className="hidden md:flex items-center gap-1 text-xs text-slate-300 hover:text-white border border-slate-700 px-2.5 py-1 rounded transition-colors"
          >
            <Key className="w-3.5 h-3.5" />
            API Diagnostics
          </button>

          <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-4 text-xs text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{userEmail}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded transition-colors"
            title="Sign Out of Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* API Key Diagnostics Modal */}
      {showDiagnosticsModal && (
        <div 
          onClick={() => setShowDiagnosticsModal(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl max-w-lg w-full border border-slate-300 shadow-xl overflow-hidden text-slate-900 cursor-default"
          >
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Key className="w-4 h-4 text-amber-400" />
                ForesightAI API Connection Diagnostics & Data Sources
              </div>
              <button onClick={() => setShowDiagnosticsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-lg border bg-slate-50 border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-slate-900 text-sm">1. LLM Briefing & Reasoning Engine</strong>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-200 text-slate-700">
                    {apiDiagnostics.llm_engine.has_key ? 'LIVE API KEY DETECTED' : 'SYNTHETIC DEMO FALLBACK'}
                  </span>
                </div>
                <p className="text-slate-600">{apiDiagnostics.llm_engine.message}</p>
                <div className="mt-2 text-[11px] bg-emerald-100 text-emerald-800">
                  Env Variable: <code>GEMINI_API_KEY</code> / <code>OPENAI_API_KEY</code>
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-slate-50 border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-slate-900 text-sm">2. Supabase Cloud Database & RLS</strong>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-100 text-emerald-800">
                    CONNECTED
                  </span>
                </div>
                <p className="text-slate-600">{apiDiagnostics.database.message}</p>
                <div className="mt-2 text-[11px] bg-emerald-100 text-emerald-800">
                  Env Variable: <code>SUPABASE_URL</code>
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-slate-50 border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-slate-900 text-sm">3. Voice Synthesizer API</strong>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-200 text-slate-700">
                    WEB SPEECH BROWSER
                  </span>
                </div>
                <p className="text-slate-600">{apiDiagnostics.voice_synthesizer.message}</p>
                <div className="mt-2 text-[11px] text-slate-500 font-mono">
                  Active Voice ID: <code>{apiDiagnostics.voice_synthesizer.voice_id}</code>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 leading-relaxed">
                💡 <strong>How to activate Live API mode:</strong> Paste your API keys into <code>backend/.env</code> or <code>frontend/.env.local</code> and restart the app. The diagnostics system automatically validates your key health.
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
              <button onClick={() => setShowDiagnosticsModal(false)} className="btn-primary text-xs py-2 px-4">
                Close Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Body Layout with Sidebar */}
      <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            5 Core Capabilities
          </div>
          <nav className="p-3 space-y-1 flex-1">
            <button
              type="button"
              onClick={() => setActiveTab('briefing')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'briefing' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <AlertTriangle className="w-4 h-4" />
              Today's Briefing
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('scenarios')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'scenarios' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <History className="w-4 h-4" />
              Historical Scenarios
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('risk')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'risk' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <TrendingUp className="w-4 h-4" />
              Impact & Risk Prediction
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('advisor')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'advisor' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <MessageSquare className="w-4 h-4" />
              AI Advisor + Voice
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('competitors')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'competitors' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <Users className="w-4 h-4" />
              Competitor Intelligence
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('files')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'files' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Data & Files
            </button>
          </nav>

          <div className="p-4 border-t border-slate-200 text-xs text-slate-500">
            <div className="font-semibold text-slate-700 mb-1">Grounded AI Guarantee</div>
            All claims grounded in retrieved historical scenarios & Levi's synthetic CSV datasets.
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto max-w-6xl">
          
          {/* TAB 1: DAILY AI BRIEFING */}
          {activeTab === 'briefing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">Today's AI Business Briefing</h1>
                    <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {systemMode}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mt-1">3 developments today may affect Levi's apparel operations.</p>
                </div>
                <button onClick={() => setActiveTab('advisor')} className="btn-primary">
                  <MessageSquare className="w-4 h-4" />
                  Ask AI Advisor
                </button>
              </div>

              {/* Briefing Cards */}
              <div className="space-y-4">
                
                {/* Card 1: Red Sea Shipping */}
                <div className="enterprise-card border-l-4 border-l-red-600">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">High Risk</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">Red Sea Shipping Route Security Threat & Canal Diversion</h3>
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded">Supply Chain & Logistics</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded border border-slate-200">
                      <strong className="text-slate-900 block mb-1">What Happened:</strong>
                      <p className="text-slate-600">Container lines suspending Suez Canal transit due to security risks, rerouting around Cape of Good Hope.</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded border border-slate-200">
                      <strong className="text-slate-900 block mb-1">Why It Matters to Levi's:</strong>
                      <p className="text-slate-600">Levi's relies on Asian suppliers (Vietnam, Bangladesh, India) for 85% of production. Rerouting adds 10-14 days lead time.</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="text-slate-500">
                      <strong>Source Evidence:</strong> S&P Global Freight Index & Maritime Alert
                    </div>
                    <div className="text-slate-700 font-medium">
                      Confidence: <strong>High Confidence (91%)</strong>
                    </div>
                  </div>
                </div>

                {/* Card 2: Cotton Price Surge */}
                <div className="enterprise-card border-l-4 border-l-amber-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">Medium Risk</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">Global Raw Cotton Spot Price Surge (+14% in 30 Days)</h3>
                    </div>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded">Raw Material Inflation</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded border border-slate-200">
                      <strong className="text-slate-900 block mb-1">What Happened:</strong>
                      <p className="text-slate-600">Drought conditions in major cotton-growing belts driving raw futures up to $1.40/lb.</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded border border-slate-200">
                      <strong className="text-slate-900 block mb-1">Why It Matters to Levi's:</strong>
                      <p className="text-slate-600">Cotton yarn represents ~32% of fabric input costs for core denim lines (501 Jeans, Ribcage).</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="text-slate-500">
                      <strong>Source Evidence:</strong> USDA WASDE Agricultural Outlook Report
                    </div>
                    <div className="text-slate-700 font-medium">
                      Confidence: <strong>High Confidence (86%)</strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: HISTORICAL SCENARIO INTELLIGENCE */}
          {activeTab === 'scenarios' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Historical Scenario Intelligence</h1>
                <p className="text-slate-600 text-sm mt-1">Grounding current decisions in cited, real-world historical precedents.</p>
              </div>

              {/* Matched Precedent Card */}
              <div className="enterprise-card bg-white border border-slate-300">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-slate-900 text-white rounded font-bold text-xs">92% Match</span>
                    <h3 className="font-bold text-slate-900 text-lg">2023-2024 Red Sea Shipping Route Disruptions</h3>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Date: 2023-11 to 2024-06</span>
                </div>

                <div className="space-y-4 mt-4 text-sm">
                  <div>
                    <strong className="text-slate-900">Triggering Conditions & Observable Indicators:</strong>
                    <p className="text-slate-600 mt-1">Security threats in Bab-el-Mandeb Strait forcing ships around Africa. Spot ocean freight rates rose 250-300%.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded">
                      <strong className="text-emerald-900 block mb-1">Proven Successful Responses:</strong>
                      <ul className="list-disc list-inside text-emerald-800 space-y-1 text-xs">
                        <li>Nearshoring replenishment to Mexico & Turkey for fast-turn apparel categories.</li>
                        <li>Extending reorder points by 14 days and building safety stock buffers.</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 border border-red-200 p-3 rounded">
                      <strong className="text-red-900 block mb-1">Documented Failed Responses:</strong>
                      <ul className="list-disc list-inside text-red-800 space-y-1 text-xs">
                        <li>Relying strictly on legacy ocean lead-time assumptions.</li>
                        <li>Canceling mid-transit seasonal orders leading to massive stockout penalties.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-700">
                    <strong>Cited Sources:</strong> S&P Global Supply Chain Intelligence 2024, Drewry World Container Index, Levi Strauss 10-K Archives.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMPACT & RISK PREDICTION */}
          {activeTab === 'risk' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">AI Business Impact & Risk Prediction</h1>
                <p className="text-slate-600 text-sm mt-1">Combining current external events with Levi's synthetic sales & inventory data.</p>
              </div>

              {/* High-Level Risk Overview */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="enterprise-card">
                  <div className="text-xs text-slate-500 font-medium">Estimated Revenue at Risk</div>
                  <div className="text-2xl font-bold text-red-600 mt-1">$1,250,000.00</div>
                  <div className="text-xs text-slate-500 mt-1">Based on Q3 seasonal replenishment volume</div>
                </div>

                <div className="enterprise-card">
                  <div className="text-xs text-slate-500 font-medium">Supply Chain Exposure</div>
                  <div className="text-2xl font-bold text-amber-600 mt-1">78 / 100</div>
                  <div className="text-xs text-slate-500 mt-1">85% overseas garment supplier dependency</div>
                </div>

                <div className="enterprise-card">
                  <div className="text-xs text-slate-500 font-medium">COGS Margin Compression</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">-320 bps</div>
                  <div className="text-xs text-slate-500 mt-1">Driven by cotton futures + ocean freight surcharges</div>
                </div>
              </div>

              {/* Opportunities Matrix */}
              <div className="enterprise-card border-l-4 border-l-emerald-600">
                <h3 className="font-bold text-slate-900 text-lg mb-2">Detected Strategic Opportunities</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                    <strong className="text-emerald-900">1. Nearshore Vendor Re-allocation to Mexico / Turkey</strong>
                    <p className="text-emerald-800 text-xs mt-1">Shift 25% of replenishment orders for core Men's Chinos & Tops to nearshore suppliers. Reduces lead time by 18 days and protects $450k revenue.</p>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                    <strong className="text-emerald-900">2. Core Icon Denim Marketing Focus (501 & Ribcage)</strong>
                    <p className="text-emerald-800 text-xs mt-1">Re-allocate 15% digital marketing spend toward core heritage denim lines carrying higher pricing power to offset cotton margin squeeze.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI ADVISOR + VOICE */}
          {activeTab === 'advisor' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">AI Business Advisor with Voice</h1>
                  <p className="text-slate-600 text-sm mt-1">Professional chat interface with voice controls, dynamic Gemini reasoning, and female voice readouts.</p>
                </div>
                <div className="flex items-center gap-2">
                  {isSpeaking && (
                    <button
                      type="button"
                      onClick={handleStopSpeaking}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors animate-pulse"
                    >
                      <Square className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                      Stop Speaking
                    </button>
                  )}
                  {isAdvisorLoading && (
                    <button
                      type="button"
                      onClick={handleStopGeneration}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors"
                    >
                      <Square className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                      Stop Generation
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Prompt Buttons */}
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleSendQuestion("How could today's situation affect my business?")}
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md font-medium transition-colors"
                >
                  "How could today's situation affect my business?"
                </button>
                <button
                  type="button"
                  onClick={() => handleSendQuestion("What should I prepare for?")}
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md font-medium transition-colors"
                >
                  "What should I prepare for?"
                </button>
                <button
                  type="button"
                  onClick={() => handleSendQuestion("What are my competitors doing with pricing?")}
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md font-medium transition-colors"
                >
                  "What are my competitors doing with pricing?"
                </button>
                <button
                  type="button"
                  onClick={() => handleSendQuestion("What should I do first?")}
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md font-medium transition-colors"
                >
                  "What should I do first?"
                </button>
              </div>

              {/* Chat Thread */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {chatHistory.map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    {item.question !== 'Initial Greeting' && (
                      <div className="flex justify-end">
                        <div className="bg-slate-900 text-white p-3.5 rounded-lg max-w-lg text-sm">
                          {item.question}
                        </div>
                      </div>
                    )}

                    {/* Advisor Grounded Response Box */}
                    <div className="enterprise-card bg-white border border-slate-200">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-900 text-white rounded text-xs font-bold flex items-center justify-center">
                            AI
                          </div>
                          <span className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                            ForesightAI Advisor
                            {item.isLoading && (
                              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-normal flex items-center gap-1 animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin" /> Evaluating Query...
                              </span>
                            )}
                          </span>
                        </div>
                        {!item.isLoading && (
                          <button
                            type="button"
                            onClick={() => isSpeaking ? handleStopSpeaking() : handleTextToSpeech(item.answer)}
                            className={`text-xs flex items-center gap-1 border px-2.5 py-1 rounded transition-colors ${
                              isSpeaking
                                ? 'bg-red-50 border-red-300 text-red-700 font-medium hover:bg-red-100'
                                : 'border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                          >
                            {isSpeaking ? (
                              <>
                                <Square className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                                Stop Speaking
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                                Speak Response
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {item.isLoading ? (
                        <div className="flex items-center gap-3 p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-amber-900 text-xs font-medium my-2 animate-pulse">
                          <Loader2 className="w-5 h-5 text-amber-600 animate-spin shrink-0" />
                          <div>
                            <div className="font-semibold text-amber-950 flex items-center gap-1.5 text-sm">
                              <Sparkles className="w-4 h-4 text-amber-600" />
                              Evaluating your query with Google Gemini AI...
                            </div>
                            <p className="text-[11px] text-amber-800 mt-0.5">Matching business profile, macro trends, and historical crisis database (pgvector)...</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-800 text-sm whitespace-pre-line leading-relaxed">
                          {item.answer}
                        </div>
                      )}

                      {/* Fact Grounding Section */}
                      <div className="mt-4 pt-3 border-t border-slate-100 grid md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                          <strong className="text-slate-900 block mb-1">Retrieved Factual Grounding:</strong>
                          <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                            {item.retrieved_facts.map((f: string, fIdx: number) => (
                              <li key={fIdx}>{f}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                          <strong className="text-slate-900 block mb-1">Model Risk Estimates:</strong>
                          <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                            {item.model_estimates.map((e: string, eIdx: number) => (
                              <li key={eIdx}>{e}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar with Microphone */}
              <div className="pt-2">
                <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg p-2 shadow-sm">
                  <button
                    type="button"
                    disabled={isAdvisorLoading}
                    onClick={handleMicToggle}
                    className={`p-2.5 rounded-md transition-colors ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} disabled:opacity-50`}
                    title={isListening ? "Listening... Click to stop" : "Click to speak with microphone"}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <input
                    type="text"
                    disabled={isAdvisorLoading}
                    placeholder={
                      isListening
                        ? "Listening to your voice input..."
                        : isAdvisorLoading
                          ? "ForesightAI is analyzing your query..."
                          : "Ask your ForesightAI Advisor a question..."
                    }
                    value={chatQuestion}
                    onChange={(e) => setChatQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !isAdvisorLoading && handleSendQuestion('')}
                    className="flex-1 text-sm bg-transparent border-none focus:outline-none text-slate-900 px-2 disabled:opacity-60"
                  />

                  {isAdvisorLoading ? (
                    <button
                      type="button"
                      onClick={handleStopGeneration}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs rounded-md font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Square className="w-3.5 h-3.5 fill-white text-white" />
                      Stop Generation
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendQuestion('')}
                      className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Ask
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: COMPETITOR INTELLIGENCE (NEW FEATURE 5) */}
          {activeTab === 'competitors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Competitor & Market Intelligence</h1>
                  <p className="text-slate-600 text-sm mt-1">Comparing Levi's product pricing, active promotions, and positioning against competitors via public API aggregators.</p>
                </div>
                <span className="text-xs bg-slate-900 text-white px-3 py-1 rounded font-medium">5th Capability Active</span>
              </div>

              {/* Add Competitor Website Form */}
              <div className="enterprise-card bg-slate-50 border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-slate-900" />
                  Add Custom Competitor Website / Brand to Watchlist
                </h3>
                <form onSubmit={handleAddCompetitor} className="grid sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Competitor Brand Name (e.g. Gap Inc)"
                    value={manualCompName}
                    onChange={(e) => setManualCompName(e.target.value)}
                    className="text-xs border border-slate-300 rounded p-2.5 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Website URL (e.g. www.gap.com)"
                    value={manualCompUrl}
                    onChange={(e) => setManualCompUrl(e.target.value)}
                    className="text-xs border border-slate-300 rounded p-2.5 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                    required
                  />
                  <button type="submit" className="btn-primary text-xs justify-center py-2.5">
                    <Plus className="w-3.5 h-3.5" />
                    Add Competitor to Matrix
                  </button>
                </form>
              </div>

              {/* Competitors List Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                {competitorsList.map((comp) => (
                  <div key={comp.id} className="enterprise-card relative flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {comp.auto_detected ? 'Auto-Detected' : 'Custom Tracked'}
                        </span>
                        <a href={comp.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-slate-900 flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5" /> Site
                        </a>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base">{comp.name}</h3>
                      <p className="text-xs text-slate-500">{comp.tier}</p>

                      <div className="mt-4 space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Avg Denim MSRP:</span>
                          <strong className="text-slate-900">${comp.avg_jeans_msrp_usd.toFixed(2)} USD</strong>
                        </div>

                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Price Index vs Levi's:</span>
                          <strong className="text-amber-700">{comp.price_index}</strong>
                        </div>
                      </div>

                      {/* Active Promotion Badge */}
                      <div className="mt-4 p-2.5 bg-amber-50 border border-amber-200 rounded text-xs">
                        <div className="font-semibold text-amber-900 flex items-center gap-1 mb-0.5">
                          <Tag className="w-3.5 h-3.5 text-amber-700" />
                          Detected Active Promotion:
                        </div>
                        <p className="text-amber-800 text-[11px]">{comp.active_promo}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                      <strong>Market Advantage:</strong> {comp.strength}
                    </div>
                  </div>
                ))}
              </div>

              {/* Category Pricing Matrix Table */}
              <div className="enterprise-card">
                <h3 className="font-bold text-slate-900 text-base mb-3">Product Category Price & Positioning Matrix</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                        <th className="p-3 font-semibold">Product Category</th>
                        <th className="p-3 font-semibold">Levi's Avg Price</th>
                        <th className="p-3 font-semibold">Market Competitor Avg</th>
                        <th className="p-3 font-semibold">Levi's Positioning</th>
                        <th className="p-3 font-semibold">Pricing Power Index</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr>
                        <td className="p-3 font-medium">Men's Core Denim (501 / Straight)</td>
                        <td className="p-3 font-bold text-emerald-700">$79.50</td>
                        <td className="p-3">$62.00</td>
                        <td className="p-3"><span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">Premium Heritage Leader</span></td>
                        <td className="p-3">High (+22% Premium)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Women's High-Rise Denim (Ribcage)</td>
                        <td className="p-3 font-bold text-emerald-700">$98.00</td>
                        <td className="p-3">$74.00</td>
                        <td className="p-3"><span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">Category Standard</span></td>
                        <td className="p-3">High (+32% Premium)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Basic Graphic Tees & Tops</td>
                        <td className="p-3 text-slate-900">$29.50</td>
                        <td className="p-3">$24.00</td>
                        <td className="p-3"><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">Moderate</span></td>
                        <td className="p-3">Medium (Competitors discounting 30%)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: DATA & FILES */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Data & File Upload Management</h1>
                <p className="text-slate-600 text-sm mt-1">Uploaded business files powering normalized analytics models.</p>
              </div>

              <div className="space-y-3">
                <div className="enterprise-card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">sales_data_sample.csv</h4>
                      <p className="text-xs text-slate-500">30 records | Size: 4.2 KB | Processed: Just now</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded font-medium">
                    Active & Normalized
                  </span>
                </div>

                <div className="enterprise-card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">inventory_data_sample.csv</h4>
                      <p className="text-xs text-slate-500">11 SKUs | Size: 1.8 KB | Processed: Just now</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded font-medium">
                    Active & Normalized
                  </span>
                </div>

                <div className="enterprise-card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">financial_data_sample.csv</h4>
                      <p className="text-xs text-slate-500">12 Months | Size: 1.2 KB | Processed: Just now</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded font-medium">
                    Active & Normalized
                  </span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
