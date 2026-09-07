import {
  BackendProjectAnalysisRequest,
  BackendAnalysisResponse,
} from './backendTypes';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Robust fetch wrapper with timeout and JSON error handling
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 30000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if ((error as Error).name === 'AbortError') {
      throw new ApiError('Request timed out while contacting backend API', 408);
    }
    throw error;
  }
}

/**
 * Universal JSON request helper
 */
export async function requestJson<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      let errorBody: unknown;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = await response.text();
      }
      throw new ApiError(
        `Backend returned HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorBody
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error connecting to ${url}: ${(error as Error).message}`,
      0
    );
  }
}

/**
 * Health check endpoint
 */
export async function checkBackendHealth(): Promise<{ status: string }> {
  return requestJson<{ status: string }>('/health');
}

/**
 * POST /api/analyze endpoint
 */
export async function analyzeProjectApi(
  payload: BackendProjectAnalysisRequest
): Promise<BackendAnalysisResponse> {
  return requestJson<BackendAnalysisResponse>('/api/analyze', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
