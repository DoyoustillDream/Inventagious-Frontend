'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderSearchProps {
  className?: string;
}

export default function HeaderSearch({ className = '' }: HeaderSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        if (!searchQuery) {
          setIsExpanded(false);
        }
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded, searchQuery]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsExpanded(false);
    }
  };

  const handleIconClick = () => {
    setIsExpanded(true);
  };

  return (
    <>
      {/* Mobile Search Icon - Links to search page */}
      <a
        href="/search"
        className={`md:hidden flex items-center justify-center w-10 h-10 rounded-lg border-4 border-black bg-white transition-all duration-300 hover:bg-yellow-400 hover:scale-105 active:scale-95 ${className}`}
        aria-label="Search projects"
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6 fill-black"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            fill="currentColor"
          />
        </svg>
      </a>

      {/* Desktop Expandable Search */}
      <div className={`hidden md:block relative ${className}`}>
        {!isExpanded ? (
          <button
            type="button"
            onClick={handleIconClick}
            className="hand-drawn flex items-center justify-center w-12 h-12 border-4 border-black bg-white transition-all duration-300 hover:bg-yellow-400 hover:scale-110 active:scale-95 shadow-lg"
            aria-label="Search projects"
          >
            <svg
              className="h-6 w-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="absolute right-0 top-0 z-50"
          >
            <div className={`hand-drawn flex items-center border-4 border-black bg-white px-4 py-2 transition-all shadow-xl ${
              isFocused ? 'ring-4 ring-yellow-400 border-yellow-500' : ''
            }`} style={{ width: '400px' }}>
              <svg
                className="h-5 w-5 text-black mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              
              <input
                ref={inputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search..."
                className="flex-1 hand-drawn text-base font-bold text-black placeholder-gray-500 focus:outline-none bg-transparent"
                aria-label="Search projects"
              />
              
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="ml-2 p-1 border-2 border-black bg-white hover:bg-yellow-400 transition-all"
                  aria-label="Clear search"
                >
                  <svg className="h-4 w-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              <button
                type="submit"
                className="ml-2 hand-drawn border-4 border-black bg-black text-white px-4 py-1 text-sm font-bold transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black"
                aria-label="Search"
              >
                Go
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

