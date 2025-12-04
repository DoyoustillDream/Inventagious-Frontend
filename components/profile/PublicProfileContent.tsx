'use client';

import { useState } from 'react';
import { Profile } from '@/lib/api/profile';
import { useAuth } from '@/components/auth/AuthProvider';
import ProfileHero from './ProfileHero';
import ProfileBio from './ProfileBio';
import ProfileStats from './ProfileStats';
import DiscoverPeopleSection from './DiscoverPeopleSection';
import CausesSection from './CausesSection';
import HighlightsSection from './HighlightsSection';
import ActivityFeed from './ActivityFeed';
import SocialHandlesSection from './SocialHandlesSection';
import ShareBanner from './ShareBanner';
import PrivacyBanner from './PrivacyBanner';

interface PublicProfileContentProps {
  profile: Profile;
}

export default function PublicProfileContent({ profile }: PublicProfileContentProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.userId;

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
    ? `${window.location.origin}/u/${profile.username || profile.id}`
    : '';

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full">
        {/* Hero Section */}
        <ProfileHero profile={profile} isOwnProfile={isOwnProfile} />

        {/* Main Content Container */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Bio Section */}
          <div className="mb-8">
            <ProfileBio profile={profile} isOwnProfile={isOwnProfile} />
          </div>

          {/* Stats Section */}
          <div className="mb-8">
            <ProfileStats
              followersCount={followersCount}
              followingCount={followingCount}
              profileId={profile.id}
              isOwnProfile={isOwnProfile}
            />
          </div>

          {/* Privacy Banner */}
          <PrivacyBanner isPrivate={isPrivate} isOwnProfile={isOwnProfile} />

          {/* Share Section - Prominent */}
          <div className="mb-8">
            <ShareBanner
              profileName={profile.displayName || profile.username}
              avatarUrl={profile.avatarUrl}
              profileUrl={profileUrl}
            />
          </div>

          {/* Two Column Layout for larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Highlights Section */}
              <div className="browser-window">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                </div>
                <div className="p-6">
                  <HighlightsSection
                    pinnedProject={pinnedProject}
                    projects={projects}
                    isOwnProfile={isOwnProfile}
                  />
                </div>
              </div>

              {/* Activity Feed */}
              <div className="browser-window">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                </div>
                <div className="p-6">
                  <ActivityFeed activities={activities} isOwnProfile={isOwnProfile} />
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Causes Section */}
              <div className="browser-window">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                </div>
                <div className="p-6">
                  <CausesSection causes={causes} isOwnProfile={isOwnProfile} />
                </div>
              </div>

              {/* Social Handles Section */}
              <div className="browser-window">
                <div className="browser-header">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                </div>
                <div className="p-6">
                  <SocialHandlesSection
                    socialHandles={socialHandles}
                    website={profile.website}
                    isOwnProfile={isOwnProfile}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Discover People Section - Full Width */}
          <DiscoverPeopleSection people={discoverPeople} isOwnProfile={isOwnProfile} />
        </div>
      </div>
    </main>
  );
}

