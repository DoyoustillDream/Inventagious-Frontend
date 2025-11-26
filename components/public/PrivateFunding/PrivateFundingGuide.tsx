'use client';

import Link from 'next/link';
import PrivateFundingHero from './PrivateFundingHero';
import WhatIsPrivateFunding from './sections/WhatIsPrivateFunding';
import HowItWorks from './sections/HowItWorks';
import BenefitsForInventors from './sections/BenefitsForInventors';
import BenefitsForInvestors from './sections/BenefitsForInvestors';
import VsCrowdfunding from './sections/VsCrowdfunding';
import GettingStarted from './sections/GettingStarted';

export default function PrivateFundingGuide() {
  return (
    <div className="container mx-auto px-4">
      <PrivateFundingHero />
      
      <div className="max-w-6xl mx-auto mt-12">
        {/* What is Private Funding - Full Width */}
        <div className="mb-12">
          <WhatIsPrivateFunding />
        </div>

        {/* How It Works - Full Width */}
        <div className="mb-12">
          <HowItWorks />
        </div>

        {/* Split Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <BenefitsForInventors />
          <BenefitsForInvestors />
        </div>

        {/* Comparison - Full Width */}
        <div className="mb-12">
          <VsCrowdfunding />
        </div>

        {/* Getting Started - Full Width */}
        <div className="mb-12">
          <GettingStarted />
        </div>
      </div>
    </div>
  );
}
