'use client';

import { Project } from '@/lib/api/projects';

interface OrganizerSectionProps {
  project: Project;
}

// Helper function to format wallet address
function formatWalletAddress(address: string): string {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
}

export default function OrganizerSection({ project }: OrganizerSectionProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const creatorWalletAddress = project.userId || '';

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
          ORGANIZER
        </div>
        <div className="flex-1" />
      </div>

      <div className="p-6">
        <h2 className="hand-drawn text-xl font-bold text-black mb-4">Organizer</h2>
        
        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-300 border-2 border-black flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">👤</span>
          </div>
          <div className="flex-1">
            <div className="hand-drawn text-base font-bold text-black mb-1" title={creatorWalletAddress}>
              {creatorWalletAddress ? formatWalletAddress(creatorWalletAddress) : 'Unknown'}
            </div>
            <div className="text-sm text-gray-600 mb-1">Creator Wallet Address</div>
            {project.category && (
              <div className="text-sm text-gray-600">{project.category}</div>
            )}
          </div>
          <button className="hand-drawn rounded-lg border-4 border-black bg-white px-4 py-2 text-sm font-bold text-black transition-all duration-300 hover:bg-gray-100 hover:scale-105 active:scale-95">
            Contact
          </button>
        </div>

        <div className="pt-4 border-t-2 border-gray-200">
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <span className="font-semibold">Created:</span>{' '}
              {formatDate(project.createdAt)}
            </li>
            {project.category && (
              <li>
                <span className="font-semibold">Category:</span>{' '}
                <a href={`/projects?category=${project.category}`} className="underline">
                  {project.category}
                </a>
              </li>
            )}
            <li>
              <span className="font-semibold">Type:</span>{' '}
              {project.type === 'crowdfunding' ? 'Crowdfunding' : 'Private Funding'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

