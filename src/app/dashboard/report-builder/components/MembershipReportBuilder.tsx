'use client';

import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
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
import { GET_ZONES } from '@/graphql/queries/zoneQueries';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { ReportExporter } from '@/utils/reportExport';
import { toast } from 'react-hot-toast';
import { ChartBarIcon, UsersIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Shared components
import ReportFilterPanel from './shared/ReportFilterPanel';
import ReportSummaryCard from './shared/ReportSummaryCard';
import StatCard from './shared/StatCard';
import ReportTable from './shared/ReportTable';
import EmptyState from './shared/EmptyState';
import ReportLoadingSkeleton from './shared/LoadingSkeleton';

interface MembershipFilters {
  membershipType: string;
  membershipStatus: string;
  gender: string;
  zoneId: string;
  groupId: string;
  startBirthDate: string;
  endBirthDate: string;
  ageMin: string;
  ageMax: string;
  educationalLevel: string;
  occupation: string;
  maritalStatus: string;
  startJoinDate: string;
  endJoinDate: string;
}

interface ReportResults {
  summary: {
    totalMembers: number;
    activeMembers: number;
    maleCount: number;
    femaleCount: number;
    byZone: Record<string, number>;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  };
  data: any[];
}

export default function MembershipReportBuilder() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [showResults, setShowResults] = useState(false);
  const [reportResults, setReportResults] = useState<ReportResults | null>(null);

  console.log('MembershipReportBuilder - organisationId:', organisationId, 'branchId:', branchId);

  const [filters, setFilters] = useState<MembershipFilters>({
    membershipType: 'ALL',
    membershipStatus: 'ALL',
    gender: 'ALL',
    zoneId: 'ALL',
    groupId: 'ALL',
    startBirthDate: '',
    endBirthDate: '',
    ageMin: '',
    ageMax: '',
    educationalLevel: 'ALL',
    occupation: '',
    maritalStatus: 'ALL',
    startJoinDate: '',
    endJoinDate: '',
  });

  // Fetch zones for filter
  const { data: zonesData } = useQuery(GET_ZONES, {
    variables: { organisationId, branchId },
    skip: !organisationId,
  });

  const zones = zonesData?.zones || [];

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

  const handleFilterChange = (field: keyof MembershipFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = () => {
    executeReport({
      variables: {
        input: {
          category: 'MEMBERSHIP',
          filters,
          organisationId,
          branchId,
        },
      },
    });
  };

  const handleReset = () => {
    setFilters({
      membershipType: 'ALL',
      membershipStatus: 'ALL',
      gender: 'ALL',
      zoneId: 'ALL',
      groupId: 'ALL',
      startBirthDate: '',
      endBirthDate: '',
      ageMin: '',
      ageMax: '',
      educationalLevel: 'ALL',
      occupation: '',
      maritalStatus: 'ALL',
      startJoinDate: '',
      endJoinDate: '',
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
      title: 'Membership Report',
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
        colorScheme="from-purple-50 to-indigo-50"
        onReset={handleReset}
      >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Membership Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                🎫 Membership Type
              </Label>
              <Select
                value={filters.membershipType}
                onValueChange={(value) => handleFilterChange('membershipType', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 hover:border-purple-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">All Types</SelectItem>
                  <SelectItem value="REGULAR" className="rounded-lg">Regular</SelectItem>
                  <SelectItem value="ASSOCIATE" className="rounded-lg">Associate</SelectItem>
                  <SelectItem value="HONORARY" className="rounded-lg">Honorary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Membership Status */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                ✅ Membership Status
              </Label>
              <Select
                value={filters.membershipStatus}
                onValueChange={(value) =>
                  handleFilterChange('membershipStatus', value)
                }
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 hover:border-green-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE_MEMBER" className="rounded-lg">Active Member</SelectItem>
                  <SelectItem value="MEMBER" className="rounded-lg">Member</SelectItem>
                  <SelectItem value="VISITOR" className="rounded-lg">Visitor</SelectItem>
                  <SelectItem value="INACTIVE_MEMBER" className="rounded-lg">Inactive</SelectItem>
                  <SelectItem value="TRANSFERRED" className="rounded-lg">Transferred</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                👤 Gender
              </Label>
              <Select
                value={filters.gender}
                onValueChange={(value) => handleFilterChange('gender', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">All Genders</SelectItem>
                  <SelectItem value="MALE" className="rounded-lg">Male</SelectItem>
                  <SelectItem value="FEMALE" className="rounded-lg">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Zone */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                📍 Zone / Community
              </Label>
              <Select
                value={filters.zoneId}
                onValueChange={(value) => handleFilterChange('zoneId', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 hover:border-cyan-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">All Zones</SelectItem>
                  {zones.map((zone: any) => (
                    <SelectItem key={zone.id} value={zone.id} className="rounded-lg">
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                💑 Marital Status
              </Label>
              <Select
                value={filters.maritalStatus}
                onValueChange={(value) => handleFilterChange('maritalStatus', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 hover:border-pink-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">All Statuses</SelectItem>
                  <SelectItem value="SINGLE" className="rounded-lg">Single</SelectItem>
                  <SelectItem value="MARRIED" className="rounded-lg">Married</SelectItem>
                  <SelectItem value="DIVORCED" className="rounded-lg">Divorced</SelectItem>
                  <SelectItem value="WIDOWED" className="rounded-lg">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Educational Level */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                🎓 Educational Level
              </Label>
              <Select
                value={filters.educationalLevel}
                onValueChange={(value) =>
                  handleFilterChange('educationalLevel', value)
                }
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 hover:border-indigo-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">All Levels</SelectItem>
                  <SelectItem value="PRIMARY" className="rounded-lg">Primary</SelectItem>
                  <SelectItem value="SECONDARY" className="rounded-lg">Secondary</SelectItem>
                  <SelectItem value="TERTIARY" className="rounded-lg">Tertiary</SelectItem>
                  <SelectItem value="POSTGRADUATE" className="rounded-lg">Postgraduate</SelectItem>
                  <SelectItem value="NONE" className="rounded-lg">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Birth Date Range */}
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label className="text-sm font-semibold text-gray-700">
                🎂 Birth Date Range
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startBirthDate" className="text-xs text-gray-600">
                    From
                  </Label>
                  <Input
                    id="startBirthDate"
                    type="date"
                    value={filters.startBirthDate}
                    onChange={(e) =>
                      handleFilterChange('startBirthDate', e.target.value)
                    }
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 hover:border-purple-300"
                  />
                </div>
                <div>
                  <Label htmlFor="endBirthDate" className="text-xs text-gray-600">
                    To
                  </Label>
                  <Input
                    id="endBirthDate"
                    type="date"
                    value={filters.endBirthDate}
                    onChange={(e) => handleFilterChange('endBirthDate', e.target.value)}
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 hover:border-purple-300"
                  />
                </div>
              </div>
            </div>

            {/* Age Range */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-semibold text-gray-700">
                👶 Age Range
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ageMin" className="text-xs text-gray-600">
                    Min Age
                  </Label>
                  <Input
                    id="ageMin"
                    type="number"
                    value={filters.ageMin}
                    onChange={(e) => handleFilterChange('ageMin', e.target.value)}
                    placeholder="0"
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 hover:border-amber-300"
                  />
                </div>
                <div>
                  <Label htmlFor="ageMax" className="text-xs text-gray-600">
                    Max Age
                  </Label>
                  <Input
                    id="ageMax"
                    type="number"
                    value={filters.ageMax}
                    onChange={(e) => handleFilterChange('ageMax', e.target.value)}
                    placeholder="100"
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 hover:border-amber-300"
                  />
                </div>
              </div>
            </div>

            {/* Occupation */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                💼 Occupation
              </Label>
              <Input
                value={filters.occupation}
                onChange={(e) => handleFilterChange('occupation', e.target.value)}
                placeholder="e.g., Teacher, Engineer"
                className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 hover:border-teal-300"
              />
            </div>

            {/* Join Date Range */}
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label className="text-sm font-semibold text-gray-700">
                📅 Date Joined Range
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startJoinDate" className="text-xs text-gray-600">
                    From
                  </Label>
                  <Input
                    id="startJoinDate"
                    type="date"
                    value={filters.startJoinDate}
                    onChange={(e) =>
                      handleFilterChange('startJoinDate', e.target.value)
                    }
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 hover:border-indigo-300"
                  />
                </div>
                <div>
                  <Label htmlFor="endJoinDate" className="text-xs text-gray-600">
                    To
                  </Label>
                  <Input
                    id="endJoinDate"
                    type="date"
                    value={filters.endJoinDate}
                    onChange={(e) => handleFilterChange('endJoinDate', e.target.value)}
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 hover:border-indigo-300"
                  />
                </div>
              </div>
            </div>
          </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button
            onClick={handleGenerateReport}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600"
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
            title="Summary Statistics"
            colorScheme="from-green-50 to-emerald-50"
            onExport={handleExport}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Total Members"
                value={reportResults.summary.totalMembers}
                colorScheme="purple"
              />
              <StatCard
                label="Active Members"
                value={reportResults.summary.activeMembers}
                colorScheme="green"
              />
              <StatCard
                label="Male"
                value={reportResults.summary.maleCount}
                colorScheme="blue"
              />
              <StatCard
                label="Female"
                value={reportResults.summary.femaleCount}
                colorScheme="pink"
              />
            </div>

              {/* By Zone Breakdown */}
              {Object.keys(reportResults.summary.byZone).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <UserGroupIcon className="h-5 w-5" />
                    Members by Zone
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(reportResults.summary.byZone).map(
                      ([zone, count]) => (
                        <div key={zone} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">{zone}</p>
                          <p className="text-xl font-bold">{count}</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* By Type Breakdown */}
              {Object.keys(reportResults.summary.byType).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <UsersIcon className="h-5 w-5" />
                    Members by Type
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(reportResults.summary.byType).map(
                      ([type, count]) => (
                        <div key={type} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">{type}</p>
                          <p className="text-xl font-bold">{count}</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* By Status Breakdown */}
              {Object.keys(reportResults.summary.byStatus || {}).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <UsersIcon className="h-5 w-5" />
                    Members by Status
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(reportResults.summary.byStatus).map(
                      ([status, count]) => (
                        <div key={status} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">{status}</p>
                          <p className="text-xl font-bold">{count}</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </ReportSummaryCard>

          {/* Detailed Data Table */}
          <ReportTable
            title="Detailed Member Records"
            columns={[
              {
                key: 'firstName',
                label: 'Name',
                render: (_, row) =>
                  `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'N/A',
              },
              { key: 'gender', label: 'Gender' },
              { key: 'membershipType', label: 'Type' },
              { key: 'membershipStatus', label: 'Status' },
              { key: 'zone.name', label: 'Zone' },
              { key: 'email', label: 'Email' },
            ]}
            data={reportResults.data}
            pageSize={50}
            emptyMessage="No member records found"
          />
        </motion.div>
      )}

      {/* Empty State */}
      {!showResults && !loading && (
        <EmptyState
          title="Ready to Generate Report"
          message="Apply your filters above and click Generate Report to see membership statistics and detailed records"
          actionLabel="Generate Report"
          onAction={handleGenerateReport}
        />
      )}
    </div>
  );
}
