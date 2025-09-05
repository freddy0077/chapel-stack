/**
 * SSR Hydration Handler for Phase 2 Implementation
 * Handles proper Next.js 15 hydration without authentication flashes
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { AuthUser, AuthTokens } from "@/types/auth-enhanced.types";
import { authStorage } from "./auth-storage";
import { AuthUtils } from "./auth-reducer";

export interface HydrationState {
  isHydrated: boolean;
  isLoading: boolean;
  hasStoredAuth: boolean;
  user: AuthUser | null;
  tokens: AuthTokens | null;
  error: string | null;
}

/**
 * SSR Hydration Manager
 * Manages the hydration process to prevent authentication flashes
 */
export class SSRHydrationManager {
  private static instance: SSRHydrationManager;
  private hydrationPromise: Promise<HydrationState> | null = null;
  private isHydrating: boolean = false;

  static getInstance(): SSRHydrationManager {
    if (!SSRHydrationManager.instance) {
      SSRHydrationManager.instance = new SSRHydrationManager();
    }
    return SSRHydrationManager.instance;
  }

  /**
   * Perform hydration with deduplication
   */
  async hydrate(): Promise<HydrationState> {
    // Prevent multiple concurrent hydration attempts
    if (this.hydrationPromise) {
      return this.hydrationPromise;
    }

    this.isHydrating = true;
    this.hydrationPromise = this.performHydration();

    try {
      const result = await this.hydrationPromise;
      return result;
    } finally {
      this.isHydrating = false;
      this.hydrationPromise = null;
    }
  }

  /**
   * Perform actual hydration
   */
  private async performHydration(): Promise<HydrationState> {
    try {
      // Check if we're in the browser
      if (typeof window === "undefined") {
        return {
          isHydrated: false,
          isLoading: true,
          hasStoredAuth: false,
          user: null,
          tokens: null,
          error: null,
        };
      }

      // Small delay to ensure DOM is ready and prevent hydration mismatch
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Get stored authentication data
      const storedTokens = authStorage.getTokens();
      const storedUser = authStorage.getUser();

      return {
        hasTokens: !!storedTokens,
        hasUser: !!storedUser,
        sessionExpired: authStorage.isSessionExpired(),
        refreshExpired: authStorage.isRefreshTokenExpired(),
      };

      // Check if session is expired
      if (authStorage.isSessionExpired()) {
        authStorage.clear();

        return {
          isHydrated: true,
          isLoading: false,
          hasStoredAuth: false,
          user: null,
          tokens: null,
          error: null,
        };
      }

      // Check if refresh token is expired
      if (storedTokens && authStorage.isRefreshTokenExpired()) {
        authStorage.clear();

        return {
          isHydrated: true,
          isLoading: false,
          hasStoredAuth: false,
          user: null,
          tokens: null,
          error: null,
        };
      }

      // Validate stored data integrity
      if (storedTokens && !this.validateTokenIntegrity(storedTokens)) {
        authStorage.clear();

        return {
          isHydrated: true,
          isLoading: false,
          hasStoredAuth: false,
          user: null,
          tokens: null,
          error: "Invalid authentication data",
        };
      }

      if (storedUser && !this.validateUserIntegrity(storedUser)) {
        authStorage.clear();

        return {
          isHydrated: true,
          isLoading: false,
          hasStoredAuth: false,
          user: null,
          tokens: null,
          error: "Invalid user data",
        };
      }

      return {
        isHydrated: true,
        isLoading: false,
        hasStoredAuth: !!(storedTokens && storedUser),
        user: storedUser,
        tokens: storedTokens,
        error: null,
      };
    } catch (error) {
      console.error("❌ SSR hydration failed:", error);

      return {
        isHydrated: true,
        isLoading: false,
        hasStoredAuth: false,
        user: null,
        tokens: null,
        error: "Hydration failed",
      };
    }
  }

