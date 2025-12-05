'use client';

import { useState } from 'react';
import CausesEditModal from './CausesEditModal';

interface Cause {
  id: string;
  name: string;
  icon?: string;
}

interface CausesSectionProps {
  causes?: Cause[];
  isOwnProfile?: boolean;
  onUpdate?: (causes: Cause[]) => void;
}

export default function CausesSection({
  causes = [],
  isOwnProfile = false,
  onUpdate,
}: CausesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasCauses = causes && causes.length > 0;

  const handleUpdate = (updatedCauses: Cause[]) => {
    if (onUpdate) {
      onUpdate(updatedCauses);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="hand-drawn text-xl sm:text-2xl font-bold text-black">Causes</h2>
        {isOwnProfile && hasCauses && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 border-2 border-black rounded-md hover:bg-yellow-200 transition-colors text-black flex-shrink-0"
            aria-label="Edit causes"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}
      </div>
      {hasCauses ? (
        <div>
          <div className="flex flex-wrap gap-2">
            {causes.map((cause) => (
              <span
                key={cause.id}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 border-black bg-yellow-200 rounded-full text-xs sm:text-sm font-bold text-black"
              >
                {cause.name}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className={`flex flex-col items-center py-6 sm:py-8 ${
          !isOwnProfile ? 'border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg' : ''
        }`}>
          <div className={`w-40 sm:w-48 h-20 sm:h-24 border-2 border-black rounded-lg flex items-center justify-center mb-3 sm:mb-4 ${
            isOwnProfile ? 'bg-yellow-100' : 'bg-white'
          }`}>
            <svg
              className={`w-10 h-10 sm:w-12 sm:h-12 ${
                isOwnProfile ? 'text-black' : 'text-gray-400'
              }`}
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
          <p className={`text-sm sm:text-base font-bold text-center mb-2 px-2 ${
            isOwnProfile ? 'text-gray-800' : 'text-gray-600'
          }`}>
            {isOwnProfile 
              ? 'Show the world what you support.'
              : 'This creator hasn\'t added any causes yet.'}
          </p>
          {isOwnProfile && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-3 py-1.5 border-2 border-black bg-white hover:bg-yellow-200 transition-colors rounded-md font-bold text-xs sm:text-sm text-black"
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
            </button>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isOwnProfile && (
        <CausesEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentCauses={causes}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

