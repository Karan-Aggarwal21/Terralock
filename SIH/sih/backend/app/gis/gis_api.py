
from typing import Any, Dict, Tuple
import requests
from app.config import OVERPASS_URL


def query_overpass(bbox: Tuple[float, float, float, float], timeout: int = 10) -> Dict[str, Any]:
    
    south, west, north, east = bbox
    url = OVERPASS_URL.strip() if OVERPASS_URL else ""

    if not url:
        return {"elements": []}

    query = f"""
    [out:json][timeout:{timeout}];
    (
      way["highway"]({south},{west},{north},{east});
      way["building"]({south},{west},{north},{east});
      way["landuse"="residential"]({south},{west},{north},{east});
      node["amenity"~"school|hospital|clinic|police"]({south},{west},{north},{east});
    );
    out tags qt;
    """

    try:
        res = requests.post(url, data={"data": query}, timeout=timeout)
        if res.status_code == 200:
            return res.json()
    except Exception:
        pass

    # Fallback to empty if network/API is offline
    return {"elements": []}

