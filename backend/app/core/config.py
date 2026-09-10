import os
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv

FILE_PATH = Path(__file__).resolve()
BACKEND_DIR = FILE_PATH.parents[2]
ROOT_DIR = FILE_PATH.parents[3]
DATA_DIR = BACKEND_DIR / "app" / "data"

# Load .env from root directory (D:\dev\business-foresight\.env), backend directory, and CWD
load_dotenv(ROOT_DIR / ".env")
load_dotenv(BACKEND_DIR / ".env")
load_dotenv()

class BusinessProfile(BaseModel):
    id: str = "biz-levis-001"
    name: str = "Levi's"
    legal_name: str = "Levi Strauss & Co."
    industry: str = "Apparel & Fashion Retail"
    business_type: str = "Omnichannel / Direct-to-Consumer"
    business_model: str = "Brand Manufacturer & Retailer"
    primary_market: str = "United States"
    target_customers: str = "Men, Women, Kids & Denim Enthusiasts"
    categories: list[str] = ["Men's Jeans", "Women's Jeans", "Tops", "Outerwear", "Pants/Chinos", "Accessories", "Kids"]
    sales_channels: list[str] = ["Official Website", "Retail Stores", "Wholesale Partners"]
    suppliers: list[str] = ["Denim Corp Vietnam", "South Asia Garments Bangladesh", "Textile Mills India", "LoomWorks China", "LeatherCraft Mexico"]
    supplier_countries: list[str] = ["Vietnam", "Bangladesh", "India", "China", "Mexico", "Turkey"]
    import_dependency: str = "High (85% overseas garment manufacturing)"
    operating_dependencies: str = "Ocean shipping logistics, raw cotton pricing, overseas port operations, retail foot traffic"
    currency: str = "USD"

class Settings:
    PROJECT_NAME: str = "ForesightAI API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", 8000))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    # Voice API Settings
    ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY", "")
    ELEVENLABS_VOICE_ID: str = os.getenv("ELEVENLABS_VOICE_ID", "P8NfsqD6Mj2lTFzuAccu")
    
    # Pre-configured default test profile
    LEVIS_DEFAULT_PROFILE: BusinessProfile = BusinessProfile()

settings = Settings()
