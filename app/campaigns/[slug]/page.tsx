import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { projectsApi, type Project } from '@/lib/api/projects';
import {
  siteConfig,
  generateProjectMetadata,
  WebPageSchema,
  ArticleSchema,
  BreadcrumbSchema,
} from '@/lib/seo';
import { getFirstImage } from '@/lib/utils/imageUtils';
import dynamic from 'next/dynamic';

// Dynamic import to prevent loading client components if project doesn't exist
const ProjectDetailContent = dynamic(
  () => import('@/components/public/ProjectDetail/ProjectDetailContent'),
  { ssr: true }
);

interface CampaignPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Validates that a slug is in a valid format
 * Slugs should be non-empty strings with reasonable length
 */
function isValidSlug(slug: string | undefined | null): slug is string {
  if (!slug || typeof slug !== 'string') {
    return false;
  }
  const trimmed = slug.trim();
  return trimmed.length > 0 && trimmed.length <= 200;
}

/**
 * Fetches campaign data by slug
 * Returns null if campaign not found or not a crowdfunding campaign
 */
async function fetchCampaignBySlug(slug: string): Promise<Project | null> {
  try {
    const project = await projectsApi.getById(slug);
    
    // Only return crowdfunding campaigns
    if (project && project.type === 'crowdfunding') {
      return project;
    }
    
    return null;
  } catch (error: any) {
    // Check if it's a 404 error
    if (error?.status === 404) {
      return null;
    }
    
    // Log other errors for debugging but don't expose to user
    console.error('Error fetching campaign:', error);
    return null;
  }
}

/**
 * Generates metadata for the campaign page
 */
export async function generateMetadata({ params }: CampaignPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Validate slug format
  if (!isValidSlug(slug)) {
    return {
      title: 'Campaign Not Found - Inventagious',
      description: 'The campaign you are looking for could not be found.',
    };
  }
  
  const project = await fetchCampaignBySlug(slug);
  
  if (!project) {
    return {
      title: 'Campaign Not Found - Inventagious',
      description: 'The campaign you are looking for could not be found.',
    };
  }
  
  return generateProjectMetadata({
    project,
    url: `/campaigns/${project.slug}`,
  });
}

/**
 * Main campaign page component
 */
export default async function CampaignPage({ params }: CampaignPageProps) {
  const { slug } = await params;
  
  // Validate slug format
  if (!isValidSlug(slug)) {
    notFound();
  }
  
  // Fetch campaign data
  const project = await fetchCampaignBySlug(slug);
  
  // If campaign not found or not a crowdfunding campaign, show 404
  if (!project) {
    notFound();
  }
  
  // TypeScript doesn't understand that notFound() throws, so we assert project is non-null
  // At this point, project is guaranteed to be defined
  const validProject: Project = project;
  
  // Build page data
  const campaignUrl = `${siteConfig.url}/campaigns/${validProject.slug}`;
  const tags = [
    'crowdfunding',
    ...(validProject.category ? [validProject.category.toLowerCase()] : []),
    'solana',
    'blockchain',
    'web3',
  ];
  
  return (
    <>
      <WebPageSchema
        title={`${validProject.title} - Inventagious`}
        description={validProject.description || `Support ${validProject.title} on Inventagious`}
        url={campaignUrl}
      />
      <ArticleSchema
        title={validProject.title}
        description={validProject.description || `Support ${validProject.title} on Inventagious`}
        url={campaignUrl}
        image={getFirstImage(validProject.imageUrl)}
        publishedTime={validProject.createdAt}
        modifiedTime={validProject.updatedAt || validProject.createdAt}
        tags={tags}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Campaigns', url: `${siteConfig.url}/campaigns` },
          { name: validProject.title, url: campaignUrl },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-white">
          <ProjectDetailContent project={validProject} />
        </main>
        <Footer />
      </div>
    </>
  );
}

