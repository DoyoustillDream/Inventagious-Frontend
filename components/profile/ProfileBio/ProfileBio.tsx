'use client';

import { Profile } from '@/lib/api/profile';
import Link from 'next/link';

interface ProfileBioProps {
  profile: Profile;
  isOwnProfile?: boolean;
}

export default function ProfileBio({ profile, isOwnProfile = false }: ProfileBioProps) {
  const hasBio = profile.bio && profile.bio.trim().length > 0;

  return (
    <div className="browser-window">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
      </div>
      <div className="p-6">
        {hasBio ? (
          <div className="text-center">
            <p className="text-base md:text-lg text-black leading-relaxed max-w-3xl mx-auto font-bold">
              {profile.bio}
            </p>
            {isOwnProfile && (
              <Link
                href="/profile/edit"
                className="mt-4 inline-flex items-center px-4 py-2 border-3 border-black bg-white hover:bg-yellow-200 transition-all rounded-lg font-bold text-sm hover:scale-105 active:scale-95"
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                Edit Bio
              </Link>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-800 font-bold mb-4">
              Tell others what you care about.
            </p>
            {isOwnProfile && (
              <Link
                href="/profile/edit"
                className="hand-drawn inline-flex items-center px-6 py-3 border-4 border-black bg-white hover:bg-yellow-200 transition-all rounded-lg font-bold text-base hover:scale-105 active:scale-95"
              >
                <svg
                  className="w-5 h-5 mr-2"
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
                Add Bio
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