  /**
   * Validate token data integrity
   */
  private validateTokenIntegrity(tokens: AuthTokens): boolean {
    try {
      // Check required fields
      if (!tokens.accessToken || !tokens.expiresAt) {
        return false;
      }

      // Validate token format (basic JWT structure check)
      const tokenParts = tokens.accessToken.split(".");
      if (tokenParts.length !== 3) {
        return false;
      }

      // Check if token is not obviously expired
      if (tokens.expiresAt < Date.now()) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate user data integrity
   */
  private validateUserIntegrity(user: AuthUser): boolean {
    try {
      // Check required fields
      if (!user.id || !user.email || !user.primaryRole) {
        return false;
      }

      // Validate email format
      if (!AuthUtils.isValidEmail(user.email)) {
        return false;
      }

      // Check if roles array exists and is valid
      if (!Array.isArray(user.roles) || user.roles.length === 0) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if currently hydrating
   */
  isCurrentlyHydrating(): boolean {
    return this.isHydrating;
  }

  /**
   * Reset hydration state (for testing or forced re-hydration)
   */
  reset(): void {
    this.hydrationPromise = null;
    this.isHydrating = false;
  }
}

/**
 * React hook for SSR hydration
 */
export function useSSRHydration(): HydrationState & {
  rehydrate: () => Promise<void>;
} {
  const [hydrationState, setHydrationState] = useState<HydrationState>({
    isHydrated: false,
    isLoading: true,
    hasStoredAuth: false,
    user: null,
    tokens: null,
    error: null,
  });

  const hydrationManager = SSRHydrationManager.getInstance();

  const performHydration = useCallback(async () => {
    try {
      const result = await hydrationManager.hydrate();
      setHydrationState(result);
    } catch (error) {
      console.error("Hydration hook error:", error);
      setHydrationState({
        isHydrated: true,
        isLoading: false,
        hasStoredAuth: false,
        user: null,
        tokens: null,
        error: "Hydration failed",
      });
    }
  }, [hydrationManager]);

  const rehydrate = useCallback(async () => {
    hydrationManager.reset();
    setHydrationState((prev) => ({
      ...prev,
      isLoading: true,
      isHydrated: false,
    }));
    await performHydration();
  }, [hydrationManager, performHydration]);

  useEffect(() => {
    performHydration();
  }, [performHydration]);

  return {
    ...hydrationState,
    rehydrate,
  };
}

/**
 * Higher-order component for SSR hydration protection
 */
export function withSSRHydration<T extends object>(
  Component: React.ComponentType<T>,
): React.ComponentType<T> {
  return function SSRHydratedComponent(props: T) {
    const { isHydrated, isLoading } = useSSRHydration();

    // Show loading state during hydration
    if (!isHydrated || isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

/**
 * SSR-safe authentication checker
 */
export function useSSRSafeAuth(): {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isHydrated: boolean;
  isLoading: boolean;
} {
  const { isHydrated, isLoading, hasStoredAuth, user } = useSSRHydration();

  return {
    isAuthenticated: isHydrated && hasStoredAuth,
    user: isHydrated ? user : null,
    isHydrated,
    isLoading,
  };
}

/**
 * Hydration utilities
 */
export const HydrationUtils = {
  /**
   * Check if we're in a browser environment
   */
  isBrowser(): boolean {
    return typeof window !== "undefined";
  },

  /**
   * Check if DOM is ready
   */
  isDOMReady(): boolean {
    if (!this.isBrowser()) return false;
    return (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    );
  },

  /**
   * Wait for DOM to be ready
   */
  async waitForDOM(): Promise<void> {
    if (!this.isBrowser()) return;

    if (this.isDOMReady()) return;

    return new Promise((resolve) => {
      const checkReady = () => {
        if (this.isDOMReady()) {
          resolve();
        } else {
          setTimeout(checkReady, 10);
        }
      };
      checkReady();
    });
  },

  /**
   * Prevent hydration mismatch by ensuring client-server consistency
   */
  async preventHydrationMismatch(): Promise<void> {
    if (!this.isBrowser()) return;

    // Wait for DOM to be ready
    await this.waitForDOM();

    // Small delay to ensure React hydration is complete
    await new Promise((resolve) => setTimeout(resolve, 100));
  },

  /**
   * Safe localStorage access that won't throw during SSR
   */
  safeLocalStorageAccess<T>(
    key: string,
    defaultValue: T,
    parser?: (value: string) => T,
  ): T {
    if (!this.isBrowser()) return defaultValue;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;

      return parser ? parser(item) : JSON.parse(item);
    } catch {
      return defaultValue;
    }
  },

  /**
   * Safe sessionStorage access that won't throw during SSR
   */
  safeSessionStorageAccess<T>(
    key: string,
    defaultValue: T,
    parser?: (value: string) => T,
  ): T {
    if (!this.isBrowser()) return defaultValue;

    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue;

      return parser ? parser(item) : JSON.parse(item);
    } catch {
      return defaultValue;
    }
  },

  /**
   * Create a hydration-safe initial state
   */
  createHydrationSafeState<T>(clientState: () => T, serverState: T): T {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
      setIsHydrated(true);
    }, []);

    return isHydrated ? clientState() : serverState;
  },
};

// Export singleton instance
export const ssrHydrationManager = SSRHydrationManager.getInstance();
