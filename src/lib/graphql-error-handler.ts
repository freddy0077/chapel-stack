import { ApolloError } from '@apollo/client';
import toast from 'react-hot-toast';

/**
 * Extract user-friendly error message from Apollo Error
 */
export function extractErrorMessage(error: ApolloError | Error): string {
  if (error instanceof ApolloError) {
    // Check for GraphQL errors first
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const firstError = error.graphQLErrors[0];
      // Try to get the original error message from extensions
      const originalMessage = firstError.extensions?.originalError?.message;
      if (originalMessage && typeof originalMessage === 'string') {
        return originalMessage;
      }
      // Fall back to the error message
      return firstError.message;
    }

    // Check for network errors
    if (error.networkError) {
      return 'Network error. Please check your connection.';
    }

    // Fall back to the error message
    return error.message;
  }

  // For regular errors
  return error.message || 'An unexpected error occurred';
}

/**
 * Show error toast from Apollo Error
 */
export function showErrorToast(error: ApolloError | Error, customMessage?: string) {
  const message = customMessage || extractErrorMessage(error);
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
  });
}

/**
 * Handle mutation error with optional custom message
 */
export function handleMutationError(
  error: ApolloError | Error,
  options?: {
    customMessage?: string;
    silent?: boolean;
    onError?: (error: ApolloError | Error) => void;
  }
) {
  console.error('Mutation error:', error);

  // Call custom error handler if provided
  if (options?.onError) {
    options.onError(error);
  }

  // Show toast unless silent mode is enabled
  if (!options?.silent) {
    showErrorToast(error, options?.customMessage);
  }
}

/**
 * Context key to disable global error toasts for specific operations
 */
export const SUPPRESS_ERROR_TOAST_CONTEXT = 'suppressErrorToast';

/**
 * Check if error toast should be suppressed for this operation
 */
export function shouldSuppressErrorToast(operation: any): boolean {
  return operation?.getContext()?.[SUPPRESS_ERROR_TOAST_CONTEXT] === true;
}
