import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useMemo } from "react";
import {
  CREATE_ORGANIZATION_SUBSCRIPTION,
  GET_ORGANIZATION_SUBSCRIPTION_STATUS,
  GET_SUBSCRIPTION_LIFECYCLE_STATS,
  TRIGGER_SUBSCRIPTION_LIFECYCLE_CHECK,
  type CreateOrganizationSubscriptionInput,
  type OrganizationSubscriptionStatus,
  type SubscriptionLifecycleStats,
  type SubscriptionLifecycleResult,
  type Subscription,
} from "@/graphql/subscription-management";

// Hook for creating organization subscriptions
export const useCreateOrganizationSubscription = () => {
  const [createSubscription, { loading, error, data }] = useMutation(
    CREATE_ORGANIZATION_SUBSCRIPTION,
    {
      errorPolicy: "all",
    },
  );

  const createOrganizationSubscription = useCallback(
    async (
      organizationId: string,
      planId: string,
      input: CreateOrganizationSubscriptionInput,
    ): Promise<Subscription> => {
      const result = await createSubscription({
        variables: {
          organizationId,
          planId,
          input,
        },
      });

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data?.createOrganizationSubscription;
    },
    [createSubscription],
  );

  return useMemo(
    () => ({
      createOrganizationSubscription,
      loading,
      error,
      data: data?.createOrganizationSubscription,
    }),
    [createOrganizationSubscription, loading, error, data],
  );
};

// Hook for getting organization subscription status
export const useOrganizationSubscriptionStatus = (organizationId?: string) => {
  // Stabilize the organizationId to prevent unnecessary re-renders
  const stableOrgId = useMemo(() => organizationId, [organizationId]);

  const { data, loading, error, refetch } = useQuery(
    GET_ORGANIZATION_SUBSCRIPTION_STATUS,
    {
      variables: { organizationId: stableOrgId },
      skip: !stableOrgId,
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: false, // Prevent unnecessary re-renders
    },
  );

  const subscriptionStatus = useMemo(
    () =>
      data?.organizationSubscriptionStatus as
        | OrganizationSubscriptionStatus
        | undefined,
    [data?.organizationSubscriptionStatus],
  );

  const hasActiveSubscription = useMemo(
    () => subscriptionStatus?.hasActiveSubscription ?? false,
    [subscriptionStatus?.hasActiveSubscription],
  );
  const isInGracePeriod = useMemo(
    () => subscriptionStatus?.isInGracePeriod ?? false,
    [subscriptionStatus?.isInGracePeriod],
  );
  const daysUntilExpiry = useMemo(
    () => subscriptionStatus?.daysUntilExpiry,
    [subscriptionStatus?.daysUntilExpiry],
  );
  const subscription = useMemo(
    () => subscriptionStatus?.subscription,
    [subscriptionStatus?.subscription],
  );
  const isExpiringSoon = useMemo(
    () => (subscriptionStatus?.daysUntilExpiry ?? 999) <= 7,
    [subscriptionStatus?.daysUntilExpiry],
  );
  const isExpired = useMemo(
    () => (subscriptionStatus?.daysUntilExpiry ?? 999) < 0,
    [subscriptionStatus?.daysUntilExpiry],
  );

  // Stabilize the refetch function
  const stableRefetch = useCallback(() => {
    if (stableOrgId) {
      return refetch();
    }
    return Promise.resolve();
  }, [refetch, stableOrgId]);

  return useMemo(
    () => ({
      subscriptionStatus,
      loading,
      error,
      refetch: stableRefetch,
      hasActiveSubscription,
      isInGracePeriod,
      daysUntilExpiry,
      subscription,
      isExpiringSoon,
      isExpired,
    }),
    [
      subscriptionStatus,
      loading,
      error,
      stableRefetch,
      hasActiveSubscription,
      isInGracePeriod,
      daysUntilExpiry,
      subscription,
      isExpiringSoon,
      isExpired,
    ],
  );
};

