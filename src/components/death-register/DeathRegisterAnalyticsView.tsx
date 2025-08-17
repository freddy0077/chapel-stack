'use client';

import React, { useState, useMemo } from 'react';
import {
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  HeartIcon,
  BellIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { DeathRegister, DeathRegisterStats } from '../../types/deathRegister';

interface DeathRegisterAnalyticsViewProps {
  stats?: DeathRegisterStats;
  records: DeathRegister[];
  loading: boolean;
  organisationId?: string;
  branchId?: string;
}

const COLORS = {
  primary: '#8B5CF6',
  secondary: '#06B6D4',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  burial: '#8B5CF6',
  cremation: '#F59E0B',
};

const DeathRegisterAnalyticsView: React.FC<DeathRegisterAnalyticsViewProps> = ({
  stats,
  records,
  loading,
  organisationId,
  branchId
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'6months' | '1year' | '2years'>('1year');
  const [selectedMetric, setSelectedMetric] = useState<'deaths' | 'age' | 'notifications'>('deaths');

  // Generate monthly data for charts
  const monthlyData = useMemo(() => {
    if (!records?.length) return [];

    const months = selectedTimeRange === '6months' ? 6 : selectedTimeRange === '1year' ? 12 : 24;
    const monthlyStats = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      const monthRecords = records.filter(record => {
        const deathDate = new Date(record.dateOfDeath);
        return deathDate >= monthStart && deathDate <= monthEnd;
      });

      const burialCount = monthRecords.filter(r => r.burialCremation === 'BURIAL').length;
      const cremationCount = monthRecords.filter(r => r.burialCremation === 'CREMATION').length;
      const avgAge = monthRecords.length > 0 
        ? monthRecords.reduce((sum, r) => {
            if (r.member?.dateOfBirth) {
              const age = new Date(r.dateOfDeath).getFullYear() - new Date(r.member.dateOfBirth).getFullYear();
              return sum + age;
            }
            return sum;
          }, 0) / monthRecords.length
        : 0;

      monthlyStats.push({
        month: format(date, 'MMM yyyy'),
        deaths: monthRecords.length,
        burials: burialCount,
        cremations: cremationCount,
        averageAge: Math.round(avgAge),
        notified: monthRecords.filter(r => r.familyNotified).length,
        pending: monthRecords.filter(r => !r.familyNotified).length,
      });
    }

    return monthlyStats;
  }, [records, selectedTimeRange]);

  // Age distribution data
  const ageDistributionData = useMemo(() => {
    if (!records?.length) return [];

    const ageGroups = {
      '0-18': 0,
      '19-30': 0,
      '31-50': 0,
      '51-70': 0,
      '71-85': 0,
      '85+': 0,
    };

    records.forEach(record => {
      if (record.member?.dateOfBirth) {
        const age = new Date(record.dateOfDeath).getFullYear() - new Date(record.member.dateOfBirth).getFullYear();
        
        if (age <= 18) ageGroups['0-18']++;
        else if (age <= 30) ageGroups['19-30']++;
        else if (age <= 50) ageGroups['31-50']++;
        else if (age <= 70) ageGroups['51-70']++;
        else if (age <= 85) ageGroups['71-85']++;
        else ageGroups['85+']++;
      }
    });

    return Object.entries(ageGroups).map(([range, count]) => ({
      ageRange: range,
      count,
      percentage: records.length > 0 ? Math.round((count / records.length) * 100) : 0,
    }));
  }, [records]);

  // Burial vs Cremation data
  const burialCremationData = useMemo(() => {
    if (!stats) return [];

    return [
      { name: 'Burial', value: stats.burialCount, color: COLORS.burial },
      { name: 'Cremation', value: stats.cremationCount, color: COLORS.cremation },
    ];
  }, [stats]);

  // Key metrics cards
  const keyMetrics = useMemo(() => {
    if (!stats) return [];

    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    const thisYearRecords = records.filter(r => new Date(r.dateOfDeath).getFullYear() === currentYear);
    const lastYearRecords = records.filter(r => new Date(r.dateOfDeath).getFullYear() === lastYear);
    
    const yearOverYearChange = lastYearRecords.length > 0 
      ? Math.round(((thisYearRecords.length - lastYearRecords.length) / lastYearRecords.length) * 100)
      : 0;

    return [
      {
        title: 'Total Deaths',
        value: stats.total,
        subtitle: 'All time records',
        icon: UserGroupIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        trend: null,
      },
      {
        title: 'This Year',
        value: stats.thisYear,
        subtitle: `vs ${lastYearRecords.length} last year`,
        icon: CalendarDaysIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        trend: yearOverYearChange,
      },
      {
        title: 'This Month',
        value: stats.thisMonth,
        subtitle: 'Current month',
        icon: ClockIcon,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        trend: null,
      },
      {
        title: 'Average Age',
        value: Math.round(stats.averageAge),
        subtitle: 'Years at time of death',
        icon: HeartIcon,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        trend: null,
      },
      {
        title: 'Family Notified',
        value: stats.familyNotifiedCount,
        subtitle: `${Math.round((stats.familyNotifiedCount / stats.total) * 100)}% completion rate`,
        icon: BellIcon,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        trend: null,
      },
      {
        title: 'Funeral Services',
        value: stats.funeralServicesHeld,
        subtitle: 'Services conducted',
        icon: DocumentTextIcon,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
        trend: null,
      },
    ];
  }, [stats, records]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Analytics Data</h3>
        <p className="mt-1 text-sm text-gray-500">
          No death register data available for analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-purple-900">Death Register Analytics</h2>
              <p className="text-purple-700">Comprehensive insights and reporting</p>
            </div>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-purple-700">Time Range:</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="px-3 py-2 bg-white border border-purple-200 rounded-lg text-purple-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last 12 Months</option>
              <option value="2years">Last 24 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keyMetrics.map((metric, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg border ${metric.borderColor} p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              
              {metric.trend !== null && (
                <div className={`flex items-center space-x-1 ${
                  metric.trend > 0 ? 'text-red-600' : metric.trend < 0 ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {metric.trend > 0 ? (
                    <ArrowUpIcon className="h-4 w-4" />
                  ) : metric.trend < 0 ? (
                    <ArrowDownIcon className="h-4 w-4" />
                  ) : null}
                  <span className="text-sm font-medium">
                    {Math.abs(metric.trend)}%
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              </div>
              <div className="text-sm text-gray-600">{metric.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
            <div className="flex items-center space-x-2">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="deaths">Deaths</option>
                <option value="age">Average Age</option>
                <option value="notifications">Notifications</option>
              </select>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {selectedMetric === 'deaths' ? (
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="deaths"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              ) : selectedMetric === 'age' ? (
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="averageAge"
                    stroke={COLORS.warning}
                    strokeWidth={3}
                  />
                </LineChart>
              ) : (
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="notified" fill={COLORS.success} name="Notified" />
                  <Bar dataKey="pending" fill={COLORS.danger} name="Pending" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Burial vs Cremation Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Burial vs Cremation</h3>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={burialCremationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percentage }) => `${name}: ${value} (${Math.round((value / stats.total) * 100)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {burialCremationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600">Burial ({stats.burialCount})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-600">Cremation ({stats.cremationCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Age Distribution Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Age Distribution at Time of Death</h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageDistributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageRange" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} people (${ageDistributionData.find(d => d.count === value)?.percentage}%)`,
                  'Count'
                ]}
              />
              <Bar dataKey="count" fill={COLORS.info} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Family Notification Rate</p>
                <p className="text-sm text-gray-600">
                  {Math.round((stats.familyNotifiedCount / stats.total) * 100)}% of families have been notified
                  {stats.familyNotifiedCount < stats.total && (
                    <span className="text-amber-600 ml-1">
                      ({stats.total - stats.familyNotifiedCount} pending)
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Funeral Services</p>
                <p className="text-sm text-gray-600">
                  {stats.funeralServicesHeld} funeral services have been conducted
                  ({Math.round((stats.funeralServicesHeld / stats.total) * 100)}% of total deaths)
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Burial Preference</p>
                <p className="text-sm text-gray-600">
                  {Math.round((stats.burialCount / (stats.burialCount + stats.cremationCount)) * 100)}% choose burial,
                  {Math.round((stats.cremationCount / (stats.burialCount + stats.cremationCount)) * 100)}% choose cremation
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Average Age</p>
                <p className="text-sm text-gray-600">
                  The average age at time of death is {Math.round(stats.averageAge)} years
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeathRegisterAnalyticsView;
