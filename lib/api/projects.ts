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

export const projectsApi = {
  getAll: async (type?: string, status?: string): Promise<Project[]> => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    const query = params.toString();
    return apiClient.get<Project[]>(`/projects${query ? `?${query}` : ''}`);
  },

  getById: async (id: string): Promise<Project> => {
    return apiClient.get<Project>(`/projects/${id}`);
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
};

