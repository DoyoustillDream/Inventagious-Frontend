export default function MobileMethod() {
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
          METHOD 3: MOBILE APP
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <div className="mb-6">
          <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
            Connect via Phantom Mobile App
          </h2>
          <p className="text-base font-semibold text-gray-800 mb-4">
            Connect using the Phantom mobile app on your iOS or Android device.
          </p>
        </div>

        <div className="bg-purple-50 border-4 border-purple-300 p-4 mb-6 rounded">
          <p className="text-sm font-bold text-gray-800">
            <strong>✅ Best for:</strong> Users who prefer mobile wallets or want to connect from their phone
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">1</span>
            </div>
            <div className="flex-1">
              <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                Install Phantom Mobile App
              </h3>
              <p className="text-base font-semibold text-gray-800 mb-2">
                Download the Phantom app from:
              </p>
              <ul className="list-disc list-inside text-base font-semibold text-gray-800 space-y-1 ml-4">
                <li>iOS: <a href="https://apps.apple.com/app/phantom-solana-wallet/1598432977" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">App Store</a></li>
                <li>Android: <a href="https://play.google.com/store/apps/details?id=app.phantom" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Play</a></li>
                <li>Create or import a wallet in the app</li>
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
                On Inventagious, click "Connect Wallet" in the header
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">3</span>
            </div>
            <div className="flex-1">
              <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                Select Mobile Connection
              </h3>
              <p className="text-base font-semibold text-gray-800">
                In the connection modal, choose "Phantom Mobile" or "Mobile Wallet"
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">4</span>
            </div>
            <div className="flex-1">
              <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                Scan QR Code
              </h3>
              <p className="text-base font-semibold text-gray-800">
                A QR code will appear. Open the Phantom app on your phone and scan the QR code to connect.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">5</span>
            </div>
            <div className="flex-1">
              <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                Approve in Mobile App
              </h3>
              <p className="text-base font-semibold text-gray-800">
                Approve the connection request in your Phantom mobile app, then sign the authentication message.
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
                Your mobile wallet is connected and you can use Inventagious from your desktop while managing your wallet on mobile.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-100 border-4 border-black p-4 mt-6">
          <p className="text-sm font-bold text-black">
            <strong>📱 Mobile Tip:</strong> The mobile connection allows you to manage your wallet securely on your phone while using Inventagious on your computer.
          </p>
        </div>
      </div>
    </div>
  );
}

