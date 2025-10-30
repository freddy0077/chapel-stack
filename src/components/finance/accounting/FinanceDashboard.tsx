"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  Wallet,
  Calendar,
  FileText,
  AlertCircle,
  Download,
  Filter,
  RefreshCw,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useFinanceDashboard } from "@/hooks/finance/useFinanceDashboard";

interface FinanceDashboardProps {
  organisationId: string;
  branchId: string;
  userId: string;
  onNavigateToTab?: (tab: string) => void;
  onOpenOfferingCounter?: () => void;
  onOpenJournalEntry?: () => void;
}

export default function FinanceDashboard({
  organisationId,
  branchId,
  userId,
  onNavigateToTab,
  onOpenOfferingCounter,
  onOpenJournalEntry,
}: FinanceDashboardProps) {
  const [timeRange, setTimeRange] = useState("month");

  // Calculate date range based on selection - memoized to prevent infinite loops
  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return { startDate, endDate: now };
  }, [timeRange]);

  // Use the custom hook
  const {
    stats,
    recentTransactions,
    pendingJournalEntries,
    pendingOfferings,
    pendingCount,
    loading,
    error,
    refetch,
  } = useFinanceDashboard({
    organisationId,
    branchId,
    startDate,
    endDate,
  });

  const handleRefresh = async () => {
    await refetch();
  };

  // Combine pending items
  const pendingApprovals = [
    ...pendingJournalEntries.map((entry: any) => ({
      id: entry.id,
      type: "Journal Entry",
      number: entry.journalEntryNumber,
      amount: entry.totalDebit,
    })),
    ...pendingOfferings.map((offering: any) => ({
      id: offering.id,
      type: "Offering Batch",
      number: offering.batchNumber,
      amount: offering.totalAmount,
    })),
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Financial Overview</h3>
          <p className="text-sm text-muted-foreground">Key performance indicators</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Income Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GHS {(stats?.income || 0).toLocaleString()}
            </div>
            {stats?.incomeChange !== undefined && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stats.incomeChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={stats.incomeChange >= 0 ? "text-green-600" : "text-red-600"}>
                  {stats.incomeChange >= 0 ? "+" : ""}{stats.incomeChange}%
                </span>
                <span>from last period</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GHS {(stats?.expenses || 0).toLocaleString()}
            </div>
            {stats?.expensesChange !== undefined && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stats.expensesChange <= 0 ? (
                  <TrendingDown className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingUp className="h-3 w-3 text-red-600" />
                )}
                <span className={stats.expensesChange <= 0 ? "text-green-600" : "text-red-600"}>
                  {stats.expensesChange >= 0 ? "+" : ""}{stats.expensesChange}%
                </span>
                <span>from last period</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Balance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GHS {(stats?.balance || 0).toLocaleString()}
            </div>
            {stats?.balanceChange !== undefined && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stats.balanceChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={stats.balanceChange >= 0 ? "text-green-600" : "text-red-600"}>
                  {stats.balanceChange >= 0 ? "+" : ""}{stats.balanceChange}%
                </span>
                <span>from last period</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Offerings Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offerings</CardTitle>
            <Gift className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GHS {(stats?.offerings || 0).toLocaleString()}
            </div>
            {stats?.offeringsChange !== undefined && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stats.offeringsChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={stats.offeringsChange >= 0 ? "text-green-600" : "text-red-600"}>
                  {stats.offeringsChange >= 0 ? "+" : ""}{stats.offeringsChange}%
                </span>
                <span>from last period</span>
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions and Pending Approvals */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <>
                <div className="space-y-4">
                  {recentTransactions.map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.entryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        GHS {(transaction.totalDebit || transaction.totalCredit || 0).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => onNavigateToTab?.("journal")}
                >
                  View All Transactions
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-muted-foreground">No recent transactions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pending Approvals</span>
              <Badge variant="secondary">{pendingCount}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingApprovals.length > 0 ? (
              <>
                <div className="space-y-4">
                  {pendingApprovals.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {item.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.number}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        GHS {(item.amount || 0).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => onNavigateToTab?.("journal")}
                >
                  Review All ({pendingCount})
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-green-400 mb-2" />
                <p className="text-sm text-muted-foreground">No pending approvals</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button 
              className="w-full"
              onClick={() => onOpenOfferingCounter?.()}
            >
              <Gift className="mr-2 h-4 w-4" />
              Count Offering
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onOpenJournalEntry?.()}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              New Journal Entry
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onNavigateToTab?.("reports")}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
