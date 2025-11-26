export default function BenefitsForInventors() {
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
          FOR INVENTORS
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
          Benefits for Inventors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Larger Funding Amounts
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Access to larger investments from accredited investors who can commit significant capital 
              to your project.
            </p>
          </div>
          <div className="border-4 border-black bg-white p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Custom Terms
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Negotiate terms that work for you: equity, revenue sharing, convertible notes, 
              or other structures.
            </p>
          </div>
          <div className="border-4 border-black bg-white p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Strategic Partners
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Work with investors who bring expertise, networks, and strategic value beyond just capital.
            </p>
          </div>
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Privacy & Control
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Keep your project private until ready. Control who sees your project and when.
            </p>
          </div>
          <div className="border-4 border-black bg-yellow-50 p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Escrow Protection
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Funds are secured in escrow. Investors can't withdraw once the deal is accepted, 
              protecting your interests.
            </p>
          </div>
          <div className="border-4 border-black bg-white p-4">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              Milestone-Based Releases
            </h3>
            <p className="text-sm font-semibold text-gray-800">
              Receive funds as you hit milestones. This builds investor confidence and ensures 
              you have capital when you need it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

