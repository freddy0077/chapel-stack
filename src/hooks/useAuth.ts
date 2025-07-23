'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, gql } from '@apollo/client';
import { User, LoginResult, AuthResponse } from '@/types/auth.types';
import { DashboardType, getRoleConfig, canAccessRoute, canAccessDashboard } from '@/config/role-dashboard.config';

// GraphQL Mutations
const LOGIN_MUTATION = gql`
  mutation Login($input: SignInDto!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
        phoneNumber
        isActive
        isEmailVerified
        lastLoginAt
        createdAt
        updatedAt
        organisationId
        roles {
          id
          name
        }
        userBranches {
          branch {
            id
            name
          }
          role {
            id
            name
          }
        }
        member {
          id
          firstName
          lastName
          profileImageUrl
          status
        }
      }
    }
  }
`;

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      firstName
      lastName
      phoneNumber
      isActive
      isEmailVerified
      lastLoginAt
      createdAt
      updatedAt
      organisationId
      roles {
        id
        name
      }
      userBranches {
        branch {
          id
          name
        }
        role {
          id
          name
        }
      }
      member {
        id
        firstName
        lastName
        profileImageUrl
        status
      }
    }
  }
`;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  
  // Helper function to determine primary role
  const getPrimaryRole = (userData: any): string => {
    if (!userData.roles || userData.roles.length === 0) {
      return 'MEMBER'; // Default role
    }
    
    // Priority order for roles
    const rolePriority = [
      'SUPER_ADMIN',
      'BRANCH_ADMIN', 
      'SUBSCRIPTION_MANAGER',
      'FINANCE_MANAGER',
      'PASTORAL_STAFF',
      'MINISTRY_LEADER',
      'MEMBER'
    ];
    
    for (const role of rolePriority) {
      if (userData.roles.some((r: any) => r.name === role)) {
        return role;
      }
    }
    
    return userData.roles[0].name; // Fallback to first role
  };
  
  // Helper function to process user data
  const processUserData = (userData: any): User => {
    const primaryRole = getPrimaryRole(userData);
    
    // Extract the primary branch from userBranches with proper null safety
    const primaryBranch = userData.userBranches && 
                         userData.userBranches.length > 0 && 
                         userData.userBranches[0].branch
      ? {
          id: userData.userBranches[0].branch.id,
          name: userData.userBranches[0].branch.name
        }
      : null;
    
    return {
      id: userData.id,
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      isActive: userData.isActive,
      isEmailVerified: userData.isEmailVerified,
      lastLoginAt: userData.lastLoginAt,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      organisationId: userData.organisationId,
      roles: userData.roles.map((role: any) => role.name), // Extract role names
      userBranches: userData.userBranches,
      member: userData.member,
      primaryRole,
      branch: primaryBranch
    };
  };
  
  // Login function
  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      setIsLoading(true);
      
      const response = await loginMutation({
        variables: {
          input: { email, password }
        }
      });
      
      const { accessToken, user: userData } = response.data.login;
      
      console.log('🔐 Login successful, processing user data:', userData);
      
      // Store token in both localStorage and cookies
      localStorage.setItem('authToken', accessToken);
      // Set cookie for middleware access
      document.cookie = `authToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
      
      // Process and set user data
      const processedUser = processUserData(userData);
      console.log('👤 Processed user data:', processedUser);
      setUser(processedUser);
      localStorage.setItem('userData', JSON.stringify(processedUser));
      
      // Get role configuration and redirect
      const roleConfig = getRoleConfig(processedUser.primaryRole);
      console.log('🎯 Role config for', processedUser.primaryRole, ':', roleConfig);
      
      setIsLoading(false);
      
      // Use a more reliable redirect approach
      const redirectUrl = roleConfig ? roleConfig.defaultRoute : '/dashboard';
      console.log('🔀 Redirecting to:', redirectUrl);
      
      // Use Next.js router for client-side navigation
      router.replace(redirectUrl);
      
      return { success: true };
      
    } catch (error: any) {
      setIsLoading(false);
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  }, [loginMutation, router]);
  
  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    // Clear auth cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setUser(null);
    router.push('/auth/login');
  }, [router]);
  
  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuthState = () => {
      console.log('🔍 Checking authentication state...');
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('✅ Found existing auth data:', parsedUser);
          
          // Ensure cookie is set properly on page load
          document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
          
          setUser(parsedUser);
        } catch (error) {
          console.error('❌ Error parsing stored user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          // Clear auth cookie
          document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
      } else {
        console.log('❌ No existing auth data found');
        // Clear any stale cookies
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      
      setIsLoading(false);
      setIsHydrated(true);
    };
    
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(checkAuthState, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Computed values
  const isAuthenticated = !!user;
  const primaryRole = user?.primaryRole || null;
  const roleConfig = primaryRole ? getRoleConfig(primaryRole) : null;
  const allowedDashboards = roleConfig?.allowedDashboards || [];
  const defaultDashboard = roleConfig?.defaultDashboard || null;
  const defaultRoute = roleConfig?.defaultRoute || '/auth/login';
  
  // Route checking functions
  const checkCanAccessRoute = useCallback((route: string): boolean => {
    if (!user || !primaryRole) return false;
    return canAccessRoute(primaryRole, route);
  }, [user, primaryRole]);
  
  const checkCanAccessDashboard = useCallback((dashboard: DashboardType): boolean => {
    if (!user || !primaryRole) return false;
    return canAccessDashboard(primaryRole, dashboard);
  }, [user, primaryRole]);
  
  return {
    user,
    isAuthenticated,
    isLoading,
    isHydrated,
    primaryRole,
    allowedDashboards,
    defaultDashboard,
    defaultRoute,
    login,
    logout,
    canAccessRoute: checkCanAccessRoute,
    canAccessDashboard: checkCanAccessDashboard,
  };
}
