/**
 * Enhanced Authentication Reducer for Phase 2 Implementation
 * Manages authentication state with proper immutability and type safety
 */

import {
  AuthState,
  AuthAction,
  AuthActionType,
  AuthUser,
  AuthTokens,
  AuthError,
} from "@/types/auth-enhanced.types";

export const initialAuthState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  isHydrated: false,
  isRefreshing: false,
  error: null,
  sessionId: undefined,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AuthActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: action.payload ? null : state.error, // Clear error when starting to load
      };

    case AuthActionType.SET_HYDRATED:
      return {
        ...state,
        isHydrated: true,
        isLoading: false,
      };

    case AuthActionType.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };

    case AuthActionType.SET_TOKENS:
      return {
        ...state,
        tokens: action.payload,
        isAuthenticated: !!action.payload,
        error: null,
      };

    case AuthActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isRefreshing: false,
      };

    case AuthActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AuthActionType.SET_REFRESHING:
      return {
        ...state,
        isRefreshing: action.payload,
        error: action.payload ? null : state.error, // Clear error when starting refresh
      };

    case AuthActionType.UPDATE_USER:
      if (!state.user) return state;

      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
        error: null,
      };

    case AuthActionType.LOGOUT:
      return {
        ...initialAuthState,
        isHydrated: state.isHydrated, // Preserve hydration state
      };

    default:
      return state;
  }
}

/**
 * Authentication Utilities
 */

export class AuthUtils {
  /**
   * Check if token is expired or will expire soon
   */
  static isTokenExpired(
    expiresAt: number,
    thresholdMinutes: number = 5,
  ): boolean {
    const now = Date.now();
    const threshold = thresholdMinutes * 60 * 1000; // Convert to milliseconds
    return expiresAt - now <= threshold;
  }

  /**
   * Check if refresh token is expired
   */
  static isRefreshTokenExpired(refreshExpiresAt?: number): boolean {
    if (!refreshExpiresAt) return true;
    return Date.now() >= refreshExpiresAt;
  }

  /**
   * Calculate token expiry from JWT
   */
  static getTokenExpiry(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch {
      return Date.now(); // Treat as expired if can't parse
    }
  }

  /**
   * Create auth error object
   */
  static createAuthError(
    code: string,
    message: string,
    details?: any,
    recoverable: boolean = true,
  ): AuthError {
    return {
      code,
      message,
      details,
      timestamp: Date.now(),
      recoverable,
    };
  }

  /**
   * Generate session ID
   */
  static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitize user data for storage
   */
  static sanitizeUserData(user: AuthUser): AuthUser {
    // Remove sensitive data that shouldn't be stored in localStorage
    const { ...sanitizedUser } = user;
    return sanitizedUser;
  }

  /**
   * Check if user has specific role
   */
  static hasRole(user: AuthUser | null, role: string): boolean {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(user: AuthUser | null, permission: string): boolean {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }

  /**
   * Get user's primary role
   */
  static getPrimaryRole(user: AuthUser | null): string | null {
    if (!user) return null;
    return user.primaryRole || (user.roles && user.roles[0]) || null;
  }

  /**
   * Check if session is active based on last activity
   */
  static isSessionActive(
    lastActivity: number,
    timeoutMinutes: number,
  ): boolean {
    const now = Date.now();
    const timeout = timeoutMinutes * 60 * 1000; // Convert to milliseconds
    return now - lastActivity < timeout;
  }

  /**
   * Format auth error for user display
   */
  static formatErrorMessage(error: AuthError): string {
    const errorMessages: Record<string, string> = {
      INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
      ACCOUNT_LOCKED:
        "Your account has been temporarily locked. Please contact support.",
      EMAIL_NOT_VERIFIED: "Please verify your email address before logging in.",
      TOKEN_EXPIRED: "Your session has expired. Please log in again.",
      NETWORK_ERROR:
        "Unable to connect to the server. Please check your internet connection.",
      SERVER_ERROR: "A server error occurred. Please try again later.",
      MFA_REQUIRED: "Multi-factor authentication is required.",
      INVALID_MFA_CODE: "Invalid verification code. Please try again.",
      RATE_LIMITED: "Too many attempts. Please wait before trying again.",
    };

    return (
      errorMessages[error.code] ||
      error.message ||
      "An unexpected error occurred."
    );
  }

  /**
   * Determine if error is recoverable
   */
  static isRecoverableError(error: AuthError): boolean {
    const nonRecoverableErrors = [
      "ACCOUNT_DELETED",
      "ACCOUNT_SUSPENDED",
      "INVALID_CLIENT",
      "UNAUTHORIZED_CLIENT",
    ];

    return !nonRecoverableErrors.includes(error.code);
  }
}

/**
 * Authentication Event Emitter for multi-tab synchronization
 */
export class AuthEventEmitter {
  private static instance: AuthEventEmitter;
  private listeners: Map<string, Function[]> = new Map();

  static getInstance(): AuthEventEmitter {
    if (!AuthEventEmitter.instance) {
      AuthEventEmitter.instance = new AuthEventEmitter();
    }
    return AuthEventEmitter.instance;
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  // Browser storage event handling for multi-tab sync
  setupStorageSync(): void {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (event) => {
        if (event.key?.startsWith("chapel_")) {
          this.emit("storage_change", {
            key: event.key,
            oldValue: event.oldValue,
            newValue: event.newValue,
          });
        }
      });
    }
  }
}
