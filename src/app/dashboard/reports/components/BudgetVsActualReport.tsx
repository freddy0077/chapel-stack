import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BUDGET_VS_ACTUAL_REPORT } from '@/graphql/queries/reports';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface BudgetVsActualReportProps {
  branchId?: string;
  organisationId?: string;
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
}

interface BudgetCategoryItem {
  name: string;
  budgeted: number;
  actual: number;
  variance: number;
  percentVariance: number;
}

interface BudgetVsActualData {
  categories: BudgetCategoryItem[];
  totals: {
    budgeted: number;
    actual: number;
    variance: number;
    percentVariance: number;
  };
}

// Default empty data structure
const defaultTotals = {
  budgeted: 0,
  actual: 0,
  variance: 0,
  percentVariance: 0
};

export const BudgetVsActualReport: React.FC<BudgetVsActualReportProps> = ({
  branchId,
  organisationId,
  dateRange,
}) => {
  const { loading, error, data } = useQuery(GET_BUDGET_VS_ACTUAL_REPORT, {
    variables: {
      branchId: branchId === 'all' ? null : branchId,
      organisationId: organisationId === 'all' ? null : organisationId,
      dateRange: dateRange ? {
        startDate: dateRange.startDate?.toISOString(),
        endDate: dateRange.endDate?.toISOString(),
      } : null,
    },
    skip: !dateRange?.startDate || !dateRange?.endDate,
  });

  const [reportData, setReportData] = useState<BudgetVsActualData | null>(null);

  useEffect(() => {
    if (data?.generateReport?.data) {
      try {
        let parsedData;
        
        if (typeof data.generateReport.data === 'string') {
          try {
            parsedData = JSON.parse(data.generateReport.data);
          } catch (e) {
            console.error('Failed to parse JSON string:', e);
            parsedData = null;
          }
        } else {
          parsedData = data.generateReport.data;
        }
        
        if (parsedData) {
          setReportData({
            categories: Array.isArray(parsedData.categories) ? parsedData.categories : [],
            totals: parsedData.totals ? {
              budgeted: Number(parsedData.totals.budgeted) || 0,
              actual: Number(parsedData.totals.actual) || 0,
              variance: Number(parsedData.totals.variance) || 0,
              percentVariance: Number(parsedData.totals.percentVariance) || 0
            } : defaultTotals
          });
        } else {
          setReportData({
            categories: [],
            totals: defaultTotals
          });
        }
      } catch (error) {
        console.error('Failed to process report data:', error);
        setReportData({
          categories: [],
          totals: defaultTotals
        });
      }
    } else {
      setReportData(null);
    }
  }, [data]);

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '0%';
    return `${value.toFixed(1)}%`;
  };

  const getVarianceColor = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '';
    return value < 0 ? 'text-red-500' : 'text-green-500';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Report</CardTitle>
          <CardDescription>Loading report data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load budget vs actual report: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!reportData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Report</CardTitle>
          <CardDescription>
            No data available for the selected period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Select a date range to view the budget vs actual report.</p>
        </CardContent>
      </Card>
    );
  }

  // Safely access totals with fallbacks
  const totals = reportData.totals || defaultTotals;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual Report</CardTitle>
        <CardDescription>
          Comparing budgeted amounts to actual spending
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totals.budgeted)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(totals.actual)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Variance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${getVarianceColor(totals.percentVariance)}`}>
                {formatCurrency(totals.variance)} ({formatPercentage(totals.percentVariance)})
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Budget Categories</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Budgeted</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead className="text-right">% Variance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(reportData.categories || []).map((category, index) => (
                  <TableRow key={index}>
                    <TableCell>{category.name || 'Unknown'}</TableCell>
                    <TableCell className="text-right">{formatCurrency(category.budgeted)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(category.actual)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(category.variance)}</TableCell>
                    <TableCell className={`text-right ${getVarianceColor(category.percentVariance)}`}>
                      {formatPercentage(category.percentVariance)}
                    </TableCell>
                  </TableRow>
                ))}
                {(!reportData.categories || reportData.categories.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No budget categories found for the selected period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
