import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { Project } from '../types/project';
import { projectService } from '../services/projectService';
import { ProjectContext } from './ProjectContext';

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectIdState] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    projectService
      .getAllProjects()
      .then((data) => {
        if (!isMounted) return;
        setProjects(data);
        if (data.length > 0) {
          setSelectedProjectIdState((prev) => {
            const exists = data.some((p) => p.project_id === prev);
            return exists ? prev : data[0].project_id;
          });
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      projectService.clearCache();
      const data = await projectService.getAllProjects();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProjectIdState((prev) => {
          const exists = data.some((p) => p.project_id === prev);
          return exists ? prev : data[0].project_id;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setSelectedProjectId = useCallback((id: string) => {
    setSelectedProjectIdState(id);
  }, []);

  const addCustomProject = useCallback((newProject: Project) => {
    setProjects((prev) => [newProject, ...prev.filter((p) => p.project_id !== newProject.project_id)]);
    setSelectedProjectIdState(newProject.project_id);
  }, []);

  const selectedProject = projects.find((p) => p.project_id === selectedProjectId) || null;

  const contextValue = React.useMemo(
    () => ({
      projects,
      selectedProjectId,
      selectedProject,
      setSelectedProjectId,
      isLoading,
      error,
      refreshProjects,
      addCustomProject,
    }),
    [projects, selectedProjectId, selectedProject, setSelectedProjectId, isLoading, error, refreshProjects, addCustomProject]
  );

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
