import PricingHero from './PricingHero';
import FeeStructure from './FeeStructure';
import WhatIncluded from './WhatIncluded';
import NoHiddenFees from './NoHiddenFees';

export default function PricingGuide() {
  return (
    <>
      <PricingHero />
      <FeeStructure />
      <WhatIncluded />
      <NoHiddenFees />
    </>
  );
}

