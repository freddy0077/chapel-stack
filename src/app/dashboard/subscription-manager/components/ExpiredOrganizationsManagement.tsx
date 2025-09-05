"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  ExclamationTriangleIcon,
  CreditCardIcon,
  ClockIcon,
  BuildingOfficeIcon,
  EyeIcon,
  LinkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "../utils/formatters";
import {
  GET_SUBSCRIPTION_ORGANIZATIONS,
  CREATE_ORGANIZATION_SUBSCRIPTION,
  GET_SUBSCRIPTION_PLANS,
} from "@/graphql/subscription-management";
import { useCreateOrganizationSubscription } from "@/hooks/subscription/useOrganizationSubscription";

interface ExpiredOrganization {
  id: string;
  name: string;
  email: string;
  status: string;
  subscription?: {
    id: string;
    status: string;
    currentPeriodEnd: string;
    planName: string;
  };
  _count: {
    users: number;
    branches: number;
  };
}

export default function ExpiredOrganizationsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [renewalPlanId, setRenewalPlanId] = useState("");
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showRenewalLinkModal, setShowRenewalLinkModal] = useState(false);
  const [renewalLink, setRenewalLink] = useState("");

  // Fetch organizations with expired subscriptions
  const {
    data: organizationsData,
    loading,
    error,
    refetch,
  } = useQuery(GET_SUBSCRIPTION_ORGANIZATIONS, {
    variables: {
      filter: {
        subscriptionStatus: "PAST_DUE",
      },
    },
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  // Fetch subscription plans for renewal
  const { data: plansData } = useQuery(GET_SUBSCRIPTION_PLANS, {
    variables: { filter: { isActive: true } },
  });

  // Hook for creating subscriptions
  const { createOrganizationSubscription, loading: renewalLoading } =
    useCreateOrganizationSubscription();

  const organizations: ExpiredOrganization[] =
    organizationsData?.subscriptionOrganizations || [];
  const plans = plansData?.subscriptionPlans || [];

  // Debug logging to check organization data
  if (organizations.length > 0) {
  }

  // Filter expired organizations
  const expiredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const hasExpiredSubscription =
        org.subscription?.status === "EXPIRED" ||
        org.subscription?.status === "PAST_DUE" ||
        org.subscription?.status === "CANCELLED";

      return matchesSearch && hasExpiredSubscription;
    });
  }, [organizations, searchTerm]);

  const handleManualRenewal = async () => {
    if (!selectedOrgId || !renewalPlanId) return;

    try {
      await createOrganizationSubscription({
        variables: {
          input: {
            organizationId: selectedOrgId,
            planId: renewalPlanId,
            startDate: new Date().toISOString(),
          },
        },
      });

      setShowRenewalModal(false);
      setSelectedOrgId(null);
      setRenewalPlanId("");
      refetch();
    } catch (error) {
      console.error("Manual renewal error:", error);
    }
  };

  const generateRenewalLink = (orgId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const link = `${baseUrl}/renew/${orgId}`;
    setRenewalLink(link);
    setShowRenewalLinkModal(true);
  };

  const copyRenewalLink = () => {
    navigator.clipboard.writeText(renewalLink);
    // You could add a toast notification here
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "EXPIRED":
        return "bg-red-100 text-red-800";
      case "PAST_DUE":
        return "bg-orange-100 text-orange-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <ClockIcon className="h-8 w-8 text-gray-400 animate-spin" />
        <span className="ml-2 text-gray-500">
          Loading expired organizations...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Error loading organizations
        </h3>
        <p className="mt-1 text-sm text-gray-500">{error.message}</p>
        <Button className="mt-4" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Expired Organizations
          </h2>
          <p className="text-sm text-gray-500">
            Organizations with expired subscriptions that need renewal
          </p>
        </div>
        <Badge className="bg-red-100 text-red-800">
          {expiredOrganizations.length} Expired
        </Badge>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {/* Organizations List */}
      {expiredOrganizations.length === 0 ? (
        <Card className="p-12 text-center">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No Expired Organizations
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            All organizations have active subscriptions.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {expiredOrganizations.map((org) => (
            <Card key={org.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <BuildingOfficeIcon className="h-10 w-10 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {org.name}
                    </h3>
                    <p className="text-sm text-gray-500">{org.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge
                        className={getStatusBadgeColor(
                          org.subscription?.status || "UNKNOWN",
                        )}
                      >
                        {org.subscription?.status || "NO_SUBSCRIPTION"}
                      </Badge>
                      {org.subscription?.currentPeriodEnd && (
                        <span className="text-xs text-gray-500">
                          Expired:{" "}
                          {formatDate(org.subscription.currentPeriodEnd)}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {org._count.users} users, {org._count.branches} branches
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateRenewalLink(org.id)}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Get Renewal Link
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setSelectedOrgId(org.id);
                      setShowRenewalModal(true);
                    }}
                  >
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Manual Renewal
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Manual Renewal Modal */}
      {showRenewalModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4 p-6">
            <div className="text-center mb-6">
              <CreditCardIcon className="mx-auto h-12 w-12 text-indigo-600" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Manual Renewal
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a subscription plan to renew this organization
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Plan
                </label>
                <select
                  value={renewalPlanId}
                  onChange={(e) => setRenewalPlanId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Choose a plan...</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - {formatCurrency(plan.amount, plan.currency)}
                      /{plan.interval}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRenewalModal(false);
                    setSelectedOrgId(null);
                    setRenewalPlanId("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleManualRenewal}
                  disabled={!renewalPlanId || renewalLoading}
                  className="flex-1"
                >
                  {renewalLoading ? "Processing..." : "Renew"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Renewal Link Modal */}
      {showRenewalLinkModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4 p-6">
            <div className="text-center mb-6">
              <LinkIcon className="mx-auto h-12 w-12 text-indigo-600" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Renewal Link
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Share this link with the organization to allow self-service
                renewal
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renewal URL
                </label>
                <div className="flex">
                  <Input
                    type="text"
                    value={renewalLink}
                    readOnly
                    className="flex-1 rounded-r-none"
                  />
                  <Button
                    onClick={copyRenewalLink}
                    className="rounded-l-none border-l-0"
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
                <p>
                  <strong>Instructions:</strong>
                </p>
                <ul className="mt-1 space-y-1">
                  <li>• Send this link to the organization's admin</li>
                  <li>• They can renew without logging in</li>
                  <li>• Link includes organization verification</li>
                  <li>• Payment processing via Paystack</li>
                </ul>
              </div>

              <Button
                onClick={() => setShowRenewalLinkModal(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
