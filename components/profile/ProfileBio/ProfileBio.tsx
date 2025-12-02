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
    <div className="px-4 mt-2 w-full">
      <div className="flex flex-col items-center">
        {hasBio ? (
          <p className="text-gray-700 text-center mb-0 max-w-2xl">
            {profile.bio}
          </p>
        ) : (
          <>
            <p className="text-gray-500 text-center mb-2">
              Tell others what you care about.
            </p>
            {isOwnProfile && (
              <Link
                href="/profile/edit"
                className="mt-1 inline-flex items-center px-3 py-1.5 border-2 border-black bg-white hover:bg-yellow-200 transition-colors rounded-md font-bold text-sm"
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
                Add bio
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}

