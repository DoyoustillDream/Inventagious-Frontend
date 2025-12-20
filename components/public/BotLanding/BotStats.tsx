'use client';

import { useEffect, useState } from 'react';

interface BotHealthStats {
  status: string;
  bot: {
    running: boolean;
    uptime: number;
  };
  statistics: {
    users: {
      total: number;
    };
    trades: {
      total: number;
      executed: number;
      today: number;
    };
    volume: {
      total: number;
    };
    wallets: {
      active: number;
    };
    alerts: {
      active: number;
    };
  };
  timestamp: string;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function BotStats() {
  const [stats, setStats] = useState<BotHealthStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Use Next.js API route to proxy bot health endpoint (avoids CORS)
        try {
          const res = await fetch('/api/bot/health', {
            cache: 'no-store',
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(5000),
          });
          
          if (res.ok) {
            const data = await res.json();
            setStats(data);
            setError(null);
            setIsMockData(false);
          } else {
            // If API returns error, use mock data
            throw new Error(`API returned ${res.status}`);
          }
        } catch (fetchError: any) {
          // Only use mock data if it's a network error or timeout
          if (fetchError.name === 'AbortError' || fetchError.name === 'TypeError' || fetchError.message?.includes('fetch')) {
            console.warn('Bot API not available, using demo data:', fetchError.message);
            setStats({
              status: 'online',
              bot: {
                running: true,
                uptime: 86400 * 7, // 7 days
              },
              statistics: {
                users: { total: 1234 },
                trades: { total: 5678, executed: 5432, today: 89 },
                volume: { total: 1234567.89 },
                wallets: { active: 890 },
                alerts: { active: 234 },
              },
              timestamp: new Date().toISOString(),
            });
            setIsMockData(true);
            setError(null);
          } else {
            throw fetchError;
          }
        }
      } catch (err) {
        console.error('Error fetching bot stats:', err);
        setError('Unable to load statistics');
        setIsMockData(false);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1a1a1a] border-2 border-gray-800 rounded-lg p-6 animate-pulse"
                >
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && !stats) {
    return null; // Don't show error, just hide the section
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      label: 'Total Users',
      value: formatNumber(stats.statistics.users.total),
      icon: '👥',
      color: 'text-blue-400',
    },
    {
      label: 'Trades Executed',
      value: formatNumber(stats.statistics.trades.executed),
      icon: '📊',
      color: 'text-green-400',
    },
    {
      label: 'Total Volume',
      value: `$${formatNumber(stats.statistics.volume.total)}`,
      icon: '💰',
      color: 'text-[#FFEB3B]',
    },
    {
      label: 'Active Wallets',
      value: formatNumber(stats.statistics.wallets.active),
      icon: '👛',
      color: 'text-purple-400',
    },
    {
      label: 'Active Alerts',
      value: formatNumber(stats.statistics.alerts.active),
      icon: '🔔',
      color: 'text-orange-400',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] py-20 md:py-28 border-t border-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Live Statistics
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real-time metrics from our trading bot
            </p>
            <div className="mt-4 flex flex-col items-center gap-3">
              {stats.bot.running && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border-2 border-green-500 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">
                    Online • Uptime: {formatUptime(stats.bot.uptime)}
                  </span>
                </div>
              )}
              {isMockData && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border-2 border-yellow-500 rounded-full">
                  <span className="text-yellow-400 text-sm font-medium">
                    ⚠️ Demo Data • Connect bot API to see live stats
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] border-2 border-gray-800 rounded-lg p-6 hover:border-[#FFEB3B] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#FFEB3B]/20"
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {stats.statistics.trades.today > 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                <span className="text-[#FFEB3B] font-bold">{stats.statistics.trades.today}</span> trades executed today
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

