'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  HeartIcon,
  UserMinusIcon,
  DocumentTextIcon,
  MapIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowRightIcon,
  SparklesIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const reportCategories = [
  {
    id: 'attendance',
    title: 'Attendance Reports',
    description: 'Track and analyze attendance patterns across sessions and events',
    icon: ChartBarIcon,
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    bgGradient: 'from-blue-50 to-indigo-50',
    path: '/dashboard/report-builder/attendance',
    stats: { filters: 9, metrics: 8 },
  },
  {
    id: 'membership',
    title: 'Membership Reports',
    description: 'Comprehensive member statistics and demographics',
    icon: UsersIcon,
    gradient: 'from-purple-500 via-purple-600 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50',
    path: '/dashboard/report-builder/membership',
    stats: { filters: 11, metrics: 6 },
  },
  {
    id: 'finance',
    title: 'Finance Reports',
    description: 'Financial transactions, income, and expense analysis',
    icon: CurrencyDollarIcon,
    gradient: 'from-green-500 via-emerald-600 to-teal-600',
    bgGradient: 'from-green-50 to-emerald-50',
    path: '/dashboard/report-builder/finance',
    stats: { filters: 7, metrics: 4 },
  },
  {
    id: 'birth-register',
    title: 'Birth Register',
    description: 'Birth records and baptism statistics',
    icon: HeartIcon,
    gradient: 'from-pink-500 via-rose-600 to-red-600',
    bgGradient: 'from-pink-50 to-rose-50',
    path: '/dashboard/report-builder/birth-register',
    stats: { filters: 4, metrics: 3 },
  },
  {
    id: 'death-register',
    title: 'Death Register',
    description: 'Memorial records and statistics',
    icon: UserMinusIcon,
    gradient: 'from-gray-500 via-slate-600 to-gray-700',
    bgGradient: 'from-gray-50 to-slate-50',
    path: '/dashboard/report-builder/death-register',
    stats: { filters: 4, metrics: 3 },
  },
  {
    id: 'sacraments',
    title: 'Sacraments Reports',
    description: 'Sacramental records and certificate tracking',
    icon: DocumentTextIcon,
    gradient: 'from-indigo-500 via-purple-600 to-violet-600',
    bgGradient: 'from-indigo-50 to-purple-50',
    path: '/dashboard/report-builder/sacraments',
    stats: { filters: 6, metrics: 3 },
  },
  {
    id: 'zones',
    title: 'Zones Reports',
    description: 'Zone distribution and member allocation',
    icon: MapIcon,
    gradient: 'from-cyan-500 via-blue-600 to-sky-600',
    bgGradient: 'from-cyan-50 to-blue-50',
    path: '/dashboard/report-builder/zones',
    comingSoon: true,
  },
  {
    id: 'groups',
    title: 'Groups Reports',
    description: 'Ministry and group participation analysis',
    icon: UserGroupIcon,
    gradient: 'from-orange-500 via-amber-600 to-yellow-600',
    bgGradient: 'from-orange-50 to-amber-50',
    iconColor: 'text-orange-600',
    path: '/dashboard/report-builder/groups',
    stats: { filters: 7, metrics: 6 },
  },
  {
    id: 'events',
    title: 'Events Reports',
    description: 'Event attendance and participation metrics',
    icon: CalendarIcon,
    gradient: 'from-teal-500 via-green-600 to-emerald-600',
    bgGradient: 'from-teal-50 to-green-50',
    iconColor: 'text-teal-600',
    path: '/dashboard/report-builder/events',
    stats: { filters: 7, metrics: 6 },
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ReportBuilderPage() {
  const router = useRouter();

  const handleNavigate = (path: string, comingSoon?: boolean) => {
    if (comingSoon) return;
    router.push(path);
  };

  const activeReports = reportCategories.filter((r) => !r.comingSoon).length;
  const comingSoonReports = reportCategories.filter((r) => r.comingSoon).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6 space-y-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <ChartBarIcon className="h-8 w-8" />
            </div>
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
              <SparklesIcon className="h-3 w-3 mr-1" />
              Powered by Analytics
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Report Builder
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
            Generate comprehensive, data-driven reports with powerful filtering, 
            real-time analytics, and seamless export capabilities
          </p>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FunnelIcon className="h-5 w-5" />
              <span className="text-sm font-medium">50+ Filters</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span className="text-sm font-medium">3 Export Formats</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <ChartBarIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Real-time Data</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={item}>
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {reportCategories.length}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Now</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {activeReports}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Export Formats</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    3
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF • Excel • CSV</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Coming Soon</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    {comingSoonReports}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Report Categories */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select a Report Type</h2>
            <p className="text-gray-600 mt-1">Choose from our comprehensive collection of reports</p>
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reportCategories.map((category) => (
            <motion.div key={category.id} variants={item}>
              <Card
                className={`group relative overflow-hidden border-none shadow-lg transition-all duration-300 ${
                  category.comingSoon
                    ? 'opacity-75 cursor-not-allowed'
                    : 'cursor-pointer hover:shadow-2xl hover:-translate-y-2'
                }`}
                onClick={() => handleNavigate(category.path, category.comingSoon)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-50`}></div>
                
                {/* Hover Effect */}
                {!category.comingSoon && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                )}

                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="h-7 w-7 text-white" />
                    </div>
                    {category.comingSoon ? (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none shadow-md">
                        <SparklesIcon className="h-3 w-3 mr-1" />
                        Coming Soon
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-white/50 backdrop-blur-sm">
                        Active
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    {category.description}
                  </CardDescription>

                  {category.stats && (
                    <div className="flex gap-3 mt-4">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <FunnelIcon className="h-4 w-4" />
                        <span>{category.stats.filters} filters</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <ChartBarIcon className="h-4 w-4" />
                        <span>{category.stats.metrics} metrics</span>
                      </div>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="relative z-10">
                  <Button
                    variant="ghost"
                    className={`w-full justify-between group/btn ${
                      category.comingSoon
                        ? 'opacity-50'
                        : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                    }`}
                    disabled={category.comingSoon}
                  >
                    <span className="font-medium">Generate Report</span>
                    <ArrowRightIcon className="h-4 w-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-none shadow-xl bg-gradient-to-br from-white via-blue-50 to-indigo-50 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
          
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl">Powerful Features</CardTitle>
            <CardDescription>Everything you need for comprehensive reporting</CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg flex-shrink-0">
                  <FunnelIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Advanced Filtering</h3>
                  <p className="text-sm text-gray-600">
                    Filter by date range, demographics, zones, membership status, and more with intuitive controls
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg flex-shrink-0">
                  <DocumentArrowDownIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Multiple Export Formats</h3>
                  <p className="text-sm text-gray-600">
                    Export to PDF, Excel, or CSV with one click. Perfect for sharing and archiving
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Comprehensive Data</h3>
                  <p className="text-sm text-gray-600">
                    Detailed statistics, summary metrics, and paginated tables for easy analysis
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
