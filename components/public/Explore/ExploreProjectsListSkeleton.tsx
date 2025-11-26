export default function ExploreProjectsListSkeleton() {
  return (
    <div className="space-y-8">
      {/* Filters Skeleton */}
      <div className="mb-8 space-y-6">
        <div className="w-full max-w-2xl mx-auto">
          <div className="h-14 bg-gray-200 rounded-lg border-4 border-gray-300 animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-10 w-32 bg-gray-200 rounded-lg border-4 border-gray-300 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Projects Grid Skeleton */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="browser-window overflow-hidden"
          >
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
            </div>
            <div className="h-48 w-full bg-gray-200 animate-pulse" />
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

