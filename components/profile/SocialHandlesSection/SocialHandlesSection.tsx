'use client';

import { useState } from 'react';
import SocialHandlesEditModal from './SocialHandlesEditModal';

interface SocialHandle {
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok' | 'website';
  url: string;
  username?: string;
}

interface SocialHandlesSectionProps {
  socialHandles?: SocialHandle[];
  website?: string;
  isOwnProfile?: boolean;
  onUpdate?: (website?: string, socialHandles?: SocialHandle[]) => void;
}

export default function SocialHandlesSection({
  socialHandles = [],
  website,
  isOwnProfile = false,
  onUpdate,
}: SocialHandlesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const allHandles = [
    ...socialHandles,
    ...(website ? [{ platform: 'website' as const, url: website }] : []),
  ];

  const hasHandles = allHandles.length > 0;

  const handleUpdate = (updatedWebsite?: string, updatedSocialHandles?: SocialHandle[]) => {
    if (onUpdate) {
      onUpdate(updatedWebsite, updatedSocialHandles);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="hand-drawn text-xl sm:text-2xl font-bold text-black">Social Links</h2>
        {isOwnProfile && hasHandles && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 border-2 border-black rounded-md hover:bg-yellow-200 transition-colors text-black flex-shrink-0"
            aria-label="Edit social links"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}
      </div>
      {hasHandles ? (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {allHandles.map((handle, index) => (
            <a
              key={index}
              href={handle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 border-2 border-black bg-white hover:bg-yellow-200 transition-colors rounded-md font-bold text-xs sm:text-sm text-black"
            >
              {handle.platform === 'twitter' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              )}
              {handle.platform === 'instagram' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              )}
              {handle.platform === 'facebook' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              )}
              {handle.platform === 'linkedin' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              )}
              {handle.platform === 'youtube' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              )}
              {handle.platform === 'tiktok' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              )}
              {handle.platform === 'website' && (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              )}
              <span className="truncate">
                {handle.username || (handle.platform === 'twitter' ? 'X' : handle.platform)}
              </span>
            </a>
          ))}
        </div>
      ) : (
        <div className={`flex flex-col items-center py-6 sm:py-8 ${
          !isOwnProfile ? 'border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg' : ''
        }`}>
          <div className={`w-16 h-16 sm:w-20 sm:h-20 border-2 border-black rounded-full flex items-center justify-center mb-3 sm:mb-4 ${
            isOwnProfile ? 'bg-yellow-100' : 'bg-white'
          }`}>
            <svg
              className={`w-8 h-8 sm:w-10 sm:h-10 ${
                isOwnProfile ? 'text-black' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <p className={`text-sm sm:text-base font-bold text-center mb-3 px-2 ${
            isOwnProfile ? 'text-gray-800' : 'text-gray-600'
          }`}>
            {isOwnProfile 
              ? 'Connect your social profiles and website.'
              : 'This creator hasn\'t added any social links yet.'}
          </p>
          {isOwnProfile && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-3 py-1.5 border-2 border-black bg-white hover:bg-yellow-200 transition-colors rounded-md font-bold text-xs sm:text-sm text-black"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add social handles
            </button>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isOwnProfile && (
        <SocialHandlesEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentWebsite={website}
          currentSocialHandles={socialHandles}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

