import Link from 'next/link';
import Logo from '../Logo';
import NewsletterSignup from './NewsletterSignup';
import { CampaignStateLink, InvestorIntentLink } from '@/lib/seo';

export default function Footer() {
  return (
    <footer className="border-t-4 border-white bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Logo variant="bulb" size="sm" />
              <h3 className="hand-drawn text-xl font-bold text-white">INVENTAGIOUS</h3>
            </div>
          </div>
          <div>
            <h4 className="hand-drawn mb-4 text-base font-bold text-white">Platform</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link href="/campaigns" className="text-white hover:underline">
                  All Campaigns
                </Link>
              </li>
              <li>
                <CampaignStateLink state="active" className="text-white hover:underline">
                  Active Campaigns
                </CampaignStateLink>
              </li>
              <li>
                <CampaignStateLink state="ending-soon" className="text-white hover:underline">
                  Ending Soon
                </CampaignStateLink>
              </li>
              <li>
                <CampaignStateLink state="fully-funded" className="text-white hover:underline">
                  Fully Funded
                </CampaignStateLink>
              </li>
              <li>
                <Link href="/projects" className="text-white hover:underline">
                  All Projects
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="hand-drawn mb-4 text-base font-bold text-white">Resources</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <InvestorIntentLink intent="fund-blockchain-startups" className="text-white hover:underline">
                  Fund Blockchain Startups
                </InvestorIntentLink>
              </li>
              <li>
                <InvestorIntentLink intent="invest-in-solana-projects" className="text-white hover:underline">
                  Invest in Solana
                </InvestorIntentLink>
              </li>
              <li>
                <InvestorIntentLink intent="crowdfund-inventions" className="text-white hover:underline">
                  Crowdfund Inventions
                </InvestorIntentLink>
              </li>
              <li>
                <Link href="/blog" className="text-white hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-white hover:underline">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <NewsletterSignup />
          </div>
        </div>
        <div className="mt-8 border-t-2 border-white pt-8 text-center">
          <p className="hand-drawn text-sm font-bold text-white">
            &copy; {new Date().getFullYear()} Inventagious. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
