"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  SparklesIcon,
  GiftIcon,
  HeartIcon,
  DocumentChartBarIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { GET_FILTERED_SACRAMENT_STATS } from "@/graphql/queries/sacramentStatsQueries";

interface SacramentAnalyticsProps {
  className?: string;
}

interface SacramentStats {
  totalBaptisms: number;
  totalCommunions: number;
  totalConfirmations: number;
  totalMarriages: number;
  totalSacraments: number;
  baptismTrend: number;
  communionTrend: number;
  confirmationTrend: number;
  marriageTrend: number;
  monthlyData: Array<{
    month: string;
    baptisms: number;
    communions: number;
    confirmations: number;
    marriages: number;
  }>;
}

const sacramentTypes = [
  {
    name: 'Baptisms',
    key: 'totalBaptisms',
    trendKey: 'baptismTrend',
    icon: SparklesIcon,
    color: 'blue',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  {
    name: 'First Communions',
    key: 'totalCommunions',
    trendKey: 'communionTrend',
    icon: GiftIcon,
    color: 'amber',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-200',
  },
  {
    name: 'Confirmations',
    key: 'totalConfirmations',
    trendKey: 'confirmationTrend',
    icon: HeartIcon,
    color: 'purple',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200',
  },
  {
    name: 'Marriages',
    key: 'totalMarriages',
    trendKey: 'marriageTrend',
    icon: UserGroupIcon,
    color: 'rose',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600',
    borderColor: 'border-rose-200',
  },
];

const periodOptions = [
  { value: 'THIS_MONTH', label: 'This Month' },
  { value: 'LAST_MONTH', label: 'Last Month' },
  { value: 'THIS_QUARTER', label: 'This Quarter' },
  { value: 'LAST_QUARTER', label: 'Last Quarter' },
  { value: 'THIS_YEAR', label: 'This Year' },
  { value: 'LAST_YEAR', label: 'Last Year' },
];

export default function SacramentAnalytics({ className = "" }: SacramentAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('THIS_YEAR');
  const [isExporting, setIsExporting] = useState(false);
  
  const { organisationId, branchId } = useOrganisationBranch();

  const { data, loading, error, refetch } = useQuery(GET_FILTERED_SACRAMENT_STATS, {
    variables: {
      branchId,
      period: selectedPeriod.toLowerCase(),
    },
    skip: !branchId,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const stats: SacramentStats = useMemo(() => {
    if (!data?.sacramentStats) {
      return {
        totalBaptisms: 0,
        totalCommunions: 0,
        totalConfirmations: 0,
        totalMarriages: 0,
        totalSacraments: 0,
        baptismTrend: 0,
        communionTrend: 0,
        confirmationTrend: 0,
        marriageTrend: 0,
        monthlyData: [],
      };
    }

    // Transform the array of sacrament stats into the expected structure
    const rawStats = data.sacramentStats;
    const statsMap: Record<string, { count: number; trend: number }> = {};
    
    // Create a map from the array data
    rawStats.forEach((stat: any) => {
      statsMap[stat.sacramentType] = {
        count: stat.count || 0,
        trend: typeof stat.trend === 'number' ? stat.trend : 0,
      };
    });

    const totalBaptisms = statsMap['BAPTISM']?.count || 0;
    const totalCommunions = statsMap['EUCHARIST_FIRST_COMMUNION']?.count || 0;
    const totalConfirmations = statsMap['CONFIRMATION']?.count || 0;
    const totalMarriages = statsMap['MATRIMONY']?.count || 0;

    return {
      totalBaptisms,
      totalCommunions,
      totalConfirmations,
      totalMarriages,
      totalSacraments: totalBaptisms + totalCommunions + totalConfirmations + totalMarriages,
      baptismTrend: statsMap['BAPTISM']?.trend || 0,
      communionTrend: statsMap['EUCHARIST_FIRST_COMMUNION']?.trend || 0,
      confirmationTrend: statsMap['CONFIRMATION']?.trend || 0,
      marriageTrend: statsMap['MATRIMONY']?.trend || 0,
      monthlyData: [], // Backend doesn't provide monthly data yet
    };
  }, [data]);

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      // Create CSV content
      const csvContent = generateCSVReport(stats, selectedPeriod);
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `sacrament-analytics-${selectedPeriod.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const generateCSVReport = (stats: SacramentStats, period: string) => {
    const headers = ['Metric', 'Count', 'Trend (%)'];
    const rows = [
      ['Total Sacraments', stats.totalSacraments.toString(), ''],
      ['Baptisms', stats.totalBaptisms.toString(), stats.baptismTrend.toString()],
      ['First Communions', stats.totalCommunions.toString(), stats.communionTrend.toString()],
      ['Confirmations', stats.totalConfirmations.toString(), stats.confirmationTrend.toString()],
      ['Marriages', stats.totalMarriages.toString(), stats.marriageTrend.toString()],
    ];

    const csvContent = [
      [`Sacrament Analytics Report - ${period}`],
      [`Generated on: ${new Date().toLocaleDateString()}`],
      [''],
      headers,
      ...rows,
    ].map(row => row.join(',')).join('\n');

    return csvContent;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return ArrowTrendingUpIcon;
    if (trend < 0) return ArrowTrendingDownIcon;
    return ChartBarIcon;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatTrend = (trend: number) => {
    if (trend === 0) return 'No change';
    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center py-8">
          <DocumentChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Analytics</h3>
          <p className="text-gray-600 mb-4">Unable to fetch sacrament analytics data.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sacrament Analytics</h2>
              <p className="text-sm text-gray-600">Comprehensive insights and trends</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <button
              onClick={handlePrintReport}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Print
            </button>
            
            <button
              onClick={handleExportReport}
              disabled={isExporting}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Sacraments Card */}
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">Total Sacraments</p>
                <p className="text-2xl font-bold text-indigo-900">{stats.totalSacraments}</p>
              </div>
              <div className="p-3 bg-indigo-200 rounded-full">
                <SparklesIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Individual Sacrament Cards */}
          {sacramentTypes.map((type) => {
            const count = stats[type.key as keyof SacramentStats] as number;
            const trend = stats[type.trendKey as keyof SacramentStats] as number;
            const TrendIcon = getTrendIcon(trend);
            
            return (
              <div key={type.key} className={`${type.bgColor} border ${type.borderColor} rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className={`text-sm font-medium ${type.iconColor}`}>{type.name}</p>
                    <p className={`text-2xl font-bold ${type.iconColor.replace('600', '900')}`}>{count}</p>
                  </div>
                  <div className={`p-3 ${type.bgColor.replace('50', '200')} rounded-full`}>
                    <type.icon className={`h-6 w-6 ${type.iconColor}`} />
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendIcon className={`h-4 w-4 ${getTrendColor(trend)}`} />
                  <span className={`text-xs font-medium ${getTrendColor(trend)}`}>
                    {formatTrend(trend)}
                  </span>
                  <span className="text-xs text-gray-500">vs previous period</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Monthly Trend Chart (Placeholder) */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Baptisms</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-gray-600">Communions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Confirmations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                <span className="text-gray-600">Marriages</span>
              </div>
            </div>
          </div>
          
          {stats.monthlyData.length > 0 ? (
            <div className="h-64 flex items-end justify-between space-x-2">
              {stats.monthlyData.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '200px' }}>
                    {/* Simple bar chart representation */}
                    <div className="absolute bottom-0 w-full flex flex-col">
                      <div 
                        className="bg-blue-500 rounded-t"
                        style={{ height: `${(month.baptisms / Math.max(...stats.monthlyData.map(m => m.baptisms + m.communions + m.confirmations + m.marriages))) * 200}px` }}
                      ></div>
                      <div 
                        className="bg-amber-500"
                        style={{ height: `${(month.communions / Math.max(...stats.monthlyData.map(m => m.baptisms + m.communions + m.confirmations + m.marriages))) * 200}px` }}
                      ></div>
                      <div 
                        className="bg-purple-500"
                        style={{ height: `${(month.confirmations / Math.max(...stats.monthlyData.map(m => m.baptisms + m.communions + m.confirmations + m.marriages))) * 200}px` }}
                      ></div>
                      <div 
                        className="bg-rose-500"
                        style={{ height: `${(month.marriages / Math.max(...stats.monthlyData.map(m => m.baptisms + m.communions + m.confirmations + m.marriages))) * 200}px` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{month.month}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No monthly data available for the selected period</p>
              </div>
            </div>
          )}
        </div>

        {/* Key Insights */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Top Performing Sacrament</h4>
            <p className="text-blue-800">
              {sacramentTypes.reduce((prev, current) => 
                (stats[prev.key as keyof SacramentStats] as number) > (stats[current.key as keyof SacramentStats] as number) ? prev : current
              ).name} with {Math.max(...sacramentTypes.map(type => stats[type.key as keyof SacramentStats] as number))} records
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-900 mb-2">Growth Trend</h4>
            <p className="text-green-800">
              {sacramentTypes.filter(type => (stats[type.trendKey as keyof SacramentStats] as number) > 0).length} out of 4 sacraments showing positive growth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
