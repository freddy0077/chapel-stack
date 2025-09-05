"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  XMarkIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCreateOrganizationSubscription } from "@/hooks/subscription/useOrganizationSubscription";
import {
  GET_SUBSCRIPTION_PLANS,
  GET_SUBSCRIPTION_ORGANIZATIONS,
} from "@/graphql/subscription-management";
import { formatCurrency } from "../utils/formatters";

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface SubscriptionFormData {
  organizationId: string;
  planId: string;
  startDate: string;
  metadata?: any;
}

export default function CreateSubscriptionModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateSubscriptionModalProps) {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    organizationId: "",
    planId: "",
    startDate: new Date().toISOString().split("T")[0],
    metadata: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // GraphQL queries
  const { data: organizationsData, loading: organizationsLoading } = useQuery(
    GET_SUBSCRIPTION_ORGANIZATIONS,
    {
      skip: !isOpen,
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
  );

  const { data: plansData, loading: plansLoading } = useQuery(
    GET_SUBSCRIPTION_PLANS,
    {
      skip: !isOpen,
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
  );

  const { createOrganizationSubscription } =
    useCreateOrganizationSubscription();

  const organizations = organizationsData?.subscriptionOrganizations || [];
  const subscriptionPlans = plansData?.subscriptionPlans || [];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        organizationId: "",
        planId: "",
        startDate: new Date().toISOString().split("T")[0],
        metadata: {},
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.organizationId) {
      newErrors.organizationId = "Organization is required";
    }

    if (!formData.planId) {
      newErrors.planId = "Subscription plan is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const subscription = await createOrganizationSubscription(
        formData.organizationId,
        formData.planId,
        {
          startDate: formData.startDate,
          metadata: formData.metadata,
        },
      );

      if (subscription?.id) {
        onSuccess();
        onClose();
      } else {
        setErrors({
          submit: "Failed to create subscription. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      setErrors({
        submit:
          error.message || "Failed to create subscription. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedOrganization = organizations.find(
    (org: any) => org.id === formData.organizationId,
  );
  const selectedPlan = subscriptionPlans.find(
    (plan: any) => plan.id === formData.planId,
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                  >
                    <CreditCardIcon className="h-6 w-6 mr-2 text-indigo-600" />
                    Create New Subscription
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Organization Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                      Organization *
                    </label>
                    <select
                      value={formData.organizationId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          organizationId: e.target.value,
                        }))
                      }
                      className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.organizationId
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      disabled={organizationsLoading}
                    >
                      <option value="">Select an organization...</option>
                      {organizations.map((org: any) => (
                        <option key={org.id} value={org.id}>
                          {org.name} ({org.email})
                        </option>
                      ))}
                    </select>
                    {errors.organizationId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.organizationId}
                      </p>
                    )}
                    {organizationsLoading && (
                      <p className="mt-1 text-sm text-gray-500">
                        Loading organizations...
                      </p>
                    )}
                  </div>

                  {/* Selected Organization Info */}
                  {selectedOrganization && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Selected Organization
                      </h4>
                      <div className="text-sm text-blue-700">
                        <p>
                          <strong>Name:</strong> {selectedOrganization.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedOrganization.email}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          <Badge variant="outline">
                            {selectedOrganization.status}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Subscription Plan Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CreditCardIcon className="h-4 w-4 inline mr-1" />
                      Subscription Plan *
                    </label>
                    <div className="grid grid-cols-1 gap-4">
                      {plansLoading ? (
                        <p className="text-sm text-gray-500">
                          Loading subscription plans...
                        </p>
                      ) : (
                        subscriptionPlans.map((plan: any) => (
                          <div
                            key={plan.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              formData.planId === plan.id
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                planId: plan.id,
                              }))
                            }
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {plan.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {plan.description}
                                </p>
                                <div className="flex items-center mt-2 space-x-4">
                                  <span className="text-lg font-semibold text-indigo-600">
                                    {formatCurrency(plan.amount, plan.currency)}
                                  </span>
                                  <Badge variant="outline">
                                    {plan.interval}
                                  </Badge>
                                  {plan.trialPeriodDays > 0 && (
                                    <Badge variant="secondary">
                                      {plan.trialPeriodDays} day trial
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {formData.planId === plan.id && (
                                <CheckCircleIcon className="h-6 w-6 text-indigo-600" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {errors.planId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.planId}
                      </p>
                    )}
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CalendarIcon className="h-4 w-4 inline mr-1" />
                      Start Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className={errors.startDate ? "border-red-300" : ""}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  {/* Summary */}
                  {selectedOrganization && selectedPlan && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Subscription Summary
                      </h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>
                          <strong>Organization:</strong>{" "}
                          {selectedOrganization.name}
                        </p>
                        <p>
                          <strong>Plan:</strong> {selectedPlan.name}
                        </p>
                        <p>
                          <strong>Amount:</strong>{" "}
                          {formatCurrency(
                            selectedPlan.amount,
                            selectedPlan.currency,
                          )}{" "}
                          / {selectedPlan.interval.toLowerCase()}
                        </p>
                        <p>
                          <strong>Start Date:</strong>{" "}
                          {new Date(formData.startDate).toLocaleDateString()}
                        </p>
                        {selectedPlan.trialPeriodDays > 0 && (
                          <p>
                            <strong>Trial Period:</strong>{" "}
                            {selectedPlan.trialPeriodDays} days
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isLoading ||
                        !formData.organizationId ||
                        !formData.planId
                      }
                    >
                      {isLoading ? "Creating..." : "Create Subscription"}
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
