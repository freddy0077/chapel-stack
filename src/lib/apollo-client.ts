import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloLink, 
  from
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { createHttpLink } from '@apollo/client';

// Define the backend GraphQL API endpoint
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/graphql';

// Create a single HTTP link with file upload support
const uploadLink = createUploadLink({
  uri: API_URL,
  credentials: 'include',
  headers: {
    'Apollo-Require-Preflight': 'true',
  },
});

// Simplified authentication link for new auth system
const isDev = process.env.NODE_ENV === 'development';

const authLink = setContext((operation, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('chapel_access_token') : null;
  
  // Reduced logging - only for critical operations
  if (isDev && operation.operationName && ['login', 'refreshToken'].includes(operation.operationName)) {
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Simplified error handling - no automatic token refresh
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      // Removed console.error for performance
      
      // Handle authentication errors - but don't redirect immediately to avoid loops
      if (message.includes('Unauthorized') || message.includes('Token')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('chapel_access_token');
          localStorage.removeItem('userData');
          // Clear auth cookie
          if (typeof document !== 'undefined') {
            document.cookie = 'chapel_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          }
          
          // Only redirect if not already on login page to prevent loops
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
            setTimeout(() => {
              window.location.href = '/auth/login';
            }, 100);
          }
        }
      }
    });
  }

  if (networkError) {
    // Removed console.error for performance
    
    // Handle 401 errors - but don't redirect immediately to avoid loops
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('chapel_access_token');
        localStorage.removeItem('userData');
        // Clear auth cookie
        if (typeof document !== 'undefined') {
          document.cookie = 'chapel_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        
        // Only redirect if not already on login page to prevent loops
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 100);
        }
      }
    }
  }
});

// Create the Apollo Client
const client = new ApolloClient({
  link: from([
    errorLink,
    authLink,
    uploadLink,
  ]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Add any cache policies here if needed
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default client;
