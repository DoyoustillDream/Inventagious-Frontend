'use client';

import Link from 'next/link';

interface EmptyStateProps {
  selectedStatus: 'all' | 'active' | 'funded' | 'completed';
}

export default function EmptyState({ selectedStatus }: EmptyStateProps) {
  const getMessage = () => {
    switch (selectedStatus) {
      case 'active':
        return "No active campaigns at the moment. Check back soon!";
      case 'funded':
        return "No funded campaigns yet.";
      case 'completed':
        return "No completed campaigns yet.";
      default:
        return "No campaigns found. Be the first to create one!";
    }
  };

  return (
    <div className="text-center py-12">
      <div className="mb-6">
        <svg
          className="mx-auto h-24 w-24 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <p className="hand-drawn text-xl font-bold text-gray-800 mb-4">
        {getMessage()}
      </p>
      {selectedStatus === 'all' && (
        <Link
          href="/campaigns/create"
          className="hand-drawn inline-block border-4 border-black bg-yellow-400 px-8 py-4 text-lg font-bold text-black transition-all hover:bg-yellow-600 hover:scale-105 active:scale-95"
        >
          Create Your First Campaign
        </Link>
      )}
    </div>
  );
}

