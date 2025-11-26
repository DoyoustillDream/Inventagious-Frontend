'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';

interface AuthUser {
  id: string;
  email?: string;
  walletAddress?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = apiClient.getToken();
        
        if (token) {
          // Verify token is still valid
          try {
            const profile = await authApi.getProfile();
            setUser(profile);
          } catch (error) {
            // Token is invalid, clear it
            apiClient.clearToken();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

