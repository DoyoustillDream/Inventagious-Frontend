# Implementation Guide: Upcoming Projects Notifications & Interest System

This guide provides a complete implementation plan for adding notifications about upcoming projects, a dedicated page to view them, and an interest button functionality.

## Table of Contents

1. [Overview](#overview)
2. [Backend Requirements](#backend-requirements)
3. [Frontend Implementation](#frontend-implementation)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Component Structure](#component-structure)
7. [Implementation Steps](#implementation-steps)
8. [Testing Checklist](#testing-checklist)

---

## Overview

### Features to Implement

1. **Upcoming Projects Notifications**
   - Notify users when new projects are scheduled to launch
   - Notify users when projects they're interested in are about to go live
   - Notify users when upcoming projects they're interested in have updates

2. **Upcoming Projects Page**
   - Display all upcoming projects (draft status with future launch dates)
   - Show project preview cards with key information
   - Filter and search functionality
   - Link to full project details

3. **Interest Button**
   - Allow users to express interest in upcoming projects
   - Track which projects users are interested in
   - Show interest count on project cards
   - Use interest data for personalized notifications

4. **Project Details for Upcoming Projects**
   - Allow viewing full project details even when not yet active
   - Show "Coming Soon" badge
   - Display launch date countdown
   - Show interest button prominently

---

## Backend Requirements

### 1. Database Schema Changes

#### New Table: `project_interests`

```sql
CREATE TABLE project_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

CREATE INDEX idx_project_interests_user_id ON project_interests(user_id);
CREATE INDEX idx_project_interests_project_id ON project_interests(project_id);
CREATE INDEX idx_project_interests_created_at ON project_interests(created_at);
```

#### Update Projects Table

Add a `scheduled_launch_date` field to track when draft projects will go live:

```sql
ALTER TABLE projects ADD COLUMN scheduled_launch_date TIMESTAMP WITH TIME ZONE;
CREATE INDEX idx_projects_scheduled_launch_date ON projects(scheduled_launch_date) WHERE scheduled_launch_date IS NOT NULL;
```

### 2. Backend Service: Project Interests Service

**File:** `backend/src/project/project-interests.service.ts`

```typescript
import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProjectInterestsService {
  constructor(private supabaseService: SupabaseService) {}

  /**
   * Add user interest to a project
   */
  async addInterest(userId: string, projectId: string) {
    // Verify project exists
    const { data: project } = await this.supabaseService
      .fromAdmin('projects')
      .select('id, status')
      .eq('id', projectId)
      .single();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Check if already interested
    const { data: existing } = await this.supabaseService
      .fromAdmin('project_interests')
      .select('id')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .single();

    if (existing) {
      throw new ConflictException('Already interested in this project');
    }

    // Add interest
    const { data, error } = await this.supabaseService
      .fromAdmin('project_interests')
      .insert({
        user_id: userId,
        project_id: projectId,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException(`Failed to add interest: ${error.message}`);
    }

    return { success: true, interest: data };
  }

  /**
   * Remove user interest from a project
   */
  async removeInterest(userId: string, projectId: string) {
    const { data, error } = await this.supabaseService
      .fromAdmin('project_interests')
      .delete()
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Interest not found');
    }

    return { success: true, message: 'Interest removed' };
  }

  /**
   * Check if user is interested in a project
   */
  async isInterested(userId: string, projectId: string): Promise<{ isInterested: boolean }> {
    const { data } = await this.supabaseService
      .fromAdmin('project_interests')
      .select('id')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .single();

    return { isInterested: !!data };
  }

  /**
   * Get interest count for a project
   */
  async getInterestCount(projectId: string): Promise<{ count: number }> {
    const { count, error } = await this.supabaseService
      .fromAdmin('project_interests')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);

    if (error) {
      throw new BadRequestException(`Failed to get interest count: ${error.message}`);
    }

    return { count: count || 0 };
  }

  /**
   * Get projects user is interested in
   */
  async getUserInterestedProjects(userId: string, limit?: number): Promise<any[]> {
    let query = this.supabaseService
      .fromAdmin('project_interests')
      .select(`
        project_id,
        created_at,
        projects (
          id,
          slug,
          title,
          description,
          type,
          status,
          scheduled_launch_date,
          image_url,
          category,
          funding_goal,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new BadRequestException(`Failed to get interested projects: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get users interested in a project
   */
  async getProjectInterestedUsers(projectId: string, limit?: number): Promise<any[]> {
    let query = this.supabaseService
      .fromAdmin('project_interests')
      .select(`
        user_id,
        created_at,
        users (
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new BadRequestException(`Failed to get interested users: ${error.message}`);
    }

    return data || [];
  }
}
```

### 3. Backend Controller: Project Interests Controller

**File:** `backend/src/project/project-interests.controller.ts`

```typescript
import { Controller, Post, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectInterestsService } from './project-interests.service';

@Controller('projects')
export class ProjectInterestsController {
  constructor(private projectInterestsService: ProjectInterestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/interests')
  async addInterest(@Request() req, @Param('id') projectId: string) {
    return this.projectInterestsService.addInterest(req.user.id, projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/interests')
  async removeInterest(@Request() req, @Param('id') projectId: string) {
    return this.projectInterestsService.removeInterest(req.user.id, projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/interests/is-interested')
  async isInterested(@Request() req, @Param('id') projectId: string) {
    return this.projectInterestsService.isInterested(req.user.id, projectId);
  }

  @Get(':id/interests/count')
  async getInterestCount(@Param('id') projectId: string) {
    return this.projectInterestsService.getInterestCount(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/interests')
  async getUserInterestedProjects(@Request() req) {
    return this.projectInterestsService.getUserInterestedProjects(req.user.id);
  }
}
```

### 4. Backend: Upcoming Projects Endpoint

**Add to:** `backend/src/project/project.controller.ts`

```typescript
@Get('upcoming')
async getUpcomingProjects(
  @Query('limit') limit?: number,
  @Query('category') category?: string,
) {
  return this.projectService.findUpcomingProjects(limit, category);
}
```

**Add to:** `backend/src/project/project.service.ts`

```typescript
async findUpcomingProjects(limit?: number, category?: string): Promise<Project[]> {
  let query = this.supabaseService
    .fromAdmin('projects')
    .select('*')
    .eq('status', ProjectStatus.DRAFT)
    .not('scheduled_launch_date', 'is', null)
    .gte('scheduled_launch_date', new Date().toISOString())
    .order('scheduled_launch_date', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    this.logger.error(`Error finding upcoming projects: ${error.message}`);
    throw new BadRequestException('Failed to fetch upcoming projects');
  }

  return (data || []).map((p) => this.mapToProject(p));
}
```

### 5. Backend: Notification Service Updates

**Update:** `backend/src/notifications/notifications.service.ts`

Add method to create upcoming project notifications:

```typescript
async createUpcomingProjectNotification(
  projectId: string,
  userIds?: string[], // If provided, notify specific users (e.g., those interested)
): Promise<void> {
  const project = await this.projectService.findById(projectId);
  
  if (!project || project.status !== ProjectStatus.DRAFT) {
    return;
  }

  let targetUserIds: string[];

  if (userIds && userIds.length > 0) {
    // Notify specific users (e.g., those who expressed interest)
    targetUserIds = userIds;
  } else {
    // Notify all users (or users following certain categories)
    // You can implement your own logic here
    const { data: users } = await this.supabaseService
      .fromAdmin('users')
      .select('id')
      .limit(1000); // Adjust based on your needs
    
    targetUserIds = users?.map(u => u.id) || [];
  }

  const notifications = targetUserIds.map(userId => ({
    user_id: userId,
    type: 'upcoming_project',
    title: 'New Upcoming Project',
    message: `${project.title} is scheduled to launch soon!`,
    link: `/projects/${project.slug}`,
    read: false,
    metadata: {
      project_id: project.id,
      project_slug: project.slug,
      scheduled_launch_date: project.scheduledLaunchDate,
    },
  }));

  if (notifications.length > 0) {
    await this.supabaseService
      .fromAdmin('notifications')
      .insert(notifications);
  }
}
```

**Add notification type to enum:**

```typescript
export enum NotificationType {
  // ... existing types
  UPCOMING_PROJECT = 'upcoming_project',
  PROJECT_LAUNCHED = 'project_launched', // When an upcoming project goes live
}
```

---

## Frontend Implementation

### 1. API Client: Project Interests API

**File:** `frontend/lib/api/project-interests.ts`

```typescript
import { apiClient } from './client';
import { Project } from './projects';

export interface ProjectInterest {
  id: string;
  userId: string;
  projectId: string;
  createdAt: string;
}

export interface InterestCount {
  count: number;
}

export interface IsInterested {
  isInterested: boolean;
}

export const projectInterestsApi = {
  addInterest: async (projectId: string): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(`/projects/${projectId}/interests`);
  },

  removeInterest: async (projectId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete<{ success: boolean; message: string }>(`/projects/${projectId}/interests`);
  },

  isInterested: async (projectId: string): Promise<IsInterested> => {
    return apiClient.get<IsInterested>(`/projects/${projectId}/interests/is-interested`);
  },

  getInterestCount: async (projectId: string): Promise<InterestCount> => {
    return apiClient.get<InterestCount>(`/projects/${projectId}/interests/count`);
  },

  getUserInterestedProjects: async (): Promise<Project[]> => {
    return apiClient.get<Project[]>('/projects/my/interests');
  },
};
```

### 2. Update Projects API

**File:** `frontend/lib/api/projects.ts`

Add to `projectsApi` object:

```typescript
getUpcoming: async (limit?: number, category?: string): Promise<Project[]> => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (category) params.append('category', category);
  const query = params.toString();
  return apiClient.get<Project[]>(`/projects/upcoming${query ? `?${query}` : ''}`);
},
```

Update `Project` interface to include:

```typescript
export interface Project {
  // ... existing fields
  scheduledLaunchDate?: string;
  interestCount?: number;
  isInterested?: boolean;
}
```

### 3. Component: Interest Button

**File:** `frontend/components/public/ProjectInterest/InterestButton.tsx`

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { projectInterestsApi } from '@/lib/api/project-interests';
import { useToast } from '@/components/shared/Toast/ToastProvider';

interface InterestButtonProps {
  projectId: string;
  interestCount?: number;
  className?: string;
  showCount?: boolean;
  onInterestChange?: (isInterested: boolean, newCount: number) => void;
}

export default function InterestButton({
  projectId,
  interestCount: initialCount,
  className = '',
  showCount = true,
  onInterestChange,
}: InterestButtonProps) {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isInterested, setIsInterested] = useState(false);
  const [interestCount, setInterestCount] = useState(initialCount || 0);
  const [isLoading, setIsLoading] = useState(false);

  // Load interest status
  useEffect(() => {
    if (!isAuthenticated || !projectId) return;

    const loadInterestStatus = async () => {
      try {
        const [status, count] = await Promise.all([
          projectInterestsApi.isInterested(projectId),
          projectInterestsApi.getInterestCount(projectId),
        ]);
        setIsInterested(status.isInterested);
        setInterestCount(count.count);
      } catch (err) {
        console.error('Error loading interest status:', err);
      }
    };

    loadInterestStatus();
  }, [isAuthenticated, projectId]);

  const handleToggleInterest = useCallback(async () => {
    if (!isAuthenticated) {
      showError('Please sign in to express interest');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isInterested) {
        await projectInterestsApi.removeInterest(projectId);
        setIsInterested(false);
        setInterestCount((prev) => Math.max(0, prev - 1));
        showSuccess('Removed from your interests');
        onInterestChange?.(false, interestCount - 1);
      } else {
        await projectInterestsApi.addInterest(projectId);
        setIsInterested(true);
        setInterestCount((prev) => prev + 1);
        showSuccess('Added to your interests');
        onInterestChange?.(true, interestCount + 1);
      }
    } catch (err: any) {
      console.error('Error toggling interest:', err);
      showError(err?.message || 'Failed to update interest');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isInterested, projectId, interestCount, isLoading, showSuccess, showError, onInterestChange]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={handleToggleInterest}
      disabled={isLoading}
      className={`hand-drawn flex items-center gap-2 px-4 py-2 border-4 border-black rounded-lg font-bold transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
        isInterested
          ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
          : 'bg-white hover:bg-yellow-100 text-black'
      } ${className}`}
    >
      <svg
        className={`w-5 h-5 ${isInterested ? 'fill-current' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={isInterested ? "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" : "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"}
        />
      </svg>
      <span>{isInterested ? 'Interested' : 'Show Interest'}</span>
      {showCount && interestCount > 0 && (
        <span className="px-2 py-1 bg-black text-white rounded text-sm">
          {interestCount}
        </span>
      )}
    </button>
  );
}
```

**File:** `frontend/components/public/ProjectInterest/index.ts`

```typescript
export { default as InterestButton } from './InterestButton';
```

### 4. Component: Upcoming Project Card

**File:** `frontend/components/public/UpcomingProjects/UpcomingProjectCard.tsx`

```typescript
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getFirstImage } from '@/lib/utils/imageUtils';
import { Project } from '@/lib/api/projects';
import { InterestButton } from '../ProjectInterest';

interface UpcomingProjectCardProps {
  project: Project;
}

export default function UpcomingProjectCard({ project }: UpcomingProjectCardProps) {
  const firstImage = getFirstImage(project.imageUrl);
  const launchDate = project.scheduledLaunchDate 
    ? new Date(project.scheduledLaunchDate)
    : null;
  
  const daysUntilLaunch = launchDate
    ? Math.ceil((launchDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const href = project.type === 'crowdfunding' 
    ? `/campaigns/${project.slug}` 
    : `/deals/${project.id}`;

  return (
    <div className="browser-window overflow-hidden transition hover:scale-105">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
      </div>
      
      {firstImage && (
        <div className="relative h-48 w-full bg-gray-200">
          <Image
            src={firstImage}
            alt={project.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 px-3 py-1 bg-yellow-400 border-2 border-black rounded-full">
            <span className="hand-drawn text-sm font-bold text-black">Coming Soon</span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="hand-drawn text-xl font-bold text-black flex-1">{project.title}</h3>
        </div>
        
        {project.description && (
          <p className="mb-4 line-clamp-2 text-sm font-semibold text-gray-800">
            {project.description}
          </p>
        )}
        
        {launchDate && (
          <div className="mb-4 p-3 bg-yellow-50 border-2 border-black rounded-lg">
            <p className="text-sm font-bold text-black mb-1">Launch Date</p>
            <p className="text-lg font-bold text-black">
              {launchDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            {daysUntilLaunch !== null && daysUntilLaunch > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {daysUntilLaunch} {daysUntilLaunch === 1 ? 'day' : 'days'} until launch
              </p>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between gap-4">
          <Link
            href={href}
            className="hand-drawn flex-1 px-4 py-2 border-4 border-black bg-white hover:bg-yellow-200 rounded-lg font-bold text-black transition hover:scale-105 text-center"
          >
            Read More
          </Link>
          <InterestButton
            projectId={project.id}
            interestCount={project.interestCount}
            showCount={true}
          />
        </div>
      </div>
    </div>
  );
}
```

### 5. Component: Upcoming Projects List

**File:** `frontend/components/public/UpcomingProjects/UpcomingProjectsList.tsx`

```typescript
'use client';

import { useState, useEffect, useMemo } from 'react';
import { projectsApi, Project } from '@/lib/api/projects';
import UpcomingProjectCard from './UpcomingProjectCard';
import UpcomingProjectsSkeleton from './UpcomingProjectsSkeleton';

export default function UpcomingProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchUpcomingProjects() {
      try {
        setLoading(true);
        setError(null);
        const category = selectedCategory !== 'all' ? selectedCategory : undefined;
        const data = await projectsApi.getUpcoming(undefined, category);
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load upcoming projects');
        console.error('Error fetching upcoming projects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUpcomingProjects();
  }, [selectedCategory]);

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [projects, searchQuery]);

  if (loading) {
    return <UpcomingProjectsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="hand-drawn text-xl font-bold text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="hand-drawn rounded-lg border-4 border-black bg-yellow-400 px-6 py-2 text-base font-bold text-black transition-all duration-300 hover:bg-yellow-600 hover:scale-105 active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="hand-drawn text-xl font-bold text-black mb-4">No upcoming projects</p>
        <p className="text-gray-600">Check back soon for new projects launching!</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search upcoming projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border-4 border-black rounded-lg font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <UpcomingProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
```

### 6. Component: Upcoming Projects Skeleton

**File:** `frontend/components/public/UpcomingProjects/UpcomingProjectsSkeleton.tsx`

```typescript
export default function UpcomingProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="browser-window animate-pulse">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot red" />
              <div className="browser-dot yellow" />
              <div className="browser-dot green" />
            </div>
          </div>
          <div className="h-48 w-full bg-gray-200" />
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-3" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-4 w-3/4" />
            <div className="h-20 bg-gray-200 rounded mb-4" />
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded flex-1" />
              <div className="h-10 bg-gray-200 rounded w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

**File:** `frontend/components/public/UpcomingProjects/index.ts`

```typescript
export { default as UpcomingProjectsList } from './UpcomingProjectsList';
export { default as UpcomingProjectCard } from './UpcomingProjectCard';
export { default as UpcomingProjectsSkeleton } from './UpcomingProjectsSkeleton';
```

### 7. Page: Upcoming Projects

**File:** `frontend/app/upcoming/page.tsx`

```typescript
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { UpcomingProjectsList, UpcomingProjectsSkeleton } from '@/components/public/UpcomingProjects';
import { siteConfig, WebPageSchema, BreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Upcoming Projects',
  description: 'Discover upcoming projects launching soon on Inventagious. Express your interest and be notified when they go live.',
  alternates: {
    canonical: `${siteConfig.url}/upcoming`,
  },
  openGraph: {
    title: 'Upcoming Projects - Inventagious',
    description: 'Discover upcoming projects launching soon on Inventagious.',
    url: `${siteConfig.url}/upcoming`,
    type: 'website',
    siteName: siteConfig.siteName,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Upcoming Projects - Inventagious',
      },
    ],
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Upcoming Projects - Inventagious',
    description: 'Discover upcoming projects launching soon on Inventagious.',
    images: [siteConfig.twitterImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },
};

export default function UpcomingProjectsPage() {
  return (
    <>
      <WebPageSchema
        title="Upcoming Projects - Inventagious"
        description="Discover upcoming projects launching soon on Inventagious. Express your interest and be notified when they go live."
        url={`${siteConfig.url}/upcoming`}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Upcoming Projects', url: `${siteConfig.url}/upcoming` },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <section className="bg-white py-12">
            <div className="container mx-auto px-4">
              <header className="mb-12 text-center">
                <h1 className="hand-drawn mb-4 text-4xl md:text-5xl font-bold text-black">
                  Upcoming Projects
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover projects launching soon. Express your interest to get notified when they go live!
                </p>
              </header>
            </div>
          </section>
          <section className="halftone-gray py-12">
            <div className="container mx-auto px-4">
              <Suspense fallback={<UpcomingProjectsSkeleton />}>
                <UpcomingProjectsList />
              </Suspense>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
```

### 8. Update Project Detail Page

**File:** `frontend/components/public/ProjectDetail/ProjectHero.tsx`

Add interest button and "Coming Soon" badge for upcoming projects:

```typescript
// Add near the project title/header section
{project.status === 'draft' && project.scheduledLaunchDate && (
  <div className="mb-4">
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 border-4 border-black rounded-lg">
      <span className="hand-drawn font-bold text-black">Coming Soon</span>
      {project.scheduledLaunchDate && (
        <span className="text-sm font-bold text-black">
          Launch: {new Date(project.scheduledLaunchDate).toLocaleDateString()}
        </span>
      )}
    </div>
  </div>
)}

// Add interest button in the sidebar or action area
<InterestButton
  projectId={project.id}
  interestCount={project.interestCount}
  showCount={true}
  className="w-full"
/>
```

### 9. Update Notification Types

**File:** `frontend/lib/api/notifications.ts`

Update the `Notification` interface:

```typescript
export interface Notification {
  id: string;
  userId: string;
  type: 'project_update' | 'donation' | 'comment' | 'follow' | 'milestone' | 'deal_update' | 'funding_goal_reached' | 'deadline_reminder' | 'system' | 'upcoming_project' | 'project_launched';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  metadata?: {
    project_id?: string;
    project_slug?: string;
    scheduled_launch_date?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### 10. Add Navigation Link

**File:** `frontend/components/shared/Header/Header.tsx`

Add a link to the upcoming projects page in the navigation menu:

```typescript
<Link
  href="/upcoming"
  className="hand-drawn px-4 py-2 border-2 border-black bg-white hover:bg-yellow-200 rounded-lg font-bold text-black transition hover:scale-105"
>
  Upcoming
</Link>
```

---

## Implementation Steps

### Phase 1: Backend Setup

1. **Database Migration**
   - Create migration file for `project_interests` table
   - Add `scheduled_launch_date` column to `projects` table
   - Run migrations

2. **Backend Services**
   - Create `ProjectInterestsService`
   - Create `ProjectInterestsController`
   - Add `findUpcomingProjects` method to `ProjectService`
   - Update `NotificationService` with upcoming project notification methods

3. **API Endpoints**
   - Test all new endpoints using Postman or similar
   - Verify authentication guards work correctly
   - Test error handling

### Phase 2: Frontend API Layer

1. **API Clients**
   - Create `project-interests.ts` API client
   - Update `projects.ts` API client with `getUpcoming` method
   - Update `notifications.ts` with new notification types

2. **Type Definitions**
   - Update `Project` interface with new fields
   - Create `ProjectInterest` related interfaces

### Phase 3: Frontend Components

1. **Interest Button Component**
   - Create `InterestButton` component
   - Add loading states and error handling
   - Test with authenticated and unauthenticated users

2. **Upcoming Projects Components**
   - Create `UpcomingProjectCard` component
   - Create `UpcomingProjectsList` component
   - Create `UpcomingProjectsSkeleton` component
   - Add search and filter functionality

3. **Page Implementation**
   - Create `/upcoming` page
   - Add SEO metadata
   - Add breadcrumb schema

4. **Integration**
   - Add interest button to project detail pages
   - Update project cards to show interest count
   - Add navigation link to header

### Phase 4: Notification System

1. **Backend Notification Triggers**
   - Set up notification when project is created with `scheduled_launch_date`
   - Set up notification when project status changes to `active` (for interested users)
   - Set up scheduled job to notify users before launch date

2. **Frontend Notification Display**
   - Update notification list to handle new notification types
   - Add proper links and styling for upcoming project notifications

### Phase 5: Testing & Polish

1. **Functionality Testing**
   - Test interest button toggle
   - Test interest count updates
   - Test upcoming projects page
   - Test notifications

2. **UI/UX Testing**
   - Verify responsive design
   - Test loading states
   - Test error states
   - Verify accessibility

3. **Performance Testing**
   - Optimize queries for upcoming projects
   - Add pagination if needed
   - Optimize interest count queries

---

## Testing Checklist

### Backend Tests

- [ ] Can add interest to a project
- [ ] Cannot add duplicate interests
- [ ] Can remove interest from a project
- [ ] Can check if user is interested
- [ ] Can get interest count for a project
- [ ] Can get user's interested projects
- [ ] Can get upcoming projects
- [ ] Upcoming projects filter by category
- [ ] Notifications created for upcoming projects
- [ ] Notifications sent to interested users when project launches

### Frontend Tests

- [ ] Interest button displays correctly
- [ ] Interest button toggles on click
- [ ] Interest count updates correctly
- [ ] Interest button shows loading state
- [ ] Interest button handles errors gracefully
- [ ] Upcoming projects page loads correctly
- [ ] Upcoming project cards display all information
- [ ] Search functionality works
- [ ] Filter functionality works
- [ ] "Read More" links work correctly
- [ ] Interest button works on project detail pages
- [ ] Notifications display correctly
- [ ] Notification links navigate correctly

### Integration Tests

- [ ] User can express interest and see it reflected immediately
- [ ] User receives notification when interested project launches
- [ ] User can view their interested projects
- [ ] Upcoming projects page shows correct projects
- [ ] Project detail page shows interest button for upcoming projects

---

## Additional Considerations

### Performance Optimization

1. **Caching**
   - Cache interest counts for projects
   - Cache upcoming projects list
   - Invalidate cache when interests change

2. **Database Indexing**
   - Ensure proper indexes on `project_interests` table
   - Index `scheduled_launch_date` for efficient queries

3. **Pagination**
   - Consider adding pagination to upcoming projects list if it grows large
   - Consider pagination for user's interested projects

### Future Enhancements

1. **Email Notifications**
   - Send email when project user is interested in launches
   - Send email reminder before launch date

2. **Recommendations**
   - Recommend upcoming projects based on user interests
   - Show "Similar to projects you're interested in"

3. **Analytics**
   - Track interest trends
   - Track conversion from interest to contribution

4. **Social Features**
   - Show which friends are interested in a project
   - Share interest on social media

---

## Notes

- Follow the existing code patterns and conventions in the codebase
- Ensure all API calls go through the proxy system
- Use TypeScript types consistently
- Handle errors gracefully with user-friendly messages
- Maintain responsive design
- Follow accessibility best practices
- Keep components modular and reusable

