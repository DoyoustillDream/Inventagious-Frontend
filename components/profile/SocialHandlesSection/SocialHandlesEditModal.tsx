'use client';

import { useEffect, useState } from 'react';
import { profileApi } from '@/lib/api/profile';
import { useToast } from '@/components/shared/Toast';

interface SocialHandle {
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok' | 'website';
  url: string;
  username?: string;
}

interface SocialHandlesEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWebsite?: string;
  currentSocialHandles?: SocialHandle[];
  onUpdate: (website?: string, socialHandles?: SocialHandle[]) => void;
}

export default function SocialHandlesEditModal({
  isOpen,
  onClose,
  currentWebsite = '',
  currentSocialHandles = [],
  onUpdate,
}: SocialHandlesEditModalProps) {
  const [website, setWebsite] = useState(currentWebsite);
  const [twitterUrl, setTwitterUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  // Initialize form data from current values
  useEffect(() => {
    if (isOpen) {
      setWebsite(currentWebsite || '');
      
      // Extract URLs from current social handles
      const twitter = currentSocialHandles.find(h => h.platform === 'twitter');
      const instagram = currentSocialHandles.find(h => h.platform === 'instagram');
      const facebook = currentSocialHandles.find(h => h.platform === 'facebook');
      const linkedin = currentSocialHandles.find(h => h.platform === 'linkedin');
      const youtube = currentSocialHandles.find(h => h.platform === 'youtube');
      const tiktok = currentSocialHandles.find(h => h.platform === 'tiktok');
      
      setTwitterUrl(twitter?.url || '');
      setInstagramUrl(instagram?.url || '');
      setFacebookUrl(facebook?.url || '');
      setLinkedinUrl(linkedin?.url || '');
      setYoutubeUrl(youtube?.url || '');
      setTiktokUrl(tiktok?.url || '');
      
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentWebsite, currentSocialHandles]);

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

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    // Validate all URLs
    const urls = [
      { name: 'Website', url: website },
      { name: 'Twitter', url: twitterUrl },
      { name: 'Instagram', url: instagramUrl },
      { name: 'Facebook', url: facebookUrl },
      { name: 'LinkedIn', url: linkedinUrl },
      { name: 'YouTube', url: youtubeUrl },
      { name: 'TikTok', url: tiktokUrl },
    ];

    for (const { name, url } of urls) {
      if (url && !validateUrl(url)) {
        showError(`Invalid ${name} URL. Please enter a valid URL starting with http:// or https://`);
        return;
      }
    }

    setIsSaving(true);
    try {
      // Build update payload - only include fields that have values
      // Empty strings will clear the field, non-empty strings will set it
      const updateData: any = {};
      
      // Always include website (empty string to clear, or the URL)
      updateData.website = website || '';
      
      // Include social media URLs (empty string to clear, or the URL)
      updateData.twitterUrl = twitterUrl || '';
      updateData.instagramUrl = instagramUrl || '';
      updateData.facebookUrl = facebookUrl || '';
      updateData.linkedinUrl = linkedinUrl || '';
      updateData.youtubeUrl = youtubeUrl || '';
      updateData.tiktokUrl = tiktokUrl || '';

      // Send all updates in one API call
      await profileApi.update(updateData);

      // Build social handles array for the callback (excluding website as it's stored separately)
      const socialHandles: SocialHandle[] = [];
      if (twitterUrl) socialHandles.push({ platform: 'twitter', url: twitterUrl });
      if (instagramUrl) socialHandles.push({ platform: 'instagram', url: instagramUrl });
      if (facebookUrl) socialHandles.push({ platform: 'facebook', url: facebookUrl });
      if (linkedinUrl) socialHandles.push({ platform: 'linkedin', url: linkedinUrl });
      if (youtubeUrl) socialHandles.push({ platform: 'youtube', url: youtubeUrl });
      if (tiktokUrl) socialHandles.push({ platform: 'tiktok', url: tiktokUrl });

      onUpdate(website || undefined, socialHandles);
      showSuccess('Social links updated successfully!');
      onClose();
    } catch (error: any) {
      console.error('Error saving social links:', error);
      showError(error?.message || 'Failed to save social links');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const socialPlatforms = [
    {
      name: 'Website',
      value: website,
      onChange: setWebsite,
      placeholder: 'https://yourwebsite.com',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
    },
    {
      name: 'X',
      value: twitterUrl,
      onChange: setTwitterUrl,
      placeholder: 'https://x.com/yourhandle',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      value: instagramUrl,
      onChange: setInstagramUrl,
      placeholder: 'https://instagram.com/yourhandle',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      value: facebookUrl,
      onChange: setFacebookUrl,
      placeholder: 'https://facebook.com/yourpage',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      value: linkedinUrl,
      onChange: setLinkedinUrl,
      placeholder: 'https://linkedin.com/in/yourprofile',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      value: youtubeUrl,
      onChange: setYoutubeUrl,
      placeholder: 'https://youtube.com/@yourchannel',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      value: tiktokUrl,
      onChange: setTiktokUrl,
      placeholder: 'https://tiktok.com/@yourhandle',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="browser-window max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="browser-header">
          <div className="browser-controls">
            <div className="browser-dot red" />
            <div className="browser-dot yellow" />
            <div className="browser-dot green" />
          </div>
          <div className="flex-1" />
          <h2 className="hand-drawn text-lg font-bold text-black">Edit Social Links</h2>
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
          <p className="text-xs sm:text-sm text-gray-700 mb-4">
            Add your social media profiles and website. These will be displayed on your profile.
          </p>

          {/* Social Links Form */}
          <div className="space-y-4 mb-6">
            {socialPlatforms.map((platform) => (
              <div key={platform.name}>
                <label className="hand-drawn block text-sm font-bold mb-2 text-black">
                  {platform.name}
                </label>
                <div className="flex items-center gap-2 border-2 border-black rounded-md bg-white focus-within:ring-2 focus-within:ring-yellow-400">
                  <div className="pl-3 text-gray-600 flex-shrink-0">
                    {platform.icon}
                  </div>
                  <input
                    type="url"
                    value={platform.value}
                    onChange={(e) => platform.onChange(e.target.value)}
                    placeholder={platform.placeholder}
                    className="flex-1 px-2 py-2 text-sm font-bold text-black bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="mb-4 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-700 font-bold text-center">
              Leave fields empty to remove social links. URLs must start with http:// or https://
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t-2 border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border-2 border-black bg-white hover:bg-gray-100 rounded-md font-bold text-sm sm:text-base text-black transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 border-2 border-black bg-yellow-400 hover:bg-yellow-500 rounded-md font-bold text-sm sm:text-base text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