// Hook for subscription lifecycle statistics
export const useSubscriptionLifecycleStats = () => {
  const { data, loading, error, refetch } = useQuery(
    GET_SUBSCRIPTION_LIFECYCLE_STATS,
    {
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: false, // Prevent unnecessary re-renders
    },
  );

  const stats = useMemo(
    () =>
      data?.subscriptionLifecycleStats as
        | SubscriptionLifecycleStats
        | undefined,
    [data?.subscriptionLifecycleStats],
  );

  const totalSubscriptions = useMemo(
    () => stats?.totalSubscriptions ?? 0,
    [stats?.totalSubscriptions],
  );
  const activeSubscriptions = useMemo(
    () => stats?.activeSubscriptions ?? 0,
    [stats?.activeSubscriptions],
  );
  const trialSubscriptions = useMemo(
    () => stats?.trialSubscriptions ?? 0,
    [stats?.trialSubscriptions],
  );
  const pastDueSubscriptions = useMemo(
    () => stats?.pastDueSubscriptions ?? 0,
    [stats?.pastDueSubscriptions],
  );
  const cancelledSubscriptions = useMemo(
    () => stats?.cancelledSubscriptions ?? 0,
    [stats?.cancelledSubscriptions],
  );
  const expiringIn7Days = useMemo(
    () => stats?.expiringIn7Days ?? 0,
    [stats?.expiringIn7Days],
  );
  const expiringIn30Days = useMemo(
    () => stats?.expiringIn30Days ?? 0,
    [stats?.expiringIn30Days],
  );
  const healthySubscriptions = useMemo(
    () => (stats?.activeSubscriptions ?? 0) + (stats?.trialSubscriptions ?? 0),
    [stats?.activeSubscriptions, stats?.trialSubscriptions],
  );
  const atRiskSubscriptions = useMemo(
    () => (stats?.pastDueSubscriptions ?? 0) + (stats?.expiringIn7Days ?? 0),
    [stats?.pastDueSubscriptions, stats?.expiringIn7Days],
  );

  // Stabilize the refetch function
  const stableRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  return useMemo(
    () => ({
      stats,
      loading,
      error,
      refetch: stableRefetch,
      totalSubscriptions,
      activeSubscriptions,
      trialSubscriptions,
      pastDueSubscriptions,
      cancelledSubscriptions,
      expiringIn7Days,
      expiringIn30Days,
      healthySubscriptions,
      atRiskSubscriptions,
    }),
    [
      stats,
      loading,
      error,
      stableRefetch,
      totalSubscriptions,
      activeSubscriptions,
      trialSubscriptions,
      pastDueSubscriptions,
      cancelledSubscriptions,
      expiringIn7Days,
      expiringIn30Days,
      healthySubscriptions,
      atRiskSubscriptions,
    ],
  );
};

// Hook for triggering subscription lifecycle checks
export const useSubscriptionLifecycleCheck = () => {
  const [triggerCheck, { loading, error, data }] = useMutation(
    TRIGGER_SUBSCRIPTION_LIFECYCLE_CHECK,
    {
      errorPolicy: "all",
    },
  );

  const triggerLifecycleCheck =
    useCallback(async (): Promise<SubscriptionLifecycleResult> => {
      const result = await triggerCheck();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data?.triggerSubscriptionLifecycleCheck;
    }, [triggerCheck]);

  const result = useMemo(
    () =>
      data?.triggerSubscriptionLifecycleCheck as
        | SubscriptionLifecycleResult
        | undefined,
    [data?.triggerSubscriptionLifecycleCheck],
  );

  return useMemo(
    () => ({
      triggerLifecycleCheck,
      loading,
      error,
      result,
    }),
    [triggerLifecycleCheck, loading, error, result],
  );
};

// Combined hook for organization subscription management
export const useOrganizationSubscriptionManagement = (
  organizationId?: string,
) => {
  const subscriptionStatus = useOrganizationSubscriptionStatus(organizationId);
  const createSubscription = useCreateOrganizationSubscription();
  const lifecycleStats = useSubscriptionLifecycleStats();
  const lifecycleCheck = useSubscriptionLifecycleCheck();

  const refreshAll = useCallback(() => {
    subscriptionStatus.refetch();
    lifecycleStats.refetch();
  }, [subscriptionStatus.refetch, lifecycleStats.refetch]);

  return useMemo(
    () => ({
      // Subscription status - be specific about what we return
      subscriptionStatus: subscriptionStatus.subscriptionStatus,
      hasActiveSubscription: subscriptionStatus.hasActiveSubscription,
      isInGracePeriod: subscriptionStatus.isInGracePeriod,
      daysUntilExpiry: subscriptionStatus.daysUntilExpiry,
      subscription: subscriptionStatus.subscription,
      isExpiringSoon: subscriptionStatus.isExpiringSoon,
      isExpired: subscriptionStatus.isExpired,
      refetch: subscriptionStatus.refetch,
      // Creation
      createOrganizationSubscription:
        createSubscription.createOrganizationSubscription,
      createLoading: createSubscription.loading,
      createError: createSubscription.error,
      // Lifecycle management
      lifecycleStats: lifecycleStats.stats,
      lifecycleLoading: lifecycleStats.loading,
      lifecycleError: lifecycleStats.error,
      triggerLifecycleCheck: lifecycleCheck.triggerLifecycleCheck,
      lifecycleCheckLoading: lifecycleCheck.loading,
      lifecycleCheckError: lifecycleCheck.error,
      lifecycleCheckResult: lifecycleCheck.result,
      // Utilities
      refreshAll,
      loading:
        subscriptionStatus.loading ||
        createSubscription.loading ||
        lifecycleStats.loading,
      error:
        subscriptionStatus.error ||
        createSubscription.error ||
        lifecycleStats.error,
    }),
    [
      subscriptionStatus.subscriptionStatus,
      subscriptionStatus.hasActiveSubscription,
      subscriptionStatus.isInGracePeriod,
      subscriptionStatus.daysUntilExpiry,
      subscriptionStatus.subscription,
      subscriptionStatus.isExpiringSoon,
      subscriptionStatus.isExpired,
      subscriptionStatus.refetch,
      subscriptionStatus.loading,
      subscriptionStatus.error,
      createSubscription.createOrganizationSubscription,
      createSubscription.loading,
      createSubscription.error,
      lifecycleStats.stats,
      lifecycleStats.loading,
      lifecycleStats.error,
      lifecycleCheck.triggerLifecycleCheck,
      lifecycleCheck.loading,
      lifecycleCheck.error,
      lifecycleCheck.result,
      refreshAll,
    ],
  );
};
