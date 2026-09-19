import pandas as pd
import numpy as np
from pathlib import Path
from io import BytesIO
from typing import Dict, Any, List, Optional

class AnalyticsEngine:
    """
    High-performance data ingestion, column validation, and pre-computed metric aggregation engine.
    Uses Pandas & PyArrow for fast execution and memory efficiency.
    Supports flexible column matching for any currency or header variation.
    """

    EXPECTED_SALES_COLUMNS = ["Date", "Product Category", "Product", "Units Sold", "Revenue (USD)", "Discount %"]
    EXPECTED_INVENTORY_COLUMNS = ["SKU", "Product Category", "Product Name", "Current Stock Units", "Safety Stock Units", "Unit Cost (USD)", "Supplier Country", "Lead Time Days"]
    EXPECTED_FINANCIAL_COLUMNS = ["Month", "Total Revenue (USD)", "COGS (USD)", "Gross Profit (USD)", "Operating Expenses (USD)"]

    @staticmethod
    def parse_file(file_bytes: bytes, filename: str) -> pd.DataFrame:
        """Parses CSV or XLSX bytes into a DataFrame using PyArrow engine when available."""
        if filename.endswith(".xlsx") or filename.endswith(".xls"):
            return pd.read_excel(BytesIO(file_bytes))
        else:
            try:
                return pd.read_csv(BytesIO(file_bytes), engine="pyarrow")
            except Exception:
                return pd.read_csv(BytesIO(file_bytes))

    @staticmethod
    def find_col(df: pd.DataFrame, keywords: List[str]) -> Optional[str]:
        """Finds the first column in DataFrame matching any of the given keyword substrings (case-insensitive)."""
        cols = list(df.columns)
        for kw in keywords:
            for col in cols:
                if kw.lower() in str(col).lower():
                    return str(col)
        return None

    @classmethod
    def validate_sales_data(cls, df: pd.DataFrame) -> Dict[str, Any]:
        """Validates Sales Data columns, missing values, and produces a preview."""
        total_rows = len(df)
        null_counts = df.isnull().sum().to_dict()

        rev_col = cls.find_col(df, ["revenue", "sales", "total_amount", "amount"])
        unit_col = cls.find_col(df, ["units sold", "units", "quantity", "qty"])
        cat_col = cls.find_col(df, ["category", "product category", "dept"])
        prod_col = cls.find_col(df, ["product name", "product", "item"])
        disc_col = cls.find_col(df, ["discount", "promo %"])
        region_col = cls.find_col(df, ["region", "market", "country", "location"])

        total_revenue = float(df[rev_col].sum()) if rev_col and rev_col in df.columns else 0.0
        total_units = int(df[unit_col].sum()) if unit_col and unit_col in df.columns else 0
        avg_discount = float(df[disc_col].mean()) if disc_col and disc_col in df.columns else 0.0

        category_breakdown = {}
        if cat_col and rev_col and cat_col in df.columns and rev_col in df.columns:
            cat_summary = df.groupby(cat_col)[rev_col].sum().to_dict()
            category_breakdown = {str(k): float(v) for k, v in cat_summary.items()}

        products_list = []
        if prod_col and prod_col in df.columns:
            products_list = [str(p) for p in df[prod_col].dropna().unique().tolist()]

        categories_list = list(category_breakdown.keys())

        regions_list = []
        if region_col and region_col in df.columns:
            regions_list = [str(r) for r in df[region_col].dropna().unique().tolist()]

        return {
            "valid": total_rows > 0,
            "total_rows": total_rows,
            "null_counts": null_counts,
            "products": products_list,
            "categories": categories_list,
            "regions": regions_list,
            "summary": {
                "total_revenue": total_revenue,
                "total_units_sold": total_units,
                "average_discount_pct": round(avg_discount, 2),
                "category_revenue": category_breakdown
            },
            "preview": df.head(5).to_dict(orient="records")
        }

    @classmethod
    def validate_inventory_data(cls, df: pd.DataFrame) -> Dict[str, Any]:
        """Validates Inventory Data, stock levels, safety stock deficits, and lead times."""
        total_skus = len(df)
        stock_col = cls.find_col(df, ["current stock", "stock", "quantity", "units on hand"])
        safety_col = cls.find_col(df, ["safety stock", "min stock", "reorder point"])
        cost_col = cls.find_col(df, ["unit cost", "cost", "unit price"])
        prod_col = cls.find_col(df, ["product name", "product", "sku", "item"])
        supplier_col = cls.find_col(df, ["supplier country", "supplier", "warehouse", "location"])

        low_stock_count = 0
        low_stock_skus = []
        total_stock_value = 0.0
        supplier_countries = []

        if stock_col and safety_col and stock_col in df.columns and safety_col in df.columns:
            low_mask = df[stock_col] < df[safety_col]
            low_stock_count = int(low_mask.sum())
            if prod_col and prod_col in df.columns:
                low_stock_skus = df[low_mask][prod_col].astype(str).tolist()

        if stock_col and cost_col and stock_col in df.columns and cost_col in df.columns:
            total_stock_value = float((df[stock_col] * df[cost_col]).sum())

        if supplier_col and supplier_col in df.columns:
            supplier_countries = [str(s) for s in df[supplier_col].dropna().unique().tolist()]

        return {
            "valid": total_skus > 0,
            "total_skus": total_skus,
            "low_stock_skus": low_stock_count,
            "low_stock_sku_names": low_stock_skus,
            "total_inventory_value_usd": round(total_stock_value, 2),
            "supplier_countries": supplier_countries,
            "preview": df.head(5).to_dict(orient="records")
        }

    @classmethod
    def validate_financial_data(cls, df: pd.DataFrame) -> Dict[str, Any]:
        """Validates Monthly Financial Data, margins, and trends."""
        rev_col = cls.find_col(df, ["total revenue", "revenue", "sales"])
        cogs_col = cls.find_col(df, ["cogs", "cost of goods", "cost"])

        avg_gross_margin = 0.0
        total_annual_revenue = 0.0
        total_cogs = 0.0

        if rev_col and cogs_col and rev_col in df.columns and cogs_col in df.columns:
            df["_margin"] = ((df[rev_col] - df[cogs_col]) / df[rev_col]) * 100
            avg_gross_margin = float(df["_margin"].mean())
            total_annual_revenue = float(df[rev_col].sum())
            total_cogs = float(df[cogs_col].sum())

        return {
            "valid": len(df) > 0,
            "total_months": len(df),
            "average_gross_margin_pct": round(avg_gross_margin, 2),
            "total_revenue_usd": round(total_annual_revenue, 2),
            "total_cogs": round(total_cogs, 2),
            "preview": df.head(5).to_dict(orient="records")
        }
