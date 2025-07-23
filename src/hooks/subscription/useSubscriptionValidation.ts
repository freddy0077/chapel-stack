import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';

// GraphQL query to check organization subscription status
export const GET_ORGANIZATION_SUBSCRIPTION_STATUS = gql`
  query GetOrganizationSubscriptionStatus($organizationId: String!) {
    organizationSubscriptionStatus(organizationId: $organizationId) {
      hasActiveSubscription
      daysUntilExpiry
      isInGracePeriod
      subscription {
        id
        status
        currentPeriodEnd
        trialEnd
        plan {
          name
          amount
          currency
        }
      }
    }
  }
`;

export interface SubscriptionValidationResult {
  isValid: boolean;
  requiresAction: boolean;
  status: 'ACTIVE' | 'EXPIRED' | 'TRIAL' | 'GRACE_PERIOD' | 'NONE';
  daysUntilExpiry?: number;
  subscription?: {
    id: string;
    status: string;
    currentPeriodEnd: string;
    trialEnd?: string;
    plan: {
      name: string;
      amount: number;
      currency: string;
    };
  };
}

export const useSubscriptionValidation = (
  organizationId: string | null,
  userRole: string | null,
  skipValidation = false
) => {
  const [validationResult, setValidationResult] = useState<SubscriptionValidationResult>({
    isValid: true,
    requiresAction: false,
    status: 'ACTIVE',
  });

  // Skip validation for subscription managers or if explicitly skipped
  const shouldSkipValidation = 
    skipValidation || 
    !organizationId || 
    userRole === 'SUBSCRIPTION_MANAGER';

  const { data, loading, error, refetch } = useQuery(GET_ORGANIZATION_SUBSCRIPTION_STATUS, {
    variables: { organizationId },
    skip: skipValidation || !organizationId,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  console.log('🔍 GraphQL Query Debug:', {
    organizationId,
    skipValidation,
    loading,
    error,
    data,
    hasData: !!data?.organizationSubscriptionStatus,
    authToken: typeof window !== 'undefined' ? localStorage.getItem('authToken') : 'SSR'
  });

  useEffect(() => {
    if (shouldSkipValidation) {
      setValidationResult({
        isValid: true,
        requiresAction: false,
        status: 'ACTIVE',
      });
      return;
    }

    if (loading) {
      // Don't update state while loading
      return;
    }

    if (error) {
      console.warn('Subscription validation error:', error);
      // On error, assume subscription is invalid but don't block access
      setValidationResult({
        isValid: false,
        requiresAction: false, // Don't require action on error to prevent blocking
        status: 'NONE',
      });
      return;
    }

    if (data?.organizationSubscriptionStatus) {
      const subscriptionStatus = data.organizationSubscriptionStatus;
      
      let status: SubscriptionValidationResult['status'] = 'NONE';
      let isValid = false;
      let requiresAction = false;

      if (subscriptionStatus.hasActiveSubscription) {
        const subscription = subscriptionStatus.subscription;
        
        if (subscription?.status === 'ACTIVE') {
          status = 'ACTIVE';
          isValid = true;
          requiresAction = false;
        } else if (subscription?.status === 'TRIALING') {
          status = 'TRIAL';
          isValid = true;
          requiresAction = (subscriptionStatus.daysUntilExpiry || 0) <= 7; // Show warning in last 7 days of trial
        } else if (subscriptionStatus.isInGracePeriod) {
          status = 'GRACE_PERIOD';
          isValid = true; // Still allow access during grace period
          requiresAction = true; // But require action
        } else {
          status = 'EXPIRED';
          isValid = false;
          requiresAction = true;
        }
      } else {
        status = 'NONE';
        isValid = false;
        requiresAction = true;
      }

      setValidationResult({
        isValid,
        requiresAction,
        status,
        daysUntilExpiry: subscriptionStatus.daysUntilExpiry,
        subscription: subscriptionStatus.subscription,
      });
    }
  }, [data, error, loading, shouldSkipValidation]);

  return {
    validationResult,
    loading,
    error,
    refetch,
    shouldSkipValidation,
  };
};

export default useSubscriptionValidation;
