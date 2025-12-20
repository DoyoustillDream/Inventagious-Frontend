'use client';

export default function BotAbout() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-20 md:py-28 border-t border-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
            About The Bot
          </h2>
          
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              Our Polymarket Telegram bot brings the power of prediction market trading directly to your fingertips. 
              Built by the team at <span className="text-[#FFEB3B] font-bold">Inventagious</span>, we've created a 
              seamless trading experience that eliminates friction and maximizes speed.
            </p>
            
            <p>
              Whether you're tracking political events, sports outcomes, or financial markets, our bot gives you 
              instant access to Polymarket's prediction markets. Execute trades, monitor your portfolio, and receive 
              smart alerts—all without leaving Telegram.
            </p>
            
            <p>
              <strong className="text-white">No downloads required.</strong> No complex setup. Just start chatting 
              with the bot and begin trading. Your security is our priority—all transactions are signed directly 
              by your wallet, and we never have access to your funds.
            </p>
            
            <div className="mt-8 pt-8 border-t-2 border-gray-800">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="https://t.me/polymarketbigbrainbot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-[#FFEB3B] text-black font-bold text-lg rounded-lg border-4 border-black hover:bg-[#FFF9C4] transition-all duration-200 hover:scale-105 active:scale-95 shadow-[6px_6px_0_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0_rgba(0,0,0,0.3)]"
                >
                  Start Trading Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

