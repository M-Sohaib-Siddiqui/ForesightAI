# Business Foresight — AI Early-Warning & Decision Support Platform

Business Foresight is an AI-powered business early-warning platform personalized to a business profile and synthetic datasets (Sales, Inventory, Financials). It continuously monitors external developments, matches them to historical scenario intelligence, predicts business-specific risks/opportunities, and offers an AI Business Advisor with text & microphone voice interactions.

---

## Technical Architecture

- **Frontend**: Next.js 14+ (App Router) + TypeScript + Tailwind CSS (Hosted on **Vercel**)
- **Backend**: Python FastAPI + Pandas + PyArrow + NumPy (Hosted on **Render**)
- **Database & Vector Store**: Supabase (PostgreSQL + `pgvector` + RLS + Storage)
- **AI & Voice Engine**: Grounded Gemini/OpenAI briefings + Web Speech API browser voice input/output

---

## Directory Structure (`D:\dev\business-foresight`)

```
D:\dev\business-foresight\
├── .gitignore
├── README.md
├── .env.example
├── vercel.json
├── render.yaml
├── backend/
│   ├── app/
│   │   ├── api/routes.py            # REST API router endpoints
│   │   ├── core/config.py           # Configuration & Levi's default profile
│   │   ├── data/                    # Synthetic Levi's CSVs & Scenarios JSON
│   │   └── services/                # Analytics, Scenario, Risk & Advisor engines
│   ├── requirements.txt
│   ├── test_runner.py               # Synchronous test verification runner
│   └── main.py
└── frontend/
    ├── app/                         # Next.js App Router (Landing, Onboarding, Dashboard)
    ├── package.json
    ├── .env.example
    └── .env.local
```

---

## Security & Environment File Strategy

All secret keys and database passwords remain strictly in **ignored environment files** (`.env`, `.env.local` listed in `.gitignore`).

- **Local Setup**:
  1. Copy `.env.example` to `.env` in `backend/` and `frontend/.env.local`.
  2. Populate your `GEMINI_API_KEY`, `OPENAI_API_KEY`, or `SUPABASE_URL`.
- **GitHub Strategy**: `.env` is never pushed to GitHub. The template `.env.example` file is pushed so collaborators or deployment platforms know which variables to set.

---

## Running Locally

### 1. Run Python FastAPI Backend
```bash
cd D:\dev\business-foresight\backend
python -m pip install -r requirements.txt
python main.py
```
- API Health Check: `http://localhost:8000/api/health`
- Interactive Swagger Docs: `http://localhost:8000/docs`
- Backend Verification: `python test_runner.py`

### 2. Run Next.js Frontend
```bash
cd D:\dev\business-foresight\frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser.

---

## Deployment Guide (GitHub + Vercel + Render)

### Step 1: Push Project to GitHub
```bash
cd D:\dev\business-foresight
git add .
git commit -m "Initial production release of Business Foresight platform"
git remote add origin https://github.com/YOUR_USERNAME/business-foresight.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Frontend on Vercel
1. Log in to [Vercel.com](https://vercel.com).
2. Click **New Project** and import your `business-foresight` GitHub repository.
3. Set **Framework Preset** to `Next.js` and Root Directory to `frontend`.
4. In Environment Variables, set:
   - `NEXT_PUBLIC_API_BASE_URL` = `https://your-backend.onrender.com`
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
5. Click **Deploy**.

### Step 3: Deploy Backend on Render
1. Log in to [Render.com](https://render.com).
2. Click **New Web Service** and connect your `business-foresight` GitHub repo.
3. Set **Root Directory** to `backend`.
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. In Environment Variables, add:
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY`
   - `DATABASE_URL` / `SUPABASE_URL`
7. Click **Create Web Service**.
