import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PLEDGE_FULFILLMENT_REPORT } from '@/graphql/queries/reports';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface PledgeFulfillmentReportProps {
  branchId?: string;
  organisationId?: string;
  fundId?: string;
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
}

interface PledgeItem {
  id: string;
  amount: number;
  amountFulfilled: number;
  fulfillmentPercentage: number;
  startDate: Date;
  endDate?: Date | null;
  frequency: string;
  status: string;
  memberName?: string;
  fundName?: string;
}

interface PledgeFulfillmentData {
  totalPledged: number;
  totalFulfilled: number;
  fulfillmentRate: number;
  pledgeCount: number;
  fullyFulfilledCount: number;
  partiallyFulfilledCount: number;
  unfulfilledCount: number;
  pledgeItems: PledgeItem[];
}

export const PledgeFulfillmentReport: React.FC<PledgeFulfillmentReportProps> = ({
  branchId,
  organisationId,
  fundId,
  dateRange,
}) => {
  const { loading, error, data } = useQuery(GET_PLEDGE_FULFILLMENT_REPORT, {
    variables: {
      branchId: branchId === 'all' ? null : branchId,
      organisationId: organisationId === 'all' ? null : organisationId,
      fundId: fundId === 'all' ? null : fundId,
      dateRange: dateRange ? {
        startDate: dateRange.startDate?.toISOString(),
        endDate: dateRange.endDate?.toISOString(),
      } : null,
    },
    skip: !dateRange?.startDate || !dateRange?.endDate,
  });

  const [reportData, setReportData] = useState<PledgeFulfillmentData | null>(null);

  useEffect(() => {
    if (data?.generateReport?.data) {
      try {
        const parsedData = typeof data.generateReport.data === 'string' 
          ? JSON.parse(data.generateReport.data) 
          : data.generateReport.data;
        setReportData(parsedData);
      } catch (e) {
        console.error('Error parsing report data:', e);
      }
    }
  }, [data]);

  const getFulfillmentStatusBadge = (percentage: number) => {
    if (percentage >= 100) return <Badge className="bg-green-600">Fulfilled</Badge>;
    if (percentage > 0) return <Badge className="bg-amber-500">Partial</Badge>;
    return <Badge className="bg-red-600">Unfulfilled</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pledge Fulfillment Report</CardTitle>
          <CardDescription>Loading report data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
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
          <CardTitle>Pledge Fulfillment Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load pledge fulfillment report: {error.message}
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
          <CardTitle>Pledge Fulfillment Report</CardTitle>
          <CardDescription>
            Select a date range to view the pledge fulfillment report.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pledge Fulfillment Report</CardTitle>
        <CardDescription>
          Tracking pledge fulfillment progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Pledged</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(reportData.totalPledged)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Fulfilled</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(reportData.totalFulfilled)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fulfillment Rate</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <p className="text-2xl font-bold">{reportData.fulfillmentRate?.toFixed(1)}%</p>
              <Progress value={reportData.fulfillmentRate} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pledge Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <span>Fulfilled:</span>
                  <span className="font-medium">{reportData.fullyFulfilledCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Partial:</span>
                  <span className="font-medium">{reportData.partiallyFulfilledCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unfulfilled:</span>
                  <span className="font-medium">{reportData.unfulfilledCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Fund</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Fulfilled</TableHead>
                <TableHead className="text-right">Progress</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.pledgeItems?.map((pledge) => (
                <TableRow key={pledge.id}>
                  <TableCell className="font-medium">{pledge.memberName || 'Anonymous'}</TableCell>
                  <TableCell>{pledge.fundName || 'General'}</TableCell>
                  <TableCell>{pledge.frequency}</TableCell>
                  <TableCell className="text-right">{formatCurrency(pledge.amount)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(pledge.amountFulfilled)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress 
                        value={pledge.fulfillmentPercentage} 
                        className="w-[60px]" 
                      />
                      <span>{pledge.fulfillmentPercentage.toFixed(1)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getFulfillmentStatusBadge(pledge.fulfillmentPercentage)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
