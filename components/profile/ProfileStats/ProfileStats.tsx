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
    <div className="flex items-center justify-center gap-4 mt-2">
      <Link
        href={`${basePath}/followers`}
        className="font-bold text-black hover:text-yellow-600 transition-colors underline"
      >
        {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
      </Link>
      <div className="w-px h-4 bg-gray-300" />
      <Link
        href={`${basePath}/following`}
        className="font-bold text-black hover:text-yellow-600 transition-colors underline"
      >
        {followingCount} following
      </Link>
    </div>
  );
}

