'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContextEnhanced';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  duration?: number;
}

export default function LoginTestPage() {
  const { login, logout, user, isAuthenticated, isLoading } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: 'admin@chapel-stack.com',
    password: 'password123'
  });

  const updateTestResult = (name: string, updates: Partial<TestResult>) => {
    setTestResults(prev => prev.map(test => 
      test.name === name ? { ...test, ...updates } : test
    ));
  };

  const addTestResult = (test: TestResult) => {
    setTestResults(prev => [...prev, test]);
  };

  const runLoginTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    // Test 1: Valid Login
    addTestResult({
      name: 'Valid Login Test',
      status: 'running'
    });

    const startTime = Date.now();
    
    try {
      const result = await login({
        email: testCredentials.email,
        password: testCredentials.password
      });

      const duration = Date.now() - startTime;

      if (result.success) {
        updateTestResult('Valid Login Test', {
          status: 'passed',
          message: `Login successful for ${result.user?.email}`,
          duration
        });
      } else {
        updateTestResult('Valid Login Test', {
          status: 'failed',
          message: result.error?.message || 'Login failed',
          duration
        });
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      updateTestResult('Valid Login Test', {
        status: 'failed',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration
      });
    }

    // Test 2: Authentication State Check
    addTestResult({
      name: 'Authentication State Test',
      status: 'running'
    });

    setTimeout(() => {
      if (isAuthenticated && user) {
        updateTestResult('Authentication State Test', {
          status: 'passed',
          message: `User authenticated: ${user.email}`,
          duration: 100
        });
      } else {
        updateTestResult('Authentication State Test', {
          status: 'failed',
          message: 'User not authenticated after login',
          duration: 100
        });
      }
    }, 1000);

    // Test 3: User Data Validation
    addTestResult({
      name: 'User Data Validation Test',
      status: 'running'
    });

    setTimeout(() => {
      if (user) {
        const requiredFields = ['id', 'email', 'name', 'primaryRole'];
        const missingFields = requiredFields.filter(field => !user[field as keyof typeof user]);
        
        if (missingFields.length === 0) {
          updateTestResult('User Data Validation Test', {
            status: 'passed',
            message: 'All required user fields present',
            duration: 50
          });
        } else {
          updateTestResult('User Data Validation Test', {
            status: 'failed',
            message: `Missing fields: ${missingFields.join(', ')}`,
            duration: 50
          });
        }
      } else {
        updateTestResult('User Data Validation Test', {
          status: 'failed',
          message: 'No user data available',
          duration: 50
        });
      }
    }, 1500);

    // Test 4: Invalid Login Test
    addTestResult({
      name: 'Invalid Login Test',
      status: 'running'
    });

    setTimeout(async () => {
      const invalidStartTime = Date.now();
      
      try {
        const result = await login({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        });

        const invalidDuration = Date.now() - invalidStartTime;

        if (!result.success) {
          updateTestResult('Invalid Login Test', {
            status: 'passed',
            message: 'Invalid login correctly rejected',
            duration: invalidDuration
          });
        } else {
          updateTestResult('Invalid Login Test', {
            status: 'failed',
            message: 'Invalid login was accepted (security issue)',
            duration: invalidDuration
          });
        }
      } catch (error) {
        const invalidDuration = Date.now() - invalidStartTime;
        updateTestResult('Invalid Login Test', {
          status: 'passed',
          message: 'Invalid login correctly threw error',
          duration: invalidDuration
        });
      }
    }, 2000);

    // Test 5: Logout Test
    addTestResult({
      name: 'Logout Test',
      status: 'running'
    });

    setTimeout(async () => {
      const logoutStartTime = Date.now();
      
      try {
        await logout();
        const logoutDuration = Date.now() - logoutStartTime;

        setTimeout(() => {
          if (!isAuthenticated && !user) {
            updateTestResult('Logout Test', {
              status: 'passed',
              message: 'Logout successful, user cleared',
              duration: logoutDuration
            });
          } else {
            updateTestResult('Logout Test', {
              status: 'failed',
              message: 'User still authenticated after logout',
              duration: logoutDuration
            });
          }
        }, 500);
      } catch (error) {
        const logoutDuration = Date.now() - logoutStartTime;
        updateTestResult('Logout Test', {
          status: 'failed',
          message: `Logout error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          duration: logoutDuration
        });
      }
    }, 3000);

    setTimeout(() => {
      setIsRunningTests(false);
    }, 4000);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'running':
        return <ClockIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const failedTests = testResults.filter(t => t.status === 'failed').length;
  const totalTests = testResults.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Login Functionality Test Suite
            </h1>
            <p className="mt-2 text-gray-600">
              Test the authentication system to ensure login works correctly
            </p>
          </div>

          <div className="p-6">
            {/* Test Configuration */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Email
                  </label>
                  <input
                    type="email"
                    value={testCredentials.email}
                    onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isRunningTests}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Password
                  </label>
                  <input
                    type="password"
                    value={testCredentials.password}
                    onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isRunningTests}
                  />
                </div>
              </div>
            </div>

            {/* Current Auth State */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-md font-semibold text-gray-900 mb-2">Current Authentication State</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Authenticated:</span>{' '}
                  <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                    {isAuthenticated ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Loading:</span>{' '}
                  <span className={isLoading ? 'text-blue-600' : 'text-gray-600'}>
                    {isLoading ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">User:</span>{' '}
                  <span className="text-gray-600">
                    {user ? user.email : 'None'}
                  </span>
                </div>
              </div>
            </div>

            {/* Test Controls */}
            <div className="mb-6">
              <button
                onClick={runLoginTests}
                disabled={isRunningTests || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                {isRunningTests ? 'Running Tests...' : 'Run Login Tests'}
              </button>
            </div>

            {/* Test Results Summary */}
            {testResults.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-md font-semibold text-gray-900 mb-2">Test Results Summary</h3>
                <div className="flex space-x-6 text-sm">
                  <div className="text-green-600">
                    <span className="font-medium">Passed:</span> {passedTests}
                  </div>
                  <div className="text-red-600">
                    <span className="font-medium">Failed:</span> {failedTests}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Total:</span> {totalTests}
                  </div>
                </div>
              </div>
            )}

            {/* Test Results */}
            <div className="space-y-4">
              {testResults.map((test, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${getStatusColor(test.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(test.status)}
                      <span className="font-medium text-gray-900">{test.name}</span>
                    </div>
                    {test.duration && (
                      <span className="text-sm text-gray-500">{test.duration}ms</span>
                    )}
                  </div>
                  {test.message && (
                    <p className="mt-2 text-sm text-gray-600">{test.message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
