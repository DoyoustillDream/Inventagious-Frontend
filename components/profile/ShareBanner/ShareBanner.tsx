'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/components/shared/Toast';

interface ShareBannerProps {
  profileName?: string;
  avatarUrl?: string;
  profileUrl?: string;
  onShare?: () => void;
}

export default function ShareBanner({
  profileName,
  avatarUrl,
  profileUrl,
  onShare,
}: ShareBannerProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showSuccess } = useToast();

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }

    setIsSharing(true);
    try {
      const shareUrl = profileUrl || (typeof window !== 'undefined' ? window.location.href : '');
      
      if (navigator.share && navigator.share !== undefined) {
        try {
          await navigator.share({
            title: `${profileName || 'Check out this profile'} on Inventagious`,
            text: `Check out ${profileName || 'this profile'} on Inventagious and inspire others to help.`,
            url: shareUrl,
          });
          showSuccess('Profile shared successfully!');
        } catch (shareError: any) {
          // User cancelled or share failed, fall back to copy
          if (shareError.name !== 'AbortError') {
            await handleCopy(shareUrl);
          }
        }
      } else {
        await handleCopy(shareUrl);
      }
    } catch (err) {
      console.error('Error sharing:', err);
      showSuccess('Failed to share profile. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showSuccess('Profile link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        showSuccess('Profile link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        showSuccess('Failed to copy link. Please copy manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className="hand-drawn rounded-lg border-4 border-black bg-white hover:bg-yellow-200 px-6 py-3 text-base font-bold text-black transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isSharing ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sharing...
        </>
      ) : copied ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}

