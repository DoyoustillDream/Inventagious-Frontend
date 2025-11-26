export default function DealsListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="browser-window animate-pulse"
        >
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot red" />
              <div className="browser-dot yellow" />
              <div className="browser-dot green" />
            </div>
          </div>
          <div className="p-6">
            <div className="h-48 bg-gray-200 rounded mb-4" />
            <div className="h-6 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

