/**
 * SEO Module Exports
 */

export { siteConfig, defaultMetadata } from './config';
export {
  OrganizationSchema,
  WebsiteSchema,
  WebPageSchema,
  BreadcrumbSchema,
  SoftwareApplicationSchema,
  FinancialProductSchema,
  ArticleSchema,
  FAQSchema,
  ItemListSchema,
} from './structured-data';
export { generatePageMetadata, generateArticleMetadata, generateProjectMetadata, generateProfileMetadata } from './metadata-utils';
export { generatePageTitle, getHomePageTitle, pageTitles } from './title-utils';
export {
  GoogleAnalytics,
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from './analytics';
export { SEOHeadComponents } from './head-components';

