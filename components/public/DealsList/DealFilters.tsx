'use client';

interface DealFiltersProps {
  selectedStatus: 'all' | 'active' | 'funded' | 'completed';
  onStatusChange: (status: 'all' | 'active' | 'funded' | 'completed') => void;
  totalCount: number;
  filteredCount: number;
}

export default function DealFilters({
  selectedStatus,
  onStatusChange,
  totalCount,
  filteredCount,
}: DealFiltersProps) {
  const statusOptions = [
    { value: 'all' as const, label: 'All Projects' },
    { value: 'active' as const, label: 'Active' },
    { value: 'funded' as const, label: 'Funded' },
    { value: 'completed' as const, label: 'Completed' },
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={`hand-drawn border-4 border-black px-6 py-3 text-base font-bold transition-all ${
              selectedStatus === option.value
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-black hover:bg-gray-100'
            } hover:scale-105 active:scale-95`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="hand-drawn text-sm font-semibold text-gray-700">
        Showing {filteredCount} of {totalCount} private funding projects
      </p>
    </div>
  );
}

