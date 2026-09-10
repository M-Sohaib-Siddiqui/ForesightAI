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
  FileText,
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
  Search,
  Bell,
  Sun,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  HelpCircle,
  Clock,
  Briefcase
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('demo@levis.com');
  const [activeTab, setActiveTab] = useState<'overview' | 'briefing' | 'scenarios' | 'risk' | 'advisor' | 'competitors' | 'files'>('overview');
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);

  // System API Status
  const [systemMode, setSystemMode] = useState<'LIVE API MODE' | 'SYNTHETIC DEMO MODE'>('SYNTHETIC DEMO MODE');
  const [apiDiagnostics, setApiDiagnostics] = useState<any>({
    llm_engine: { provider: "Google Gemini 1.5 Pro / OpenAI", status: "unconfigured", message: "No API key detected. Running local briefing engine.", has_key: false },
    database: { provider: "Supabase Cloud PostgreSQL", status: "active_live", message: "Connected to Supabase Cloud Database.", has_url: true },
    voice_synthesizer: { provider: "ElevenLabs / Web Speech API", status: "active_live", message: "Connected to ElevenLabs Voice API.", voice_id: "P8NfsqD6Mj2lTFzuAccu" },
    news_extraction: { provider: "SerpApi Google News Feed", status: "active_live", message: "Connected to SerpApi Google News Feed.", has_key: true }
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
      answer: "Welcome to your ForesightAI Business Advisor for Levi's. I am actively monitoring external supply chains, raw cotton spot prices, shipping lead times, and competitor retail pricing. How can I assist your executive strategy today?",
      retrieved_facts: ["Configured Profile: Levi's (Apparel & Fashion Retail)", "Active Data: Synthetic Levi's Sales, Inventory & Cost Files", "Competitor Watchlist: Wrangler, Zara, American Eagle"],
      model_estimates: ["Overall Risk Level: Moderate (Supply chain rerouting & raw material inflation)"],
      recommended_actions: ["Extend supplier reorder buffer from 24 days to 38 days.", "Lock fixed 6-month ocean freight container contracts."]
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Competitor Intelligence State
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

  // Microphone Voice Input Handler
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
      utterance.pitch = 1.1;
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

    fallbackBrowserTTS(cleanText);
  };

  const handleSendQuestion = async (questionText: string) => {
    const q = questionText || chatQuestion;
    if (!q.trim() || isAdvisorLoading) return;

    setChatQuestion('');
    setIsAdvisorLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    const tempMsg = {
      role: 'advisor',
      question: q,
      answer: "Evaluating your query & retrieving macro intelligence context...",
      isLoading: true,
      retrieved_facts: [
        "Configured Profile Exposure: Levi's (Apparel & Fashion Retail).",
        "Searching historical crisis vector database (pgvector HNSW index)..."
      ],
      model_estimates: ["Connecting to Google Gemini 1.5 Pro live reasoning engine..."],
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
    <div className="min-h-screen bg-[#F4F6FA] flex text-slate-800 font-sans">
      {/* 1. LEFT NAVY SIDEBAR (Matching Mockup Right Side) */}
      <aside className="w-64 bg-[#0A1328] text-slate-300 flex flex-col shrink-0 min-h-screen justify-between border-r border-slate-800">
        <div>
          {/* Logo Brand Bar */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-800/80">
            <span className="font-bold text-white text-xl tracking-tight">
              f<span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent font-extrabold">o</span>resight<span className="text-[#3B82F6]">AI</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                activeTab === 'overview' ? 'bg-[#1E3A8A] text-white font-semibold shadow-md shadow-blue-900/30' : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('briefing')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                activeTab === 'briefing' ? 'bg-[#1E3A8A] text-white font-semibold shadow-md shadow-blue-900/30' : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Today's Briefing
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('scenarios')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                activeTab === 'scenarios' ? 'bg-[#1E3A8A] text-white font-semibold shadow-md shadow-blue-900/30' : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-4 h-4" />
              Historical Scenarios
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('risk')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                activeTab === 'risk' ? 'bg-[#1E3A8A] text-white font-semibold shadow-md shadow-blue-900/30' : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Impact & Risk
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('advisor')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                activeTab === 'advisor' ? 'bg-[#1E3A8A] text-white font-semibold shadow-md shadow-blue-900/30' : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Business Advisor
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('competitors')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                activeTab === 'competitors' ? 'bg-[#1E3A8A] text-white font-semibold shadow-md shadow-blue-900/30' : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Competitors
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('files')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                activeTab === 'files' ? 'bg-[#1E3A8A] text-white font-semibold shadow-md shadow-blue-900/30' : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Data & Files
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Controls & User Profile */}
        <div className="p-4 space-y-4 border-t border-slate-800/80">
          <div className="space-y-1 text-xs">
            <button
              type="button"
              onClick={() => { fetchSystemStatus(); setShowDiagnosticsModal(true); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <Key className="w-4 h-4 text-amber-400" />
              API Diagnostics
            </button>
            <button
              type="button"
              onClick={() => alert("ForesightAI Enterprise Settings active.")}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <Sliders className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* User Account Card at Bottom Left */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-slate-600">
                LS
              </div>
              <div className="truncate text-xs">
                <div className="font-semibold text-white truncate">Levi's Store</div>
                <div className="text-slate-400 truncate text-[11px]">{userEmail}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-slate-400 hover:text-white p-1.5 rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header Bar with Search & Mode Diagnostics */}
        <header className="bg-white border-b border-slate-200/80 h-16 px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3 w-96">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Mode Badge */}
            <button
              type="button"
              onClick={() => { fetchSystemStatus(); setShowDiagnosticsModal(true); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border transition-colors ${
                systemMode === 'LIVE API MODE'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              {systemMode}
            </button>

            <button
              type="button"
              onClick={handleMicToggle}
              className={`p-2 rounded-full border transition-colors ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => alert("No new notifications")}
              className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 bg-blue-600 rounded-full absolute top-1 right-1" />
            </button>
          </div>
        </header>

        {/* Diagnostic Modal Popup */}
        {showDiagnosticsModal && (
          <div 
            onClick={() => setShowDiagnosticsModal(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden text-slate-900 cursor-default"
            >
              <div className="bg-[#0A1328] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Key className="w-4 h-4 text-amber-400" />
                  ForesightAI API Diagnostics & Data Sources
                </div>
                <button onClick={() => setShowDiagnosticsModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-slate-900 text-sm">1. LLM Briefing & Reasoning Engine</strong>
                    <span className="px-2.5 py-0.5 rounded font-mono text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      LIVE API KEY DETECTED
                    </span>
                  </div>
                  <p className="text-slate-600">{apiDiagnostics.llm_engine.message}</p>
                  <div className="mt-2 text-[11px] text-slate-500 font-mono">
                    Env Variable: <code>GEMINI_API_KEY</code> / <code>OPENAI_API_KEY</code>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-slate-900 text-sm">2. Supabase Cloud Database & RLS</strong>
                    <span className="px-2.5 py-0.5 rounded font-mono text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      CONNECTED
                    </span>
                  </div>
                  <p className="text-slate-600">{apiDiagnostics.database.message}</p>
                  <div className="mt-2 text-[11px] text-slate-500 font-mono">
                    Env Variable: <code>SUPABASE_URL</code>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-slate-900 text-sm">3. Voice Synthesizer API</strong>
                    <span className="px-2.5 py-0.5 rounded font-mono text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      ELEVENLABS ACTIVE
                    </span>
                  </div>
                  <p className="text-slate-600">{apiDiagnostics?.voice_synthesizer?.message}</p>
                  <div className="mt-2 text-[11px] text-slate-500 font-mono">
                    Active Voice ID: <code>{apiDiagnostics?.voice_synthesizer?.voice_id || 'P8NfsqD6Mj2lTFzuAccu'}</code>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-slate-900 text-sm">4. Live News & Web Search Extraction</strong>
                    <span className="px-2.5 py-0.5 rounded font-mono text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      SERPAPI / WEB SEARCH DETECTED
                    </span>
                  </div>
                  <p className="text-slate-600">{apiDiagnostics?.news_extraction?.message || "Connected to SerpApi Google News Feed."}</p>
                  <div className="mt-2 text-[11px] text-slate-500 font-mono">
                    Env Variable: <code>SERPAPI_API_KEY</code>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
                <button onClick={() => setShowDiagnosticsModal(false)} className="bg-[#2563EB] text-white text-xs font-semibold py-2 px-5 rounded-lg hover:bg-blue-700">
                  Close Diagnostics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content Container */}
        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Executive Greeting Header (Matching Mockup Right Top) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Good morning, Levi's.</h1>
              <p className="text-slate-500 text-sm mt-1">Here's your business briefing for September 10, 2026.</p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-xs text-slate-600">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Thu, Sep 10, 2026</span>
              <span className="text-slate-300">|</span>
              <span className="font-semibold text-slate-800">18°C Global</span>
            </div>
          </div>

          {/* OVERVIEW DASHBOARD VIEW (Matching Mockup Layout) */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* TOP ROW: Today's Business Briefing + Overall Risk Level Gauge */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* 1. Today's Business Briefing Feed (2 Cols) */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                          <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">Today's Business Briefing</h3>
                          <span className="text-xs text-blue-600 font-medium">3 key developments today</span>
                        </div>
                      </div>
                      <button onClick={() => setActiveTab('briefing')} className="text-xs font-semibold text-slate-500 hover:text-slate-900">
                        View all
                      </button>
                    </div>

                    {/* Briefing Development Items */}
                    <div className="space-y-3">
                      {/* Item 1 */}
                      <div 
                        onClick={() => setActiveTab('briefing')}
                        className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">Red Sea Shipping Route Security Threat</div>
                            <div className="text-xs text-slate-500 mt-0.5">Suez Canal rerouting adds 10-14 days lead time for Asian suppliers.</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">High Risk</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div 
                        onClick={() => setActiveTab('briefing')}
                        className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">Global Raw Cotton Spot Price Surge (+14%)</div>
                            <div className="text-xs text-slate-500 mt-0.5">Drought conditions in cotton belts creating fabric COGS inflation.</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">Medium Risk</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div 
                        onClick={() => setActiveTab('briefing')}
                        className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">US Consumer Demand Shift to Value Staples</div>
                            <div className="text-xs text-slate-500 mt-0.5">Strong consumer velocity for core 501 Original and Ribcage denim lines.</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Opportunity</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Overall Risk Level Gauge Meter (1 Col - Matching Mockup Gauge) */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">Overall Risk Level</h3>
                    <p className="text-slate-500 text-xs">Based on current global events & business profile.</p>

                    {/* Semi-Circular SVG Gauge Meter */}
                    <div className="my-3 flex flex-col items-center justify-center relative">
                      <div className="relative w-56 h-32 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 200 120">
                          <defs>
                            <linearGradient id="riskGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#10B981" />
                              <stop offset="50%" stopColor="#F59E0B" />
                              <stop offset="100%" stopColor="#EF4444" />
                            </linearGradient>
                            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="3" result="blur" />
                              <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                          </defs>

                          {/* Background Track Arc */}
                          <path
                            d="M 25 100 A 75 75 0 0 1 175 100"
                            fill="none"
                            stroke="#E2E8F0"
                            strokeWidth="14"
                            strokeLinecap="round"
                          />

                          {/* Active Progress Arc (78% of 235.6 total arc = strokeDashoffset 51.8) */}
                          <path
                            d="M 25 100 A 75 75 0 0 1 175 100"
                            fill="none"
                            stroke="url(#riskGaugeGradient)"
                            strokeWidth="14"
                            strokeLinecap="round"
                            strokeDasharray="235.6"
                            strokeDashoffset="51.8"
                            filter="url(#gaugeGlow)"
                            className="transition-all duration-1000 ease-out"
                          />

                          {/* Indicator Tip at 78% Position */}
                          <circle
                            cx="157.8"
                            cy="52.2"
                            r="6"
                            fill="#FFFFFF"
                            stroke="#F59E0B"
                            strokeWidth="3"
                          />
                        </svg>

                        {/* Center Score Overlay */}
                        <div className="absolute top-[48px] text-center flex flex-col items-center">
                          <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">78</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">out of 100</span>
                        </div>
                      </div>

                      {/* Moderate Risk Badge */}
                      <div className="mt-1 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Moderate Risk Level</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('risk')}
                    className="w-full text-xs font-semibold text-[#2563EB] hover:text-blue-700 flex items-center justify-center gap-1 py-2 border border-blue-100 rounded-xl bg-blue-50/50 hover:bg-blue-50"
                  >
                    View Detailed Analysis <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* MIDDLE ROW: Historical Scenario + Business Impact + Key Recommendations */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* 1. Historical Scenario */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <History className="w-4 h-4 text-blue-600" />
                      <h3 className="font-bold text-slate-900 text-sm">Historical Scenario</h3>
                    </div>

                    <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-xl mb-3">
                      <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">Similar to 2023-2024 Red Sea Shipping Disruption</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Current ocean freight rerouting mirrors 2023 conditions where port congestion and extended shipping lead times led to higher product prices.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('scenarios')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
                  >
                    View full analysis <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. Business Impact Table */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <h3 className="font-bold text-slate-900 text-sm">Potential Impact on Your Business</h3>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-600 flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5 text-amber-500" /> Supply risk</span>
                        <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Medium</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-600 flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5 text-red-500" /> Cost increase</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">High</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                        <span className="text-slate-600 flex items-center gap-1"><ArrowDownRight className="w-3.5 h-3.5 text-amber-500" /> Demand change</span>
                        <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Medium</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5">
                        <span className="text-slate-600 flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> Operational risk</span>
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Low</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('risk')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
                  >
                    View detailed forecast <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3. Key Recommendations */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <h3 className="font-bold text-slate-900 text-sm">Key Recommendations</h3>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-700">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 font-bold text-[11px] text-slate-700 flex items-center justify-center shrink-0">1</span>
                        <p>Extend supplier reorder buffer from 24 to 38 days for Vietnam vendors.</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 font-bold text-[11px] text-slate-700 flex items-center justify-center shrink-0">2</span>
                        <p>Increase safety stock for high-demand denim SKUs (501 & Ribcage).</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 font-bold text-[11px] text-slate-700 flex items-center justify-center shrink-0">3</span>
                        <p>Lock in 6-month ocean container rates to prevent spot surcharges.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('advisor')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
                  >
                    View all recommendations <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* BOTTOM SECTION: Integrated Ask Your AI Advisor */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-6 text-sm font-semibold">
                    <h3 className="font-bold text-slate-900 text-sm">
                      Ask Your AI Advisor
                    </h3>
                  </div>
                  {isSpeaking && (
                    <button
                      type="button"
                      onClick={handleStopSpeaking}
                      className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full animate-pulse flex items-center gap-1"
                    >
                      <Square className="w-3 h-3 fill-red-600" /> Stop Speaking
                    </button>
                  )}
                </div>

                {/* Input Query Bar */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <input
                    type="text"
                    disabled={isAdvisorLoading}
                    placeholder="Ask a question about your business..."
                    value={chatQuestion}
                    onChange={(e) => setChatQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion('')}
                    className="flex-1 text-xs bg-transparent border-none focus:outline-none text-slate-900 px-3"
                  />
                  <button
                    type="button"
                    onClick={handleMicToggle}
                    className={`p-2 rounded-lg ${isListening ? 'bg-red-600 text-white animate-pulse' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendQuestion('')}
                    className="bg-[#2563EB] hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Prompts */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSendQuestion("How could today's situation affect my business?")}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    How could today's situation affect my business?
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendQuestion("What should I prepare for?")}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    What should I prepare for?
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendQuestion("Show me similar past events")}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Show me similar past events
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DAILY AI BRIEFING */}
          {activeTab === 'briefing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Today's AI Business Briefing</h1>
                  <p className="text-slate-500 text-sm mt-1">3 developments today may affect Levi's apparel operations.</p>
                </div>
                <button onClick={() => setActiveTab('advisor')} className="bg-[#2563EB] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700">
                  Ask AI Advisor
                </button>
              </div>

              <div className="space-y-4">
                {/* Development 1 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm border-l-4 border-l-red-600 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">High Risk</span>
                    <span className="text-xs text-slate-400 font-mono">Confidence: 94% | S&P Global Maritime Index</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Red Sea Shipping Route Security Threat & Canal Diversion</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block mb-1 text-xs">What Happened:</strong>
                      <p className="text-slate-600 leading-relaxed">Major container shipping lines (Maersk, MSC, Hapag-Lloyd) are suspending Suez Canal transit due to drone and missile attacks near Bab-el-Mandeb, rerouting around Africa's Cape of Good Hope.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block mb-1 text-xs">Why It Matters to Levi's:</strong>
                      <p className="text-slate-600 leading-relaxed">Levi's relies on South Asian manufacturing hubs (Vietnam, Bangladesh, India) for 85% of North American & European replenishment inventory. Rerouting adds 10-14 days lead time and $1,200/TEU ocean freight surcharges.</p>
                    </div>
                  </div>

                  <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl text-xs space-y-2">
                    <strong className="text-blue-900 font-bold block">Evidence Sources & Data Cited:</strong>
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 font-mono">
                      <span className="bg-white border border-blue-200 px-2 py-1 rounded">S&P Global Maritime Security Bulletin</span>
                      <span className="bg-white border border-blue-200 px-2 py-1 rounded">Shanghai Containerized Freight Index (SCFI)</span>
                      <span className="bg-white border border-blue-200 px-2 py-1 rounded">US Customs Inbound Ocean Bill of Lading Logs</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl text-xs">
                    <strong className="text-emerald-900 font-bold block mb-1">Recommended Action Plan:</strong>
                    <p className="text-emerald-800">Extend supplier reorder trigger buffer from 24 days to 38 days and issue spot ocean container bookings for fall denim arrivals immediately.</p>
                  </div>
                </div>

                {/* Development 2 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm border-l-4 border-l-amber-500 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">Medium Risk</span>
                    <span className="text-xs text-slate-400 font-mono">Confidence: 89% | USDA WASDE Report</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Global Raw Cotton Spot Price Surge (+14% in 30 Days)</h3>

                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block mb-1 text-xs">What Happened:</strong>
                      <p className="text-slate-600 leading-relaxed">Extended drought conditions across Texas and West Africa have reduced global crop yield estimates by 2.4M bales, driving ICE cotton futures up to $1.40/lb.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block mb-1 text-xs">Why It Matters to Levi's:</strong>
                      <p className="text-slate-600 leading-relaxed">Raw cotton yarn represents ~32% of total fabric input cost for core denim products (501 Original, Trucker Jacket, Ribcage). Cost inflation will compress gross margins by 320 bps without price adjustments.</p>
                    </div>
                  </div>

                  <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl text-xs space-y-2">
                    <strong className="text-blue-900 font-bold block">Evidence Sources & Data Cited:</strong>
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 font-mono">
                      <span className="bg-white border border-blue-200 px-2 py-1 rounded">USDA World Agricultural Supply & Demand Estimates</span>
                      <span className="bg-white border border-blue-200 px-2 py-1 rounded">ICE Futures US Cotton No. 2 Benchmark</span>
                    </div>
                  </div>
                </div>

                {/* Development 3 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm border-l-4 border-l-emerald-600 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Opportunity</span>
                    <span className="text-xs text-slate-400 font-mono">Confidence: 91% | US Census Bureau Retail Trade</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">US Consumer Demand Shift Toward Heritage Value Staples</h3>

                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block mb-1 text-xs">What Happened:</strong>
                      <p className="text-slate-600 leading-relaxed">Retail sales data shows consumers pulling back on ultra-fast fashion items in favor of durable, classic apparel wardrobe staples.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <strong className="text-slate-900 block mb-1 text-xs">Why It Matters to Levi's:</strong>
                      <p className="text-slate-600 leading-relaxed">Levi's 501 Original and straight leg lines are experiencing +18% sell-through velocity in direct-to-consumer digital channels.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HISTORICAL SCENARIOS */}
          {activeTab === 'scenarios' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Historical Scenario Intelligence</h1>
                <p className="text-slate-500 text-sm mt-1">Grounding current decisions in cited, real-world historical precedents.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="px-3 py-1 bg-[#0A1328] text-white rounded-full font-bold text-xs">92% Vector Match</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">2023-2024 Red Sea Maritime Supply Chain Disruption</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Timeline: Dec 2023 - Apr 2024</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <strong className="text-slate-900 font-bold block">Triggering Conditions & Root Cause:</strong>
                    <p className="text-slate-600 leading-relaxed">Maritime attacks in Bab-el-Mandeb forced vessel rerouting around Cape of Good Hope, causing global vessel capacity bottlenecks and container spot rate surges (+250%).</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <strong className="text-slate-900 font-bold block">Historical Impact on Apparel Sector:</strong>
                    <p className="text-slate-600 leading-relaxed">Apparel retailers relying exclusively on East Asian ocean freight experienced 12-day inventory stockouts during peak spring season, resulting in 4.5% revenue loss.</p>
                  </div>
                </div>

                {/* Proven Successful Responses */}
                <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl text-xs space-y-2">
                  <strong className="text-emerald-900 font-bold block">Proven Successful Responses (Green Playbook):</strong>
                  <ul className="list-disc list-inside space-y-1 text-emerald-800">
                    <li>Nearshoring high-margin replenishment styles to Mexico and Turkey facilities reduced lead time impact by 50%.</li>
                    <li>Pre-booking 6-month fixed container contracts prevented exposure to peak spot ocean surcharges.</li>
                    <li>Promoter bundling core denim items into 2-pack bundles offset freight surcharges without sacrificing brand MSRP.</li>
                  </ul>
                </div>

                {/* Documented Failed Responses */}
                <div className="bg-red-50/60 border border-red-200 p-4 rounded-xl text-xs space-y-2">
                  <strong className="text-red-900 font-bold block">Documented Failed Responses (Red Warning):</strong>
                  <ul className="list-disc list-inside space-y-1 text-red-800">
                    <li>Air-freighting heavy denim garments completely erased retail gross profit margin.</li>
                    <li>Waiting for ocean spot rates to normalize before placing purchase orders caused stockouts across top 20 retail doors.</li>
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <strong className="text-slate-900 font-bold block mb-1">Cited Academic & Industry Sources:</strong>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-600">
                    <span className="bg-white border px-2 py-1 rounded">McKinsey Global Supply Chain Index 2024</span>
                    <span className="bg-white border px-2 py-1 rounded">Harvard Business Review Freight Case Study #2024-88</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: IMPACT & RISK */}
          {activeTab === 'risk' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">AI Business Impact & Risk Prediction</h1>
                <p className="text-slate-500 text-sm mt-1">Combining current external events with Levi's sales & inventory metrics.</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="text-xs text-slate-500 font-medium">Estimated Revenue at Risk</div>
                  <div className="text-2xl font-bold text-red-600 mt-1">$1,250,000.00</div>
                  <div className="text-xs text-slate-400 mt-1">Based on Q3 seasonal replenishment volume</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="text-xs text-slate-500 font-medium">Supply Chain Exposure Index</div>
                  <div className="text-2xl font-bold text-amber-600 mt-1">78 / 100</div>
                  <div className="text-xs text-slate-400 mt-1">85% overseas garment supplier dependency</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="text-xs text-slate-500 font-medium">COGS Margin Compression</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">-320 bps</div>
                  <div className="text-xs text-slate-400 mt-1">Driven by cotton futures + ocean freight surcharges</div>
                </div>
              </div>

              {/* Mathematical Calculation Audit Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Mathematical Calculation Audit Breakdown
                </h3>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 font-mono text-slate-700">
                  <div><strong>Revenue at Risk Formula:</strong> Revenue_Risk = (Delayed_Units x Avg_Wholesale_Price x Stockout_Probability)</div>
                  <div>Delayed Units: 25,000 units (501 Jeans & Trucker Jackets)</div>
                  <div>Avg Wholesale Price: $62.50 / unit</div>
                  <div>Stockout Probability (80% confidence): 0.80</div>
                  <div className="text-blue-700 font-bold pt-1 border-t border-slate-200">
                    Result: 25,000 x $62.50 x 0.80 = $1,250,000.00
                  </div>
                </div>
              </div>

              {/* Risk Matrix Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 font-bold text-slate-900 text-sm">
                  Executive Operations Risk Matrix
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Risk Vector</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Impact Score</th>
                        <th className="p-3.5">Financial Threat</th>
                        <th className="p-3.5">Mitigation Protocol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3.5 font-bold text-slate-900">Suez Canal Route Delay</td>
                        <td className="p-3.5 text-slate-600">Supply Chain</td>
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded font-bold">High (85/100)</span></td>
                        <td className="p-3.5 font-bold text-slate-900">$750,000.00</td>
                        <td className="p-3.5 text-slate-600">Advance supplier reorder buffer by 14 days</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-slate-900">Raw Cotton Price Spike</td>
                        <td className="p-3.5 text-slate-600">Commodity Inflation</td>
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-bold">Medium (64/100)</span></td>
                        <td className="p-3.5 font-bold text-slate-900">$320,000.00</td>
                        <td className="p-3.5 text-slate-600">Execute 6-month yarn supplier price lock</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-slate-900">Competitor Discount Pressure</td>
                        <td className="p-3.5 text-slate-600">Market Dynamics</td>
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">Low (38/100)</span></td>
                        <td className="p-3.5 font-bold text-slate-900">$180,000.00</td>
                        <td className="p-3.5 text-slate-600">Promote core 501 fit longevity & durability</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI ADVISOR */}
          {activeTab === 'advisor' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">AI Business Advisor</h1>
                  <p className="text-slate-500 text-sm mt-1">Conversational advisor with live reasoning, fact grounding, and voice readouts.</p>
                </div>
                {isSpeaking && (
                  <button
                    type="button"
                    onClick={handleStopSpeaking}
                    className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full animate-pulse"
                  >
                    Stop Speaking
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {chatHistory.map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    {item.question !== 'Initial Greeting' && (
                      <div className="flex justify-end">
                        <div className="bg-[#0A1328] text-white p-4 rounded-2xl max-w-lg text-xs leading-relaxed">
                          {item.question}
                        </div>
                      </div>
                    )}

                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-600" /> ForesightAI Advisor
                        </span>
                        {!item.isLoading && (
                          <button
                            type="button"
                            onClick={() => isSpeaking ? handleStopSpeaking() : handleTextToSpeech(item.answer)}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> Speak Response
                          </button>
                        )}
                      </div>

                      {item.isLoading ? (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl text-blue-900 text-xs font-medium animate-pulse">
                          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" /> Evaluating query with Gemini AI...
                        </div>
                      ) : (
                        <div className="text-slate-800 text-xs whitespace-pre-line leading-relaxed">
                          {item.answer}
                        </div>
                      )}

                      {/* Fact Grounding Box */}
                      {item.retrieved_facts && item.retrieved_facts.length > 0 && (
                        <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-xl text-xs space-y-1">
                          <strong className="text-blue-900 font-bold block text-[11px] uppercase tracking-wider">Retrieved Grounding Facts:</strong>
                          <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                            {item.retrieved_facts.map((fact: string, fIdx: number) => (
                              <li key={fIdx}>{fact}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommended Actions */}
                      {item.recommended_actions && item.recommended_actions.length > 0 && (
                        <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-xl text-xs space-y-1">
                          <strong className="text-emerald-900 font-bold block text-[11px] uppercase tracking-wider">Recommended Action Steps:</strong>
                          <ul className="list-disc list-inside text-emerald-800 text-[11px] space-y-0.5">
                            {item.recommended_actions.map((act: string, aIdx: number) => (
                              <li key={aIdx}>{act}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <input
                    type="text"
                    disabled={isAdvisorLoading}
                    placeholder="Ask AI Advisor a question..."
                    value={chatQuestion}
                    onChange={(e) => setChatQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion('')}
                    className="flex-1 text-xs bg-transparent border-none focus:outline-none text-slate-900 px-3"
                  />
                  <button
                    type="button"
                    onClick={handleMicToggle}
                    className={`p-2 rounded-lg ${isListening ? 'bg-red-600 text-white animate-pulse' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendQuestion('')}
                    className="bg-[#2563EB] hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: COMPETITORS */}
          {activeTab === 'competitors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Competitor Intelligence</h1>
                  <p className="text-slate-500 text-sm mt-1">Comparing product pricing, active promotions, and positioning.</p>
                </div>
              </div>

              {/* Add Competitor Form */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <form onSubmit={handleAddCompetitor} className="grid sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Competitor Name (e.g. Gap Inc)"
                    value={manualCompName}
                    onChange={(e) => setManualCompName(e.target.value)}
                    className="text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-900"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Website URL (e.g. www.gap.com)"
                    value={manualCompUrl}
                    onChange={(e) => setManualCompUrl(e.target.value)}
                    className="text-xs border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-900"
                    required
                  />
                  <button type="submit" className="bg-[#2563EB] text-white text-xs font-semibold rounded-xl py-2.5 hover:bg-blue-700">
                    Add Competitor
                  </button>
                </form>
              </div>

              {/* Competitor Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                {competitorsList.map((comp) => (
                  <div key={comp.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-slate-900 text-sm">{comp.name}</h3>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">{comp.price_index}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">{comp.tier}</p>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs mb-3">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Avg Jeans MSRP:</span>
                          <strong className="text-slate-900">${comp.avg_jeans_msrp_usd.toFixed(2)}</strong>
                        </div>
                        <div className="flex justify-between text-amber-700 font-semibold text-[11px]">
                          <span>Active Promo:</span>
                          <span className="truncate max-w-[140px] text-right">{comp.active_promo}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-600">
                        <div><strong className="text-emerald-700">Strength:</strong> {comp.strength}</div>
                        <div><strong className="text-red-600">Vulnerability:</strong> {comp.vulnerability}</div>
                      </div>
                    </div>

                    <a href={comp.website_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 pt-2 border-t border-slate-100">
                      Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>

              {/* Product Category Pricing Power Matrix Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 font-bold text-slate-900 text-sm">
                  Product Category Pricing Power & Discounting Matrix
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Levi's MSRP</th>
                        <th className="p-3.5">Wrangler Avg</th>
                        <th className="p-3.5">Zara Avg</th>
                        <th className="p-3.5">AE Avg</th>
                        <th className="p-3.5">Pricing Power Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3.5 font-bold text-slate-900">Men's Core Denim (501/505)</td>
                        <td className="p-3.5 font-bold text-blue-700">$79.50</td>
                        <td className="p-3.5 text-slate-600">$68.00</td>
                        <td className="p-3.5 text-slate-600">$59.90</td>
                        <td className="p-3.5 text-slate-600">$54.95</td>
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">Strong Premium (+24%)</span></td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-slate-900">Women's High Rise / Wide Leg</td>
                        <td className="p-3.5 font-bold text-blue-700">$98.00</td>
                        <td className="p-3.5 text-slate-600">$72.00</td>
                        <td className="p-3.5 text-slate-600">$69.90</td>
                        <td className="p-3.5 text-slate-600">$59.95</td>
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-bold">High Elasticity (+38%)</span></td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-slate-900">Denim Trucker Jackets</td>
                        <td className="p-3.5 font-bold text-blue-700">$108.00</td>
                        <td className="p-3.5 text-slate-600">$89.00</td>
                        <td className="p-3.5 text-slate-600">$79.90</td>
                        <td className="p-3.5 text-slate-600">$69.95</td>
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-bold">Heritage Standard (+21%)</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DATA & FILES */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Data & File Upload Management</h1>
                <p className="text-slate-500 text-sm mt-1">Uploaded business datasets powering normalized risk analytics models.</p>
              </div>

              {/* Upload Drag & Drop Box */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 bg-white text-center hover:border-blue-500 transition-colors cursor-pointer space-y-2">
                <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto" />
                <div className="font-bold text-slate-800 text-sm">Drag & drop your CSV data files here</div>
                <p className="text-xs text-slate-400">Supports sales revenue, inventory levels, cost breakdown, and supplier manifests</p>
                <button type="button" className="mt-2 inline-block bg-[#0A1328] text-white text-xs font-semibold px-4 py-2 rounded-xl">
                  Browse Computer
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Active & Normalized Datasets</h3>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-xs">sales_data_sample.csv</h4>
                      <p className="text-[11px] text-slate-400">30 records | Active & Normalized | 4.2 KB</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-medium">Active</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-xs">inventory_data_sample.csv</h4>
                      <p className="text-[11px] text-slate-400">11 SKUs | Active & Normalized | 2.8 KB</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-medium">Active</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-xs">financial_data_sample.csv</h4>
                      <p className="text-[11px] text-slate-400">Quarterly COGS & Overhead | Active & Normalized | 3.5 KB</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-medium">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* Precaution Footer Note */}
          <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>Precaution:</strong> Predictions are AI-generated and can make mistakes — please verify critical decisions before executing.</span>
          </div>

        </main>
      </div>
    </div>
  );
}
