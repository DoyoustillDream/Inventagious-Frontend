'use client';

import { Project } from '@/lib/api/projects';
import ProjectSidebar from './ProjectSidebar';
import ProjectHero from './ProjectHero';
import ProjectDescription from './ProjectDescription';
import OrganizerSection from './OrganizerSection';
import DonationsList from './DonationsList';

interface ProjectDetailContentProps {
  project: Project;
}

export default function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  return (
    <div className="campaign-page-container">
      <div className="campaign-page-layout">
        {/* Sidebar */}
        <aside className="campaign-sidebar">
          <ProjectSidebar project={project} />
        </aside>

        {/* Main Content */}
        <div className="campaign-main-content">
          <ProjectHero project={project} />
          <ProjectDescription project={project} />
          <DonationsList projectId={project.id} />
          <OrganizerSection project={project} />
        </div>
      </div>
    </div>
  );
}

