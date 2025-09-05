"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BudgetVsActualReport } from "./components/BudgetVsActualReport";
import { PledgeFulfillmentReport } from "./components/PledgeFulfillmentReport";
import { ContributionsReport } from "./components/ContributionsReport";
import { MemberDemographicsReport } from "./components/MemberDemographicsReport";
import { Label } from "@/components/ui/label";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import DashboardHeader from "@/components/DashboardHeader";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  UserGroupIcon,
  ClockIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChartBarIcon as ChartBarIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  UsersIcon as UsersIconSolid,
  CalendarIcon as CalendarIconSolid,
  DocumentChartBarIcon as DocumentChartBarIconSolid,
} from "@heroicons/react/24/solid";

// Query to get branches and organizations for filters
const GET_FILTER_OPTIONS = gql`
  query GetFilterOptions {
    branches(filterInput: {}, paginationInput: { skip: 0, take: 100 }) {
      items {
        id
        name
      }
      hasNextPage
      totalCount
    }
    organisations {
      id
      name
    }
    funds(organisationId: null) {
      id
      name
    }
  }
`;

// Report categories with modern icons and descriptions
const reportCategories = [
  {
    id: "overview",
    name: "Overview",
    icon: ChartBarIcon,
    iconSolid: ChartBarIconSolid,
    description: "Key metrics and insights",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "financial",
    name: "Financial",
    icon: CurrencyDollarIcon,
    iconSolid: CurrencyDollarIconSolid,
    description: "Budget, contributions & expenses",
    color: "from-green-500 to-green-600",
  },
  {
    id: "membership",
    name: "Membership",
    icon: UsersIcon,
    iconSolid: UsersIconSolid,
    description: "Member demographics & growth",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "attendance",
    name: "Attendance",
    icon: CalendarIcon,
    iconSolid: CalendarIconSolid,
    description: "Service & event attendance",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "custom",
    name: "Custom Reports",
    icon: DocumentChartBarIcon,
    iconSolid: DocumentChartBarIconSolid,
    description: "Build custom reports",
    color: "from-indigo-500 to-indigo-600",
  },
];

