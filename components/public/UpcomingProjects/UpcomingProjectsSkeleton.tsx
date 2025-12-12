export default function UpcomingProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="browser-window animate-pulse">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot red" />
              <div className="browser-dot yellow" />
              <div className="browser-dot green" />
            </div>
          </div>
          <div className="h-48 w-full bg-gray-200" />
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-3" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-4 w-3/4" />
            <div className="h-20 bg-gray-200 rounded mb-4" />
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded flex-1" />
              <div className="h-10 bg-gray-200 rounded w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

