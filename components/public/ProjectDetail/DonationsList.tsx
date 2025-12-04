'use client';

import { useState, useEffect } from 'react';
import { useDonations } from '@/hooks/useDonations';
import type { Donation } from '@/lib/api/projects';
import { profileApi, type Profile } from '@/lib/api/profile';
import { apiClient } from '@/lib/api/client';

interface DonationsListProps {
  projectId: string;
  compact?: boolean;
}

// Cache for user profiles by wallet address
const profileCache = new Map<string, { profile: Profile | null; timestamp: number }>();
const PROFILE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Helper function to format wallet address
function formatWalletAddress(address: string): string {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Hook to get user profile by wallet address
function useProfileByWallet(walletAddress: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) {
      setProfile(null);
      return;
    }

    // Check cache
    const cached = profileCache.get(walletAddress.toLowerCase());
    const now = Date.now();
    if (cached && now - cached.timestamp < PROFILE_CACHE_TTL_MS) {
      setProfile(cached.profile);
      return;
    }

    // Fetch profile - try to get by wallet address via backend
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Try to get profile by wallet address
        // The backend might not have this endpoint, so we'll handle gracefully
        const response = await apiClient.get<Profile>(`/profile/wallet/${walletAddress.toLowerCase()}`).catch(() => null);
        
        profileCache.set(walletAddress.toLowerCase(), {
          profile: response || null,
          timestamp: now,
        });
        setProfile(response || null);
      } catch (error: any) {
        // If endpoint doesn't exist (404) or other error, cache null to avoid repeated requests
        if (error?.response?.status !== 404) {
          console.warn('Failed to fetch profile for wallet:', walletAddress, error);
        }
        profileCache.set(walletAddress.toLowerCase(), {
          profile: null,
          timestamp: now,
        });
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [walletAddress]);

  return { profile, isLoading };
}

// Donation item component with profile fetching
function DonationItem({ 
  donation, 
  formatDate, 
  compact = true 
}: { 
  donation: Donation; 
  formatDate: (date: string) => string;
  compact?: boolean;
}) {
  const walletAddress = donation.donorWalletAddress || '';
  const { profile } = useProfileByWallet(walletAddress || null);
  
  const displayName = profile?.displayName || profile?.username || (walletAddress ? formatWalletAddress(walletAddress) : 'Anonymous');
  const avatarUrl = profile?.avatarUrl;
  const size = compact ? 'h-10 w-10' : 'h-12 w-12';
  const textSize = compact ? 'text-sm' : 'text-base';
  const iconSize = compact ? 'text-lg' : 'text-xl';

  return (
    <li className={`flex items-center ${compact ? 'gap-3' : 'gap-4'} ${!compact ? 'pb-4 border-b-2 border-gray-200 last:border-0' : ''}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName}
          className={`${size} rounded-full border-2 border-black flex-shrink-0 object-cover`}
          onError={(e) => {
            // Fallback to emoji if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `<span class="${iconSize}">👤</span>`;
            }
          }}
        />
      ) : (
        <div className={`${size} rounded-full bg-gray-300 border-2 border-black flex items-center justify-center flex-shrink-0`}>
          <span className={iconSize}>👤</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className={`hand-drawn ${textSize} font-bold text-black truncate`} title={walletAddress || 'Anonymous'}>
          {displayName}
        </div>
        <div className={`text-xs text-gray-600`}>
          <span className="font-bold">{donation.amount.toFixed(4)} SOL</span> · {formatDate(donation.createdAt)}
        </div>
      </div>
    </li>
  );
}

export default function DonationsList({ projectId, compact = false }: DonationsListProps) {
  const { donations, isLoading } = useDonations(projectId, {
    pollInterval: 3000, // Poll every 3 seconds
    enablePolling: true,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const monthsAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
    if (monthsAgo === 0) return 'Just now';
    if (monthsAgo === 1) return '1 mo';
    return `${monthsAgo} mo`;
  };

  if (compact) {
    if (isLoading) {
      return (
        <div>
          <h3 className="hand-drawn text-sm font-bold text-black mb-3">Recent Donations</h3>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      );
    }

    return (
      <div>
        <h3 className="hand-drawn text-sm font-bold text-black mb-3">Recent Donations</h3>
        {donations.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-black rounded-lg">
            <div className="h-10 w-10 rounded-full bg-gray-300 border-2 border-black flex items-center justify-center">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <div className="hand-drawn text-sm font-bold text-black">
                Become an early supporter
              </div>
              <p className="text-xs text-gray-600">Your donation matters</p>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {donations.slice(0, 3).map((donation) => (
              <DonationItem key={donation.id} donation={donation} formatDate={formatDate} />
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="browser-window mb-6">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="flex-1" />
        <div className="yellow-highlight hand-drawn text-xs font-bold text-center px-4">
          DONATIONS
        </div>
        <div className="flex-1" />
      </div>

      <div className="p-6">
        <h2 className="hand-drawn text-xl font-bold text-black mb-4">
          Donations{' '}
          <span className="text-sm font-normal bg-gray-200 px-2 py-1 rounded border-2 border-black">
            {donations.length}
          </span>
        </h2>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-600">Loading donations...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-8">
            <p className="hand-drawn text-lg font-bold text-gray-700 mb-2">
              No donations yet
            </p>
            <p className="text-sm text-gray-600">Be the first to support this project!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {donations.map((donation) => (
              <DonationItem key={donation.id} donation={donation} formatDate={formatDate} compact={false} />
            ))}
          </ul>
        )}

        {donations.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 border-2 border-black rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-300 border-2 border-black flex items-center justify-center">
                <span className="text-lg">💡</span>
              </div>
              <div>
                <div className="hand-drawn text-sm font-bold text-black">
                  Become an early supporter
                </div>
                <p className="text-xs text-gray-600">Your donation matters</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