export default function ReportsPage() {
  const { state } = useAuth();
  const user = state.user;
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30)),
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [selectedFundId, setSelectedFundId] = useState<string>("all");
  const [appliedDateRange, setAppliedDateRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });

  // Get organization/branch filter based on user role
  const orgBranchFilter = useOrganisationBranch();
  const isSuperAdmin = user?.primaryRole === "SUPER_ADMIN";

  // Update the query to include organizationId from the filter
  const { data: filterOptions, loading: loadingFilters } =
    useQuery(GET_FILTER_OPTIONS);

  // Set appropriate default branch/organization based on user role
  useEffect(() => {
    if (orgBranchFilter.branchId) {
      setSelectedBranchId(orgBranchFilter.branchId);
    }
  }, [orgBranchFilter.branchId]);

  const handleApplyDateRange = () => {
    setAppliedDateRange({
      startDate,
      endDate,
    });
  };

  // Mock data for overview metrics
  const overviewMetrics = [
    {
      title: "Total Revenue",
      value: "GHS 45,230",
      change: "+12.5%",
      trend: "up",
      icon: BanknotesIcon,
      color: "text-green-600",
    },
    {
      title: "Active Members",
      value: "1,247",
      change: "+3.2%",
      trend: "up",
      icon: UserGroupIcon,
      color: "text-blue-600",
    },
    {
      title: "Avg. Attendance",
      value: "89%",
      change: "+5.1%",
      trend: "up",
      icon: ClockIcon,
      color: "text-purple-600",
    },
    {
      title: "Reports Generated",
      value: "24",
      change: "+8.3%",
      trend: "up",
      icon: DocumentChartBarIcon,
      color: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Generate Financial Report",
      description: "Create comprehensive financial analysis",
      action: () => setActiveSection("financial"),
      icon: CurrencyDollarIcon,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Member Growth Analysis",
      description: "Analyze membership trends and demographics",
      action: () => setActiveSection("membership"),
      icon: UsersIcon,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Attendance Insights",
      description: "Review service and event attendance",
      action: () => setActiveSection("attendance"),
      icon: CalendarIcon,
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "Custom Report Builder",
      description: "Build tailored reports for specific needs",
      action: () => setActiveSection("custom"),
      icon: DocumentChartBarIcon,
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewMetrics.map((metric, index) => (
          <Card
            key={index}
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {metric.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">
                      {metric.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      vs last period
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${
                    metric.color === "text-green-600"
                      ? "from-green-100 to-green-200"
                      : metric.color === "text-blue-600"
                        ? "from-blue-100 to-blue-200"
                        : metric.color === "text-purple-600"
                          ? "from-purple-100 to-purple-200"
                          : "from-orange-100 to-orange-200"
                  }`}
                >
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Quick Actions
          </CardTitle>
          <CardDescription className="text-gray-600">
            Generate reports and insights with one click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md text-left group"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg ${action.color} transition-colors duration-200`}
                  >
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Recent Reports
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your recently generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: "Monthly Financial Summary",
                type: "Financial",
                date: "2 hours ago",
                status: "Ready",
              },
              {
                name: "Member Growth Analysis",
                type: "Membership",
                date: "1 day ago",
                status: "Ready",
              },
              {
                name: "Attendance Trends Q4",
                type: "Attendance",
                date: "3 days ago",
                status: "Ready",
              },
              {
                name: "Budget vs Actual Report",
                type: "Financial",
                date: "1 week ago",
                status: "Ready",
              },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <DocumentChartBarIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-600">
                      {report.type} • {report.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {report.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "financial":
        return (
          <div className="space-y-8">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Contributions
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        GHS 125,430
                      </p>
                      <div className="flex items-center mt-2">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          +18.2%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          vs last period
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-200">
                      <BanknotesIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Budget Variance
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        -GHS 2,340
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-sm font-medium text-orange-600">
                          -3.8%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          under budget
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200">
                      <ChartBarIcon className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Pledge Fulfillment
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        87.5%
                      </p>
                      <div className="flex items-center mt-2">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          +5.2%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                          vs last period
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                      <DocumentChartBarIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Reports Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <CurrencyDollarIcon className="h-6 w-6 mr-2 text-green-600" />
                  Financial Reports
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Comprehensive financial analysis and insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <BudgetVsActualReport
                  branchId={
                    selectedBranchId === "all" ? undefined : selectedBranchId
                  }
                  organisationId={orgBranchFilter.organisationId}
                  dateRange={appliedDateRange}
                />

                <PledgeFulfillmentReport
                  branchId={
                    selectedBranchId === "all" ? undefined : selectedBranchId
                  }
                  organisationId={orgBranchFilter.organisationId}
                  fundId={selectedFundId === "all" ? undefined : selectedFundId}
                  dateRange={appliedDateRange}
                />

                <ContributionsReport
                  branchId={
                    selectedBranchId === "all" ? undefined : selectedBranchId
                  }
                  organisationId={orgBranchFilter.organisationId}
                  fundId={selectedFundId === "all" ? undefined : selectedFundId}
                  dateRange={appliedDateRange}
                />
              </CardContent>
            </Card>
          </div>
        );
      case "membership":
        return (
          <div className="space-y-8">
            {/* Membership Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Members
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        1,247
                      </p>
                      <div className="flex items-center mt-2">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          +3.2%
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200">
                      <UserGroupIcon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        New Members
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        42
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-500">
                          this month
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-200">
                      <UsersIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Rate
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        89.3%
                      </p>
                      <div className="flex items-center mt-2">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          +2.1%
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
                      <ClockIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Avg. Age
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        34.2
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-500">years</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200">
                      <UsersIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Membership Reports */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <UsersIcon className="h-6 w-6 mr-2 text-purple-600" />
                  Detailed Membership Reports
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Comprehensive membership analysis and demographics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MemberDemographicsReport
                  branchId={
                    selectedBranchId === "all" ? undefined : selectedBranchId
                  }
                  organisationId={orgBranchFilter.organisationId}
                  dateRange={appliedDateRange}
                />
              </CardContent>
            </Card>
          </div>
        );
      case "attendance":
        return (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <CalendarIcon className="h-6 w-6 mr-2 text-orange-600" />
                Attendance Reports
              </CardTitle>
              <CardDescription className="text-gray-600">
                Comprehensive attendance tracking and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Attendance tracking and analysis features are under
                  development. You'll be able to track service attendance, event
                  participation, and member engagement patterns.
                </p>
              </div>
            </CardContent>
          </Card>
        );
      case "custom":
        return (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <DocumentChartBarIcon className="h-6 w-6 mr-2 text-indigo-600" />
                Custom Report Builder
              </CardTitle>
              <CardDescription className="text-gray-600">
                Build tailored reports for your specific needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DocumentChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  The custom report builder will allow you to create
                  personalized reports with drag-and-drop functionality, custom
                  filters, and advanced analytics.
                </p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Reports</h1>
                <p className="text-sm text-gray-600">Analytics & Insights</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Filters Section */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Filters
            </h3>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="date-range"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Date Range
                </Label>
                <div className="space-y-3">
                  <div>
                    <Label
                      htmlFor="start-date"
                      className="text-xs text-gray-600 mb-1 block"
                    >
                      Start Date
                    </Label>
                    <input
                      type="date"
                      id="start-date"
                      value={
                        startDate ? startDate.toISOString().split("T")[0] : ""
                      }
                      onChange={(e) =>
                        setStartDate(
                          e.target.value ? new Date(e.target.value) : undefined,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="end-date"
                      className="text-xs text-gray-600 mb-1 block"
                    >
                      End Date
                    </Label>
                    <input
                      type="date"
                      id="end-date"
                      value={endDate ? endDate.toISOString().split("T")[0] : ""}
                      onChange={(e) =>
                        setEndDate(
                          e.target.value ? new Date(e.target.value) : undefined,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(end.getDate() - 7);
                        setStartDate(start);
                        setEndDate(end);
                        handleApplyDateRange();
                      }}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                    >
                      7 Days
                    </button>
                    <button
                      onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(end.getDate() - 30);
                        setStartDate(start);
                        setEndDate(end);
                        handleApplyDateRange();
                      }}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                    >
                      30 Days
                    </button>
                    <button
                      onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(end.getDate() - 90);
                        setStartDate(start);
                        setEndDate(end);
                        handleApplyDateRange();
                      }}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                    >
                      90 Days
                    </button>
                    <button
                      onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(end.getDate() - 365);
                        setStartDate(start);
                        setEndDate(end);
                        handleApplyDateRange();
                      }}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                    >
                      1 Year
                    </button>
                  </div>
                  <button
                    onClick={handleApplyDateRange}
                    className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    <span>Apply</span>
                  </button>
                </div>
              </div>

              {/* Only show branch selector for SUPER_ADMIN users */}
              {isSuperAdmin && (
                <div>
                  <Label
                    htmlFor="branch-select"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Branch
                  </Label>
                  <Select
                    value={selectedBranchId}
                    onValueChange={setSelectedBranchId}
                  >
                    <SelectTrigger id="branch-select" className="bg-white">
                      <SelectValue placeholder="All Branches" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {filterOptions?.branches?.items?.map((branch: any) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label
                  htmlFor="fund-select"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Fund
                </Label>
                <Select
                  value={selectedFundId}
                  onValueChange={setSelectedFundId}
                >
                  <SelectTrigger id="fund-select" className="bg-white">
                    <SelectValue placeholder="All Funds" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Funds</SelectItem>
                    {filterOptions?.funds?.map((fund: any) => (
                      <SelectItem key={fund.id} value={fund.id}>
                        {fund.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Report Categories
            </h3>
            <nav className="space-y-2">
              {reportCategories.map((category) => {
                const isActive = activeSection === category.id;
                const Icon = isActive ? category.iconSolid : category.icon;

                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveSection(category.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      <div
                        className={`text-xs ${isActive ? "text-blue-600" : "text-gray-500"}`}
                      >
                        {category.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Bars3Icon className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {reportCategories.find((cat) => cat.id === activeSection)
                      ?.name || "Reports"}
                  </h1>
                  <p className="text-gray-600">
                    {reportCategories.find((cat) => cat.id === activeSection)
                      ?.description || "Analytics and insights"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2">
                  <DocumentChartBarIcon className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">{renderContent()}</div>
      </div>
    </div>
  );
}
