'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ProfileHeader from '@/components/profile/ProfileHeader/ProfileHeader';
import { profileApi, Profile, CreateProfileData } from '@/lib/api/profile';
import { useToast } from '@/components/shared/Toast/ToastProvider';
import ImageUpload from '@/components/profile/ImageUpload';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState<CreateProfileData>({
    username: '',
    displayName: '',
    bio: '',
    avatarUrl: '',
    coverImageUrl: '',
    type: undefined,
    website: '',
    location: '',
  });

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
      setFormData({
        username: profileData.username || '',
        displayName: profileData.displayName || '',
        bio: profileData.bio || '',
        avatarUrl: profileData.avatarUrl || '',
        coverImageUrl: profileData.coverImageUrl || '',
        type: profileData.type as any,
        website: profileData.website || '',
        location: profileData.location || '',
      });
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
      let updatedProfile: Profile;
      if (profile) {
        updatedProfile = await profileApi.update(formData);
      } else {
        updatedProfile = await profileApi.create(formData);
      }
      
      setProfile(updatedProfile);
      showSuccess('Profile updated successfully!');
      router.push('/profile');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      const errorMessage = err?.message || 'Failed to save profile';
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
                  Edit Profile
                </h1>
                <Link
                  href="/profile"
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
                  <p className="text-sm font-bold text-gray-700">Loading profile...</p>
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
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <h2 className="hand-drawn text-xl font-bold text-black border-b-2 border-gray-300 pb-2">
                      Basic Information
                    </h2>

                    <div>
                      <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                        Username <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        placeholder="your-username"
                        className="hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md"
                      />
                      <p className="mt-2 text-sm text-gray-600 font-semibold">
                        Your profile will be available at /u/{formData.username || 'username'}
                      </p>
                    </div>

                    <div>
                      <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        placeholder="Your Full Name"
                        className="hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={5}
                        placeholder="Tell others about yourself..."
                        className="hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none rounded-md"
                      />
                    </div>

                    <div>
                      <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                        Profile Type
                      </label>
                      <select
                        value={formData.type || ''}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        className="hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md"
                      >
                        <option value="">Select a type</option>
                        <option value="inventor">Inventor</option>
                        <option value="investor">Investor</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                  </div>

                  {/* Location & Website */}
                  <div className="space-y-6">
                    <h2 className="hand-drawn text-xl font-bold text-black border-b-2 border-gray-300 pb-2">
                      Location & Links
                    </h2>

                    <div>
                      <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="City, Country"
                        className="hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                        className="hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Media */}
                  <div className="space-y-6">
                    <h2 className="hand-drawn text-xl font-bold text-black border-b-2 border-gray-300 pb-2">
                      Profile Images
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <ImageUpload
                          value={formData.avatarUrl}
                          onChange={(base64) => setFormData({ ...formData, avatarUrl: base64 })}
                          label="Avatar"
                          aspectRatio={{ width: 1, height: 1 }}
                          maxSizeMB={2}
                          maxWidth={1024}
                          maxHeight={1024}
                          previewClassName="w-full h-64"
                        />
                      </div>

                      <div>
                        <ImageUpload
                          value={formData.coverImageUrl}
                          onChange={(base64) => setFormData({ ...formData, coverImageUrl: base64 })}
                          label="Cover Image"
                          aspectRatio={{ width: 16, height: 9 }}
                          maxSizeMB={5}
                          maxWidth={1920}
                          maxHeight={1080}
                          previewClassName="w-full h-64"
                        />
                      </div>
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
                      {saving ? 'Saving...' : 'Save Profile'}
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

