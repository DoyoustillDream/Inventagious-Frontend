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
    <div className="relative w-full">
      {/* Cover Image Section */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-50">
        {profile.coverImageUrl ? (
          <Image
            src={profile.coverImageUrl}
            alt="Cover"
            fill
            className="object-cover"
            priority
            unoptimized
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-50 halftone-bg" />
        )}
        {/* Curved overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white rounded-t-full transform translate-y-1/2" />
        
        {/* Notifications bell (only for own profile) */}
        {isOwnProfile && (
          <Link
            href="/profile/notifications"
            className="absolute top-4 right-4 p-2 bg-white border-2 border-black rounded-full hover:bg-yellow-200 transition-colors shadow-lg"
            aria-label="Notifications"
          >
            <svg
              className="w-6 h-6"
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
          </Link>
        )}
      </div>

      {/* Profile Photo Container */}
      <div className="relative flex justify-center -mt-16 md:-mt-20 mb-4">
        <div className="relative">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.displayName || profile.username}
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-yellow-100 text-4xl font-bold text-black">
                {(profile.displayName || profile.username || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>
          {/* Edit button overlay (only for own profile) */}
          {isOwnProfile && (
            <Link
              href="/profile/edit"
              className="absolute bottom-0 right-0 p-2 bg-white border-2 border-black rounded-full hover:bg-yellow-200 transition-colors shadow-lg"
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
      </div>

      {/* Name */}
      <div className="text-center px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-2 break-words">
          {profile.displayName || profile.username}
        </h1>
      </div>
    </div>
  );
}

