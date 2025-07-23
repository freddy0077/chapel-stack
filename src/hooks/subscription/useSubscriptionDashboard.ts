import { useQuery } from '@apollo/client';
import {
  GET_RECENT_SUBSCRIPTIONS,
  GET_ORGANIZATION_STATS,
  type Subscription,
  type OrganizationStats,
  type SubscriptionFilterInput,
} from '@/graphql/subscription-management';

// Note: subscriptionStats GraphQL query doesn't exist in backend
// We'll calculate basic stats from the subscriptions data
export const useSubscriptionStats = () => {
  const { data, loading, error, refetch } = useQuery(GET_RECENT_SUBSCRIPTIONS, {
    variables: { 
      filter: {
        take: 1000, // Get more data to calculate stats
      }
    },
    errorPolicy: 'all',
  });

  const subscriptions = (data?.getSubscriptions || []) as Subscription[];
  
  // Calculate stats from subscription data
  const stats = {
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: subscriptions.filter(s => s.status === 'ACTIVE').length,
    cancelledSubscriptions: subscriptions.filter(s => s.status === 'CANCELLED').length,
    trialingSubscriptions: subscriptions.filter(s => s.status === 'TRIALING').length,
    pastDueSubscriptions: subscriptions.filter(s => s.status === 'PAST_DUE').length,
    totalRevenue: 0, // Would need payment data to calculate
    monthlyRevenue: 0, // Would need payment data to calculate
  };

  return {
    stats,
    loading,
    error,
    refetch,
  };
};

export const useRecentSubscriptions = (filter?: SubscriptionFilterInput) => {
  const { data, loading, error, refetch } = useQuery(GET_RECENT_SUBSCRIPTIONS, {
    variables: { 
      filter: {
        ...filter,
        take: filter?.take || 10,
      }
    },
    errorPolicy: 'all',
  });

  return {
    subscriptions: (data?.getSubscriptions || []) as Subscription[],
    loading,
    error,
    refetch,
  };
};

// Note: subscriptionPayments GraphQL query doesn't exist in backend
// This is a placeholder that returns empty data
export const useSubscriptionPayments = () => {
  return {
    payments: [],
    loading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
};

export const useOrganizationDashboardStats = () => {
  const { data, loading, error, refetch } = useQuery(GET_ORGANIZATION_STATS, {
    errorPolicy: 'all',
  });

  return {
    organizationStats: data?.organizationStats as OrganizationStats | undefined,
    loading,
    error,
    refetch,
  };
};

// Combined dashboard hook for convenience
export const useSubscriptionDashboard = () => {
  const subscriptionStats = useSubscriptionStats();
  const organizationStats = useOrganizationDashboardStats();
  const recentSubscriptions = useRecentSubscriptions({
    take: 5,
  });
  const recentPayments = useSubscriptionPayments(); // Returns empty data

  return {
    subscriptionStats,
    organizationStats,
    recentSubscriptions,
    recentPayments,
    loading: subscriptionStats.loading || organizationStats.loading || recentSubscriptions.loading,
    refetchAll: () => {
      subscriptionStats.refetch();
      organizationStats.refetch();
      recentSubscriptions.refetch();
      recentPayments.refetch();
    },
  };
};
