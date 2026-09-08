# ForesightAI — Enterprise AI Business Early-Warning & Decision Support Platform

**ForesightAI** (`FAI`) is an enterprise-grade AI-powered business early-warning and decision-support web platform. It continuously monitors macroeconomic developments, supply chain shocks, and market shifts, matches them to historical scenario intelligence using vector similarity, calculates revenue risk, auto-detects competitors, and provides an interactive AI Business Advisor with text and voice capabilities.

---

## Key Capabilities (5 Core Engines)

1. **Daily AI Business Briefing**: Personalized executive summary of external developments impacting your industry, business type, and primary market.
2. **Historical Scenario Intelligence**: `pgvector`-powered HNSW similarity matching against historical crises (e.g., Red Sea rerouting, pandemic bottlenecks, tariff spikes).
3. **Impact & Risk Prediction Engine**: Quantitative revenue-at-risk estimation, inventory delay projections, and actionable mitigation strategies.
4. **AI Business Advisor with Voice**: Real-time business strategist powered by LLM models with dual voice integration (Browser Web Speech API + ElevenLabs API).
5. **Competitor & Market Intelligence**: Automated market competitor auto-detection, custom competitor URL tracking via Search & Shopping aggregators (SerpApi / DataForSEO / OpenGraph), price monitoring, and promotional shift alerts.

---

## Technical Architecture

- **Frontend**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS (Hosted on **Vercel**)
- **Backend**: Python FastAPI + Pandas + PyArrow + NumPy (Hosted on **Render**)
- **Database & Vector Store**: Supabase (PostgreSQL + `pgvector` + RLS Policies + Storage)
- **AI & Voice Engine**: Grounded Gemini / OpenAI models + Web Speech API + ElevenLabs API
- **Market Data APIs**: SerpApi / DataForSEO / OpenGraph metadata scrapers

---

## Repository Structure

```
ForesightAI/
├── .gitignore                      # Environment, build & secret exclusion rules
├── README.md                       # Master project documentation
├── vercel.json                     # Vercel deployment configuration
├── render.yaml                     # Render backend web service configuration
├── supabase_schema.sql             # Supabase PostgreSQL schema, pgvector & RLS policies
├── backend/
│   ├── app/
│   │   ├── api/routes.py           # REST API router endpoints (Briefings, Scenarios, Risk, Advisor, Competitors, Diagnostics)
│   │   ├── core/config.py          # Platform settings, feature flags & default business profile
│   │   ├── data/                   # Synthetic business datasets (Sales, Inventory, Financials, Scenarios)
│   │   └── services/               # Analytics, Scenario Matching, Risk Prediction & Competitor Intelligence engines
│   ├── requirements.txt            # Python dependencies
│   ├── test_runner.py              # Suite verification & diagnostic test runner
│   └── main.py                     # FastAPI application entrypoint
└── frontend/
    ├── app/                        # Next.js App Router (Landing page, Dynamic Onboarding, Dashboard, Auth)
    └── package.json                # Frontend dependencies & Next.js build scripts
```

---

## Environment & Live Diagnostics Strategy

ForesightAI supports **Dual Execution Mode**:
- **LIVE API MODE** (🟢): Active when live API keys are provided in backend/frontend environment variables.
- **SYNTHETIC DEMO MODE** (🟡): Automatically active as an immediate fallback using grounded demo data if keys are missing or invalid, ensuring 100% uptime and seamless previewing.

System status and key consumption can be inspected live inside the application via the **API Diagnostics Modal** on the dashboard or the `/api/system/status` API endpoint.

### Required Environment Variables

Configure these variables in your environment or deployment platforms (Vercel & Render):

#### Backend (`Render` / local environment):
- `GEMINI_API_KEY`: Google Gemini API key for LLM briefings and advisor responses.
- `OPENAI_API_KEY`: OpenAI API key (optional alternative/fallback for LLM & embeddings).
- `SUPABASE_URL`: Supabase project URL (`https://<project-id>.supabase.co`).
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for server-side DB operations).
- `DATABASE_URL`: PostgreSQL connection string.
- `ELEVENLABS_API_KEY`: ElevenLabs API key for realistic AI voice synthesis (optional).
- `ELEVENLABS_VOICE_ID`: ElevenLabs Voice ID (optional).
- `SERPAPI_API_KEY`: SerpApi key for live Google Shopping & competitor price tracking.

#### Frontend (`Vercel` / local environment):
- `NEXT_PUBLIC_API_BASE_URL`: Base URL of the backend API (e.g. `http://localhost:8000` or `https://your-backend.onrender.com`).
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous client key.

---

## Local Development & Verification

### 1. Run Python FastAPI Backend
```bash
cd backend
python -m pip install -r requirements.txt
python main.py
```
- **API Health Check**: `http://localhost:8000/api/health`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **Engine Verification**: `python test_runner.py`

### 2. Run Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser.

---

## Deployment Guide (GitHub + Vercel + Render)

### 1. Repository
```bash
git remote add origin https://github.com/M-Sohaib-Siddiqui/ForesightAI.git
git push -u origin main --tags
```

### 2. Frontend Deployment (Vercel)
1. Import your `ForesightAI` repository on [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Add `NEXT_PUBLIC_API_BASE_URL` pointing to your Render backend URL.
4. Click **Deploy**.

### 3. Backend Deployment (Render)
1. Create a **New Web Service** on [Render](https://render.com) connected to `ForesightAI`.
2. Set Root Directory to `backend`.
3. Set Build Command: `pip install -r requirements.txt`
4. Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Configure environment variables (`GEMINI_API_KEY`, `SUPABASE_URL`, etc.) under Render Environment Settings.
