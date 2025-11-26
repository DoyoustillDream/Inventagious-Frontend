import { apiClient } from './client';

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  response: string;
  suggestions?: string[];
}

export const helpApi = {
  chat: async (message: string): Promise<ChatResponse> => {
    return apiClient.post<ChatResponse>('/help/chat', { message });
  },
};

