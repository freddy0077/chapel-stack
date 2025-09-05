/**
 * Enhanced Authentication API Service for Phase 2 Implementation
 * Handles all GraphQL operations, token refresh, and API communication
 */

import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import {
  AuthUser,
  AuthTokens,
  LoginCredentials,
  LoginResult,
  RefreshResult,
  AuthError,
  AuthConfig,
  DEFAULT_AUTH_CONFIG,
} from "@/types/auth-enhanced.types";
import { AuthUtils } from "./auth-reducer";
import { authStorage } from "./auth-storage";

// GraphQL Mutations and Queries
const LOGIN_MUTATION = gql`
  mutation Login($input: SignInDto!) {
    login(input: $input) {
      accessToken
      refreshToken
      accessTokenExpiresAt
      refreshTokenExpiresAt
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

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      accessTokenExpiresAt
      refreshTokenExpiresAt
    }
  }
`;

const GET_CURRENT_USER_QUERY = gql`
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

const LOGOUT_MUTATION = gql`
  mutation Logout($everywhere: Boolean) {
    logout(everywhere: $everywhere) {
      success
    }
  }
`;

const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      message
    }
  }
`;

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      success
      message
    }
  }
`;

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      success
      message
    }
  }
`;

const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`;

const ENABLE_MFA_MUTATION = gql`
  mutation EnableMFA {
    enableMFA {
      qrCode
      backupCodes
    }
  }
`;

const DISABLE_MFA_MUTATION = gql`
  mutation DisableMFA($password: String!) {
    disableMFA(password: $password) {
      success
    }
  }
