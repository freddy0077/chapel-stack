/**
 * Enhanced Authentication Context for Phase 2 Implementation
 * Modern, robust authentication system with automatic token refresh,
 * proper SSR hydration, and comprehensive state management
 */

'use client';

import React, { 
  createContext, 
  useContext, 
  useReducer, 
  useEffect, 
  useCallback, 
  useRef,
  ReactNode 
} from 'react';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client';

import {
  AuthContextType,
  AuthProviderProps,
  AuthState,
  AuthUser,
  AuthTokens,
  LoginCredentials,
  LoginResult,
  RefreshResult,
  LogoutOptions,
  AuthConfig,
  DEFAULT_AUTH_CONFIG,
  AuthActionType,
} from '@/types/auth-enhanced.types';

import { 
  authReducer, 
  initialAuthState, 
  AuthUtils, 
  AuthEventEmitter 
} from '@/lib/auth/auth-reducer';

import { 
  AuthStorage, 
  MultiTabSync, 
  authStorage, 
  multiTabSync 
} from '@/lib/auth/auth-storage';

import { AuthApiService } from '@/lib/auth/auth-api';
import { getRoleConfig, canAccessRoute, canAccessDashboard } from '@/config/role-dashboard.config';

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Enhanced Authentication Provider
 */
export function AuthProvider({ children, config = {} }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const router = useRouter();
  const apolloClient = useApolloClient();
  
  // Configuration
  const authConfig: AuthConfig = { ...DEFAULT_AUTH_CONFIG, ...config };
  
  // Services
  const authApiRef = useRef<AuthApiService>();
  const storageRef = useRef<AuthStorage>();
  const multiTabSyncRef = useRef<MultiTabSync>();
  const refreshIntervalRef = useRef<NodeJS.Timeout>();
  const activityIntervalRef = useRef<NodeJS.Timeout>();
  
  // Initialize services
  if (!authApiRef.current) {
    authApiRef.current = new AuthApiService(apolloClient, authConfig);
  }
  if (!storageRef.current) {
    storageRef.current = new AuthStorage(authConfig);
  }
  if (!multiTabSyncRef.current && authConfig.enableMultiTabSync) {
    multiTabSyncRef.current = MultiTabSync.getInstance(storageRef.current);
  }

  const authApi = authApiRef.current;
  const storage = storageRef.current;
  const multiTab = multiTabSyncRef.current;

  /**
   * Initialize authentication state from storage
   */
  const initializeAuth = useCallback(async () => {
    try {
      dispatch({ type: AuthActionType.SET_LOADING, payload: true });

      // Check if session is expired due to inactivity
      if (storage.isSessionExpired()) {
        await handleLogout({ redirect: '/auth/login' });
        return;
      }

      const storedTokens = storage.getTokens();
      const storedUser = storage.getUser();
      const sessionId = storage.getSessionId() || AuthUtils.generateSessionId();

      // Debug: Check localStorage directly
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('chapel_access_token');
        const refreshToken = localStorage.getItem('chapel_refresh_token');
        const userData = localStorage.getItem('chapel_user_data');
      }

      // If no tokens, user is not authenticated
      if (!storedTokens) {
        dispatch({ type: AuthActionType.SET_HYDRATED });
        return;
      }

      // Check if refresh token is expired
      if (storage.isRefreshTokenExpired()) {
        // Debug: Check token expiry details
        const tokens = storage.getTokens();
        if (tokens) {
        }
        
        storage.clear();
        dispatch({ type: AuthActionType.LOGOUT });
        dispatch({ type: AuthActionType.SET_HYDRATED });
        return;
      }

      // Set stored data in state
      if (storedUser) {
        dispatch({ type: AuthActionType.SET_USER, payload: storedUser });
      }
      if (storedTokens) {
        dispatch({ type: AuthActionType.SET_TOKENS, payload: storedTokens });
      }

      // Store session ID if not exists
      if (!storage.getSessionId()) {
        storage.setSessionId(sessionId);
      }

      // Check if token needs refresh
      if (storage.needsTokenRefresh()) {
        const refreshResult = await handleTokenRefresh();
        
        if (!refreshResult.success) {
          storage.clear();
          dispatch({ type: AuthActionType.LOGOUT });
          dispatch({ type: AuthActionType.SET_HYDRATED });
          return;
        }
      }

      // Verify current user data with server
      if (authConfig.enableAutoRefresh && storedTokens) {
        try {
          const { user: currentUser, error } = await authApi.getCurrentUser();
          
          if (error) {
            if (!error.recoverable) {
              storage.clear();
              dispatch({ type: AuthActionType.LOGOUT });
            }
          } else if (currentUser) {
            // Update user data if different
            if (JSON.stringify(currentUser) !== JSON.stringify(storedUser)) {
              dispatch({ type: AuthActionType.SET_USER, payload: currentUser });
              storage.setUser(currentUser);
            }
          }
        } catch (error) {
        }
      }

      dispatch({ type: AuthActionType.SET_HYDRATED });

    } catch (error) {
      dispatch({ 
        type: AuthActionType.SET_ERROR, 
        payload: AuthUtils.createAuthError(
          'INIT_ERROR',
          'Failed to initialize authentication',
          error
        )
      });
      dispatch({ type: AuthActionType.SET_HYDRATED });
    }
  }, [authApi, storage, authConfig.enableAutoRefresh]);

  /**
   * Handle token refresh
   */
  const handleTokenRefresh = useCallback(async (): Promise<RefreshResult> => {
    try {
      dispatch({ type: AuthActionType.SET_REFRESHING, payload: true });
      
      const result = await authApi.refreshToken();
      
      if (result.success && result.tokens) {
        // Update stored tokens
        const rememberMe = storage.getRememberMe();
        storage.setTokens(result.tokens, rememberMe);
        
        // Update state
        dispatch({ type: AuthActionType.SET_TOKENS, payload: result.tokens });
        
        // Reset API refresh attempts
        authApi.resetRefreshAttempts();
      } else {
        dispatch({ type: AuthActionType.SET_ERROR, payload: result.error });
      }
      
      dispatch({ type: AuthActionType.SET_REFRESHING, payload: false });
      return result;
      
    } catch (error) {
      const authError = AuthUtils.createAuthError(
        'REFRESH_ERROR',
        'Failed to refresh authentication token',
        error
      );
      
      dispatch({ type: AuthActionType.SET_ERROR, payload: authError });
      dispatch({ type: AuthActionType.SET_REFRESHING, payload: false });
      
      return { success: false, error: authError };
    }
  }, [authApi, storage]);

  /**
   * Handle login
   */
  const handleLogin = useCallback(async (credentials: LoginCredentials): Promise<LoginResult> => {
    try {
      dispatch({ type: AuthActionType.SET_LOADING, payload: true });
      dispatch({ type: AuthActionType.CLEAR_ERROR });

      const result = await authApi.login(credentials);

      if (result.success && result.user && result.tokens) {
        // Store authentication data
        const rememberMe = credentials.rememberMe || false;
        storage.setTokens(result.tokens, rememberMe);
        storage.setUser(result.user);
        storage.setSessionId(AuthUtils.generateSessionId());
        
        // Update state
        dispatch({ type: AuthActionType.SET_USER, payload: result.user });
        dispatch({ type: AuthActionType.SET_TOKENS, payload: result.tokens });

        // Broadcast login to other tabs
        if (multiTab) {
          multiTab.broadcastLogin(result.user);
        }

        // Setup automatic token refresh
        setupTokenRefresh();

      } else if (result.requiresMFA) {
        // MFA handling will be done by the calling component
      } else {
        dispatch({ type: AuthActionType.SET_ERROR, payload: result.error });
      }

      dispatch({ type: AuthActionType.SET_LOADING, payload: false });
      return result;

    } catch (error) {
      const authError = AuthUtils.createAuthError(
        'LOGIN_ERROR',
        'Login failed due to an unexpected error',
        error
      );
      
      dispatch({ type: AuthActionType.SET_ERROR, payload: authError });
      dispatch({ type: AuthActionType.SET_LOADING, payload: false });
      
      return { success: false, error: authError };
    }
  }, [authApi, storage, multiTab]); 

  /**
   * Handle logout
   */
  const handleLogout = useCallback(async (options: LogoutOptions = {}): Promise<void> => {
    try {
      dispatch({ type: AuthActionType.SET_LOADING, payload: true });

      // Call server logout
      await authApi.logout(options.everywhere);

      // Clear local storage
      storage.clear();

      // Clear state
      dispatch({ type: AuthActionType.LOGOUT });

      // Broadcast logout to other tabs
      if (multiTab) {
        multiTab.broadcastLogout();
      }

      // Clear refresh interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = undefined;
      }

      // Clear activity interval
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
        activityIntervalRef.current = undefined;
      }

      // Redirect if specified
      if (options.redirect) {
        router.replace(options.redirect);
      } else {
        router.replace('/auth/login');
      }

    } catch (error) {
      // Even if server logout fails, clear local data
      storage.clear();
      dispatch({ type: AuthActionType.LOGOUT });
      
      if (options.redirect) {
        router.replace(options.redirect);
      } else {
        router.replace('/auth/login');
      }
    } finally {
      dispatch({ type: AuthActionType.SET_LOADING, payload: false });
    }
  }, [authApi, storage, multiTab, router]);

  /**
   * Setup automatic token refresh
   */
  const setupTokenRefresh = useCallback(() => {
    if (!authConfig.enableAutoRefresh) return;

    // Clear existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    // Check for token refresh every minute
    refreshIntervalRef.current = setInterval(async () => {
      if (storage.needsTokenRefresh() && !state.isRefreshing) {
        await handleTokenRefresh();
      }
    }, 60 * 1000); // Check every minute

  }, [authConfig.enableAutoRefresh, storage, state.isRefreshing, handleTokenRefresh]);

  /**
   * Setup activity tracking
   */
  const setupActivityTracking = useCallback(() => {
    if (!authConfig.enableMultiTabSync) return;

    // Clear existing interval
    if (activityIntervalRef.current) {
      clearInterval(activityIntervalRef.current);
    }

    // Update activity every 30 seconds
    activityIntervalRef.current = setInterval(() => {
      if (state.isAuthenticated) {
        storage.updateLastActivity();
      }
    }, 30 * 1000);

    // Update activity on user interaction
    const updateActivity = () => {
      if (state.isAuthenticated) {
        storage.updateLastActivity();
      }
    };

    // Add event listeners for user activity
    if (typeof window !== 'undefined') {
      window.addEventListener('mousedown', updateActivity);
      window.addEventListener('keydown', updateActivity);
      window.addEventListener('scroll', updateActivity);
      window.addEventListener('touchstart', updateActivity);

      // Cleanup function
      return () => {
        window.removeEventListener('mousedown', updateActivity);
        window.removeEventListener('keydown', updateActivity);
        window.removeEventListener('scroll', updateActivity);
        window.removeEventListener('touchstart', updateActivity);
      };
    }
  }, [authConfig.enableMultiTabSync, state.isAuthenticated, storage]);

  /**
   * Setup multi-tab synchronization
   */
  const setupMultiTabSync = useCallback(() => {
    if (!multiTab) return;

    const handleTokenChanged = (data: any) => {
      if (!data.newValue && state.isAuthenticated) {
        // Token was removed, logout
        dispatch({ type: AuthActionType.LOGOUT });
      }
    };

    const handleUserChanged = (data: any) => {
      if (data.newValue && state.isAuthenticated) {
        // User data updated in another tab
        dispatch({ type: AuthActionType.SET_USER, payload: data.newValue });
      }
    };

    multiTab.on('token_changed', handleTokenChanged);
    multiTab.on('user_changed', handleUserChanged);

    return () => {
      multiTab.off('token_changed', handleTokenChanged);
      multiTab.off('user_changed', handleUserChanged);
    };
  }, [multiTab, state.isAuthenticated]);

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Setup token refresh when authenticated
  useEffect(() => {
    if (state.isAuthenticated && state.isHydrated) {
      setupTokenRefresh();
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [state.isAuthenticated, state.isHydrated]);

  // Setup activity tracking
  useEffect(() => {
    const cleanup = setupActivityTracking();
    return cleanup;
  }, [setupActivityTracking]);

  // Setup multi-tab sync
  useEffect(() => {
    const cleanup = setupMultiTabSync();
    return cleanup;
  }, [authApi, storage, multiTab]); 

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
      }
    };
  }, []);

  /**
   * Context value with all authentication methods
   */
  const contextValue: AuthContextType = {
    // State
    state,

    // Core Authentication Actions
    login: handleLogin,
    logout: handleLogout,
    refreshToken: handleTokenRefresh,

    // User Management
    updateUser: useCallback(async (updates: Partial<AuthUser>) => {
      if (state.user) {
        const updatedUser = { ...state.user, ...updates };
        dispatch({ type: AuthActionType.UPDATE_USER, payload: updates });
        storage.setUser(updatedUser);
      }
    }, [state.user, storage]),

    verifyEmail: useCallback(async (token: string) => {
      return await authApi.verifyEmail(token);
    }, [authApi]),

    // Password Management
    requestPasswordReset: useCallback(async (email: string) => {
      return await authApi.requestPasswordReset(email);
    }, [authApi]),

    resetPassword: useCallback(async (token: string, newPassword: string) => {
      return await authApi.resetPassword(token, newPassword);
    }, [authApi]),

    changePassword: useCallback(async (currentPassword: string, newPassword: string) => {
      return await authApi.changePassword(currentPassword, newPassword);
    }, [authApi]),

    // MFA Management
    enableMFA: useCallback(async () => {
      return await authApi.enableMFA();
    }, [authApi]),

    disableMFA: useCallback(async (password: string) => {
      return await authApi.disableMFA(password);
    }, [authApi]),

    verifyMFA: useCallback(async (token: string, mfaCode: string) => {
      const result = await authApi.verifyMFA(token, mfaCode);
      
      if (result.success && result.user && result.tokens) {
        // Store authentication data
        storage.setTokens(result.tokens, storage.getRememberMe());
        storage.setUser(result.user);
        
        // Update state
        dispatch({ type: AuthActionType.SET_USER, payload: result.user });
        dispatch({ type: AuthActionType.SET_TOKENS, payload: result.tokens });
        
        // Setup automatic token refresh
        setupTokenRefresh();
      }
      
      return result;
    }, [authApi, storage, setupTokenRefresh]),

    // Session Management
    clearError: useCallback(() => {
      dispatch({ type: AuthActionType.CLEAR_ERROR });
    }, []),

    checkSession: useCallback(async () => {
      if (!state.isAuthenticated) return false;
      
      // Check if session is expired
      if (storage.isSessionExpired()) {
        await handleLogout();
        return false;
      }
      
      return true;
    }, [state.isAuthenticated, storage, handleLogout]),

    // Role & Permission Checks
    hasRole: useCallback((role: string) => {
      return AuthUtils.hasRole(state.user, role);
    }, [state.user]),

    hasPermission: useCallback((permission: string) => {
      return AuthUtils.hasPermission(state.user, permission);
    }, [state.user]),

    canAccessRoute: useCallback((route: string) => {
      if (!state.user) return false;
      return canAccessRoute(route, state.user.primaryRole);
    }, [state.user]),

    canAccessDashboard: useCallback((dashboard: string) => {
      if (!state.user) return false;
      return canAccessDashboard(dashboard, state.user.primaryRole);
    }, [state.user]),

    // Navigation Helpers
    getPrimaryRole: useCallback(() => {
      return AuthUtils.getPrimaryRole(state.user);
    }, [state.user]),

    getAllowedDashboards: useCallback(() => {
      if (!state.user) return [];
      const roleConfig = getRoleConfig(state.user.primaryRole);
      return roleConfig?.allowedDashboards || [];
    }, [state.user]),

    getDefaultDashboard: useCallback(() => {
      if (!state.user) return null;
      const roleConfig = getRoleConfig(state.user.primaryRole);
      return roleConfig?.defaultDashboard || null;
    }, [state.user]),

    getDefaultRoute: useCallback(() => {
      if (!state.user) return '/auth/login';
      const roleConfig = getRoleConfig(state.user.primaryRole);
      return roleConfig?.defaultRoute || '/dashboard';
    }, [state.user]),
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Enhanced useAuth hook
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Hook for authentication state only (for performance)
 */
export function useAuthState() {
  const { state } = useAuth();
  return state;
}

/**
 * Hook for checking if user is authenticated
 */
export function useIsAuthenticated() {
  const { state } = useAuth();
  return state.isAuthenticated && state.isHydrated;
}

/**
 * Hook for getting current user
 */
export function useCurrentUser() {
  const { state } = useAuth();
  return state.user;
}

/**
 * Hook for role-based access control
 */
export function useRoleAccess() {
  const { hasRole, hasPermission, canAccessRoute, canAccessDashboard } = useAuth();
  
  return {
    hasRole,
    hasPermission,
    canAccessRoute,
    canAccessDashboard,
  };
}
