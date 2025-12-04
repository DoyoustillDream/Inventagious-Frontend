'use client';

import { useState, useEffect, useRef } from 'react';
import { Project } from '@/lib/api/projects';
import { useProject } from '@/hooks/useProject';
import CircularProgress from './CircularProgress';
import DonationsList from './DonationsList';
import ContributeModal from './ContributeModal';
import { solToUsd } from '@/lib/solana/price';
import { useToast } from '@/components/shared/Toast';

interface ProjectSidebarProps {
  project: Project;
}

export default function ProjectSidebar({ project: initialProject }: ProjectSidebarProps) {
  // Use real-time project data
  const { project, optimisticUpdate } = useProject(initialProject.id, {
    pollInterval: 2000, // Poll every 2 seconds for sidebar (more frequent)
    enablePolling: true,
  });

  // Use real-time project if available, otherwise fall back to initial
  const projectData = project || initialProject;

  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [usdRaised, setUsdRaised] = useState<number | null>(null);
  const [usdGoal, setUsdGoal] = useState<number | null>(null);
  const { showSuccess } = useToast();
  const progress = (projectData.amountRaised / projectData.fundingGoal) * 100;
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Convert SOL to USD for display with debouncing to prevent excessive API calls
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the conversion to avoid excessive API calls
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const raised = await solToUsd(projectData.amountRaised);
        const goal = await solToUsd(projectData.fundingGoal);
        setUsdRaised(raised);
        setUsdGoal(goal);
      } catch (error) {
        console.warn('Failed to convert SOL to USD for display:', error);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [projectData.amountRaised, projectData.fundingGoal]);

  const handleContribute = () => {
    setIsContributeModalOpen(true);
  };

  const handleContributeSuccess = () => {
    // Real-time updates will handle the refresh automatically
    // No need to reload the page
    setIsContributeModalOpen(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: projectData.title,
        text: projectData.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Link copied to clipboard!');
    }
  };

  return (
    <div className="browser-window sticky top-4">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="flex-1" />
        <div className="yellow-highlight hand-drawn text-xs font-bold text-center px-4">
          {projectData.type === 'crowdfunding' ? 'CROWD FUNDING' : 'PRIVATE FUNDING'}
        </div>
        <div className="flex-1" />
      </div>

      <div className="p-6">
        {/* Progress Meter */}
        <div className="mb-6 text-center">
          <CircularProgress progress={progress} />
          <div className="mt-4 space-y-2">
            <div>
              <div className="hand-drawn text-2xl font-bold text-black">
                {projectData.amountRaised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} SOL
              </div>
              {usdRaised !== null && (
                <div className="text-sm font-semibold text-gray-600 mt-1">
                  ≈ ${usdRaised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              )}
            </div>
            <div className="text-sm font-semibold text-gray-700">
              <span>raised of </span>
              <span className="hand-drawn font-bold text-black">
                {projectData.fundingGoal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} SOL
              </span>
              {usdGoal !== null && (
                <span className="text-gray-600 ml-1">
                  (≈ ${usdGoal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                </span>
              )}
            </div>
            <div className="text-sm font-semibold text-gray-600">
              {projectData.backersCount} {projectData.backersCount === 1 ? 'backer' : 'backers'}
            </div>
          </div>
        </div>

        {/* Share and Donate Buttons */}
        <div className="mb-6 space-y-3">
          <button
            onClick={handleShare}
            className="hand-drawn w-full rounded-lg border-4 border-black bg-white px-6 py-3 text-base font-bold text-black transition-all duration-300 hover:bg-gray-100 hover:scale-105 active:scale-95"
          >
            Share
          </button>
          {projectData.status === 'funded' || projectData.amountRaised >= projectData.fundingGoal ? (
            <div className="hand-drawn w-full rounded-lg border-4 border-green-600 bg-green-100 px-6 py-3 text-base font-bold text-green-800 text-center">
              ✓ Funding Goal Reached!
            </div>
          ) : (
            <button
              onClick={handleContribute}
              className="hand-drawn w-full rounded-lg border-4 border-black bg-yellow-400 px-6 py-3 text-base font-bold text-black transition-all duration-300 hover:bg-yellow-600 hover:scale-105 active:scale-95"
            >
              {projectData.type === 'crowdfunding' ? 'Contribute' : 'Donate'} now
            </button>
          )}
        </div>

        {/* Recent Donations */}
        <div className="mb-6">
          <DonationsList projectId={projectData.id} compact />
        </div>

        {/* Become Early Supporter */}
        <div className="mb-6 p-4 bg-gray-50 border-2 border-black rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-gray-300 border-2 border-black flex items-center justify-center">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <div className="hand-drawn text-sm font-bold text-black">
                Become an early supporter
              </div>
              <p className="text-xs text-gray-600">Your donation matters</p>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="p-4 bg-yellow-50 border-2 border-black rounded-lg">
          <h3 className="hand-drawn text-sm font-bold text-black mb-2">
            Inventagious protects your donation
          </h3>
          <p className="text-xs text-gray-700">
            We guarantee you a full refund for up to a year in the rare case that fraud occurs.{' '}
            <a href="/trust-safety" className="underline font-semibold">
              See our Trust & Safety Guarantee.
            </a>
          </p>
        </div>
      </div>

      {/* Contribute Modal */}
      {projectData.type === 'crowdfunding' && (
        <ContributeModal
          projectId={projectData.id}
          campaignPda={projectData.solanaAddress}
          fundingGoal={projectData.fundingGoal}
          amountRaised={projectData.amountRaised}
          status={projectData.status}
          isOnChain={projectData.isOnChain ?? false}
          isOpen={isContributeModalOpen}
          onClose={() => setIsContributeModalOpen(false)}
          onSuccess={handleContributeSuccess}
          onOptimisticUpdate={optimisticUpdate}
        />
      )}
    </div>
  );
}

