import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ProjectDetailContent from '@/components/public/ProjectDetail/ProjectDetailContent';
import { projectsApi } from '@/lib/api/projects';
import { siteConfig, generateProjectMetadata, WebPageSchema, ArticleSchema, BreadcrumbSchema, ProductSchema } from '@/lib/seo';
import { getFirstImage } from '@/lib/utils/imageUtils';
import { normalizeUrl } from '@/lib/utils/url';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const project = await projectsApi.getById(id);
    
    return generateProjectMetadata({
      project,
      url: `/projects/${id}`,
    });
  } catch {
    return {
      title: 'Project Not Found - Inventagious',
    };
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  
  let project;
  try {
    project = await projectsApi.getById(id);
  } catch (error: any) {
    // If it's a 404, show not found page
    if (error?.status === 404) {
      notFound();
    }
    // For other errors, still show not found to avoid exposing internal errors
    notFound();
  }

  if (!project) {
    notFound();
  }

  const projectUrl = normalizeUrl(siteConfig.url, `/projects/${id}`);
  const tags = [
    project.type === 'crowdfunding' ? 'crowdfunding' : 'private funding',
    ...(project.category ? [project.category.toLowerCase()] : []),
    'solana',
    'blockchain',
    'web3',
  ];

  const projectImage = getFirstImage(project.imageUrl);
  const fundingPercentage = project.fundingGoal && project.amountRaised
    ? Math.round((project.amountRaised / project.fundingGoal) * 100)
    : 0;

  return (
    <>
      <WebPageSchema 
        title={`${project.title} - Inventagious`}
        description={project.description || `Support ${project.title} on Inventagious`}
        url={projectUrl}
      />
      <ArticleSchema
        title={project.title}
        description={project.description || `Support ${project.title} on Inventagious`}
        url={projectUrl}
        image={projectImage}
        publishedTime={project.createdAt}
        modifiedTime={project.updatedAt || project.createdAt}
        tags={tags}
      />
      <ProductSchema
        name={project.title}
        description={project.description || `Support ${project.title} on Inventagious`}
        url={projectUrl}
        image={projectImage}
        category={project.category}
        brand="Inventagious"
        offers={{
          priceCurrency: 'SOL',
          availability: project.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
          price: project.fundingGoal,
          url: projectUrl,
        }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Projects', url: `${siteConfig.url}/projects` },
          { name: project.title, url: projectUrl },
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

