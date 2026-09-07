import { createContext } from 'react';
import { Project } from '../types/project';

export interface ProjectContextType {
  projects: Project[];
  selectedProjectId: string;
  selectedProject: Project | null;
  setSelectedProjectId: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);
