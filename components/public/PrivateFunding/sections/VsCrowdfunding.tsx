export default function VsCrowdfunding() {
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
          COMPARISON
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
          Private Funding vs Crowdfunding
        </h2>
        <p className="text-base font-semibold text-gray-800 mb-6">
          Choose the right funding model for your project:
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-4 border-black bg-yellow-50 p-4">
              <h3 className="hand-drawn text-lg font-bold text-black mb-3">
                Crowdfunding
              </h3>
              <ul className="space-y-2 text-sm font-semibold text-gray-800">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Open to everyone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Small to medium amounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Public visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Fixed terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Community-driven</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Best for: Products, services, community projects</span>
                </li>
              </ul>
            </div>
            <div className="border-4 border-black bg-gray-50 p-4">
              <h3 className="hand-drawn text-lg font-bold text-black mb-3">
                Private Funding
              </h3>
              <ul className="space-y-2 text-sm font-semibold text-gray-800">
                <li className="flex items-start gap-2">
                  <span className="text-gray-600">•</span>
                  <span>Exclusive to selected investors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600">•</span>
                  <span>Larger investment amounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600">•</span>
                  <span>Private visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600">•</span>
                  <span>Negotiable custom terms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600">•</span>
                  <span>Strategic partnerships</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600">•</span>
                  <span>Best for: Larger projects, equity deals, strategic investments</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-yellow-100 border-4 border-black p-4">
            <p className="text-base font-semibold text-gray-800">
              <strong>Tip:</strong> You can use both! Start with crowdfunding to validate your idea, 
              then move to private funding for larger growth rounds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

