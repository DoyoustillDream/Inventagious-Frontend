/**
 * Internal Linking Utilities
 * Provides components and utilities for strategic internal linking with keyword-rich anchor text
 */

import Link from 'next/link';
import { siteConfig } from './config';
import { normalizeUrl } from '@/lib/utils/url';

/**
 * Internal link component with SEO-optimized anchor text
 */
export function InternalLink({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}

/**
 * Project link with keyword-rich anchor text
 */
export function ProjectLink({
  project,
  children,
  className,
}: {
  project: {
    id: string;
    slug?: string;
    title: string;
    type: 'crowdfunding' | 'private_funding';
    category?: string;
  };
  children?: React.ReactNode;
  className?: string;
}) {
  const href = project.type === 'crowdfunding' && project.slug
    ? `/campaigns/${project.slug}`
    : `/projects/${project.id}`;
  
  const anchorText = children || `${project.category ? `${project.category} ` : ''}blockchain ${project.type === 'crowdfunding' ? 'crowdfunding' : 'funding'} project ${project.title}`;
  
  return (
    <InternalLink href={href} className={className}>
      {anchorText}
    </InternalLink>
  );
}

/**
 * Category link with keyword-rich anchor text
 */
export function CategoryLink({
  category,
  children,
  className,
}: {
  category: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const href = `/category/${category.toLowerCase()}`;
  const anchorText = children || `${category} blockchain projects`;
  
  return (
    <InternalLink href={href} className={className}>
      {anchorText}
    </InternalLink>
  );
}

/**
 * Profile link with keyword-rich anchor text
 */
export function ProfileLink({
  username,
  displayName,
  children,
  className,
  title,
}: {
  username: string;
  displayName?: string;
  children?: React.ReactNode;
  className?: string;
  title?: string;
}) {
  const href = `/u/${username}`;
  const anchorText = children || `${displayName || username}'s inventor profile`;
  
  return (
    <InternalLink href={href} className={className} title={title}>
      {anchorText}
    </InternalLink>
  );
}

/**
 * Campaign state link
 */
export function CampaignStateLink({
  state,
  children,
  className,
}: {
  state: 'active' | 'ending-soon' | 'fully-funded';
  children?: React.ReactNode;
  className?: string;
}) {
  const href = `/campaigns/${state}`;
  const anchorText = children || {
    'active': 'active blockchain crowdfunding campaigns',
    'ending-soon': 'blockchain campaigns ending soon',
    'fully-funded': 'successfully funded blockchain projects',
  }[state];
  
  return (
    <InternalLink href={href} className={className}>
      {anchorText}
    </InternalLink>
  );
}

/**
 * Investor intent link
 */
export function InvestorIntentLink({
  intent,
  children,
  className,
}: {
  intent: 'fund-blockchain-startups' | 'invest-in-solana-projects' | 'crowdfund-inventions';
  children?: React.ReactNode;
  className?: string;
}) {
  const href = `/${intent}`;
  const anchorText = children || {
    'fund-blockchain-startups': 'fund blockchain startups',
    'invest-in-solana-projects': 'invest in Solana projects',
    'crowdfund-inventions': 'crowdfund inventions',
  }[intent];
  
  return (
    <InternalLink href={href} className={className}>
      {anchorText}
    </InternalLink>
  );
}

/**
 * Generate internal links for a project page
 */
export function generateProjectInternalLinks(project: {
  id: string;
  slug?: string;
  title: string;
  type: 'crowdfunding' | 'private_funding';
  category?: string;
  userId?: string;
  username?: string;
}) {
  const links = [];
  
  if (project.category) {
    links.push({
      text: `${project.category} blockchain projects`,
      href: `/category/${project.category.toLowerCase()}`,
    });
  }
  
  if (project.username) {
    links.push({
      text: `${project.username}'s inventor profile`,
      href: `/u/${project.username}`,
    });
  }
  
  links.push({
    text: 'blockchain crowdfunding campaigns',
    href: '/campaigns',
  });
  
  links.push({
    text: 'active blockchain projects',
    href: '/campaigns/active',
  });
  
  return links;
}

/**
 * Generate internal links for a category page
 */
export function generateCategoryInternalLinks(category: string) {
  return [
    {
      text: 'all blockchain projects',
      href: '/projects',
    },
    {
      text: 'active blockchain campaigns',
      href: '/campaigns/active',
    },
    {
      text: 'fund blockchain startups',
      href: '/fund-blockchain-startups',
    },
  ];
}

