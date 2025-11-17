"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GET_ASSET_STATISTICS } from "@/graphql/queries/assetQueries";
import { FINANCIAL_STATEMENTS_QUERY, FinancialStatements } from "@/graphql/queries/financialStatements";

interface FinancialReportsProps {
  organisationId: string;
  branchId: string;
}

export default function FinancialReports({
  organisationId,
  branchId,
}: FinancialReportsProps) {
  const [reportType, setReportType] = useState("balance-sheet");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch financial statements
  const { data: financialData, loading: financialLoading, refetch: refetchFinancials } = useQuery(
    FINANCIAL_STATEMENTS_QUERY,
    {
      variables: {
        input: {
          organisationId,
          branchId,
          dateRange: {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          },
          statementType: reportType === "balance-sheet" 
            ? "BALANCE_SHEET" 
            : reportType === "income-statement"
            ? "INCOME_STATEMENT"
            : reportType === "cash-flow"
            ? "CASH_FLOW_STATEMENT"
            : "STATEMENT_OF_NET_ASSETS",
          includeComparative: true,
        },
      },
      skip: !organisationId || !branchId,
    }
  );

  const financialStatements: FinancialStatements | undefined = financialData?.financialStatements;

  // Fetch asset statistics for Balance Sheet
  const { data: assetStatsData, loading: assetStatsLoading } = useQuery(GET_ASSET_STATISTICS, {
    variables: { organisationId, branchId },
    skip: !organisationId,
  });

  const assetStats = assetStatsData?.assetStatistics;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const reportTypes = [
    {
      value: "balance-sheet",
      label: "Balance Sheet",
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Assets, Liabilities, and Equity",
    },
    {
      value: "income-statement",
      label: "Income Statement",
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Revenue and Expenses",
    },
    {
      value: "cash-flow",
      label: "Cash Flow Statement",
      icon: <DollarSign className="h-4 w-4" />,
      description: "Cash Inflows and Outflows",
    },
    {
      value: "trial-balance",
      label: "Trial Balance",
      icon: <FileSpreadsheet className="h-4 w-4" />,
      description: "Debit and Credit Balances",
    },
    {
      value: "general-ledger",
      label: "General Ledger",
      icon: <FileText className="h-4 w-4" />,
      description: "All Account Transactions",
    },
    {
      value: "offering-summary",
      label: "Offering Summary",
      icon: <PieChart className="h-4 w-4" />,
      description: "Offering Collections Report",
    },
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await refetchFinancials({
        input: {
          organisationId,
          branchId,
          dateRange: {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          },
          statementType: reportType === "balance-sheet" 
            ? "BALANCE_SHEET" 
            : reportType === "income-statement"
            ? "INCOME_STATEMENT"
            : reportType === "cash-flow"
            ? "CASH_FLOW_STATEMENT"
            : "STATEMENT_OF_NET_ASSETS",
          includeComparative: true,
        },
      });
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = (format: string) => {
    // TODO: Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Reports</h2>
          <p className="text-muted-foreground">Generate and export financial reports</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Select report type and date range</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Report Type */}
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          {type.icon}
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {reportTypes.find((t) => t.value === reportType)?.description}
                </p>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {/* Generate Button */}
              <Button
                className="w-full"
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>

              {/* Export Options */}
              <div className="pt-4 border-t space-y-2">
                <Label>Export Options</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("pdf")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("excel")}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("csv")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                This Month
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                This Quarter
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                This Year
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Last Year
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>
                {reportTypes.find((t) => t.value === reportType)?.label}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8 min-h-[600px] bg-white">
                {/* Report Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold">Your Church Name</h3>
                  <h4 className="text-xl font-semibold mt-2">
                    {reportTypes.find((t) => t.value === reportType)?.label}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(startDate).toLocaleDateString()} -{" "}
                    {new Date(endDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Report Content Placeholder */}
                <div className="space-y-6">
                  {reportType === "balance-sheet" && financialStatements?.balanceSheet && (
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold mb-2">ASSETS</h5>
                        <div className="space-y-1 ml-4">
                          {financialStatements.balanceSheet.assets.map((asset, idx) => (
                            <div key={idx} className="mb-3">
                              <div className="font-medium text-sm text-gray-600 mb-1">{asset.category}</div>
                              {asset.subItems?.map((subItem, subIdx) => (
                                <div key={subIdx} className="flex justify-between ml-2">
                                  <span>{subItem.description}</span>
                                  <span className="font-mono">{formatCurrency(subItem.currentPeriod || 0)}</span>
                                </div>
                              ))}
                              <div className="flex justify-between ml-2 font-medium border-t pt-1 mt-1">
                                <span>Total {asset.category}</span>
                                <span className="font-mono">{formatCurrency(asset.currentPeriod || 0)}</span>
                              </div>
                            </div>
                          ))}

                          {/* Total Assets */}
                          <div className="flex justify-between font-semibold border-t-2 pt-2 text-lg">
                            <span>TOTAL ASSETS</span>
                            <span className="font-mono">
                              {formatCurrency(financialStatements.balanceSheet.totalAssets || 0)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold mb-2">LIABILITIES</h5>
                        <div className="space-y-1 ml-4">
                          {financialStatements.balanceSheet.liabilities.map((liability, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{liability.description}</span>
                              <span className="font-mono">{formatCurrency(liability.currentPeriod || 0)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-semibold border-t pt-1">
                            <span>Total Liabilities</span>
                            <span className="font-mono">{formatCurrency(financialStatements.balanceSheet.totalLiabilities || 0)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold mb-2">NET ASSETS</h5>
                        <div className="space-y-1 ml-4">
                          {financialStatements.balanceSheet.netAssets.map((netAsset, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{netAsset.description}</span>
                              <span className="font-mono">{formatCurrency(netAsset.currentPeriod || 0)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-semibold border-t pt-1">
                            <span>Total Net Assets</span>
                            <span className="font-mono">{formatCurrency(financialStatements.balanceSheet.totalNetAssets || 0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {reportType === "income-statement" && financialStatements?.incomeStatement && (
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold mb-2">REVENUE</h5>
                        <div className="space-y-1 ml-4">
                          {financialStatements.incomeStatement.revenue.map((rev, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{rev.description}</span>
                              <span className="font-mono">{formatCurrency(rev.currentPeriod || 0)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-semibold border-t pt-1">
                            <span>Total Revenue</span>
                            <span className="font-mono">{formatCurrency(financialStatements.incomeStatement.totalRevenue || 0)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold mb-2">EXPENSES</h5>
                        <div className="space-y-1 ml-4">
                          {financialStatements.incomeStatement.expenses.map((exp, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{exp.description}</span>
                              <span className="font-mono">{formatCurrency(exp.currentPeriod || 0)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-semibold border-t pt-1">
                            <span>Total Expenses</span>
                            <span className="font-mono">
                              {formatCurrency(financialStatements.incomeStatement.totalExpenses || 0)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t-2 pt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>NET INCOME</span>
                          <span className={`font-mono ${(financialStatements.incomeStatement.netIncome || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(financialStatements.incomeStatement.netIncome || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {!["balance-sheet", "income-statement"].includes(reportType) && (
                    <div className="text-center py-12 text-muted-foreground">
                      {financialLoading ? (
                        <>
                          <div className="animate-spin mb-4">
                            <FileText className="h-12 w-12 mx-auto opacity-50" />
                          </div>
                          <p>Generating {reportTypes.find((t) => t.value === reportType)?.label}...</p>
                        </>
                      ) : (
                        <>
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Report preview will appear here</p>
                          <p className="text-sm mt-2">Click "Generate Report" to view</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
