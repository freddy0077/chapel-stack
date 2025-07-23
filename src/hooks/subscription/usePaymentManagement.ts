import { useMutation, useApolloClient } from '@apollo/client';
import { useState } from 'react';
import {
  RETRY_FAILED_PAYMENT,
  REFUND_PAYMENT,
} from '../../graphql/subscription-management';

interface PaymentAction {
  loading: boolean;
  error: any;
  success: boolean;
}

export const usePaymentManagement = () => {
  const apolloClient = useApolloClient();
  const [actionState, setActionState] = useState<PaymentAction>({
    loading: false,
    error: null,
    success: false,
  });

  const [retryPaymentMutation] = useMutation(RETRY_FAILED_PAYMENT, {
    onCompleted: () => {
      apolloClient.refetchQueries({ 
        include: ['GetSubscriptionPayments', 'GetFailedPayments', 'GetSubscriptionAnalytics']
      });
    },
  });

  const [refundPaymentMutation] = useMutation(REFUND_PAYMENT, {
    onCompleted: () => {
      apolloClient.refetchQueries({ 
        include: ['GetSubscriptionPayments', 'GetSubscriptionAnalytics']
      });
    },
  });

  const retryPayment = async (paymentId: string) => {
    setActionState({ loading: true, error: null, success: false });
    
    try {
      const result = await retryPaymentMutation({
        variables: { paymentId },
      });
      
      setActionState({ loading: false, error: null, success: true });
      return { success: true, data: result.data };
    } catch (error) {
      setActionState({ loading: false, error, success: false });
      console.error('Failed to retry payment:', error);
      return { success: false, error };
    }
  };

  const refundPayment = async (paymentId: string, reason: string) => {
    setActionState({ loading: true, error: null, success: false });
    
    try {
      const result = await refundPaymentMutation({
        variables: { paymentId, reason },
      });
      
      setActionState({ loading: false, error: null, success: true });
      return { success: true, data: result.data };
    } catch (error) {
      setActionState({ loading: false, error, success: false });
      console.error('Failed to refund payment:', error);
      return { success: false, error };
    }
  };

  const resetActionState = () => {
    setActionState({ loading: false, error: null, success: false });
  };

  return {
    retryPayment,
    refundPayment,
    resetActionState,
    actionState,
  };
};

// Hook for payment status utilities
export const usePaymentStatus = () => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'green';
      case 'failed':
      case 'cancelled':
        return 'red';
      case 'pending':
      case 'processing':
        return 'yellow';
      case 'refunded':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'Success';
      case 'failed':
        return 'Failed';
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'cancelled':
        return 'Cancelled';
      case 'refunded':
        return 'Refunded';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const formatAmount = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount / 100); // Assuming amount is in kobo
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return {
    getStatusColor,
    getStatusLabel,
    formatAmount,
    formatDate,
  };
};
