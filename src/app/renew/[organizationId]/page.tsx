'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircleIcon, ExclamationTriangleIcon, BuildingOfficeIcon, ClockIcon, XCircleIcon, CreditCardIcon } from '@heroicons/react/24/solid';
import { GET_ORGANIZATION_SUBSCRIPTION_STATUS, GET_SUBSCRIPTION_PLANS } from '@/graphql/subscription-management';
import { VERIFY_PAYMENT_AND_CREATE_SUBSCRIPTION } from '@/graphql/mutations/verifyPayment';
import { paystackService } from '@/services/paystack.service';

// Add Paystack script to head
if (typeof window !== 'undefined') {
  const script = document.createElement('script');
  script.src = 'https://js.paystack.co/v1/inline.js';
  script.async = true;
  document.head.appendChild(script);
}

interface RenewalFormData {
  planId: string;
  authorizationCode?: string;
  contactEmail: string;
  contactName: string;
}

export default function OrganizationRenewalPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = params.organizationId as string;
  
  const [formData, setFormData] = useState<RenewalFormData>({
    planId: '',
    authorizationCode: '',
    contactEmail: '',
    contactName: ''
  });
  const [step, setStep] = useState<'verify' | 'select-plan' | 'payment' | 'success' | 'error'>('verify');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch organization subscription status
  const { data: orgData, loading: orgLoading, error: orgError } = useQuery(GET_ORGANIZATION_SUBSCRIPTION_STATUS, {
    variables: { organizationId },
    skip: !organizationId
  });

  // Fetch available subscription plans
  const { data: plansData, loading: plansLoading } = useQuery(GET_SUBSCRIPTION_PLANS, {
    variables: { filter: { isActive: true } }
  });

  // Verify payment and create subscription mutation
  const [verifyPayment, { loading: verifyLoading }] = useMutation(VERIFY_PAYMENT_AND_CREATE_SUBSCRIPTION, {
    onCompleted: (data) => {
      if (data.verifyPaymentAndCreateSubscription) {
        setStep('success');
      }
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setStep('error');
    }
  });

  const organization = orgData?.organizationSubscriptionStatus?.subscription?.organisation;
  const subscription = orgData?.organizationSubscriptionStatus?.subscription;
  const plans = plansData?.subscriptionPlans || [];

  useEffect(() => {
    if (orgData && !orgLoading) {
      const hasActiveSubscription = orgData.organizationSubscriptionStatus?.hasActiveSubscription;
      
      if (hasActiveSubscription) {
        // Organization has active subscription, redirect to login
        router.push('/auth/signin?message=subscription-active');
        return;
      }
      
      // Organization needs renewal, proceed to plan selection
      setStep('select-plan');
    }
  }, [orgData, orgLoading, router]);

  const handlePlanSelection = (planId: string) => {
    setFormData(prev => ({ ...prev, planId }));
    setStep('payment');
  };

  const handleRenewal = async () => {
    if (!formData.planId || !formData.contactName || !formData.contactEmail) {
      setErrorMessage('Please fill in all required fields and select a plan.');
      return;
    }

    const selectedPlan = plans.find(plan => plan.id === formData.planId);
    if (!selectedPlan) {
      setErrorMessage('Selected plan not found.');
      return;
    }

    try {
      setErrorMessage('');
      
      // Generate payment reference
      const paymentReference = paystackService.generateReference(organizationId as string);
      
      // Generate callback URL for fallback
      const callbackUrl = paystackService.generateCallbackUrl(
        organizationId as string,
        formData.planId,
        formData.contactName,
        formData.contactEmail
      );
      
      // Initialize Paystack payment popup
      paystackService.openPaystackPopup(
        {
          email: formData.contactEmail,
          amount: selectedPlan.amount,
          currency: selectedPlan.currency,
          reference: paymentReference,
          callback_url: callbackUrl,
          metadata: {
            organizationId: organizationId as string,
            planId: formData.planId,
            contactName: formData.contactName,
          },
        },
        // On successful payment
        async (response: any) => {
          
          try {
            // Verify payment and create subscription
            await verifyPayment({
              variables: {
                input: {
                  reference: response.reference,
                  organizationId: organizationId as string,
                  planId: formData.planId,
                  contactName: formData.contactName,
                  contactEmail: formData.contactEmail,
                }
              }
            });
          } catch (error) {
            console.error('Payment verification failed:', error);
            setErrorMessage('Payment was successful but subscription creation failed. Please contact support.');
            setStep('error');
          }
        },
        // On payment cancelled
        () => {
          setErrorMessage('Payment was cancelled. Please try again.');
        }
      );
    } catch (error) {
      console.error('Payment initialization error:', error);
      setErrorMessage('Failed to initialize payment. Please try again.');
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  };

  if (orgLoading || plansLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Loading...</h3>
          <p className="mt-1 text-sm text-gray-500">Verifying organization details</p>
        </div>
      </div>
    );
  }

  if (orgError || !organization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 p-6 text-center">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Organization Not Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The organization ID provided is invalid or the organization does not exist.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/auth/signin')}
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Chapel Stack</h1>
            </div>
            <Badge variant="outline">Subscription Renewal</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Organization Info */}
        <Card className="mb-8 p-6">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{organization.name}</h2>
              <p className="text-sm text-gray-500">{organization.email}</p>
              {subscription && (
                <div className="mt-2">
                  <Badge className="bg-red-100 text-red-800">
                    Subscription Expired
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Step Content */}
        {step === 'select-plan' && (
          <div>
            <div className="text-center mb-8">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-amber-500" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Subscription Renewal Required</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your organization's subscription has expired. Please select a plan to renew access.
              </p>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {plans.map((plan) => (
                <Card key={plan.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-indigo-500" onClick={() => handlePlanSelection(plan.id)}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Plan Info Section */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:gap-6">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{plan.name}</h3>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">
                              {formatCurrency(plan.amount, plan.currency)}
                            </span>
                            <span className="text-sm text-gray-500">/{plan.interval}</span>
                          </div>
                          {plan.trialPeriodDays > 0 && (
                            <Badge className="mt-2 bg-green-100 text-green-800">
                              {plan.trialPeriodDays} days trial
                            </Badge>
                          )}
                        </div>
                        
                        {/* Description */}
                        {plan.description && (
                          <div className="flex-1 md:max-w-md">
                            <p className="text-sm text-gray-600">{plan.description}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Features */}
                      {plan.features && plan.features.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Select Button */}
                    <div className="flex-shrink-0">
                      <Button className="w-full md:w-auto px-8 py-3">
                        Select Plan
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div>
            <div className="text-center mb-8">
              <CreditCardIcon className="mx-auto h-12 w-12 text-indigo-600" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Complete Renewal</h3>
              <p className="mt-1 text-sm text-gray-500">
                Provide your contact details to complete the subscription renewal.
              </p>
            </div>

            <Card className="max-w-md mx-auto p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                    Contact Name *
                  </label>
                  <Input
                    id="contactName"
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Contact Email *
                  </label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {errorMessage}
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('select-plan')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleRenewal}
                    disabled={verifyLoading}
                    className="flex-1"
                  >
                    {verifyLoading ? 'Processing...' : 'Renew Subscription'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Renewal Successful!</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your organization's subscription has been successfully renewed. You can now log in to access the system.
            </p>
            <Button 
              className="mt-4" 
              onClick={() => router.push('/auth/signin?message=renewal-success')}
            >
              Go to Login
            </Button>
          </div>
        )}

        {step === 'error' && (
          <div className="text-center">
            <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Renewal Failed</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
              {errorMessage || 'An error occurred while processing your renewal. Please try again or contact support.'}
            </p>
            <div className="mt-4 space-x-3">
              <Button 
                variant="outline"
                onClick={() => {
                  setStep('payment');
                  setErrorMessage('');
                }}
              >
                Try Again
              </Button>
              <Button onClick={() => router.push('/auth/signin')}>
                Go to Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
