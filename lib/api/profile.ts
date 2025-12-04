import { apiClient } from './client';

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
};

