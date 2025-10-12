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

interface DeathRegisterFilters {
  startDate: string;
  endDate: string;
  gender: string;
  zoneId: string;
}

interface ReportResults {
  summary: {
    totalDeaths: number;
    maleCount: number;
    femaleCount: number;
  };
  data: any[];
}

export default function DeathRegisterReportBuilder() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [showResults, setShowResults] = useState(false);
  const [reportResults, setReportResults] = useState<ReportResults | null>(null);

  const [filters, setFilters] = useState<DeathRegisterFilters>({
    startDate: '',
    endDate: '',
    gender: 'ALL',
    zoneId: 'ALL',
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

  const handleFilterChange = (field: keyof DeathRegisterFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = () => {
    executeReport({
      variables: {
        input: {
          category: 'DEATH_REGISTER',
          filters,
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
      gender: 'ALL',
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
      title: 'Death Register Report',
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
        colorScheme="from-gray-50 to-slate-50"
        onReset={handleReset}
      >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Range */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-semibold text-gray-700">
                📅 Death Date Range
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
                    className="mt-1"
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
                    className="mt-1"
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
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Genders</SelectItem>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
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
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Zones</SelectItem>
                  {zones.map((zone: any) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button
            onClick={handleGenerateReport}
            disabled={loading}
            className="bg-gradient-to-r from-gray-600 to-slate-600"
          >
            <ChartBarIcon className="h-4 w-4 mr-2" />
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
            title="Death Statistics"
            colorScheme="from-gray-50 to-slate-50"
            onExport={handleExport}
          >
            <div className="grid grid-cols-3 gap-4">
              <StatCard
                label="Total Deaths"
                value={reportResults.summary.totalDeaths}
                colorScheme="gray"
              />
              <StatCard
                label="Male"
                value={reportResults.summary.maleCount}
                colorScheme="blue"
              />
              <StatCard
                label="Female"
                value={reportResults.summary.femaleCount}
                colorScheme="rose"
              />
            </div>
          </ReportSummaryCard>

          <ReportTable
            title="Death Records"
            columns={[
              {
                key: 'firstName',
                label: 'Name',
                render: (_, row) =>
                  `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'N/A',
              },
              { key: 'gender', label: 'Gender' },
              {
                key: 'deathDate',
                label: 'Death Date',
                render: (value) => new Date(value).toLocaleDateString(),
              },
              { key: 'ageAtDeath', label: 'Age' },
              { key: 'causeOfDeath', label: 'Cause' },
            ]}
            data={reportResults.data}
            pageSize={50}
            emptyMessage="No death records found"
          />
        </motion.div>
      )}

      {/* Empty State */}
      {!showResults && !loading && (
        <EmptyState
          title="Ready to Generate Report"
          message="Apply your filters above and click Generate Report to see death statistics and records"
          actionLabel="Generate Report"
          onAction={handleGenerateReport}
        />
      )}
    </div>
  );
}
