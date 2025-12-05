'use client';

import { useEffect, useState } from 'react';
import { profileApi, Profile, CreateProfileData } from '@/lib/api/profile';
import { useToast } from '@/components/shared/Toast/ToastProvider';
import ImageUpload from '@/components/profile/ImageUpload';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile?: Profile | null;
  onUpdate: (profile: Profile) => void;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  currentProfile,
  onUpdate,
}: ProfileEditModalProps) {
  const [profile, setProfile] = useState<Profile | null>(currentProfile || null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const { showSuccess, showError } = useToast();

  // Load profile when modal opens
  useEffect(() => {
    if (isOpen && !profile) {
      loadProfile();
    } else if (isOpen && profile) {
      // Initialize form with current profile data
      setFormData({
        username: profile.username || '',
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || '',
        coverImageUrl: profile.coverImageUrl || '',
        type: profile.type as any,
        website: profile.website || '',
        location: profile.location || '',
      });
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, profile]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

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
      
      onUpdate(updatedProfile);
      showSuccess('Profile updated successfully!');
      onClose();
    } catch (err: any) {
      console.error('Error saving profile:', err);
      const errorMessage = err?.message || 'Failed to save profile';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="browser-window max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="browser-header">
          <div className="browser-controls">
            <div className="browser-dot red" />
            <div className="browser-dot yellow" />
            <div className="browser-dot green" />
          </div>
          <div className="flex-1" />
          <h2 className="hand-drawn text-lg font-bold text-black">Edit Profile</h2>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl font-bold transition-colors hover:bg-gray-200 rounded px-1 py-0.5"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-4 sm:p-6 bg-white overflow-y-auto flex-1">
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
                <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 rounded-lg">
                  <p className="text-sm font-bold text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="hand-drawn text-lg font-bold text-black border-b-2 border-gray-200 pb-2">
                    Basic Information
                  </h3>

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
                      className="hand-drawn w-full border-2 border-black bg-white px-3 py-2 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md"
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
                      className="hand-drawn w-full border-2 border-black bg-white px-3 py-2 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md"
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
                      className="hand-drawn w-full border-2 border-black bg-white px-3 py-2 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none rounded-md"
                    />
                  </div>

                  <div>
                    <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                      Profile Type
                    </label>
                    <select
                      value={formData.type || ''}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="hand-drawn w-full border-2 border-black bg-white px-3 py-2 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md"
                    >
                      <option value="">Select a type</option>
                      <option value="inventor">Inventor</option>
                      <option value="investor">Investor</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                {/* Location & Website */}
                <div className="space-y-4">
                  <h3 className="hand-drawn text-lg font-bold text-black border-b-2 border-gray-200 pb-2">
                    Location & Links
                  </h3>

                  <div>
                    <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, Country"
                      className="hand-drawn w-full border-2 border-black bg-white px-3 py-2 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md"
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
                      className="hand-drawn w-full border-2 border-black bg-white px-3 py-2 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-md"
                    />
                  </div>
                </div>

                {/* Media */}
                <div className="space-y-4">
                  <h3 className="hand-drawn text-lg font-bold text-black border-b-2 border-gray-200 pb-2">
                    Profile Images
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <ImageUpload
                        value={formData.avatarUrl}
                        onChange={(base64) => setFormData({ ...formData, avatarUrl: base64 })}
                        label="Avatar"
                        aspectRatio={{ width: 1, height: 1 }}
                        maxSizeMB={2}
                        maxWidth={1024}
                        maxHeight={1024}
                        previewClassName="w-full h-48 sm:h-40"
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
                        previewClassName="w-full h-48 sm:h-40"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t-2 border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border-2 border-black bg-white hover:bg-gray-100 rounded-md font-bold text-sm sm:text-base text-black transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 border-2 border-black bg-yellow-400 hover:bg-yellow-500 rounded-md font-bold text-sm sm:text-base text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

