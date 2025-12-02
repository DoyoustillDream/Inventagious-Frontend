import { apiClient } from './client';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TicketCategory {
  TECHNICAL = 'technical',
  BILLING = 'billing',
  ACCOUNT = 'account',
  FEATURE_REQUEST = 'feature_request',
  BUG_REPORT = 'bug_report',
  GENERAL = 'general',
  PAYMENT = 'payment',
  PROJECT = 'project',
  OTHER = 'other',
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  email?: string;
  userId?: string;
  assignedTo?: string;
  aiAnalysis?: {
    category: TicketCategory;
    priority: TicketPriority;
    sentiment: 'positive' | 'neutral' | 'negative' | 'urgent';
    sentimentScore: number;
    keywords: string[];
    urgency: number;
    suggestedResponse?: string;
  };
  messages: Array<{
    id: string;
    message: string;
    sender: 'user' | 'support';
    timestamp: string;
    attachments?: string[];
  }>;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface CreateTicketDto {
  subject: string;
  message: string;
  category: TicketCategory;
  email?: string;
  attachments?: string[];
}

export interface UpdateTicketDto {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  response?: string;
}

export interface AddMessageDto {
  message: string;
  attachments?: string[];
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byCategory: Record<TicketCategory, number>;
  byPriority: Record<TicketPriority, number>;
}

export const supportApi = {
  createTicket: async (data: CreateTicketDto): Promise<SupportTicket> => {
    return apiClient.post<SupportTicket>('/support/tickets', data);
  },

  getTickets: async (params?: {
    status?: TicketStatus;
    category?: TicketCategory;
    limit?: number;
    offset?: number;
  }): Promise<{ tickets: SupportTicket[]; total: number }> => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());
    
    return apiClient.get<{ tickets: SupportTicket[]; total: number }>(
      `/support/tickets${query.toString() ? `?${query.toString()}` : ''}`
    );
  },

  getTicketById: async (id: string): Promise<SupportTicket> => {
    return apiClient.get<SupportTicket>(`/support/tickets/${id}`);
  },

  updateTicket: async (id: string, data: UpdateTicketDto): Promise<SupportTicket> => {
    return apiClient.put<SupportTicket>(`/support/tickets/${id}`, data);
  },

  addMessage: async (id: string, data: AddMessageDto): Promise<SupportTicket> => {
    return apiClient.post<SupportTicket>(`/support/tickets/${id}/messages`, data);
  },

  deleteTicket: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/support/tickets/${id}`);
  },

  getTicketStats: async (): Promise<TicketStats> => {
    return apiClient.get<TicketStats>('/support/tickets/stats');
  },

  reanalyzeTicket: async (id: string): Promise<SupportTicket> => {
    return apiClient.post<SupportTicket>(`/support/tickets/${id}/reanalyze`, {});
  },
};

