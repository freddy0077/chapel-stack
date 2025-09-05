import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CONTRIBUTIONS_REPORT } from "@/graphql/queries/reports";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

interface ContributionsReportProps {
  branchId?: string;
  organisationId?: string;
  fundId?: string;
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
}

interface FundBreakdownItem {
  name: string;
  amount: number;
  percentage: number;
}

interface PaymentMethodBreakdownItem {
  method: string;
  amount: number;
  percentage: number;
}

interface TrendDataItem {
  date: string;
  amount: number;
}

interface ContributionsData {
  totalAmount: number;
  contributionCount: number;
  fundBreakdown: FundBreakdownItem[];
  paymentMethodBreakdown: PaymentMethodBreakdownItem[];
  trendData: TrendDataItem[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

export const ContributionsReport: React.FC<ContributionsReportProps> = ({
  branchId,
  organisationId,
  fundId,
  dateRange,
}) => {
  const { loading, error, data } = useQuery(GET_CONTRIBUTIONS_REPORT, {
    variables: {
      branchId: branchId === "all" ? null : branchId,
      organisationId: organisationId === "all" ? null : organisationId,
      fundId: fundId === "all" ? null : fundId,
      dateRange: dateRange
        ? {
            startDate: dateRange.startDate?.toISOString(),
            endDate: dateRange.endDate?.toISOString(),
          }
        : null,
    },
    skip: !dateRange?.startDate || !dateRange?.endDate,
  });

  const [reportData, setReportData] = useState<ContributionsData | null>(null);

  useEffect(() => {
    if (data?.generateReport?.data) {
      try {
        const parsedData =
          typeof data.generateReport.data === "string"
            ? JSON.parse(data.generateReport.data)
            : data.generateReport.data;

        // If we have contributions data in the expected format
        if (parsedData && typeof parsedData === "object") {
          // Create a properly formatted report data object
          const formattedData: ContributionsData = {
            totalAmount: parsedData.totalAmount || parsedData.total || 0,
            contributionCount:
              parsedData.contributionCount || parsedData.count || 0,
            fundBreakdown: Array.isArray(parsedData.fundBreakdown)
              ? parsedData.fundBreakdown
              : [],
            paymentMethodBreakdown: Array.isArray(
              parsedData.paymentMethodBreakdown,
            )
              ? parsedData.paymentMethodBreakdown
              : [],
            trendData: Array.isArray(parsedData.trendData)
              ? parsedData.trendData
              : [],
          };
          setReportData(formattedData);
        } else {
          console.error("Invalid report data format:", parsedData);
        }
      } catch (e) {
        console.error("Error parsing report data:", e);
      }
    }
  }, [data]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contributions Report</CardTitle>
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
          <CardTitle>Contributions Report</CardTitle>
          <CardDescription>Error loading report</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message || "Failed to load contributions report"}
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
          <CardTitle>Contributions Report</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTitle>No Data</AlertTitle>
            <AlertDescription>
              No contributions data available for the selected filters. Try
              adjusting your date range or other filters.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contributions Report</CardTitle>
        <CardDescription>
          {dateRange?.startDate && dateRange?.endDate
            ? `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
            : "All time"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Contributions
            </h3>
            <p className="text-2xl font-bold">
              {formatCurrency(reportData.totalAmount)}
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Number of Contributions
            </h3>
            <p className="text-2xl font-bold">{reportData.contributionCount}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Average Contribution
            </h3>
            <p className="text-2xl font-bold">
              {reportData.contributionCount > 0
                ? formatCurrency(
                    reportData.totalAmount / reportData.contributionCount,
                  )
                : formatCurrency(0)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {reportData.fundBreakdown && reportData.fundBreakdown.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Fund Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.fundBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {reportData.fundBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {reportData.paymentMethodBreakdown &&
            reportData.paymentMethodBreakdown.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Payment Method Breakdown
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.paymentMethodBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                        nameKey="method"
                        label={({ method, percent }) =>
                          `${method}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {reportData.paymentMethodBreakdown.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ),
                        )}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
        </div>

        {reportData.trendData && reportData.trendData.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Contribution Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={reportData.trendData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Amount"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {reportData.fundBreakdown && reportData.fundBreakdown.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Fund Details</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.fundBreakdown.map((fund, index) => (
                    <TableRow key={index}>
                      <TableCell>{fund.name}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(fund.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {(fund.percentage * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
