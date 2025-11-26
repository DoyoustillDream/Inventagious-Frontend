'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchInput from './SearchInput';
import SearchTabs from './SearchTabs';
import SearchResults from './SearchResults';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'trending' | 'near-you'>('near-you');

  return (
    <section className="halftone-gray py-12 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="hand-drawn mb-4 text-5xl font-bold text-black">
            Search Projects
          </h1>
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Find campaigns and private funding projects
          </p>
          <div className="squiggly-underline inline-block mt-4" />
        </div>

        {/* Search Input Container */}
        <div className="max-w-3xl mx-auto mb-8">
          <SearchInput query={query} onQueryChange={setQuery} />
        </div>

        {/* Tabs and Results */}
        <div className="max-w-7xl mx-auto">
          <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-6">
            <SearchResults query={query} activeTab={activeTab} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SearchPageContent() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SearchContent />
    </Suspense>
  );
}

