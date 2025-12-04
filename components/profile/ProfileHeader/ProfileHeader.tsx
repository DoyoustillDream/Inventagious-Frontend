'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/shared/Logo';
import HeaderSearch from '@/components/shared/Header/HeaderSearch';
import HeaderAuth from '@/components/shared/Header/HeaderAuth';
import { useAuth } from '@/components/auth/AuthProvider';
import Image from 'next/image';

interface ProfileHeaderProps {
  profile?: {
    username?: string;
    displayName?: string;
    avatarUrl?: string;
  };
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const profileMenuItems = [
    { title: 'My Profile', href: '/profile', icon: '👤' },
    { title: 'Edit Profile', href: '/profile/edit', icon: '✏️' },
    { title: 'My Projects', href: '/profile/projects', icon: '📁' },
    { title: 'Settings', href: '/profile/settings', icon: '⚙️' },
  ];

  const isActive = (href: string) => {
    if (href === '/profile') {
      return pathname === '/profile';
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b-4 border-black bg-yellow-400 halftone-bg transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="grid grid-cols-3 h-20 items-center" aria-label="Profile menu">
            {/* Left Section - Profile Navigation */}
            <div className="flex items-center gap-2 md:gap-4 justify-start">
              <div className="hidden lg:flex items-center gap-2">
                {profileMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`hand-drawn px-3 py-2 rounded-lg border-3 border-black font-bold text-sm transition-all ${
                      isActive(item.href)
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-yellow-200 hover:scale-105 active:scale-95'
                    }`}
                  >
                    <span className="hidden xl:inline">{item.icon} </span>
                    {item.title}
                  </Link>
                ))}
              </div>
              {/* Mobile Profile Menu Button */}
              <button
                type="button"
                className="lg:hidden flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-3 border-black bg-white transition-all hover:bg-yellow-200"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open profile menu"
              >
                {profile?.avatarUrl ? (
                  <div className="w-8 h-8 rounded-full border-2 border-black overflow-hidden">
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.displayName || profile.username || 'Profile'}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <span className="text-lg">👤</span>
                )}
                <span className="hand-drawn font-bold text-sm">Menu</span>
              </button>
            </div>

            {/* Center Section - Logo */}
            <div className="flex justify-center items-center">
              <Link
                href="/"
                className="flex items-center"
                aria-label="Inventagious Home"
              >
                <Logo variant="main" size="md" className="flex-shrink-0 drop-shadow-lg rounded-full overflow-hidden" />
              </Link>
            </div>

            {/* Right Section - Search, Auth & Profile */}
            <div className="flex items-center gap-3 justify-end w-full">
              {/* Search */}
              <HeaderSearch />
              {/* Auth (Desktop) */}
              <div className="hidden lg:flex items-center gap-3">
                <HeaderAuth />
              </div>
              {/* Profile Avatar (Desktop) */}
              {isAuthenticated && profile && (
                <Link
                  href="/profile"
                  className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg border-3 border-black bg-white hover:bg-yellow-200 transition-all"
                >
                  {profile.avatarUrl ? (
                    <div className="w-8 h-8 rounded-full border-2 border-black overflow-hidden">
                      <Image
                        src={profile.avatarUrl}
                        alt={profile.displayName || profile.username || 'Profile'}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-black bg-yellow-200 flex items-center justify-center font-bold">
                      {(profile.displayName || profile.username || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hand-drawn font-bold text-sm hidden xl:inline">
                    {profile.displayName || profile.username}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Profile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white border-l-4 border-black shadow-2xl overflow-y-auto">
            <div className="p-4 border-b-4 border-black bg-yellow-400">
              <div className="flex items-center justify-between mb-4">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
                  <Logo variant="main" size="sm" className="flex-shrink-0 rounded-full overflow-hidden" />
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
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
              {profile && (
                <div className="flex items-center gap-3 p-3 bg-white border-3 border-black rounded-lg">
                  {profile.avatarUrl ? (
                    <div className="w-12 h-12 rounded-full border-3 border-black overflow-hidden">
                      <Image
                        src={profile.avatarUrl}
                        alt={profile.displayName || profile.username || 'Profile'}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full border-3 border-black bg-yellow-200 flex items-center justify-center font-bold text-xl">
                      {(profile.displayName || profile.username || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="hand-drawn font-bold text-black">
                      {profile.displayName || profile.username}
                    </p>
                    {profile.username && (
                      <p className="text-xs text-gray-700 font-semibold">@{profile.username}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 space-y-2">
              {profileMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block p-4 rounded-lg border-3 border-black transition-all ${
                    isActive(item.href)
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-yellow-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="hand-drawn font-bold">{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

