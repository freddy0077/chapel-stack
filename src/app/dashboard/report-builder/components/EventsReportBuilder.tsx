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

interface EventsFilters {
  startDate: string;
  endDate: string;
  eventType: string;
  eventStatus: string;
  minAttendance: string;
  maxAttendance: string;
  zoneId: string;
  organizerId: string;
}

interface ReportResults {
  summary: {
    totalEvents: number;
    totalAttendance: number;
    averageAttendance: number;
    upcomingEvents: number;
    completedEvents: number;
    cancelledEvents: number;
  };
  data: any[];
}

export default function EventsReportBuilder() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [showResults, setShowResults] = useState(false);
  const [reportResults, setReportResults] = useState<ReportResults | null>(null);

  const [filters, setFilters] = useState<EventsFilters>({
    startDate: '',
    endDate: '',
    eventType: 'ALL',
    eventStatus: 'ALL',
    minAttendance: '',
    maxAttendance: '',
    zoneId: 'ALL',
    organizerId: 'ALL',
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

  const handleFilterChange = (field: keyof EventsFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = () => {
    // Normalize filters to match backend expectations
    const eventTypeMap: Record<string, string> = {
      // UI value -> Backend enum value
      SERVICE: 'WORSHIP_SERVICE',
      PRAYER_MEETING: 'PRAYER_MEETING',
      BIBLE_STUDY: 'BIBLE_STUDY',
      FELLOWSHIP: 'FELLOWSHIP',
      CONFERENCE: 'CONFERENCE',
      SEMINAR: 'SEMINAR',
      OUTREACH: 'OUTREACH',
      YOUTH_EVENT: 'YOUTH_EVENT',
      CHILDREN_EVENT: 'CHILDREN_EVENT',
      ALL: 'ALL',
    };

    // Build a clean filters object: drop 'ALL' and empty strings
    const normalized: Record<string, any> = {};
    if (filters.startDate) normalized.startDate = filters.startDate;
    if (filters.endDate) normalized.endDate = filters.endDate;

    // Event type mapping
    if (filters.eventType && filters.eventType !== 'ALL') {
      const mapped = eventTypeMap[filters.eventType] || filters.eventType;
      if (mapped !== 'ALL') normalized.eventType = mapped;
    }

    // Event status: map UI values to backend-understood fields
    // - CANCELLED maps directly to status
    // - UPCOMING/ONGOING/COMPLETED become a logical time-based range handled by backend
    if (filters.eventStatus && filters.eventStatus !== 'ALL') {
      if (filters.eventStatus === 'CANCELLED') {
        normalized.eventStatus = 'CANCELLED';
      } else if (
        filters.eventStatus === 'UPCOMING' ||
        filters.eventStatus === 'ONGOING' ||
        filters.eventStatus === 'COMPLETED'
      ) {
        normalized.statusRange = filters.eventStatus; // handled in backend
      }
    }

    if (filters.minAttendance) normalized.minAttendance = String(filters.minAttendance);
    if (filters.maxAttendance) normalized.maxAttendance = String(filters.maxAttendance);

    // Note: zoneId and organizerId are currently not supported by backend events report

    executeReport({
      variables: {
        input: {
          category: 'EVENTS',
          filters: normalized,
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
      eventType: 'ALL',
      eventStatus: 'ALL',
      minAttendance: '',
      maxAttendance: '',
      zoneId: 'ALL',
      organizerId: 'ALL',
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
      title: 'Events Report',
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
        colorScheme="from-teal-50 to-green-50"
        onReset={handleReset}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Date Range */}
          <div className="space-y-2 md:col-span-2 lg:col-span-3">
            <Label className="text-sm font-semibold text-gray-700">
              📅 Event Date Range
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
                  className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 hover:border-teal-300"
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
                  className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 hover:border-teal-300"
                />
              </div>
            </div>
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
                <SelectItem value="ALL" className="rounded-lg">All Types</SelectItem>
                <SelectItem value="SERVICE" className="rounded-lg">Service</SelectItem>
                <SelectItem value="PRAYER_MEETING" className="rounded-lg">Prayer Meeting</SelectItem>
                <SelectItem value="BIBLE_STUDY" className="rounded-lg">Bible Study</SelectItem>
                <SelectItem value="FELLOWSHIP" className="rounded-lg">Fellowship</SelectItem>
                <SelectItem value="CONFERENCE" className="rounded-lg">Conference</SelectItem>
                <SelectItem value="SEMINAR" className="rounded-lg">Seminar</SelectItem>
                <SelectItem value="OUTREACH" className="rounded-lg">Outreach</SelectItem>
                <SelectItem value="YOUTH_EVENT" className="rounded-lg">Youth Event</SelectItem>
                <SelectItem value="CHILDREN_EVENT" className="rounded-lg">Children Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Event Status */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              ✅ Event Status
            </Label>
            <Select
              value={filters.eventStatus}
              onValueChange={(value) => handleFilterChange('eventStatus', value)}
            >
              <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 hover:border-green-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2">
                <SelectItem value="ALL" className="rounded-lg">All Statuses</SelectItem>
                <SelectItem value="UPCOMING" className="rounded-lg">Upcoming</SelectItem>
                <SelectItem value="ONGOING" className="rounded-lg">Ongoing</SelectItem>
                <SelectItem value="COMPLETED" className="rounded-lg">Completed</SelectItem>
                <SelectItem value="CANCELLED" className="rounded-lg">Cancelled</SelectItem>
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

          {/* Attendance Range */}
          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-semibold text-gray-700">
              👥 Attendance Range
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minAttendance" className="text-xs text-gray-600">
                  Min Attendance
                </Label>
                <Input
                  id="minAttendance"
                  type="number"
                  value={filters.minAttendance}
                  onChange={(e) => handleFilterChange('minAttendance', e.target.value)}
                  placeholder="0"
                  className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 hover:border-purple-300"
                />
              </div>
              <div>
                <Label htmlFor="maxAttendance" className="text-xs text-gray-600">
                  Max Attendance
                </Label>
                <Input
                  id="maxAttendance"
                  type="number"
                  value={filters.maxAttendance}
                  onChange={(e) => handleFilterChange('maxAttendance', e.target.value)}
                  placeholder="1000"
                  className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 hover:border-purple-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t-2 border-gray-100">
          <Button
            onClick={handleGenerateReport}
            disabled={loading}
            className="h-12 px-8 bg-gradient-to-r from-teal-600 via-green-600 to-emerald-700 hover:from-teal-700 hover:via-green-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
            title="Events Statistics"
            colorScheme="from-teal-50 to-green-50"
            onExport={handleExport}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard
                label="Total Events"
                value={reportResults.summary.totalEvents}
                colorScheme="teal"
              />
              <StatCard
                label="Total Attendance"
                value={reportResults.summary.totalAttendance}
                colorScheme="blue"
              />
              <StatCard
                label="Avg Attendance"
                value={reportResults.summary.averageAttendance}
                colorScheme="purple"
              />
              <StatCard
                label="Upcoming"
                value={reportResults.summary.upcomingEvents}
                colorScheme="amber"
              />
              <StatCard
                label="Completed"
                value={reportResults.summary.completedEvents}
                colorScheme="green"
              />
              <StatCard
                label="Cancelled"
                value={reportResults.summary.cancelledEvents}
                colorScheme="red"
              />
            </div>
          </ReportSummaryCard>

          <ReportTable
            title="Events Records"
            columns={[
              { key: 'name', label: 'Event Name' },
              { key: 'eventType', label: 'Type' },
              {
                key: 'eventDate',
                label: 'Date',
                render: (value) => new Date(value).toLocaleDateString(),
              },
              { key: 'location', label: 'Location' },
              { key: 'attendanceCount', label: 'Attendance' },
              { key: 'status', label: 'Status' },
            ]}
            data={reportResults.data}
            pageSize={50}
            emptyMessage="No events found"
          />
        </motion.div>
      )}

      {/* Empty State */}
      {!showResults && !loading && (
        <EmptyState
          title="Ready to Generate Report"
          message="Apply your filters above and click Generate Report to see events statistics and records"
          actionLabel="Generate Report"
          onAction={handleGenerateReport}
        />
      )}
    </div>
  );
}
