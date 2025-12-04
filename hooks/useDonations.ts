'use client';

import { useState, useEffect, useRef } from 'react';
import { projectsApi, type Donation, type Contribution } from '@/lib/api/projects';

// Cache for donations by project ID
const donationsCache = new Map<string, { donations: Donation[]; timestamp: number }>();
const CACHE_TTL_MS = 30 * 1000; // 30 seconds cache

interface UseDonationsOptions {
  pollInterval?: number; // Poll interval in milliseconds (default: no polling)
  enablePolling?: boolean; // Whether to enable polling (default: false)
}

/**
 * Hook to fetch donations for a project
 * Uses caching to prevent duplicate API calls
 * Supports polling for real-time updates
 */
export function useDonations(projectId: string, options: UseDonationsOptions = {}) {
  const { pollInterval = 0, enablePolling = false } = options;
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchDonations = async (skipCache = false, silent = false) => {
    const now = Date.now();
    
    // Check cache first (unless skipCache is true)
    if (!skipCache) {
      const cached = donationsCache.get(projectId);
      if (cached && now - cached.timestamp < CACHE_TTL_MS) {
        setDonations(cached.donations);
        setIsLoading(false);
        return;
      }
    }

    try {
      // Only show loading on initial fetch, not during polling
      if (!silent) {
        setIsLoading(true);
      }
      const project = await projectsApi.getById(projectId);
      
      // For crowdfunding projects, use contributions; for private funding, use donations
      // Also combine both in case there are any legacy entries
      let projectDonations: Donation[] = [];
      
      if (project.type === 'crowdfunding') {
        // For crowdfunding, contributions are the primary source
        if (project.contributions && project.contributions.length > 0) {
          projectDonations = project.contributions.map((c) => ({
            id: c.id,
            donorWalletAddress: c.contributorWalletAddress,
            amount: c.amount,
            createdAt: c.createdAt,
          }));
        }
        // Also include donations if any (for backward compatibility)
        if (project.donations && project.donations.length > 0) {
          projectDonations = [...projectDonations, ...project.donations];
        }
      } else {
        // For private funding, use donations
        projectDonations = project.donations || [];
        // Also include contributions if any (for backward compatibility)
        if (project.contributions && project.contributions.length > 0) {
          projectDonations = [
            ...projectDonations,
            ...project.contributions.map((c) => ({
              id: c.id,
              donorWalletAddress: c.contributorWalletAddress,
              amount: c.amount,
              createdAt: c.createdAt,
            })),
          ];
        }
      }
      
      // Sort by creation date, most recent first
      projectDonations.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      
      // Update cache
      donationsCache.set(projectId, {
        donations: projectDonations,
        timestamp: now,
      });
      
      setDonations(projectDonations);
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      setDonations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDonations();

    // Set up polling if enabled
    if (enablePolling && pollInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchDonations(true, true); // Skip cache, silent update when polling
      }, pollInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [projectId, pollInterval, enablePolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { donations, isLoading, refetch: () => fetchDonations(true) };
}

/**
 * Clear donations cache for a specific project (useful after new donations)
 */
export function clearDonationsCache(projectId?: string) {
  if (projectId) {
    donationsCache.delete(projectId);
  } else {
    donationsCache.clear();
  }
}

