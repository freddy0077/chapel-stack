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
import { ChartBarIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Shared components
import ReportFilterPanel from './shared/ReportFilterPanel';
import ReportSummaryCard from './shared/ReportSummaryCard';
import StatCard from './shared/StatCard';
import ReportTable from './shared/ReportTable';
import EmptyState from './shared/EmptyState';
import ReportLoadingSkeleton from './shared/LoadingSkeleton';

interface SacramentsFilters {
  startDate: string;
  endDate: string;
  sacramentType: string;
  gender: string;
  zoneId: string;
  certificateStatus: string;
}

interface ReportResults {
  summary: {
    totalSacraments: number;
    withCertificate: number;
    withoutCertificate: number;
  };
  data: any[];
}

export default function SacramentsReportBuilder() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [showResults, setShowResults] = useState(false);
  const [reportResults, setReportResults] = useState<ReportResults | null>(null);

  const [filters, setFilters] = useState<SacramentsFilters>({
    startDate: '',
    endDate: '',
    sacramentType: 'ALL',
    gender: 'ALL',
    zoneId: 'ALL',
    certificateStatus: 'ALL',
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

  const handleFilterChange = (field: keyof SacramentsFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = () => {
    executeReport({
      variables: {
        input: {
          category: 'SACRAMENTS',
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
      sacramentType: 'ALL',
      gender: 'ALL',
      zoneId: 'ALL',
      certificateStatus: 'ALL',
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
      title: 'Sacraments Report',
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
        colorScheme="from-indigo-50 to-purple-50"
        onReset={handleReset}
      >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Date Range */}
            <div className="space-y-3 md:col-span-2 lg:col-span-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    📅 Sacrament Date Range
                  </Label>
                  <p className="text-sm text-gray-600 font-medium">Select the start and end dates for sacrament records</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-2 block">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 hover:border-indigo-300"
                  />
                </div>
                <div className="relative">
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-2 block">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 hover:border-indigo-300"
                  />
                </div>
              </div>
            </div>

            {/* Sacrament Type */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    ⛪ Sacrament Type
                  </Label>
                  <p className="text-sm text-gray-600 font-medium">Choose specific sacrament (Baptism, Marriage, etc.) or select "All Types"</p>
                </div>
              </div>
              <Select
                value={filters.sacramentType}
                onValueChange={(value) => handleFilterChange('sacramentType', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 hover:border-purple-300">
                  <SelectValue placeholder="Select sacrament type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">All Types</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="BAPTISM" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-sm">Baptism</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="CONFIRMATION" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-sm">Confirmation</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="COMMUNION" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      <span className="text-sm">Holy Communion</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MARRIAGE" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      <span className="text-sm">Marriage</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ORDINATION" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span className="text-sm">Ordination</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    👤 Gender Filter
                  </Label>
                  <p className="text-sm text-gray-600 font-medium">Filter records by recipient's gender (Male, Female, or All)</p>
                </div>
              </div>
              <Select
                value={filters.gender}
                onValueChange={(value) => handleFilterChange('gender', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-300">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">All Genders</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MALE" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-sm">Male</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="FEMALE" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      <span className="text-sm">Female</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Zone */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    📍 Zone / Community
                  </Label>
                  <p className="text-sm text-gray-600 font-medium">Filter by specific geographical zone or select "All Zones"</p>
                </div>
              </div>
              <Select
                value={filters.zoneId}
                onValueChange={(value) => handleFilterChange('zoneId', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 hover:border-cyan-300">
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">All Zones</span>
                    </div>
                  </SelectItem>
                  {zones.map((zone: any) => (
                    <SelectItem key={zone.id} value={zone.id} className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                        <span className="text-sm">{zone.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Certificate Status */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    📜 Certificate Status
                  </Label>
                  <p className="text-sm text-gray-600 font-medium">Show records with certificates, without certificates, or all records</p>
                </div>
              </div>
              <Select
                value={filters.certificateStatus}
                onValueChange={(value) =>
                  handleFilterChange('certificateStatus', value)
                }
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 hover:border-amber-300">
                  <SelectValue placeholder="Select certificate status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">All Statuses</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="WITH" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-sm">With Certificate</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="WITHOUT" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span className="text-sm">Without Certificate</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t-2 border-gray-100">
          <Button
            onClick={handleGenerateReport}
            disabled={loading}
            className="h-12 px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
            title="Sacraments Statistics"
            colorScheme="from-indigo-50 to-purple-50"
            onExport={handleExport}
          >
            <div className="grid grid-cols-3 gap-4">
              <StatCard
                label="Total Sacraments"
                value={reportResults.summary.totalSacraments}
                colorScheme="indigo"
              />
              <StatCard
                label="With Certificate"
                value={reportResults.summary.withCertificate}
                colorScheme="green"
                icon={<DocumentCheckIcon className="h-4 w-4 text-green-600" />}
              />
              <StatCard
                label="Without Certificate"
                value={reportResults.summary.withoutCertificate}
                colorScheme="orange"
              />
            </div>
          </ReportSummaryCard>

          <ReportTable
            title="Sacramental Records"
            columns={[
              {
                key: 'member.firstName',
                label: 'Member',
                render: (_, row) =>
                  `${row.member?.firstName || ''} ${row.member?.lastName || ''}`.trim() ||
                  'N/A',
              },
              { key: 'sacramentType', label: 'Sacrament Type' },
              {
                key: 'sacramentDate',
                label: 'Date',
                render: (value) => new Date(value).toLocaleDateString(),
              },
              { key: 'officiantName', label: 'Officiant' },
              {
                key: 'certificateIssued',
                label: 'Certificate',
                render: (value) => (
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      value
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {value ? 'Issued' : 'Pending'}
                  </span>
                ),
              },
            ]}
            data={reportResults.data}
            pageSize={50}
            emptyMessage="No sacramental records found"
          />
        </motion.div>
      )}

      {/* Empty State */}
      {!showResults && !loading && (
        <EmptyState
          title="Ready to Generate Report"
          message="Apply your filters above and click Generate Report to see sacramental statistics and records"
          actionLabel="Generate Report"
          onAction={handleGenerateReport}
        />
      )}
    </div>
  );
}
