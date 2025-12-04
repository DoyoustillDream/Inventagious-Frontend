import { apiClient } from './client';

export interface ChatMessage {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  response: string;
  suggestions?: string[];
}

export const helpApi = {
  chat: async (message: string, sessionId?: string): Promise<ChatResponse> => {
    return apiClient.post<ChatResponse>('/help/chat', { message, sessionId });
  },
  
  createTicketFromChat: async (message: string, email?: string): Promise<{ ticketId: string; message: string }> => {
    return apiClient.post<{ ticketId: string; message: string }>('/help/create-ticket', { message, email });
  },
};

