'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useWallet } from '@/hooks/useWallet';
import { profileApi, Profile } from '@/lib/api/profile';
import { apiClient } from '@/lib/api/client';
import { useRouter, usePathname } from 'next/navigation';
import { setRedirectPath } from '@/lib/utils/redirect';
import Link from 'next/link';
import ProfileStats from './ProfileStats';
import DiscoverPeopleSection from './DiscoverPeopleSection';
import CausesSection from './CausesSection';
import HighlightsSection from './HighlightsSection';
import ActivityFeed from './ActivityFeed';
import SocialHandlesSection from './SocialHandlesSection';
import ShareBanner from './ShareBanner';

export default function ProfilePageContent() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { connected: walletConnected, isLoading: walletLoading } = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasRedirectedRef = useRef(false); 
  const reAuthPollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reAuthStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Wait for both auth and wallet to finish loading before making any decisions
    if (authLoading || walletLoading) {
      return;
    }

    // Check if there's a token in storage (even if not authenticated yet)
    const hasToken = !!apiClient.getToken();

    // If wallet is connected but not authenticated, wait for re-authentication
    // useWalletAuth should automatically re-authenticate when wallet is connected
    if (walletConnected && !isAuthenticated) {
      // Start polling for authentication completion
      if (!reAuthPollIntervalRef.current) {
        reAuthStartTimeRef.current = Date.now();
        const maxWaitTime = hasToken ? 5000 : 10000; // Wait longer if token exists (might just need refresh)
        
        reAuthPollIntervalRef.current = setInterval(() => {
          const elapsed = Date.now() - (reAuthStartTimeRef.current || 0);
          
          // If authenticated, clear polling and proceed
          if (isAuthenticated) {
            if (reAuthPollIntervalRef.current) {
              clearInterval(reAuthPollIntervalRef.current);
              reAuthPollIntervalRef.current = null;
            }
            reAuthStartTimeRef.current = null;
            hasRedirectedRef.current = false;
            return;
          }
          
          // If max wait time exceeded, stop polling and redirect
          if (elapsed >= maxWaitTime) {
            if (reAuthPollIntervalRef.current) {
              clearInterval(reAuthPollIntervalRef.current);
              reAuthPollIntervalRef.current = null;
            }
            reAuthStartTimeRef.current = null;
            
            if (!hasRedirectedRef.current) {
              hasRedirectedRef.current = true;
              if (pathname && pathname !== '/') {
                setRedirectPath(pathname);
              }
              router.replace('/');
            }
          }
        }, 200); // Check every 200ms
      }
      
      return () => {
        if (reAuthPollIntervalRef.current) {
          clearInterval(reAuthPollIntervalRef.current);
          reAuthPollIntervalRef.current = null;
        }
      };
    }

    // If wallet is NOT connected and user is not authenticated, redirect immediately
    if (!walletConnected && !isAuthenticated) {
      // Clear any polling
      if (reAuthPollIntervalRef.current) {
        clearInterval(reAuthPollIntervalRef.current);
        reAuthPollIntervalRef.current = null;
      }
      reAuthStartTimeRef.current = null;
      
      // Prevent multiple redirects
      if (!hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        if (pathname && pathname !== '/') {
          setRedirectPath(pathname);
        }
        // Use replace instead of push to avoid adding to history
        router.replace('/');
      }
      return;
    }

    // Reset redirect flag and clear polling when authenticated
    if (isAuthenticated) {
      hasRedirectedRef.current = false;
      if (reAuthPollIntervalRef.current) {
        clearInterval(reAuthPollIntervalRef.current);
        reAuthPollIntervalRef.current = null;
      }
      reAuthStartTimeRef.current = null;
    }

    // Load profile when authenticated (only if we haven't loaded it yet and not currently loading)
    if (isAuthenticated && !profile && !isLoading) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading, walletConnected, walletLoading, router, pathname]);

  const loadProfile = async () => {
    // Don't load if already loading, if not authenticated, or if we already have a profile
    if (isLoading || !isAuthenticated || profile) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const profileData = await profileApi.getMyProfile();
      setProfile(profileData);
    } catch (err: any) {
      console.error('Error loading profile:', err);
      // Only set error, don't affect auth state
      // Check if it's an auth error (401/403) vs other error
      if (err?.status === 401 || err?.status === 403) {
        // Auth error - let the auth provider handle it
        setError('Authentication required. Please sign in again.');
      } else {
        setError(err?.message || 'Failed to load profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while auth or wallet is being checked, or while waiting for re-authentication
  const isWaitingForReAuth = walletConnected && !isAuthenticated && reAuthPollIntervalRef.current !== null;
  if (authLoading || walletLoading || isWaitingForReAuth) {
    return (
      <main className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-64 bg-yellow-100"></div>
          <div className="max-w-4xl mx-auto px-4 -mt-20">
            <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white"></div>
            <div className="mt-4 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Only redirect if we're sure user is not authenticated AND wallet is not connected
  // (If wallet is connected, useWalletAuth will handle re-authentication)
  if (!isAuthenticated && !walletConnected) {
    return null;
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-64 bg-yellow-100"></div>
          <div className="max-w-4xl mx-auto px-4 -mt-20">
            <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white"></div>
            <div className="mt-4 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="border-2 border-red-500 bg-red-50 rounded-lg p-6">
            <p className="text-red-800 font-bold mb-4">{error}</p>
            <button
              onClick={loadProfile}
              className="px-4 py-2 border-2 border-red-500 bg-white hover:bg-red-100 rounded-md font-bold"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const displayProfile = profile || {
    id: user?.id || '',
    userId: user?.id || '',
    username: user?.email?.split('@')[0] || 'user',
    displayName: user?.fullName || user?.email || 'User',
    bio: '',
    avatarUrl: '',
    coverImageUrl: '',
    website: '',
    location: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Mock data for demonstration - replace with actual API calls
  const followersCount = 0;
  const followingCount = 0;
  const isPrivate = false;
  const discoverPeople: any[] = [];
  const causes: any[] = [];
  const pinnedProject = undefined;
  const projects: any[] = [];
  const activities: any[] = [];
  const socialHandles: any[] = [];

  // Generate shareable profile URL
  const profileUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/u/${displayProfile.username || displayProfile.id}`
    : '';

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1">
        {/* Hero Section with Cover */}
        <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-300 halftone-bg">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white overflow-hidden shadow-2xl">
                  {displayProfile.avatarUrl ? (
                    <img
                      src={displayProfile.avatarUrl}
                      alt={displayProfile.displayName || displayProfile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-yellow-200 text-5xl md:text-6xl font-bold text-black">
                      {(displayProfile.displayName || displayProfile.username || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <Link
                  href="/profile/edit"
                  className="absolute bottom-0 right-0 p-2 bg-white border-3 border-black rounded-full hover:bg-yellow-200 transition-all shadow-lg hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="hand-drawn text-3xl md:text-4xl font-bold text-black mb-2">
                  {displayProfile.displayName || displayProfile.username}
                </h1>
                {displayProfile.username && (
                  <p className="text-gray-800 font-bold mb-4">@{displayProfile.username}</p>
                )}
                {displayProfile.bio && (
                  <p className="text-base md:text-lg text-black font-semibold max-w-2xl mb-4">
                    {displayProfile.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <ProfileStats
                    followersCount={followersCount}
                    followingCount={followingCount}
                    profileId={displayProfile.id}
                    isOwnProfile={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Quick Actions Bar */}
          <div className="mb-6 flex flex-wrap gap-3">
            <Link
              href="/profile/edit"
              className="hand-drawn px-6 py-3 border-4 border-black bg-white hover:bg-yellow-200 rounded-lg font-bold text-black transition hover:scale-105"
            >
              Edit Profile
            </Link>
            <Link
              href="/profile/notifications"
              className="hand-drawn px-6 py-3 border-4 border-black bg-white hover:bg-yellow-200 rounded-lg font-bold text-black transition hover:scale-105"
            >
              Notifications
            </Link>
            <ShareBanner
              profileName={displayProfile.displayName || displayProfile.username}
              avatarUrl={displayProfile.avatarUrl}
              profileUrl={profileUrl}
            />
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content - 8 columns */}
            <div className="lg:col-span-8 space-y-6">
              {/* Highlights/Projects */}
              <div className="bg-white border-4 border-black rounded-lg p-6 shadow-lg">
                <HighlightsSection
                  pinnedProject={pinnedProject}
                  projects={projects}
                  isOwnProfile={true}
                />
              </div>

              {/* Activity Feed */}
              <div className="bg-white border-4 border-black rounded-lg p-6 shadow-lg">
                <ActivityFeed activities={activities} isOwnProfile={true} />
              </div>
            </div>

            {/* Sidebar - 4 columns */}
            <div className="lg:col-span-4 space-y-6">
              {/* Causes */}
              <div className="bg-white border-4 border-black rounded-lg p-6 shadow-lg">
                <CausesSection causes={causes} isOwnProfile={true} />
              </div>

              {/* Social Handles */}
              <div className="bg-white border-4 border-black rounded-lg p-6 shadow-lg">
                <SocialHandlesSection
                  socialHandles={socialHandles}
                  website={displayProfile.website}
                  isOwnProfile={true}
                />
              </div>
            </div>
          </div>

          {/* Discover People - Full Width */}
          <div className="mt-6">
            <DiscoverPeopleSection people={discoverPeople} isOwnProfile={true} />
          </div>
        </div>
      </main>
    </div>
  );
}

