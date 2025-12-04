'use client';

import { Project } from '@/lib/api/projects';
import { useProject } from '@/hooks/useProject';
import ProjectSidebar from './ProjectSidebar';
import ProjectHero from './ProjectHero';
import ProjectDescription from './ProjectDescription';
import OrganizerSection from './OrganizerSection';
import DonationsList from './DonationsList';

interface ProjectDetailContentProps {
  project: Project; // Initial project data from server
}

export default function ProjectDetailContent({ project: initialProject }: ProjectDetailContentProps) {
  // Use real-time project hook with polling
  const { project, isLoading } = useProject(initialProject.id, {
    pollInterval: 3000, // Poll every 3 seconds
    enablePolling: true,
  });

  // Use real-time project if available, otherwise fall back to initial
  const projectData = project || initialProject;

  return (
    <div className="campaign-page-container">
      <div className="campaign-page-layout">
        {/* Sidebar */}
        <aside className="campaign-sidebar">
          <ProjectSidebar project={projectData} />
        </aside>

        {/* Main Content */}
        <div className="campaign-main-content">
          <ProjectHero project={projectData} />
          <ProjectDescription project={projectData} />
          <DonationsList projectId={projectData.id} />
          <OrganizerSection project={projectData} />
        </div>
      </div>
    </div>
  );
}

