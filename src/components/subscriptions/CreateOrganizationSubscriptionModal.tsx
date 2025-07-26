'use client';

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateOrganizationSubscription } from '@/hooks/subscription/useOrganizationSubscription';
import { useSubscriptionPlans } from '@/hooks/subscription/useCreateSubscription';
import { useAuth } from '@/contexts/AuthContextEnhanced';
import {
  BuildingOfficeIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/format';

interface CreateOrganizationSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId?: string;
  organizationName?: string;
  onSuccess?: () => void;
}

interface FormData {
  planId: string;
  startDate: string;
  authorizationCode: string;
  metadata: {
    notes: string;
    autoRenew: boolean;
  };
}

export const CreateOrganizationSubscriptionModal: React.FC<CreateOrganizationSubscriptionModalProps> = ({
  isOpen,
  onClose,
  organizationId,
  organizationName,
  onSuccess,
}) => {
  const { user } = useAuth();
  const orgId = organizationId || user?.organisationId;
  const orgName = organizationName || user?.organisation?.name || 'Your Organization';

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    planId: '',
    startDate: new Date().toISOString().split('T')[0],
    authorizationCode: '',
    metadata: {
      notes: '',
      autoRenew: true,
    },
  });

  const { subscriptionPlans, loading: plansLoading } = useSubscriptionPlans();
  const { createOrganizationSubscription, loading: createLoading, error: createError } = useCreateOrganizationSubscription();

  const selectedPlan = subscriptionPlans?.find(plan => plan.id === formData.planId);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMetadataChange = (field: keyof FormData['metadata'], value: any) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!orgId || !formData.planId) {
      return;
    }

    try {
      await createOrganizationSubscription(orgId, formData.planId, {
        startDate: formData.startDate,
        authorizationCode: formData.authorizationCode || undefined,
        metadata: formData.metadata,
      });

      onSuccess?.();
      onClose();
      
      // Reset form
      setCurrentStep(1);
      setFormData({
        planId: '',
        startDate: new Date().toISOString().split('T')[0],
        authorizationCode: '',
        metadata: {
          notes: '',
          autoRenew: true,
        },
      });
    } catch (error) {
      console.error('Failed to create organization subscription:', error);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.planId !== '';
      case 2:
        return formData.startDate !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-blue-500" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Create Organization Subscription
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Set up a subscription for <strong>{orgName}</strong>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Subscription Plan
              </label>
              {plansLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <div className="space-y-3">
                  {subscriptionPlans?.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
                        formData.planId === plan.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('planId', plan.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                          {plan.description && (
                            <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                          )}
                          <div className="mt-2 flex items-center space-x-4">
                            <span className="text-2xl font-bold text-gray-900">
                              {formatCurrency(plan.amount, plan.currency)}
                            </span>
                            <span className="text-sm text-gray-500">
                              per {plan.interval.toLowerCase()}
                            </span>
                          </div>
                          {plan.trialPeriodDays && plan.trialPeriodDays > 0 && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {plan.trialPeriodDays} day free trial
                              </span>
                            </div>
                          )}
                        </div>
                        {formData.planId === plan.id && (
                          <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                        )}
                      </div>
                      
                      {plan.features && plan.features.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Features:</h5>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {plan.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                            {plan.features.length > 3 && (
                              <li className="text-gray-500">
                                +{plan.features.length - 3} more features
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CreditCardIcon className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Subscription Details
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Configure your subscription settings
              </p>
            </div>

            {selectedPlan && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">{selectedPlan.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {formatCurrency(selectedPlan.amount, selectedPlan.currency)} per {selectedPlan.interval.toLowerCase()}
                </p>
                {selectedPlan.trialPeriodDays && selectedPlan.trialPeriodDays > 0 && (
                  <p className="text-sm text-green-600 mt-1">
                    Includes {selectedPlan.trialPeriodDays} day free trial
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-500 mt-1">
                The subscription will become active on this date
              </p>
            </div>

            <div>
              <label htmlFor="authorizationCode" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Authorization Code (Optional)
              </label>
              <Input
                id="authorizationCode"
                type="text"
                placeholder="Enter Paystack authorization code"
                value={formData.authorizationCode}
                onChange={(e) => handleInputChange('authorizationCode', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Required for immediate payment processing. Leave empty for manual payment setup.
              </p>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any notes about this subscription..."
                value={formData.metadata.notes}
                onChange={(e) => handleMetadataChange('notes', e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <input
                id="autoRenew"
                type="checkbox"
                checked={formData.metadata.autoRenew}
                onChange={(e) => handleMetadataChange('autoRenew', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoRenew" className="ml-2 block text-sm text-gray-700">
                Enable automatic renewal
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Review & Confirm
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Please review your subscription details before confirming
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Organization</h4>
                <p className="text-sm text-gray-600">{orgName}</p>
              </div>

              {selectedPlan && (
                <div>
                  <h4 className="font-semibold text-gray-900">Subscription Plan</h4>
                  <p className="text-sm text-gray-600">{selectedPlan.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(selectedPlan.amount, selectedPlan.currency)} per {selectedPlan.interval.toLowerCase()}
                  </p>
                  {selectedPlan.trialPeriodDays && selectedPlan.trialPeriodDays > 0 && (
                    <p className="text-sm text-green-600">
                      Free trial: {selectedPlan.trialPeriodDays} days
                    </p>
                  )}
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900">Start Date</h4>
                <p className="text-sm text-gray-600">
                  {new Date(formData.startDate).toLocaleDateString()}
                </p>
              </div>

              {formData.authorizationCode && (
                <div>
                  <h4 className="font-semibold text-gray-900">Payment</h4>
                  <p className="text-sm text-gray-600">
                    Authorization code provided - payment will be processed immediately
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900">Auto-renewal</h4>
                <p className="text-sm text-gray-600">
                  {formData.metadata.autoRenew ? 'Enabled' : 'Disabled'}
                </p>
              </div>

              {formData.metadata.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900">Notes</h4>
                  <p className="text-sm text-gray-600">{formData.metadata.notes}</p>
                </div>
              )}
            </div>

            {createError && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <div>
                  <h4>Failed to create subscription</h4>
                  <p>{createError.message}</p>
                </div>
              </Alert>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-16 h-1 mx-2 ${
                          step < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Select Plan</span>
                <span>Details</span>
                <span>Review</span>
              </div>
            </div>

            {/* Step Content */}
            {renderStepContent()}

            {/* Actions */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <div>
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                {currentStep < 3 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceedToNext()}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={createLoading || !orgId}
                  >
                    {createLoading ? 'Creating...' : 'Create Subscription'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
