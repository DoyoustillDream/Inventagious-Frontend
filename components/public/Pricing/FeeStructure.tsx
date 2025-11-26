const feeExamples = [
  {
    amount: '0.1 SOL',
    increments: 1,
    fee: '0.0019 SOL',
    feePercent: '1.9%',
    netAmount: '0.0981 SOL',
  },
  {
    amount: '0.5 SOL',
    increments: 5,
    fee: '0.0095 SOL',
    feePercent: '1.9%',
    netAmount: '0.4905 SOL',
  },
  {
    amount: '1.0 SOL',
    increments: 10,
    fee: '0.019 SOL',
    feePercent: '1.9%',
    netAmount: '0.981 SOL',
  },
  {
    amount: '5.0 SOL',
    increments: 50,
    fee: '0.095 SOL',
    feePercent: '1.9%',
    netAmount: '4.905 SOL',
  },
  {
    amount: '10.0 SOL',
    increments: 100,
    fee: '0.19 SOL',
    feePercent: '1.9%',
    netAmount: '9.81 SOL',
  },
];

export default function FeeStructure() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="hand-drawn text-sm font-bold uppercase tracking-[0.3em] text-black">
            Platform Fees
          </p>
          <h2 className="hand-drawn mt-3 text-3xl font-bold md:text-4xl text-black">
            Simple, transparent fee structure
          </h2>
          <p className="hand-drawn mt-4 text-lg font-bold text-black max-w-3xl mx-auto">
            We charge a simple 1.9% platform fee on all transactions. The larger the contribution, the more you keep.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          <div className="browser-window">
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
            <div className="p-8">
              <h3 className="hand-drawn text-xl font-bold text-black mb-4">How fees are calculated</h3>
              <div className="border-2 border-black bg-gray-50 p-6 mb-4">
                <p className="hand-drawn text-sm font-bold text-black mb-2">
                  Formula: Fee = Amount × 1.9%
                </p>
                <p className="hand-drawn text-sm font-bold text-black">
                  Simple flat rate fee. Minimum transaction is 0.1 SOL.
                </p>
              </div>
              <div className="border-2 border-black bg-yellow-50 p-6">
                <p className="hand-drawn text-base font-bold text-black mb-2">
                  Example: 1.0 SOL
                </p>
                <p className="hand-drawn text-sm font-bold text-black">
                  1.0 SOL × 1.9% = 0.019 SOL fee
                </p>
                <p className="hand-drawn text-sm font-bold text-black mt-2">
                  You receive: 0.981 SOL
                </p>
              </div>
            </div>
          </div>

          <div className="browser-window">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold">
                FEE EXAMPLES
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-8">
              <h3 className="hand-drawn text-xl font-bold text-black mb-4">Fee examples</h3>
              <div className="space-y-4">
                {feeExamples.map((example, index) => (
                  <div key={index} className="border-2 border-black bg-white p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="hand-drawn text-lg font-bold text-black">{example.amount}</span>
                      <span className="hand-drawn text-sm font-bold text-black bg-yellow-400 px-2 py-1">
                        {example.feePercent} fee
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="hand-drawn text-xs font-bold text-black">Fee: </span>
                        <span className="hand-drawn text-sm font-bold text-black">{example.fee}</span>
                      </div>
                      <div>
                        <span className="hand-drawn text-xs font-bold text-black">You get: </span>
                        <span className="hand-drawn text-sm font-bold text-black">{example.netAmount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

