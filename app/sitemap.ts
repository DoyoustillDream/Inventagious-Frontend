import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';
import { projectsApi } from '@/lib/api/projects';
import { normalizeUrl, normalizeBaseUrl, ensureLeadingSlash } from '@/lib/utils/url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = normalizeBaseUrl(siteConfig.url);
  const currentDate = new Date().toISOString();

  // Static routes
  const staticRoutes = [
    '',
    '/projects',
    '/campaigns',
    '/deals',
    '/explore',
    '/search',
    '/category',
    '/about',
    '/about/pricing',
    '/guarantee',
    '/contact',
    '/help',
    '/help/categories',
    '/help/start-project',
    '/help/tips',
    '/private',
    '/polymarketbot',
    '/projects/featured',
    // Programmatic SEO pages
    '/campaigns/active',
    '/campaigns/ending-soon',
    '/campaigns/fully-funded',
    '/fund-blockchain-startups',
    '/invest-in-solana-projects',
    '/crowdfund-inventions',
  ].map((route) => ({
    url: normalizeUrl(baseUrl, route || '/'),
    lastModified: currentDate,
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1 : route.startsWith('/projects') || route.startsWith('/campaigns') || route.startsWith('/deals') ? 0.9 : 0.8,
  }));

  // Dynamic routes - fetch projects, campaigns, and deals
  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // Fetch all published projects
    const allProjects = await projectsApi.getAll();
    
    // Add project pages
    const projectRoutes = allProjects.map((project) => ({
      url: normalizeUrl(baseUrl, `/projects/${project.id}`),
      lastModified: project.updatedAt || project.createdAt || currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    // Add campaign pages (only crowdfunding projects)
    const campaignRoutes = allProjects
      .filter((project) => project.type === 'crowdfunding')
      .map((project) => ({
        url: normalizeUrl(baseUrl, `/campaigns/${project.slug}`),
        lastModified: project.updatedAt || project.createdAt || currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      }));

    // Add deal pages (only private funding projects)
    const dealRoutes = allProjects
      .filter((project) => project.type === 'private_funding')
      .map((project) => ({
        url: normalizeUrl(baseUrl, `/deals/${project.id}`),
        lastModified: project.updatedAt || project.createdAt || currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.9,
      }));

    // Add category pages (common categories)
    const categoryRoutes = [
      'web3',
      'solana',
      'hardware',
      'software',
      'blockchain',
      'innovation',
      'crypto',
      'nft',
      'defi',
      'startup',
    ].map((category) => ({
      url: normalizeUrl(baseUrl, `/category/${category}`),
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    dynamicRoutes.push(...projectRoutes, ...campaignRoutes, ...dealRoutes, ...categoryRoutes);
  } catch (error) {
    // If API fails, just return static routes
    console.error('Error fetching dynamic routes for sitemap:', error);
  }

  // Blog posts
  const blogPosts = [
    {
      slug: 'how-blockchain-crowdfunding-works',
      date: '2024-01-15',
    },
    {
      slug: 'solana-vs-ethereum-for-crowdfunding',
      date: '2024-01-20',
    },
    {
      slug: 'how-to-fund-an-invention-without-vcs',
      date: '2024-01-25',
    },
    {
      slug: 'legal-considerations-for-web3-crowdfunding',
      date: '2024-02-01',
    },
  ];

  const blogRoutes = blogPosts.map((post) => ({
    url: normalizeUrl(baseUrl, `/blog/${post.slug}`),
    lastModified: post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...dynamicRoutes, ...blogRoutes];
}

