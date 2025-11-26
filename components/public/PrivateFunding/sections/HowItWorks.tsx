export default function HowItWorks() {
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
          HOW IT WORKS
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
          How Private Funding Works
        </h2>
        <p className="text-base font-semibold text-gray-800 mb-6">
          The private funding process is simple, secure, and transparent:
        </p>
        <div className="space-y-4">
          <div className="bg-white border-4 border-black p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="hand-drawn text-xl font-bold text-black">1</span>
              </div>
              <div>
                <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                  Create or Discover Projects
                </h3>
                <p className="text-base font-semibold text-gray-800">
                  Inventors create private projects. Investors browse and discover opportunities. 
                  Projects can be set to private visibility, accessible only via direct link.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="hand-drawn text-xl font-bold text-black">2</span>
              </div>
              <div>
                <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                  Investor Creates Deal Proposal
                </h3>
                <p className="text-base font-semibold text-gray-800">
                  Investors propose funding deals with custom terms, amounts, and milestones. 
                  Terms can include equity, revenue sharing, or other negotiated agreements.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="hand-drawn text-xl font-bold text-black">3</span>
              </div>
              <div>
                <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                  Inventor Reviews & Accepts
                </h3>
                <p className="text-base font-semibold text-gray-800">
                  Inventors review deal proposals, negotiate terms if needed, and accept or reject offers. 
                  Once accepted, funds are automatically escrowed on Solana blockchain.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="hand-drawn text-xl font-bold text-black">4</span>
              </div>
              <div>
                <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                  Milestone-Based Releases
                </h3>
                <p className="text-base font-semibold text-gray-800">
                  Funds are released automatically as milestones are completed. This protects investors 
                  and ensures inventors deliver on promises. Both parties can track progress transparently.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="hand-drawn text-xl font-bold text-black">5</span>
              </div>
              <div>
                <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                  Secure & Transparent
                </h3>
                <p className="text-base font-semibold text-gray-800">
                  All transactions happen on Solana blockchain. Smart contracts handle escrow, 
                  releases, and fee collection automatically. No intermediaries, no delays, no disputes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

