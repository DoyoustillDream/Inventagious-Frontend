'use client';

import { useState } from 'react';

interface Command {
  command: string;
  description: string;
  example: string;
  category: 'wallet' | 'trading' | 'alerts' | 'settings' | 'general';
}

const commands: Command[] = [
  // General
  {
    command: '/start',
    description: 'Initialize your account and get started',
    example: '/start',
    category: 'general',
  },
  {
    command: '/help',
    description: 'Show help message with all available commands',
    example: '/help',
    category: 'general',
  },
  {
    command: '/inventagious',
    description: 'Learn more about Inventagious platform',
    example: '/inventagious',
    category: 'general',
  },
  // Wallet
  {
    command: '/wallets',
    description: 'List all your wallets and their balances',
    example: '/wallets',
    category: 'wallet',
  },
  {
    command: '/wallet_create',
    description: 'Create a new wallet with a custom name',
    example: '/wallet_create MyWallet',
    category: 'wallet',
  },
  {
    command: '/wallet_import',
    description: 'Import an existing wallet using private key',
    example: '/wallet_import <private_key> <name>',
    category: 'wallet',
  },
  {
    command: '/wallet_key',
    description: 'View your wallet private key (encrypted)',
    example: '/wallet_key <wallet_id>',
    category: 'wallet',
  },
  {
    command: '/wallet_delete',
    description: 'Delete a wallet (use with caution)',
    example: '/wallet_delete <wallet_id>',
    category: 'wallet',
  },
  {
    command: '/matic_topup',
    description: 'Get MATIC for gas fees',
    example: '/matic_topup',
    category: 'wallet',
  },
  {
    command: '/withdraw_usdc_all',
    description: 'Withdraw all USDC from wallet',
    example: '/withdraw_usdc_all <wallet_id> <address>',
    category: 'wallet',
  },
  {
    command: '/withdraw_matic_all',
    description: 'Withdraw all MATIC from wallet',
    example: '/withdraw_matic_all <wallet_id> <address>',
    category: 'wallet',
  },
  // Trading
  {
    command: '/trade',
    description: 'Execute a trade on a market',
    example: '/trade <market_id> <side> <amount> <price> [wallet_id]',
    category: 'trading',
  },
  {
    command: '/trades',
    description: 'View your trade history',
    example: '/trades',
    category: 'trading',
  },
  {
    command: '/market',
    description: 'View details of a specific market',
    example: '/market <market_id>',
    category: 'trading',
  },
  {
    command: '/search',
    description: 'Search for markets by keyword',
    example: '/search <query>',
    category: 'trading',
  },
  // Alerts
  {
    command: '/alerts',
    description: 'List all your active alerts',
    example: '/alerts',
    category: 'alerts',
  },
  {
    command: '/alert_create',
    description: 'Create a new alert for a market',
    example: '/alert_create <market_id> <condition_type> <threshold>',
    category: 'alerts',
  },
  {
    command: '/alert_delete',
    description: 'Delete an alert',
    example: '/alert_delete <alert_id>',
    category: 'alerts',
  },
  // Settings
  {
    command: '/settings',
    description: 'View and manage your bot settings',
    example: '/settings',
    category: 'settings',
  },
];

const categories = [
  { id: 'all', label: 'All Commands', icon: '📋' },
  { id: 'general', label: 'General', icon: '⚡' },
  { id: 'wallet', label: 'Wallet', icon: '👛' },
  { id: 'trading', label: 'Trading', icon: '📊' },
  { id: 'alerts', label: 'Alerts', icon: '🔔' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
] as const;

export default function BotCommands() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const filteredCommands = commands.filter((cmd) => {
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    const matchesSearch =
      cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="commands" className="relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] py-20 md:py-28 border-t border-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Command Reference
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Complete list of all available bot commands
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search commands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1a] border-2 border-gray-800 rounded-lg px-6 py-4 text-white placeholder-gray-500 focus:border-[#FFEB3B] focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#FFEB3B] text-black border-black'
                    : 'bg-[#1a1a1a] text-white border-gray-800 hover:border-[#FFEB3B]'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* Commands List */}
          <div className="space-y-4">
            {filteredCommands.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No commands found matching your search.</p>
              </div>
            ) : (
              filteredCommands.map((cmd, index) => (
                <div
                  key={index}
                  className="bg-[#1a1a1a] border-2 border-gray-800 rounded-lg p-6 hover:border-[#FFEB3B] transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="text-[#FFEB3B] font-mono font-bold text-lg">
                          {cmd.command}
                        </code>
                        <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{cmd.description}</p>
                      <div className="mt-3">
                        <span className="text-gray-500 text-sm">Example: </span>
                        <code className="text-gray-400 font-mono text-sm bg-[#0a0a0a] px-2 py-1 rounded">
                          {cmd.example}
                        </code>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(cmd.command)}
                      className="px-4 py-2 bg-[#FFEB3B] text-black font-bold rounded-lg border-2 border-black hover:bg-[#FFF9C4] transition-colors whitespace-nowrap"
                    >
                      {copiedCommand === cmd.command ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://t.me/polymarketbigbrainbot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-[#FFEB3B] text-black font-bold text-lg rounded-lg border-4 border-black hover:bg-[#FFF9C4] transition-all duration-200 hover:scale-105"
            >
              Try Commands in Bot →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

