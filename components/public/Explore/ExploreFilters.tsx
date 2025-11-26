'use client';

import { useState } from 'react';

export type ProjectTypeFilter = 'all' | 'crowdfunding' | 'private_funding';
export type ProjectStatusFilter = 'all' | 'active' | 'funded' | 'completed';

interface ExploreFiltersProps {
  selectedType: ProjectTypeFilter;
  selectedStatus: ProjectStatusFilter;
  searchQuery: string;
  onTypeChange: (type: ProjectTypeFilter) => void;
  onStatusChange: (status: ProjectStatusFilter) => void;
  onSearchChange: (query: string) => void;
  totalCount: number;
  filteredCount: number;
}

export default function ExploreFilters({
  selectedType,
  selectedStatus,
  searchQuery,
  onTypeChange,
  onStatusChange,
  onSearchChange,
  totalCount,
  filteredCount,
}: ExploreFiltersProps) {
  return (
    <div className="mb-8 space-y-6">
      {/* Search Bar */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects by title, description, or category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="hand-drawn w-full rounded-lg border-4 border-black bg-white px-6 py-4 text-base font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-yellow-500 transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTypeChange('all')}
            className={`hand-drawn rounded-lg border-4 border-black px-6 py-2 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedType === 'all'
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-black hover:bg-yellow-100'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => onTypeChange('crowdfunding')}
            className={`hand-drawn rounded-lg border-4 border-black px-6 py-2 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedType === 'crowdfunding'
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-black hover:bg-yellow-100'
            }`}
          >
            Crowdfunding
          </button>
          <button
            onClick={() => onTypeChange('private_funding')}
            className={`hand-drawn rounded-lg border-4 border-black px-6 py-2 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedType === 'private_funding'
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-black hover:bg-yellow-100'
            }`}
          >
            Private Funding
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStatusChange('all')}
            className={`hand-drawn rounded-lg border-4 border-black px-6 py-2 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedStatus === 'all'
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-black hover:bg-yellow-100'
            }`}
          >
            All Status
          </button>
          <button
            onClick={() => onStatusChange('active')}
            className={`hand-drawn rounded-lg border-4 border-black px-6 py-2 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedStatus === 'active'
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-black hover:bg-yellow-100'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => onStatusChange('funded')}
            className={`hand-drawn rounded-lg border-4 border-black px-6 py-2 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedStatus === 'funded'
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-black hover:bg-yellow-100'
            }`}
          >
            Funded
          </button>
          <button
            onClick={() => onStatusChange('completed')}
            className={`hand-drawn rounded-lg border-4 border-black px-6 py-2 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedStatus === 'completed'
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-black hover:bg-yellow-100'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-center">
        <p className="hand-drawn text-base font-bold text-gray-700">
          Showing <span className="text-black">{filteredCount}</span> of{' '}
          <span className="text-black">{totalCount}</span> projects
        </p>
      </div>
    </div>
  );
}

