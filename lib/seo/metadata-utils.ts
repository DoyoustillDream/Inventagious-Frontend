/**
 * SEO Metadata Utilities
 * Helper functions for generating page-specific metadata
 */

import { Metadata } from 'next';
import { siteConfig } from './config';
import { getFirstImage } from '@/lib/utils/imageUtils';
import {
  generateCampaignOGImageUrl,
  generateProfileOGImageUrl,
  generateDealOGImageUrl,
  generateCategoryOGImageUrl,
  generateDefaultOGImageUrl,
} from './og-image';

export interface PageMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  nofollow?: boolean;
}

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description = siteConfig.description,
    keywords,
    image,
    url,
    type = 'website',
    noindex = false,
    nofollow = false,
  } = options;

  const fullTitle = title || siteConfig.title;

  const pageUrl = url 
    ? `${siteConfig.url}${url.startsWith('/') ? url : `/${url}`}`
    : siteConfig.url;

  // Use dynamic OG image if no image provided, otherwise use provided image
  const ogImageUrl = image || generateDefaultOGImageUrl({
    title: fullTitle,
    description,
  });

  return {
    title: fullTitle,
    description,
    keywords: keywords || siteConfig.keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: pageUrl,
      siteName: siteConfig.siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: siteConfig.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImageUrl],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate article metadata for blog posts or project pages
 */
export function generateArticleMetadata(options: {
  title: string;
  description: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  image?: string;
  url: string;
}): Metadata {
  const {
    title,
    description,
    publishedTime,
    modifiedTime,
    authors = [siteConfig.author],
    tags = [],
    image,
    url,
  } = options;

  const fullTitle = title;
  const pageUrl = `${siteConfig.url}${url.startsWith('/') ? url : `/${url}`}`;

  // Use provided image or generate dynamic OG image
  const ogImageUrl = image || generateDefaultOGImageUrl({
    title: fullTitle,
    description,
  });

  return {
    title: fullTitle,
    description,
    keywords: [...siteConfig.keywords, ...tags],
    authors: authors.map(name => ({ name })),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: 'article',
      title: fullTitle,
      description,
      url: pageUrl,
      siteName: siteConfig.siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: siteConfig.locale,
      publishedTime,
      modifiedTime,
      authors,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImageUrl],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
  };
}

/**
 * Generate project/campaign metadata from project data
 */
export function generateProjectMetadata(options: {
  project: {
    id: string;
    title: string;
    description?: string;
    type: 'crowdfunding' | 'private_funding';
    imageUrl?: string;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
    amountRaised?: number;
    fundingGoal?: number;
  };
  url: string;
}): Metadata {
  const { project, url } = options;
  const pageUrl = `${siteConfig.url}${url.startsWith('/') ? url : `/${url}`}`;
  
  const description = project.description || 
    `Support ${project.title} on Inventagious. ${
      project.amountRaised && project.fundingGoal
        ? `${project.amountRaised.toLocaleString()} SOL raised of ${project.fundingGoal.toLocaleString()} SOL goal.`
        : 'Join the innovation revolution on Solana blockchain.'
    }`;

  const tags = [
    project.type === 'crowdfunding' ? 'crowdfunding' : 'private funding',
    ...(project.category ? [project.category.toLowerCase()] : []),
    'solana',
    'blockchain',
    'web3',
  ];

  // Generate dynamic OG image URL
  const ogImageUrl = generateCampaignOGImageUrl({
    title: project.title,
    description,
    image: getFirstImage(project.imageUrl),
    category: project.category,
    amountRaised: project.amountRaised,
    fundingGoal: project.fundingGoal,
  });

  return generateArticleMetadata({
    title: `${project.title} - Inventagious`,
    description,
    publishedTime: project.createdAt,
    modifiedTime: project.updatedAt || project.createdAt,
    tags,
    image: ogImageUrl,
    url: pageUrl,
  });
}

/**
 * Generate profile metadata from profile data
 */
export function generateProfileMetadata(options: {
  profile: {
    id: string;
    username: string;
    displayName: string;
    bio?: string;
    avatarUrl?: string;
  };
  url: string;
}): Metadata {
  const { profile, url } = options;
  const pageUrl = `${siteConfig.url}${url.startsWith('/') ? url : `/${url}`}`;
  
  const description = profile.bio || `View ${profile.displayName}'s profile on Inventagious`;

  // Generate dynamic OG image URL
  const ogImageUrl = generateProfileOGImageUrl({
    displayName: profile.displayName,
    username: profile.username,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
  });

  return {
    title: `${profile.displayName} | Inventagious`,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: 'profile',
      title: `${profile.displayName} | Inventagious`,
      description,
      url: pageUrl,
      siteName: siteConfig.siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: profile.displayName,
        },
      ],
      locale: siteConfig.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profile.displayName} | Inventagious`,
      description,
      images: [ogImageUrl],
      creator: siteConfig.twitterHandle,
    },
  };
}

