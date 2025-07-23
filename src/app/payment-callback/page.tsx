'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { VERIFY_PAYMENT_AND_CREATE_SUBSCRIPTION } from '@/graphql/mutations/verifyPayment';

type CallbackStatus = 'loading' | 'success' | 'error' | 'cancelled';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  const [verifyPayment] = useMutation(VERIFY_PAYMENT_AND_CREATE_SUBSCRIPTION, {
    onCompleted: (data) => {
      if (data.verifyPaymentAndCreateSubscription) {
        setSubscriptionData(data.verifyPaymentAndCreateSubscription);
        setStatus('success');
        setMessage('Payment successful! Your subscription has been activated.');
      }
    },
    onError: (error) => {
      console.error('Payment verification failed:', error);
      setStatus('error');
      setMessage('Payment verification failed. Please contact support if your payment was deducted.');
    }
  });

  useEffect(() => {
    const reference = searchParams.get('reference');
    const organizationId = searchParams.get('organizationId');
    const planId = searchParams.get('planId');
    const contactName = searchParams.get('contactName');
    const contactEmail = searchParams.get('contactEmail');

    // Check if payment was cancelled
    if (searchParams.get('cancelled') === 'true') {
      setStatus('cancelled');
      setMessage('Payment was cancelled. You can try again anytime.');
      return;
    }

    // Verify required parameters
    if (!reference || !organizationId || !planId) {
      setStatus('error');
      setMessage('Invalid payment callback. Missing required parameters.');
      return;
    }

    // Verify payment and create subscription
    verifyPayment({
      variables: {
        input: {
          reference,
          organizationId,
          planId,
          contactName: contactName || 'Unknown',
          contactEmail: contactEmail || 'unknown@example.com'
        }
      }
    });
  }, [searchParams, verifyPayment]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <ClockIcon className="w-16 h-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircleIcon className="w-16 h-16 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-16 h-16 text-red-500" />;
      case 'cancelled':
        return <XCircleIcon className="w-16 h-16 text-yellow-500" />;
      default:
        return <ClockIcon className="w-16 h-16 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'cancelled':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  const handleReturnToDashboard = () => {
    router.push('/dashboard');
  };

  const handleTryAgain = () => {
    router.push('/subscriptions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-xl">
        <div className="flex flex-col items-center space-y-6">
          {getStatusIcon()}
          
          <div>
            <h1 className={`text-2xl font-bold ${getStatusColor()} mb-2`}>
              {status === 'loading' && 'Processing Payment'}
              {status === 'success' && 'Payment Successful!'}
              {status === 'error' && 'Payment Failed'}
              {status === 'cancelled' && 'Payment Cancelled'}
            </h1>
            <p className="text-gray-600">{message}</p>
          </div>

          {subscriptionData && status === 'success' && (
            <div className="bg-green-50 p-4 rounded-lg w-full">
              <h3 className="font-semibold text-green-800 mb-2">Subscription Details</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Plan:</strong> {subscriptionData.plan?.name}</p>
                <p><strong>Amount:</strong> {subscriptionData.plan?.currency} {subscriptionData.plan?.amount}</p>
                <p><strong>Status:</strong> {subscriptionData.status}</p>
                {subscriptionData.startDate && (
                  <p><strong>Start Date:</strong> {new Date(subscriptionData.startDate).toLocaleDateString()}</p>
                )}
                {subscriptionData.endDate && (
                  <p><strong>End Date:</strong> {new Date(subscriptionData.endDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {status === 'success' && (
              <Button 
                onClick={handleReturnToDashboard}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Go to Dashboard
              </Button>
            )}
            
            {(status === 'error' || status === 'cancelled') && (
              <>
                <Button 
                  onClick={handleTryAgain}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={handleReturnToDashboard}
                  variant="outline"
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
              </>
            )}
            
            {status === 'loading' && (
              <Button 
                onClick={handleReturnToDashboard}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-xl">
          <div className="flex flex-col items-center space-y-6">
            <ClockIcon className="w-16 h-16 text-blue-500 animate-spin" />
            <div>
              <h1 className="text-2xl font-bold text-blue-600 mb-2">Loading...</h1>
              <p className="text-gray-600">Please wait while we process your request.</p>
            </div>
          </div>
        </Card>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}
