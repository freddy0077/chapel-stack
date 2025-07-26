/**
 * Manual Login Test Utility
 * This file provides functions to test the login functionality manually
 * Can be imported and used in components or run in browser console
 */

import { AuthApiService } from '@/lib/auth/auth-api';
import { ApolloClient, InMemoryCache } from '@apollo/client';

interface TestResult {
  testName: string;
  success: boolean;
  message: string;
  duration: number;
  data?: any;
}

interface LoginTestConfig {
  email: string;
  password: string;
  apiUrl?: string;
}

/**
 * Create a test Apollo Client for login testing
 */
function createTestApolloClient(apiUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql') {
  return new ApolloClient({
    uri: apiUrl,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
}

/**
 * Test valid login credentials
 */
export async function testValidLogin(config: LoginTestConfig): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    console.log('🧪 Testing valid login for:', config.email);
    
    const apolloClient = createTestApolloClient(config.apiUrl);
    const authService = new AuthApiService(apolloClient);
    
    const result = await authService.login({
      email: config.email,
      password: config.password,
    });
    
    const duration = Date.now() - startTime;
    
    if (result.success && result.user && result.tokens) {
      return {
        testName: 'Valid Login Test',
        success: true,
        message: `Login successful for ${result.user.email}. Role: ${result.user.primaryRole}`,
        duration,
        data: {
          userId: result.user.id,
          userEmail: result.user.email,
          userName: result.user.name,
          userRole: result.user.primaryRole,
          hasAccessToken: !!result.tokens.accessToken,
          hasRefreshToken: !!result.tokens.refreshToken,
        }
      };
    } else {
      return {
        testName: 'Valid Login Test',
        success: false,
        message: result.error?.message || 'Login failed without error message',
        duration,
        data: result
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      testName: 'Valid Login Test',
      success: false,
      message: `Login test threw error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      duration,
      data: { error }
    };
  }
}

/**
 * Test invalid login credentials
 */
export async function testInvalidLogin(): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    console.log('🧪 Testing invalid login credentials');
    
    const apolloClient = createTestApolloClient();
    const authService = new AuthApiService(apolloClient);
    
    const result = await authService.login({
      email: 'invalid@example.com',
      password: 'wrongpassword',
    });
    
    const duration = Date.now() - startTime;
    
    if (!result.success) {
      return {
        testName: 'Invalid Login Test',
        success: true,
        message: 'Invalid credentials correctly rejected',
        duration,
        data: { errorMessage: result.error?.message }
      };
    } else {
      return {
        testName: 'Invalid Login Test',
        success: false,
        message: 'Security Issue: Invalid credentials were accepted!',
        duration,
        data: result
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      testName: 'Invalid Login Test',
      success: true, // Error is expected for invalid credentials
      message: 'Invalid credentials correctly threw error',
      duration,
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

/**
 * Test empty credentials
 */
export async function testEmptyCredentials(): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    console.log('🧪 Testing empty credentials');
    
    const apolloClient = createTestApolloClient();
    const authService = new AuthApiService(apolloClient);
    
    const result = await authService.login({
      email: '',
      password: '',
    });
    
    const duration = Date.now() - startTime;
    
    if (!result.success) {
      return {
        testName: 'Empty Credentials Test',
        success: true,
        message: 'Empty credentials correctly rejected',
        duration,
        data: { errorMessage: result.error?.message }
      };
    } else {
      return {
        testName: 'Empty Credentials Test',
        success: false,
        message: 'Security Issue: Empty credentials were accepted!',
        duration,
        data: result
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      testName: 'Empty Credentials Test',
      success: true, // Error is expected for empty credentials
      message: 'Empty credentials correctly threw error',
      duration,
      data: { error: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

/**
 * Run all login tests
 */
export async function runAllLoginTests(config: LoginTestConfig): Promise<TestResult[]> {
  console.log('🚀 Starting comprehensive login test suite...');
  console.log('===============================================');
  
  const results: TestResult[] = [];
  
  // Test 1: Valid Login
  console.log('\n1️⃣ Running valid login test...');
  const validLoginResult = await testValidLogin(config);
  results.push(validLoginResult);
  console.log(`   ${validLoginResult.success ? '✅' : '❌'} ${validLoginResult.message} (${validLoginResult.duration}ms)`);
  
  // Test 2: Invalid Login
  console.log('\n2️⃣ Running invalid login test...');
  const invalidLoginResult = await testInvalidLogin();
  results.push(invalidLoginResult);
  console.log(`   ${invalidLoginResult.success ? '✅' : '❌'} ${invalidLoginResult.message} (${invalidLoginResult.duration}ms)`);
  
  // Test 3: Empty Credentials
  console.log('\n3️⃣ Running empty credentials test...');
  const emptyCredentialsResult = await testEmptyCredentials();
  results.push(emptyCredentialsResult);
  console.log(`   ${emptyCredentialsResult.success ? '✅' : '❌'} ${emptyCredentialsResult.message} (${emptyCredentialsResult.duration}ms)`);
  
  // Summary
  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  console.log(`⏱️  Total Duration: ${results.reduce((sum, r) => sum + r.duration, 0)}ms`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All login tests passed! Authentication system is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the authentication system.');
  }
  
  return results;
}

/**
 * Quick test function for browser console
 * Usage: testLogin('your-email@example.com', 'your-password')
 */
export async function testLogin(email: string, password: string) {
  return await runAllLoginTests({ email, password });
}

/**
 * Test the login functionality with default credentials
 * This can be called from components or browser console
 */
export async function quickLoginTest() {
  const defaultConfig: LoginTestConfig = {
    email: 'admin@chapel-stack.com',
    password: 'password123'
  };
  
  console.log('🔍 Running quick login test with default credentials...');
  return await runAllLoginTests(defaultConfig);
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  (window as any).testLogin = testLogin;
  (window as any).quickLoginTest = quickLoginTest;
  (window as any).runAllLoginTests = runAllLoginTests;
}
