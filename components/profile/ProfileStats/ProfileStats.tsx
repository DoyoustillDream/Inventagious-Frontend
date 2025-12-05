'use client';

import { useState } from 'react';
import FollowersFollowingModal from '../FollowersFollowingModal';

interface ProfileStatsProps {
  followersCount?: number;
  followingCount?: number;
  profileId?: string;
  userId?: string;
  isOwnProfile?: boolean;
  isDarkBackground?: boolean;
}

export default function ProfileStats({
  followersCount = 0,
  followingCount = 0,
  profileId,
  userId,
  isOwnProfile = false,
  isDarkBackground = false,
}: ProfileStatsProps) {
  const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (type: 'followers' | 'following') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  // Use userId if available, otherwise fall back to profileId
  const targetUserId = userId || profileId || '';

  return (
    <>
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={() => handleOpenModal('followers')}
          className="text-center hover:scale-105 transition-transform cursor-pointer"
        >
          <div className={`hand-drawn text-xl sm:text-2xl md:text-3xl font-bold mb-1 drop-shadow-md ${
            isDarkBackground ? 'text-white' : 'text-black'
          }`}>
            {followersCount.toLocaleString()}
          </div>
          <div className={`text-xs sm:text-sm font-bold drop-shadow-sm ${
            isDarkBackground ? 'text-white' : 'text-gray-800'
          }`}>
            {followersCount === 1 ? 'Follower' : 'Followers'}
          </div>
        </button>
        <div className={`w-px h-8 sm:h-10 ${
          isDarkBackground ? 'bg-white/60' : 'bg-gray-400'
        }`} />
        <button
          onClick={() => handleOpenModal('following')}
          className="text-center hover:scale-105 transition-transform cursor-pointer"
        >
          <div className={`hand-drawn text-xl sm:text-2xl md:text-3xl font-bold mb-1 drop-shadow-md ${
            isDarkBackground ? 'text-white' : 'text-black'
          }`}>
            {followingCount.toLocaleString()}
          </div>
          <div className={`text-xs sm:text-sm font-bold drop-shadow-sm ${
            isDarkBackground ? 'text-white' : 'text-gray-800'
          }`}>
            Following
          </div>
        </button>
      </div>

      {isModalOpen && modalType && targetUserId && (
        <FollowersFollowingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          type={modalType}
          userId={targetUserId}
          count={modalType === 'followers' ? followersCount : followingCount}
        />
      )}
    </>
  );
}

