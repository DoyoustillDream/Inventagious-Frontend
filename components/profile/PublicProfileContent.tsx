'use client';

import { Profile } from '@/lib/api/profile';
import { useAuth } from '@/components/auth/AuthProvider';
import ProfileStats from './ProfileStats';
import DiscoverPeopleSection from './DiscoverPeopleSection';
import CausesSection from './CausesSection';
import HighlightsSection from './HighlightsSection';
import ActivityFeed from './ActivityFeed';
import SocialHandlesSection from './SocialHandlesSection';
import ShareBanner from './ShareBanner';
import FollowButton from './FollowButton';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { followsApi } from '@/lib/api/follows';

interface PublicProfileContentProps {
  profile: Profile;
  onEditClick?: () => void;
}

export default function PublicProfileContent({ profile, onEditClick }: PublicProfileContentProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.userId;
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isCoverImageDark, setIsCoverImageDark] = useState(false);

  // Mock data for demonstration - replace with actual API calls
  const discoverPeople: any[] = [];
  const causes = profile?.causes || [];
  const pinnedProject = undefined;
  const projects: any[] = [];
  const activities: any[] = [];
  const socialHandles = profile?.socialHandles || [];

  useEffect(() => {
    loadFollowCounts();
  }, [profile.userId]);

  // Detect cover image brightness to adjust text color
  const detectImageBrightness = (imageUrl: string) => {
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
  };

  // Detect brightness when cover image changes
  useEffect(() => {
    if (profile?.coverImageUrl) {
      detectImageBrightness(profile.coverImageUrl);
    } else {
      setIsCoverImageDark(false);
    }
  }, [profile?.coverImageUrl]);

  const loadFollowCounts = async () => {
    try {
      const [followers, following] = await Promise.all([
        followsApi.getFollowersCount(profile.userId),
        followsApi.getFollowingCount(profile.userId),
      ]);
      setFollowersCount(followers.count);
      setFollowingCount(following.count);
    } catch (err) {
      console.error('Error loading follow counts:', err);
    }
  };

  // Generate shareable profile URL
  const profileUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/u/${profile.username || profile.id}`
    : '';

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex-1">
        {/* Hero Section with Cover */}
        <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-300 halftone-bg">
          {/* Cover Image - covers entire hero section */}
          {profile.coverImageUrl && (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={profile.coverImageUrl}
                alt="Cover"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Profile info positioned at bottom of cover area */}
          <div className="container mx-auto px-4 py-8 relative z-10 pt-48 sm:pt-64 md:pt-80">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white overflow-hidden shadow-2xl">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.displayName || profile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-yellow-200 text-5xl md:text-6xl font-bold text-black">
                      {(profile.displayName || profile.username || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                {isOwnProfile && onEditClick && (
                  <button
                    onClick={onEditClick}
                    className="absolute bottom-0 right-0 p-2 bg-white border-3 border-black rounded-full hover:bg-yellow-200 transition-all shadow-lg hover:scale-110 text-black"
                    aria-label="Edit profile"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h1 className={`hand-drawn text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg ${
                      isCoverImageDark ? 'text-white' : 'text-black'
                    }`}>
                      {profile.displayName || profile.username}
                    </h1>
                    {profile.username && (
                      <p className={`font-bold mb-4 drop-shadow-md ${
                        isCoverImageDark ? 'text-white' : 'text-gray-800'
                      }`}>
                        {`@${profile.username}`}
                      </p>
                    )}
                  </div>
                  {!isOwnProfile && (
                    <FollowButton
                      userId={profile.userId}
                      onFollowChange={loadFollowCounts}
                    />
                  )}
                </div>
                {profile.bio && (
                  <p className={`text-base md:text-lg font-semibold max-w-2xl mb-4 drop-shadow-md ${
                    isCoverImageDark ? 'text-white' : 'text-black'
                  }`}>
                    {profile.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <ProfileStats
                    followersCount={followersCount}
                    followingCount={followingCount}
                    profileId={profile.id}
                    userId={profile.userId}
                    isOwnProfile={isOwnProfile}
                    isDarkBackground={isCoverImageDark}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Quick Actions Bar - Only for own profile */}
          {isOwnProfile && (
            <div className="mb-6 flex flex-wrap gap-3">
              {onEditClick && (
                <button
                  onClick={onEditClick}
                  className="hand-drawn px-6 py-3 border-4 border-black bg-white hover:bg-yellow-200 rounded-lg font-bold text-black transition hover:scale-105"
                >
                  Edit Profile
                </button>
              )}
              <Link
                href="/profile/notifications"
                className="hand-drawn px-6 py-3 border-4 border-black bg-white hover:bg-yellow-200 rounded-lg font-bold text-black transition hover:scale-105"
              >
                Notifications
              </Link>
              <ShareBanner
                profileName={profile.displayName || profile.username}
                avatarUrl={profile.avatarUrl}
                profileUrl={profileUrl}
              />
            </div>
          )}

          {/* Share Banner for visitors */}
          {!isOwnProfile && (
            <div className="mb-6">
              <ShareBanner
                profileName={profile.displayName || profile.username}
                avatarUrl={profile.avatarUrl}
                profileUrl={profileUrl}
              />
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content - 8 columns */}
            <div className="lg:col-span-8 space-y-6">
              {/* Highlights/Projects */}
              <div className="bg-white border-4 border-black rounded-lg p-6 shadow-lg">
                <HighlightsSection
                  pinnedProject={pinnedProject}
                  projects={projects}
                  isOwnProfile={isOwnProfile}
                />
              </div>

              {/* Activity Feed */}
              <div className="bg-white border-4 border-black rounded-lg p-6 shadow-lg">
                <ActivityFeed activities={activities} isOwnProfile={isOwnProfile} />
              </div>
            </div>

            {/* Sidebar - 4 columns */}
            <div className="lg:col-span-4 space-y-6">
              {/* Causes */}
              <div className="bg-white border-4 border-black rounded-lg p-6 shadow-lg">
                <CausesSection causes={causes} isOwnProfile={isOwnProfile} />
              </div>

              {/* Social Handles */}
              <div className="bg-white border-4 border-black rounded-lg p-6 shadow-lg">
                <SocialHandlesSection
                  socialHandles={socialHandles}
                  website={profile.website}
                  isOwnProfile={isOwnProfile}
                />
              </div>
            </div>
          </div>

          {/* Discover People - Full Width */}
          <div className="mt-6">
            <DiscoverPeopleSection people={discoverPeople} isOwnProfile={isOwnProfile} />
          </div>
        </div>
      </main>
    </div>
  );
}

