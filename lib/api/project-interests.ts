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

