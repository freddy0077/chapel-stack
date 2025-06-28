"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useMutation, gql } from "@apollo/client";
import { client } from "@/lib/apollo-client";

// Types for user roles and branches
export type UserRole = 
  | "super_admin"     // Diocese/organization level admin
  | "branch_admin"    // Parish/branch level admin
  | "pastor"          // Clergy with specific access
  | "finance_manager" // Can manage financial records and transactions
  | "content_manager" // Can manage sermons, events, and other content
  | "ministry_leader" // Leaders of specific ministries
  | "volunteer"       // Volunteers with limited access
  | "member";         // Regular church members

export interface UserBranch {
  id: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  primaryBranchId: string;
  branches: UserBranch[];
  primaryRole: UserRole;
  isMultiBranchAdmin: boolean;
  lastLogin?: Date;
  organisationId?: string;
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
    language: string;
  };
  mfaEnabled: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  branchId?: string;
}

interface LoginResult {
  success: boolean;
  redirectTo?: string;
  requiresMFA?: boolean;
  error?: string;
}

interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  branchId: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  setActiveBranch: (branchId: string) => void;
  activeBranchId: string | null;
  checkPermission: (permission: string) => boolean;
  sendVerificationEmail: (email: string) => Promise<void>;
  setupMfa: () => Promise<string>;
  verifyMfa: (code: string) => Promise<boolean>;
  disableMfa: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);
  const router = useRouter();

  // GraphQL Queries for user authentication
  const ME_QUERY = gql`
    query Me {
      me {
        id
        email
        firstName
        lastName
        isActive
        isEmailVerified
        lastLoginAt
        createdAt
        updatedAt
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
        organisationId
      }
    }
  `;
  
  // Check for existing session on mount using GraphQL ME query
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a token stored
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // Use the token to verify with the backend
          const { data } = await client.query({
            query: ME_QUERY,
            fetchPolicy: 'network-only' // Always verify with the server
          });
          
          if (data && data.me) {
            // Convert API user to our application's user model
            const apiUser = data.me;
            const storedUser = localStorage.getItem('church_mgmt_user');
            let userData: User;
            
            if (storedUser) {
              // Use stored user data but update with latest API data
              const parsedUser = JSON.parse(storedUser) as User;
              userData = {
                ...parsedUser,
                id: apiUser.id,
                email: apiUser.email,
                firstName: apiUser.firstName,
                lastName: apiUser.lastName,
                primaryRole: apiUser.roles && apiUser.roles.length > 0 ? 
                  apiUser.roles[0].name.toLowerCase() as UserRole : 'member' as UserRole,
              };
            } else {
              // Create new user object from API data
              userData = {
                id: apiUser.id,
                email: apiUser.email,
                firstName: apiUser.firstName,
                lastName: apiUser.lastName,
                photoUrl: '/images/avatars/default.jpg',
                primaryBranchId: 'default_branch',
                branches: apiUser.userBranches ? apiUser.userBranches.map((branchAccess: { branch: { id: string; name: string }; role: { name: string } }) => ({
                  id: branchAccess.branch.id,
                  name: branchAccess.branch.name,
                  role: branchAccess.role.name.toLowerCase() as UserRole,
                  permissions: []
                })) : [
                  {
                    id: 'default_branch',
                    name: 'Main Branch',
                    role: 'member' as UserRole,
                    permissions: []
                  }
                ],
                primaryRole: apiUser.roles && apiUser.roles.length > 0 ? 
                  apiUser.roles[0].name.toLowerCase() as UserRole : 'member' as UserRole,
                isMultiBranchAdmin: apiUser.roles ? 
                  apiUser.roles.some((role: { name: string }) => role.name.toLowerCase() === 'admin') : false,
                lastLogin: new Date(),
                organisationId: apiUser.organisationId || null,
                preferences: {
                  theme: 'system',
                  notifications: true,
                  language: 'en'
                },
                mfaEnabled: false
              };
            }
            
            setUser(userData);
            setActiveBranchId(userData.primaryBranchId);
          } else {
            // Token is invalid or expired
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('church_mgmt_user');
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setError("Session expired. Please login again.");
        
        // Clear invalid tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('church_mgmt_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [ME_QUERY]);

  const LOGIN_MUTATION = gql`
    mutation Login($input: LoginInput!) {
      login(input: $input)
    }
  `;

  // GraphQL hooks
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  // Real login function connected to GraphQL API
  // Helper function to determine dashboard route based on role
const getDashboardRouteForRole = (role: string): string => {
  // Normalize role name: convert to lowercase and replace spaces with underscores
  const normalizedRole = role.toLowerCase().replace(/\s+/g, '_');
  
  switch (normalizedRole) {
    case 'super_admin':
      return '/dashboard/admin';
    case 'branch_admin':
      return '/dashboard/branch-admin';
    case 'pastor':
      return '/dashboard/pastor';
    case 'finance_manager':
      return '/dashboard/finance';
    case 'content_manager':
      return '/dashboard/content';
    case 'volunteer':
      return '/dashboard/volunteer';
    case 'ministry_leader':
      return '/dashboard/ministry';
    case 'member':
      return '/dashboard/member';
    default:
      return '/dashboard';
  }
};

const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Execute the login mutation
      const { data } = await loginMutation({
        variables: {
          input: {
            email: credentials.email,
            password: credentials.password
          }
        }
      });
      
      if (!data || !data.login) {
        return { success: false, error: 'Login failed. Invalid response from server.' };
      }
      
      const token = data.login;
      console.log('✅ Login successful, received token:', token ? 'Token received' : 'No token');
      
      localStorage.setItem('authToken', token);
      
      // Fetch user data with token
      const meResponse = await client.query({
        query: ME_QUERY,
        fetchPolicy: 'network-only',
        context: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });
      
      if (!meResponse.data || !meResponse.data.me) {
        return { success: false, error: 'Failed to fetch user data after login' };
      }
      
      const apiUser = meResponse.data.me;
      console.log('✅ User data retrieved:', apiUser);
      
      // Map API user model to our application's User model
      const appUser: User = {
        id: apiUser.id,
        email: apiUser.email,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        photoUrl: '/images/avatars/default.jpg', // Default photo
        primaryBranchId: credentials.branchId || (apiUser.userBranches && apiUser.userBranches.length > 0 ? apiUser.userBranches[0].branch.id : 'default_branch'),
        branches: apiUser.userBranches ? apiUser.userBranches.map((branchAccess: { branch: { id: string; name: string }; role: { name: string } }) => ({
          id: branchAccess.branch.id,
          name: branchAccess.branch.name,
          role: branchAccess.role.name.toLowerCase() as UserRole,
          permissions: []
        })) : [
          {
            id: 'default_branch',
            name: 'Main Branch',
            role: 'member',
            permissions: []
          }
        ],
        primaryRole: apiUser.roles && apiUser.roles.length > 0 ? 
          apiUser.roles[0].name.toLowerCase().replace(/\s+/g, '_') as UserRole : 'member' as UserRole,
        isMultiBranchAdmin: apiUser.roles ? 
          apiUser.roles.some((role: { name: string }) => role.name.toLowerCase().includes('admin')) : false,
        lastLogin: new Date(),
        organisationId: apiUser.organisationId || null,
        preferences: {
          theme: 'system',
          notifications: true,
          language: 'en'
        },
        mfaEnabled: false // This should be from the API
      };
      
      setUser(appUser);
      setActiveBranchId(appUser.primaryBranchId);
      
      if (credentials.rememberMe) {
        localStorage.setItem('church_mgmt_user', JSON.stringify(appUser));
      }
      
      let dashboardRoute = '/dashboard';
      if (appUser.primaryRole) {
        console.log('👉 Primary role detected:', appUser.primaryRole);
        dashboardRoute = getDashboardRouteForRole(appUser.primaryRole);
      }
      console.log('🚀 Redirecting to dashboard route:', dashboardRoute);

      // CRITICAL: Force navigation to dashboard - this must execute
      console.log('🔴 NAVIGATION ATTEMPT STARTING');
      
      // Store success info in localStorage (more reliable than sessionStorage)
      try {
        localStorage.setItem('login_success', 'true');
        localStorage.setItem('redirect_to', dashboardRoute);
        console.log('🔵 Stored navigation data in localStorage');
      } catch (e) {
        console.error('Storage error:', e);
      }
      
      // Immediate navigation attempt
      try {
        console.log('🔶 Direct navigation attempt');
        window.location.href = dashboardRoute;
        console.log('🔷 Navigation instruction executed');
      } catch (e) {
        console.error('Navigation error:', e);
      }
      
      // Return success regardless - the page should navigate away
      console.log('✅ Login function completed successfully');
      return { success: true, redirectTo: dashboardRoute };

    } catch (error: unknown) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      if (error && typeof error === 'object' && 'graphQLErrors' in error && Array.isArray((error as any).graphQLErrors) && (error as any).graphQLErrors.length > 0) {
        const gqlError = (error as any).graphQLErrors[0];
        errorMessage =
          gqlError?.extensions?.originalError?.message ||
          gqlError?.message ||
          errorMessage;
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // GraphQL register mutation
  const REGISTER_MUTATION = gql`
    mutation Register($input: RegisterInput!) {
      register(registerInput: $input) {
        id
        email
        firstName
        lastName
        role
        status
        createdAt
        updatedAt
      }
    }
  `;

  const [registerMutation] = useMutation(REGISTER_MUTATION);

  const register = async (data: RegistrationData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Execute the register mutation
      const { data: responseData } = await registerMutation({
        variables: {
          input: {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName
          }
        }
      });
      
      if (!responseData || !responseData.register) {
        throw new Error('Registration failed. Invalid response from server.');
      }
      
      const registeredUser = responseData.register;
      
      // Build user object for our application
      const appUser: User = {
        id: registeredUser.id,
        email: registeredUser.email,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        photoUrl: '/images/avatars/default.jpg',
        primaryBranchId: 'default_branch',
        branches: [
          {
            id: 'default_branch',
            name: 'Main Branch',
            role: 'member',
            permissions: ['view_events', 'view_sermons']
          }
        ],
        primaryRole: 'member',
        isMultiBranchAdmin: false,
        organisationId: null,
        preferences: {
          theme: 'system',
          notifications: true,
          language: 'en'
        },
        mfaEnabled: false
      };
      
      // Auto-login after registration (redirect to login page instead if you want explicit login)
      const loginResult = await loginMutation({
        variables: {
          input: {
            email: data.email,
            password: data.password
          }
        }
      });
      
      if (loginResult.data?.login) {
        // Login mutation now returns just a token string
        const token = loginResult.data.login;
        
        // Store token
        localStorage.setItem('authToken', token);
        localStorage.setItem('church_mgmt_user', JSON.stringify(appUser));
        
        setUser(appUser);
        setActiveBranchId(appUser.primaryBranchId);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        // Registration succeeded but login failed - redirect to login page
        router.push('/auth/login');
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // GraphQL logout mutation
  const LOGOUT_MUTATION = gql`
    mutation Logout {
      logout {
        success
        message
      }
    }
  `;
  
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);
  
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Execute the logout mutation
      await logoutMutation();
      
      // Clear auth tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      
      // Clear user data
      setUser(null);
      setActiveBranchId(null);
      localStorage.removeItem('church_mgmt_user');
      
      // Redirect to login page
      router.push('/auth/login');
    } catch (error: unknown) {
      console.error('Logout error:', error);
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Logout failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // GraphQL reset password mutation
  const RESET_PASSWORD_MUTATION = gql`
    mutation ForgotPassword($email: String!) {
      forgotPassword(email: $email) {
        success
        message
      }
    }
  `;

  const [resetPasswordMutation] = useMutation(RESET_PASSWORD_MUTATION);

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Execute the reset password mutation
      const { data } = await resetPasswordMutation({
        variables: { email }
      });
      
      if (!data || !data.forgotPassword) {
        throw new Error('Password reset failed. Please try again.');
      }
      
      return data.forgotPassword;
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Password reset failed. Please try again.';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // GraphQL update user mutation
  const UPDATE_USER_MUTATION = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
      updateUser(updateUserInput: $input) {
        id
        email
        firstName
        lastName
        role
        status
        createdAt
        updatedAt
      }
    }
  `;

  const [updateUserMutation] = useMutation(UPDATE_USER_MUTATION);

  const updateUser = async (userData: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('User is not authenticated');
      }
      
      // Prepare input for GraphQL mutation
      const input: Record<string, unknown> = {};
      
      // Map the fields we can update via API
      if (userData.firstName) input.firstName = userData.firstName;
      if (userData.lastName) input.lastName = userData.lastName;
      
      // Execute the update user mutation
      const { data } = await updateUserMutation({
        variables: { input }
      });
      
      if (!data || !data.updateUser) {
        throw new Error('Failed to update user information.');
      }
      
      // Update local user state with API response data
      const apiUser = data.updateUser;
      const updatedUser = { 
        ...user, 
        ...userData,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
      };
      
      setUser(updatedUser);
      
      // Update stored user if exists
      const storedUser = localStorage.getItem('church_mgmt_user');
      if (storedUser) {
        localStorage.setItem('church_mgmt_user', JSON.stringify(updatedUser));
      }
      
      return updatedUser;
    } catch (error: unknown) {
      console.error('User update error:', error);
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Failed to update user information.';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkPermission = (permission: string): boolean => {
    if (!user || !activeBranchId) return false;
    
    // Find active branch
    const activeBranch = user.branches.find(branch => branch.id === activeBranchId);
    if (!activeBranch) return false;
    
    // Check permissions
    return activeBranch.permissions.includes(permission) || 
           user.primaryRole === "super_admin"; // Super admins have all permissions
  };

  // GraphQL send verification email mutation
  const SEND_VERIFICATION_EMAIL_MUTATION = gql`
    mutation ResendVerificationEmail($email: String!) {
      resendVerificationEmail(email: $email) {
        success
        message
      }
    }
  `;

  const [sendVerificationEmailMutation] = useMutation(SEND_VERIFICATION_EMAIL_MUTATION);

  const sendVerificationEmail = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Execute the send verification email mutation
      const { data } = await sendVerificationEmailMutation({
        variables: { email }
      });
      
      if (!data || !data.resendVerificationEmail) {
        throw new Error('Failed to send verification email.');
      }
      
      return data.resendVerificationEmail;
    } catch (error: unknown) {
      console.error('Email verification error:', error);
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Failed to send verification email.';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // GraphQL setup MFA mutation
  const SETUP_MFA_MUTATION = gql`
    mutation SetupMfa {
      setupMfa {
        qrCodeUrl
        secret
      }
    }
  `;

  const [setupMfaMutation] = useMutation(SETUP_MFA_MUTATION);

  const setupMfa = async (): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Execute the setup MFA mutation
      const { data } = await setupMfaMutation();
      
      if (!data || !data.setupMfa || !data.setupMfa.qrCodeUrl) {
        throw new Error('Failed to set up MFA.');
      }
      
      return data.setupMfa.qrCodeUrl;
    } catch (error: unknown) {
      console.error('MFA setup error:', error);
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Failed to set up MFA.';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // GraphQL verify MFA mutation
  const VERIFY_MFA_MUTATION = gql`
    mutation VerifyMfa($code: String!) {
      verifyMfa(code: $code) {
        success
        message
      }
    }
  `;

  const [verifyMfaMutation] = useMutation(VERIFY_MFA_MUTATION);

  const verifyMfa = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Execute the verify MFA mutation
      const { data } = await verifyMfaMutation({
        variables: { code }
      });
      
      if (!data || !data.verifyMfa) {
        throw new Error('Failed to verify MFA code.');
      }
      
      const isValid = data.verifyMfa.success;
      
      if (isValid && user) {
        const updatedUser = { ...user, mfaEnabled: true };
        setUser(updatedUser);
        
        // Update stored user if exists
        const storedUser = localStorage.getItem('church_mgmt_user');
        if (storedUser) {
          localStorage.setItem('church_mgmt_user', JSON.stringify(updatedUser));
        }
      }
      
      return isValid;
    } catch (error: unknown) {
      console.error('MFA verification error:', error);
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Failed to verify MFA code.';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // GraphQL disable MFA mutation
  const DISABLE_MFA_MUTATION = gql`
    mutation DisableMfa {
      disableMfa {
        success
        message
      }
    }
  `;

  const [disableMfaMutation] = useMutation(DISABLE_MFA_MUTATION);

  const disableMfa = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Execute the disable MFA mutation
      const { data } = await disableMfaMutation();
      
      if (!data || !data.disableMfa || !data.disableMfa.success) {
        throw new Error('Failed to disable MFA.');
      }
      
      if (user) {
        const updatedUser = { ...user, mfaEnabled: false };
        setUser(updatedUser);
        
        // Update stored user if exists
        const storedUser = localStorage.getItem('church_mgmt_user');
        if (storedUser) {
          localStorage.setItem('church_mgmt_user', JSON.stringify(updatedUser));
        }
      }
    } catch (error: unknown) {
      console.error('MFA disable error:', error);
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Failed to disable MFA.';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateUser,
    activeBranchId,
    setActiveBranch: setActiveBranchId,
    checkPermission,
    sendVerificationEmail,
    setupMfa,
    verifyMfa,
    disableMfa
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
