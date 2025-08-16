import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloLink, 
  from
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

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

// Optimized authentication link
const authLink = setContext((operation, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('chapel_access_token') : null;
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Streamlined error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      // Handle authentication errors
      if (message.includes('Unauthorized') || message.includes('Token')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('chapel_access_token');
          localStorage.removeItem('userData');
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/auth/login')) {
            setTimeout(() => {
              window.location.href = '/auth/login';
            }, 100);
          }
        }
      }
    });
  }

  if (networkError && 'statusCode' in networkError && networkError.statusCode === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chapel_access_token');
      localStorage.removeItem('userData');
      
      if (!window.location.pathname.includes('/auth/login')) {
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 100);
      }
    }
  }
});

// Create the Apollo Client with optimized cache
const client = new ApolloClient({
  link: from([
    errorLink,
    authLink,
    uploadLink,
  ]),
  cache: new InMemoryCache({
    // Optimize cache with better type policies
    typePolicies: {
      Query: {
        fields: {
          members: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          events: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first', // Use cache-first for better performance
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
  },
  // Enable query deduplication
  queryDeduplication: true,
  // Assume immutable cache for better performance
  assumeImmutableResults: true,
});

export default client;
