import { useState, useEffect, useCallback } from 'react';
import { profileApi, Profile } from '@/lib/api/profile';
import { useAuth } from '@/components/auth/AuthProvider';

/**
 * Hook to fetch and manage the current user's profile
 * Automatically refreshes on window focus and listens for profile update events
 */
export function useUserProfile() {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setProfile(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const profileData = await profileApi.getMyProfile();
      setProfile(profileData);
    } catch (err: any) {
      // Don't set error for 404 - user might not have a profile yet
      if (err?.status !== 404) {
        console.error('Error fetching user profile:', err);
        setError(err?.message || 'Failed to load profile');
      }
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Initial fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Listen for profile update events
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchProfile();
    };

    // Listen for custom profile update event
    window.addEventListener('profile-updated', handleProfileUpdate);
    
    // Refresh on window focus (in case profile was updated in another tab)
    const handleFocus = () => {
      fetchProfile();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refresh: fetchProfile,
  };
}

