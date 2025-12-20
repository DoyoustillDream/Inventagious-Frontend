'use client';

interface PricingTier {
  name: string;
  fee: string;
  feePercent: number;
  features: string[];
  popular?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: 'Standard',
    fee: '0.5%',
    feePercent: 0.5,
    features: [
      'Fast trade execution',
      'Multi-wallet support',
      'Price alerts',
      'Volume alerts',
      'Basic support',
    ],
  },
  {
    name: 'Premium',
    fee: '0.3%',
    feePercent: 0.3,
    features: [
      'Everything in Standard',
      'Lower trading fees',
      'Priority support',
      'Advanced alert types',
      'Fee sharing rewards',
      'Early access to features',
    ],
    popular: true,
  },
  {
    name: 'VIP',
    fee: '0.1%',
    feePercent: 0.1,
    features: [
      'Everything in Premium',
      'Lowest trading fees',
      'Dedicated support',
      'Custom alert configurations',
      'Maximum fee sharing',
      'Exclusive market insights',
      'Priority trade execution',
    ],
  },
];

export default function BotPricing() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-20 md:py-28 border-t border-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Simple fee structure. No hidden costs. Pay only when you trade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`relative bg-[#1a1a1a] border-2 rounded-lg p-8 ${
                  tier.popular
                    ? 'border-[#FFEB3B] scale-105 md:scale-110'
                    : 'border-gray-800 hover:border-[#FFEB3B]'
                } transition-all duration-300`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <span className="bg-[#FFEB3B] text-black font-bold px-4 py-1 rounded-full text-sm border-2 border-black">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-[#FFEB3B]">{tier.fee}</span>
                    <span className="text-gray-400 text-lg ml-2">per trade</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <span className="text-[#FFEB3B] mt-1">✓</span>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button
                    className={`w-full py-3 rounded-lg font-bold border-2 transition-all duration-200 ${
                      tier.popular
                        ? 'bg-[#FFEB3B] text-black border-black hover:bg-[#FFF9C4] hover:scale-105'
                        : 'bg-transparent text-white border-gray-700 hover:border-[#FFEB3B] hover:text-[#FFEB3B]'
                    }`}
                  >
                    {tier.name === 'Standard' ? 'Start Free' : 'Upgrade Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#1a1a1a] border-2 border-gray-800 rounded-lg p-6 md:p-8">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Fee Calculator
            </h3>
            <p className="text-gray-400 text-center mb-6">
              Calculate how much you'll pay in fees for your trades
            </p>
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Trade Amount (USDC)
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  className="w-full bg-[#0a0a0a] border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#FFEB3B] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                {tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className="text-center p-4 bg-[#0a0a0a] rounded-lg border-2 border-gray-800"
                  >
                    <div className="text-sm text-gray-400 mb-1">{tier.name}</div>
                    <div className="text-xl font-bold text-[#FFEB3B]">
                      ${((1000 * tier.feePercent) / 100).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Fees are calculated automatically on each trade. No subscription fees. No hidden costs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

