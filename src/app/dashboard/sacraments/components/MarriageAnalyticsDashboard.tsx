"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { useMarriageAnalytics } from "@/graphql/hooks/useMarriageAnalytics";
import {
  Heart,
  Users,
  TrendingUp,
  Calendar,
  Award,
  Download,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, parseISO } from "date-fns";

interface MarriageAnalyticsDashboardProps {
  onClose?: () => void;
}

const MarriageAnalyticsDashboard: React.FC<MarriageAnalyticsDashboardProps> = ({
  onClose,
}) => {
  const { organisationId, branchId } = useOrganisationBranch();
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const { data, loading, error, refetch } = useMarriageAnalytics({
    branchId: branchId || "",
    organisationId: organisationId || "",
    startDate: dateRange.startDate || undefined,
    endDate: dateRange.endDate || undefined,
  });

  const analytics = data?.marriageAnalytics;

  const handleDateRangeChange = (
    field: "startDate" | "endDate",
    value: string,
  ) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export marriage analytics");
  };

  // Chart colors
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"];

  // Prepare pie chart data
  const marriageTypeData = analytics
    ? [
        {
          name: "Member Marriages",
          value: analytics.memberMarriages,
          color: "#8884d8",
        },
        {
          name: "Mixed Marriages",
          value: analytics.mixedMarriages,
          color: "#82ca9d",
        },
        {
          name: "External Marriages",
          value: analytics.externalMarriages,
          color: "#ffc658",
        },
      ].filter((item) => item.value > 0)
    : [];

  if (loading) {
    return (
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Marriage Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">
              Loading marriage analytics...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            Marriage Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">
              Error loading marriage analytics: {error.message}
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Marriage Analytics Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleRefresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              {onClose && (
                <Button onClick={onClose} variant="ghost" size="sm">
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Date Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  handleDateRangeChange("startDate", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  handleDateRangeChange("endDate", e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Marriages
                </p>
                <p className="text-2xl font-bold">
                  {analytics?.totalMarriages || 0}
                </p>
              </div>
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Year</p>
                <p className="text-2xl font-bold">
                  {analytics?.thisYearMarriages || 0}
                </p>
                {analytics?.growthPercentage !== undefined && (
                  <p
                    className={`text-sm flex items-center ${analytics.growthPercentage >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {analytics.growthPercentage.toFixed(1)}% vs last year
                  </p>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Age</p>
                <p className="text-2xl font-bold">
                  {analytics?.averageAge?.toFixed(1) || "N/A"}
                </p>
                <p className="text-sm text-gray-500">years old</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Anniversaries
                </p>
                <p className="text-2xl font-bold">
                  {analytics?.upcomingAnniversaries || 0}
                </p>
                <p className="text-sm text-gray-500">next 30 days</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Marriage Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.monthlyTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => {
                    try {
                      const [year, month] = value.split("-");
                      return `${month}/${year.slice(2)}`;
                    } catch {
                      return value;
                    }
                  }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => {
                    try {
                      const [year, month] = value.split("-");
                      const monthNames = [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ];
                      return `${monthNames[parseInt(month) - 1]} ${year}`;
                    } catch {
                      return value;
                    }
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Marriage Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Marriage Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={marriageTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {marriageTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Marriage Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Marriage Type Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {analytics?.memberMarriages || 0}
              </p>
              <p className="text-sm text-blue-800">Member Marriages</p>
              <p className="text-xs text-gray-600">
                Both partners are church members
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {analytics?.mixedMarriages || 0}
              </p>
              <p className="text-sm text-green-800">Mixed Marriages</p>
              <p className="text-xs text-gray-600">
                One partner is a church member
              </p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {analytics?.externalMarriages || 0}
              </p>
              <p className="text-sm text-yellow-800">External Marriages</p>
              <p className="text-xs text-gray-600">
                Neither partner is a church member
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Officiants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Top Officiants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics?.topOfficiants?.slice(0, 5).map((officiant, index) => (
              <div
                key={officiant.officiantId || officiant.officiantName}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">
                      {officiant.officiantName || "Unknown Officiant"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {officiant.memberOfficiant
                        ? "Church Member"
                        : "External Officiant"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{officiant.marriageCount}</p>
                  <p className="text-sm text-gray-600">marriages</p>
                </div>
              </div>
            )) || (
              <p className="text-center text-gray-500 py-4">
                No officiant data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarriageAnalyticsDashboard;
