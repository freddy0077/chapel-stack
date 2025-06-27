import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MEMBER_DEMOGRAPHICS_REPORT } from '@/graphql/queries/reports';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { LineChart, Line } from 'recharts';

interface MemberDemographicsReportProps {
  branchId?: string;
  organisationId?: string;
  dateRange?: {
    startDate?: Date;
    endDate?: Date;
  };
}

interface GenderDistribution {
  gender: string;
  count: number;
  percentage: number;
}

interface AgeDistribution {
  ageGroup: string;
  count: number;
  percentage: number;
}

interface MembershipTrend {
  date: string;
  newMembers: number;
  totalMembers: number;
}

interface MembershipStatus {
  status: string;
  count: number;
  percentage: number;
}

interface MemberDemographicsData {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  genderDistribution: GenderDistribution[];
  ageDistribution: AgeDistribution[];
  membershipTrend: MembershipTrend[];
  membershipStatus: MembershipStatus[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const MemberDemographicsReport: React.FC<MemberDemographicsReportProps> = ({
  branchId,
  organisationId,
  dateRange,
}) => {
  const { loading, error, data } = useQuery(GET_MEMBER_DEMOGRAPHICS_REPORT, {
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

  const reportData = data?.memberDemographicsReport;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Member Demographics Report</CardTitle>
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
          <CardTitle>Member Demographics Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load member demographics report: {error.message}
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
          <CardTitle>Member Demographics Report</CardTitle>
          <CardDescription>
            Select a date range to view the member demographics report.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Demographics Report</CardTitle>
        <CardDescription>
          Analysis of member demographics and trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{reportData.totalMembers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{reportData.activeMembers}</p>
              <p className="text-sm text-muted-foreground">
                {((reportData.activeMembers / reportData.totalMembers) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Inactive Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{reportData.inactiveMembers}</p>
              <p className="text-sm text-muted-foreground">
                {((reportData.inactiveMembers / reportData.totalMembers) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Gender Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.genderDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ gender, percentage }) => `${gender}: ${(percentage * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportData.genderDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Age Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Age Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reportData.ageDistribution}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageGroup" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Members" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Membership Trend Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Membership Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={reportData.membershipTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="newMembers"
                    stroke="#82ca9d"
                    name="New Members"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalMembers"
                    stroke="#8884d8"
                    name="Total Members"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Membership Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Membership Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.membershipStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, percentage }) => `${status}: ${(percentage * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {reportData.membershipStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
