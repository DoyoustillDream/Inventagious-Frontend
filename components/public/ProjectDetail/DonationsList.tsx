'use client';

import { useDonations } from '@/hooks/useDonations';
import type { Donation } from '@/lib/api/projects';

interface DonationsListProps {
  projectId: string;
  compact?: boolean;
}

// Helper function to format wallet address
function formatWalletAddress(address: string): string {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function DonationsList({ projectId, compact = false }: DonationsListProps) {
  const { donations, isLoading } = useDonations(projectId);

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
        <ul className="space-y-3">
          {donations.slice(0, 3).map((donation) => (
            <li key={donation.id} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-300 border-2 border-black flex items-center justify-center flex-shrink-0">
                <span className="text-lg">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="hand-drawn text-sm font-bold text-black truncate" title={donation.donorWalletAddress}>
                  {formatWalletAddress(donation.donorWalletAddress)}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-bold">{donation.amount.toFixed(4)} SOL</span> · {formatDate(donation.createdAt)}
                </div>
              </div>
            </li>
          ))}
        </ul>
        {donations.length === 0 && (
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
              <li key={donation.id} className="flex items-center gap-4 pb-4 border-b-2 border-gray-200 last:border-0">
                <div className="h-12 w-12 rounded-full bg-gray-300 border-2 border-black flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="hand-drawn text-base font-bold text-black" title={donation.donorWalletAddress}>
                    {formatWalletAddress(donation.donorWalletAddress)}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-bold">{donation.amount.toFixed(4)} SOL</span> · {formatDate(donation.createdAt)}
                  </div>
                </div>
              </li>
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

