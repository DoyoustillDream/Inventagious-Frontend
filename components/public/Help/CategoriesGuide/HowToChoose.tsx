export default function HowToChoose() {
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
          HOW TO CHOOSE
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-6 md:p-8">
        <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-4">
          How to Choose the Right Category
        </h2>
        <p className="text-base font-semibold text-gray-800 mb-6">
          Not sure which category fits your project? Follow these steps:
        </p>
        <div className="space-y-4">
          <div className="bg-white border-4 border-black p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="hand-drawn text-lg font-bold text-black">1</span>
              </div>
              <div>
                <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                  Identify Your Core Technology
                </h3>
                <p className="text-base font-semibold text-gray-800">
                  What's the main technology or platform? If it's built on Solana, choose Solana. 
                  If it's a Web3 dApp, choose Web3. If it's blockchain infrastructure, choose Blockchain.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="hand-drawn text-lg font-bold text-black">2</span>
              </div>
              <div>
                <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                  Consider Your Product Type
                </h3>
                <p className="text-base font-semibold text-gray-800">
                  Is it physical hardware? Choose Hardware. Is it software or an app? Choose Software. 
                  Is it an NFT collection? Choose NFT. Is it a game? Choose Gaming.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="hand-drawn text-lg font-bold text-black">3</span>
              </div>
              <div>
                <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                  Think About Your Audience
                </h3>
                <p className="text-base font-semibold text-gray-800">
                  Who will back your project? DeFi projects attract crypto investors. 
                  Gaming projects attract gamers. Hardware projects attract tech enthusiasts.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="hand-drawn text-lg font-bold text-black">4</span>
              </div>
              <div>
                <h3 className="hand-drawn text-lg font-bold text-black mb-2">
                  When in Doubt, Choose Innovation
                </h3>
                <p className="text-base font-semibold text-gray-800">
                  If your project doesn't fit neatly into a specific category, or combines multiple areas, 
                  the Innovation category is perfect for cutting-edge ideas that don't fit traditional boxes.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-white border-4 border-black p-4">
          <p className="text-sm font-semibold text-gray-800">
            <strong>Remember:</strong> You can always update your category later if needed. 
            The most important thing is to get started!
          </p>
        </div>
      </div>
    </div>
  );
}

