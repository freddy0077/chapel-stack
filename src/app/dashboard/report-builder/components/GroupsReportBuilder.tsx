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
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Shared components
import ReportFilterPanel from './shared/ReportFilterPanel';
import ReportSummaryCard from './shared/ReportSummaryCard';
import StatCard from './shared/StatCard';
import ReportTable from './shared/ReportTable';
import EmptyState from './shared/EmptyState';
import ReportLoadingSkeleton from './shared/LoadingSkeleton';

interface GroupsFilters {
  groupType: string;
  groupStatus: string;
  minMembers: string;
  maxMembers: string;
  zoneId: string;
  ageGroup: string;
  meetingFrequency: string;
}

interface ReportResults {
  summary: {
    totalGroups: number;
    totalMembers: number;
    averageGroupSize: number;
    activeGroups: number;
    inactiveGroups: number;
    largestGroup: number;
  };
  data: any[];
}

export default function GroupsReportBuilder() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [showResults, setShowResults] = useState(false);
  const [reportResults, setReportResults] = useState<ReportResults | null>(null);

  const [filters, setFilters] = useState<GroupsFilters>({
    groupType: 'ALL',
    groupStatus: 'ALL',
    minMembers: '',
    maxMembers: '',
    zoneId: 'ALL',
    ageGroup: 'ALL',
    meetingFrequency: 'ALL',
  });

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

  const handleFilterChange = (field: keyof GroupsFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = () => {
    executeReport({
      variables: {
        input: {
          category: 'GROUPS',
          filters,
          organisationId,
          branchId,
        },
      },
    });
  };

  const handleReset = () => {
    setFilters({
      groupType: 'ALL',
      groupStatus: 'ALL',
      minMembers: '',
      maxMembers: '',
      zoneId: 'ALL',
      ageGroup: 'ALL',
      meetingFrequency: 'ALL',
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
      title: 'Groups Report',
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
      <ReportFilterPanel
        title="Report Filters"
        colorScheme="from-orange-50 to-amber-50"
        onReset={handleReset}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Group Type */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              👥 Group Type
            </Label>
            <Select
              value={filters.groupType}
              onValueChange={(value) => handleFilterChange('groupType', value)}
            >
              <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 hover:border-orange-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2">
                <SelectItem value="ALL" className="rounded-lg">All Types</SelectItem>
                <SelectItem value="MINISTRY" className="rounded-lg">Ministry</SelectItem>
                <SelectItem value="SMALL_GROUP" className="rounded-lg">Small Group</SelectItem>
                <SelectItem value="BIBLE_STUDY" className="rounded-lg">Bible Study</SelectItem>
                <SelectItem value="PRAYER_GROUP" className="rounded-lg">Prayer Group</SelectItem>
                <SelectItem value="CHOIR" className="rounded-lg">Choir</SelectItem>
                <SelectItem value="YOUTH_GROUP" className="rounded-lg">Youth Group</SelectItem>
                <SelectItem value="CHILDREN_GROUP" className="rounded-lg">Children Group</SelectItem>
                <SelectItem value="MENS_GROUP" className="rounded-lg">Men's Group</SelectItem>
                <SelectItem value="WOMENS_GROUP" className="rounded-lg">Women's Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Group Status */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              ✅ Group Status
            </Label>
            <Select
              value={filters.groupStatus}
              onValueChange={(value) => handleFilterChange('groupStatus', value)}
            >
              <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 hover:border-green-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2">
                <SelectItem value="ALL" className="rounded-lg">All Statuses</SelectItem>
                <SelectItem value="ACTIVE" className="rounded-lg">Active</SelectItem>
                <SelectItem value="INACTIVE" className="rounded-lg">Inactive</SelectItem>
                <SelectItem value="SUSPENDED" className="rounded-lg">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Group */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              👶 Target Age Group
            </Label>
            <Select
              value={filters.ageGroup}
              onValueChange={(value) => handleFilterChange('ageGroup', value)}
            >
              <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 hover:border-purple-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2">
                <SelectItem value="ALL" className="rounded-lg">All Ages</SelectItem>
                <SelectItem value="CHILDREN" className="rounded-lg">Children (0-12)</SelectItem>
                <SelectItem value="YOUTH" className="rounded-lg">Youth (13-24)</SelectItem>
                <SelectItem value="ADULTS" className="rounded-lg">Adults (25-59)</SelectItem>
                <SelectItem value="SENIORS" className="rounded-lg">Seniors (60+)</SelectItem>
                <SelectItem value="MIXED" className="rounded-lg">Mixed Ages</SelectItem>
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

          {/* Meeting Frequency */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              📅 Meeting Frequency
            </Label>
            <Select
              value={filters.meetingFrequency}
              onValueChange={(value) => handleFilterChange('meetingFrequency', value)}
            >
              <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 hover:border-indigo-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2">
                <SelectItem value="ALL" className="rounded-lg">All Frequencies</SelectItem>
                <SelectItem value="DAILY" className="rounded-lg">Daily</SelectItem>
                <SelectItem value="WEEKLY" className="rounded-lg">Weekly</SelectItem>
                <SelectItem value="BIWEEKLY" className="rounded-lg">Bi-weekly</SelectItem>
                <SelectItem value="MONTHLY" className="rounded-lg">Monthly</SelectItem>
                <SelectItem value="QUARTERLY" className="rounded-lg">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Member Range */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              👥 Member Count Range
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minMembers" className="text-xs text-gray-600">
                  Min Members
                </Label>
                <Input
                  id="minMembers"
                  type="number"
                  value={filters.minMembers}
                  onChange={(e) => handleFilterChange('minMembers', e.target.value)}
                  placeholder="0"
                  className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 hover:border-amber-300"
                />
              </div>
              <div>
                <Label htmlFor="maxMembers" className="text-xs text-gray-600">
                  Max Members
                </Label>
                <Input
                  id="maxMembers"
                  type="number"
                  value={filters.maxMembers}
                  onChange={(e) => handleFilterChange('maxMembers', e.target.value)}
                  placeholder="100"
                  className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 hover:border-amber-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t-2 border-gray-100">
          <Button
            onClick={handleGenerateReport}
            disabled={loading}
            className="h-12 px-8 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-700 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Generate Report
          </Button>
        </div>
      </ReportFilterPanel>

      {showResults && reportResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <ReportSummaryCard
            title="Groups Statistics"
            colorScheme="from-orange-50 to-amber-50"
            onExport={handleExport}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard
                label="Total Groups"
                value={reportResults.summary.totalGroups}
                colorScheme="orange"
              />
              <StatCard
                label="Total Members"
                value={reportResults.summary.totalMembers}
                colorScheme="blue"
              />
              <StatCard
                label="Avg Group Size"
                value={reportResults.summary.averageGroupSize}
                colorScheme="purple"
              />
              <StatCard
                label="Active Groups"
                value={reportResults.summary.activeGroups}
                colorScheme="green"
              />
              <StatCard
                label="Inactive Groups"
                value={reportResults.summary.inactiveGroups}
                colorScheme="gray"
              />
              <StatCard
                label="Largest Group"
                value={reportResults.summary.largestGroup}
                colorScheme="amber"
              />
            </div>
          </ReportSummaryCard>

          <ReportTable
            title="Groups Records"
            columns={[
              { key: 'name', label: 'Group Name' },
              { key: 'groupType', label: 'Type' },
              { key: 'memberCount', label: 'Members' },
              { key: 'leader', label: 'Leader' },
              { key: 'meetingFrequency', label: 'Frequency' },
              { key: 'status', label: 'Status' },
            ]}
            data={reportResults.data}
            pageSize={50}
            emptyMessage="No groups found"
          />
        </motion.div>
      )}

      {/* Empty State */}
      {!showResults && !loading && (
        <EmptyState
          title="Ready to Generate Report"
          message="Apply your filters above and click Generate Report to see groups statistics and records"
          actionLabel="Generate Report"
          onAction={handleGenerateReport}
        />
      )}
    </div>
  );
}
