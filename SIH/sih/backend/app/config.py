
import os
import joblib
from dotenv import load_dotenv

load_dotenv()

HOST: str = os.getenv("HOST", "0.0.0.0")
PORT: int = int(os.getenv("PORT", "8000"))
OVERPASS_URL: str = os.getenv("OVERPASS_URL", "https://overpass-api.de/api/interpreter")
MONTE_CARLO_ITERATIONS: int = int(os.getenv("MONTE_CARLO_ITERATIONS", "10000"))
MODEL_PATH: str = os.getenv("MODEL_PATH", "")
