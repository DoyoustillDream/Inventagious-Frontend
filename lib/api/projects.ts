import { apiClient } from './client';

export interface Donation {
  id: string;
  donorWalletAddress: string;
  amount: number;
  createdAt: string;
}

export interface Contribution {
  id: string;
  contributorWalletAddress: string;
  amount: number;
  createdAt: string;
}

export interface Project {
  id: string;
  slug: string;
  userId?: string;
  title: string;
  description?: string;
  type: 'crowdfunding' | 'private_funding';
  fundingGoal: number;
  amountRaised: number;
  backersCount: number;
  status: string;
  category?: string;
  imageUrl?: string;
  videoUrl?: string;
  deadline?: string;
  solanaAddress?: string;
  isOnChain?: boolean;
  campaignWalletAddress?: string; // Unique wallet for this campaign
  websiteUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  donations?: Donation[];
  contributions?: Contribution[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  title: string;
  description?: string;
  type: 'crowdfunding' | 'private_funding';
  fundingGoal: number;
  category?: string;
  imageUrl?: string;
  videoUrl?: string;
  deadline?: string;
  solanaAddress?: string;
  isPublic?: boolean;
  isFeatured?: boolean;
  websiteUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  targetDate?: string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface CreateMilestoneData {
  title: string;
  description?: string;
  targetAmount: number;
  targetDate?: string;
}

export interface FeaturedTopic {
  id: string;
  title: string;
  description: string;
  tag: string;
  href: string;
  projectCount: number;
  keywords?: string[];
}

export interface CampaignUpdate {
  id: string;
  projectId: string;
  creatorId: string;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  isPinned: boolean;
  emailSent: boolean;
  emailSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignUpdateData {
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  isPinned?: boolean;
}

export interface UpdateCampaignUpdateData {
  title?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  isPinned?: boolean;
}

export const projectsApi = {
  getAll: async (type?: string, status?: string): Promise<Project[]> => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    const query = params.toString();
    return apiClient.get<Project[]>(`/projects${query ? `?${query}` : ''}`);
  },

  getById: async (id: string): Promise<Project> => {
    // Check if it's a UUID (36 chars with hyphens) or a slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    if (isUuid) {
      return apiClient.get<Project>(`/projects/${id}`);
    } else {
      // Use slug endpoint for better clarity
      // Next.js route params are already decoded, so we need to encode for the URL path
      // encodeURIComponent handles special characters properly
      const encodedSlug = encodeURIComponent(id);
      return apiClient.get<Project>(`/projects/slug/${encodedSlug}`);
    }
  },

  getMyProjects: async (): Promise<Project[]> => {
    return apiClient.get<Project[]>('/projects/my/projects');
  },

  create: async (data: CreateProjectData): Promise<Project> => {
    return apiClient.post<Project>('/projects', data);
  },

  update: async (id: string, data: Partial<CreateProjectData>): Promise<Project> => {
    return apiClient.put<Project>(`/projects/${id}`, data);
  },

  publish: async (
    id: string,
    creatorWalletAddress?: string,
  ): Promise<Project> => {
    return apiClient.post<Project>(`/projects/${id}/publish`, {
      creatorWalletAddress,
    });
  },

  contribute: async (
    id: string,
    amount: number,
    contributorWalletAddress?: string,
    transactionSignature?: string,
  ): Promise<Project> => {
    return apiClient.post<Project>(`/projects/${id}/contribute`, {
      amount,
      contributorWalletAddress,
      transactionSignature,
    });
  },

  donate: async (id: string, amount: number): Promise<Project> => {
    return apiClient.post<Project>(`/projects/${id}/donate`, { amount });
  },

  getFeatured: async (): Promise<Project[]> => {
    return apiClient.get<Project[]>('/projects/featured');
  },

  getRecommended: async (category?: string): Promise<Project[]> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    const query = params.toString();
    return apiClient.get<Project[]>(`/projects/recommended${query ? `?${query}` : ''}`);
  },

  getFeaturedTopics: async (): Promise<FeaturedTopic[]> => {
    return apiClient.get<FeaturedTopic[]>('/projects/topics/featured');
  },

  search: async (query: string, type?: string): Promise<Project[]> => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (type) params.append('type', type);
    return apiClient.get<Project[]>(`/projects/search?${params.toString()}`);
  },

  setFeatured: async (id: string, isFeatured: boolean): Promise<Project> => {
    return apiClient.post<Project>(`/projects/${id}/feature`, { isFeatured });
  },

  addMilestone: async (
    id: string,
    data: CreateMilestoneData,
  ): Promise<Milestone> => {
    return apiClient.post<Milestone>(`/projects/${id}/milestones`, data);
  },

  updateMilestone: async (
    id: string,
    milestoneId: string,
    data: Partial<CreateMilestoneData> & { isCompleted?: boolean },
  ): Promise<Milestone> => {
    return apiClient.put<Milestone>(
      `/projects/${id}/milestones/${milestoneId}`,
      data,
    );
  },

  releaseFunds: async (
    id: string,
  ): Promise<Project & { releaseTransactionSignature?: string; amountReleased?: number }> => {
    return apiClient.post<Project & { releaseTransactionSignature?: string; amountReleased?: number }>(
      `/projects/${id}/release-funds`,
    );
  },

  // Campaign Updates
  getCampaignUpdates: async (projectId: string): Promise<CampaignUpdate[]> => {
    return apiClient.get<CampaignUpdate[]>(`/projects/${projectId}/updates`);
  },

  getCampaignUpdate: async (projectId: string, updateId: string): Promise<CampaignUpdate> => {
    return apiClient.get<CampaignUpdate>(`/projects/${projectId}/updates/${updateId}`);
  },

  createCampaignUpdate: async (
    projectId: string,
    data: CreateCampaignUpdateData,
  ): Promise<CampaignUpdate> => {
    return apiClient.post<CampaignUpdate>(`/projects/${projectId}/updates`, data);
  },

  updateCampaignUpdate: async (
    projectId: string,
    updateId: string,
    data: UpdateCampaignUpdateData,
  ): Promise<CampaignUpdate> => {
    return apiClient.put<CampaignUpdate>(`/projects/${projectId}/updates/${updateId}`, data);
  },

  deleteCampaignUpdate: async (projectId: string, updateId: string): Promise<void> => {
    return apiClient.delete<void>(`/projects/${projectId}/updates/${updateId}`);
  },
};

