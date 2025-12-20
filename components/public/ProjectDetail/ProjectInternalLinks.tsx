'use client';

import { Project } from '@/lib/api/projects';
import { generateProjectInternalLinks, CampaignStateLink, InvestorIntentLink } from '@/lib/seo';
import Link from 'next/link';

interface ProjectInternalLinksProps {
  project: Project;
}

export default function ProjectInternalLinks({ project }: ProjectInternalLinksProps) {
  const internalLinks = generateProjectInternalLinks({
    id: project.id,
    slug: project.slug,
    title: project.title,
    type: project.type,
    category: project.category,
    username: undefined, // Would need to fetch this
  });

  return (
    <div className="browser-window mb-6">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="flex-1" />
        <div className="yellow-highlight hand-drawn text-xs font-bold text-center px-4">
          EXPLORE MORE
        </div>
        <div className="flex-1" />
      </div>

      <div className="p-6">
        <h2 className="hand-drawn text-xl font-bold text-black mb-4">Related Pages</h2>
        <div className="space-y-3">
          {project.category && (
            <div>
              <Link
                href={`/category/${project.category.toLowerCase()}`}
                className="text-blue-600 hover:text-yellow-600 hover:underline font-medium block"
              >
                {project.category} blockchain projects →
              </Link>
            </div>
          )}
          <div>
            <Link
              href="/campaigns"
              className="text-blue-600 hover:text-yellow-600 hover:underline font-medium block"
            >
              All blockchain crowdfunding campaigns →
            </Link>
          </div>
          <div>
            <CampaignStateLink state="active" className="text-blue-600 hover:text-yellow-600 hover:underline font-medium block">
              Active blockchain crowdfunding campaigns →
            </CampaignStateLink>
          </div>
          {project.type === 'crowdfunding' && (
            <>
              <div>
                <InvestorIntentLink intent="fund-blockchain-startups" className="text-blue-600 hover:text-yellow-600 hover:underline font-medium block">
                  Fund blockchain startups →
                </InvestorIntentLink>
              </div>
              <div>
                <InvestorIntentLink intent="invest-in-solana-projects" className="text-blue-600 hover:text-yellow-600 hover:underline font-medium block">
                  Invest in Solana projects →
                </InvestorIntentLink>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

