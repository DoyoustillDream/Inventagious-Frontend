'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import { followsApi, FollowUser } from '@/lib/api/follows';
import { profileApi } from '@/lib/api/profile';
import FollowButton from '@/components/profile/FollowButton';

export default function FollowersPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }

    loadUserId();
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (userId) {
      loadFollowers();
    }
  }, [userId]);

  const loadUserId = async () => {
    try {
      const profile = await profileApi.getMyProfile();
      setUserId(profile.userId);
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const loadFollowers = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await followsApi.getFollowers(userId);
      setFollowers(data);
    } catch (err: any) {
      console.error('Error loading followers:', err);
      setError(err?.message || 'Failed to load followers');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="text-xl font-bold">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white border-4 border-black rounded-lg p-6 md:p-8 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="hand-drawn text-3xl md:text-4xl font-bold text-black">
                Followers
              </h1>
              <Link
                href="/profile"
                className="hand-drawn px-4 py-2 border-3 border-black !bg-yellow-400 hover:!bg-yellow-500 text-black rounded-lg font-bold transition hover:scale-105 active:scale-95"
              >
                Back to Profile
              </Link>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-4 border-red-500 rounded-lg">
                <p className="text-red-800 font-bold">{error}</p>
              </div>
            )}

            {followers.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-bold text-gray-800 mb-4">No followers yet</p>
                <p className="text-gray-600 mb-6">
                  When people follow you, they'll appear here.
                </p>
                <Link
                  href="/profile"
                  className="hand-drawn inline-flex items-center px-6 py-3 border-4 border-black !bg-yellow-400 hover:!bg-yellow-500 text-black rounded-lg font-bold transition hover:scale-105 active:scale-95"
                >
                  Back to Profile
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {followers.map((follower) => (
                  <div
                    key={follower.id}
                    className="p-4 border-4 border-black rounded-lg bg-white hover:bg-yellow-50 transition"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <Link
                        href={`/u/${follower.username}`}
                        className="flex items-center gap-4 flex-1"
                      >
                        <div className="w-16 h-16 rounded-full border-3 border-black overflow-hidden bg-yellow-100 flex-shrink-0">
                          {/* Avatar would go here - using placeholder for now */}
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-black">
                            {follower.displayName[0].toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-black text-lg mb-1 truncate">
                            {follower.displayName}
                          </h3>
                          <p className="text-gray-600 text-sm">{`@${follower.username}`}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Followed you {new Date(follower.followedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </Link>
                      <div className="flex-shrink-0">
                        <FollowButton userId={follower.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

