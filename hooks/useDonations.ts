'use client';

import { useState, useEffect } from 'react';
import { projectsApi, type Donation } from '@/lib/api/projects';

// Cache for donations by project ID
const donationsCache = new Map<string, { donations: Donation[]; timestamp: number }>();
const CACHE_TTL_MS = 30 * 1000; // 30 seconds cache

/**
 * Hook to fetch donations for a project
 * Uses caching to prevent duplicate API calls
 */
export function useDonations(projectId: string) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check cache first
    const cached = donationsCache.get(projectId);
    const now = Date.now();
    
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      setDonations(cached.donations);
      setIsLoading(false);
      return;
    }

    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        const project = await projectsApi.getById(projectId);
        const projectDonations = project.donations || [];
        
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

    fetchDonations();
  }, [projectId]);

  return { donations, isLoading };
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

