'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Upload, AlertCircle, ArrowRight, ArrowLeft, FileText } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State initialized EMPTY (Faded placeholder examples shown in form)
  const [profile, setProfile] = useState({
    name: "",
    legal_name: "",
    industry: "",
    business_type: "",
    business_model: "",
    primary_market: "",
    target_customers: "",
    categories: "",
    sales_channels: "",
    suppliers: "",
    supplier_countries: "",
    import_dependency: "",
    operating_dependencies: "",
    currency: "USD"
  });

  React.useEffect(() => {
    try {
      const savedName = localStorage.getItem('bf_business_name');
      if (savedName) {
        setProfile(prev => ({ ...prev, name: savedName }));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleFillDemoProfile = (type: 'levis' | 'nagina') => {
    if (type === 'levis') {
      setProfile({
        name: "Levi's",
        legal_name: "Levi Strauss & Co.",
        industry: "Apparel & Fashion Retail",
        business_type: "Omnichannel / Direct-to-Consumer",
        business_model: "Brand Manufacturer & Retailer",
        primary_market: "United States",
        target_customers: "Men, Women, Kids & Denim Enthusiasts",
        categories: "Men's Jeans, Women's Jeans, Tops, Outerwear, Pants/Chinos, Accessories, Kids",
        sales_channels: "Official Website, Retail Stores, Wholesale Partners",
        suppliers: "Denim Corp Vietnam, South Asia Garments Bangladesh, Textile Mills India",
        supplier_countries: "Vietnam, Bangladesh, India, China, Mexico, Turkey",
        import_dependency: "High (85% overseas garment manufacturing)",
        operating_dependencies: "Ocean shipping logistics, raw cotton pricing, overseas port operations",
        currency: "USD"
      });
    } else {
      setProfile({
        name: "Nagina Bedding Store",
        legal_name: "Nagina Bedding Store Karachi",
        industry: "Home Textiles & Bedding Retail",
        business_type: "Brick-and-Mortar Retail Store Network",
        business_model: "Retailer & Fabric Assembler",
        primary_market: "Pakistan",
        target_customers: "Homeowners, Wedding Buyers & Hospitality",
        categories: "Bedsheet Sets, Comforter Sets, Pillows, Blankets, Duvet Covers",
        sales_channels: "Karachi Retail Store, WhatsApp Direct, Online Store",
        suppliers: "Faisalabad Textile Mills, Multan Weaving Complex, Karachi Foam Products",
        supplier_countries: "India, Bangladesh, Pakistan",
        import_dependency: "Moderate (40-60% overseas sourcing)",
        operating_dependencies: "Yarn prices, domestic freight, local foot traffic",
        currency: "PKR"
      });
    }
  };

  // Upload States
  const [salesValidation, setSalesValidation] = useState<any>(null);
  const [inventoryValidation, setInventoryValidation] = useState<any>(null);
  const [financialValidation, setFinancialValidation] = useState<any>(null);

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
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-semibold text-slate-900 text-lg flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 text-white rounded font-bold flex items-center justify-center text-[10px]">FAI</div>
            ForesightAI
          </div>
          <div className="text-xs text-slate-500 font-medium">Onboarding & Data Personalization</div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-3xl mx-auto px-6 py-10 w-full flex-1">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Customize your ForesightAI</h1>
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

        {/* STEP 1: Business Profile Form with Dropdown Selection Lists */}
        {step === 1 && (
          <div className="enterprise-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">Company Context & Dependencies</h2>
                <p className="text-xs text-slate-500 mt-0.5">Fill in your company details or load a sample demo profile below.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemoProfile('levis')}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded font-medium transition-colors"
                >
                  Fill Levi's Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemoProfile('nagina')}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded font-medium transition-colors"
                >
                  Fill Nagina Bedding Demo
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* 1. Business Name (Text Input) */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Levi's Strauss & Co. or Nagina Bedding Store"
                  className="w-full text-sm border border-slate-300 rounded p-2.5 bg-white text-slate-900 focus:outline-none focus:border-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* 2. Industry (Dropdown List) */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Industry</label>
                <select
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  className={`w-full text-sm border border-slate-300 rounded p-2.5 bg-white focus:outline-none focus:border-slate-900 ${!profile.industry ? 'text-slate-400' : 'text-slate-900'}`}
                >
                  <option value="" disabled hidden>e.g. Select Industry (e.g. Apparel & Fashion Retail)</option>
                  <option value="Apparel & Fashion Retail" className="text-slate-900">Apparel & Fashion Retail</option>
                  <option value="Home Textiles & Bedding Retail" className="text-slate-900">Home Textiles & Bedding Retail</option>
                  <option value="Consumer Electronics & Hardware" className="text-slate-900">Consumer Electronics & Hardware</option>
                  <option value="Fast Moving Consumer Goods (FMCG)" className="text-slate-900">Fast Moving Consumer Goods (FMCG)</option>
                  <option value="Food & Beverage / Restaurants" className="text-slate-900">Food & Beverage / Restaurants</option>
                  <option value="Automotive & Spare Parts" className="text-slate-900">Automotive & Spare Parts</option>
                  <option value="Industrial Manufacturing & Equipment" className="text-slate-900">Industrial Manufacturing & Equipment</option>
                  <option value="Healthcare & Pharmaceuticals" className="text-slate-900">Healthcare & Pharmaceuticals</option>
                  <option value="Luxury Goods & Jewelry" className="text-slate-900">Luxury Goods & Jewelry</option>
                </select>
              </div>

              {/* 3. Business Type (Dropdown List) */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Business Type</label>
                <select
                  value={profile.business_type}
                  onChange={(e) => setProfile({ ...profile, business_type: e.target.value })}
                  className={`w-full text-sm border border-slate-300 rounded p-2.5 bg-white focus:outline-none focus:border-slate-900 ${!profile.business_type ? 'text-slate-400' : 'text-slate-900'}`}
                >
                  <option value="" disabled hidden>e.g. Select Business Type (e.g. Omnichannel / Direct-to-Consumer)</option>
                  <option value="Omnichannel / Direct-to-Consumer" className="text-slate-900">Omnichannel / Direct-to-Consumer</option>
                  <option value="Pure-Play E-Commerce" className="text-slate-900">Pure-Play E-Commerce</option>
                  <option value="Brick-and-Mortar Retail Store Network" className="text-slate-900">Brick-and-Mortar Retail Store Network</option>
                  <option value="B2B Wholesale & Distribution" className="text-slate-900">B2B Wholesale & Distribution</option>
                  <option value="Franchise Network" className="text-slate-900">Franchise Network</option>
                  <option value="Brand Manufacturer & Retailer" className="text-slate-900">Brand Manufacturer & Retailer</option>
                </select>
              </div>

              {/* 4. Primary Market (Dropdown List) */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Primary Market</label>
                <select
                  value={profile.primary_market}
                  onChange={(e) => setProfile({ ...profile, primary_market: e.target.value })}
                  className={`w-full text-sm border border-slate-300 rounded p-2.5 bg-white focus:outline-none focus:border-slate-900 ${!profile.primary_market ? 'text-slate-400' : 'text-slate-900'}`}
                >
                  <option value="" disabled hidden>e.g. Select Primary Market (e.g. United States or Pakistan)</option>
                  <option value="United States" className="text-slate-900">United States</option>
                  <option value="Pakistan" className="text-slate-900">Pakistan</option>
                  <option value="North America (US, Canada, Mexico)" className="text-slate-900">North America (US, Canada, Mexico)</option>
                  <option value="European Union (EU)" className="text-slate-900">European Union (EU)</option>
                  <option value="United Kingdom" className="text-slate-900">United Kingdom</option>
                  <option value="Asia-Pacific (APAC)" className="text-slate-900">Asia-Pacific (APAC)</option>
                  <option value="Global / Multi-Region" className="text-slate-900">Global / Multi-Region</option>
                </select>
              </div>
            </div>

            {/* 5. Product Categories (Dropdown List) */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Product Categories</label>
              <select
                value={profile.categories}
                onChange={(e) => setProfile({ ...profile, categories: e.target.value })}
                className={`w-full text-sm border border-slate-300 rounded p-2.5 bg-white focus:outline-none focus:border-slate-900 ${!profile.categories ? 'text-slate-400' : 'text-slate-900'}`}
              >
                <option value="" disabled hidden>e.g. Select Categories (e.g. Jeans, Tops, Bedsheets)</option>
                <option value="Men's Jeans, Women's Jeans, Tops, Outerwear, Pants/Chinos, Accessories, Kids" className="text-slate-900">
                  Men's Jeans, Women's Jeans, Tops, Outerwear, Pants/Chinos, Accessories, Kids (Apparel)
                </option>
                <option value="Bedsheet Sets, Comforter Sets, Pillows, Blankets, Duvet Covers" className="text-slate-900">
                  Bedsheet Sets, Comforter Sets, Pillows, Blankets, Duvet Covers (Home Textiles)
                </option>
                <option value="Consumer Electronics, Smart Accessories, Audio Equipment" className="text-slate-900">
                  Consumer Electronics, Smart Accessories, Audio Equipment
                </option>
                <option value="Home & Living Goods, Furniture, Kitchenware" className="text-slate-900">
                  Home & Living Goods, Furniture, Kitchenware
                </option>
                <option value="Footwear, Athletic Apparel, Sportswear" className="text-slate-900">
                  Footwear, Athletic Apparel, Sportswear
                </option>
                <option value="Packaged Foods, Beverages, Grocery Items" className="text-slate-900">
                  Packaged Foods, Beverages, Grocery Items
                </option>
              </select>
            </div>

            {/* 6. Supplier Manufacturing Countries (Dropdown List) */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Supplier Manufacturing Countries</label>
              <select
                value={profile.supplier_countries}
                onChange={(e) => setProfile({ ...profile, supplier_countries: e.target.value })}
                className={`w-full text-sm border border-slate-300 rounded p-2.5 bg-white focus:outline-none focus:border-slate-900 ${!profile.supplier_countries ? 'text-slate-400' : 'text-slate-900'}`}
              >
                <option value="" disabled hidden>e.g. Select Supplier Countries (e.g. Vietnam, India, Pakistan)</option>
                <option value="Vietnam, Bangladesh, India, China, Mexico, Turkey" className="text-slate-900">
                  Vietnam, Bangladesh, India, China, Mexico, Turkey (Asia & Global Sourcing)
                </option>
                <option value="India, Bangladesh, Pakistan" className="text-slate-900">
                  India, Bangladesh, Pakistan (South Asia Sourcing)
                </option>
                <option value="China, Vietnam, Cambodia" className="text-slate-900">
                  China, Vietnam, Cambodia (East Asia Sourcing)
                </option>
                <option value="Mexico, Central America" className="text-slate-900">
                  Mexico, Central America (Nearshore Americas)
                </option>
                <option value="Europe & Turkey" className="text-slate-900">
                  Europe & Turkey (EMEA Sourcing)
                </option>
                <option value="Domestic Manufacturing Only" className="text-slate-900">
                  Domestic Manufacturing Only
                </option>
              </select>
            </div>

            {/* 7. Import Dependency & Logistics Context (Dropdown List) */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Import Dependency & Logistics Context</label>
              <select
                value={profile.import_dependency}
                onChange={(e) => setProfile({ ...profile, import_dependency: e.target.value })}
                className={`w-full text-sm border border-slate-300 rounded p-2.5 bg-white focus:outline-none focus:border-slate-900 ${!profile.import_dependency ? 'text-slate-400' : 'text-slate-900'}`}
              >
                <option value="" disabled hidden>e.g. Select Import Dependency (e.g. High 85% overseas garment manufacturing)</option>
                <option value="High (85% overseas garment manufacturing)" className="text-slate-900">
                  High (85% overseas garment manufacturing)
                </option>
                <option value="Moderate (40-60% overseas sourcing)" className="text-slate-900">
                  Moderate (40-60% overseas sourcing)
                </option>
                <option value="Low (10-30% imported components)" className="text-slate-900">
                  Low (10-30% imported components)
                </option>
                <option value="Domestic Sourcing Only (0% import dependency)" className="text-slate-900">
                  Domestic Sourcing Only (0% import dependency)
                </option>
              </select>
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
