'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '../Logo';
import HeaderNav from './HeaderNav';
import HeaderSearch from './HeaderSearch';
import HeaderAuth from './HeaderAuth';
import HeaderMobileMenu from './HeaderMobileMenu';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b-4 border-black bg-yellow-400 halftone-bg transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        {/* Skip to content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-lg focus:font-bold"
        >
          Skip to content
        </a>

        <div className="container mx-auto px-4 lg:px-8">
          <nav className="grid grid-cols-3 h-20 items-center" aria-label="Main menu">
            {/* Left Section - Navigation */}
            <div className="flex items-center gap-4 justify-start">
              <div className="hidden lg:flex items-center gap-2">
                <HeaderNav />
              </div>
            </div>

            {/* Center Section - Logo */}
            <div className="flex justify-center items-center">
              <Link
                href="/"
                className="flex items-center"
                aria-label="Inventagious Home"
              >
                <Logo variant="main" size="md" className="flex-shrink-0 drop-shadow-lg" />
              </Link>
            </div>

            {/* Right Section - Search, Auth & Mobile Menu */}
            <div className="flex items-center gap-3 justify-end w-full">
              {/* Search */}
              <HeaderSearch />
              {/* Auth (Desktop) */}
              <div className="hidden lg:flex items-center gap-3">
                <HeaderAuth />
              </div>
              {/* Mobile Menu Button */}
              <button
                type="button"
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border-4 border-black bg-white transition-all duration-300 hover:bg-yellow-600 hover:scale-105 active:scale-95"
                aria-label="Open menu"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg
                  aria-hidden="true"
                  className="h-6 w-6 fill-black"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 12h18M3 6h18M3 18h18"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <HeaderMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
