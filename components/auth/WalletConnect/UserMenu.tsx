'use client';

import { useState, useRef, useEffect, useId } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

interface UserMenuProps {
  walletAddress: string;
  shortAddress: string;
  onDisconnect: () => void;
}

export default function UserMenu({ walletAddress, shortAddress, onDisconnect }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const baseId = useId();
  const dropdownId = `user-menu-${baseId}`;
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="hand-drawn flex items-center gap-2 rounded-lg border-4 border-black bg-gradient-to-r from-white to-yellow-50 px-4 py-2.5 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
        aria-controls={dropdownId}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="relative flex-shrink-0">
          <svg
            className="h-6 w-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base font-bold text-black whitespace-nowrap">{shortAddress}</span>
        </div>

        <div className="h-6 w-0.5 bg-black flex-shrink-0"></div>

        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg
            aria-hidden="true"
            className="h-4 w-4 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          id={dropdownId}
          className="absolute right-0 top-full mt-2 w-64 rounded-lg border-4 border-black bg-white shadow-2xl z-50"
        >
          <div className="p-2">
            {/* Wallet Address Info */}
            <div className="px-3 py-2 border-b-2 border-gray-200 mb-2">
              <div className="text-xs font-semibold text-gray-600 mb-1">Wallet Address</div>
              <div className="text-sm font-bold text-black break-all">{walletAddress}</div>
            </div>

            {/* Profile Link - Show when wallet is connected */}
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-yellow-100 hover:scale-[1.02] active:scale-100"
            >
              <svg
                className="h-5 w-5 text-black flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <div className="flex-1">
                <div className="text-base font-bold text-black">My Profile</div>
                <div className="text-xs text-gray-600">View and edit your profile</div>
              </div>
            </Link>

            {/* Disconnect Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                onDisconnect();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-red-100 hover:border-red-600 mt-2"
              aria-label="Disconnect wallet"
            >
              <svg
                className="h-5 w-5 text-red-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <div className="flex-1 text-left">
                <div className="text-base font-bold text-red-600">Disconnect</div>
                <div className="text-xs text-gray-600">Disconnect your wallet</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

