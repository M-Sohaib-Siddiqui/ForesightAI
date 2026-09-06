import pandas as pd
import numpy as np
from pathlib import Path
from io import BytesIO
from typing import Dict, Any, List

class AnalyticsEngine:
    """
    High-performance data ingestion, column validation, and pre-computed metric aggregation engine.
    Uses Pandas & PyArrow for fast execution and memory efficiency.
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

    @classmethod
    def validate_sales_data(cls, df: pd.DataFrame) -> Dict[str, Any]:
        """Validates Sales Data columns, missing values, and produces a preview."""
        cols = list(df.columns)
        missing_cols = [c for c in cls.EXPECTED_SALES_COLUMNS if c not in cols]
        total_rows = len(df)
        null_counts = df.isnull().sum().to_dict()
        
        # Calculate summary metrics
        total_revenue = float(df["Revenue (USD)"].sum()) if "Revenue (USD)" in df.columns else 0.0
        total_units = int(df["Units Sold"].sum()) if "Units Sold" in df.columns else 0
        avg_discount = float(df["Discount %"].mean()) if "Discount %" in df.columns else 0.0
        
        # Category breakdown
        category_breakdown = {}
        if "Product Category" in df.columns and "Revenue (USD)" in df.columns:
            cat_summary = df.groupby("Product Category")["Revenue (USD)"].sum().to_dict()
            category_breakdown = {k: float(v) for k, v in cat_summary.items()}
            
        return {
            "valid": len(missing_cols) == 0,
            "total_rows": total_rows,
            "missing_columns": missing_cols,
            "null_counts": null_counts,
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
        cols = list(df.columns)
        missing_cols = [c for c in cls.EXPECTED_INVENTORY_COLUMNS if c not in cols]
        total_skus = len(df)
        
        low_stock_count = 0
        total_stock_value = 0.0
        supplier_countries = []
        
        if "Current Stock Units" in df.columns and "Safety Stock Units" in df.columns:
            low_stock_mask = df["Current Stock Units"] < df["Safety Stock Units"]
            low_stock_count = int(low_stock_mask.sum())
            
        if "Current Stock Units" in df.columns and "Unit Cost (USD)" in df.columns:
            total_stock_value = float((df["Current Stock Units"] * df["Unit Cost (USD)"]).sum())
            
        if "Supplier Country" in df.columns:
            supplier_countries = df["Supplier Country"].dropna().unique().tolist()

        return {
            "valid": len(missing_cols) == 0,
            "total_skus": total_skus,
            "missing_columns": missing_cols,
            "low_stock_skus": low_stock_count,
            "total_inventory_value_usd": round(total_stock_value, 2),
            "supplier_countries": supplier_countries,
            "preview": df.head(5).to_dict(orient="records")
        }

    @classmethod
    def validate_financial_data(cls, df: pd.DataFrame) -> Dict[str, Any]:
        """Validates Monthly Financial Data, margins, and trends."""
        cols = list(df.columns)
        missing_cols = [c for c in cls.EXPECTED_FINANCIAL_COLUMNS if c not in cols]
        
        avg_gross_margin = 0.0
        total_annual_revenue = 0.0
        
        if "Total Revenue (USD)" in df.columns and "COGS (USD)" in df.columns:
            df["Gross Margin %"] = ((df["Total Revenue (USD)"] - df["COGS (USD)"]) / df["Total Revenue (USD)"]) * 100
            avg_gross_margin = float(df["Gross Margin %"].mean())
            total_annual_revenue = float(df["Total Revenue (USD)"].sum())

        return {
            "valid": len(missing_cols) == 0,
            "total_months": len(df),
            "missing_columns": missing_cols,
            "average_gross_margin_pct": round(avg_gross_margin, 2),
            "total_revenue_usd": round(total_annual_revenue, 2),
            "preview": df.head(5).to_dict(orient="records")
        }
