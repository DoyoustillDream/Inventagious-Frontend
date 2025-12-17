export default function SecurityTips() {
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
          SECURITY TIPS
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
            Wallet Security Best Practices
          </h2>
          <p className="text-base font-semibold text-gray-800 mb-4">
            Keep your wallet and funds secure with these important tips.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-red-50 border-4 border-red-300 p-4 rounded">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              ⛔ Never Share Your Seed Phrase
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Your seed phrase (recovery phrase) is like your password. Never share it with anyone, including Inventagious support. We will never ask for it.
            </p>
          </div>

          <div className="bg-yellow-50 border-4 border-yellow-300 p-4 rounded">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              ✅ Only Connect to Trusted Sites
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Always verify you're on the official Inventagious website before connecting your wallet. Check the URL and look for security indicators.
            </p>
          </div>

          <div className="bg-blue-50 border-4 border-blue-300 p-4 rounded">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              🔄 Keep Software Updated
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Keep your Phantom wallet app or extension updated to the latest version for security patches and new features.
            </p>
          </div>

          <div className="bg-green-50 border-4 border-green-300 p-4 rounded">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              🔒 Use Hardware Wallets for Large Amounts
            </h3>
            <p className="text-base font-semibold text-gray-800">
              For significant amounts of funds, consider using a hardware wallet (like Ledger) connected to Phantom for extra security.
            </p>
          </div>

          <div className="bg-purple-50 border-4 border-purple-300 p-4 rounded">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              📝 Verify Transaction Details
            </h3>
            <p className="text-base font-semibold text-gray-800">
              Always review transaction details carefully before signing. Make sure amounts, addresses, and recipients are correct.
            </p>
          </div>

          <div className="bg-gray-50 border-4 border-gray-300 p-4 rounded">
            <h3 className="hand-drawn text-lg font-bold text-black mb-2">
              🛡️ OAuth Wallets (Google/Apple)
            </h3>
            <p className="text-base font-semibold text-gray-800">
              When using Google or Apple sign-in, your wallet keys are securely managed by Phantom. You can export your wallet if you want full control. Make sure to secure your Google/Apple account with 2FA.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-yellow-100 border-4 border-black p-4">
          <p className="text-sm font-bold text-black">
            <strong>💡 Remember:</strong> You are your own bank in crypto. Take security seriously, but don't let it stop you from using the platform. Start with small amounts and learn as you go.
          </p>
        </div>
      </div>
    </div>
  );
}

