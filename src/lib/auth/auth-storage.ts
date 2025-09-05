/**
 * Secure Authentication Storage Utilities for Phase 2 Implementation
 * Handles secure token storage, cookie management, and multi-tab synchronization
 */

import {
  AuthTokens,
  AuthUser,
  STORAGE_KEYS,
  COOKIE_NAMES,
  AuthConfig,
  DEFAULT_AUTH_CONFIG,
} from "@/types/auth-enhanced.types";
import { AuthUtils } from "./auth-reducer";

/**
 * Secure Storage Manager
 * Handles localStorage, sessionStorage, and secure cookies
 */
export class AuthStorage {
  private config: AuthConfig;

  constructor(config: Partial<AuthConfig> = {}) {
    this.config = { ...DEFAULT_AUTH_CONFIG, ...config };
  }

  /**
   * Store authentication tokens securely
   */
  setTokens(tokens: AuthTokens, rememberMe: boolean = false): void {
    try {
      if (typeof window === "undefined") return;

      // Store access token in localStorage for client-side access
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);

      // Store refresh token in secure HTTP-only cookie (handled by server)
      // For now, store in localStorage but mark for cookie migration
      if (tokens.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      }

      // Store token metadata
      const tokenMetadata = {
        expiresAt: tokens.expiresAt,
        refreshExpiresAt: tokens.refreshExpiresAt,
        rememberMe,
        storedAt: Date.now(),
      };
      localStorage.setItem(
        "chapel_token_metadata",
        JSON.stringify(tokenMetadata),
      );

      // Set secure cookies for SSR and middleware access
      this.setSecureCookie(COOKIE_NAMES.ACCESS_TOKEN, tokens.accessToken, {
        maxAge: rememberMe
          ? this.config.rememberMeDuration * 24 * 60 * 60
          : undefined,
        httpOnly: false, // Needs to be accessible by client for GraphQL
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Store remember me preference
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe.toString());

      // Update last activity
      this.updateLastActivity();
    } catch (error) {
      console.error("Failed to store authentication tokens:", error);
    }
  }

  /**
   * Retrieve authentication tokens
   */
  getTokens(): AuthTokens | null {
    try {
      if (typeof window === "undefined") return null;

      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const metadataStr = localStorage.getItem("chapel_token_metadata");

      if (!accessToken) return null;

      let metadata = null;
      try {
        metadata = metadataStr ? JSON.parse(metadataStr) : null;
      } catch {
        // Invalid metadata, treat as no tokens
        return null;
      }

      return {
        accessToken,
        refreshToken: refreshToken || undefined,
        expiresAt: metadata?.expiresAt || AuthUtils.getTokenExpiry(accessToken),
        refreshExpiresAt: metadata?.refreshExpiresAt,
      };
    } catch (error) {
      console.error("Failed to retrieve authentication tokens:", error);
      return null;
    }
  }

