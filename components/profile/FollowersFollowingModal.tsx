'use client';

import { useEffect, useState } from 'react';
import { followsApi, FollowUser } from '@/lib/api/follows';
import Link from 'next/link';
import FollowButton from './FollowButton';

interface FollowersFollowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'followers' | 'following';
  userId: string;
  count: number;
}

export default function FollowersFollowingModal({
  isOpen,
  onClose,
  type,
  userId,
  count,
}: FollowersFollowingModalProps) {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      loadUsers();
    } else {
      setUsers([]);
      setError(null);
    }
  }, [isOpen, userId, type]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = type === 'followers' 
        ? await followsApi.getFollowers(userId)
        : await followsApi.getFollowing(userId);
      setUsers(data);
    } catch (err: any) {
      console.error(`Error loading ${type}:`, err);
      setError(err?.message || `Failed to load ${type}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const title = type === 'followers' ? 'Followers' : 'Following';

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="browser-window max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="browser-header">
          <div className="browser-controls">
            <div className="browser-dot red" />
            <div className="browser-dot yellow" />
            <div className="browser-dot green" />
          </div>
          <div className="flex-1" />
          <h2 className="hand-drawn text-lg font-bold text-black">
            {title} ({count.toLocaleString()})
          </h2>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl font-bold transition-colors hover:bg-gray-200 rounded px-1 py-0.5"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-4 sm:p-6 bg-white overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin mx-auto w-8 h-8 border-4 border-black border-t-transparent rounded-full mb-4"></div>
                <p className="text-sm font-bold text-gray-700">Loading {title.toLowerCase()}...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border-2 border-red-500 rounded-lg">
              <p className="text-sm font-bold text-red-800">{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-yellow-100 border-2 border-black flex items-center justify-center mb-4">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-sm sm:text-base text-gray-800 font-bold text-center mb-2 px-2">
                {type === 'followers' 
                  ? 'No followers yet. Share your profile to get started!'
                  : 'Not following anyone yet. Discover people to follow!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-5 border-4 border-black rounded-xl bg-white hover:bg-yellow-50 transition-all hover:shadow-lg"
                >
                  <div className="flex items-center gap-5">
                    <Link
                      href={`/u/${user.username}`}
                      onClick={onClose}
                      className="flex items-center gap-5 flex-1 min-w-0 group"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-black overflow-hidden bg-yellow-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                        <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-black">
                          {user.displayName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-black text-lg sm:text-xl mb-1.5 truncate">
                          {user.displayName || user.username}
                        </h3>
                        <p className="text-gray-700 text-sm sm:text-base font-medium mb-2 truncate">
                          @{user.username}
                        </p>
                        {user.followedAt && (
                          <p className="text-sm text-gray-600 font-medium">
                            {type === 'followers' ? 'Following since ' : 'Followed since '}
                            <span className="font-bold">
                              {new Date(user.followedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </p>
                        )}
                      </div>
                    </Link>
                    <div className="flex-shrink-0">
                      <FollowButton userId={user.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

