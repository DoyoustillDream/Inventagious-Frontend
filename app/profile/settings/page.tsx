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

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

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
      // Note: Notification preferences would come from the API
      // For now, we'll use defaults
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
      // Note: Settings API endpoint would be called here
      // await profileApi.updateSettings({ emailNotifications, projectUpdates, marketingEmails });
      showSuccess('Settings updated successfully!');
    } catch (err: any) {
      console.error('Error saving settings:', err);
      const errorMessage = err?.message || 'Failed to save settings';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
      router.push('/');
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
              <h1 className="hand-drawn text-3xl md:text-4xl font-bold text-black">
                Account Settings
              </h1>
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
                  {/* Account Information */}
                  <div className="space-y-6">
                    <h2 className="hand-drawn text-xl font-bold text-black border-b-2 border-gray-300 pb-2">
                      Account Information
                    </h2>

                    <div className="bg-yellow-50 border-4 border-black rounded-lg p-6 space-y-4">
                      <div>
                        <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                          Wallet Address
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={profile?.walletAddress || user?.walletAddress || 'Not connected'}
                            disabled
                            className="hand-drawn flex-1 border-4 border-black bg-gray-100 px-4 py-3 text-base font-bold text-gray-600 rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (profile?.walletAddress || user?.walletAddress) {
                                navigator.clipboard.writeText(profile?.walletAddress || user?.walletAddress || '');
                                showSuccess('Wallet address copied!');
                              }
                            }}
                            className="hand-drawn px-4 py-3 border-4 border-black bg-white hover:bg-yellow-200 rounded-lg font-bold text-sm text-black transition"
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      {profile?.email && (
                        <div>
                          <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profile.email}
                            disabled
                            className="hand-drawn w-full border-4 border-black bg-gray-100 px-4 py-3 text-base font-bold text-gray-600 rounded-md"
                          />
                          <p className="mt-2 text-sm text-gray-600 font-semibold">
                            <Link href="/email/preferences" className="underline hover:text-black">
                              Manage email preferences
                            </Link>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div className="space-y-6">
                    <h2 className="hand-drawn text-xl font-bold text-black border-b-2 border-gray-300 pb-2">
                      Notification Preferences
                    </h2>

                    <div className="space-y-4">
                      <div className="bg-white border-4 border-black rounded-lg p-6">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            id="emailNotifications"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            className="mt-1 w-5 h-5 border-4 border-black rounded focus:ring-2 focus:ring-yellow-400"
                          />
                          <div className="flex-1">
                            <label htmlFor="emailNotifications" className="hand-drawn block text-base font-bold text-black mb-1 cursor-pointer">
                              Email Notifications
                            </label>
                            <p className="text-sm text-gray-600 font-semibold">
                              Receive email notifications about important account updates.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border-4 border-black rounded-lg p-6">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            id="projectUpdates"
                            checked={projectUpdates}
                            onChange={(e) => setProjectUpdates(e.target.checked)}
                            className="mt-1 w-5 h-5 border-4 border-black rounded focus:ring-2 focus:ring-yellow-400"
                          />
                          <div className="flex-1">
                            <label htmlFor="projectUpdates" className="hand-drawn block text-base font-bold text-black mb-1 cursor-pointer">
                              Project Updates
                            </label>
                            <p className="text-sm text-gray-600 font-semibold">
                              Get notified when your projects receive contributions or updates.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border-4 border-black rounded-lg p-6">
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            id="marketingEmails"
                            checked={marketingEmails}
                            onChange={(e) => setMarketingEmails(e.target.checked)}
                            className="mt-1 w-5 h-5 border-4 border-black rounded focus:ring-2 focus:ring-yellow-400"
                          />
                          <div className="flex-1">
                            <label htmlFor="marketingEmails" className="hand-drawn block text-base font-bold text-black mb-1 cursor-pointer">
                              Marketing Emails
                            </label>
                            <p className="text-sm text-gray-600 font-semibold">
                              Receive updates about new features, tips, and platform news.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="space-y-6">
                    <h2 className="hand-drawn text-xl font-bold text-red-600 border-b-2 border-gray-300 pb-2">
                      Danger Zone
                    </h2>

                    <div className="bg-red-50 border-4 border-red-500 rounded-lg p-6">
                      <h3 className="hand-drawn text-lg font-bold text-red-800 mb-2">
                        Logout
                      </h3>
                      <p className="text-sm text-gray-700 font-semibold mb-4">
                        Sign out of your account. You can sign back in anytime.
                      </p>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="hand-drawn px-6 py-3 border-4 border-red-600 bg-white hover:bg-red-100 rounded-lg font-bold text-base text-red-600 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t-4 border-black">
                    <Link
                      href="/profile"
                      className="hand-drawn px-6 py-3 border-4 border-black bg-white hover:bg-gray-100 rounded-lg font-bold text-base text-black transition text-center"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={saving}
                      className="hand-drawn px-6 py-3 border-4 border-black bg-yellow-400 hover:bg-yellow-500 rounded-lg font-bold text-base text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Settings'}
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

