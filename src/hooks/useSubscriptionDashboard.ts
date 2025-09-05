import { useQuery } from "@apollo/client";
import {
  GET_SUBSCRIPTION_DASHBOARD_STATS,
  GET_SUBSCRIPTION_RECENT_ACTIVITY,
  GET_SUBSCRIPTION_TAB_COUNTS,
  SubscriptionDashboardStats,
  SubscriptionActivityItem,
  SubscriptionTabCounts,
} from "../graphql/subscription-management";

// Hook for dashboard statistics
export const useSubscriptionDashboardStats = () => {
  const { data, loading, error, refetch } = useQuery<{
    subscriptionDashboardStats: SubscriptionDashboardStats;
  }>(GET_SUBSCRIPTION_DASHBOARD_STATS, {
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  return {
    stats: data?.subscriptionDashboardStats,
    loading,
    error,
    refetch,
  };
};

// Hook for recent activity
export const useSubscriptionRecentActivity = (limit: number = 10) => {
  const { data, loading, error, refetch } = useQuery<{
    subscriptionRecentActivity: SubscriptionActivityItem[];
  }>(GET_SUBSCRIPTION_RECENT_ACTIVITY, {
    variables: { limit },
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  return {
    activities: data?.subscriptionRecentActivity || [],
    loading,
    error,
    refetch,
  };
};

// Hook for tab badge counts
export const useSubscriptionTabCounts = () => {
  const { data, loading, error, refetch } = useQuery<{
    subscriptionTabCounts: SubscriptionTabCounts;
  }>(GET_SUBSCRIPTION_TAB_COUNTS, {
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  return {
    counts: data?.subscriptionTabCounts,
    loading,
    error,
    refetch,
  };
};

// Combined hook for all dashboard data
export const useSubscriptionDashboard = () => {
  const statsQuery = useSubscriptionDashboardStats();
  const activityQuery = useSubscriptionRecentActivity(10);
  const countsQuery = useSubscriptionTabCounts();

  const loading =
    statsQuery.loading || activityQuery.loading || countsQuery.loading;
  const error = statsQuery.error || activityQuery.error || countsQuery.error;

  const refetchAll = async () => {
    await Promise.all([
      statsQuery.refetch(),
      activityQuery.refetch(),
      countsQuery.refetch(),
    ]);
  };

  return {
    stats: statsQuery.stats,
    activities: activityQuery.activities,
    counts: countsQuery.counts,
    loading,
    error,
    refetch: refetchAll,
  };
};
