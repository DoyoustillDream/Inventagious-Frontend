'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Person {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

interface DiscoverPeopleSectionProps {
  people?: Person[];
  isOwnProfile?: boolean;
}

export default function DiscoverPeopleSection({
  people = [],
  isOwnProfile = false,
}: DiscoverPeopleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isOwnProfile || people.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center px-3 mb-2">
        <div className="flex-1 mr-2">
          <h2 className="text-lg font-bold text-black mb-0">Discover more people</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 border-2 border-black rounded-full hover:bg-yellow-200 transition-colors"
          aria-label={isExpanded ? 'Hide more people' : 'Show more people'}
        >
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="px-3">
          <ul className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {people.slice(0, 10).map((person) => (
              <li
                key={person.id}
                className="flex-shrink-0 w-32 border-2 border-black rounded-lg bg-white p-3 hover:shadow-lg transition-shadow"
              >
                <Link
                  href={`/u/${person.username}`}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-black overflow-hidden mb-2 bg-yellow-100">
                    {person.avatarUrl ? (
                      <Image
                        src={person.avatarUrl}
                        alt={person.displayName}
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold">
                        {person.displayName[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-black mb-2 line-clamp-2">
                    {person.displayName}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle follow action
                    }}
                    className="w-full px-3 py-1.5 border-2 border-black bg-yellow-200 hover:bg-yellow-300 transition-colors rounded-md font-bold text-xs"
                  >
                    Follow
                  </button>
                </Link>
              </li>
            ))}
            <li className="flex-shrink-0 w-32 border-2 border-black rounded-lg bg-white p-3 hover:shadow-lg transition-shadow">
              <Link
                href="/explore"
                className="flex flex-col items-center text-center h-full justify-center"
              >
                <div className="flex -space-x-2 mb-2">
                  {people.slice(0, 2).map((person, idx) => (
                    <div
                      key={person.id}
                      className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-yellow-100"
                    >
                      {person.avatarUrl ? (
                        <Image
                          src={person.avatarUrl}
                          alt={person.displayName}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold">
                          {person.displayName[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <h3 className="text-sm font-bold text-black mb-2">Find more people</h3>
                <button className="w-full px-3 py-1.5 border-2 border-black bg-yellow-200 hover:bg-yellow-300 transition-colors rounded-md font-bold text-xs">
                  See all
                </button>
              </Link>
            </li>
          </ul>
          <div className="pl-3">
            <Link
              href="/explore"
              className="inline-block px-4 py-1.5 border-2 border-black bg-white hover:bg-yellow-200 transition-colors rounded-md font-bold text-sm"
            >
              See all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

