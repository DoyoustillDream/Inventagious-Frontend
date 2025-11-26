'use client';

import { useState, useEffect } from 'react';
import ProjectCard from '../ProjectCard';
import CampaignFilters from './CampaignFilters';
import EmptyState from './EmptyState';
import { projectsApi, type Project } from '@/lib/api/projects';

export default function CampaignsList() {
  const [campaigns, setCampaigns] = useState<Project[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'funded' | 'completed'>('all');

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setLoading(true);
        setError(null);
        const data = await projectsApi.getAll();
        // Filter only crowdfunding campaigns
        const crowdfundingCampaigns = data.filter(p => p.type === 'crowdfunding');
        setCampaigns(crowdfundingCampaigns);
        setFilteredCampaigns(crowdfundingCampaigns);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load campaigns');
        console.error('Error fetching campaigns:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredCampaigns(campaigns);
    } else {
      setFilteredCampaigns(campaigns.filter(c => c.status === selectedStatus));
    }
  }, [selectedStatus, campaigns]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="hand-drawn text-xl font-bold text-black">Loading campaigns...</p>
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
      <CampaignFilters 
        selectedStatus={selectedStatus} 
        onStatusChange={setSelectedStatus}
        totalCount={campaigns.length}
        filteredCount={filteredCampaigns.length}
      />
      {filteredCampaigns.length === 0 ? (
        <EmptyState selectedStatus={selectedStatus} />
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <ProjectCard key={campaign.id} {...campaign} />
          ))}
        </div>
      )}
    </>
  );
}

