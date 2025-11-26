export default function WhyCategories() {
  return (
    <div className="browser-window bg-white">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="flex-1" />
        <div className="yellow-highlight hand-drawn text-xs font-bold">
          WHY CATEGORIES?
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
          Why Categories Matter
        </h2>
        <p className="text-base font-semibold text-gray-800 mb-6">
          Categories help organize projects and make it easier for backers to find what they're looking for. 
          Choosing the right category is important for your project's success.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Better Discovery
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Backers browse by category. The right category puts your project in front of interested supporters.
            </p>
          </div>
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Targeted Audience
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Each category attracts specific types of backers. Match your project to find the right investors.
            </p>
          </div>
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Community Building
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Categories create communities. Connect with other creators and backers in your space.
            </p>
          </div>
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Platform Organization
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Categories help us feature projects, create collections, and highlight innovations by type.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

