export default function GoogleAppleMethod() {
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
          METHOD 1: GOOGLE / APPLE
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
            Sign in with Google or Apple (Easiest Method)
          </h2>
          <p className="text-base font-semibold text-gray-800 mb-4">
            Perfect for beginners! No browser extension needed. A secure, non-custodial wallet is automatically created for you.
          </p>
        </div>

        <div className="bg-blue-50 border-4 border-blue-300 p-4 mb-6 rounded">
          <p className="text-sm font-bold text-gray-800">
            <strong>✅ Best for:</strong> First-time users, people new to crypto, or anyone who wants the simplest experience
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">1</span>
            </div>
            <div className="flex-1">
              <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                Click "Connect Wallet"
              </h3>
              <p className="text-base font-semibold text-gray-800">
                Find the "Connect Wallet" button in the header of any page on Inventagious
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">2</span>
            </div>
            <div className="flex-1">
              <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                Choose Sign-in Method
              </h3>
              <p className="text-base font-semibold text-gray-800 mb-2">
                In the connection modal, select either:
              </p>
              <ul className="list-disc list-inside text-base font-semibold text-gray-800 space-y-1 ml-4">
                <li><strong>Sign in with Google</strong> - Use your Google account</li>
                <li><strong>Sign in with Apple</strong> - Use your Apple ID</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">3</span>
            </div>
            <div className="flex-1">
              <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                Complete OAuth Sign-in
              </h3>
              <p className="text-base font-semibold text-gray-800">
                Sign in with your Google or Apple account. A secure wallet is automatically created and linked to your account.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">4</span>
            </div>
            <div className="flex-1">
              <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                Sign Authentication Message
              </h3>
              <p className="text-base font-semibold text-gray-800">
                Approve the signature request to authenticate with Inventagious. This proves you own the wallet.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">✓</span>
            </div>
            <div className="flex-1">
              <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                You're Connected!
              </h3>
              <p className="text-base font-semibold text-gray-800">
                Your account is created automatically. You can now create projects, contribute to campaigns, and manage your profile.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-100 border-4 border-black p-4 mt-6">
          <p className="text-sm font-bold text-black">
            <strong>🔒 Security Note:</strong> Your wallet keys are securely managed by Phantom. You maintain full control - this is a non-custodial wallet. Never share your recovery phrase if you export your wallet.
          </p>
        </div>
      </div>
    </div>
  );
}

