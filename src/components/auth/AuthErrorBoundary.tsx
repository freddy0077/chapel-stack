/**
 * Authentication Error Boundary for Phase 2 Implementation
 * Comprehensive error handling with user-friendly recovery options
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AuthError } from '@/types/auth-enhanced.types';
import { AuthUtils } from '@/lib/auth/auth-reducer';
import { authStorage } from '@/lib/auth/auth-storage';

interface Props {
  children: ReactNode;
  fallback?: (error: AuthError, retry: () => void) => ReactNode;
  onError?: (error: AuthError, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: AuthError | null;
  errorId: string | null;
}

/**
 * Authentication Error Boundary Component
 */
export class AuthErrorBoundary extends Component<Props, State> {
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Convert generic error to AuthError
    const authError = AuthUtils.createAuthError(
      'COMPONENT_ERROR',
      error.message || 'An unexpected error occurred in the authentication system',
      error,
      true
    );

    return {
      hasError: true,
      error: authError,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const authError = this.state.error || AuthUtils.createAuthError(
      'COMPONENT_ERROR',
      error.message,
      { error, errorInfo },
      true
    );

    // Log error for debugging
    console.error('🚨 Authentication Error Boundary caught error:', {
      error: authError,
      errorInfo,
      errorId: this.state.errorId,
      retryCount: this.retryCount,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(authError, errorInfo);
    }

    // Send error to monitoring service (if available)
    this.reportError(authError, errorInfo);
  }

  /**
   * Report error to monitoring service
   */
  private reportError(error: AuthError, errorInfo: ErrorInfo) {
    try {
      // Here you would integrate with your error monitoring service
      // e.g., Sentry, LogRocket, Bugsnag, etc.
      
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error, {
          tags: {
            component: 'AuthErrorBoundary',
            errorCode: error.code,
            recoverable: error.recoverable,
          },
          extra: {
            errorInfo,
            errorId: this.state.errorId,
            retryCount: this.retryCount,
            timestamp: error.timestamp,
          },
        });
      }

      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.group('🚨 Authentication Error Report');
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
        console.error('Error ID:', this.state.errorId);
        console.error('Retry Count:', this.retryCount);
        console.groupEnd();
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  /**
   * Retry the failed operation
   */
  private handleRetry = () => {
    if (this.retryCount >= this.maxRetries) {
      console.log('🔄 Maximum retry attempts reached');
      return;
    }

    this.retryCount++;
    console.log(`🔄 Retrying authentication operation (attempt ${this.retryCount}/${this.maxRetries})`);

    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  /**
   * Reset error state
   */
  private handleReset = () => {
    this.retryCount = 0;
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  /**
   * Clear authentication data and redirect to login
   */
  private handleClearAuth = () => {
    console.log('🧹 Clearing authentication data due to error');
    authStorage.clear();
    
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Default error UI
      return (
        <AuthErrorFallback
          error={this.state.error}
          errorId={this.state.errorId}
          retryCount={this.retryCount}
          maxRetries={this.maxRetries}
          onRetry={this.handleRetry}
          onReset={this.handleReset}
          onClearAuth={this.handleClearAuth}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Authentication Error Fallback Component
 */
interface AuthErrorFallbackProps {
  error: AuthError;
  errorId: string | null;
  retryCount: number;
  maxRetries: number;
  onRetry: () => void;
  onReset: () => void;
  onClearAuth: () => void;
}

function AuthErrorFallback({
  error,
  errorId,
  retryCount,
  maxRetries,
  onRetry,
  onReset,
  onClearAuth,
}: AuthErrorFallbackProps) {
  const canRetry = retryCount < maxRetries && error.recoverable;
  const isAuthError = ['TOKEN_EXPIRED', 'INVALID_CREDENTIALS', 'UNAUTHENTICATED'].includes(error.code);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Error Title */}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isAuthError ? 'Authentication Error' : 'Something went wrong'}
          </h2>

          {/* Error Message */}
          <p className="mt-2 text-sm text-gray-600">
            {AuthUtils.formatErrorMessage(error)}
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Technical Details
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded-md text-xs text-gray-700 font-mono">
                <p><strong>Error Code:</strong> {error.code}</p>
                <p><strong>Error ID:</strong> {errorId}</p>
                <p><strong>Timestamp:</strong> {new Date(error.timestamp).toLocaleString()}</p>
                <p><strong>Recoverable:</strong> {error.recoverable ? 'Yes' : 'No'}</p>
                <p><strong>Retry Count:</strong> {retryCount}/{maxRetries}</p>
                {error.details && (
                  <div className="mt-2">
                    <strong>Details:</strong>
                    <pre className="mt-1 whitespace-pre-wrap">
                      {JSON.stringify(error.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          {/* Retry Button */}
          {canRetry && (
            <button
              onClick={onRetry}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again ({maxRetries - retryCount} attempts left)
            </button>
          )}

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset
          </button>

          {/* Clear Auth Button (for auth errors) */}
          {isAuthError && (
            <button
              onClick={onClearAuth}
              className="group relative w-full flex justify-center py-2 px-4 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign In Again
            </button>
          )}

          {/* Contact Support */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              If this problem persists, please{' '}
              <a
                href="/support"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                contact support
              </a>
              {errorId && (
                <>
                  {' '}with error ID: <code className="font-mono">{errorId}</code>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for handling authentication errors in functional components
 */
export function useAuthErrorHandler() {
  const handleError = React.useCallback((error: AuthError) => {
    console.error('🚨 Authentication error handled:', error);

    // Format error message for user display
    const userMessage = AuthUtils.formatErrorMessage(error);

    // Show toast notification if available
    if (typeof window !== 'undefined' && (window as any).toast) {
      (window as any).toast.error(userMessage);
    }

    // Handle specific error types
    switch (error.code) {
      case 'TOKEN_EXPIRED':
      case 'UNAUTHENTICATED':
        // Clear auth data and redirect to login
        authStorage.clear();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        break;

      case 'NETWORK_ERROR':
        // Show network error message
        console.log('🌐 Network error, user should check connection');
        break;

      case 'RATE_LIMITED':
        // Show rate limit message
        console.log('⏰ Rate limited, user should wait before retrying');
        break;

      default:
        // Generic error handling
        console.log('⚠️ Generic error, showing user-friendly message');
    }

    return userMessage;
  }, []);

  return { handleError };
}

/**
 * Higher-order component for wrapping components with auth error boundary
 */
export function withAuthErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: (error: AuthError, retry: () => void) => ReactNode
) {
  return function WrappedComponent(props: T) {
    return (
      <AuthErrorBoundary fallback={fallback}>
        <Component {...props} />
      </AuthErrorBoundary>
    );
  };
}

export default AuthErrorBoundary;
