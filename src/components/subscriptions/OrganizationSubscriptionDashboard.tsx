'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrganizationSubscriptionManagement } from '@/hooks/subscription/useOrganizationSubscription';
import { useAuth } from '@/hooks/useAuth';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CreditCardIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency, formatDate } from '@/utils/format';

interface OrganizationSubscriptionDashboardProps {
  organizationId?: string;
  showLifecycleStats?: boolean;
}

export const OrganizationSubscriptionDashboard: React.FC<OrganizationSubscriptionDashboardProps> = ({
  organizationId,
  showLifecycleStats = false,
}) => {
  const { user } = useAuth();
  const orgId = organizationId || user?.organisationId;
  const [refreshing, setRefreshing] = useState(false);

  const {
    subscriptionStatus,
    hasActiveSubscription,
    isInGracePeriod,
    daysUntilExpiry,
    subscription,
    isExpiringSoon,
    isExpired,
    lifecycleStats,
    triggerLifecycleCheck,
    refreshAll,
    loading,
    error,
    lifecycleCheckLoading,
  } = useOrganizationSubscriptionManagement(orgId);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAll();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLifecycleCheck = async () => {
    try {
      const result = await triggerLifecycleCheck();
      console.log('Lifecycle check result:', result);
      // Refresh data after lifecycle check
      await refreshAll();
    } catch (error) {
      console.error('Failed to trigger lifecycle check:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'TRIALING':
        return 'bg-blue-100 text-blue-800';
      case 'PAST_DUE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'TRIALING':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'PAST_DUE':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'CANCELLED':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <div>
          <h3>Failed to load subscription data</h3>
          <p>{error.message}</p>
        </div>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Organization Subscription</h2>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {showLifecycleStats && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLifecycleCheck}
              disabled={lifecycleCheckLoading}
            >
              <Cog6ToothIcon className={`h-4 w-4 mr-2 ${lifecycleCheckLoading ? 'animate-spin' : ''}`} />
              Run Lifecycle Check
            </Button>
          )}
        </div>
      </div>

      {/* Subscription Status Alerts */}
      {!hasActiveSubscription && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <div>
            <h3>No Active Subscription</h3>
            <p>Your organization does not have an active subscription. Please contact your administrator to set up a subscription.</p>
          </div>
        </Alert>
      )}

      {isInGracePeriod && (
        <Alert variant="warning">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <div>
            <h3>Subscription Past Due</h3>
            <p>Your subscription is past due. Please update your payment method to avoid service interruption.</p>
          </div>
        </Alert>
      )}

      {isExpiringSoon && !isInGracePeriod && (
        <Alert variant="warning">
          <ClockIcon className="h-4 w-4" />
          <div>
            <h3>Subscription Expiring Soon</h3>
            <p>Your subscription expires in {daysUntilExpiry} days. Please renew to avoid service interruption.</p>
          </div>
        </Alert>
      )}

      {/* Subscription Details */}
      {subscription && (
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              {getStatusIcon(subscription.status)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {subscription.plan?.name || 'Unknown Plan'}
                </h3>
                <p className="text-sm text-gray-500">
                  {subscription.organisation?.name}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(subscription.status)}>
              {subscription.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Plan Details */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Plan Details</h4>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(subscription.plan?.amount || 0, subscription.plan?.currency || 'USD')}
                </p>
                <p className="text-sm text-gray-500">
                  per {subscription.plan?.interval?.toLowerCase() || 'month'}
                </p>
              </div>
            </div>

            {/* Current Period */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Current Period</h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-900">
                  {formatDate(subscription.currentPeriodStart)}
                </p>
                <p className="text-sm text-gray-500">to</p>
                <p className="text-sm text-gray-900">
                  {formatDate(subscription.currentPeriodEnd)}
                </p>
              </div>
            </div>

            {/* Trial Information */}
            {subscription.trialStart && subscription.trialEnd && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Trial Period</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-900">
                    {formatDate(subscription.trialStart)}
                  </p>
                  <p className="text-sm text-gray-500">to</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(subscription.trialEnd)}
                  </p>
                </div>
              </div>
            )}

            {/* Next Billing */}
            {subscription.nextBillingDate && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Next Billing</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-900">
                    {formatDate(subscription.nextBillingDate)}
                  </p>
                  {daysUntilExpiry !== undefined && (
                    <p className="text-sm text-gray-500">
                      {daysUntilExpiry > 0 ? `in ${daysUntilExpiry} days` : 'Overdue'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Plan Features */}
          {subscription.plan?.features && subscription.plan.features.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Plan Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {subscription.plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Payments */}
          {subscription.payments && subscription.payments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Recent Payments</h4>
              <div className="space-y-2">
                {subscription.payments.slice(0, 3).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <CreditCardIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900">
                          {formatCurrency(payment.amount, subscription.plan?.currency || 'USD')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(payment.paidAt || payment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge className={payment.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {payment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Lifecycle Statistics */}
      {showLifecycleStats && lifecycleStats && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Subscription Lifecycle Statistics</h3>
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{lifecycleStats.totalSubscriptions}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{lifecycleStats.activeSubscriptions}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{lifecycleStats.trialSubscriptions}</p>
              <p className="text-sm text-gray-500">Trial</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{lifecycleStats.pastDueSubscriptions}</p>
              <p className="text-sm text-gray-500">Past Due</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{lifecycleStats.cancelledSubscriptions}</p>
              <p className="text-sm text-gray-500">Cancelled</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{lifecycleStats.expiringIn7Days}</p>
              <p className="text-sm text-gray-500">Expiring (7d)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{lifecycleStats.expiringIn30Days}</p>
              <p className="text-sm text-gray-500">Expiring (30d)</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
