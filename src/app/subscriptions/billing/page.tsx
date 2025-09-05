"use client";

import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { RoleRoute } from "@/components/auth/RoleRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

// GraphQL Queries and Mutations
const GET_SUBSCRIPTIONS = gql`
  query GetSubscriptions($filter: SubscriptionFilterInput) {
    getSubscriptions(filter: $filter) {
      id
      customerId
      planId
      status
      paystackSubscriptionCode
      paystackCustomerCode
      currentPeriodStart
      currentPeriodEnd
      trialStart
      trialEnd
      cancelledAt
      cancelReason
      nextBillingDate
      lastPaymentDate
      failedPaymentCount
      cancelAtPeriodEnd
      createdAt
      updatedAt
      plan {
        id
        name
        description
        amount
        currency
        interval
        intervalCount
        trialPeriodDays
        features
      }
      customer {
        id
        name
        email
        state
      }
      payments {
        id
        amount
        currency
        status
        paidAt
        failedAt
        paystackReference
        paystackTransactionId
        authorizationCode
        periodStart
        periodEnd
        invoiceNumber
        failureReason
        metadata
        createdAt
        updatedAt
      }
    }
  }
`;

const GET_SUBSCRIPTION_PLANS = gql`
  query GetSubscriptionPlans($filter: PlanFilterInput) {
    subscriptionPlans(filter: $filter) {
      id
      name
      description
      amount
      currency
      interval
      intervalCount
      trialPeriodDays
      isActive
      features
    }
  }
`;

const CANCEL_SUBSCRIPTION = gql`
  mutation CancelSubscription($id: ID!, $reason: String) {
    cancelSubscription(id: $id, reason: $reason) {
      id
      status
      cancelledAt
      cancelReason
    }
  }
`;

const UPDATE_SUBSCRIPTION = gql`
  mutation UpdateSubscription($id: ID!, $input: UpdateSubscriptionInput!) {
    updateSubscription(id: $id, input: $input) {
      id
      status
      cancelledAt
      cancelReason
    }
  }
`;

// Types
interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: "ACTIVE" | "INACTIVE" | "CANCELLED" | "PAST_DUE" | "TRIALING";
  paystackSubscriptionCode?: string;
  paystackCustomerCode?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart?: string;
  trialEnd?: string;
  cancelledAt?: string;
  cancelReason?: string;
  nextBillingDate?: string;
  lastPaymentDate?: string;
  failedPaymentCount: number;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  plan: {
    id: string;
    name: string;
    description?: string;
    amount: number;
    currency: string;
    interval: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
    intervalCount: number;
    trialPeriodDays?: number;
    features?: string[];
  };
  customer: {
    id: string;
    name: string;
    email: string;
    state: string;
  };
  payments: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    paidAt: string | null;
    failedAt: string | null;
    paystackReference?: string;
    paystackTransactionId?: string;
    authorizationCode?: string;
    periodStart?: string;
    periodEnd?: string;
    invoiceNumber?: string;
    failureReason?: string;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
  }[];
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";
  intervalCount: number;
  trialPeriodDays?: number;
  isActive: boolean;
  features?: string[];
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          variant: "default" as const,
          icon: CheckCircleIcon,
          color: "text-green-600",
        };
      case "TRIALING":
        return {
          variant: "secondary" as const,
          icon: ClockIcon,
          color: "text-blue-600",
        };
      case "CANCELLED":
        return {
          variant: "destructive" as const,
          icon: XCircleIcon,
          color: "text-red-600",
        };
      case "PAST_DUE":
        return {
          variant: "destructive" as const,
          icon: ExclamationTriangleIcon,
          color: "text-orange-600",
        };
      default:
        return {
          variant: "secondary" as const,
          icon: ClockIcon,
          color: "text-gray-600",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center space-x-1">
      <Icon className={`h-3 w-3 ${config.color}`} />
      <span>{status}</span>
    </Badge>
  );
};

