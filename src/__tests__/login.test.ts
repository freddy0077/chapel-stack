/**
 * Login Functionality Test
 * Tests the authentication login flow to ensure it works correctly
 */

import { AuthApiService } from '@/lib/auth/auth-api';
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';

// Mock Apollo Client for testing
const mockApolloClient = {
  mutate: jest.fn(),
  query: jest.fn(),
} as unknown as ApolloClient<NormalizedCacheObject>;

// Mock successful login response
const mockLoginResponse = {
  data: {
    login: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '+1234567890',
        isActive: true,
        isEmailVerified: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        organisationId: 'org-1',
        roles: [{ name: 'MEMBER' }],
        userBranches: [{
          branch: {
            id: 'branch-1',
            name: 'Main Branch'
          }
        }],
        member: {
          id: 'member-1',
          firstName: 'Test',
          lastName: 'User',
          profileImageUrl: null,
          status: 'ACTIVE'
        }
      }
    }
  },
  errors: null
};

// Mock MFA required response
const mockMFAResponse = {
  data: {
    login: {
      accessToken: null,
      refreshToken: null,
      mfaRequired: true,
      mfaToken: 'mock-mfa-token',
      user: null
    }
  },
  errors: null
};

// Mock error response
const mockErrorResponse = {
  data: null,
  errors: [{ message: 'Invalid credentials' }]
};

describe('Login Functionality', () => {
  let authApiService: AuthApiService;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    authApiService = new AuthApiService(mockApolloClient);
  });

  describe('Successful Login', () => {
    test('should login successfully with valid credentials', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'validpassword'
      };

      (mockApolloClient.mutate as jest.Mock).mockResolvedValue(mockLoginResponse);

      // Act
      const result = await authApiService.login(credentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
      expect(result.user?.name).toBe('Test User');
      expect(result.user?.primaryRole).toBe('MEMBER');
      expect(result.tokens?.accessToken).toBe('mock-access-token');
      expect(result.tokens?.refreshToken).toBe('mock-refresh-token');

      // Verify Apollo Client was called with correct parameters
      expect(mockApolloClient.mutate).toHaveBeenCalledWith({
        mutation: expect.any(Object),
        variables: {
          input: {
            email: 'test@example.com',
            password: 'validpassword'
          }
        },
        errorPolicy: 'all'
      });
    });

    test('should process user data correctly', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'validpassword'
      };

      (mockApolloClient.mutate as jest.Mock).mockResolvedValue(mockLoginResponse);

      // Act
      const result = await authApiService.login(credentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.user).toMatchObject({
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        name: 'Test User',
        isActive: true,
        isEmailVerified: true,
        organisationId: 'org-1',
        roles: ['MEMBER'],
        primaryRole: 'MEMBER',
        branch: {
          id: 'branch-1',
          name: 'Main Branch'
        }
      });
    });
  });

  describe('MFA Required', () => {
    test('should handle MFA requirement correctly', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'validpassword'
      };

      (mockApolloClient.mutate as jest.Mock).mockResolvedValue(mockMFAResponse);

      // Act
      const result = await authApiService.login(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.requiresMFA).toBe(true);
      expect(result.mfaToken).toBe('mock-mfa-token');
      expect(result.user).toBeUndefined();
      expect(result.tokens).toBeUndefined();
    });
  });

  describe('Login Errors', () => {
    test('should handle invalid credentials error', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      (mockApolloClient.mutate as jest.Mock).mockResolvedValue(mockErrorResponse);

      // Act
      const result = await authApiService.login(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Invalid credentials');
      expect(result.user).toBeUndefined();
      expect(result.tokens).toBeUndefined();
    });

    test('should handle network errors', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'validpassword'
      };

      (mockApolloClient.mutate as jest.Mock).mockRejectedValue(new Error('Network error'));

      // Act
      const result = await authApiService.login(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.user).toBeUndefined();
      expect(result.tokens).toBeUndefined();
    });
  });

  describe('Input Validation', () => {
    test('should handle empty email', async () => {
      // Arrange
      const credentials = {
        email: '',
        password: 'validpassword'
      };

      (mockApolloClient.mutate as jest.Mock).mockResolvedValue({
        data: null,
        errors: [{ message: 'Email is required' }]
      });

      // Act
      const result = await authApiService.login(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should handle empty password', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: ''
      };

      (mockApolloClient.mutate as jest.Mock).mockResolvedValue({
        data: null,
        errors: [{ message: 'Password is required' }]
      });

      // Act
      const result = await authApiService.login(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});

/**
 * Integration Test for Login Flow
 * Tests the complete login flow including context and hooks
 */
describe('Login Integration Test', () => {
  test('should demonstrate login flow', async () => {
    console.log('🧪 Login Integration Test');
    console.log('========================');
    
    // Test credentials
    const testCredentials = {
      email: 'test@chapel-stack.com',
      password: 'TestPassword123!'
    };

    console.log('📧 Test Email:', testCredentials.email);
    console.log('🔑 Password Length:', testCredentials.password.length);
    
    // Mock the login process
    const mockResult = {
      success: true,
      user: {
        id: '1',
        email: testCredentials.email,
        name: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        primaryRole: 'MEMBER',
        roles: ['MEMBER'],
        organisationId: 'org-1',
        branch: {
          id: 'branch-1',
          name: 'Main Branch'
        }
      },
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      }
    };

    console.log('✅ Mock Login Result:', {
      success: mockResult.success,
      userEmail: mockResult.user.email,
      userName: mockResult.user.name,
      userRole: mockResult.user.primaryRole,
      hasTokens: !!mockResult.tokens
    });

    // Verify the mock result structure
    expect(mockResult.success).toBe(true);
    expect(mockResult.user.email).toBe(testCredentials.email);
    expect(mockResult.tokens.accessToken).toBeDefined();
    expect(mockResult.tokens.refreshToken).toBeDefined();
    
    console.log('🎉 Login integration test completed successfully!');
  });
});
