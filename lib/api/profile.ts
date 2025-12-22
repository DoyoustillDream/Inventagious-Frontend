import { apiClient } from './client';

export interface Cause {
  id: string;
  name: string;
  icon?: string;
}

export interface SocialHandle {
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok' | 'website';
  url: string;
  username?: string;
}

export interface Profile {
  id: string;
  userId: string;
  username: string;
  displayName?: string;
  email?: string;
  walletAddress?: string;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  type?: string;
  website?: string;
  location?: string;
  socialHandles?: SocialHandle[];
  causes?: Cause[];
  videos?: Video[];
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface CreateProfileData {
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  type?: string;
  website?: string;
  location?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
}

export interface CreateVideoData {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

export const profileApi = {
  create: async (data: CreateProfileData): Promise<Profile> => {
    return apiClient.post<Profile>('/profile', data);
  },

  getMyProfile: async (): Promise<Profile> => {
    return apiClient.get<Profile>('/profile');
  },

  getByUsername: async (username: string): Promise<Profile> => {
    return apiClient.get<Profile>(`/profile/${username}`);
  },

  getById: async (id: string): Promise<Profile> => {
    return apiClient.get<Profile>(`/profile/${id}`);
  },

  update: async (data: Partial<CreateProfileData>): Promise<Profile> => {
    return apiClient.put<Profile>('/profile', data);
  },

  addVideo: async (data: CreateVideoData): Promise<Video> => {
    return apiClient.post<Video>('/profile/videos', data);
  },

  getVideos: async (username: string): Promise<Video[]> => {
    return apiClient.get<Video[]>(`/profile/${username}/videos`);
  },

  getAvailableCauses: async (): Promise<Cause[]> => {
    return apiClient.get<Cause[]>('/profile/causes/available');
  },

  getUserCauses: async (): Promise<Cause[]> => {
    return apiClient.get<Cause[]>('/profile/causes');
  },

  updateUserCauses: async (causeIds: string[]): Promise<Cause[]> => {
    return apiClient.put<Cause[]>('/profile/causes', { causeIds });
  },

  getStats: async (username: string): Promise<{ followers: number; following: number; projects: number }> => {
    return apiClient.get<{ followers: number; following: number; projects: number }>(`/profile/${username}/stats`);
  },
};

