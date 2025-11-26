export default function FeaturedProjectsListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="browser-window overflow-hidden animate-pulse"
        >
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot red" />
              <div className="browser-dot yellow" />
              <div className="browser-dot green" />
            </div>
            <div className="flex-1" />
            <div className="h-4 w-32 bg-gray-300 rounded" />
            <div className="flex-1" />
          </div>
          <div className="h-48 w-full bg-gray-200" />
          <div className="p-6">
            <div className="h-6 bg-gray-300 rounded mb-3" />
            <div className="h-4 bg-gray-300 rounded mb-2" />
            <div className="h-4 bg-gray-300 rounded mb-4 w-3/4" />
            <div className="h-4 bg-gray-300 rounded mb-2" />
            <div className="h-4 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

