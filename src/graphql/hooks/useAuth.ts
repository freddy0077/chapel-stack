'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMutation, useApolloClient, useLazyQuery } from '@apollo/client';
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  LOGOUT_MUTATION,
  LOGOUT_ALL_MUTATION,
  REFRESH_TOKEN_MUTATION,
  VERIFY_MFA_MUTATION,
  SETUP_MFA_MUTATION,
  VERIFY_MFA_SETUP_MUTATION,
  DISABLE_MFA_MUTATION,
  REQUEST_PASSWORD_RESET_MUTATION,
  RESET_PASSWORD_MUTATION,
  CHANGE_PASSWORD_MUTATION,
  UPDATE_PROFILE_MUTATION,
  REQUEST_EMAIL_VERIFICATION_MUTATION,
  VERIFY_EMAIL_MUTATION,
} from '../mutations/auth';

import {
  MY_SESSIONS_QUERY,
  MFA_STATUS_QUERY,
  VALIDATE_RESET_TOKEN_QUERY,
} from '../queries/user';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

// Helper function for safe localStorage access in SSR environments
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
  clear: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
};

// Types and interfaces for auth functionality
enum MFAType {
  APP = 'APP',
  SMS = 'SMS',
  EMAIL = 'EMAIL'
}

// Role interface
interface UserRole {
  id: string;
  name: string;
}

// Branch interface
interface Branch {
  id: string;
  name: string;
}

// UserBranch interface
interface UserBranch {
  branch: Branch;
  role: UserRole;
}

// User data interface
interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  roles?: UserRole[];
  userBranches?: UserBranch[];
  // Additional fields for application state
  name?: string;
  accessibleBranches?: Array<{ branchId: string; branchName: string; role: string }>;
  primaryRole?: string;
  redirectPath?: string;
}

// Auth response interfaces
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// Generic responses
interface StatusResponse {
  success: boolean;
  message: string;
  error?: string;
}

type VerificationResponse = StatusResponse;

// MFA related interfaces
interface MFASetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  success: boolean;
  message: string;
}

interface MFAStatusResponse {
  isEnabled: boolean;
  methods: string[];
}

// Session interface
interface Session {
  id: string;
  userId: string;
  userAgent: string;
  ipAddress: string;
  lastActiveAt: string;
  createdAt: string;
}

// Input interfaces
interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  branchId?: string;
}

interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentBranchId?: string;
}

/**
 * Custom hook for authentication logic
 * Provides all authentication-related functionality including:
 * - Login/Register/Logout
 * - MFA handling
 * - Password reset
 * - Email verification
 * - Session management
 * - Profile updates
 */
