'use client';

import { useState, useCallback } from 'react';
import { useMutation, gql } from '@apollo/client';
import { client } from '../apollo-client';

// GraphQL mutations for authentication
const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input)
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(registerInput: $input) {
      id
      email
      firstName
      lastName
      role
      status
      createdAt
      updatedAt
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

// Types
export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export const useApolloAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login mutation
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  
  // Register mutation
  const [registerMutation] = useMutation(REGISTER_MUTATION);
  
  // Logout mutation
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);
  
  /**
   * Login with GraphQL API
   */
  const login = useCallback(async (credentials: LoginInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await loginMutation({
        variables: {
          input: {
            email: credentials.email,
            password: credentials.password
          }
        }
      });
      
      // Login mutation now returns a simple token string
      const token = data.login;
      
      if (!token) {
        throw new Error('Login failed: No token received');
      }
      
      // Store token
      localStorage.setItem('authToken', token);
      
      // Fetch user data with token
      const { data: userData } = await client.query({
        query: gql`
          query Me {
            me {
              id
              email
              firstName
              lastName
              role
              status
              createdAt
              updatedAt
            }
          }
        `,
        context: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        fetchPolicy: 'network-only'
      });
      
      if (!userData?.me) {
        throw new Error('Failed to fetch user data');
      }
      
      // Store user data
      localStorage.setItem('church_mgmt_user', JSON.stringify(userData.me));
      
      setIsLoading(false);
      return { success: true, user: userData.me };
    } catch (err: unknown) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [loginMutation]);
  
  /**
   * Register with GraphQL API
   */
  const register = useCallback(async (userData: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await registerMutation({
        variables: {
          input: userData
        }
      });
      
      setIsLoading(false);
      return { success: true, user: data.register };
    } catch (err: unknown) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [registerMutation]);
  
  /**
   * Logout with GraphQL API
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await logoutMutation();
      
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('church_mgmt_user');
      
      // Reset Apollo cache
      await client.resetStore();
      
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err.message || 'Logout failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [logoutMutation]);
  
  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('authToken');
    return !!token;
  }, []);
  
  /**
   * Get current user data
   */
  const getCurrentUser = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('church_mgmt_user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }, []);

  return {
    login,
    register,
    logout,
    isAuthenticated,
    getCurrentUser,
    isLoading,
    error
  };
};
