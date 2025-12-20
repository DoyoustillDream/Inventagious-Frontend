'use client';

import { useState } from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
  command?: string;
  details: string[];
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Start Chat with Bot',
    description: 'Open Telegram and search for our bot',
    details: [
      'Open Telegram on your phone or desktop',
      'Search for @polymarketbigbrainbot',
      'Click "Start" to begin chatting',
    ],
  },
  {
    number: 2,
    title: 'Initialize Your Account',
    description: 'Send the start command to set up your account',
    command: '/start',
    details: [
      'Type /start in the chat',
      'The bot will create your account automatically',
      'You\'ll receive a welcome message with instructions',
    ],
  },
  {
    number: 3,
    title: 'Create Your Wallet',
    description: 'Set up a wallet to start trading',
    command: '/wallet_create MyWallet',
    details: [
      'Use /wallet_create followed by a wallet name',
      'Example: /wallet_create MyWallet',
      'The bot will generate a secure wallet for you',
      'Your private key is encrypted and stored safely',
    ],
  },
  {
    number: 4,
    title: 'Fund Your Wallet',
    description: 'Deposit USDC to start trading',
    details: [
      'The bot will show your wallet address',
      'Send USDC (Polygon network) to that address',
      'You can check your balance with /wallets',
      'Minimum deposit: No minimum required',
    ],
  },
  {
    number: 5,
    title: 'Make Your First Trade',
    description: 'Execute a trade on any Polymarket market',
    command: '/trade <market_id> <side> <amount> <price>',
    details: [
      'Use /trade command with market details',
      'Example: /trade market-123 yes 100 0.65',
      'The bot will show a preview before executing',
      'Confirm the trade to complete it',
    ],
  },
  {
    number: 6,
    title: 'Set Up Alerts',
    description: 'Get notified about market movements',
    command: '/alert_create <market_id> <condition> <threshold>',
    details: [
      'Use /alert_create to set up price alerts',
      'Example: /alert_create market-123 price_above 0.75',
      'You\'ll receive notifications when conditions are met',
      'View all alerts with /alerts',
    ],
  },
];

export default function BotGettingStarted() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-20 md:py-28 border-t border-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Getting Started
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Follow these simple steps to start trading on Polymarket in minutes
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-[#1a1a1a] border-2 border-gray-800 rounded-lg overflow-hidden hover:border-[#FFEB3B] transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedStep(expandedStep === step.number ? null : step.number)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-[#252525] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FFEB3B] text-black font-bold text-xl flex items-center justify-center flex-shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-[#FFEB3B] text-2xl">
                    {expandedStep === step.number ? '−' : '+'}
                  </div>
                </button>

                {expandedStep === step.number && (
                  <div className="px-6 pb-6 border-t-2 border-gray-800 pt-6">
                    {step.command && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Command:
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-[#0a0a0a] border-2 border-gray-700 rounded-lg px-4 py-3 text-[#FFEB3B] font-mono text-sm">
                            {step.command}
                          </code>
                          <button
                            onClick={() => copyToClipboard(step.command!)}
                            className="px-4 py-3 bg-[#FFEB3B] text-black font-bold rounded-lg border-2 border-black hover:bg-[#FFF9C4] transition-colors"
                          >
                            {copiedCommand === step.command ? '✓' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">
                        Details:
                      </h4>
                      <ul className="space-y-2">
                        {step.details.map((detail, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-gray-300"
                          >
                            <span className="text-[#FFEB3B] mt-1">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {step.number === 1 && (
                      <div className="mt-6 pt-6 border-t-2 border-gray-800">
                        <a
                          href="https://t.me/polymarketbigbrainbot"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-6 py-3 bg-[#FFEB3B] text-black font-bold rounded-lg border-2 border-black hover:bg-[#FFF9C4] transition-all duration-200 hover:scale-105"
                        >
                          Open Bot in Telegram →
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Need more help? Check out our command reference below
            </p>
            <a
              href="#commands"
              className="text-[#FFEB3B] font-bold hover:underline"
            >
              View All Commands →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

