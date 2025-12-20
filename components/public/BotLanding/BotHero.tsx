'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface QuickStats {
  users?: number;
  trades?: number;
  volume?: number;
}

export default function BotHero() {
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);

  useEffect(() => {
    // Try to fetch quick stats, but don't block if it fails
    async function fetchQuickStats() {
      try {
        // Use Next.js API route to proxy bot health endpoint (avoids CORS)
        const res = await fetch('/api/bot/health', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setQuickStats({
            users: data.statistics?.users?.total,
            trades: data.statistics?.trades?.executed,
            volume: data.statistics?.volume?.total,
          });
        }
      } catch (error) {
        // Silently fail - stats are optional
      }
    }
    fetchQuickStats();
  }, []);

  const formatNumber = (num?: number): string => {
    if (!num) return '—';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-24 md:py-36">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFEB3B] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFEB3B] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Trust badges */}
          {quickStats && (
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-2 border-gray-800 rounded-full">
                <span className="text-[#FFEB3B] font-bold">{formatNumber(quickStats.users)}</span>
                <span className="text-gray-400 text-sm">Users</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-2 border-gray-800 rounded-full">
                <span className="text-[#FFEB3B] font-bold">{formatNumber(quickStats.trades)}</span>
                <span className="text-gray-400 text-sm">Trades</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-2 border-gray-800 rounded-full">
                <span className="text-[#FFEB3B] font-bold">${formatNumber(quickStats.volume)}</span>
                <span className="text-gray-400 text-sm">Volume</span>
              </div>
            </div>
          )}

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Trade <span className="text-[#FFEB3B]">Faster.</span>
            <br />
            Smarter. Without Friction.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            A powerful Telegram bot that lets you trade on Polymarket up to{' '}
            <span className="text-[#FFEB3B] font-bold">5x faster</span> — with zero lag, smart alerts, and multi-wallet support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="https://t.me/polymarketbigbrainbot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-[#FFEB3B] text-black font-bold text-lg rounded-lg border-4 border-black hover:bg-[#FFF9C4] transition-all duration-200 hover:scale-105 active:scale-95 shadow-[6px_6px_0_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0_rgba(0,0,0,0.3)]"
            >
              Start Trading Now →
            </a>
            <Link
              href="#features"
              className="inline-block px-8 py-4 bg-transparent text-white font-bold text-lg rounded-lg border-4 border-white hover:bg-white hover:text-black transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Learn More
            </Link>
          </div>

          {/* Key features highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-lg p-4">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-white font-bold">5x Faster</div>
              <div className="text-gray-400 text-sm">Than traditional methods</div>
            </div>
            <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-lg p-4">
              <div className="text-3xl mb-2">🔒</div>
              <div className="text-white font-bold">100% Secure</div>
              <div className="text-gray-400 text-sm">Your keys, your funds</div>
            </div>
            <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-lg p-4">
              <div className="text-3xl mb-2">🚀</div>
              <div className="text-white font-bold">Zero Setup</div>
              <div className="text-gray-400 text-sm">Start trading instantly</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

