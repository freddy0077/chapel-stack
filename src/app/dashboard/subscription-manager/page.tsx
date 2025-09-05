"use client";

import React, { useState } from "react";
import {
  BuildingOfficeIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  RectangleStackIcon,
  Squares2X2Icon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { RoleRoute } from "@/components/auth/RoleRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscriptionDashboard } from "@/hooks/useSubscriptionDashboard";

// Utility function for class names
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Tab components
import OrganizationsManagement from "./components/OrganizationsManagement";
import SubscriptionsManagement from "./components/SubscriptionsManagement";
import PaymentsManagement from "./components/PaymentsManagement";
import ExpiredOrganizationsManagement from "./components/ExpiredOrganizationsManagement";
import PlansManagement from "./components/PlansManagement";

// Modern Dashboard Stats Component
interface Stat {
  name: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: any;
  color: string;
}

function DashboardStats() {
  const { stats, loading, error } = useSubscriptionDashboard();

  // Show loading skeleton while fetching data
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-lg border border-white/20 shadow-xl"
          >
            <div className="p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
                    <div className="h-8 w-8 bg-gray-400 rounded-xl" />
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <div className="h-4 bg-gray-200 rounded-full animate-pulse mb-3" />
                  <div className="h-8 bg-gray-200 rounded-full animate-pulse w-24" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>
    );
  }

  // Show error state if data fetch fails
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <div className="col-span-full rounded-3xl bg-red-50/80 backdrop-blur-lg border border-red-200/50 shadow-xl p-8">
          <div className="text-center">
            <div className="p-4 rounded-2xl bg-red-100 w-fit mx-auto mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Unable to Load Statistics
            </h3>
            <p className="text-sm text-red-700">
              Failed to load dashboard statistics. Please try refreshing the
              page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatGrowthRate = (rate: number) => {
    const sign = rate >= 0 ? "+" : "";
    return `${sign}${rate.toFixed(1)}%`;
  };

  const dashboardStats: Stat[] = [
    {
      name: "Total Organizations",
      value: stats?.totalOrganizations?.toString() || "0",
      change: formatGrowthRate(stats?.organizationGrowthRate || 0),
      changeType:
        (stats?.organizationGrowthRate || 0) >= 0 ? "increase" : "decrease",
      icon: BuildingOfficeIcon,
      color: "blue",
    },
    {
      name: "Active Subscriptions",
      value: stats?.activeSubscriptions?.toString() || "0",
      change: formatGrowthRate(stats?.subscriptionGrowthRate || 0),
      changeType:
        (stats?.subscriptionGrowthRate || 0) >= 0 ? "increase" : "decrease",
      icon: CheckCircleIcon,
      color: "green",
    },
    {
      name: "Monthly Revenue",
      value: formatCurrency(stats?.monthlyRevenue || 0),
      change: formatGrowthRate(stats?.revenueGrowthRate || 0),
      changeType:
        (stats?.revenueGrowthRate || 0) >= 0 ? "increase" : "decrease",
      icon: CurrencyDollarIcon,
      color: "emerald",
    },
    {
      name: "Expiring Soon",
      value: stats?.expiringSoon?.toString() || "0",
      change: "30 days",
      changeType: "increase",
      icon: ClockIcon,
      color: "amber",
    },
  ];

  const getStatGradient = (color: string) => {
    const gradients = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      emerald: "from-emerald-500 to-emerald-600",
      amber: "from-amber-500 to-amber-600",
    };
    return (
      gradients[color as keyof typeof gradients] || "from-gray-500 to-gray-600"
    );
  };

  const getStatBg = (color: string) => {
    const backgrounds = {
      blue: "from-blue-50/80 to-blue-100/40",
      green: "from-green-50/80 to-green-100/40",
      emerald: "from-emerald-50/80 to-emerald-100/40",
      amber: "from-amber-50/80 to-amber-100/40",
    };
    return (
      backgrounds[color as keyof typeof backgrounds] ||
      "from-gray-50/80 to-gray-100/40"
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
      {dashboardStats.map((stat) => (
        <div
          key={stat.name}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getStatBg(stat.color)} backdrop-blur-lg border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group`}
        >
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div
                className={`p-4 rounded-2xl bg-gradient-to-br ${getStatGradient(stat.color)} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
              >
                <stat.icon className="h-8 w-8 text-white drop-shadow-sm" />
              </div>
              <Badge
                variant={
                  stat.changeType === "increase" ? "default" : "secondary"
                }
                className={`${stat.changeType === "increase" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"} font-semibold px-3 py-1 rounded-full text-xs`}
              >
                {stat.change}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2 tracking-wide">
                {stat.name}
              </p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                {stat.value}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getStatGradient(stat.color)}`}
          />
        </div>
      ))}
    </div>
  );
}

// Dashboard Component
function DashboardComponent() {
  const {
    activities,
    loading: activitiesLoading,
    error: activitiesError,
  } = useSubscriptionDashboard();

  const formatActivityTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "subscription_created":
      case "subscription_activated":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "subscription_expired":
      case "subscription_cancelled":
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case "payment_received":
        return <CurrencyDollarIcon className="h-5 w-5 text-emerald-500" />;
      case "organization_created":
        return <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-10">
      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-white/60 backdrop-blur-lg border border-white/20 shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
            <div className="p-2 rounded-xl bg-indigo-100">
              <ClockIcon className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div className="space-y-4">
            {activitiesLoading ? (
              // Loading skeleton for activities
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-4 p-4 rounded-2xl bg-white/40 animate-pulse"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full mt-1" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded-full mb-2" />
                    <div className="h-3 bg-gray-200 rounded-full w-3/4" />
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full w-16" />
                </div>
              ))
            ) : activitiesError ? (
              <div className="text-center py-12">
                <div className="p-4 rounded-2xl bg-red-100 w-fit mx-auto mb-4">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                </div>
                <h4 className="text-lg font-semibold text-red-900 mb-2">
                  Unable to Load Activity
                </h4>
                <p className="text-sm text-red-700">
                  Failed to load recent activity. Please try again.
                </p>
              </div>
            ) : activities && activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 rounded-2xl bg-white/40 hover:bg-white/60 transition-all duration-200 border border-white/30"
                >
                  <div className="flex-shrink-0 mt-1 p-2 rounded-xl bg-white/60">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      {activity.organizationName}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-500 font-medium px-2 py-1 rounded-full bg-gray-100">
                      {formatActivityTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="p-4 rounded-2xl bg-gray-100 w-fit mx-auto mb-4">
                  <ClockIcon className="h-8 w-8 text-gray-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  No Recent Activity
                </h4>
                <p className="text-sm text-gray-500">
                  Activity will appear here as it happens.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white/60 backdrop-blur-lg border border-white/20 shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            <div className="p-2 rounded-xl bg-purple-100">
              <ArrowTrendingUpIcon className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 to-blue-100/40 border border-blue-200/50 hover:from-blue-100/80 hover:to-blue-200/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 w-fit mx-auto mb-3 group-hover:shadow-lg transition-shadow">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-blue-900">
                Add Organization
              </span>
            </button>
            <button className="group p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 border border-emerald-200/50 hover:from-emerald-100/80 hover:to-emerald-200/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 w-fit mx-auto mb-3 group-hover:shadow-lg transition-shadow">
                <CreditCardIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-emerald-900">
                Create Subscription
              </span>
            </button>
            <button className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50/80 to-purple-100/40 border border-purple-200/50 hover:from-purple-100/80 hover:to-purple-200/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 w-fit mx-auto mb-3 group-hover:shadow-lg transition-shadow">
                <RectangleStackIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-purple-900">
                Manage Plans
              </span>
            </button>
            <button className="group p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 to-amber-100/40 border border-amber-200/50 hover:from-amber-100/80 hover:to-amber-200/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 w-fit mx-auto mb-3 group-hover:shadow-lg transition-shadow">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-amber-900">
                View Reports
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modern Tab Navigation Component
interface TabNavigationProps {
  tabs: any[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

function ModernTabNavigation({
  tabs,
  selectedIndex,
  onChange,
}: TabNavigationProps) {
  return (
    <div className="mb-10">
      <div className="rounded-2xl bg-white/60 backdrop-blur-lg border border-white/20 shadow-lg p-2">
        <nav className="flex flex-wrap gap-2">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              onClick={() => onChange(index)}
              className={classNames(
                selectedIndex === index
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/60",
                "group inline-flex items-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 relative overflow-hidden",
              )}
            >
              <tab.icon
                className={classNames(
                  selectedIndex === index
                    ? "text-white"
                    : "text-gray-500 group-hover:text-gray-700",
                  "mr-3 h-5 w-5 transition-colors duration-300",
                )}
              />
              <span className="relative z-10">{tab.name}</span>
              {tab.badge && (
                <Badge
                  variant="secondary"
                  className={classNames(
                    selectedIndex === index
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-gray-100 text-gray-700 border-gray-200",
                    "ml-3 font-bold text-xs px-2 py-1",
                  )}
                >
                  {tab.badge}
                </Badge>
              )}
              {selectedIndex !== index && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Active Tab Description */}
      <div className="mt-6">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {(() => {
                const IconComponent = tabs[selectedIndex].icon;
                return <IconComponent className="h-5 w-5 text-indigo-600" />;
              })()}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-indigo-900">
                {tabs[selectedIndex].name}
              </h3>
              <p className="text-sm text-indigo-700 mt-1">
                {tabs[selectedIndex].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced tabs with badges and modern styling
interface Tab {
  name: string;
  icon: any;
  component: React.ComponentType;
  description: string;
  badge?: string;
}

function SubscriptionManagerContent(): React.ReactElement {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { counts } = useSubscriptionDashboard();

  // Create tabs with dynamic badge counts from real data
  const TABS: Tab[] = [
    {
      name: "Dashboard",
      icon: Squares2X2Icon,
      component: DashboardComponent,
      description:
        "Overview of subscription management metrics and quick actions",
    },
    {
      name: "Organizations",
      icon: BuildingOfficeIcon,
      component: OrganizationsManagement,
      description: "Manage organizations and their subscription status",
      badge: counts?.activeSubscriptions
        ? counts.activeSubscriptions.toString()
        : undefined,
    },
    {
      name: "Expired Organizations",
      icon: ExclamationTriangleIcon,
      component: ExpiredOrganizationsManagement,
      description:
        "Handle expired organization renewals and manual interventions",
      badge: counts?.expiredSubscriptions
        ? counts.expiredSubscriptions.toString()
        : undefined,
    },
    {
      name: "Plans",
      icon: RectangleStackIcon,
      component: PlansManagement,
      description: "Create and manage subscription plans",
    },
    {
      name: "Subscriptions",
      icon: CreditCardIcon,
      component: SubscriptionsManagement,
      description: "Create, update, and manage subscriptions",
      badge: counts?.activeSubscriptions
        ? counts.activeSubscriptions.toString()
        : undefined,
    },
    {
      name: "Payments",
      icon: BanknotesIcon,
      component: PaymentsManagement,
      description: "Monitor and manage subscription payments and billing",
      badge: counts?.pendingRenewals
        ? counts.pendingRenewals.toString()
        : undefined,
    },
  ];

  const CurrentComponent = TABS[selectedIndex].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 relative overflow-x-hidden">
      {/* Modern Header with Glassmorphism and Gradient */}
      <div className="sticky top-0 z-20 w-full bg-gradient-to-r from-indigo-600/80 via-purple-600/60 to-blue-600/80 shadow-2xl backdrop-blur-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-2xl bg-white/20 shadow-lg backdrop-blur-md border border-white/30">
                <CreditCardIcon className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow">
                  Subscription Manager
                </h1>
                <p className="mt-1 text-indigo-100 text-lg font-medium">
                  Comprehensive subscription and organization management
                  platform
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur rounded-xl font-semibold shadow"
              >
                New Subscription
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur rounded-xl font-semibold shadow"
              >
                Add Organization
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ModernTabNavigation
          tabs={TABS}
          selectedIndex={selectedIndex}
          onChange={setSelectedIndex}
        />
        <div className="mt-6 animate-fade-in">
          <CurrentComponent />
        </div>
      </div>
      {/* Subtle background shapes for modern feel */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
    </div>
  );
}

export default function SubscriptionManagerPage(): React.ReactElement {
  return (
    <RoleRoute allowedRoles={["SUBSCRIPTION_MANAGER"]}>
      <SubscriptionManagerContent />
    </RoleRoute>
  );
}
