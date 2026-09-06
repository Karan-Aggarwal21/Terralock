
import math
from typing import Any, Dict, List, Tuple


def calculate_bounding_box(geometry: Dict[str, Any]) -> Tuple[float, float, float, float]:
   
    coords = geometry.get("coordinates", [])
    if not coords or len(coords) == 0:
        raise ValueError("Invalid polygon coordinates")

    outer_ring = coords[0]
    lons = [p[0] for p in outer_ring]
    lats = [p[1] for p in outer_ring]

    return (min(lats), min(lons), max(lats), max(lons))


def calculate_polygon_area_sqkm(coordinates: List[List[float]]) -> float:
    
    if len(coordinates) < 3:
        return 0.0

    mean_lat = sum(p[1] for p in coordinates) / len(coordinates)
    lat_scale = 111.32
    lon_scale = 111.32 * math.cos(math.radians(mean_lat))

    area = 0.0
    n = len(coordinates)
    for i in range(n):
        j = (i + 1) % n
        xi, yi = coordinates[i][0] * lon_scale, coordinates[i][1] * lat_scale
        xj, yj = coordinates[j][0] * lon_scale, coordinates[j][1] * lat_scale
        area += (xi * yj) - (xj * yi)

    return round(abs(area) / 2.0, 2)


def extract_gis_features(geometry: Dict[str, Any], osm_data: Dict[str, Any]) -> Dict[str, Any]:
    
    outer_ring = geometry.get("coordinates", [[]])[0]
    area = calculate_polygon_area_sqkm(outer_ring)
    safe_area = max(area, 0.01)

    elements = osm_data.get("elements", [])
    road_count = 0
    building_count = 0
    facility_count = 0

    for elem in elements:
        tags = elem.get("tags", {})
        if "highway" in tags:
            road_count += 1
        if "building" in tags:
            building_count += 1
        if tags.get("amenity") in ("school", "hospital", "clinic", "police"):
            facility_count += 1

    return {
        "area": area,
        "road_count": road_count,
        "building_count": building_count,
        "road_density": round(road_count / safe_area, 2),
        "building_density": round(building_count / safe_area, 2),
        "nearby_facility_count": facility_count
    }

