export default function WhatIsPrivateFunding() {
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
          WHAT IS IT?
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
          What is Private Funding?
        </h2>
        <p className="text-base font-semibold text-gray-800 mb-6">
          Private funding on Inventagious enables direct, exclusive deals between inventors and investors. 
          Unlike public crowdfunding, these deals are private, customizable, and designed for larger, 
          more strategic investments.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              For Inventors
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Access larger funding amounts from accredited investors. Negotiate custom terms, 
              maintain more control, and work with investors who understand your vision.
            </p>
          </div>
          <div className="border-4 border-black bg-white p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              For Investors
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Discover exclusive investment opportunities. Review projects privately, negotiate terms, 
              and invest with escrow protection and milestone-based releases.
            </p>
          </div>
        </div>
        <div className="mt-6 bg-yellow-100 border-4 border-black p-4">
          <p className="text-base font-semibold text-gray-800">
            <strong>Key Feature:</strong> All funds are held in secure Solana escrow until milestones 
            are met, protecting both inventors and investors.
          </p>
        </div>
      </div>
    </div>
  );
}

