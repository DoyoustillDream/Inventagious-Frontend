'use client';

import Link from 'next/link';

interface PrivacyBannerProps {
  isPrivate?: boolean;
  isOwnProfile?: boolean;
}

export default function PrivacyBanner({
  isPrivate = false,
  isOwnProfile = false,
}: PrivacyBannerProps) {
  if (!isPrivate || !isOwnProfile) {
    return null;
  }

  return (
    <div className="mt-2 px-3">
      <div className="border-2 border-black rounded-lg bg-yellow-100 p-3 flex items-center gap-2">
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
        <div className="flex-1 text-sm">
          <span className="text-black font-bold">Your profile is private. </span>
          <Link
            href="/profile/edit/privacy"
            className="underline font-bold text-black hover:text-gray-800"
          >
            Change visibility
          </Link>
        </div>
      </div>
    </div>
  );
}

