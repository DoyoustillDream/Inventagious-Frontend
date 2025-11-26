/**
 * Title Utilities
 * Helper functions for generating consistent page titles
 */

import { siteConfig } from './config';

/**
 * Generate a page title with consistent formatting
 * @param pageTitle - The page-specific title (e.g., "Explore", "Projects")
 * @param options - Optional configuration
 * @returns Formatted title string
 */
export function generatePageTitle(
  pageTitle?: string,
  options?: {
    includeSiteName?: boolean;
    separator?: string;
    position?: 'prefix' | 'suffix';
  }
): string {
  const {
    includeSiteName = true,
    separator = ' | ',
    position = 'suffix',
  } = options || {};

  if (!pageTitle) {
    return siteConfig.title;
  }

  if (!includeSiteName) {
    return pageTitle;
  }

  if (position === 'prefix') {
    return `${siteConfig.title}${separator}${pageTitle}`;
  }

  return `${pageTitle}${separator}${siteConfig.title}`;
}

/**
 * Get title for home page
 */
export function getHomePageTitle(): string {
  return siteConfig.title;
}

/**
 * Get title for common pages
 */
export const pageTitles = {
  home: getHomePageTitle(),
  explore: generatePageTitle('Explore'),
  projects: generatePageTitle('Projects'),
  search: generatePageTitle('Search Projects'),
  categories: generatePageTitle('Categories'),
  about: generatePageTitle('About'),
  contact: generatePageTitle('Contact'),
  faq: generatePageTitle('FAQ'),
} as const;

