'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Upload, AlertCircle, ArrowRight, ArrowLeft, FileText } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State initialized with Levi's synthetic demonstration profile
  const [profile, setProfile] = useState({
    name: "Levi's",
    legal_name: "Levi Strauss & Co.",
    industry: "Apparel & Fashion Retail",
    business_type: "Omnichannel / Direct-to-Consumer",
    business_model: "Brand Manufacturer & Retailer",
    primary_market: "United States",
    target_customers: "Men, Women, Kids & Denim Enthusiasts",
    categories: "Men's Jeans, Women's Jeans, Tops, Outerwear, Pants/Chinos, Accessories, Kids",
    sales_channels: "Official Website, Retail Stores, Wholesale Partners",
    suppliers: "Denim Corp Vietnam, South Asia Garments Bangladesh, Textile Mills India, LoomWorks China, LeatherCraft Mexico",
    supplier_countries: "Vietnam, Bangladesh, India, China, Mexico, Turkey",
    import_dependency: "High (85% overseas garment manufacturing)",
    operating_dependencies: "Ocean shipping logistics, raw cotton pricing, overseas port operations, retail foot traffic",
    currency: "USD"
  });

  // Upload States
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [inventoryFile, setInventoryFile] = useState<File | null>(null);
  const [financialFile, setFinancialFile] = useState<File | null>(null);

  const [salesValidation, setSalesValidation] = useState<any>(null);
  const [inventoryValidation, setInventoryValidation] = useState<any>(null);
  const [financialValidation, setFinancialValidation] = useState<any>(null);

  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSimulateSalesUpload = async () => {
    setSalesValidation({
      valid: true,
      total_rows: 30,
      missing_columns: [],
      summary: { total_revenue: 69455.50, total_units_sold: 843, average_discount_pct: 4.33 },
      preview: [
        { Date: "2026-06-01", "Product Category": "Men's Jeans", Product: "501 Original Jeans", "Units Sold": 42, "Revenue (USD)": 4195.80 },
        { Date: "2026-06-02", "Product Category": "Women's Jeans", Product: "Ribcage Jeans", "Units Sold": 31, "Revenue (USD)": 3410.00 },
        { Date: "2026-06-03", "Product Category": "Men's Jeans", Product: "511 Slim Men's Jeans", "Units Sold": 27, "Revenue (USD)": 4050.00 }
      ]
    });
  };

  const handleSimulateInventoryUpload = async () => {
    setInventoryValidation({
      valid: true,
      total_skus: 11,
      low_stock_skus: 2,
      total_inventory_value_usd: 124890.50,
      preview: [
        { SKU: "SKU-MJ-501", "Product Category": "Men's Jeans", "Current Stock Units": 1420, "Safety Stock Units": 500, "Unit Cost (USD)": 28.50 },
        { SKU: "SKU-WJ-RIB", "Product Category": "Women's Jeans", "Current Stock Units": 980, "Safety Stock Units": 450, "Unit Cost (USD)": 29.10 },
        { SKU: "SKU-OW-TRK", "Product Category": "Outerwear", "Current Stock Units": 230, "Safety Stock Units": 300, "Unit Cost (USD)": 42.00 }
      ]
    });
  };

  const handleSimulateFinancialUpload = async () => {
    setFinancialValidation({
      valid: true,
      total_months: 12,
      average_gross_margin_pct: 41.2,
      total_revenue_usd: 184600000.0,
      preview: [
        { Month: "2026-01", "Total Revenue (USD)": 12800000, "COGS (USD)": 7100000, "Gross Profit (USD)": 5700000 },
        { Month: "2026-02", "Total Revenue (USD)": 12150000, "COGS (USD)": 6750000, "Gross Profit (USD)": 5400000 }
      ]
    });
  };

  const handleCompleteOnboarding = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-semibold text-slate-900 text-lg">Business Foresight</div>
          <div className="text-xs text-slate-500 font-medium">Onboarding & Data Personalization</div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-3xl mx-auto px-6 py-10 w-full flex-1">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Customize your Business Foresight</h1>
          <p className="text-slate-600 text-sm mt-1">
            Personalize early-warning monitoring and risk analysis around your company's actual operations.
          </p>
        </div>

        {/* Multi-step progress bar */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 text-xs font-semibold ${step === 1 ? 'text-slate-900' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            Business Profile
          </div>
          <div className="w-12 h-px bg-slate-200"></div>
          <div className={`flex items-center gap-2 text-xs font-semibold ${step === 2 ? 'text-slate-900' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            Data File Uploads
          </div>
        </div>

        {/* STEP 1: Business Profile Form */}
        {step === 1 && (
          <div className="enterprise-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Company Context & Dependencies</h2>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-mono">Levi's Demo Profile Pre-filled</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded p-2.5 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded p-2.5 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Business Type</label>
                <input
                  type="text"
                  value={profile.business_type}
                  onChange={(e) => setProfile({ ...profile, business_type: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded p-2.5 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Primary Market</label>
                <input
                  type="text"
                  value={profile.primary_market}
                  onChange={(e) => setProfile({ ...profile, primary_market: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded p-2.5 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Product Categories</label>
              <input
                type="text"
                value={profile.categories}
                onChange={(e) => setProfile({ ...profile, categories: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded p-2.5 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Supplier Manufacturing Countries</label>
              <input
                type="text"
                value={profile.supplier_countries}
                onChange={(e) => setProfile({ ...profile, supplier_countries: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded p-2.5 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Import Dependency & Logistics Context</label>
              <input
                type="text"
                value={profile.import_dependency}
                onChange={(e) => setProfile({ ...profile, import_dependency: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded p-2.5 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button onClick={() => setStep(2)} className="btn-primary">
                Continue to Data File Uploads
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: File Uploads & Column Mapping */}
        {step === 2 && (
          <div className="enterprise-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="font-semibold text-slate-900">Upload Business Datasets</h2>
                <p className="text-xs text-slate-500 mt-0.5">Upload CSV/XLSX files or click "Load Levi's Dataset" to test synthetic data.</p>
              </div>
            </div>

            {/* 1. Sales Data File (Required) */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">Required</span>
                  <h4 className="font-medium text-slate-900 text-sm mt-1">1. Sales Data File (CSV / XLSX)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Historical product sales, revenue, discount %, sales channel, and region.</p>
                </div>
                {!salesValidation ? (
                  <button onClick={handleSimulateSalesUpload} className="btn-secondary text-xs py-1.5 px-3">
                    Load Levi's Sales Sample
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Validated (30 records)
                  </span>
                )}
              </div>

              {salesValidation && (
                <div className="mt-3 text-xs bg-white border border-slate-200 rounded p-3 text-slate-700">
                  <div className="font-medium text-slate-900 mb-1">Column Mapping & Validation Summary:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    <li>Total Revenue Parsed: <strong>${salesValidation.summary.total_revenue.toLocaleString()} USD</strong></li>
                    <li>Total Units Sold: <strong>{salesValidation.summary.total_units_sold} units</strong></li>
                    <li>Missing Columns: None (All required columns verified)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* 2. Inventory Data File (Required) */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">Required</span>
                  <h4 className="font-medium text-slate-900 text-sm mt-1">2. Inventory Data File (CSV / XLSX)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Current stock units, safety stock thresholds, reorder points, unit costs, lead times.</p>
                </div>
                {!inventoryValidation ? (
                  <button onClick={handleSimulateInventoryUpload} className="btn-secondary text-xs py-1.5 px-3">
                    Load Levi's Inventory Sample
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Validated (11 SKUs)
                  </span>
                )}
              </div>

              {inventoryValidation && (
                <div className="mt-3 text-xs bg-white border border-slate-200 rounded p-3 text-slate-700">
                  <div className="font-medium text-slate-900 mb-1">Column Mapping & Validation Summary:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    <li>Total Stock Value: <strong>${inventoryValidation.total_inventory_value_usd.toLocaleString()} USD</strong></li>
                    <li>Low Stock Alerts Identified: <strong className="text-amber-600">{inventoryValidation.low_stock_skus} SKUs</strong></li>
                    <li>Missing Columns: None (All required columns verified)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* 3. Financial Data File (Optional) */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">Optional</span>
                  <h4 className="font-medium text-slate-900 text-sm mt-1">3. Financial & Cost Data File (CSV / XLSX)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Monthly revenue, COGS, operating expenses, and marketing spend for margin analysis.</p>
                </div>
                {!financialValidation ? (
                  <button onClick={handleSimulateFinancialUpload} className="btn-secondary text-xs py-1.5 px-3">
                    Load Levi's Financial Sample
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Validated (12 Months)
                  </span>
                )}
              </div>

              {financialValidation && (
                <div className="mt-3 text-xs bg-white border border-slate-200 rounded p-3 text-slate-700">
                  <div className="font-medium text-slate-900 mb-1">Column Mapping & Validation Summary:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                    <li>Average Gross Margin: <strong>{financialValidation.average_gross_margin_pct}%</strong></li>
                    <li>Annualized Revenue: <strong>${financialValidation.total_revenue_usd.toLocaleString()} USD</strong></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button onClick={() => setStep(1)} className="btn-secondary">
                <ArrowLeft className="w-4 h-4" />
                Back to Profile
              </button>
              <button
                onClick={handleCompleteOnboarding}
                className="btn-primary"
              >
                Confirm Import & Enter Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
