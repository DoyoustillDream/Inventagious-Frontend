'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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
import ProfileEditModal from './ProfileEditModal';
import { followsApi } from '@/lib/api/follows';
import { projectsApi, Project } from '@/lib/api/projects';

export default function ProfilePageContent() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { connected: walletConnected, isLoading: walletLoading } = useWallet();
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCoverImageDark, setIsCoverImageDark] = useState(false);
  const coverImageRef = useRef<HTMLImageElement | null>(null);
  const hasRedirectedRef = useRef(false); 
  const reAuthPollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reAuthStartTimeRef = useRef<number | null>(null);

  // Detect cover image brightness to adjust text color
  const detectImageBrightness = useCallback((imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Sample a smaller area for performance (bottom area where text appears)
        canvas.width = Math.min(img.width, 400);
        canvas.height = Math.min(img.height, 200);
        
        // Draw image scaled to canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Sample pixels from the bottom area where text typically appears
        const imageData = ctx.getImageData(0, Math.floor(canvas.height * 0.6), canvas.width, Math.floor(canvas.height * 0.4));
        const data = imageData.data;
        
        let totalBrightness = 0;
        let pixelCount = 0;
        
        // Calculate average brightness (skip every 4th pixel for performance)
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Calculate luminance using relative luminance formula
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          totalBrightness += brightness;
          pixelCount++;
        }
        
        const averageBrightness = totalBrightness / pixelCount;
        // If average brightness is less than 128 (midpoint), consider it dark
        setIsCoverImageDark(averageBrightness < 128);
      } catch (error) {
        console.error('Error detecting image brightness:', error);
        // Default to light if detection fails
        setIsCoverImageDark(false);
      }
    };
    
    img.onerror = () => {
      setIsCoverImageDark(false);
    };
    
    img.src = imageUrl;
  }, []);

  // Detect brightness when cover image changes
  useEffect(() => {
    if (profile?.coverImageUrl) {
      detectImageBrightness(profile.coverImageUrl);
    } else {
      setIsCoverImageDark(false);
    }
  }, [profile?.coverImageUrl, detectImageBrightness]);

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

  const loadFollowCounts = async () => {
    const userId = profile?.userId || user?.id;
    if (!userId) return;
    try {
      const [followers, following] = await Promise.all([
        followsApi.getFollowersCount(userId),
        followsApi.getFollowingCount(userId),
      ]);
      setFollowersCount(followers.count);
      setFollowingCount(following.count);
    } catch (err) {
      console.error('Error loading follow counts:', err);
    }
  };

  useEffect(() => {
    const userId = profile?.userId || user?.id;
    if (userId) {
      loadFollowCounts();
    }
  }, [profile?.userId, user?.id]);

  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Load user's projects
  useEffect(() => {
    if (isAuthenticated && profile?.userId) {
      loadUserProjects();
    }
  }, [isAuthenticated, profile?.userId]);

  const loadUserProjects = async () => {
    try {
      setLoadingProjects(true);
      const userProjectsData = await projectsApi.getMyProjects();
      setUserProjects(userProjectsData);
    } catch (err) {
      console.error('Error loading user projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Show loading state while auth or wallet is being checked, or while waiting for re-authentication
  const isWaitingForReAuth = walletConnected && !isAuthenticated && reAuthPollIntervalRef.current !== null;
  if (authLoading || walletLoading || isWaitingForReAuth) {
    return (
      <main className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-48 sm:h-64 md:h-80 bg-yellow-100"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 md:-mt-32">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gray-200 border-4 border-white"></div>
            <div className="mt-4 space-y-4">
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/2 sm:w-1/3"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 sm:w-2/3"></div>
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
          <div className="h-48 sm:h-64 md:h-80 bg-yellow-100"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 md:-mt-32">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gray-200 border-4 border-white"></div>
            <div className="mt-4 space-y-4">
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/2 sm:w-1/3"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 sm:w-2/3"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="min-h-screen bg-white py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="border-2 border-red-500 bg-red-50 rounded-lg p-4 sm:p-6">
            <p className="text-sm sm:text-base text-red-800 font-bold mb-4">{error}</p>
            <button
              onClick={loadProfile}
              className="w-full sm:w-auto px-4 py-2 border-2 border-red-500 bg-white hover:bg-red-100 rounded-md font-bold text-sm sm:text-base"
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
  const isPrivate = false;
  const discoverPeople: any[] = [];
  const causes = profile?.causes || [];
  const activities: any[] = [];
  const socialHandles = profile?.socialHandles || [];

  // Find pinned project (first active project, or first project if none active)
  const pinnedProject = userProjects.find((p) => p.status === 'active') || userProjects[0];
  const otherProjects = userProjects.filter((p) => p.id !== pinnedProject?.id).slice(0, 3); // Show max 3 other projects

  const handleCausesUpdate = async (updatedCauses: any[]) => {
    // Reload profile to get updated causes
    if (isAuthenticated) {
      try {
        const profileData = await profileApi.getMyProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Error reloading profile after causes update:', error);
      }
    }
  };

  const handleSocialHandlesUpdate = async (updatedWebsite?: string, updatedSocialHandles?: any[]) => {
    // Reload profile to get updated social handles and website
    if (isAuthenticated) {
      try {
        const profileData = await profileApi.getMyProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Error reloading profile after social handles update:', error);
      }
    }
  };

  const handleProfileUpdate = async (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    // Reload follow counts in case username changed
    if (updatedProfile.userId) {
      loadFollowCounts();
    }
  };

  const handleHighlightsUpdate = async (
    updatedPinned?: { id: string; title: string; description?: string; imageUrl?: string; goal?: number; raised?: number; slug?: string },
    updatedProjects?: { id: string; title: string; description?: string; imageUrl?: string; goal?: number; raised?: number; slug?: string }[]
  ) => {
    // Reload projects to reflect changes
    await loadUserProjects();
  };

  // Generate shareable profile URL
  const profileUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/u/${displayProfile.username || displayProfile.id}`
    : '';

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1">
        {/* Hero Section with Cover */}
        <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-300 halftone-bg">
          {/* Cover Image - covers entire hero section */}
          {displayProfile.coverImageUrl && (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={displayProfile.coverImageUrl}
                alt="Cover"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8 relative z-10 pt-48 sm:pt-64 md:pt-80">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white overflow-hidden shadow-2xl">
                  {displayProfile.avatarUrl ? (
                    <img
                      src={displayProfile.avatarUrl}
                      alt={displayProfile.displayName || displayProfile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-yellow-200 text-3xl sm:text-5xl md:text-6xl font-bold text-black">
                      {(displayProfile.displayName || displayProfile.username || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-white border-3 border-black rounded-full hover:bg-yellow-200 transition-all shadow-lg hover:scale-110 text-black"
                  aria-label="Edit profile"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 w-full text-center md:text-left">
                <h1 className={`hand-drawn text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 break-words drop-shadow-lg ${
                  isCoverImageDark ? 'text-white' : 'text-black'
                }`}>
                  {displayProfile.displayName || displayProfile.username}
                </h1>
                {displayProfile.username && (
                  <p className={`text-sm sm:text-base font-bold mb-2 sm:mb-4 drop-shadow-md ${
                    isCoverImageDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    {`@${displayProfile.username}`}
                  </p>
                )}
                {displayProfile.bio && (
                  <p className={`text-sm sm:text-base md:text-lg font-semibold max-w-2xl mb-3 sm:mb-4 px-2 sm:px-0 drop-shadow-md ${
                    isCoverImageDark ? 'text-white' : 'text-black'
                  }`}>
                    {displayProfile.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <ProfileStats
                    followersCount={followersCount}
                    followingCount={followingCount}
                    profileId={displayProfile.id}
                    userId={displayProfile.userId}
                    isOwnProfile={true}
                    isDarkBackground={isCoverImageDark}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8 max-w-7xl">
          {/* Quick Actions Bar */}
          <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-3">
            <Link
              href="/profile/notifications"
              className="hand-drawn px-4 py-2 sm:px-6 sm:py-3 border-4 border-black bg-white hover:bg-yellow-200 rounded-lg font-bold text-sm sm:text-base text-black transition hover:scale-105 flex-1 sm:flex-initial text-center"
            >
              Notifications
            </Link>
            <div className="flex-1 sm:flex-initial">
              <ShareBanner
                profileName={displayProfile.displayName || displayProfile.username}
                avatarUrl={displayProfile.avatarUrl}
                profileUrl={profileUrl}
              />
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Main Content - 8 columns */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-6">
              {/* Highlights/Projects */}
              <div className="bg-white border-4 border-black rounded-lg p-4 sm:p-6 shadow-lg">
                <HighlightsSection
                  pinnedProject={pinnedProject ? {
                    id: pinnedProject.id,
                    title: pinnedProject.title,
                    description: pinnedProject.description,
                    imageUrl: pinnedProject.imageUrl,
                    goal: pinnedProject.fundingGoal,
                    raised: pinnedProject.amountRaised,
                    slug: pinnedProject.slug,
                  } : undefined}
                  projects={otherProjects.map((p) => ({
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    imageUrl: p.imageUrl,
                    goal: p.fundingGoal,
                    raised: p.amountRaised,
                    slug: p.slug,
                  }))}
                  isOwnProfile={true}
                  onUpdate={handleHighlightsUpdate}
                />
              </div>

              {/* Activity Feed */}
              <div className="bg-white border-4 border-black rounded-lg p-4 sm:p-6 shadow-lg">
                <ActivityFeed activities={activities} isOwnProfile={true} />
              </div>
            </div>

            {/* Sidebar - 4 columns */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-6">
              {/* Causes */}
              <div className="bg-white border-4 border-black rounded-lg p-4 sm:p-6 shadow-lg">
                <CausesSection causes={causes} isOwnProfile={true} onUpdate={handleCausesUpdate} />
              </div>

              {/* Social Handles */}
              <div className="bg-white border-4 border-black rounded-lg p-4 sm:p-6 shadow-lg">
                <SocialHandlesSection
                  socialHandles={socialHandles}
                  website={displayProfile.website}
                  isOwnProfile={true}
                  onUpdate={handleSocialHandlesUpdate}
                />
              </div>
            </div>
          </div>

          {/* Discover People - Full Width */}
          <div className="mt-4 sm:mt-6">
            <DiscoverPeopleSection people={discoverPeople} isOwnProfile={true} />
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProfile={profile}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
}

