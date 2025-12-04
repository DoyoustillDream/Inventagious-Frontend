'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { projectsApi, type Project } from '@/lib/api/projects';

interface UseProjectOptions {
  /**
   * Polling interval in milliseconds
   * @default 3000 (3 seconds)
   */
  pollInterval?: number;
  /**
   * Enable/disable polling
   * @default true
   */
  enablePolling?: boolean;
  /**
   * Callback when project data is updated
   */
  onUpdate?: (project: Project) => void;
}

/**
 * Hook to fetch and maintain real-time project data
 * Automatically polls for updates to prevent stale data
 */
export function useProject(
  projectId: string,
  options: UseProjectOptions = {}
) {
  const {
    pollInterval = 3000, // 3 seconds
    enablePolling = true,
    onUpdate,
  } = options;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const lastProjectVersionRef = useRef<string | null>(null);

  /**
   * Fetch project data
   */
  const fetchProject = useCallback(async (silent = false) => {
    if (!isMountedRef.current) return;

    try {
      if (!silent) {
        setIsLoading(true);
      }
      setError(null);

      const fetchedProject = await projectsApi.getById(projectId);

      if (!isMountedRef.current) return;

      // Check if project actually changed (prevent unnecessary re-renders)
      const projectVersion = JSON.stringify({
        amountRaised: fetchedProject.amountRaised,
        status: fetchedProject.status,
        backersCount: fetchedProject.backersCount,
        updatedAt: fetchedProject.updatedAt,
      });

      if (projectVersion !== lastProjectVersionRef.current) {
        lastProjectVersionRef.current = projectVersion;
        setProject(fetchedProject);
        setLastUpdated(new Date());
        
        // Call update callback
        if (onUpdate) {
          onUpdate(fetchedProject);
        }
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      const error = err instanceof Error ? err : new Error('Failed to fetch project');
      setError(error);
      console.error('Failed to fetch project:', error);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [projectId, onUpdate]);

  /**
   * Optimistically update project after contribution
   */
  const optimisticUpdate = useCallback((contributionAmount: number, feePercentage: number = 0.019) => {
    if (!project) return;

    const netAmount = contributionAmount * (1 - feePercentage);
    const newAmountRaised = project.amountRaised + netAmount;
    const newBackersCount = project.backersCount + 1;
    const newStatus = newAmountRaised >= project.fundingGoal ? 'funded' : project.status;

    const updatedProject: Project = {
      ...project,
      amountRaised: newAmountRaised,
      backersCount: newBackersCount,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    setProject(updatedProject);
    setLastUpdated(new Date());
    lastProjectVersionRef.current = JSON.stringify({
      amountRaised: updatedProject.amountRaised,
      status: updatedProject.status,
      backersCount: updatedProject.backersCount,
      updatedAt: updatedProject.updatedAt,
    });

    // Call update callback
    if (onUpdate) {
      onUpdate(updatedProject);
    }
  }, [project, onUpdate]);

  /**
   * Start polling for updates
   */
  const startPolling = useCallback(() => {
    if (!enablePolling || pollInterval <= 0) return;

    // Clear existing polling
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    // Start polling (silent updates to avoid loading spinner)
    pollingRef.current = setInterval(() => {
      fetchProject(true); // Silent = true to avoid loading spinner
    }, pollInterval);
  }, [enablePolling, pollInterval, fetchProject]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  /**
   * Refetch project data manually
   */
  const refetch = useCallback(() => {
    return fetchProject(false);
  }, [fetchProject]);

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true;
    fetchProject();

    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [projectId]); // Only re-fetch if projectId changes

  // Start/stop polling based on options
  useEffect(() => {
    if (enablePolling && project && !isLoading) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enablePolling, project, isLoading, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [stopPolling]);

  return {
    project,
    isLoading,
    error,
    lastUpdated,
    refetch,
    optimisticUpdate,
    startPolling,
    stopPolling,
  };
}

