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
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Shared components
import ReportFilterPanel from './shared/ReportFilterPanel';
import ReportSummaryCard from './shared/ReportSummaryCard';
import StatCard from './shared/StatCard';
import ReportTable from './shared/ReportTable';
import EmptyState from './shared/EmptyState';
import ReportLoadingSkeleton from './shared/LoadingSkeleton';

interface FinanceFilters {
  startDate: string;
  endDate: string;
  transactionType: string;
  fundType: string;
  paymentMethod: string;
  minAmount: string;
  maxAmount: string;
  category: string;
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
    startDate: '',
    endDate: '',
    transactionType: 'ALL',
    fundType: 'ALL',
    paymentMethod: 'ALL',
    minAmount: '',
    maxAmount: '',
    category: 'ALL',
  });

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
          filters,
          organisationId,
          branchId,
        },
      },
    });
  };

  const handleReset = () => {
    setFilters({
      startDate: '',
      endDate: '',
      transactionType: 'ALL',
      fundType: 'ALL',
      paymentMethod: 'ALL',
      minAmount: '',
      maxAmount: '',
      category: 'ALL',
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
      {/* Filters Panel */}
      <ReportFilterPanel
        title="Report Filters"
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

            {/* Transaction Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                💰 Transaction Type
              </Label>
              <Select
                value={filters.transactionType}
                onValueChange={(value) =>
                  handleFilterChange('transactionType', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fund Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                🏦 Fund Type
              </Label>
              <Select
                value={filters.fundType}
                onValueChange={(value) => handleFilterChange('fundType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Funds</SelectItem>
                  <SelectItem value="GENERAL">General Fund</SelectItem>
                  <SelectItem value="BUILDING">Building Fund</SelectItem>
                  <SelectItem value="MISSIONS">Missions Fund</SelectItem>
                  <SelectItem value="BENEVOLENCE">Benevolence Fund</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                💳 Payment Method
              </Label>
              <Select
                value={filters.paymentMethod}
                onValueChange={(value) =>
                  handleFilterChange('paymentMethod', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Methods</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CHEQUE">Cheque</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Range */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-semibold text-gray-700">
                💵 Amount Range
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minAmount" className="text-xs text-gray-600">
                    Min Amount
                  </Label>
                  <Input
                    id="minAmount"
                    type="number"
                    value={filters.minAmount}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxAmount" className="text-xs text-gray-600">
                    Max Amount
                  </Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    value={filters.maxAmount}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                    placeholder="10000.00"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                📂 Category
              </Label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="TITHES">Tithes</SelectItem>
                  <SelectItem value="OFFERINGS">Offerings</SelectItem>
                  <SelectItem value="DONATIONS">Donations</SelectItem>
                  <SelectItem value="SALARIES">Salaries</SelectItem>
                  <SelectItem value="UTILITIES">Utilities</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
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
                value={`$${reportResults.summary.totalIncome.toLocaleString()}`}
                colorScheme="green"
                icon={<ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />}
              />
              <StatCard
                label="Total Expenses"
                value={`$${reportResults.summary.totalExpenses.toLocaleString()}`}
                colorScheme="red"
                icon={<ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />}
              />
              <StatCard
                label="Net Balance"
                value={`$${reportResults.summary.netBalance.toLocaleString()}`}
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
                render: (value) => `$${Number(value).toLocaleString()}`,
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
