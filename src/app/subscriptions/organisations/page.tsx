'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { RoleRoute } from '@/components/auth/RoleRoute';
import { CreateOrganizationSubscriptionModal } from '@/components/subscriptions/CreateOrganizationSubscriptionModal';
import { useOrganizations } from '@/hooks/subscription/useOrganizations';
import { useOrganizationStats } from '@/hooks/subscription/useOrganizations';
import { useOrganizationSubscriptionManagement } from '@/hooks/subscription/useOrganizationSubscription';
import { 
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// Subscription Management Sidebar Component
const SubscriptionSidebar = ({ activeTab, setActiveTab }) => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { id: 'organizations', label: 'Organizations', icon: BuildingOfficeIcon },
    { id: 'billing', label: 'Billing', icon: CurrencyDollarIcon },
    { id: 'reports', label: 'Reports', icon: DocumentTextIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Subscription Management</h2>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

// Stats Cards Component
const StatsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Organizations',
      value: stats?.totalOrganizations || 0,
      icon: BuildingOfficeIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Subscriptions',
      value: stats?.activeSubscriptions || 0,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats?.monthlyRevenue || 0}`,
      icon: CurrencyDollarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Trial Organizations',
      value: stats?.trialOrganizations || 0,
      icon: ClockIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// Organization Table Component
const OrganizationTable = ({ organizations, onViewDetails, onToggleStatus, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (state: string) => {
    switch (state?.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {organizations.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <BuildingOfficeIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{org.name}</div>
                        <div className="text-sm text-gray-500">{org.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(org.state)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {org.subscription?.plan?.name || 'No Plan'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {org.memberCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(org)}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onToggleStatus(org)}
                      className={org.state === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                    >
                      {org.state === 'active' ? (
                        <>
                          <PauseIcon className="h-4 w-4 mr-1" />
                          Suspend
                        </>
                      ) : (
                        <>
                          <PlayIcon className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// Organization Details Modal
const OrganizationDetailsModal = ({ organization, isOpen, onClose }) => {
  if (!organization) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {organization.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Organization Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organization Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{organization.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{organization.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">State</label>
                  <p className="text-gray-900">{organization.state}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Members</label>
                  <p className="text-gray-900">{organization.memberCount || 0}</p>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Info */}
            {organization.subscription && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Subscription Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Plan</label>
                    <p className="text-gray-900">{organization.subscription.plan?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">State</label>
                    <p className="text-gray-900">{organization.subscription.state}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Amount</label>
                    <p className="text-gray-900">${organization.subscription.amount}/month</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Next Billing</label>
                    <p className="text-gray-900">
                      {organization.subscription.nextBillingDate 
                        ? new Date(organization.subscription.nextBillingDate).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Organizations Page Component
export default function SubscriptionOrganisationsPage() {
  const [activeTab, setActiveTab] = useState('organizations');
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateSubscriptionModal, setShowCreateSubscriptionModal] = useState(false);

  const { stats, loading: statsLoading } = useOrganizationStats();
  const { 
    organizations, 
    loading, 
    error, 
    enableOrganization, 
    disableOrganization,
    refetch 
  } = useOrganizations({
    search: searchTerm,
    state: stateFilter === 'ALL' ? '' : stateFilter,
    limit: 50
  });

  // Filter organizations based on search and state
  const filteredOrganizations = useMemo(() => {
    return organizations.filter(org => {
      const matchesSearch = !searchTerm || 
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesState = stateFilter === 'ALL' || org.state === stateFilter;
      
      return matchesSearch && matchesState;
    });
  }, [organizations, searchTerm, stateFilter]);

  const handleViewDetails = (organization) => {
    setSelectedOrg(organization);
    setShowDetails(true);
  };

  const handleToggleStatus = async (organization) => {
    try {
      if (organization.state === 'active') {
        await disableOrganization({
          id: organization.id,
          reason: 'Manual suspension'
        });
      } else {
        await enableOrganization(organization.id);
      }
      refetch();
    } catch (error) {
      console.error('Error toggling organization state:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Organizations</h2>
          <p className="text-gray-600">{error.message}</p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <RoleRoute requiredRole={['SUBSCRIPTION_MANAGER', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <SubscriptionSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
                  <p className="text-gray-600">Manage subscription organizations and their state</p>
                </div>
                <Button onClick={() => setShowCreateSubscriptionModal(true)} className="flex items-center space-x-2">
                  <PlusIcon className="h-4 w-4" />
                  <span>Create Subscription</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {/* Stats Cards */}
            <StatsCards stats={stats} loading={statsLoading} />

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Search organizations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Select value={stateFilter} onValueChange={setStateFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All States</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="trialing">Trialing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organizations Table */}
            <OrganizationTable
              organizations={filteredOrganizations}
              onViewDetails={handleViewDetails}
              onToggleStatus={handleToggleStatus}
              loading={loading}
            />
          </div>
        </div>

        {/* Organization Details Modal */}
        <OrganizationDetailsModal
          organization={selectedOrg}
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedOrg(null);
          }}
        />

        {/* Create Subscription Modal */}
        <CreateOrganizationSubscriptionModal
          isOpen={showCreateSubscriptionModal}
          onClose={() => setShowCreateSubscriptionModal(false)}
          onSuccess={(subscription) => {
            // Refresh organizations data
            refetch();
            setShowCreateSubscriptionModal(false);
          }}
        />
      </div>
    </RoleRoute>
  );
}
