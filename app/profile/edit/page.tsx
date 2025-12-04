'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { profileApi, Profile, CreateProfileData } from '@/lib/api/profile';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import ImageUpload from '@/components/profile/ImageUpload';

export default function EditProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      router.push('/');
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (profile) {
        await profileApi.update(formData);
      } else {
        await profileApi.create(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {/* Hero Section with Cover Preview */}
        <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-300 halftone-bg">
          {formData.coverImageUrl ? (
            <div className="relative h-64 overflow-hidden">
              <img
                src={formData.coverImageUrl}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20" />
            </div>
          ) : (
            <div className="h-64" />
          )}
          
          <div className="container mx-auto px-4 py-8 relative -mt-20">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar Preview */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white overflow-hidden shadow-2xl">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-yellow-200 text-5xl md:text-6xl font-bold text-black">
                      {(formData.displayName || formData.username || 'U')[0].toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info Preview */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="hand-drawn text-3xl md:text-4xl font-bold text-black mb-2">
                  {formData.displayName || formData.username || 'Your Name'}
                </h1>
                {formData.username && (
                  <p className="text-gray-800 font-bold mb-4">@{formData.username || 'username'}</p>
                )}
                {formData.bio && (
                  <p className="text-base md:text-lg text-black font-semibold max-w-2xl">
                    {formData.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/profile"
              className="hand-drawn inline-flex items-center gap-2 px-4 py-2 border-3 border-black bg-white hover:bg-yellow-200 rounded-lg font-bold text-black transition hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Profile
            </Link>
          </div>

          {error && (
            <div className="mb-6 browser-window border-red-500 bg-red-50">
              <div className="p-4">
                <p className="hand-drawn text-base font-bold text-red-800">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 browser-window border-green-500 bg-green-50">
              <div className="p-4">
                <p className="hand-drawn text-base font-bold text-green-800">
                  Profile updated successfully! Redirecting...
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                {/* Basic Information Card */}
                <div className="browser-window">
                  <div className="browser-header">
                    <div className="browser-controls">
                      <div className="browser-dot red" />
                      <div className="browser-dot yellow" />
                      <div className="browser-dot green" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="hand-drawn text-2xl font-bold text-black mb-6">Basic Information</h2>
                    
                    <div className="space-y-5">
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
                          className="hand-drawn w-full border-3 border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <p className="mt-1 text-xs text-gray-600">
                          /u/{formData.username || 'username'}
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
                          className="hand-drawn w-full border-3 border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>

                      <div>
                        <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                          Bio
                        </label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          rows={4}
                          placeholder="Tell others about yourself..."
                          className="hand-drawn w-full border-3 border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                        />
                      </div>

                      <div>
                        <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                          Profile Type
                        </label>
                        <select
                          value={formData.type || ''}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                          className="hand-drawn w-full border-3 border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="">Select a type</option>
                          <option value="inventor">Inventor</option>
                          <option value="investor">Investor</option>
                          <option value="both">Both</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Website Card */}
                <div className="browser-window">
                  <div className="browser-header">
                    <div className="browser-controls">
                      <div className="browser-dot red" />
                      <div className="browser-dot yellow" />
                      <div className="browser-dot green" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="hand-drawn text-2xl font-bold text-black mb-6">Location & Links</h2>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="City, Country"
                          className="hand-drawn w-full border-3 border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                          className="hand-drawn w-full border-3 border-black bg-white px-4 py-2 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Media */}
              <div className="space-y-6">
                {/* Avatar Card */}
                <div className="browser-window">
                  <div className="browser-header">
                    <div className="browser-controls">
                      <div className="browser-dot red" />
                      <div className="browser-dot yellow" />
                      <div className="browser-dot green" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="hand-drawn text-2xl font-bold text-black mb-6">Profile Picture</h2>
                    
                    <ImageUpload
                      value={formData.avatarUrl}
                      onChange={(base64) => setFormData({ ...formData, avatarUrl: base64 })}
                      label="Avatar"
                      aspectRatio={{ width: 1, height: 1 }}
                      maxSizeMB={2}
                      maxWidth={1024}
                      maxHeight={1024}
                      previewClassName="w-32 h-32 rounded-full mx-auto"
                    />
                  </div>
                </div>

                {/* Cover Image Card */}
                <div className="browser-window">
                  <div className="browser-header">
                    <div className="browser-controls">
                      <div className="browser-dot red" />
                      <div className="browser-dot yellow" />
                      <div className="browser-dot green" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="hand-drawn text-2xl font-bold text-black mb-6">Cover Image</h2>
                    
                    <ImageUpload
                      value={formData.coverImageUrl}
                      onChange={(base64) => setFormData({ ...formData, coverImageUrl: base64 })}
                      label="Cover Image"
                      aspectRatio={{ width: 16, height: 9 }}
                      maxSizeMB={5}
                      maxWidth={1920}
                      maxHeight={1080}
                      previewClassName="w-full h-40"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="hand-drawn px-8 py-3 border-4 border-black bg-white hover:bg-gray-100 rounded-lg font-bold text-black transition hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="hand-drawn px-8 py-3 border-4 border-black bg-yellow-400 hover:bg-yellow-500 rounded-lg font-bold text-black transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

