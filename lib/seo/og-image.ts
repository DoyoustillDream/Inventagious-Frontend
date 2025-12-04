/**
 * OG Image URL Generator
 * Generates dynamic OG image URLs for different page types
 */

import { siteConfig } from './config';

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

  return `${siteConfig.url}/api/og?${searchParams.toString()}`;
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

  return `${siteConfig.url}/api/og?${searchParams.toString()}`;
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

  return `${siteConfig.url}/api/og?${searchParams.toString()}`;
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

  return `${siteConfig.url}/api/og?${searchParams.toString()}`;
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

  return `${siteConfig.url}/api/og?${searchParams.toString()}`;
}

