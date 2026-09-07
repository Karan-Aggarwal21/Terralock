import { Project } from '../types/project';
import { checkBackendHealth, analyzeProjectApi, API_BASE_URL } from '../api/client';
import { MONITORED_CORRIDORS } from '../api/corridorDefinitions';
import { mapBackendAnalysisToProject } from '../api/mappers';

export interface ProjectService {
  getAllProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  clearCache(): void;
}

class BackendProjectService implements ProjectService {
  private cachedProjects: Project[] | null = null;
  private inFlightPromise: Promise<Project[]> | null = null;

  clearCache(): void {
    this.cachedProjects = null;
    this.inFlightPromise = null;
  }

  async getAllProjects(): Promise<Project[]> {
    if (this.cachedProjects && this.cachedProjects.length > 0) {
      return [...this.cachedProjects];
    }

    if (this.inFlightPromise) {
      return this.inFlightPromise;
    }

    this.inFlightPromise = this.fetchFromBackend();
    try {
      this.cachedProjects = await this.inFlightPromise;
      return [...this.cachedProjects];
    } finally {
      this.inFlightPromise = null;
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    const all = await this.getAllProjects();
    const found = all.find((p) => p.project_id === id);
    return found ? { ...found } : null;
  }

  private async fetchFromBackend(): Promise<Project[]> {
    // 1. Verify backend health
    try {
      const health = await checkBackendHealth();
      if (health.status !== 'ok') {
        throw new Error(`Unexpected backend status: ${health.status}`);
      }
    } catch (err) {
      throw new Error(
        `Unable to connect to TERRA LOCK backend API at ${API_BASE_URL}. Ensure the FastAPI server is running. (${
          (err as Error).message
        })`
      );
    }

    // 2. Query /api/analyze for all monitored corridors concurrently
    try {
      const results = await Promise.all(
        MONITORED_CORRIDORS.map(async (corridor) => {
          const res = await analyzeProjectApi(corridor.requestPayload);
          return mapBackendAnalysisToProject(res, corridor);
        })
      );

      return results;
    } catch (err) {
      throw new Error(
        `Failed to execute predictive delay pipeline on backend: ${
          (err as Error).message
        }`
      );
    }
  }
}

export const projectService: ProjectService = new BackendProjectService();
