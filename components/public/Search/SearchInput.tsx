'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

interface SearchInputProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export default function SearchInput({ query, onQueryChange }: SearchInputProps) {
  const router = useRouter();
  const [localQuery, setLocalQuery] = useState(query);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onQueryChange(localQuery);
    // Update URL with search query
    const params = new URLSearchParams();
    if (localQuery) {
      params.set('q', localQuery);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="browser-window">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="flex-1" />
        <div className="yellow-highlight hand-drawn text-xs font-bold">
          SEARCH
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6">
        <div className="hand-drawn flex items-center border-4 border-black bg-white px-5 py-4 transition-all focus-within:ring-4 focus-within:ring-yellow-400 focus-within:border-yellow-500">
          {/* Search Icon */}
          <svg
            className="h-6 w-6 text-black mr-3 flex-shrink-0"
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

          {/* Search Input */}
          <input
            type="search"
            name="q"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search campaigns, projects, categories..."
            autoComplete="off"
            className="flex-1 hand-drawn text-lg font-bold text-black placeholder-gray-500 focus:outline-none bg-transparent"
          />

          {/* Clear Button */}
          {localQuery && (
            <button
              type="button"
              onClick={() => {
                setLocalQuery('');
                onQueryChange('');
                router.push('/search');
              }}
              className="ml-3 p-1 border-2 border-black bg-white hover:bg-yellow-400 transition-all hover:scale-110 active:scale-95"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className="ml-3 hand-drawn border-4 border-black bg-black text-white px-6 py-2 font-bold transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

