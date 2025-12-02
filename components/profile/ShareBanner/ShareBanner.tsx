'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ShareBannerProps {
  profileName?: string;
  avatarUrl?: string;
  onShare?: () => void;
}

export default function ShareBanner({
  profileName,
  avatarUrl,
  onShare,
}: ShareBannerProps) {
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
          title: `Check out ${profileName || 'this'} on Inventagious`,
          text: `Check out ${profileName || 'this profile'} on Inventagious and inspire others to help.`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Profile link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="mt-4 mb-4">
      <button
        onClick={handleShare}
        disabled={isSharing}
        className="w-full border-2 border-black rounded-lg bg-yellow-200 hover:bg-yellow-300 transition-colors p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="text-left">
            <p className="text-lg font-bold text-black mb-0">
              <span className="text-yellow-600">Share your profile</span> and inspire
              others to help.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 border-2 border-black bg-white rounded-md font-bold text-sm">
            Share profile
          </span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
        {avatarUrl && (
          <div className="w-6 h-6 rounded-full border-2 border-black overflow-hidden ml-2 flex-shrink-0">
            <Image
              src={avatarUrl}
              alt={profileName || 'Profile'}
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
        )}
      </button>
    </div>
  );
}

