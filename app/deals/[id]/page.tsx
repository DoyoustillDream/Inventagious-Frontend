import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ProjectDetailContent from '@/components/public/ProjectDetail/ProjectDetailContent';
import { projectsApi } from '@/lib/api/projects';
import { siteConfig, generateProjectMetadata, WebPageSchema, ArticleSchema, BreadcrumbSchema } from '@/lib/seo';
import { getFirstImage } from '@/lib/utils/imageUtils';
import { normalizeUrl } from '@/lib/utils/url';

interface DealPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DealPageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const project = await projectsApi.getById(id);
    
    // Only show metadata for private funding projects
    if (project.type !== 'private_funding') {
      notFound();
    }
    
    return generateProjectMetadata({
      project,
      url: `/deals/${id}`,
    });
  } catch {
    return {
      title: 'Private Funding Project Not Found - Inventagious',
    };
  }
}

export default async function DealPage({ params }: DealPageProps) {
  const { id } = await params;
  
  let project;
  try {
    project = await projectsApi.getById(id);
    
    // Only show private funding projects on this route
    if (!project || project.type !== 'private_funding') {
      notFound();
    }
  } catch (error: any) {
    if (error?.status === 404) {
      notFound();
    }
    notFound();
  }

  if (!project) {
    notFound();
  }

  const dealUrl = normalizeUrl(siteConfig.url, `/deals/${id}`);
  const tags = [
    'private funding',
    ...(project.category ? [project.category.toLowerCase()] : []),
    'solana',
    'blockchain',
    'web3',
  ];

  return (
    <>
      <WebPageSchema 
        title={`${project.title} - Private Funding - Inventagious`}
        description={project.description || `Private funding opportunity: ${project.title}`}
        url={dealUrl}
      />
      <ArticleSchema
        title={project.title}
        description={project.description || `Private funding opportunity: ${project.title}`}
        url={dealUrl}
        image={getFirstImage(project.imageUrl)}
        publishedTime={project.createdAt}
        modifiedTime={project.updatedAt || project.createdAt}
        tags={tags}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Private Deals', url: `${siteConfig.url}/deals` },
          { name: project.title, url: dealUrl },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-white">
          <ProjectDetailContent project={project} />
        </main>
        <Footer />
      </div>
    </>
  );
}

