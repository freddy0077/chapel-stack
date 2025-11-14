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

interface ZonesFilters {
  zoneId: string;
  zoneStatus: string;
  minMembers: string;
  maxMembers: string;
  location: string;
}

interface ReportResults {
  summary: {
    totalZones: number;
    totalMembers: number;
    averageZoneSize: number;
    activeZones: number;
    inactiveZones: number;
    largestZone: number;
  };
  data: any[];
}

export default function ZonesReportBuilder() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [showResults, setShowResults] = useState(false);
  const [reportResults, setReportResults] = useState<ReportResults | null>(null);

  const [filters, setFilters] = useState<ZonesFilters>({
    zoneId: 'ALL',
    zoneStatus: 'ALL',
    minMembers: '',
    maxMembers: '',
    location: '',
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

  const handleFilterChange = (field: keyof ZonesFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = () => {
    executeReport({
      variables: {
        input: {
          category: 'ZONES',
          filters,
          organisationId,
          branchId,
        },
      },
    });
  };

  const handleReset = () => {
    setFilters({
      zoneId: 'ALL',
      zoneStatus: 'ALL',
      minMembers: '',
      maxMembers: '',
      location: '',
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
      title: 'Zones Report',
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
        colorScheme="from-cyan-50 to-blue-50"
        onReset={handleReset}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Zone Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              📍 Zone
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
                    {zone.name} {zone.location ? `(${zone.location})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Zone Status */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              ✅ Zone Status
            </Label>
            <Select
              value={filters.zoneStatus}
              onValueChange={(value) => handleFilterChange('zoneStatus', value)}
            >
              <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 hover:border-green-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2">
                <SelectItem value="ALL" className="rounded-lg">All Statuses</SelectItem>
                <SelectItem value="ACTIVE" className="rounded-lg">Active</SelectItem>
                <SelectItem value="INACTIVE" className="rounded-lg">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              🗺️ Location
            </Label>
            <Input
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Search by location"
              className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-300"
            />
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
                  className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 hover:border-cyan-300"
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
                  placeholder="1000"
                  className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 hover:border-cyan-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t-2 border-gray-100">
          <Button
            onClick={handleGenerateReport}
            disabled={loading}
            className="h-12 px-8 bg-gradient-to-r from-cyan-600 via-blue-600 to-sky-700 hover:from-cyan-700 hover:via-blue-700 hover:to-sky-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
            title="Zones Statistics"
            colorScheme="from-cyan-50 to-blue-50"
            onExport={handleExport}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard
                label="Total Zones"
                value={reportResults.summary.totalZones}
                colorScheme="cyan"
              />
              <StatCard
                label="Total Members"
                value={reportResults.summary.totalMembers}
                colorScheme="blue"
              />
              <StatCard
                label="Avg Zone Size"
                value={reportResults.summary.averageZoneSize}
                colorScheme="purple"
              />
              <StatCard
                label="Active Zones"
                value={reportResults.summary.activeZones}
                colorScheme="green"
              />
              <StatCard
                label="Inactive Zones"
                value={reportResults.summary.inactiveZones}
                colorScheme="gray"
              />
              <StatCard
                label="Largest Zone"
                value={reportResults.summary.largestZone}
                colorScheme="sky"
              />
            </div>
          </ReportSummaryCard>

          <ReportTable
            title="Zones Records"
            columns={[
              { key: 'name', label: 'Zone Name' },
              { key: 'location', label: 'Location' },
              { key: 'memberCount', label: 'Members' },
              { key: 'leaderName', label: 'Leader' },
              { key: 'leaderPhone', label: 'Leader Phone' },
              { key: 'status', label: 'Status' },
            ]}
            data={reportResults.data}
            pageSize={50}
            emptyMessage="No zones found"
          />
        </motion.div>
      )}

      {/* Empty State */}
      {!showResults && !loading && (
        <EmptyState
          title="Ready to Generate Report"
          message="Apply your filters above and click Generate Report to see zones statistics and records"
          actionLabel="Generate Report"
          onAction={handleGenerateReport}
        />
      )}
    </div>
  );
}
