export default function TopicsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col animate-pulse"
        >
          <div className="h-48 bg-gray-200" />
          <div className="flex flex-col flex-1 p-6">
            <div className="h-6 bg-gray-200 rounded mb-3" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-4 w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

