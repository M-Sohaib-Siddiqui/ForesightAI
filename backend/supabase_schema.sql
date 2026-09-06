-- ===================================================================
-- BUSINESS FORESIGHT - SUPABASE CLOUD POSTGRESQL & AUTH SCHEMA
-- Run this script in your Supabase Dashboard SQL Editor to set up
-- database tables, vector search (pgvector), and Row Level Security (RLS).
-- ===================================================================

-- 1. Enable pgvector extension for scenario similarity embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Business Profiles Table
CREATE TABLE IF NOT EXISTS public.business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    industry VARCHAR(255) NOT NULL,
    business_type VARCHAR(255) NOT NULL,
    business_model VARCHAR(255),
    primary_market VARCHAR(255) NOT NULL,
    target_customers TEXT,
    categories TEXT,
    sales_channels TEXT,
    suppliers TEXT,
    supplier_countries TEXT,
    import_dependency VARCHAR(255),
    operating_dependencies TEXT,
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own business profile"
    ON public.business_profiles
    FOR ALL
    USING (auth.uid() = user_id);

-- 3. Sales Records Table
CREATE TABLE IF NOT EXISTS public.sales_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sale_date DATE NOT NULL,
    product_category VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    units_sold INT NOT NULL,
    revenue_usd NUMERIC(12,2) NOT NULL,
    discount_pct NUMERIC(5,2) DEFAULT 0.00,
    sales_channel VARCHAR(255),
    region VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sales_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own sales data" ON public.sales_records FOR ALL USING (auth.uid() = user_id);

-- 4. Inventory Records Table
CREATE TABLE IF NOT EXISTS public.inventory_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    product_category VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    current_stock_units INT NOT NULL,
    safety_stock_units INT NOT NULL,
    reorder_point_units INT NOT NULL,
    unit_cost_usd NUMERIC(10,2) NOT NULL,
    supplier_name VARCHAR(255),
    supplier_country VARCHAR(100),
    lead_time_days INT NOT NULL,
    stock_status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.inventory_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own inventory data" ON public.inventory_records FOR ALL USING (auth.uid() = user_id);

-- 5. Historical Scenarios Knowledge Base with Vector Search
CREATE TABLE IF NOT EXISTS public.historical_scenarios (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date_range VARCHAR(100),
    category VARCHAR(255) NOT NULL,
    affected_sectors TEXT[],
    triggering_conditions TEXT,
    observable_indicators TEXT[],
    business_impacts TEXT[],
    successful_responses TEXT[],
    failed_responses TEXT[],
    lessons TEXT,
    source_references TEXT[],
    tags TEXT[],
    embedding VECTOR(1536) -- OpenAI text-embedding-3-small or Gemini vector
);

-- Index for high-speed HNSW vector similarity search
CREATE INDEX IF NOT EXISTS historical_scenarios_embedding_idx 
    ON public.historical_scenarios 
    USING hnsw (embedding vector_cosine_ops);

-- 6. Saved Daily Briefings
CREATE TABLE IF NOT EXISTS public.briefings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    briefing_date DATE NOT NULL,
    overall_business_risk VARCHAR(50) NOT NULL,
    developments_json JSONB NOT NULL,
    top_scenario_match JSONB,
    risk_analysis_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.briefings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own briefings" ON public.briefings FOR ALL USING (auth.uid() = user_id);

-- 7. Competitors Watchlist Table
CREATE TABLE IF NOT EXISTS public.competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    website_url VARCHAR(500) NOT NULL,
    tier VARCHAR(100),
    auto_detected BOOLEAN DEFAULT FALSE,
    avg_jeans_msrp_usd NUMERIC(10,2),
    active_promo TEXT,
    strength TEXT,
    vulnerability TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own competitor watchlist" ON public.competitors FOR ALL USING (auth.uid() = user_id);
