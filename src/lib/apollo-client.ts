import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloLink, 
  from
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from '@apollo/client/link/error';

// Define the backend GraphQL API endpoint
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/graphql';

console.log('Apollo Client - Using API URL:', API_URL);

// Create a single HTTP link with file upload support
const uploadLink = createUploadLink({
  uri: API_URL,
  credentials: 'include',
  headers: {
    'Apollo-Require-Preflight': 'true',
  },
});

// Debug middleware
const loggerLink = new ApolloLink((operation, forward) => {
  console.log(`[GraphQL Request]: ${operation.operationName}`, operation.variables);
  return forward(operation).map((result) => {
    console.log(`[GraphQL Response]: ${operation.operationName}`, result);
    return result;
  });
});

// Simplified authentication link for new auth system
const authLink = new ApolloLink((operation, forward) => {
  // Get the authentication token from local storage
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  // Add the authorization header to the operation
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }));

  return forward(operation);
});

// Simplified error handling - no automatic token refresh
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  console.log('Apollo Client Error:', {
    graphQLErrors,
    networkError,
    operation: operation.operationName
  });

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`);
      
      // Handle authentication errors - but don't redirect immediately to avoid loops
      if (message.includes('Unauthorized') || message.includes('Token')) {
        console.log('Authentication error detected, clearing token');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          // Clear auth cookie
          if (typeof document !== 'undefined') {
            document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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
    console.error(`Network error: ${networkError}`);
    
    // Handle 401 errors - but don't redirect immediately to avoid loops
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      console.log('401 error detected, clearing token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        // Clear auth cookie
        if (typeof document !== 'undefined') {
          document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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
    loggerLink,
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
