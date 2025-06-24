'use client';

import { useState, useCallback, useEffect } from 'react';
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

// Types and interfaces for auth functionality
enum MFAType {
  APP = 'APP',
  SMS = 'SMS',
  EMAIL = 'EMAIL'
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr) as AuthUser;
        setUser(userData);
        setIsAuthenticated(true);
        
        // Set token expiry if it exists
        const expiryStr = localStorage.getItem('tokenExpiry');
        if (expiryStr) {
          setTokenExpiry(new Date(parseInt(expiryStr)));
        }
      } catch (e) {
        // Invalid user data in localStorage
        clearAuthData();
      }
    }
  }, []);
  
  // Helper function to store auth data
  const storeAuthData = useCallback((authResponse: AuthResponse, rememberMe = false) => {
    // Save token to localStorage
    localStorage.setItem('authToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    
    // Set expiry time (default to 1 hour from now)
    const expiryTime = Date.now() + (60 * 60 * 1000); // 1 hour from now
    localStorage.setItem('tokenExpiry', expiryTime.toString());
    
    // Update state
    setTokenExpiry(new Date(expiryTime));
    setUser(authResponse.user);
    setIsAuthenticated(true);

    // Cookie for additional security (accessible only via HTTP requests, not JavaScript)
    if (rememberMe) {
      // Longer expiry for 'remember me' - 30 days
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      Cookies.set('refreshToken', authResponse.refreshToken, { 
        expires: new Date(Date.now() + thirtyDays),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    } else {
      // Session cookie that expires when browser is closed
      Cookies.set('refreshToken', authResponse.refreshToken, { 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict' 
      });
    }
    
    // Save user data
    if (authResponse.user) {
      localStorage.setItem('user', JSON.stringify(authResponse.user));
    }
  }, []);
  
  // Clear all authentication data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('currentSessionId');
    
    // Remove cookies
    Cookies.remove('refreshToken', { path: '/' });
    
    // Reset state
    setTokenExpiry(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);
  
  // Login function
  const login = useCallback(async (email: string, password: string, rememberMe = false): Promise<{ success: boolean; requiresMFA?: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await loginMutation({
        variables: { input: { email, password } }
      });
      
      if (data.login.requiresMFA) {
        setIsLoading(false);
        return { success: true, requiresMFA: true };
      }
      
      // Store auth data
      storeAuthData(data.login, rememberMe);
      
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [loginMutation, storeAuthData]);
  
  // Register function
  const register = useCallback(async (input: RegisterInput): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await registerMutation({
        variables: { input }
      });
      
      setIsLoading(false);
      return { success: true };
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
      if (localStorage.getItem('currentSessionId') === sessionId) {
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
  }, [logoutMutation, clearAuthData, client]);
  
  // Track token expiration time
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
  
  // Refresh auth token
  const refreshAuthToken = useCallback(async (): Promise<string | null> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const { data } = await refreshTokenMutation();
      
      if (!data || !data.refreshToken) {
        throw new Error('Invalid response from token refresh');
      }
      
      // Store new tokens
      localStorage.setItem('authToken', data.refreshToken.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken.refreshToken);
      
      // Update expiry time (1 hour from now)
      const expiryTime = Date.now() + 60 * 60 * 1000;
      localStorage.setItem('tokenExpiry', expiryTime.toString());
      setTokenExpiry(new Date(expiryTime));
      
      // Set cookie for refresh token
      Cookies.set('refreshToken', data.refreshToken.refreshToken, {
        expires: 30,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      return data.refreshToken.accessToken;
    } catch (err: unknown) {
      // Clear auth data on error
      clearAuthData();
      await client.resetStore();
      
      const errorMessage = err instanceof Error ? err.message : 'Token refresh failed';
      setError(errorMessage);
      return null;
    }
  }, [refreshTokenMutation, client, clearAuthData]);
  
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
        localStorage.setItem('user', JSON.stringify(data.updateProfile));
        setUser(data.updateProfile);
      }
      
      setIsLoading(false);
      return { success: true, user: data.updateProfile };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [updateProfileMutation]);
  
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
  
  // Effect to refresh token before it expires
  useEffect(() => {
    const checkTokenExpiration = () => {
      const expiryStr = localStorage.getItem('tokenExpiry');
      if (!expiryStr) return;
      
      const expiryDate = new Date(parseInt(expiryStr));
      const now = new Date();
      
      // If token expires in less than 5 minutes, refresh it
      const fiveMinutes = 5 * 60 * 1000;
      if (expiryDate.getTime() - now.getTime() < fiveMinutes) {
        refreshAuthToken().catch(() => {
          // If refresh fails, redirect to login
          clearAuthData();
          router.push('/auth/login');
        });
      }
    };
    
    // Check immediately and then every minute
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000);
    
    return () => clearInterval(interval);
  }, [refreshAuthToken, router, clearAuthData]);
  
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
    authToken: localStorage.getItem('authToken'),
    getAuthToken: () => localStorage.getItem('authToken'),
    isLoading,
    error
  };
}

export default useAuth;
export { MFAType };
