'use client';

import Link from 'next/link';

interface ProfileStatsProps {
  followersCount?: number;
  followingCount?: number;
  profileId?: string;
  isOwnProfile?: boolean;
}

export default function ProfileStats({
  followersCount = 0,
  followingCount = 0,
  profileId,
  isOwnProfile = false,
}: ProfileStatsProps) {
  const basePath = isOwnProfile ? '/profile' : `/u/${profileId}`;

  return (
    <div className="flex items-center gap-6">
      <Link
        href={`${basePath}/followers`}
        className="text-center hover:scale-105 transition-transform"
      >
        <div className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-1">
          {followersCount.toLocaleString()}
        </div>
        <div className="text-xs md:text-sm font-bold text-gray-800">
          {followersCount === 1 ? 'Follower' : 'Followers'}
        </div>
      </Link>
      <div className="w-px h-10 bg-gray-400" />
      <Link
        href={`${basePath}/following`}
        className="text-center hover:scale-105 transition-transform"
      >
        <div className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-1">
          {followingCount.toLocaleString()}
        </div>
        <div className="text-xs md:text-sm font-bold text-gray-800">
          Following
        </div>
      </Link>
    </div>
  );
}

