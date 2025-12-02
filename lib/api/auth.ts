import { apiClient } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

export interface WalletConnectData {
  walletAddress: string;
  signature: string;
  timestamp?: number;
}

export interface AuthUser {
  id: string;
  email?: string;
  walletAddress?: string;
  fullName?: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
  requiresProfileCompletion?: boolean;
  walletAddress?: string;
}

export interface CompleteWalletProfileData {
  fullName: string;
  email: string;
}

export interface ProfileStatus {
  isComplete: boolean;
  missingFields: string[];
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    apiClient.setToken(response.access_token);
    return response;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    apiClient.setToken(response.access_token);
    return response;
  },

  connectWallet: async (data: WalletConnectData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/wallet/connect', data);
    apiClient.setToken(response.access_token);
    return response;
  },

  registerWithWallet: async (data: WalletConnectData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/wallet/register', data);
    apiClient.setToken(response.access_token);
    return response;
  },

  getProfile: async (): Promise<AuthUser> => {
    return apiClient.get<AuthUser>('/auth/profile');
  },

  completeWalletProfile: async (data: CompleteWalletProfileData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/wallet/complete-profile', data);
    if (response.access_token) {
      apiClient.setToken(response.access_token);
    }
    return response;
  },

  getProfileStatus: async (): Promise<ProfileStatus> => {
    return apiClient.get<ProfileStatus>('/auth/profile/status');
  },

  logout: () => {
    apiClient.clearToken();
  },
};

