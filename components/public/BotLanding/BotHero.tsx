'use client';

import Link from 'next/link';

export default function BotHero() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-16 md:py-24">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Trade <span className="text-[#FFEB3B]">Faster.</span> Smarter. Without Friction.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            A powerful Telegram bot that lets you trade on Polymarket up to 5x faster — with zero lag, smart alerts, and multi-wallet support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://t.me/polymarketbigbrainbot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-[#FFEB3B] text-black font-bold text-lg rounded-lg border-4 border-black hover:bg-[#FFF9C4] transition-all duration-200 hover:scale-105 active:scale-95 shadow-[6px_6px_0_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0_rgba(0,0,0,0.3)]"
            >
              Try It
            </a>
            <Link
              href="#features"
              className="inline-block px-8 py-4 bg-transparent text-white font-bold text-lg rounded-lg border-4 border-white hover:bg-white hover:text-black transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

