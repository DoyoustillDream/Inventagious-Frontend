'use client';

interface ProjectFiltersProps {
  selectedType: 'all' | 'crowdfunding' | 'private_funding';
  onTypeChange: (type: 'all' | 'crowdfunding' | 'private_funding') => void;
  totalCount: number;
  filteredCount: number;
}

export default function ProjectFilters({
  selectedType,
  onTypeChange,
  totalCount,
  filteredCount,
}: ProjectFiltersProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTypeChange('all')}
            className={`hand-drawn rounded-lg border-4 border-black px-6 py-2 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedType === 'all'
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-black hover:bg-yellow-100'
            }`}
          >
            All Projects
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
        <div className="hand-drawn text-sm font-bold text-gray-700">
          Showing {filteredCount} of {totalCount} projects
        </div>
      </div>
    </div>
  );
}

