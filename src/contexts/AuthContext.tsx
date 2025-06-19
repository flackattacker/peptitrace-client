import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '@/api/auth';
import api from '@/api/api';

interface User {
  _id: string;
  email: string;
  role?: string;
  demographics?: any;
  preferences?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          // Get fresh user data from the server
          const response = await api.get('/api/users/me');
          if (response.data?.success && response.data?.user) {
            // Update localStorage with fresh user data
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            setUser(response.data.user);
          } else {
            throw new Error('Invalid user data response');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          // Clear all auth data on validation failure
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
          setUser(null);
        }
      } else {
        // No token or user data, ensure user is null
        setUser(null);
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login process...');
      const response = await apiLogin(email, password);
      console.log('AuthContext: Login response received:', response);
      console.log('AuthContext: Response type:', typeof response);
      console.log('AuthContext: Response keys:', Object.keys(response || {}));
      console.log('AuthContext: Full response structure:', JSON.stringify(response, null, 2));
      
      if (!response?.success) {
        console.error('AuthContext: Login failed - no success flag');
        throw new Error(response?.error || 'Login failed');
      }

      console.log('AuthContext: Login successful, extracting data...');
      console.log('AuthContext: response.data:', response.data);
      console.log('AuthContext: response.data.data:', response.data?.data);
      
      // Try to get tokens from the correct location
      let tokenData;
      if (response.data?.data) {
        // Server response structure: { success: true, data: { user, accessToken, refreshToken } }
        tokenData = response.data.data;
      } else if (response.data?.accessToken) {
        // Direct structure: { success: true, accessToken, refreshToken, user }
        tokenData = response.data;
      } else {
        console.error('AuthContext: Unexpected response structure:', response);
        throw new Error('Invalid login response structure');
      }
      
      const { accessToken, refreshToken, user } = tokenData;
      console.log('AuthContext: Extracted data:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        hasUser: !!user 
      });
      
      if (!accessToken || !refreshToken || !user) {
        console.error('AuthContext: Missing required data:', { accessToken: !!accessToken, refreshToken: !!refreshToken, user: !!user });
        throw new Error('Invalid login response - missing required data');
      }

      console.log('AuthContext: Storing tokens and user data...');
      // Store tokens and user data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userData', JSON.stringify(user));
      
      console.log('AuthContext: Setting user state...');
      setUser(user);
      console.log('AuthContext: Login process completed successfully');
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await apiRegister(email, password);
      
      if (!response?.success) {
        throw new Error(response?.error || 'Registration failed');
      }

      // The server sends user data under response.data.data
      const userData = response.data?.data?.user;
      if (!userData) {
        throw new Error('Invalid registration response - missing user data');
      }

      // For registration, we don't get tokens immediately (user is pending approval)
      setUser(userData);
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error?.response?.data?.error || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}