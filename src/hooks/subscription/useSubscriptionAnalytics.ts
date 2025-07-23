import { useQuery } from '@apollo/client';
import { useState } from 'react';
import {
  GET_SUBSCRIPTION_ANALYTICS,
  GET_SUBSCRIPTION_PAYMENTS,
  GET_FAILED_PAYMENTS,
  SubscriptionPayment,
} from '../../graphql/subscription-management';

interface SubscriptionAnalytics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  churnRate: number;
  newSubscriptions: number;
  cancelledSubscriptions: number;
  revenueGrowth: number;
  customerLifetimeValue: number;
  averageRevenuePerUser: number;
}

interface PaymentFilter {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  organizationId?: string;
  limit?: number;
  offset?: number;
}

export const useSubscriptionAnalytics = (period: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' = 'MONTHLY') => {
  const { data, loading, error, refetch } = useQuery<{
    subscriptionAnalytics: SubscriptionAnalytics;
  }>(GET_SUBSCRIPTION_ANALYTICS, {
    variables: { period },
    errorPolicy: 'all',
  });

  return {
    analytics: data?.subscriptionAnalytics,
    loading,
    error,
    refetch,
  };
};

export const useSubscriptionPayments = (filter?: PaymentFilter) => {
  const { data, loading, error, refetch, fetchMore } = useQuery<{
    subscriptionPayments: SubscriptionPayment[];
  }>(GET_SUBSCRIPTION_PAYMENTS, {
    variables: { filter },
    errorPolicy: 'all',
  });

  const loadMore = () => {
    if (data?.subscriptionPayments) {
      return fetchMore({
        variables: {
          filter: {
            ...filter,
            offset: data.subscriptionPayments.length,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            subscriptionPayments: [
              ...prev.subscriptionPayments,
              ...fetchMoreResult.subscriptionPayments,
            ],
          };
        },
      });
    }
  };

  return {
    payments: data?.subscriptionPayments || [],
    loading,
    error,
    refetch,
    loadMore,
  };
};

export const useFailedPayments = () => {
  const { data, loading, error, refetch } = useQuery<{
    failedPayments: SubscriptionPayment[];
  }>(GET_FAILED_PAYMENTS, {
    errorPolicy: 'all',
  });

  return {
    failedPayments: data?.failedPayments || [],
    loading,
    error,
    refetch,
  };
};

export const usePaymentFilters = () => {
  const [filters, setFilters] = useState<PaymentFilter>({
    limit: 50,
    offset: 0,
  });

  const updateFilter = (key: keyof PaymentFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: 0, // Reset offset when filter changes
    }));
  };

  const resetFilters = () => {
    setFilters({
      limit: 50,
      offset: 0,
    });
  };

  const setDateRange = (dateFrom: string, dateTo: string) => {
    setFilters(prev => ({
      ...prev,
      dateFrom,
      dateTo,
      offset: 0,
    }));
  };

  return {
    filters,
    updateFilter,
    resetFilters,
    setDateRange,
  };
};

// Hook for analytics dashboard calculations
export const useAnalyticsDashboard = () => {
  const { analytics, loading, error } = useSubscriptionAnalytics();
  const { failedPayments, loading: failedLoading } = useFailedPayments();

  const calculateMetrics = () => {
    if (!analytics) return null;

    const totalFailedPayments = failedPayments.length;
    const totalFailedAmount = failedPayments.reduce((sum, payment) => sum + payment.amount, 0);

    return {
      // Revenue metrics
      mrr: analytics.monthlyRecurringRevenue,
      totalRevenue: analytics.totalRevenue,
      revenueGrowth: analytics.revenueGrowth,
      
      // Customer metrics
      churnRate: analytics.churnRate,
      newSubscriptions: analytics.newSubscriptions,
      cancelledSubscriptions: analytics.cancelledSubscriptions,
      customerLifetimeValue: analytics.customerLifetimeValue,
      averageRevenuePerUser: analytics.averageRevenuePerUser,
      
      // Payment metrics
      totalFailedPayments,
      totalFailedAmount,
      
      // Calculated metrics
      netSubscriptionGrowth: analytics.newSubscriptions - analytics.cancelledSubscriptions,
      failureRate: totalFailedPayments > 0 ? (totalFailedPayments / (analytics.newSubscriptions || 1)) * 100 : 0,
    };
  };

  return {
    metrics: calculateMetrics(),
    loading: loading || failedLoading,
    error,
  };
};
