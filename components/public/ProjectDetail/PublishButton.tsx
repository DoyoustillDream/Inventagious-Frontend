'use client';

import { useState } from 'react';
import { useCampaign } from '@/lib/solana/hooks/useCampaign';
import { projectsApi } from '@/lib/api/projects';
import { Project } from '@/lib/api/projects';

interface PublishButtonProps {
  project: Project;
  onPublishSuccess?: () => void;
}

export default function PublishButton({ project, onPublishSuccess }: PublishButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initializeCampaign, isLoading } = useCampaign();
  const connected = false; // No SDK - always false
  const publicKey = null; // No SDK - always null

  // Only show for draft crowdfunding projects
  if (project.status !== 'draft' || project.type !== 'crowdfunding') {
    return null;
  }

  const handlePublish = async () => {
    if (!connected) {
      setError('Please connect your wallet to publish');
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      // Calculate deadline (use project deadline or default to 30 days from now)
      const deadline = project.deadline
        ? Math.floor(new Date(project.deadline).getTime() / 1000)
        : Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days

      // Initialize campaign on-chain
      const { signature, campaignPda } = await initializeCampaign(
        project.id,
        project.fundingGoal,
        deadline,
      );

      // Notify backend with wallet address and signature
      await projectsApi.publish(project.id, '');

      // Refresh page or call success callback
      if (onPublishSuccess) {
        onPublishSuccess();
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      console.error('Failed to publish campaign:', err);
      setError(err.message || 'Failed to publish campaign. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={handlePublish}
        disabled={isPublishing || isLoading}
        className="hand-drawn w-full rounded-lg border-4 border-black bg-green-500 px-6 py-3 text-base font-bold text-white transition-all duration-300 hover:bg-green-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPublishing || isLoading
          ? 'Publishing...'
          : connected
            ? 'Publish Campaign'
            : 'Connect Wallet to Publish'}
      </button>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border-2 border-red-500 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {!connected && (
        <p className="mt-2 text-xs text-gray-600 text-center">
          Connect your wallet to publish this campaign on-chain
        </p>
      )}
    </div>
  );
}

