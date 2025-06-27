import { 
  ApolloClient, 
  InMemoryCache, 
  HttpLink, 
  ApolloLink, 
  from, 
  Observable
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { REFRESH_TOKEN_MUTATION } from '../graphql/mutations/auth';
import Cookies from 'js-cookie';

// Define the backend GraphQL API endpoint
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/graphql';

console.log('Apollo Client - Using API URL:', API_URL);

// Create a link for HTTP requests
const httpLink = new HttpLink({
  uri: API_URL,
  credentials: 'include', // Important for cookie-based authentication
  fetchOptions: {
    mode: 'cors', // Ensure CORS mode is used
  },
  headers: {
    'Apollo-Require-Preflight': 'true', // Ensures proper preflight requests
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

// Authentication link that adds the auth token to requests
const authLink = new ApolloLink((operation, forward) => {
  // Get the authentication token from local storage if it exists
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

// Flag to prevent multiple token refresh requests
let isRefreshing = false;
// Array to hold requests that are waiting for a new token
let pendingRequests: unknown[] = [];

const resolvePendingRequests = () => {
  pendingRequests.forEach(p => p.resolve());
  pendingRequests = [];
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // Diagnostic log to inspect the exact error response
  console.log('APOLLO CLIENT ERROR LINK TRIGGERED', {
    graphQLErrors,
    networkError,
    operationName: operation.operationName,
  });

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }

  if (graphQLErrors) {
    const authError = graphQLErrors.find(
      (err) => err.extensions?.code === 'UNAUTHENTICATED' || err.message.includes('Unauthorized'),
    );

    if (authError) {
      return new Observable(observer => {
        if (isRefreshing) {
          pendingRequests.push({
            resolve: () => {
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };
              forward(operation).subscribe(subscriber);
            },
          });
          return;
        }

        isRefreshing = true;
        const refreshToken = Cookies.get('refreshToken');

        if (!refreshToken) {
          console.error('No refresh token available. Logging out.');
          isRefreshing = false;
          observer.error(new Error('Invalid credentials!'));
          return;
        }

        fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Ensure cookies are sent with the refresh request
          body: JSON.stringify({
            query: REFRESH_TOKEN_MUTATION.loc!.source.body,
            variables: { input: { refreshToken } },
          }),
        })
          .then(res => res.json())
          .then(response => {
            if (response.errors || !response.data?.refreshToken?.accessToken) {
              throw new Error('Failed to refresh token');
            }

            const { accessToken, refreshToken: newRefreshToken } = response.data.refreshToken;
            localStorage.setItem('authToken', accessToken);
            if (newRefreshToken) {
              Cookies.set('refreshToken', newRefreshToken, {
                expires: 30,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
              });
            }

            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                authorization: `Bearer ${accessToken}`,
              },
            }));

            const subscriber = {
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            };
            forward(operation).subscribe(subscriber);
          })
          .catch(error => {
            console.error('Error during token refresh, logging out.', error);
            // Clear all auth data
            Cookies.remove('refreshToken', { path: '/' });
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            // Redirect to login page to force re-authentication
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login?session_expired=true';
            }

            observer.error(error); // Propagate error to the original operation
          })
          .finally(() => {
            isRefreshing = false;
            resolvePendingRequests();
          });
      });
    }

    graphQLErrors.forEach(({ message, locations, path }) => {
      if (!message.includes('Unauthorized')) {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      }
    });
  }
});

// Create the Apollo Client
export const client = new ApolloClient({
  link: from([errorLink, authLink, loggerLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