`;

const VERIFY_MFA_MUTATION = gql`
  mutation VerifyMFA($token: String!, $code: String!) {
    verifyMFA(token: $token, code: $code) {
      accessToken
      refreshToken
      accessTokenExpiresAt
      refreshTokenExpiresAt
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

/**
 * Enhanced Authentication API Service
 */
export class AuthApiService {
  private apolloClient: ApolloClient<NormalizedCacheObject>;
  private config: AuthConfig;
  private refreshPromise: Promise<RefreshResult> | null = null;
  private refreshAttempts: number = 0;

  constructor(
    apolloClient: ApolloClient<NormalizedCacheObject>,
    config: Partial<AuthConfig> = {},
  ) {
    this.apolloClient = apolloClient;
    this.config = { ...DEFAULT_AUTH_CONFIG, ...config };
  }

  /**
   * Process user data from GraphQL response
   */
  private processUserData(userData: any): AuthUser {
    if (!userData) {
      throw new Error("User data is required");
    }

    const primaryRole = this.getPrimaryRole(userData);

    // Extract the primary branch from userBranches with proper null safety
    const primaryBranch =
      userData.userBranches &&
      userData.userBranches.length > 0 &&
      userData.userBranches[0].branch
        ? {
            id: userData.userBranches[0].branch.id,
            name: userData.userBranches[0].branch.name,
            organisationId: userData.organisationId,
          }
        : null;

    const processedUser = {
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
      roles: userData.roles.map((role: any) => role.name),
      userBranches: userData.userBranches,
      member: userData.member,
      primaryRole,
      branch: primaryBranch,
      permissions: [], // TODO: Add permissions from backend
    };

    return processedUser;
  }

  /**
   * Determine primary role from user data
   */
  private getPrimaryRole(userData: any): string {
    if (!userData.roles || userData.roles.length === 0) {
      return "MEMBER";
    }

    // Priority order for roles
    const rolePriority = [
      "SUPER_ADMIN",
      "BRANCH_ADMIN",
      "SUBSCRIPTION_MANAGER",
      "FINANCE_MANAGER",
      "PASTORAL_STAFF",
      "MINISTRY_LEADER",
      "MEMBER",
    ];

    for (const role of rolePriority) {
      if (userData.roles.some((r: any) => r.name === role)) {
        return role;
      }
    }

    return userData.roles[0].name;
  }

  /**
   * Create auth tokens object
   */
  private createTokens(tokenData: any): AuthTokens {
    return {
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      expiresAt: tokenData.accessTokenExpiresAt,
      refreshExpiresAt: tokenData.refreshTokenExpiresAt,
    };
  }

  /**
   * Handle GraphQL errors and convert to AuthError
   */
  private handleError(error: any): AuthError {
    console.error("Auth API Error:", error);

    // Handle network errors
    if (error.networkError) {
      return AuthUtils.createAuthError(
        "NETWORK_ERROR",
        "Unable to connect to the server. Please check your internet connection.",
        error.networkError,
        true,
      );
    }

    // Handle GraphQL errors
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const graphQLError = error.graphQLErrors[0];
      const extensions = graphQLError.extensions || {};

      return AuthUtils.createAuthError(
        extensions.code || "GRAPHQL_ERROR",
        graphQLError.message || "An error occurred during authentication.",
        extensions,
        extensions.recoverable !== false,
      );
    }

    // Handle generic errors
    return AuthUtils.createAuthError(
      "UNKNOWN_ERROR",
      error.message || "An unexpected error occurred.",
      error,
      true,
    );
  }

  /**
   * Login with credentials
   */
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      const response = await this.apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          input: {
            email: credentials.email,
            password: credentials.password,
          },
        },
        errorPolicy: "all",
      });

      if (response.errors && response.errors.length > 0) {
        throw response.errors[0];
      }

      const {
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        user: userData,
      } = response.data.login;

      // Debug: Log the raw response data
      if (userData?.userBranches && userData.userBranches.length > 0) {
      }
      const user = this.processUserData(userData);

      const tokens = this.createTokens({
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      });

      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
      console.error("❌ Login failed:", error);

      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Refresh authentication tokens
   */
  async refreshToken(): Promise<RefreshResult> {
    // Prevent multiple concurrent refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Check refresh attempt limits
    if (this.refreshAttempts >= this.config.maxRefreshAttempts) {
      return {
        success: false,
        error: AuthUtils.createAuthError(
          "MAX_REFRESH_ATTEMPTS",
          "Maximum token refresh attempts exceeded. Please log in again.",
          null,
          false,
        ),
      };
    }

    this.refreshPromise = this.performTokenRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;

    return result;
  }

  /**
   * Perform actual token refresh
   */
  private async performTokenRefresh(): Promise<RefreshResult> {
    try {
      this.refreshAttempts++;

      const currentTokens = authStorage.getTokens();
      if (!currentTokens?.refreshToken) {
        throw new Error("No refresh token available");
      }

      // Check if refresh token is expired
      if (AuthUtils.isRefreshTokenExpired(currentTokens.refreshExpiresAt)) {
        throw new Error("Refresh token expired");
      }

      const response = await this.apolloClient.mutate({
        mutation: REFRESH_TOKEN_MUTATION,
        variables: {
          refreshToken: currentTokens.refreshToken,
        },
        errorPolicy: "all",
      });

      if (response.errors && response.errors.length > 0) {
        throw response.errors[0];
      }

      const tokenData = response.data.refreshToken;
      const tokens = this.createTokens(tokenData);

      // Reset refresh attempts on success
      this.refreshAttempts = 0;

      return {
        success: true,
        tokens,
      };
    } catch (error) {
      console.error("❌ Token refresh failed:", error);

      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Get current user data
   */
  async getCurrentUser(): Promise<{
    user: AuthUser | null;
    error: AuthError | null;
  }> {
    try {
      const response = await this.apolloClient.query({
        query: GET_CURRENT_USER_QUERY,
        fetchPolicy: "network-only", // Always fetch fresh data
        errorPolicy: "all",
      });

      if (response.errors && response.errors.length > 0) {
        throw response.errors[0];
      }

      if (!response.data.me) {
        return { user: null, error: null };
      }

      const user = this.processUserData(response.data.me);

      return { user, error: null };
    } catch (error) {
      console.error("❌ Failed to get current user:", error);

      return {
        user: null,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Logout user
   */
  async logout(
    everywhere: boolean = false,
  ): Promise<{ success: boolean; error?: AuthError }> {
    try {
      await this.apolloClient.mutate({
        mutation: LOGOUT_MUTATION,
        variables: { everywhere },
        errorPolicy: "all",
      });

      // Clear Apollo cache
      await this.apolloClient.clearStore();

      return { success: true };
    } catch (error) {
      console.error("❌ Logout failed:", error);

      // Even if logout fails on server, we should clear local data
      await this.apolloClient.clearStore();

      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const response = await this.apolloClient.mutate({
        mutation: REQUEST_PASSWORD_RESET_MUTATION,
        variables: { email },
        errorPolicy: "all",
      });

      if (response.errors && response.errors.length > 0) {
        throw response.errors[0];
      }

      return response.data.requestPasswordReset.success;
    } catch (error) {
      console.error("❌ Password reset request failed:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      const response = await this.apolloClient.mutate({
        mutation: RESET_PASSWORD_MUTATION,
        variables: { token, newPassword },
        errorPolicy: "all",
      });

      if (response.errors && response.errors.length > 0) {
        throw response.errors[0];
      }

      return response.data.resetPassword.success;
    } catch (error) {
      console.error("❌ Password reset failed:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      const response = await this.apolloClient.mutate({
        mutation: CHANGE_PASSWORD_MUTATION,
        variables: { currentPassword, newPassword },
        errorPolicy: "all",
      });

      if (response.errors && response.errors.length > 0) {
        throw response.errors[0];
      }

      return response.data.changePassword.success;
    } catch (error) {
      console.error("❌ Password change failed:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<boolean> {
    try {
      const response = await this.apolloClient.mutate({
        mutation: VERIFY_EMAIL_MUTATION,
        variables: { token },
        errorPolicy: "all",
      });

      if (response.errors && response.errors.length > 0) {
        throw response.errors[0];
      }

      return response.data.verifyEmail.success;
    } catch (error) {
      console.error("❌ Email verification failed:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Enable MFA
   */
  async enableMFA(): Promise<{ qrCode: string; backupCodes: string[] }> {
    try {
      const response = await this.apolloClient.mutate({
        mutation: ENABLE_MFA_MUTATION,
        errorPolicy: "all",
      });

      if (response.errors && response.errors.length > 0) {
        throw response.errors[0];
      }

      return response.data.enableMFA;
    } catch (error) {
      console.error("❌ MFA enable failed:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Disable MFA
   */
  async disableMFA(password: string): Promise<boolean> {
    try {
      const response = await this.apolloClient.mutate({
        mutation: DISABLE_MFA_MUTATION,
        variables: { password },
        errorPolicy: "all",
      });

      if (response.errors && response.errors.length > 0) {
        throw response.errors[0];
      }

      return response.data.disableMFA.success;
    } catch (error) {
      console.error("❌ MFA disable failed:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify MFA code
   */
  async verifyMFA(token: string, code: string): Promise<LoginResult> {
    try {
      const response = await this.apolloClient.mutate({
        mutation: VERIFY_MFA_MUTATION,
        variables: { token, code },
        errorPolicy: "all",
      });

      if (response.errors && response.errors.length > 0) {
        throw response.errors[0];
      }

      const {
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
        user: userData,
      } = response.data.verifyMFA;
      const user = this.processUserData(userData);
      const tokens = this.createTokens({
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      });

      return {
        success: true,
        user,
        tokens,
      };
    } catch (error) {
      console.error("❌ MFA verification failed:", error);

      return {
        success: false,
        error: this.handleError(error),
      };
    }
  }

  /**
   * Reset refresh attempts counter
   */
  resetRefreshAttempts(): void {
    this.refreshAttempts = 0;
  }
}
