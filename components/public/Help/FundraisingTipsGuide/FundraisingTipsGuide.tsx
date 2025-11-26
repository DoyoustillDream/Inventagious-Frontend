'use client';

import { useState } from 'react';
import Link from 'next/link';
import TipsHero from './TipsHero';
import PreparationTips from './sections/PreparationTips';
import LaunchTips from './sections/LaunchTips';
import MarketingTips from './sections/MarketingTips';
import EngagementTips from './sections/EngagementTips';
import CommonMistakes from './sections/CommonMistakes';
import SuccessFactors from './sections/SuccessFactors';

type TabType = 'preparation' | 'launch' | 'marketing' | 'engagement' | 'mistakes' | 'success';

const tabs: { id: TabType; label: string }[] = [
  { id: 'preparation', label: 'Preparation' },
  { id: 'launch', label: 'Launch' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'mistakes', label: 'Mistakes' },
  { id: 'success', label: 'Success' },
];

export default function FundraisingTipsGuide() {
  const [activeTab, setActiveTab] = useState<TabType>('preparation');

  return (
    <div className="container mx-auto px-4">
      <TipsHero />
      
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
              TIP CATEGORIES
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
          {activeTab === 'preparation' && <PreparationTips />}
          {activeTab === 'launch' && <LaunchTips />}
          {activeTab === 'marketing' && <MarketingTips />}
          {activeTab === 'engagement' && <EngagementTips />}
          {activeTab === 'mistakes' && <CommonMistakes />}
          {activeTab === 'success' && <SuccessFactors />}
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
                READY TO LAUNCH?
              </div>
              <div className="flex-1" />
            </div>
            <div className="p-8 text-center">
              <p className="hand-drawn text-xl font-bold text-black mb-6">
                Apply these tips to your campaign!
              </p>
              <Link
                href="/projects/create"
                className="hand-drawn inline-block border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95"
              >
                Create Your Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
