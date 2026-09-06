"""
Analysis API route coordinating the 4-stage pipeline:
1. Input validation & parsing
2. GIS Overpass query & feature extraction
3. Machine Learning predictor
4. Monte Carlo simulation
"""
from fastapi import APIRouter, HTTPException

from app.schemas import AnalysisResponse, ProjectAnalysisRequest
from app.gis.gis_api import query_overpass
from app.gis.features import calculate_bounding_box, extract_gis_features
from app.ml.predictor import predict
from app.simulation.monte_carlo import run_monte_carlo

router = APIRouter(prefix="/api", tags=["Analysis"])


@router.post("/analyze", response_model=AnalysisResponse)
def analyze_project(request: ProjectAnalysisRequest) -> AnalysisResponse:
    """
    Main analysis pipeline orchestrator:
    1. Extract GeoJSON polygon and project metadata.
    2. Query OpenStreetMap GIS data within bounding box.
    3. Extract numerical GIS features.
    4. Combine project info and GIS features.
    5. Run ML predictor.
    6. Run Monte Carlo delay simulation.
    7. Return unified response.
    """
    # 1. Extract inputs
    project_dict = request.project.model_dump()
    geometry_dict = request.geometry.model_dump()

    # 2. Derive bounding box & query GIS
    try:
        bbox = calculate_bounding_box(geometry_dict)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Invalid geometry: {str(e)}")

    osm_data = query_overpass(bbox)

    # 3. Extract numerical features
    gis_features = extract_gis_features(geometry_dict, osm_data)

    # 4. Combine project metadata + GIS features for ML input
    combined_features = {
        **project_dict,
        **gis_features
    }

    # 5. Machine Learning prediction
    try:
        ml_result = predict(combined_features)
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=f"ML Model not loaded: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Inference error: {str(e)}")

    # 6. Monte Carlo simulation
    simulation_result = run_monte_carlo(ml_result, combined_features)

    # 7. Unified Response
    return AnalysisResponse(
        project=project_dict,
        gis=gis_features,
        ml=ml_result,
        simulation=simulation_result
    )
