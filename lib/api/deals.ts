import { apiClient } from './client';

export interface Deal {
  id: string;
  investorId: string;
  projectId: string;
  amount: number;
  netAmount: number;
  platformFee: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  message?: string;
  terms?: string;
  proposedDeadline?: string;
  solanaAddress?: string;
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

export interface CreateDealData {
  projectId: string;
  amount: number;
  message?: string;
  terms?: string;
  proposedDeadline?: string;
}

export interface UpdateDealData {
  status?: 'accepted' | 'rejected' | 'cancelled';
  message?: string;
  terms?: string;
  proposedDeadline?: string;
}

export const dealsApi = {
  getAll: async (role?: 'inventor' | 'investor'): Promise<Deal[]> => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    const query = params.toString();
    return apiClient.get<Deal[]>(`/deals${query ? `?${query}` : ''}`);
  },

  getByProject: async (projectId: string): Promise<Deal[]> => {
    return apiClient.get<Deal[]>(`/deals/project/${projectId}`);
  },

  getById: async (id: string): Promise<Deal> => {
    return apiClient.get<Deal>(`/deals/${id}`);
  },

  create: async (
    data: CreateDealData & {
      investorWalletAddress?: string;
      transactionSignature?: string;
    },
  ): Promise<Deal> => {
    return apiClient.post<Deal>('/deals', data);
  },

  update: async (
    id: string,
    data: UpdateDealData & {
      walletAddress?: string;
      transactionSignature?: string;
    },
    role?: 'inventor' | 'investor',
  ): Promise<Deal> => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    const query = params.toString();
    return apiClient.put<Deal>(`/deals/${id}${query ? `?${query}` : ''}`, data);
  },

  complete: async (
    id: string,
    role?: 'inventor' | 'investor',
    walletAddress?: string,
    transactionSignature?: string,
  ): Promise<Deal> => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    const query = params.toString();
    return apiClient.post<Deal>(`/deals/${id}/complete${query ? `?${query}` : ''}`, {
      walletAddress,
      transactionSignature,
    });
  },
};

