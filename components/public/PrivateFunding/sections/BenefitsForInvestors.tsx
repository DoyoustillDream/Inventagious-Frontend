export default function BenefitsForInvestors() {
  return (
    <div className="browser-window bg-yellow-50">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="flex-1" />
        <div className="yellow-highlight hand-drawn text-xs font-bold">
          FOR INVESTORS
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
          Benefits for Investors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-4 border-black bg-white p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Exclusive Opportunities
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Access to private projects and exclusive deals not available through public crowdfunding.
            </p>
          </div>
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Custom Deal Terms
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Structure deals with terms that match your investment strategy and risk profile.
            </p>
          </div>
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Escrow Security
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Funds are held in secure Solana escrow. You control when funds are released based on 
              milestone completion.
            </p>
          </div>
          <div className="border-4 border-black bg-white p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Direct Negotiation
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Communicate directly with inventors, negotiate terms, and build relationships before committing.
            </p>
          </div>
          <div className="border-4 border-black bg-white p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Transparent Tracking
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Monitor project progress, milestone completion, and fund releases in real-time on blockchain.
            </p>
          </div>
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Lower Competition
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Private deals mean less competition from other investors and better terms for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

