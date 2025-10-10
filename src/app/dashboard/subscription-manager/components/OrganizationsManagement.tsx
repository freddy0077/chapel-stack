"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  ChevronDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getOrganizationStatusBadgeColor,
  formatDate,
} from "../utils/formatters";
import CreateOrganizationModal from "./CreateOrganizationModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { GET_SUBSCRIPTION_ORGANIZATIONS } from "@/graphql/subscription-management";
import { useCreateOrganizationSubscription } from "@/hooks/subscription/useOrganizationSubscription";

// Modern Filter Component
function ModernFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  subscriptionFilter,
  setSubscriptionFilter,
  onRefresh,
  loading,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  subscriptionFilter: string;
  setSubscriptionFilter: (value: string) => void;
  onRefresh: () => void;
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Organization Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Subscription Filter */}
          <Select
            value={subscriptionFilter}
            onValueChange={setSubscriptionFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Subscription Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subscriptions</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Modern Organization Card Component
function OrganizationCard({
  organization,
  onCreateSubscription,
  renewalLoading,
  renewalOrgId,
  onChangePassword,
}: {
  organization: any;
  onCreateSubscription: (orgId: string) => void;
  renewalLoading: boolean;
  renewalOrgId: string | null;
  onChangePassword: (org: any) => void;
}) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "suspended":
        return <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />;
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSubscriptionStatusBadge = (subscription: any) => {
    if (!subscription) {
      return <Badge variant="secondary">No Subscription</Badge>;
    }

    switch (subscription.status?.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "trial":
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{subscription.status}</Badge>;
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-indigo-500">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Organization Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {organization.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusIcon(organization.status)}
                <span className="text-sm text-gray-600">
                  {organization.status || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Organization Email</p>
              <p className="text-sm font-medium text-gray-900">
                {organization.email || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Admin Email</p>
              <p className="text-sm font-medium text-gray-900">
                {organization.mainUser?.email || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-sm font-medium text-gray-900">
                {organization.phoneNumber || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-sm font-medium text-gray-900">
                {organization.createdAt
                  ? formatDate(organization.createdAt)
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Members</p>
              <div className="flex items-center space-x-1">
                <UserGroupIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {organization.memberCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CreditCardIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Subscription Status
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  {getSubscriptionStatusBadge(organization.subscription)}
                  {organization.subscription?.plan && (
                    <span className="text-xs text-gray-500">
                      ({organization.subscription.plan.name})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Subscription Actions */}
            <div className="flex items-center space-x-2">
              {!organization.subscription ? (
                <Button
                  size="sm"
                  onClick={() => onCreateSubscription(organization.id)}
                  disabled={renewalLoading && renewalOrgId === organization.id}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {renewalLoading && renewalOrgId === organization.id ? (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    <PlusIcon className="h-4 w-4" />
                  )}
                  <span className="ml-1">Create</span>
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Change Password Button */}
          {organization.mainUser && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChangePassword(organization)}
                className="w-full flex items-center justify-center space-x-2"
              >
                <KeyIcon className="h-4 w-4" />
                <span>Change Main User Password</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function OrganizationsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [renewalOrgId, setRenewalOrgId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);

  // Hook for creating/renewing subscriptions
  const { createOrganizationSubscription, loading: renewalLoading } =
    useCreateOrganizationSubscription();

  // Fetch organizations from backend
  const {
    data: organizationsData,
    loading,
    error,
    refetch,
  } = useQuery(GET_SUBSCRIPTION_ORGANIZATIONS, {
    variables: {
      filter: {
        // Add any filters if needed
      },
    },
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const organizations = organizationsData?.subscriptionOrganizations || [];

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org: any) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || org.status?.toLowerCase() === statusFilter;

      const matchesSubscription =
        subscriptionFilter === "all" ||
        (subscriptionFilter === "active" &&
          org.subscription?.status === "ACTIVE") ||
        (subscriptionFilter === "trial" &&
          org.subscription?.status === "TRIALING") ||
        (subscriptionFilter === "expired" &&
          (!org.subscription || org.subscription?.status === "EXPIRED")) ||
        (subscriptionFilter === "cancelled" &&
          org.subscription?.status === "CANCELLED");

      return matchesSearch && matchesStatus && matchesSubscription;
    });
  }, [organizations, searchTerm, statusFilter, subscriptionFilter]);

  const analytics = useMemo(() => {
    const total = organizations.length;
    const active = organizations.filter((o: any) => o.status === 'ACTIVE').length;
    const expired = organizations.filter((o: any) => o.status === 'EXPIRED').length;
    const trialing = organizations.filter((o: any) => o.subscription?.status === 'TRIALING').length;
    const cancelled = organizations.filter((o: any) => o.subscription?.status === 'CANCELLED').length;
    return { total, active, expired, trialing, cancelled };
  }, [organizations]);

  const handleCreateSubscription = async (organizationId: string) => {
    setRenewalOrgId(organizationId);
    try {
      // This would typically open a modal or navigate to subscription creation
      // await createOrganizationSubscription(organizationId, planId, options);
      // refetch();
    } catch (error) {
      console.error("Failed to create subscription:", error);
    } finally {
      setRenewalOrgId(null);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleChangePassword = (organization: any) => {
    setSelectedOrganization(organization);
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setSelectedOrganization(null);
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Error loading organizations
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error.message}</p>
          <Button onClick={handleRefresh} className="mt-4">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white rounded-lg shadow p-4 mb-2">
        <div className="flex gap-4 flex-wrap">
          <span className="font-semibold text-lg">Organizations</span>
          <span className="text-gray-500">Total: <span className="font-bold">{analytics.total}</span></span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">Active: {analytics.active}</span>
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">Trialing: {analytics.trialing}</span>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">Cancelled: {analytics.cancelled}</span>
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">Expired: {analytics.expired}</span>
        </div>
        <Button onClick={refetch} variant="outline" size="sm" className="ml-auto">
          <ArrowPathIcon className="w-4 h-4 mr-1 inline" /> Refresh
        </Button>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Organizations Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage {organizations.length} organizations and their subscription
            status
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Squares2X2Icon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <ListBulletIcon className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Organization
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ModernFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        subscriptionFilter={subscriptionFilter}
        setSubscriptionFilter={setSubscriptionFilter}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Organizations Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredOrganizations.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No organizations found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ||
              statusFilter !== "all" ||
              subscriptionFilter !== "all"
                ? "Try adjusting your search criteria."
                : "Get started by creating a new organization."}
            </p>
            {!searchTerm &&
              statusFilter === "all" &&
              subscriptionFilter === "all" && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Organization
                </Button>
              )}
          </div>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
              : "space-y-4"
          }
        >
          {filteredOrganizations.map((organization: any) => (
            <OrganizationCard
              key={organization.id}
              organization={organization}
              onCreateSubscription={handleCreateSubscription}
              renewalLoading={renewalLoading}
              renewalOrgId={renewalOrgId}
              onChangePassword={handleChangePassword}
            />
          ))}
        </div>
      )}

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refetch();
        }}
      />

      {/* Change Password Modal */}
      {selectedOrganization && (
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={handleClosePasswordModal}
          userId={selectedOrganization.mainUser?.id}
          userName={`${selectedOrganization.mainUser?.firstName || ''} ${selectedOrganization.mainUser?.lastName || ''}`.trim() || selectedOrganization.mainUser?.email}
          organizationName={selectedOrganization.name}
        />
      )}
    </div>
  );
}
