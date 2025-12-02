'use client';

import Link from 'next/link';

interface Cause {
  id: string;
  name: string;
  icon?: string;
}

interface CausesSectionProps {
  causes?: Cause[];
  isOwnProfile?: boolean;
}

export default function CausesSection({
  causes = [],
  isOwnProfile = false,
}: CausesSectionProps) {
  const hasCauses = causes && causes.length > 0;

  if (!hasCauses && !isOwnProfile) {
    return null;
  }

  return (
    <div className="mt-4">
      {hasCauses ? (
        <div className="px-3">
          <div className="flex flex-wrap gap-2">
            {causes.map((cause) => (
              <span
                key={cause.id}
                className="px-3 py-1.5 border-2 border-black bg-yellow-200 rounded-full text-sm font-bold"
              >
                {cause.name}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-3 flex flex-col items-center py-8">
          <div className="w-48 h-24 bg-yellow-100 border-2 border-black rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-center mb-2">
            Show the world what you support.
          </p>
          {isOwnProfile && (
            <Link
              href="/profile/edit/causes"
              className="inline-flex items-center px-3 py-1.5 border-2 border-black bg-white hover:bg-yellow-200 transition-colors rounded-md font-bold text-sm"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add causes
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

