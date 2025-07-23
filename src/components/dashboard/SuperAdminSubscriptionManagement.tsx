"use client";

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { 
  CreditCardIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GET_ORGANIZATION_SUBSCRIPTION_STATUS, GET_SUBSCRIPTION_PLANS } from '@/graphql/subscription-management';
import { useCreateOrganizationSubscription } from '@/hooks/subscription/useOrganizationSubscription';
import { useAuth } from '@/graphql/hooks/useAuth';

interface SuperAdminSubscriptionManagementProps {
  organizationId: string;
}

export const SuperAdminSubscriptionManagement: React.FC<SuperAdminSubscriptionManagementProps> = ({
  organizationId
}) => {
  const { user } = useAuth();
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  // Get current subscription status
  const { data: subscriptionData, loading: subscriptionLoading, refetch } = useQuery(
    GET_ORGANIZATION_SUBSCRIPTION_STATUS,
    {
      variables: { organizationId },
      skip: !organizationId,
    }
  );

  // Get available plans for renewal
  const { data: plansData, loading: plansLoading } = useQuery(GET_SUBSCRIPTION_PLANS);

  // Hook for creating new subscription
  const { createOrganizationSubscription, loading: creatingSubscription } = useCreateOrganizationSubscription();

  const subscription = subscriptionData?.organizationSubscriptionStatus?.subscription;
  const hasActiveSubscription = subscriptionData?.organizationSubscriptionStatus?.hasActiveSubscription;
  const isInGracePeriod = subscriptionData?.organizationSubscriptionStatus?.isInGracePeriod;
  const daysUntilExpiry = subscriptionData?.organizationSubscriptionStatus?.daysUntilExpiry;

  // Calculate correct remaining days based on subscription status
  const calculateRemainingDays = () => {
    if (!subscription) return null;
    
    const now = new Date();
    const currentPeriodEnd = new Date(subscription.currentPeriodEnd);
    const trialEnd = subscription.trialEnd ? new Date(subscription.trialEnd) : null;
    
    // For trial subscriptions, show trial remaining days
    if (subscription.status === 'TRIALING' && trialEnd) {
      const trialDaysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        days: trialDaysRemaining,
        type: 'trial',
        label: trialDaysRemaining > 0 ? `${trialDaysRemaining} trial days remaining` : `Trial expired ${Math.abs(trialDaysRemaining)} days ago`
      };
    }
    
    // For active subscriptions, show subscription remaining days
    const subscriptionDaysRemaining = Math.ceil((currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      days: subscriptionDaysRemaining,
      type: 'subscription',
      label: subscriptionDaysRemaining > 0 ? `${subscriptionDaysRemaining} days remaining` : `Expired ${Math.abs(subscriptionDaysRemaining)} days ago`
    };
  };

  const remainingDaysInfo = calculateRemainingDays();

  // Determine subscription status for display
  const getSubscriptionStatus = () => {
    if (!subscription) return { status: 'NONE', color: 'red', icon: XCircleIcon };
    
    if (subscription.status === 'ACTIVE' && hasActiveSubscription) {
      return { status: 'ACTIVE', color: 'green', icon: CheckCircleIcon };
    }
    
    if (subscription.status === 'TRIALING') {
      return { status: 'TRIAL', color: 'blue', icon: ClockIcon };
    }
    
    if (subscription.status === 'PAST_DUE' || isInGracePeriod) {
      return { status: 'GRACE_PERIOD', color: 'yellow', icon: ExclamationTriangleIcon };
    }
    
    if (subscription.status === 'CANCELLED') {
      return { status: 'CANCELLED', color: 'red', icon: XCircleIcon };
    }
    
    return { status: 'EXPIRED', color: 'red', icon: XCircleIcon };
  };

  const statusInfo = getSubscriptionStatus();
  const StatusIcon = statusInfo.icon;

  const handleRenewSubscription = async () => {
    if (!selectedPlanId) return;

    try {
      await createOrganizationSubscription(organizationId, selectedPlanId, {
        startDate: new Date().toISOString().split('T')[0],
        metadata: { renewedBy: user?.id, renewedAt: new Date().toISOString() }
      });
      
      // Refresh subscription data
      refetch();
      setShowRenewalModal(false);
      setSelectedPlanId('');
    } catch (error) {
      console.error('Failed to renew subscription:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount / 100);
  };

  if (subscriptionLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subscription Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CreditCardIcon className="h-5 w-5 mr-2" />
            Organisation Subscription
          </h3>
          <Badge variant={statusInfo.color as any}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {statusInfo.status}
          </Badge>
        </div>

        {subscription ? (
          <div className="space-y-4">
            {/* Current Plan Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Current Plan</h4>
                <p className="text-lg font-semibold text-blue-600">{subscription.plan.name}</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(subscription.plan.amount, subscription.plan.currency)} / {subscription.plan.interval}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Subscription Period</h4>
                <p className="text-sm text-gray-600">
                  {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                </p>
                {remainingDaysInfo && (
                  <div className="mt-1 space-y-1">
                    <p className={`text-sm font-medium ${remainingDaysInfo.days > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {remainingDaysInfo.label}
                    </p>
                    {subscription.status === 'TRIALING' && (
                      <p className="text-xs text-gray-500">
                        Full subscription: {Math.ceil((new Date(subscription.currentPeriodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days total
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Trial Information */}
            {subscription.trialStart && subscription.trialEnd && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Trial Period</h4>
                <p className="text-sm text-blue-700">
                  {formatDate(subscription.trialStart)} - {formatDate(subscription.trialEnd)}
                </p>
              </div>
            )}

            {/* Status Messages */}
            {statusInfo.status === 'GRACE_PERIOD' && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                  <p className="text-yellow-800">
                    Your subscription is in grace period. Please renew to avoid service interruption.
                  </p>
                </div>
              </div>
            )}

            {statusInfo.status === 'EXPIRED' && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-red-800">
                    Your subscription has expired. Renew now to restore access.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <XCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h4>
            <p className="text-gray-600 mb-4">Your organization doesn't have an active subscription.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          {(statusInfo.status === 'GRACE_PERIOD' || statusInfo.status === 'EXPIRED' || statusInfo.status === 'NONE') && (
            <Button 
              onClick={() => setShowRenewalModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {subscription ? 'Renew Subscription' : 'Subscribe Now'}
            </Button>
          )}
          
          {statusInfo.status === 'ACTIVE' && (
            <Button 
              variant="outline"
              onClick={() => setShowRenewalModal(true)}
            >
              Upgrade Plan
            </Button>
          )}
        </div>
      </Card>

      {/* Renewal Modal */}
      {showRenewalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {subscription ? 'Renew Subscription' : 'Choose Subscription Plan'}
            </h3>
            
            {plansLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading plans...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {plansData?.subscriptionPlans?.map((plan: any) => (
                  <div
                    key={plan.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPlanId === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlanId(plan.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        {plan.trialPeriodDays > 0 && (
                          <Badge variant="blue" className="mt-2">
                            {plan.trialPeriodDays} days free trial
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(plan.amount, plan.currency)}
                        </p>
                        <p className="text-sm text-gray-600">per {plan.interval}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRenewalModal(false);
                  setSelectedPlanId('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRenewSubscription}
                disabled={!selectedPlanId || creatingSubscription}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {creatingSubscription ? 'Processing...' : 'Confirm Subscription'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminSubscriptionManagement;
