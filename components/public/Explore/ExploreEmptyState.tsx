import { ProjectTypeFilter, ProjectStatusFilter } from './ExploreFilters';

interface ExploreEmptyStateProps {
  selectedType: ProjectTypeFilter;
  selectedStatus: ProjectStatusFilter;
  searchQuery: string;
}

export default function ExploreEmptyState({
  selectedType,
  selectedStatus,
  searchQuery,
}: ExploreEmptyStateProps) {
  const getMessage = () => {
    if (searchQuery.trim()) {
      return `No projects found matching "${searchQuery}"`;
    }
    if (selectedType !== 'all' && selectedStatus !== 'all') {
      return `No ${selectedType.replace('_', ' ')} projects with ${selectedStatus} status found`;
    }
    if (selectedType !== 'all') {
      return `No ${selectedType.replace('_', ' ')} projects found`;
    }
    if (selectedStatus !== 'all') {
      return `No projects with ${selectedStatus} status found`;
    }
    return 'No projects available at the moment';
  };

  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <svg
          className="mx-auto h-24 w-24 text-gray-400"
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
      <h3 className="hand-drawn mb-4 text-2xl font-bold text-black">
        {getMessage()}
      </h3>
      <p className="mb-6 text-base font-semibold text-gray-700">
        Try adjusting your filters or check back later for new projects
      </p>
      <div className="squiggly-underline inline-block mt-4" />
    </div>
  );
}

