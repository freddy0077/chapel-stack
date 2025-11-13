import { ApolloClient, InMemoryCache, ApolloLink, from } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { CachePersistor, LocalStorageWrapper } from "apollo3-cache-persist";
import toast from "react-hot-toast";
import { shouldSuppressErrorToast } from "./graphql-error-handler";

// Define the backend GraphQL API endpoint
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/graphql";

// Create a single HTTP link with file upload support
const uploadLink = createUploadLink({
  uri: API_URL,
  credentials: "include",
  headers: {
    "Apollo-Require-Preflight": "true",
  },
});

// Optimized authentication link
const authLink = setContext((operation, { headers }) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("chapel_access_token")
      : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Enhanced error handling with toast notifications
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  // Check if error toasts should be suppressed for this operation
  const suppressToast = shouldSuppressErrorToast(operation);

  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      console.error(`[GraphQL error]: ${message}`, extensions);

      // Handle authentication errors (always show these)
      if (message.includes("Unauthorized") || message.includes("Token") || message.includes("Not authenticated")) {
        if (typeof window !== "undefined") {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("chapel_access_token");
          localStorage.removeItem("userData");

          // Only redirect if not already on login page
          if (!window.location.pathname.includes("/auth/login")) {
            setTimeout(() => {
              window.location.href = "/auth/login";
            }, 100);
          }
        }
      } else if (!suppressToast) {
        // Show toast for all other GraphQL errors (unless suppressed)
        if (typeof window !== "undefined") {
          // Extract user-friendly error message
          const errorMessage = extensions?.originalError?.message || message;
          toast.error(errorMessage, {
            duration: 5000,
            position: "top-right",
          });
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError.message}`);
    
    if ("statusCode" in networkError && networkError.statusCode === 401) {
      if (typeof window !== "undefined") {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("chapel_access_token");
        localStorage.removeItem("userData");

        if (!window.location.pathname.includes("/auth/login")) {
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 100);
        }
      }
    } else if (!suppressToast) {
      // Show toast for network errors (unless suppressed)
      if (typeof window !== "undefined") {
        toast.error("Network error. Please check your connection.", {
          duration: 5000,
          position: "top-right",
        });
      }
    }
  }
});

// Enhanced cache with better type policies and TTL
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Members list with pagination support
        members: {
          keyArgs: ["filters", "search"],
          merge(existing = [], incoming, { args }) {
            // If it's a new search/filter, replace the cache
            if (args?.skip === 0) {
              return incoming;
            }
            // Otherwise append for pagination
            return [...existing, ...incoming];
          },
        },
        // Events with cache-and-network strategy
        events: {
          keyArgs: ["filters"],
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        // Groups with stable caching
        groups: {
          keyArgs: ["filters"],
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        // Attendance sessions
        attendanceSessions: {
          keyArgs: ["filters"],
          merge(existing = [], incoming) {
            return incoming;
          },
        },
        // Financial transactions
        transactions: {
          keyArgs: ["filters", "dateRange"],
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
    // Cache individual entities by ID
    Member: {
      keyFields: ["id"],
    },
    Event: {
      keyFields: ["id"],
    },
    Group: {
      keyFields: ["id"],
    },
    Transaction: {
      keyFields: ["id"],
    },
  },
});

// Initialize cache persistor for offline support
let persistor: CachePersistor<any> | null = null;

if (typeof window !== "undefined") {
  persistor = new CachePersistor({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
    key: "chapel-apollo-cache",
    maxSize: 5242880, // 5MB cache limit
    debug: process.env.NODE_ENV === "development",
  });

  // Restore cache on app load
  persistor.restore().catch((error) => {
    console.error("Failed to restore Apollo cache:", error);
  });
}

// Create the Apollo Client with optimized cache
const client = new ApolloClient({
  link: from([errorLink, authLink, uploadLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      fetchPolicy: "cache-and-network", // Better UX: show cache immediately, update with network
      nextFetchPolicy: "cache-first", // After first fetch, use cache
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "cache-first", // Prioritize cache for queries
    },
    mutate: {
      errorPolicy: "all",
    },
  },
  // Enable query deduplication
  queryDeduplication: true,
  // Assume immutable cache for better performance
  assumeImmutableResults: true,
});

// Export persistor for manual cache management
export { persistor };

// Helper function to clear cache
export const clearApolloCache = async () => {
  if (persistor) {
    await persistor.purge();
  }
  await client.clearStore();
};

export default client;
