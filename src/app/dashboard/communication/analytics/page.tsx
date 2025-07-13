"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon, 
  ChartBarIcon,
  ArrowPathIcon,
  FunnelIcon,
  ChevronDownIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { useOrganizationBranchFilter } from "@/graphql/hooks/useOrganizationBranchFilter";
import { GET_MESSAGE_ANALYTICS } from "@/graphql/queries/messageQueries";
import { format, subDays } from "date-fns";
import EmptyState from "../components/EmptyState";

export default function MessagingAnalyticsPage() {
  const { organisationId, branchId } = useOrganizationBranchFilter();
  const [dateRange, setDateRange] = useState<"7days" | "30days" | "90days">("30days");
  
  // Calculate date range
  const getDateRange = () => {
    const endDate = new Date();
    let startDate;
    
    switch (dateRange) {
      case "7days":
        startDate = subDays(endDate, 7);
        break;
      case "90days":
        startDate = subDays(endDate, 90);
        break;
      case "30days":
      default:
        startDate = subDays(endDate, 30);
        break;
    }
    
    return {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd")
    };
  };
  
  // Fetch analytics data
  const { data, loading, error, refetch } = useQuery(GET_MESSAGE_ANALYTICS, {
    variables: {
      filter: {
        organisationId,
        branchId,
        ...getDateRange()
      }
    },
    skip: !organisationId
  });
  
  // Update query when date range changes
  useEffect(() => {
    if (organisationId) {
      refetch({
        filter: {
          organisationId,
          branchId,
          ...getDateRange()
        }
      });
    }
  }, [dateRange, organisationId, branchId, refetch]);
  
  const metrics = data?.messagePerformanceMetrics || {
    overallDeliveryRate: 0,
    overallOpenRate: 0,
    overallResponseRate: 0,
    templates: []
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Messaging Analytics
            </h1>
            <p className="text-gray-500 mt-1">
              Track performance and engagement of your communications
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="flex items-center"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-1" />
              Filter
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Date Range Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Time Period:</span>
          <Tabs 
            defaultValue="30days" 
            value={dateRange}
            onValueChange={(value) => setDateRange(value as "7days" | "30days" | "90days")}
            className="w-auto"
          >
            <TabsList className="grid grid-cols-3 w-auto">
              <TabsTrigger value="7days">Last 7 Days</TabsTrigger>
              <TabsTrigger value="30days">Last 30 Days</TabsTrigger>
              <TabsTrigger value="90days">Last 90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Analytics Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-1/3 mb-4" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>
            Error loading analytics: {error.message}
          </AlertDescription>
        </Alert>
      ) : metrics.templates.length === 0 ? (
        <EmptyState
          icon={<ChartBarIcon className="h-12 w-12 text-gray-400" />}
          title="No analytics data available"
          description="Start sending messages to see performance metrics"
        />
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Delivery Rate */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Delivery Rate</h3>
                <EnvelopeIcon className="h-6 w-6 text-indigo-500" />
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">Overall</span>
                  <span className="text-sm font-medium">{formatPercentage(metrics.overallDeliveryRate)}</span>
                </div>
                <Progress value={metrics.overallDeliveryRate * 100} className="h-2" />
              </div>
              <p className="text-sm text-gray-500">
                Percentage of messages successfully delivered
              </p>
            </Card>
            
            {/* Open Rate */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Open Rate</h3>
                <EnvelopeIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">Overall</span>
                  <span className="text-sm font-medium">{formatPercentage(metrics.overallOpenRate)}</span>
                </div>
                <Progress value={metrics.overallOpenRate * 100} className="h-2" />
              </div>
              <p className="text-sm text-gray-500">
                Percentage of delivered messages that were opened
              </p>
            </Card>
            
            {/* Response Rate */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Response Rate</h3>
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-500">Overall</span>
                  <span className="text-sm font-medium">{formatPercentage(metrics.overallResponseRate)}</span>
                </div>
                <Progress value={metrics.overallResponseRate * 100} className="h-2" />
              </div>
              <p className="text-sm text-gray-500">
                Percentage of delivered messages that received a response
              </p>
            </Card>
          </div>
          
          {/* Template Performance */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Template Performance</h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Template
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sent
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivered
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Opened
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clicked
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Responded
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metrics.templates.length > 0 ? (
                      metrics.templates.map((template, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{template.templateName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{template.sent}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900 mr-2">{template.delivered}</span>
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-0">
                                {formatPercentage(template.deliveryRate)}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900 mr-2">{template.opened}</span>
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-0">
                                {formatPercentage(template.openRate)}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900 mr-2">{template.clicked}</span>
                              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-0">
                                {formatPercentage(template.clickRate)}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900 mr-2">{template.responded}</span>
                              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-0">
                                {formatPercentage(template.responseRate)}
                              </Badge>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          No template data available for the selected time period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
