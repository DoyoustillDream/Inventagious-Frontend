export default function BrowserExtensionMethod() {
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
          METHOD 2: BROWSER EXTENSION
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
            Connect with Phantom Browser Extension
          </h2>
          <p className="text-base font-semibold text-gray-800 mb-4">
            Use your existing Phantom browser extension if you already have one installed.
          </p>
        </div>

        <div className="bg-green-50 border-4 border-green-300 p-4 mb-6 rounded">
          <p className="text-sm font-bold text-gray-800">
            <strong>✅ Best for:</strong> Users who already have Phantom extension installed, or prefer full control over their wallet
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">1</span>
            </div>
            <div className="flex-1">
              <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                Install Phantom Extension (if needed)
              </h3>
              <p className="text-base font-semibold text-gray-800 mb-2">
                If you don't have Phantom installed:
              </p>
              <ul className="list-disc list-inside text-base font-semibold text-gray-800 space-y-1 ml-4">
                <li>Visit <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">phantom.app</a></li>
                <li>Download for Chrome, Firefox, Brave, or Edge</li>
                <li>Install the extension and create or import a wallet</li>
                <li><strong>Important:</strong> Save your seed phrase securely!</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">2</span>
            </div>
            <div className="flex-1">
              <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                Click "Connect Wallet"
              </h3>
              <p className="text-base font-semibold text-gray-800">
                Click the "Connect Wallet" button in the header. If Phantom extension is detected, it will be available as an option.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">3</span>
            </div>
            <div className="flex-1">
              <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                Select Phantom Extension
              </h3>
              <p className="text-base font-semibold text-gray-800">
                In the connection modal, choose "Phantom Extension" or "Injected Wallet"
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">4</span>
            </div>
            <div className="flex-1">
              <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                Approve Connection
              </h3>
              <p className="text-base font-semibold text-gray-800">
                The Phantom extension will open a popup. Click "Connect" to approve the connection request.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">5</span>
            </div>
            <div className="flex-1">
              <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                Sign Authentication Message
              </h3>
              <p className="text-base font-semibold text-gray-800">
                Approve the signature request in the Phantom extension to authenticate with Inventagious.
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
                Your wallet is connected and your account is ready. You can now use all features of Inventagious.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-100 border-4 border-black p-4 mt-6">
          <p className="text-sm font-bold text-black">
            <strong>💡 Tip:</strong> With the extension method, you have full control over your wallet. Make sure to keep your seed phrase safe and never share it with anyone.
          </p>
        </div>
      </div>
    </div>
  );
}

