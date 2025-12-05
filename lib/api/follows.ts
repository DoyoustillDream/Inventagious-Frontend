import { apiClient } from './client';

export interface FollowUser {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  walletAddress?: string;
  followedAt: string;
}

export interface FollowCount {
  count: number;
}

export interface IsFollowing {
  isFollowing: boolean;
}

export const followsApi = {
  follow: async (userId: string): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(`/follows/${userId}`);
  },

  unfollow: async (userId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete<{ success: boolean; message: string }>(`/follows/${userId}`);
  },

  isFollowing: async (userId: string): Promise<IsFollowing> => {
    return apiClient.get<IsFollowing>(`/follows/${userId}/is-following`);
  },

  getFollowersCount: async (userId: string): Promise<FollowCount> => {
    return apiClient.get<FollowCount>(`/follows/${userId}/followers/count`);
  },

  getFollowingCount: async (userId: string): Promise<FollowCount> => {
    return apiClient.get<FollowCount>(`/follows/${userId}/following/count`);
  },

  getFollowers: async (userId: string, limit?: number): Promise<FollowUser[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return apiClient.get<FollowUser[]>(`/follows/${userId}/followers${query}`);
  },

  getFollowing: async (userId: string, limit?: number): Promise<FollowUser[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return apiClient.get<FollowUser[]>(`/follows/${userId}/following${query}`);
  },
};

