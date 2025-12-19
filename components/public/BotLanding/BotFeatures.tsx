'use client';

export default function BotFeatures() {
  const features = [
    {
      icon: '⚡',
      title: '5x Faster Trading',
      description: 'Execute trades instantly with zero lag. No more waiting for page loads or slow interfaces.',
    },
    {
      icon: '🔔',
      title: 'Smart Alerts',
      description: 'Get real-time notifications for market movements, price changes, and opportunities.',
    },
    {
      icon: '👛',
      title: 'Multi-Wallet Support',
      description: 'Manage multiple wallets seamlessly. Switch between accounts with ease.',
    },
    {
      icon: '📊',
      title: 'Real-Time Data',
      description: 'Access live market data, odds, and portfolio information directly in Telegram.',
    },
    {
      icon: '🛡️',
      title: 'Secure & Private',
      description: 'Your keys stay with you. We never have access to your funds or private keys.',
    },
    {
      icon: '🚀',
      title: 'Always Available',
      description: 'Trade 24/7 from anywhere. No need to open a browser or desktop app.',
    },
  ];

  return (
    <section id="features" className="relative overflow-hidden bg-[#0a0a0a] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Why Choose Our Bot?
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Everything you need to trade smarter on Polymarket, all in one place.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] border-2 border-gray-800 rounded-lg p-6 hover:border-[#FFEB3B] transition-all duration-200 hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

