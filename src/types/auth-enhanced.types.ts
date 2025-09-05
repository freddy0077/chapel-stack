/**
 * Enhanced Authentication Types for Phase 2 Implementation
 * Modern, type-safe authentication system with comprehensive state management
 */

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  organisationId: string;
  roles: string[];
  userBranches: UserBranch[];
  member?: Member;
  primaryRole: string;
  branch?: Branch | null;
  permissions?: string[];
}

export interface UserBranch {
  branch: Branch;
  role: Role;
}

export interface Branch {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  status: string;
  memberId?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  refreshExpiresAt?: number;
}

export interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  isRefreshing: boolean;
  error: AuthError | null;
  sessionId?: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  recoverable: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  tokens?: AuthTokens;
  error?: AuthError;
  requiresMFA?: boolean;
  mfaToken?: string;
}

export interface RefreshResult {
  success: boolean;
  tokens?: AuthTokens;
  error?: AuthError;
}

export interface AuthContextType {
  // State
  state: AuthState;

  // Core Authentication Actions
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  logout: (options?: LogoutOptions) => Promise<void>;
  refreshToken: () => Promise<RefreshResult>;

  // User Management
  updateUser: (updates: Partial<AuthUser>) => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;

  // Password Management
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<boolean>;

  // MFA Management
  enableMFA: () => Promise<{ qrCode: string; backupCodes: string[] }>;
  disableMFA: (password: string) => Promise<boolean>;
  verifyMFA: (token: string, mfaCode: string) => Promise<LoginResult>;

  // Session Management
  clearError: () => void;
  checkSession: () => Promise<boolean>;

  // Role & Permission Checks
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  canAccessRoute: (route: string) => boolean;
  canAccessDashboard: (dashboard: string) => boolean;

  // Navigation Helpers
  getPrimaryRole: () => string | null;
  getAllowedDashboards: () => string[];
  getDefaultDashboard: () => string | null;
  getDefaultRoute: () => string;
}

export interface LogoutOptions {
  everywhere?: boolean; // Logout from all devices
  redirect?: string; // Custom redirect URL
}

export interface AuthConfig {
  tokenRefreshThreshold: number; // Minutes before expiry to refresh
  maxRefreshAttempts: number;
  sessionTimeout: number; // Minutes
  rememberMeDuration: number; // Days
  enableAutoRefresh: boolean;
  enableMultiTabSync: boolean;
  apiBaseUrl: string;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  config?: Partial<AuthConfig>;
}

// Action Types for Auth Reducer
export enum AuthActionType {
  SET_LOADING = "SET_LOADING",
  SET_HYDRATED = "SET_HYDRATED",
  SET_USER = "SET_USER",
  SET_TOKENS = "SET_TOKENS",
  SET_ERROR = "SET_ERROR",
  CLEAR_ERROR = "CLEAR_ERROR",
  SET_REFRESHING = "SET_REFRESHING",
  LOGOUT = "LOGOUT",
  UPDATE_USER = "UPDATE_USER",
}

export interface AuthAction {
  type: AuthActionType;
  payload?: any;
}

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "chapel_access_token",
  REFRESH_TOKEN: "chapel_refresh_token",
  USER_DATA: "chapel_user_data",
  SESSION_ID: "chapel_session_id",
  REMEMBER_ME: "chapel_remember_me",
  LAST_ACTIVITY: "chapel_last_activity",
} as const;

// Cookie Names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: "chapel_auth_token",
  REFRESH_TOKEN: "chapel_refresh_token",
  SESSION_ID: "chapel_session_id",
} as const;

// Default Configuration
export const DEFAULT_AUTH_CONFIG: AuthConfig = {
  tokenRefreshThreshold: 5, // 5 minutes before expiry
  maxRefreshAttempts: 3,
  sessionTimeout: 480, // 8 hours
  rememberMeDuration: 30, // 30 days
  enableAutoRefresh: true,
  enableMultiTabSync: true,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
};
