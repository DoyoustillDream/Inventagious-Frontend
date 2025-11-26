'use client';

import { useState, useEffect } from 'react';
import ProjectCard from '../ProjectCard';
import DealFilters from './DealFilters';
import EmptyState from './EmptyState';
import { projectsApi, type Project } from '@/lib/api/projects';

export default function DealsList() {
  const [deals, setDeals] = useState<Project[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'funded' | 'completed'>('all');

  useEffect(() => {
    async function fetchDeals() {
      try {
        setLoading(true);
        setError(null);
        const data = await projectsApi.getAll();
        // Filter only private funding projects
        const privateFundingProjects = data.filter(p => p.type === 'private_funding');
        setDeals(privateFundingProjects);
        setFilteredDeals(privateFundingProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load private funding projects');
        console.error('Error fetching deals:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, []);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredDeals(deals);
    } else {
      setFilteredDeals(deals.filter(d => d.status === selectedStatus));
    }
  }, [selectedStatus, deals]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="hand-drawn text-xl font-bold text-black">Loading private funding projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="hand-drawn text-xl font-bold text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="hand-drawn rounded-lg border-4 border-black bg-yellow-400 px-6 py-2 text-base font-bold text-black transition-all duration-300 hover:bg-yellow-600 hover:scale-105 active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <DealFilters 
        selectedStatus={selectedStatus} 
        onStatusChange={setSelectedStatus}
        totalCount={deals.length}
        filteredCount={filteredDeals.length}
      />
      {filteredDeals.length === 0 ? (
        <EmptyState selectedStatus={selectedStatus} />
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredDeals.map((deal) => (
            <ProjectCard key={deal.id} {...deal} />
          ))}
        </div>
      )}
    </>
  );
}

