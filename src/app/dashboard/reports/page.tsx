'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from './components/DateRangePicker';
import { BudgetVsActualReport } from './components/BudgetVsActualReport';
import { PledgeFulfillmentReport } from './components/PledgeFulfillmentReport';
import { ContributionsReport } from './components/ContributionsReport';
import { MemberDemographicsReport } from './components/MemberDemographicsReport';
import { Label } from '@/components/ui/label';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { useAuth } from '@/graphql/hooks/useAuth';
import { useOrganizationBranchFilter } from '@/hooks';

// Query to get branches and organizations for filters
const GET_FILTER_OPTIONS = gql`
  query GetFilterOptions {
    branches(filterInput: {}, paginationInput: { skip: 0, take: 100 }) {
      items {
        id
        name
      }
      hasNextPage
      totalCount
    }
    organisations {
      id
      name
    }
    funds(organisationId: null) {
      id
      name
    }
  }
`;

export default function ReportsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('financial');
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [selectedFundId, setSelectedFundId] = useState<string>('all');
  const [appliedDateRange, setAppliedDateRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });

  // Get organization/branch filter based on user role
  const orgBranchFilter = useOrganizationBranchFilter();
  const isSuperAdmin = user?.primaryRole === 'SUPER_ADMIN';

  // Update the query to include organizationId from the filter
  const { data: filterOptions, loading: loadingFilters } = useQuery(GET_FILTER_OPTIONS);

  // Set appropriate default branch/organization based on user role
  useEffect(() => {
    if (orgBranchFilter.branchId) {
      setSelectedBranchId(orgBranchFilter.branchId);
    }
  }, [orgBranchFilter.branchId]);

  const handleApplyDateRange = () => {
    setAppliedDateRange({
      startDate,
      endDate,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            View and analyze church data through comprehensive reports
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>
            Select filters to customize your report view
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="date-range" className="mb-2 block">
                Date Range
              </Label>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onApply={handleApplyDateRange}
              />
            </div>

            {/* Only show branch selector for SUPER_ADMIN users */}
            {isSuperAdmin && (
              <div>
                <Label htmlFor="branch-select" className="mb-2 block">
                  Branch
                </Label>
                <Select
                  value={selectedBranchId}
                  onValueChange={setSelectedBranchId}
                >
                  <SelectTrigger id="branch-select">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {filterOptions?.branches?.items?.map((branch: any) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="fund-select" className="mb-2 block">
                Fund
              </Label>
              <Select
                value={selectedFundId}
                onValueChange={setSelectedFundId}
              >
                <SelectTrigger id="fund-select">
                  <SelectValue placeholder="All Funds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Funds</SelectItem>
                  {filterOptions?.funds?.map((fund: any) => (
                    <SelectItem key={fund.id} value={fund.id}>
                      {fund.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

        </CardContent>
      </Card>

      <Tabs defaultValue="financial" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="space-y-6">
          <BudgetVsActualReport
            branchId={selectedBranchId === 'all' ? undefined : selectedBranchId}
            organisationId={orgBranchFilter.organisationId}
            dateRange={appliedDateRange}
          />
          
          <PledgeFulfillmentReport
            branchId={selectedBranchId === 'all' ? undefined : selectedBranchId}
            organisationId={orgBranchFilter.organisationId}
            fundId={selectedFundId === 'all' ? undefined : selectedFundId}
            dateRange={appliedDateRange}
          />
          
          <ContributionsReport
            branchId={selectedBranchId === 'all' ? undefined : selectedBranchId}
            organisationId={orgBranchFilter.organisationId}
            fundId={selectedFundId === 'all' ? undefined : selectedFundId}
            dateRange={appliedDateRange}
          />
        </TabsContent>
        
        <TabsContent value="membership">
          <MemberDemographicsReport
            branchId={selectedBranchId === 'all' ? undefined : selectedBranchId}
            organisationId={orgBranchFilter.organisationId}
            dateRange={appliedDateRange}
          />
        </TabsContent>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
              <CardDescription>
                Coming soon - Attendance tracking and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This section is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>
                Coming soon - Build your own custom reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This section is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
