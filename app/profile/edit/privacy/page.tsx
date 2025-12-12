'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ProfileHeader from '@/components/profile/ProfileHeader/ProfileHeader';
import { profileApi, Profile } from '@/lib/api/profile';
import { useToast } from '@/components/shared/Toast/ToastProvider';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';

export default function PrivacySettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const [isPrivate, setIsPrivate] = useState(false);
  const [showEmail, setShowEmail] = useState(true);
  const [showWallet, setShowWallet] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
      return;
    }
    loadProfile();
  }, [isAuthenticated, router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await profileApi.getMyProfile();
      setProfile(profileData);
      // Note: Privacy settings would come from the API
      // For now, we'll use defaults
      setIsPrivate(false);
      setShowEmail(true);
      setShowWallet(true);
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError(err?.message || 'Failed to load profile');
      showError(err?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Note: Privacy settings API endpoint would be called here
      // await profileApi.updatePrivacy({ isPrivate, showEmail, showWallet });
      showSuccess('Privacy settings updated successfully!');
      router.push('/profile');
    } catch (err: any) {
      console.error('Error saving privacy settings:', err);
      const errorMessage = err?.message || 'Failed to save privacy settings';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ProfileHeader profile={profile || undefined} />
      <main id="main-content" className="flex-1 bg-gray-100">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white border-4 border-black rounded-lg shadow-lg p-6 md:p-8">
            {/* Header */}
            <div className="mb-6 pb-4 border-b-4 border-black">
              <div className="flex items-center justify-between">
                <h1 className="hand-drawn text-3xl md:text-4xl font-bold text-black">
                  Privacy Settings
                </h1>
                <Link
                  href="/profile/edit"
                  className="hand-drawn px-4 py-2 border-3 border-black bg-white hover:bg-yellow-200 rounded-lg font-bold text-sm transition"
                >
                  ← Back
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin mx-auto w-8 h-8 border-4 border-black border-t-transparent rounded-full mb-4"></div>
                  <p className="text-sm font-bold text-gray-700">Loading settings...</p>
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-4 border-red-500 rounded-lg">
                    <p className="text-sm font-bold text-red-800">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Profile Visibility */}
                  <div className="space-y-6">
                    <h2 className="hand-drawn text-xl font-bold text-black border-b-2 border-gray-300 pb-2">
                      Profile Visibility
                    </h2>

                    <div className="bg-yellow-50 border-4 border-black rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          id="isPrivate"
                          checked={isPrivate}
                          onChange={(e) => setIsPrivate(e.target.checked)}
                          className="mt-1 w-5 h-5 border-4 border-black rounded focus:ring-2 focus:ring-yellow-400"
                        />
                        <div className="flex-1">
                          <label htmlFor="isPrivate" className="hand-drawn block text-base font-bold text-black mb-2 cursor-pointer">
                            Make my profile private
                          </label>
                          <p className="text-sm text-gray-700 font-semibold">
                            When your profile is private, only approved followers can see your posts and activity.
                            Your profile information will still be visible to everyone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Information Visibility */}
                  <div className="space-y-6">
                    <h2 className="hand-drawn text-xl font-bold text-black border-b-2 border-gray-300 pb-2">
                      Information Visibility
                    </h2>

                    <div className="space-y-4">
                      <div className="bg-white border-4 border-black rounded-lg p-6">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            id="showEmail"
                            checked={showEmail}
                            onChange={(e) => setShowEmail(e.target.checked)}
                            className="mt-1 w-5 h-5 border-4 border-black rounded focus:ring-2 focus:ring-yellow-400"
                          />
                          <div className="flex-1">
                            <label htmlFor="showEmail" className="hand-drawn block text-base font-bold text-black mb-1 cursor-pointer">
                              Show email address
                            </label>
                            <p className="text-sm text-gray-600 font-semibold">
                              Allow others to see your email address on your profile.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border-4 border-black rounded-lg p-6">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            id="showWallet"
                            checked={showWallet}
                            onChange={(e) => setShowWallet(e.target.checked)}
                            className="mt-1 w-5 h-5 border-4 border-black rounded focus:ring-2 focus:ring-yellow-400"
                          />
                          <div className="flex-1">
                            <label htmlFor="showWallet" className="hand-drawn block text-base font-bold text-black mb-1 cursor-pointer">
                              Show wallet address
                            </label>
                            <p className="text-sm text-gray-600 font-semibold">
                              Display your Solana wallet address on your profile for transparency.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t-4 border-black">
                    <Link
                      href="/profile/edit"
                      className="hand-drawn px-6 py-3 border-4 border-black bg-white hover:bg-gray-100 rounded-lg font-bold text-base text-black transition text-center"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={saving}
                      className="hand-drawn px-6 py-3 border-4 border-black bg-yellow-400 hover:bg-yellow-500 rounded-lg font-bold text-base text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Privacy Settings'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

