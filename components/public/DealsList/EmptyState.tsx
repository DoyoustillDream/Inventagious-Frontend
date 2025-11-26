'use client';

import Link from 'next/link';

interface EmptyStateProps {
  selectedStatus: 'all' | 'active' | 'funded' | 'completed';
}

export default function EmptyState({ selectedStatus }: EmptyStateProps) {
  const getMessage = () => {
    switch (selectedStatus) {
      case 'active':
        return "No active private funding projects at the moment. Check back soon!";
      case 'funded':
        return "No funded projects yet.";
      case 'completed':
        return "No completed projects yet.";
      default:
        return "No private funding projects found. Be the first to create one!";
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <p className="hand-drawn text-xl font-bold text-gray-800 mb-4">
        {getMessage()}
      </p>
      {selectedStatus === 'all' && (
        <Link
          href="/deals/create"
          className="hand-drawn inline-block border-4 border-black bg-yellow-400 px-8 py-4 text-lg font-bold text-black transition-all hover:bg-yellow-600 hover:scale-105 active:scale-95"
        >
          Create Your First Private Funding Project
        </Link>
      )}
    </div>
  );
}

