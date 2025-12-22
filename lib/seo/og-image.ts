/**
 * OG Image URL Generator
 * Generates dynamic OG image URLs for different page types
 */

import { siteConfig } from './config';
import { normalizeUrl } from '@/lib/utils/url';

export interface CampaignOGImageParams {
  title: string;
  description?: string;
  image?: string;
  category?: string;
  amountRaised?: number;
  fundingGoal?: number;
}

export interface ProfileOGImageParams {
  displayName: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  followers?: number;
  following?: number;
  projects?: number;
}

export interface DealOGImageParams {
  title: string;
  description?: string;
  image?: string;
  category?: string;
}

export interface CategoryOGImageParams {
  name: string;
  description?: string;
}

export interface DefaultOGImageParams {
  title: string;
  description?: string;
}

export interface HomepageOGImageParams {
  title?: string;
  description?: string;
}

/**
 * Generate OG image URL for campaign pages
 */
export function generateCampaignOGImageUrl(params: CampaignOGImageParams): string {
  const searchParams = new URLSearchParams({
    type: 'campaign',
    title: encodeURIComponent(params.title),
  });

  if (params.description) {
    searchParams.set('description', encodeURIComponent(params.description));
  }
  if (params.image) {
    searchParams.set('image', encodeURIComponent(params.image));
  }
  if (params.category) {
    searchParams.set('category', encodeURIComponent(params.category));
  }
  if (params.amountRaised !== undefined) {
    searchParams.set('amountRaised', params.amountRaised.toLocaleString());
  }
  if (params.fundingGoal !== undefined) {
    searchParams.set('fundingGoal', params.fundingGoal.toLocaleString());
  }

  return normalizeUrl(siteConfig.url, `/api/og?${searchParams.toString()}`);
}

/**
 * Generate OG image URL for profile pages
 */
export function generateProfileOGImageUrl(params: ProfileOGImageParams): string {
  const searchParams = new URLSearchParams({
    type: 'profile',
    title: encodeURIComponent(params.displayName),
    displayName: encodeURIComponent(params.displayName),
  });

  if (params.username) {
    searchParams.set('username', encodeURIComponent(params.username));
  }
  if (params.bio) {
    searchParams.set('description', encodeURIComponent(params.bio));
  }
  if (params.avatarUrl) {
    searchParams.set('image', encodeURIComponent(params.avatarUrl));
  }
  if (params.coverImageUrl) {
    searchParams.set('coverImage', encodeURIComponent(params.coverImageUrl));
  }
  if (params.followers !== undefined) {
    searchParams.set('followers', params.followers.toString());
  }
  if (params.following !== undefined) {
    searchParams.set('following', params.following.toString());
  }
  if (params.projects !== undefined) {
    searchParams.set('projects', params.projects.toString());
  }
  
  // Pass baseUrl so backend can fetch assets correctly
  searchParams.set('baseUrl', encodeURIComponent(siteConfig.url));

  return normalizeUrl(siteConfig.url, `/api/og?${searchParams.toString()}`);
}

/**
 * Generate OG image URL for deal pages
 */
export function generateDealOGImageUrl(params: DealOGImageParams): string {
  const searchParams = new URLSearchParams({
    type: 'deal',
    title: encodeURIComponent(params.title),
  });

  if (params.description) {
    searchParams.set('description', encodeURIComponent(params.description));
  }
  if (params.image) {
    searchParams.set('image', encodeURIComponent(params.image));
  }
  if (params.category) {
    searchParams.set('category', encodeURIComponent(params.category));
  }

  return normalizeUrl(siteConfig.url, `/api/og?${searchParams.toString()}`);
}

/**
 * Generate OG image URL for category pages
 */
export function generateCategoryOGImageUrl(params: CategoryOGImageParams): string {
  const searchParams = new URLSearchParams({
    type: 'category',
    title: encodeURIComponent(params.name),
  });

  if (params.description) {
    searchParams.set('description', encodeURIComponent(params.description));
  }

  return normalizeUrl(siteConfig.url, `/api/og?${searchParams.toString()}`);
}

/**
 * Generate OG image URL for homepage
 */
export function generateHomepageOGImageUrl(params?: HomepageOGImageParams): string {
  const searchParams = new URLSearchParams({
    type: 'homepage',
    title: encodeURIComponent(params?.title || 'Inventagious'),
  });

  if (params?.description) {
    searchParams.set('description', encodeURIComponent(params.description));
  }

  return normalizeUrl(siteConfig.url, `/api/og?${searchParams.toString()}`);
}

/**
 * Generate OG image URL for default pages
 */
export function generateDefaultOGImageUrl(params: DefaultOGImageParams): string {
  const searchParams = new URLSearchParams({
    type: 'default',
    title: encodeURIComponent(params.title),
  });

  if (params.description) {
    searchParams.set('description', encodeURIComponent(params.description));
  }

  return normalizeUrl(siteConfig.url, `/api/og?${searchParams.toString()}`);
}

