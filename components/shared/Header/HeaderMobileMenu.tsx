'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '../Logo';
import WalletConnect from '@/components/auth/WalletConnect';
import { useAuth } from '@/components/auth/AuthProvider';

interface MobileMenuSection {
  title: string;
  items: Array<{
    title: string;
    href: string;
    description?: string;
  }>;
}

const mobileMenuSections: MobileMenuSection[] = [
  {
    title: 'Discover',
    items: [
      { title: 'Categories', href: '/category', description: 'Browse projects by category' },
      { title: 'Featured Projects', href: '/projects/featured', description: 'Discover trending projects' },
      { title: 'All Projects', href: '/projects', description: 'View all available projects' },
    ],
  },
  {
    title: 'Fundraise',
    items: [
      { title: 'How to start a project', href: '/help/start-project', description: 'Step-by-step guide' },
      { title: 'Project categories', href: '/help/categories', description: 'Find the right category' },
      { title: 'Fundraising tips', href: '/help/tips', description: 'Tips and strategies' },
      // COMMENTED OUT: Private funding
      // { title: 'Private funding', href: '/private', description: 'Explore private funding' },
    ],
  },
  {
    title: 'Moddio',
    items: [
      { title: 'Moddio Overview', href: '/moddio', description: 'Learn about Moddio game engine' },
      { title: 'Game Engine', href: '/moddio/game-engine', description: 'Explore no-code game engine' },
      { title: 'Solana Integration', href: '/moddio/solana-integration', description: 'Discover blockchain enhancements' },
    ],
  },
  {
    title: 'About',
    items: [
      { title: 'How Inventagious works', href: '/about', description: 'Learn about our platform' },
      { title: 'Pricing', href: '/about/pricing', description: 'Transparent pricing' },
      { title: 'Help Center', href: '/help', description: 'Get support' },
      { title: 'About Us', href: '/about', description: 'Learn more' },
    ],
  },
];

interface HeaderMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HeaderMobileMenu({ isOpen, onClose }: HeaderMobileMenuProps) {
  const { isAuthenticated } = useAuth();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div className="absolute right-0 top-0 h-full w-80 bg-white border-l-4 border-black shadow-2xl overflow-y-auto">
        <div className="p-4 border-b-4 border-black bg-yellow-400">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" onClick={onClose} className="flex items-center">
              <Logo variant="main" size="sm" className="flex-shrink-0 rounded-full overflow-hidden" />
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border-4 border-black bg-white hover:bg-yellow-600 transition-all"
              aria-label="Close menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Search */}
          <Link
            href="/search"
            onClick={onClose}
            className="flex items-center gap-2 p-3 rounded-lg border-4 border-black bg-white hover:bg-yellow-100 transition-all"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="font-bold">Search</span>
          </Link>

          {/* Menu Sections */}
          {mobileMenuSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-bold text-black mb-2">{section.title}</h3>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block p-3 rounded-lg hover:bg-yellow-100 transition-all"
                    >
                      <div className="font-bold text-black mb-1">{item.title}</div>
                      {item.description && (
                        <div className="text-sm text-gray-600">{item.description}</div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Profile Link (if authenticated) */}
          {isAuthenticated && (
            <div className="pt-4 border-t-4 border-black">
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center gap-2 p-3 rounded-lg border-4 border-black bg-white hover:bg-yellow-100 transition-all"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-bold">My Profile</span>
              </Link>
            </div>
          )}

          {/* Auth Section */}
          <div className="pt-4 border-t-4 border-black">
            <div className="w-full">
              <WalletConnect />
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-4 border-t-4 border-black">
            <h3 className="text-lg font-bold text-black mb-3">Follow Us</h3>
            <a
              href="https://x.com/Inventagiousapp"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-lg border-4 border-black bg-white hover:bg-yellow-100 transition-all"
            >
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="font-bold">Follow on X (Twitter)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

