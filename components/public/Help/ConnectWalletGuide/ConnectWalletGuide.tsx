'use client';

import { useState } from 'react';
import Link from 'next/link';
import ConnectWalletHero from './ConnectWalletHero';
import GoogleAppleMethod from './sections/GoogleAppleMethod';
import BrowserExtensionMethod from './sections/BrowserExtensionMethod';
import MobileMethod from './sections/MobileMethod';
import SecurityTips from './sections/SecurityTips';

type TabType = 'google-apple' | 'extension' | 'mobile' | 'security';

const tabs: { id: TabType; label: string }[] = [
  { id: 'google-apple', label: 'Google/Apple' },
  { id: 'extension', label: 'Browser Extension' },
  { id: 'mobile', label: 'Mobile App' },
  { id: 'security', label: 'Security Tips' },
];

export default function ConnectWalletGuide() {
  const [activeTab, setActiveTab] = useState<TabType>('google-apple');

  return (
    <div className="container mx-auto px-4">
      <ConnectWalletHero />
      
      <div className="max-w-6xl mx-auto mt-12">
        {/* Tab Navigation */}
        <div className="browser-window bg-white mb-8">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot red" />
              <div className="browser-dot yellow" />
              <div className="browser-dot green" />
            </div>
            <div className="flex-1" />
            <div className="yellow-highlight hand-drawn text-xs font-bold">
              CONNECTION METHODS
            </div>
            <div className="flex-1" />
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`hand-drawn px-4 py-2 text-sm font-bold border-4 transition-all ${
                    activeTab === tab.id
                      ? 'border-black bg-yellow-400 text-black scale-105'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'google-apple' && <GoogleAppleMethod />}
          {activeTab === 'extension' && <BrowserExtensionMethod />}
          {activeTab === 'mobile' && <MobileMethod />}
          {activeTab === 'security' && <SecurityTips />}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 mb-8">
          <div className="browser-window bg-yellow-50">
            <div className="browser-header">
              <div className="browser-controls">
                <div className="browser-dot red" />
                <div className="browser-dot yellow" />
                <div className="browser-dot green" />
              </div>
              <div className="flex-1" />
              <div className="yellow-highlight hand-drawn text-xs font-bold">
                READY TO CONNECT?
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-8 text-center">
              <p className="hand-drawn text-xl font-bold text-black mb-6">
                Connect your wallet and start using Inventagious!
              </p>
              <Link
                href="/wallet/connect"
                className="hand-drawn inline-block border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95"
              >
                Connect Wallet Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

