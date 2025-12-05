'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Profile } from '@/lib/api/profile';

interface ProfileHeroProps {
  profile: Profile;
  isOwnProfile?: boolean;
}

export default function ProfileHero({ profile, isOwnProfile = false }: ProfileHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-300 halftone-bg pb-20 md:pb-32">
      {/* Cover Image - covers entire hero section */}
      {profile.coverImageUrl && (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={profile.coverImageUrl}
            alt="Cover"
            fill
            className="object-cover"
            unoptimized
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Profile info positioned at bottom of cover area */}
      <div className="container mx-auto px-4 py-8 relative z-10 -mt-20 md:-mt-32">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white overflow-hidden shadow-2xl">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.displayName || profile.username}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-yellow-200 text-5xl md:text-6xl font-bold text-black">
                  {(profile.displayName || profile.username || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>
            {/* Edit button overlay (only for own profile) */}
            {isOwnProfile && (
              <Link
                href="/profile/edit"
                className="absolute bottom-0 right-0 p-2 bg-white border-3 border-black rounded-full hover:bg-yellow-200 transition-all shadow-lg hover:scale-110 text-black"
                aria-label="Edit profile"
              >
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Link>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="hand-drawn text-3xl md:text-4xl font-bold text-black mb-2 break-words">
              {profile.displayName || profile.username}
            </h1>
            {profile.username && profile.username !== profile.displayName && (
              <p className="text-gray-800 font-bold mb-4">{`@${profile.username}`}</p>
            )}
            {profile.bio && (
              <p className="text-base md:text-lg text-black font-semibold max-w-2xl mb-4">
                {profile.bio}
              </p>
            )}
            
            {/* Action Buttons */}
            {isOwnProfile && (
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4">
                <Link
                  href="/profile/edit"
                  className="hand-drawn rounded-lg border-3 border-black bg-white px-6 py-2 text-base font-bold text-black transition hover:bg-yellow-200 hover:scale-105 active:scale-95"
                >
                  Edit Profile
                </Link>
                <Link
                  href="/profile/notifications"
                  className="hand-drawn rounded-lg border-3 border-black bg-white px-6 py-2 text-base font-bold text-black transition hover:bg-yellow-200 hover:scale-105 active:scale-95 flex items-center gap-2"
                >
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  Notifications
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

