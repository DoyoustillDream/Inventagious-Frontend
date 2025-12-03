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
  // Log the attempt (server-side only)
  if (typeof window === 'undefined') {
    console.log(`[CampaignPage] Attempting to fetch campaign with slug: "${slug}"`);
  }
  
  try {
    // Next.js route params are already decoded, so we can use the slug directly
    // Trim whitespace to ensure clean slug
    const normalizedSlug = slug.trim();
    
    if (typeof window === 'undefined') {
      console.log(`[CampaignPage] Normalized slug: "${normalizedSlug}"`);
      console.log(`[CampaignPage] API base URL: ${process.env.NEXT_PUBLIC_API_URL || '/api'}`);
      console.log(`[CampaignPage] BACKEND_URL: ${process.env.BACKEND_URL || 'not set'}`);
    }
    
    // Call the API - it will handle encoding for the URL path
    const project = await projectsApi.getById(normalizedSlug);
    
    if (typeof window === 'undefined') {
      console.log(`[CampaignPage] Project fetched:`, {
        found: !!project,
        id: project?.id,
        slug: project?.slug,
        type: project?.type,
        title: project?.title,
      });
    }
    
    // Only return crowdfunding campaigns
    if (project && project.type === 'crowdfunding') {
      return project;
    }
    
    if (typeof window === 'undefined') {
      console.log(`[CampaignPage] Project not returned - either not found or not crowdfunding type`);
    }
    
    return null;
  } catch (error: any) {
    // Check if it's a 404 error
    if (error?.status === 404) {
      return null;
    }
    
    // Log other errors for debugging (only on server-side to avoid exposing to client)
    if (typeof window === 'undefined') {
      const errorDetails = {
        message: error?.message,
        status: error?.status,
        statusText: error?.statusText,
        name: error?.name,
        slug: slug,
        // Include environment info for debugging
        env: {
          hasBackendUrl: !!process.env.BACKEND_URL,
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
          vercelUrl: process.env.VERCEL_URL,
        },
      };
      console.error(`[CampaignPage] Error fetching campaign by slug "${slug}":`, errorDetails);
      
      // If it's a network error (status 0), log additional info
      if (error?.status === 0) {
        console.error(`[CampaignPage] Network error - check BACKEND_URL environment variable on Vercel`);
      }
    }
    
    return null;
  }
}

/**
 * Generates metadata for the campaign page
 */
export async function generateMetadata({ params }: CampaignPageProps): Promise<Metadata> {
  try {
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
  } catch (error: any) {
    // Log error but don't throw - return default metadata
    if (typeof window === 'undefined') {
      console.error('[CampaignPage] Error in generateMetadata:', error);
    }
    return {
      title: 'Campaign Not Found - Inventagious',
      description: 'The campaign you are looking for could not be found.',
    };
  }
}

/**
 * Main campaign page component
 */
export default async function CampaignPage({ params }: CampaignPageProps) {
  try {
    const { slug } = await params;
    
    // Validate slug format
    if (!isValidSlug(slug)) {
      if (typeof window === 'undefined') {
        console.log(`[CampaignPage] Invalid slug format: "${slug}"`);
      }
      notFound();
    }
    
    // Fetch campaign data
    const project = await fetchCampaignBySlug(slug);
    
    // If campaign not found or not a crowdfunding campaign, show 404
    if (!project) {
      if (typeof window === 'undefined') {
        console.log(`[CampaignPage] Project not found for slug: "${slug}"`);
      }
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
    
    if (typeof window === 'undefined') {
      console.log(`[CampaignPage] Rendering page for project: ${validProject.id} - ${validProject.title}`);
    }
    
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
  } catch (error: any) {
    // Log the error for debugging
    if (typeof window === 'undefined') {
      console.error('[CampaignPage] Unexpected error rendering page:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
      });
    }
    // Re-throw to let Next.js handle it (will show error page)
    throw error;
  }
}

