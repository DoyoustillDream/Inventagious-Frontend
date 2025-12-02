'use client';

import { useState } from 'react';

interface ProfileActionsProps {
  isOwnProfile?: boolean;
  onShare?: () => void;
}

export default function ProfileActions({ isOwnProfile = false, onShare }: ProfileActionsProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }

    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out my Inventagious profile',
          text: 'Check out my profile on Inventagious',
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Profile link copied to clipboard!');
      }
    } catch (err) {
      // User cancelled or error occurred
      console.error('Error sharing:', err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-3 gap-2 mt-2">
      <button
        onClick={handleShare}
        disabled={isSharing}
        className="w-full md:w-auto px-6 py-2 border-2 border-black bg-white hover:bg-yellow-200 transition-colors rounded-md font-bold text-sm disabled:opacity-50"
      >
        {isSharing ? 'Sharing...' : 'Share profile'}
      </button>
    </div>
  );
}