  /**
   * Store user data securely
   */
  setUser(user: AuthUser): void {
    try {
      if (typeof window === "undefined") return;

      const sanitizedUser = AuthUtils.sanitizeUserData(user);
      localStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(sanitizedUser),
      );

      // Update last activity
      this.updateLastActivity();
    } catch (error) {
      console.error("Failed to store user data:", error);
    }
  }

  /**
   * Retrieve user data
   */
  getUser(): AuthUser | null {
    try {
      if (typeof window === "undefined") return null;

      const userDataStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!userDataStr) return null;

      return JSON.parse(userDataStr);
    } catch (error) {
      console.error("Failed to retrieve user data:", error);
      return null;
    }
  }

  /**
   * Store session ID
   */
  setSessionId(sessionId: string): void {
    try {
      if (typeof window === "undefined") return;

      localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);

      // Also set as cookie for server-side access
      this.setSecureCookie(COOKIE_NAMES.SESSION_ID, sessionId, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    } catch (error) {
      console.error("Failed to store session ID:", error);
    }
  }

  /**
   * Get session ID
   */
  getSessionId(): string | null {
    try {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(STORAGE_KEYS.SESSION_ID);
    } catch (error) {
      console.error("Failed to retrieve session ID:", error);
      return null;
    }
  }

  /**
   * Update last activity timestamp
   */
  updateLastActivity(): void {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
    } catch (error) {
      console.error("Failed to update last activity:", error);
    }
  }

  /**
   * Get last activity timestamp
   */
  getLastActivity(): number {
    try {
      if (typeof window === "undefined") return Date.now();

      const lastActivity = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
      return lastActivity ? parseInt(lastActivity, 10) : Date.now();
    } catch (error) {
      console.error("Failed to retrieve last activity:", error);
      return Date.now();
    }
  }

  /**
   * Check if remember me is enabled
   */
  getRememberMe(): boolean {
    try {
      if (typeof window === "undefined") return false;

      const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
      return rememberMe === "true";
    } catch (error) {
      console.error("Failed to retrieve remember me preference:", error);
      return false;
    }
  }

  /**
   * Clear all authentication data
   */
  clear(): void {
    try {
      if (typeof window === "undefined") return;

      // Clear localStorage
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      localStorage.removeItem("chapel_token_metadata");

      // Clear cookies
      Object.values(COOKIE_NAMES).forEach((cookieName) => {
        this.deleteCookie(cookieName);
      });
    } catch (error) {
      console.error("Failed to clear authentication data:", error);
    }
  }

  /**
   * Set secure cookie
   */
  private setSecureCookie(
    name: string,
    value: string,
    options: {
      maxAge?: number;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "strict" | "lax" | "none";
      path?: string;
    } = {},
  ): void {
    try {
      if (typeof document === "undefined") return;

      const {
        maxAge,
        httpOnly = false,
        secure = process.env.NODE_ENV === "production",
        sameSite = "strict",
        path = "/",
      } = options;

      let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}`;

      if (maxAge) {
        cookieString += `; max-age=${maxAge}`;
      }

      if (httpOnly) {
        cookieString += "; HttpOnly";
      }

      if (secure) {
        cookieString += "; Secure";
      }

      cookieString += `; SameSite=${sameSite}`;

      document.cookie = cookieString;
    } catch (error) {
      console.error("Failed to set secure cookie:", error);
    }
  }

  /**
   * Delete cookie
   */
  private deleteCookie(name: string, path: string = "/"): void {
    try {
      if (typeof document === "undefined") return;
      document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } catch (error) {
      console.error("Failed to delete cookie:", error);
    }
  }

  /**
   * Check if session is expired based on inactivity
   */
  isSessionExpired(): boolean {
    const lastActivity = this.getLastActivity();
    return !AuthUtils.isSessionActive(lastActivity, this.config.sessionTimeout);
  }

  /**
   * Check if tokens need refresh
   */
  needsTokenRefresh(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return false;

    return AuthUtils.isTokenExpired(
      tokens.expiresAt,
      this.config.tokenRefreshThreshold,
    );
  }

  /**
   * Check if refresh token is expired
   */
  isRefreshTokenExpired(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return true;

    return AuthUtils.isRefreshTokenExpired(tokens.refreshExpiresAt);
  }

  /**
   * Get storage info for debugging
   */
  getStorageInfo(): {
    hasTokens: boolean;
    hasUser: boolean;
    hasSessionId: boolean;
    lastActivity: number;
    rememberMe: boolean;
    sessionExpired: boolean;
    needsRefresh: boolean;
    refreshExpired: boolean;
  } {
    return {
      hasTokens: !!this.getTokens(),
      hasUser: !!this.getUser(),
      hasSessionId: !!this.getSessionId(),
      lastActivity: this.getLastActivity(),
      rememberMe: this.getRememberMe(),
      sessionExpired: this.isSessionExpired(),
      needsRefresh: this.needsTokenRefresh(),
      refreshExpired: this.isRefreshTokenExpired(),
    };
  }
}

/**
 * Multi-tab synchronization manager
 */
export class MultiTabSync {
  private static instance: MultiTabSync;
  private listeners: Map<string, Function[]> = new Map();
  private storage: AuthStorage;

  constructor(storage: AuthStorage) {
    this.storage = storage;
    this.setupStorageListener();
  }

  static getInstance(storage: AuthStorage): MultiTabSync {
    if (!MultiTabSync.instance) {
      MultiTabSync.instance = new MultiTabSync(storage);
    }
    return MultiTabSync.instance;
  }

  /**
   * Setup storage event listener for cross-tab communication
   */
  private setupStorageListener(): void {
    if (typeof window === "undefined") return;

    window.addEventListener("storage", (event) => {
      if (!event.key?.startsWith("chapel_")) return;

      // Handle different storage events
      switch (event.key) {
        case STORAGE_KEYS.ACCESS_TOKEN:
          this.emit("token_changed", {
            oldValue: event.oldValue,
            newValue: event.newValue,
          });
          break;

        case STORAGE_KEYS.USER_DATA:
          this.emit("user_changed", {
            oldValue: event.oldValue ? JSON.parse(event.oldValue) : null,
            newValue: event.newValue ? JSON.parse(event.newValue) : null,
          });
          break;

        case STORAGE_KEYS.LAST_ACTIVITY:
          this.emit("activity_updated", {
            timestamp: event.newValue
              ? parseInt(event.newValue, 10)
              : Date.now(),
          });
          break;

        default:
          this.emit("storage_changed", {
            key: event.key,
            oldValue: event.oldValue,
            newValue: event.newValue,
          });
      }
    });
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error("Error in multi-tab sync listener:", error);
        }
      });
    }
  }

  /**
   * Broadcast logout to all tabs
   */
  broadcastLogout(): void {
    if (typeof window === "undefined") return;

    // Trigger storage event by temporarily setting and removing a value
    localStorage.setItem("chapel_logout_broadcast", Date.now().toString());
    localStorage.removeItem("chapel_logout_broadcast");
  }

  /**
   * Broadcast login to all tabs
   */
  broadcastLogin(user: AuthUser): void {
    if (typeof window === "undefined") return;

    // This will trigger the storage event listener in other tabs
    this.storage.setUser(user);
  }
}

// Export singleton instance
export const authStorage = new AuthStorage();
export const multiTabSync = MultiTabSync.getInstance(authStorage);
