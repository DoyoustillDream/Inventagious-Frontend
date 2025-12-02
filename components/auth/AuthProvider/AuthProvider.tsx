'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from 'react';
import { authApi, AuthUser } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';

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
  const initRef = useRef(false);

  // Initialize auth state on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

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

  // Enhanced setUser that also validates token
  const setUserWithValidation = useCallback((newUser: AuthUser | null) => {
    setUser(newUser);
    // If setting user, ensure token exists
    if (newUser && !apiClient.getToken()) {
      console.warn('Setting user but no token found');
    }
    // If clearing user, clear token
    if (!newUser) {
      apiClient.clearToken();
    }
  }, []);

  const logout = useCallback(() => {
    apiClient.clearToken();
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser: setUserWithValidation,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

