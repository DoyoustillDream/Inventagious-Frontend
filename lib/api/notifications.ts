import { apiClient } from './client';

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

export interface UnreadCount {
  count: number;
}

export const notificationsApi = {
  getAll: async (options?: { limit?: number; unreadOnly?: boolean }): Promise<Notification[]> => {
    const params = new URLSearchParams();
    if (options?.limit) {
      params.append('limit', options.limit.toString());
    }
    if (options?.unreadOnly) {
      params.append('unreadOnly', 'true');
    }
    const query = params.toString();
    return apiClient.get<Notification[]>(`/notifications${query ? `?${query}` : ''}`);
  },

  getUnreadCount: async (): Promise<UnreadCount> => {
    return apiClient.get<UnreadCount>('/notifications/unread-count');
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    return apiClient.put<Notification>(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<{ success: boolean; message: string }> => {
    return apiClient.put<{ success: boolean; message: string }>('/notifications/read-all');
  },

  delete: async (notificationId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete<{ success: boolean; message: string }>(`/notifications/${notificationId}`);
  },
};

