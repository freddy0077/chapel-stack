/**
 * Automatic Token Refresh Service for Phase 2 Implementation
 * Handles automatic token refresh with Apollo Client integration
 */

import {
  ApolloClient,
  NormalizedCacheObject,
  from,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import {
  AuthTokens,
  RefreshResult,
  AuthError,
  STORAGE_KEYS,
} from "@/types/auth-enhanced.types";
import { AuthUtils } from "./auth-reducer";
import { authStorage } from "./auth-storage";
import { AuthApiService } from "./auth-api";

/**
 * Token Refresh Manager
 * Handles automatic token refresh and Apollo Client integration
 */
export class TokenRefreshManager {
  private static instance: TokenRefreshManager;
  private authApi: AuthApiService | null = null;
  private refreshPromise: Promise<RefreshResult> | null = null;
  private refreshAttempts: number = 0;
  private maxRefreshAttempts: number = 3;
  private isRefreshing: boolean = false;

  static getInstance(): TokenRefreshManager {
    if (!TokenRefreshManager.instance) {
      TokenRefreshManager.instance = new TokenRefreshManager();
    }
    return TokenRefreshManager.instance;
  }

  /**
   * Initialize with AuthApiService
   */
  initialize(authApi: AuthApiService): void {
    this.authApi = authApi;
  }

  /**
   * Check if token needs refresh
   */
  needsRefresh(
    tokens: AuthTokens | null,
    thresholdMinutes: number = 5,
  ): boolean {
    if (!tokens) return false;
    return AuthUtils.isTokenExpired(tokens.expiresAt, thresholdMinutes);
  }

  /**
   * Refresh token with deduplication
   */
  async refreshToken(): Promise<RefreshResult> {
    // Prevent multiple concurrent refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Check refresh attempt limits
    if (this.refreshAttempts >= this.maxRefreshAttempts) {
      const error = AuthUtils.createAuthError(
        "MAX_REFRESH_ATTEMPTS",
        "Maximum token refresh attempts exceeded. Please log in again.",
        null,
        false,
      );
      return { success: false, error };
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performRefresh();

    try {
      const result = await this.refreshPromise;

      if (result.success) {
        this.refreshAttempts = 0; // Reset on success
      } else {
        this.refreshAttempts++;
      }

      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Perform actual token refresh
   */
  private async performRefresh(): Promise<RefreshResult> {
    if (!this.authApi) {
      return {
        success: false,
        error: AuthUtils.createAuthError(
          "API_NOT_INITIALIZED",
          "Auth API service not initialized",
          null,
          false,
        ),
      };
    }

    try {
      const result = await this.authApi.refreshToken();

      if (result.success && result.tokens) {
        // Update stored tokens
        const rememberMe = authStorage.getRememberMe();
        authStorage.setTokens(result.tokens, rememberMe);
      } else {
      }

      return result;
    } catch (error) {
      console.error("❌ Token refresh error:", error);
      return {
        success: false,
        error: AuthUtils.createAuthError(
          "REFRESH_ERROR",
          "Failed to refresh token",
          error,
          true,
        ),
      };
    }
  }

  /**
   * Reset refresh attempts
   */
  resetRefreshAttempts(): void {
    this.refreshAttempts = 0;
  }

  /**
   * Get current refresh status
   */
  getRefreshStatus(): {
    isRefreshing: boolean;
    refreshAttempts: number;
    maxRefreshAttempts: number;
  } {
    return {
      isRefreshing: this.isRefreshing,
      refreshAttempts: this.refreshAttempts,
      maxRefreshAttempts: this.maxRefreshAttempts,
    };
  }
}

/**
 * Create Apollo Client auth link with automatic token refresh
 */
export function createAuthLink(): ApolloLink {
  const tokenRefreshManager = TokenRefreshManager.getInstance();

  // Auth link to add token to requests
  const authLink = setContext(async (_, { headers }) => {
    let token = authStorage.getTokens()?.accessToken;

    // Check if token needs refresh before making request
    const tokens = authStorage.getTokens();
    if (tokens && tokenRefreshManager.needsRefresh(tokens)) {
      const refreshResult = await tokenRefreshManager.refreshToken();

      if (refreshResult.success && refreshResult.tokens) {
        token = refreshResult.tokens.accessToken;
      } else {
        // Continue with existing token, let error handler deal with it
      }
    }

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  // Error link to handle authentication errors
  const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      // Handle GraphQL errors
      if (graphQLErrors) {
        for (const error of graphQLErrors) {
          const { extensions } = error;

          // Handle token expiration
          if (
            extensions?.code === "UNAUTHENTICATED" ||
            extensions?.code === "TOKEN_EXPIRED"
          ) {
            return new Promise((resolve, reject) => {
              tokenRefreshManager
                .refreshToken()
                .then((refreshResult) => {
                  if (refreshResult.success && refreshResult.tokens) {
                    // Update the authorization header
                    operation.setContext({
                      headers: {
                        ...operation.getContext().headers,
                        authorization: `Bearer ${refreshResult.tokens.accessToken}`,
                      },
                    });

                    // Retry the request
                    resolve(forward(operation));
                  } else {
                    // Clear auth data and redirect to login
                    authStorage.clear();

                    // Redirect to login page
                    if (typeof window !== "undefined") {
                      window.location.href = "/auth/login";
                    }

                    reject(error);
                  }
                })
                .catch((refreshError) => {
                  console.error("❌ Token refresh error:", refreshError);

                  // Clear auth data and redirect to login
                  authStorage.clear();

                  if (typeof window !== "undefined") {
                    window.location.href = "/auth/login";
                  }

                  reject(refreshError);
                });
            });
          }

          // Handle other authentication errors
          if (extensions?.code === "FORBIDDEN") {
            // Handle forbidden access (maybe redirect to unauthorized page)
          }
        }
      }

      // Handle network errors
      if (networkError) {
        console.error("🌐 Network error:", networkError);

        // Handle specific network errors
        if ("statusCode" in networkError) {
          switch (networkError.statusCode) {
            case 401:
              // Similar to GraphQL error handling above
              break;
            case 403:
              break;
            case 500:
              break;
          }
        }
      }
    },
  );

  return from([errorLink, authLink]);
}

/**
 * Apollo Client middleware for automatic token attachment
 */
export function createTokenMiddleware(): ApolloLink {
  return new ApolloLink((operation, forward) => {
    // Get current token
    const tokens = authStorage.getTokens();

    if (tokens?.accessToken) {
      // Add token to operation context
      operation.setContext({
        headers: {
          authorization: `Bearer ${tokens.accessToken}`,
        },
      });
    }

    return forward(operation);
  });
}

/**
 * Setup automatic token refresh interval
 */
export function setupTokenRefreshInterval(
  intervalMinutes: number = 1,
): () => void {
  const tokenRefreshManager = TokenRefreshManager.getInstance();

  const interval = setInterval(
    async () => {
      const tokens = authStorage.getTokens();

      if (tokens && tokenRefreshManager.needsRefresh(tokens, 5)) {
        await tokenRefreshManager.refreshToken();
      }
    },
    intervalMinutes * 60 * 1000,
  );

  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
}

/**
 * Token refresh utilities
 */
export const TokenRefreshUtils = {
  /**
   * Check if current token is valid
   */
  isTokenValid(): boolean {
    const tokens = authStorage.getTokens();
    if (!tokens) return false;

    return !AuthUtils.isTokenExpired(tokens.expiresAt, 0);
  },

  /**
   * Get token expiry time in minutes
   */
  getTokenExpiryMinutes(): number | null {
    const tokens = authStorage.getTokens();
    if (!tokens) return null;

    const now = Date.now();
    const expiryMinutes = (tokens.expiresAt - now) / (1000 * 60);

    return Math.max(0, Math.floor(expiryMinutes));
  },

  /**
   * Check if refresh token is valid
   */
  isRefreshTokenValid(): boolean {
    const tokens = authStorage.getTokens();
    if (!tokens?.refreshToken || !tokens.refreshExpiresAt) return false;

    return !AuthUtils.isRefreshTokenExpired(tokens.refreshExpiresAt);
  },

  /**
   * Get refresh token expiry time in hours
   */
  getRefreshTokenExpiryHours(): number | null {
    const tokens = authStorage.getTokens();
    if (!tokens?.refreshExpiresAt) return null;

    const now = Date.now();
    const expiryHours = (tokens.refreshExpiresAt - now) / (1000 * 60 * 60);

    return Math.max(0, Math.floor(expiryHours));
  },

  /**
   * Force token refresh
   */
  async forceRefresh(): Promise<RefreshResult> {
    const tokenRefreshManager = TokenRefreshManager.getInstance();
    return await tokenRefreshManager.refreshToken();
  },
};

// Export singleton instance
export const tokenRefreshManager = TokenRefreshManager.getInstance();
