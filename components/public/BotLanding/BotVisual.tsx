'use client';

export default function BotVisual() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Laptop Mockup Container */}
          <div className="relative">
            {/* Laptop Frame */}
            <div className="relative mx-auto max-w-4xl">
              {/* Laptop Top Bar */}
              <div className="bg-gray-800 rounded-t-lg h-8 flex items-center px-4 border-2 border-gray-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 border border-gray-600"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 border border-gray-600"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 border border-gray-600"></div>
                </div>
              </div>
              
              {/* Laptop Screen */}
              <div className="bg-[#1a1a1a] border-2 border-gray-700 border-t-0 rounded-b-lg p-4 md:p-8">
                {/* Mock Telegram Interface */}
                <div className="bg-[#0a0a0a] rounded-lg p-6 space-y-4">
                  {/* Bot Header */}
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-800">
                    <div className="w-12 h-12 rounded-full bg-[#FFEB3B] flex items-center justify-center font-bold text-black text-xl">
                      P
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Polymarket Bot</h3>
                      <p className="text-gray-400 text-sm">Powered by Inventagious</p>
                    </div>
                  </div>
                  
                  {/* Sample Messages */}
                  <div className="space-y-3">
                    <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-lg p-4">
                      <p className="text-white text-sm mb-2">📊 <strong>Market Alert</strong></p>
                      <p className="text-gray-300 text-sm">Fed decision in October?</p>
                      <p className="text-[#FFEB3B] text-xs mt-2">25 bps decrease: 94%</p>
                    </div>
                    <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-lg p-4">
                      <p className="text-white text-sm mb-2">⚡ <strong>Quick Trade</strong></p>
                      <p className="text-gray-300 text-sm">Execute trades instantly with zero lag</p>
                    </div>
                    <div className="bg-[#FFEB3B] border-2 border-black rounded-lg p-4">
                      <p className="text-black text-sm font-bold">💰 Portfolio: $849.41</p>
                      <p className="text-black text-xs">Cash: $88.44</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Laptop Base */}
              <div className="h-2 bg-gray-800 mx-auto max-w-[95%] rounded-b-lg"></div>
              <div className="h-1 bg-gray-900 mx-auto max-w-[90%] rounded-b-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

