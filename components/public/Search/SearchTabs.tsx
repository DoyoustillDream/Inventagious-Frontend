'use client';

interface SearchTabsProps {
  activeTab: 'trending' | 'near-you';
  onTabChange: (tab: 'trending' | 'near-you') => void;
}

export default function SearchTabs({ activeTab, onTabChange }: SearchTabsProps) {
  return (
    <div className="mb-6">
      <div className="flex gap-4" role="tablist">
        <button
          type="button"
          role="tab"
          onClick={() => onTabChange('trending')}
          className={`hand-drawn border-4 border-black px-6 py-3 text-base font-bold transition-all hover:scale-105 active:scale-95 ${
            activeTab === 'trending'
              ? 'bg-yellow-400 text-black'
              : 'bg-white text-black hover:bg-gray-100'
          }`}
          aria-selected={activeTab === 'trending'}
        >
          Trending
        </button>
        <button
          type="button"
          role="tab"
          onClick={() => onTabChange('near-you')}
          className={`hand-drawn border-4 border-black px-6 py-3 text-base font-bold transition-all hover:scale-105 active:scale-95 ${
            activeTab === 'near-you'
              ? 'bg-yellow-400 text-black'
              : 'bg-white text-black hover:bg-gray-100'
          }`}
          aria-selected={activeTab === 'near-you'}
        >
          All Results
        </button>
      </div>
    </div>
  );
}

