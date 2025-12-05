'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { followsApi } from '@/lib/api/follows';

interface FollowButtonProps {
  userId: string;
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({ userId, className = '', onFollowChange }: FollowButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFollowStatus = useCallback(async () => {
    if (!isAuthenticated || !user || !userId) {
      return;
    }
    try {
      const result = await followsApi.isFollowing(userId);
      setIsFollowing(result.isFollowing);
    } catch (err: any) {
      console.error('Error loading follow status:', err);
      // Don't show error, just assume not following
      setIsFollowing(false);
    }
  }, [isAuthenticated, user, userId]);

  useEffect(() => {
    loadFollowStatus();
  }, [loadFollowStatus]);

  // Don't show button if viewing own profile or not authenticated
  if (!isAuthenticated || !user || user.id === userId) {
    return null;
  }

  const handleFollow = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      if (isFollowing) {
        await followsApi.unfollow(userId);
        setIsFollowing(false);
        onFollowChange?.(false);
      } else {
        await followsApi.follow(userId);
        setIsFollowing(true);
        onFollowChange?.(true);
      }
    } catch (err: any) {
      console.error('Error following/unfollowing:', err);
      setError(err?.message || 'Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleFollow}
        disabled={isLoading}
        className={`hand-drawn px-6 py-3 border-4 border-black rounded-lg font-bold text-black transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
          isFollowing
            ? 'bg-white hover:bg-gray-100'
            : 'bg-yellow-400 hover:bg-yellow-500'
        } ${className}`}
      >
        {isLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-bold">{error}</p>
      )}
    </div>
  );
}

