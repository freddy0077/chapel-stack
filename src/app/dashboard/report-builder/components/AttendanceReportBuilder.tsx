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
import { ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Shared components
import ReportFilterPanel from './shared/ReportFilterPanel';
import ReportSummaryCard from './shared/ReportSummaryCard';
import StatCard from './shared/StatCard';
import ReportTable from './shared/ReportTable';
import EmptyState from './shared/EmptyState';
import ReportLoadingSkeleton from './shared/LoadingSkeleton';

interface AttendanceFilters {
  gender: string;
  attendanceType: string;
  timeRange: string;
  startDate: string;
  endDate: string;
  membershipType: string;
  membershipStatus: string;
  ageGroup: string;
  eventType: string;
  zoneId: string;
}

interface ReportResults {
  summary: {
    totalRecords: number;
    totalSessions: number;
    totalEvents: number;
    uniqueMembers: number;
    averageSessionAttendance: number;
    averageEventAttendance: number;
    maleCount: number;
    femaleCount: number;
    byZone: Record<string, number>;
  };
  data: any[];
}

export default function AttendanceReportBuilder() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [showResults, setShowResults] = useState(false);
  const [reportResults, setReportResults] = useState<ReportResults | null>(null);

  console.log('AttendanceReportBuilder - organisationId:', organisationId, 'branchId:', branchId);

  const [filters, setFilters] = useState<AttendanceFilters>({
    gender: 'ALL',
    attendanceType: 'ALL',
    timeRange: 'ALL',
    startDate: '',
    endDate: '',
    membershipType: 'ALL',
    membershipStatus: 'ALL',
    ageGroup: 'ALL',
    eventType: 'ALL',
    zoneId: 'ALL',
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

  const handleFilterChange = (field: keyof AttendanceFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = () => {
    executeReport({
      variables: {
        input: {
          category: 'ATTENDANCE',
          filters,
          organisationId,
          branchId,
        },
      },
    });
  };

  const handleReset = () => {
    setFilters({
      gender: 'ALL',
      attendanceType: 'ALL',
      timeRange: 'ALL',
      startDate: '',
      endDate: '',
      membershipType: 'ALL',
      membershipStatus: 'ALL',
      ageGroup: 'ALL',
      eventType: 'ALL',
      zoneId: 'ALL',
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
      title: 'Attendance Report',
      summary: reportResults.summary,
      data: reportResults.data,
      filters,
      organisationName: 'Your Organization', // TODO: Get from context
      branchName: 'Your Branch', // TODO: Get from context
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
        colorScheme="from-blue-50 to-indigo-50"
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
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-300"
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
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-300"
                  />
                </div>
              </div>
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

            {/* Attendance Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                📋 Attendance Type
              </Label>
              <Select
                value={filters.attendanceType}
                onValueChange={(value) => handleFilterChange('attendanceType', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 hover:border-indigo-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">All Types</SelectItem>
                  <SelectItem value="SESSION" className="rounded-lg">Sessions Only</SelectItem>
                  <SelectItem value="EVENT" className="rounded-lg">Events Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Range */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                🕐 Time Range
              </Label>
              <Select
                value={filters.timeRange}
                onValueChange={(value) => handleFilterChange('timeRange', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 hover:border-purple-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">All Times</SelectItem>
                  <SelectItem value="MORNING" className="rounded-lg">Morning</SelectItem>
                  <SelectItem value="AFTERNOON" className="rounded-lg">Afternoon</SelectItem>
                  <SelectItem value="EVENING" className="rounded-lg">Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Membership Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                🎫 Membership Type
              </Label>
              <Select
                value={filters.membershipType}
                onValueChange={(value) => handleFilterChange('membershipType', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 hover:border-pink-300">
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
                </SelectContent>
              </Select>
            </div>

            {/* Age Group */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                👶 Age Group
              </Label>
              <Select
                value={filters.ageGroup}
                onValueChange={(value) => handleFilterChange('ageGroup', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 hover:border-amber-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">All Ages</SelectItem>
                  <SelectItem value="CHILDREN" className="rounded-lg">Children (0-12)</SelectItem>
                  <SelectItem value="YOUTH" className="rounded-lg">Youth (13-24)</SelectItem>
                  <SelectItem value="ADULTS" className="rounded-lg">Adults (25-59)</SelectItem>
                  <SelectItem value="SENIORS" className="rounded-lg">Seniors (60+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                🎉 Event Type
              </Label>
              <Select
                value={filters.eventType}
                onValueChange={(value) => handleFilterChange('eventType', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 hover:border-teal-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">All Events</SelectItem>
                  <SelectItem value="SERVICE" className="rounded-lg">Service</SelectItem>
                  <SelectItem value="PRAYER_MEETING" className="rounded-lg">Prayer Meeting</SelectItem>
                  <SelectItem value="BIBLE_STUDY" className="rounded-lg">Bible Study</SelectItem>
                  <SelectItem value="FELLOWSHIP" className="rounded-lg">Fellowship</SelectItem>
                  <SelectItem value="CONFERENCE" className="rounded-lg">Conference</SelectItem>
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
          </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button
            onClick={handleGenerateReport}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
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
                label="Total Attendance"
                value={reportResults.summary.totalRecords}
                colorScheme="blue"
              />
              <StatCard
                label="Unique Members"
                value={reportResults.summary.uniqueMembers}
                colorScheme="purple"
              />
              <StatCard
                label="Total Sessions"
                value={reportResults.summary.totalSessions}
                colorScheme="green"
              />
              <StatCard
                label="Total Events"
                value={reportResults.summary.totalEvents}
                colorScheme="orange"
              />
              <StatCard
                label="Avg Session Attendance"
                value={reportResults.summary.averageSessionAttendance.toFixed(1)}
                colorScheme="indigo"
              />
              <StatCard
                label="Avg Event Attendance"
                value={reportResults.summary.averageEventAttendance.toFixed(1)}
                colorScheme="pink"
              />
              <StatCard
                label="Male"
                value={reportResults.summary.maleCount}
                colorScheme="cyan"
              />
              <StatCard
                label="Female"
                value={reportResults.summary.femaleCount}
                colorScheme="rose"
              />
            </div>

              {/* By Zone Breakdown */}
              {Object.keys(reportResults.summary.byZone).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <UserGroupIcon className="h-5 w-5" />
                    Attendance by Zone
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
          </ReportSummaryCard>

          {/* Detailed Data Table */}
          <ReportTable
            title="Detailed Attendance Records"
            columns={[
              {
                key: 'member.firstName',
                label: 'Member',
                render: (_, row) =>
                  `${row.member?.firstName || ''} ${row.member?.lastName || ''}`.trim() ||
                  'N/A',
              },
              { key: 'member.gender', label: 'Gender' },
              { key: 'member.membershipType', label: 'Type' },
              { key: 'member.zone.name', label: 'Zone' },
              {
                key: 'createdAt',
                label: 'Date',
                render: (value) =>
                  value ? new Date(value).toLocaleDateString() : 'N/A',
              },
            ]}
            data={reportResults.data}
            pageSize={50}
            emptyMessage="No attendance records found"
          />
        </motion.div>
      )}

      {/* Empty State */}
      {!showResults && !loading && (
        <EmptyState
          title="Ready to Generate Report"
          message="Apply your filters above and click Generate Report to see attendance statistics and detailed records"
          actionLabel="Generate Report"
          onAction={handleGenerateReport}
        />
      )}
    </div>
  );
}