const SubscriptionCard: React.FC<{
  subscription: Subscription;
  onCancel: (id: string) => void;
  onReactivate: (id: string) => void;
  onViewDetails: (subscription: Subscription) => void;
}> = ({ subscription, onCancel, onReactivate, onViewDetails }) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatInterval = (interval: string, count: number) => {
    const intervalMap = {
      DAILY: "day",
      WEEKLY: "week",
      MONTHLY: "month",
      QUARTERLY: "quarter",
      YEARLY: "year",
    };
    const unit =
      intervalMap[interval as keyof typeof intervalMap] ||
      interval.toLowerCase();
    return count === 1 ? `per ${unit}` : `every ${count} ${unit}s`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {subscription.plan.name}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <StatusBadge status={subscription.status} />
                <span className="text-sm text-gray-500">
                  ID: {subscription.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(
                subscription.plan.amount,
                subscription.plan.currency,
              )}
            </div>
            <div className="text-sm text-gray-500">
              {formatInterval(
                subscription.plan.interval,
                subscription.plan.intervalCount,
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {subscription.plan.description && (
            <p className="text-sm text-gray-600">
              {subscription.plan.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-gray-500">Current Period</Label>
              <p className="font-medium">
                {new Date(subscription.currentPeriodStart).toLocaleDateString()}{" "}
                - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-gray-500">Next Billing</Label>
              <p className="font-medium">
                {subscription.nextBillingDate
                  ? new Date(subscription.nextBillingDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {subscription.trialEnd &&
            new Date(subscription.trialEnd) > new Date() && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Trial ends on{" "}
                    {new Date(subscription.trialEnd).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}

          {subscription.failedPaymentCount > 0 && (
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  {subscription.failedPaymentCount} failed payment(s)
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(subscription)}
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <div className="space-x-2">
              {subscription.status === "ACTIVE" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(subscription.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Cancel
                </Button>
              )}
              {subscription.status === "CANCELLED" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReactivate(subscription.id)}
                  className="text-green-600 hover:text-green-800"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Reactivate
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SubscriptionDetailsModal: React.FC<{
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ subscription, isOpen, onClose }) => {
  if (!subscription) return null;

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subscription Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Subscription Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Subscription Info</h3>
              <div className="space-y-2">
                <div>
                  <Label>Plan</Label>
                  <p className="font-medium">{subscription.plan.name}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <StatusBadge status={subscription.status} />
                </div>
                <div>
                  <Label>Amount</Label>
                  <p className="font-medium">
                    {formatCurrency(
                      subscription.plan.amount,
                      subscription.plan.currency,
                    )}
                  </p>
                </div>
                <div>
                  <Label>Customer</Label>
                  <p className="font-medium">{subscription.customer.name}</p>
                  <p className="text-sm text-gray-600">
                    {subscription.customer.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {subscription.customer.state}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Billing Info</h3>
              <div className="space-y-2">
                <div>
                  <Label>Current Period</Label>
                  <p className="font-medium">
                    {new Date(
                      subscription.currentPeriodStart,
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(
                      subscription.currentPeriodEnd,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label>Next Billing Date</Label>
                  <p className="font-medium">
                    {subscription.nextBillingDate
                      ? new Date(
                          subscription.nextBillingDate,
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label>Last Payment</Label>
                  <p className="font-medium">
                    {subscription.lastPaymentDate
                      ? new Date(
                          subscription.lastPaymentDate,
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label>Failed Payments</Label>
                  <p className="font-medium">
                    {subscription.failedPaymentCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Features */}
          {subscription.plan.features &&
            subscription.plan.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Plan Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {subscription.plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Payment History */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Payment History</h3>
            {subscription.payments && subscription.payments.length > 0 ? (
              <div className="space-y-2">
                {subscription.payments.slice(0, 5).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString()
                          : payment.failedAt
                            ? `Failed: ${new Date(payment.failedAt).toLocaleDateString()}`
                            : new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          payment.status === "SUCCESS"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {payment.status}
                      </Badge>
                      {payment.paystackReference && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ref: {payment.paystackReference}
                        </p>
                      )}
                      {payment.invoiceNumber && (
                        <p className="text-xs text-gray-500 mt-1">
                          Invoice: {payment.invoiceNumber}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No payment history available</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function BillingPage() {
  const { user } = useAuth();
  const { organisationId } = useOrganisationBranch();
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // GraphQL hooks
  const {
    data: subscriptionsData,
    loading: subscriptionsLoading,
    error: subscriptionsError,
    refetch,
  } = useQuery(GET_SUBSCRIPTIONS, {
    variables: {
      filter: {
        organisationId: organisationId,
        take: 50,
        skip: 0,
      },
    },
    skip: !organisationId,
  });

  const { data: plansData, loading: plansLoading } = useQuery(
    GET_SUBSCRIPTION_PLANS,
    {
      variables: {
        filter: {
          organisationId: organisationId,
        },
      },
      skip: !organisationId,
    },
  );

  const [cancelSubscription, { loading: cancelLoading }] = useMutation(
    CANCEL_SUBSCRIPTION,
    {
      onCompleted: () => {
        refetch();
      },
      onError: (error) => {},
    },
  );

  const [reactivateSubscription, { loading: reactivateLoading }] = useMutation(
    UPDATE_SUBSCRIPTION,
    {
      onCompleted: () => {
        refetch();
      },
      onError: (error) => {},
    },
  );

  const handleCancelSubscription = (id: string) => {
    if (confirm("Are you sure you want to cancel this subscription?")) {
      const reason = prompt(
        "Please provide a reason for cancellation (optional):",
      );
      cancelSubscription({
        variables: { id, reason: reason || undefined },
      });
    }
  };

  const handleReactivateSubscription = (id: string) => {
    if (confirm("Are you sure you want to reactivate this subscription?")) {
      reactivateSubscription({
        variables: {
          id,
          input: {
            status: "ACTIVE",
          },
        },
      });
    }
  };

  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowDetailsModal(true);
  };

  const subscriptions = subscriptionsData?.getSubscriptions || [];
  const plans = plansData?.subscriptionPlans || [];

  if (subscriptionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (subscriptionsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">
            Error loading billing information: {subscriptionsError.message}
          </p>
          <Button onClick={() => refetch()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <RoleRoute
      allowedRoles={["SUPER_ADMIN", "SUBSCRIPTION_MANAGER", "BRANCH_ADMIN"]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Billing & Subscriptions
            </h1>
            <p className="text-gray-600">
              Manage your subscriptions and billing information (
              {subscriptions.length} active)
            </p>
          </div>
          <Button>
            <CreditCardIcon className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>

        {/* Subscriptions Grid */}
        {subscriptions.length === 0 ? (
          <div className="text-center py-12">
            <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No subscriptions found
            </h3>
            <p className="text-gray-600 mb-4">
              You don't have any active subscriptions yet.
            </p>
            <Button>
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Browse Plans
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onCancel={handleCancelSubscription}
                onReactivate={handleReactivateSubscription}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Subscription Details Modal */}
        <SubscriptionDetailsModal
          subscription={selectedSubscription}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedSubscription(null);
          }}
        />
      </div>
    </RoleRoute>
  );
}
