'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EXECUTE_REPORT } from '@/graphql/mutations/reportMutations';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { ReportExporter } from '@/utils/reportExport';
import { toast } from 'react-hot-toast';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentTextIcon,
  BanknotesIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  FileSpreadsheet,
  FileText,
  PieChart,
} from 'lucide-react';

// Shared components
import ReportFilterPanel from './shared/ReportFilterPanel';
import ReportSummaryCard from './shared/ReportSummaryCard';
import StatCard from './shared/StatCard';
import ReportTable from './shared/ReportTable';
import EmptyState from './shared/EmptyState';
import ReportLoadingSkeleton from './shared/LoadingSkeleton';

interface FinanceFilters {
  reportType: string;
  startDate: string;
  endDate: string;
  transactionType: string;
  accountType: string;
  includeSubAccounts: boolean;
  comparisonPeriod: string;
}

interface ReportResults {
  summary: {
    totalTransactions: number;
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
  };
  data: any[];
}

export default function FinanceReportBuilder() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [showResults, setShowResults] = useState(false);
  const [reportResults, setReportResults] = useState<ReportResults | null>(null);

  const [filters, setFilters] = useState<FinanceFilters>({
    reportType: 'balance-sheet',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    transactionType: 'ALL',
    accountType: 'ALL',
    includeSubAccounts: true,
    comparisonPeriod: 'NONE',
  });

  const reportTypes = [
    {
      value: 'balance-sheet',
      label: 'Balance Sheet',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Assets, Liabilities, and Equity at a point in time',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      value: 'income-statement',
      label: 'Income Statement',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Revenue and Expenses over a period',
      color: 'from-green-500 to-emerald-600',
    },
    {
      value: 'cash-flow',
      label: 'Cash Flow Statement',
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Cash Inflows and Outflows',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      value: 'trial-balance',
      label: 'Trial Balance',
      icon: <FileSpreadsheet className="h-4 w-4" />,
      description: 'All account balances with debits and credits',
      color: 'from-purple-500 to-pink-600',
    },
    {
      value: 'general-ledger',
      label: 'General Ledger',
      icon: <FileText className="h-4 w-4" />,
      description: 'Detailed transaction history by account',
      color: 'from-orange-500 to-amber-600',
    },
    {
      value: 'offering-summary',
      label: 'Offering Summary',
      icon: <PieChart className="h-4 w-4" />,
      description: 'Summary of offering collections and distributions',
      color: 'from-teal-500 to-green-600',
    },
  ];

  const selectedReport = reportTypes.find(r => r.value === filters.reportType);

  const [executeReport, { loading }] = useMutation(EXECUTE_REPORT, {
    onCompleted: (data) => {
      setReportResults({
        summary: data.executeReport.summary.metrics,
        data: data.executeReport.data,
      });
      setShowResults(true);
      toast.success('Report generated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate report');
    },
  });

  const handleFilterChange = (field: keyof FinanceFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = () => {
    executeReport({
      variables: {
        input: {
          category: 'FINANCE',
          filtersJson: JSON.stringify(filters),
          organisationId,
          branchId,
        },
      },
    });
  };

  const handleReset = () => {
    setFilters({
      reportType: 'balance-sheet',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      transactionType: 'ALL',
      accountType: 'ALL',
      includeSubAccounts: true,
      comparisonPeriod: 'NONE',
    });
    setShowResults(false);
    setReportResults(null);
  };

  const handleExport = (format: 'PDF' | 'EXCEL' | 'CSV') => {
    if (!reportResults) {
      toast.error('No report data to export');
      return;
    }

    const exportData = {
      title: 'Finance Report',
      summary: reportResults.summary,
      data: reportResults.data,
      filters,
      organisationName: 'Your Organization',
      branchName: 'Your Branch',
    };

    try {
      switch (format) {
        case 'PDF':
          ReportExporter.exportToPDF(exportData);
          toast.success('Report exported as PDF successfully!');
          break;
        case 'EXCEL':
          ReportExporter.exportToExcel(exportData);
          toast.success('Report exported as Excel successfully!');
          break;
        case 'CSV':
          ReportExporter.exportToCSV(exportData);
          toast.success('Report exported as CSV successfully!');
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export report as ${format}`);
    }
  };

  if (loading) {
    return <ReportLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Report Type Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {reportTypes.map((report) => (
          <motion.div
            key={report.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleFilterChange('reportType', report.value)}
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
              filters.reportType === report.value
                ? `bg-gradient-to-r ${report.color} text-white border-transparent shadow-lg`
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                filters.reportType === report.value
                  ? 'bg-white/20'
                  : 'bg-gray-100'
              }`}>
                {report.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${
                  filters.reportType === report.value ? 'text-white' : 'text-gray-900'
                }`}>
                  {report.label}
                </h3>
                <p className={`text-xs ${
                  filters.reportType === report.value ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {report.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters Panel */}
      <ReportFilterPanel
        title={`${selectedReport?.label} Configuration`}
        colorScheme="from-green-50 to-emerald-50"
        onReset={handleReset}
      >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Date Range */}
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label className="text-sm font-semibold text-gray-700">
                📅 Date Range
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-xs text-gray-600">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-xs text-gray-600">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                📊 Account Type
              </Label>
              <Select
                value={filters.accountType}
                onValueChange={(value) => handleFilterChange('accountType', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 hover:border-green-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">All Accounts</SelectItem>
                  <SelectItem value="ASSET" className="rounded-lg">Assets</SelectItem>
                  <SelectItem value="LIABILITY" className="rounded-lg">Liabilities</SelectItem>
                  <SelectItem value="EQUITY" className="rounded-lg">Equity</SelectItem>
                  <SelectItem value="REVENUE" className="rounded-lg">Revenue</SelectItem>
                  <SelectItem value="EXPENSE" className="rounded-lg">Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Comparison Period */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                📈 Comparison Period
              </Label>
              <Select
                value={filters.comparisonPeriod}
                onValueChange={(value) => handleFilterChange('comparisonPeriod', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="NONE" className="rounded-lg">No Comparison</SelectItem>
                  <SelectItem value="PREVIOUS_PERIOD" className="rounded-lg">Previous Period</SelectItem>
                  <SelectItem value="PREVIOUS_YEAR" className="rounded-lg">Previous Year</SelectItem>
                  <SelectItem value="BUDGET" className="rounded-lg">Budget vs Actual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Include Sub-Accounts */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                🔍 Detail Level
              </Label>
              <Select
                value={filters.includeSubAccounts ? 'DETAILED' : 'SUMMARY'}
                onValueChange={(value) => handleFilterChange('includeSubAccounts', value === 'DETAILED')}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 hover:border-purple-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="SUMMARY" className="rounded-lg">Summary Only</SelectItem>
                  <SelectItem value="DETAILED" className="rounded-lg">Include Sub-Accounts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button
            onClick={handleGenerateReport}
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-emerald-600"
          >
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </ReportFilterPanel>

      {/* Results Section */}
      {showResults && reportResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Statistics */}
          <ReportSummaryCard
            title="Financial Summary"
            colorScheme="from-green-50 to-emerald-50"
            onExport={handleExport}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Total Transactions"
                value={reportResults.summary.totalTransactions}
                colorScheme="blue"
              />
              <StatCard
                label="Total Income"
                value={`GH₵ ${reportResults.summary.totalIncome.toLocaleString()}`}
                colorScheme="green"
                icon={<ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />}
              />
              <StatCard
                label="Total Expenses"
                value={`GH₵ ${reportResults.summary.totalExpenses.toLocaleString()}`}
                colorScheme="red"
                icon={<ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />}
              />
              <StatCard
                label="Net Balance"
                value={`GH₵ ${reportResults.summary.netBalance.toLocaleString()}`}
                colorScheme={reportResults.summary.netBalance >= 0 ? 'emerald' : 'orange'}
              />
            </div>
          </ReportSummaryCard>

          {/* Detailed Data Table */}
          <ReportTable
            title="Transaction Details"
            columns={[
              {
                key: 'transactionDate',
                label: 'Date',
                render: (value) => new Date(value).toLocaleDateString(),
              },
              {
                key: 'transactionType',
                label: 'Type',
                render: (value) => (
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      value === 'INCOME'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {value}
                  </span>
                ),
              },
              { key: 'description', label: 'Description' },
              { key: 'fund.name', label: 'Fund' },
              { key: 'paymentMethod.name', label: 'Method' },
              {
                key: 'amount',
                label: 'Amount',
                render: (value) => `GH₵ ${Number(value).toLocaleString()}`,
              },
            ]}
            data={reportResults.data}
            pageSize={50}
            emptyMessage="No transactions found"
          />
        </motion.div>
      )}

      {/* Empty State */}
      {!showResults && !loading && (
        <EmptyState
          title="Ready to Generate Report"
          message="Apply your filters above and click Generate Report to see financial statistics and transaction details"
          actionLabel="Generate Report"
          onAction={handleGenerateReport}
        />
      )}
    </div>
  );
}