function useAuth() {
  // State for loading and error tracking
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as loading
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // Reference to track if auth state has been initialized
  const authInitializedRef = useRef<boolean>(false);
  
  // Hooks
  const client = useApolloClient();
  const router = useRouter(); // Used in the token refresh effect
  
  // Auth mutations
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);
  const [logoutAllMutation] = useMutation(LOGOUT_ALL_MUTATION);
  const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);
  const [verifyMfaMutation] = useMutation(VERIFY_MFA_MUTATION);
  const [setupMfaMutation] = useMutation(SETUP_MFA_MUTATION);
  const [verifyMfaSetupMutation] = useMutation(VERIFY_MFA_SETUP_MUTATION);
  const [disableMfaMutation] = useMutation(DISABLE_MFA_MUTATION);
  const [requestPasswordResetMutation] = useMutation(REQUEST_PASSWORD_RESET_MUTATION);
  const [resetPasswordMutation] = useMutation(RESET_PASSWORD_MUTATION);
  const [changePasswordMutation] = useMutation(CHANGE_PASSWORD_MUTATION);
  const [updateProfileMutation] = useMutation(UPDATE_PROFILE_MUTATION);
  const [requestEmailVerificationMutation] = useMutation(REQUEST_EMAIL_VERIFICATION_MUTATION);
  const [verifyEmailMutation] = useMutation(VERIFY_EMAIL_MUTATION);
  
  // Auth queries
  const [getMySessionsQuery] = useLazyQuery(MY_SESSIONS_QUERY);
  const [getMfaStatusQuery] = useLazyQuery(MFA_STATUS_QUERY);
  const [validateResetTokenQuery] = useLazyQuery(VALIDATE_RESET_TOKEN_QUERY);
  
  // Helper function to clear auth data
  const clearAuthData = useCallback(() => {
    safeLocalStorage.removeItem('authToken');
    safeLocalStorage.removeItem('user');
    safeLocalStorage.removeItem('tokenExpiry');
    Cookies.remove('refreshToken', { path: '/' });
    Cookies.remove('user', { path: '/' });
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Check if user is logged in on initial load and listen for storage changes
  useEffect(() => {
    // Skip if already initialized - prevents multiple checks
    if (authInitializedRef.current) {
      return;
    }
    
    const checkAuthState = () => {
      const token = safeLocalStorage.getItem('authToken');
      const userStr = safeLocalStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr) as AuthUser;
          setUser(userData);
          setIsAuthenticated(true);
          
          console.log('🔐 Auth state synchronized: User authenticated');
          return true;
        } catch {
          // Invalid user data in localStorage
          clearAuthData();
          console.log('❌ Auth state synchronized: Invalid user data');
          return false;
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log('❌ Auth state synchronized: No auth data');
        return false;
      }
    };
    
    // Check auth state on mount
    checkAuthState();
    // Mark as initialized after first check
    authInitializedRef.current = true;
    // Complete the loading state
    setIsLoading(false);
    
    // Listen for storage events (helps with multi-tab synchronization)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authToken' || event.key === 'user' || event.key === null) {
        console.log('🔄 Storage changed, synchronizing auth state');
        checkAuthState();
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [clearAuthData]);
  
  // Helper function to store auth data
  const storeAuthData = useCallback((authResponse: AuthResponse, rememberMe = false) => {
    const { accessToken, refreshToken } = authResponse;
    
    safeLocalStorage.setItem('authToken', accessToken);
    
    // Store refresh token in cookie with appropriate security settings
    Cookies.set('refreshToken', refreshToken, {
      expires: rememberMe ? 30 : 1, // 30 days if remember me is checked, otherwise 1 day
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Calculate and store token expiry
    // Typically, JWT tokens have an 'exp' claim, but here we'll estimate with a default expiry of 15 minutes
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15);
    safeLocalStorage.setItem('tokenExpiry', expiryDate.getTime().toString());
  }, []);

  // Store user data in localStorage with proper transformation
  const storeUserData = useCallback((userData: AuthUser) => {
    const userString = JSON.stringify(userData);
    // Store in both localStorage for client-side access and cookie for middleware
    safeLocalStorage.setItem('user', userString);
    Cookies.set('user', userString, {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // Get the highest role priority from user roles
  const getHighestRole = (user: AuthUser): string => {
    console.log('DEBUG: AuthUser object at dashboard routing:', user);
    console.log('DEBUG: Raw roles:', user.roles);

    console.log('🔍 Getting highest role for user:', user);
    console.log('👉 User roles:', user.roles);
    
    // Define role priority (higher index = higher priority)
    const rolePriority = ['member', 'volunteer', 'content_manager', 'finance_manager', 'ministry_leader', 'pastor', 'branch_admin', 'super_admin'];
    console.log('⚖️ Role priority order:', rolePriority);
    
    // Default to lowest role if no roles found
    if (!user.roles || user.roles.length === 0) {
      console.log('⚠️ No roles found for user, defaulting to member');
      return 'member';
    }
    
    let highestRole = 'member';
    let highestPriority = 0;
    
    // Define a type to handle different role formats
    type PotentialRole = string | { name?: string; role?: string; title?: string; type?: string; id?: string; [key: string]: unknown };

    // Find the highest priority role
    (user.roles as PotentialRole[]).forEach(role => {
      let normalizedRoleName = 'member';
      try {
        // Handle different possible role formats
        if (typeof role === 'string') {
          // Case 1: Role is a string directly
          normalizedRoleName = role.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/\s+/g, '_').toLowerCase();
          console.log(`🔄 Processing string role: "${role}" → normalized to "${normalizedRoleName}"`);
        } else if (typeof role === 'object' && role !== null) {
          // Case 2: Role is an object with a name property
          if ('name' in role && typeof role.name === 'string') {
            normalizedRoleName = role.name.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/\s+/g, '_').toLowerCase();
            console.log(`🔄 Processing object role with name: "${role.name}" → normalized to "${normalizedRoleName}"`);
          } else {
            // Case 3: Role is an object with other properties
            const potentialNameProps = ['role', 'title', 'type', 'id'];
            for (const prop of potentialNameProps) {
              if (prop in role && typeof role[prop as keyof typeof role] === 'string') {
                const propValue = role[prop as keyof typeof role] as string;
                normalizedRoleName = propValue.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/\s+/g, '_').toLowerCase();
                console.log(`🔄 Processing object role with ${prop}: "${propValue}" → normalized to "${normalizedRoleName}"`);
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error('❌ Error normalizing role:', error, role);
      }
      
      const priority = rolePriority.indexOf(normalizedRoleName);
      console.log(`⚖️ Priority for "${normalizedRoleName}": ${priority} (${priority === -1 ? 'NOT FOUND IN PRIORITY LIST' : 'found'})`);
      
      if (priority > highestPriority) {
        console.log(`✅ Found higher priority role: "${normalizedRoleName}" (${priority}) > previous (${highestPriority})`);
        highestPriority = priority;
        highestRole = normalizedRoleName;
      }
    });
    
    console.log(`👑 Highest role determined: "${highestRole}" with priority ${highestPriority}`);
    return highestRole;
  };
  
  // Get the appropriate dashboard route based on role
  const getDashboardRoute = (role: string): string => {
    switch (role) {
      case 'super_admin':
        return '/dashboard/admin';
      case 'branch_admin':
        return '/dashboard/branch-admin';
      case 'pastor':
        return '/dashboard/pastor';
      case 'ministry_leader':
        return '/dashboard/ministry';
      case 'staff':
      case 'volunteer':
        return '/dashboard/staff';
      default:
        return '/dashboard';
    }
  };

  // Login function
  const login = useCallback(async (email: string, password: string, rememberMe = false): Promise<{ success: boolean; requiresMFA?: boolean; redirectTo?: string; error?: string; user?: AuthUser }> => {
    setIsLoading(true);
    setError(null);
    console.log('🔐 Starting login in useAuth hook...');
    
    try {
      console.log('🔄 Calling login mutation with:', { email });
      const response = await loginMutation({
        variables: { input: { email, password } }
      });
      
      console.log('🔎 FULL LOGIN RESPONSE:', JSON.stringify(response, null, 2));
      console.log('🔎 LOGIN DATA:', response.data ? JSON.stringify(response.data, null, 2) : 'No data');
      
      const { data } = response;
      console.log('✅ Login mutation response received:', data ? 'Data received' : 'No data');
      
      if (data?.login?.requiresMFA) {
        console.log('🔒 MFA required, returning early');
        setIsLoading(false);
        return { success: true, requiresMFA: true };
      }
      
      // Store authentication data
      console.log('🔑 Storing auth data:', { 
        accessToken: data.login.accessToken ? 'Present' : 'Missing', 
        refreshToken: data.login.refreshToken ? 'Present' : 'Missing'
      });
      storeAuthData(data.login, rememberMe);
      
      if (!data?.login?.user) {
        throw new Error('Login failed: No user data received');
      }

      // --- Start of consolidated logic ---
      const userFromApi = data.login.user;
      
      const transformedUser: AuthUser = {
        ...userFromApi,
        name: userFromApi.firstName && userFromApi.lastName 
              ? `${userFromApi.firstName} ${userFromApi.lastName}` 
              : userFromApi.email,
        roles: Array.isArray(userFromApi.roles) ? userFromApi.roles : [],
        accessibleBranches: userFromApi.userBranches ? userFromApi.userBranches.map((ub: UserBranch) => ({
          branchId: ub.branch?.id || '',
          branchName: ub.branch?.name || '',
          role: ub.role?.name || ''
        })) : []
      };

      const highestRole = getHighestRole(transformedUser);
      transformedUser.primaryRole = highestRole;
      
      const redirectTo = getDashboardRoute(highestRole);
      transformedUser.redirectPath = redirectTo;
      
      // Now store the fully transformed user data
      storeUserData(transformedUser);
      // --- End of consolidated logic ---
      
      setIsLoading(false);
      return { success: true, redirectTo, user: transformedUser };
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsLoading(false);
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  }, [loginMutation, storeAuthData, storeUserData]);
  
  // Register function
  const register = useCallback(async (input: RegisterInput): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await registerMutation({
        variables: { input }
      });
      
      setIsLoading(false);
      return { success: true, user: data?.register };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [registerMutation]);
  
  // Logout function
  const logout = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await logoutMutation();
      
      // Clear auth data
      clearAuthData();
      
      // Reset Apollo Client store
      await client.resetStore();
      
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      // Even if the API call fails, we still want to clear local auth data
      clearAuthData();
      await client.resetStore();
      
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [logoutMutation, client, clearAuthData]);
  
  // Logout all sessions function
  const logoutAllSessions = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await logoutAllMutation();
      
      // Clear auth data
      clearAuthData();
      
      // Reset Apollo Client store
      await client.resetStore();
      
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      // Even if the API call fails, we still want to clear local auth data
      clearAuthData();
      await client.resetStore();
      
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [logoutAllMutation, client, clearAuthData]);
  
  // Logout specific session
  const logoutSession = useCallback(async (sessionId: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await logoutMutation({
        variables: { sessionId }
      });
      
      // If this is the current session, clear auth data
      if (safeLocalStorage.getItem('currentSessionId') === sessionId) {
        clearAuthData();
        await client.resetStore();
      }
      
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [logoutMutation, client, clearAuthData]);
  
  // Verify MFA function
  const verifyMFA = useCallback(async (code: string, email: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await verifyMfaMutation({
        variables: {
          input: {
            code,
            email
          }
        }
      });
      
      if (data.verifyMFA) {
        // Store auth data
        storeAuthData(data.verifyMFA);
        
        setIsLoading(false);
        return { success: true, user: data.verifyMFA.user };
      }
      
      setIsLoading(false);
      return { success: false, error: 'MFA verification failed' };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'MFA verification failed';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [verifyMfaMutation, storeAuthData]);
  
  // Get MFA status
  const getMFAStatus = useCallback(async (): Promise<MFAStatusResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await getMfaStatusQuery();
      
      setIsLoading(false);
      return data.mfaStatus || { isEnabled: false, methods: [] };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get MFA status';
      setError(errorMessage);
      setIsLoading(false);
      return { isEnabled: false, methods: [] };
    }
  }, [getMfaStatusQuery]);
  
  // Setup MFA function
  const setupMFA = useCallback(async (type = MFAType.APP): Promise<MFASetupResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await setupMfaMutation({
        variables: { 
          input: { type } 
        }
      });
      
      setIsLoading(false);
      
      if (!data.setupMFA) {
        return { 
          success: false, 
          message: 'Failed to setup MFA',
          secret: '',
          qrCode: '',
          backupCodes: []
        };
      }
      
      return data.setupMFA;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to setup MFA';
      setError(errorMessage);
      setIsLoading(false);
      return { 
        success: false, 
        message: errorMessage,
        secret: '',
        qrCode: '',
        backupCodes: []
      };
    }
  }, [setupMfaMutation]);
  
  // Verify MFA setup function
  const verifyMFASetup = useCallback(async (code: string, type = MFAType.APP): Promise<VerificationResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await verifyMfaSetupMutation({
        variables: {
          input: { code, type }
        }
      });
      
      setIsLoading(false);
      return {
        success: data.verifyMFASetup.success,
        message: data.verifyMFASetup.message
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify MFA setup';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  }, [verifyMfaSetupMutation]);
  
  // Disable MFA function
  const disableMFA = useCallback(async (password: string, type = MFAType.APP): Promise<VerificationResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await disableMfaMutation({
        variables: {
          input: { password, type }
        }
      });
      
      setIsLoading(false);
      return {
        success: data.disableMFA.success,
        message: data.disableMFA.message
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disable MFA';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage, error: errorMessage };
    }
  }, [disableMfaMutation]);
  
  // Request password reset function
  const requestPasswordReset = useCallback(async (email: string): Promise<StatusResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await requestPasswordResetMutation({
        variables: { email }
      });
      
      setIsLoading(false);
      return { 
        success: data.requestPasswordReset.success, 
        message: data.requestPasswordReset.message 
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request password reset';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage, error: errorMessage };
    }
  }, [requestPasswordResetMutation]);
  
  // Reset password function
  const resetPassword = useCallback(async (token: string, newPassword: string): Promise<StatusResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await resetPasswordMutation({
        variables: { token, newPassword }
      });
      
      setIsLoading(false);
      return { 
        success: data.resetPassword.success, 
        message: data.resetPassword.message 
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage, error: errorMessage };
    }
  }, [resetPasswordMutation]);
  
  // Change password function
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<StatusResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await changePasswordMutation({
        variables: { currentPassword, newPassword }
      });
      
      setIsLoading(false);
      return { 
        success: data.changePassword.success, 
        message: data.changePassword.message 
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage, error: errorMessage };
    }
  }, [changePasswordMutation]);
  
  // Update profile function
  const updateProfile = useCallback(async (input: UpdateProfileInput): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await updateProfileMutation({
        variables: { input }
      });
      
      // Update user data in localStorage
      if (data.updateProfile) {
        storeUserData(data.updateProfile);
      }
      
      setIsLoading(false);
      return { success: true, user: data.updateProfile };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [updateProfileMutation, storeUserData]);
  
  // Request email verification function
  const requestEmailVerification = useCallback(async (): Promise<StatusResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await requestEmailVerificationMutation();
      
      setIsLoading(false);
      return { 
        success: data.requestEmailVerification.success, 
        message: data.requestEmailVerification.message 
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request email verification';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage, error: errorMessage };
    }
  }, [requestEmailVerificationMutation]);
  
  // Verify email function
  const verifyEmail = useCallback(async (token: string): Promise<StatusResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await verifyEmailMutation({
        variables: { token }
      });
      
      // Update user data to reflect verified email
      if (data.verifyEmail.success && user) {
        const updatedUser = { ...user, isEmailVerified: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      setIsLoading(false);
      return { 
        success: data.verifyEmail.success, 
        message: data.verifyEmail.message 
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify email';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage, error: errorMessage };
    }
  }, [verifyEmailMutation, user]);
  
  // Get sessions list
  const getSessions = useCallback(async (): Promise<Session[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await getMySessionsQuery();
      
      setIsLoading(false);
      return data.mySessions || [];
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get sessions';
      setError(errorMessage);
      setIsLoading(false);
      return [];
    }
  }, [getMySessionsQuery]);
  
  // Validate reset token
  const validateResetToken = useCallback(async (token: string): Promise<StatusResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await validateResetTokenQuery({ variables: { token } });
      
      setIsLoading(false);
      return { 
        success: data.validateResetToken.success, 
        message: data.validateResetToken.message 
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate reset token';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage, error: errorMessage };
    }
  }, [validateResetTokenQuery]);
  
  // Return the public API of the hook
  return {
    user,
    login,
    register,
    logout,
    logoutAllSessions,
    logoutSession,
    verifyMFA,
    setupMFA,
    verifyMFASetup,
    disableMFA,
    getMFAStatus,
    requestPasswordReset,
    resetPassword,
    validateResetToken,
    changePassword,
    updateProfile,
    requestEmailVerification,
    verifyEmail,
    getMySessions: getSessions,
    isAuthenticated,
    authToken: safeLocalStorage.getItem('authToken'),
    getAuthToken: () => safeLocalStorage.getItem('authToken'),
    isLoading,
    authLoading: isLoading, // <-- alias for route protection
    error
  };

}

export default useAuth;
export { useAuth, MFAType };
export type { AuthUser, UserRole, Branch, UserBranch, AuthResponse, StatusResponse, VerificationResponse, MFASetupResponse, MFAStatusResponse, Session, RegisterInput, UpdateProfileInput };
