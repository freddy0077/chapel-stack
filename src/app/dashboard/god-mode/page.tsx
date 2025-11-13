'use client';

import { useQuery, gql } from '@apollo/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RouteGuard } from '@/components/RouteGuard';
import {
  Settings,
  Users,
  Building2,
  Shield,
  FileText,
  Activity,
  Zap,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  Cpu,
} from 'lucide-react';

// GraphQL Query
const GOD_MODE_DASHBOARD_QUERY = gql`
  query {
    godModeDashboard {
      systemHealth {
        status
        uptime
        avgResponseTime
        errorRate
        databaseStatus
        databaseSize
      }
      keyMetrics {
        totalUsers
        userGrowth
        totalOrganizations
        organizationGrowth
        activeSubscriptions
        monthlyRecurringRevenue
        systemLoad {
          cpu
          memory
          disk
        }
      }
      recentActivities
      alerts
    }
  }
`;

export default function GodModeDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const { data, loading, error } = useQuery(GOD_MODE_DASHBOARD_QUERY);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const dashboard = data?.godModeDashboard;

  // Define management sections
  const sections = [
    {
      id: 'organizations',
      title: 'Organizations',
      description: 'Manage all organizations in the system',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      path: '/dashboard/god-mode/organizations',
    },
    {
      id: 'users',
      title: 'Users',
      description: 'Manage all users and their access',
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
      path: '/dashboard/god-mode/users',
    },
    {
      id: 'roles',
      title: 'Roles',
      description: 'Create and manage system roles',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      path: '/dashboard/god-mode/role-assignment',
    },
    {
      id: 'permissions',
      title: 'Permissions',
      description: 'Manage system permissions',
      icon: Zap,
      color: 'from-amber-500 to-amber-600',
      path: '/dashboard/god-mode/permission-assignment',
    },
    {
      id: 'audit',
      title: 'Audit Logs',
      description: 'View and track system activities',
      icon: FileText,
      color: 'from-cyan-500 to-cyan-600',
      path: '/dashboard/god-mode/audit-logs',
    },
    {
      id: 'config',
      title: 'Configuration',
      description: 'Configure global system settings',
      icon: Settings,
      color: 'from-slate-500 to-slate-600',
      path: '/dashboard/god-mode/config',
    },
  ];

  return (
    <RouteGuard requiredRoles={['GOD_MODE', 'SYSTEM_ADMIN']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Modern Header with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl mb-8"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Cpu className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    God Mode Dashboard
                  </h1>
                  <p className="text-white/90 text-lg">
                    Complete system control and monitoring
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      System Status: Online
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Uptime: {dashboard?.systemHealth?.uptime?.toFixed(1) || 0} min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* System Health Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              {
                label: 'System Status',
                value: dashboard?.systemHealth?.status === 'online' ? '🟢 Online' : '🔴 Offline',
                icon: Activity,
                color: 'from-green-500 to-green-600',
              },
              {
                label: 'Response Time',
                value: `${dashboard?.systemHealth?.avgResponseTime || 0}ms`,
                icon: Clock,
                color: 'from-blue-500 to-blue-600',
              },
              {
                label: 'Error Rate',
                value: `${((dashboard?.systemHealth?.errorRate || 0) * 100).toFixed(2)}%`,
                icon: AlertCircle,
                color: 'from-orange-500 to-orange-600',
              },
              {
                label: 'Total Users',
                value: dashboard?.keyMetrics?.totalUsers || 0,
                icon: Users,
                color: 'from-purple-500 to-purple-600',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-600">{stat.label}</div>
                    <div className="text-lg font-bold text-gray-900">
                      {loading ? (
                        <div className="w-12 h-6 bg-gray-200 rounded animate-pulse" />
                      ) : (
                        stat.value
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Management Sections Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => router.push(section.path)}
                className="group cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${section.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <div className="text-2xl opacity-10 group-hover:opacity-20 transition-opacity">→</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{section.description}</p>
                <div className="flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                  Access <span className="ml-2">→</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* System Load Section */}
          {dashboard?.keyMetrics?.systemLoad && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                System Load
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'CPU', value: dashboard.keyMetrics.systemLoad.cpu, color: 'bg-blue-600' },
                  { label: 'Memory', value: dashboard.keyMetrics.systemLoad.memory, color: 'bg-yellow-600' },
                  { label: 'Disk', value: dashboard.keyMetrics.systemLoad.disk, color: 'bg-red-600' },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                      <span className="text-sm font-bold text-gray-900">{metric.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`${metric.color} h-2 rounded-full`}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Key Metrics Section */}
          {dashboard?.keyMetrics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                { label: 'Organizations', value: dashboard.keyMetrics.totalOrganizations, icon: Building2 },
                { label: 'Active Subscriptions', value: dashboard.keyMetrics.activeSubscriptions, icon: CheckCircle },
                { label: 'User Growth', value: `+${dashboard.keyMetrics.userGrowth}%`, icon: Users },
                { label: 'MRR', value: `₦${(dashboard.keyMetrics.monthlyRecurringRevenue / 1000000).toFixed(1)}M`, icon: BarChart3 },
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-slate-500 to-slate-600 text-white">
                      <metric.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-600">{metric.label}</div>
                      <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </RouteGuard>
  );
}
