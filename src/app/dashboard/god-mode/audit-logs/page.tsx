'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  ClipboardList,
  Download,
  Filter,
  Search,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { RouteGuard } from '@/components/RouteGuard';
import { AnimatePresence } from 'framer-motion';

const GET_AUDIT_LOGS_QUERY = gql`
  query GetAuditLogs($filter: AuditLogFilterInputType) {
    godModeAuditLogs(filter: $filter) {
      logs {
        id
        userId
        action
        entityType
        entityId
        description
        metadata
        ipAddress
        userAgent
        createdAt
      }
      total
      skip
      take
    }
  }
`;

const GET_AUDIT_STATISTICS_QUERY = gql`
  query {
    godModeAuditStatistics {
      totalLogs
      successfulActions
      failedActions
      successRate
      actionsByType
    }
  }
`;

const EXPORT_AUDIT_LOGS_MUTATION = gql`
  mutation ExportAuditLogs($filter: AuditLogFilterInputType, $format: String) {
    godModeExportAuditLogs(filter: $filter, format: $format)
  }
`;

export default function AuditLogsPage() {
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(20);
  const [filters, setFilters] = useState({
    action: '',
    entityType: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_AUDIT_LOGS_QUERY, {
    variables: {
      filter: {
        skip,
        take,
        action: filters.action || undefined,
        entityType: filters.entityType || undefined,
      },
    },
  });

  const { data: statsData, loading: statsLoading } = useQuery(GET_AUDIT_STATISTICS_QUERY);

  const [exportLogs] = useMutation(EXPORT_AUDIT_LOGS_MUTATION, {
    onCompleted: (data) => {
      const element = document.createElement('a');
      const file = new Blob([data.godModeExportAuditLogs], { type: 'text/csv' });
      element.href = URL.createObjectURL(file);
      element.download = `audit-logs-${new Date().toISOString()}.csv`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
  });

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      await exportLogs({
        variables: {
          filter: {
            skip,
            take: 10000,
            action: filters.action || undefined,
            entityType: filters.entityType || undefined,
          },
          format,
        },
      });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSkip(0);
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const logs = data?.godModeAuditLogs?.logs || [];
  const total = data?.godModeAuditLogs?.total || 0;
  const stats = statsData?.godModeAuditStatistics || {};

  return (
    <RouteGuard requiredRoles={['GOD_MODE', 'SYSTEM_ADMIN']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Modern Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 p-8 shadow-2xl mb-8"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Audit Logs
                </h1>
                <p className="text-white/90 text-lg">
                  View and track all system activities
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => handleExport('csv')}
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Export Logs
                </Button>
              </motion.div>
            </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Statistics */}
            {!statsLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Logs</p>
                      <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalLogs}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-100">
                      <ClipboardList className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Successful</p>
                      <p className="mt-2 text-3xl font-bold text-green-600">{stats.successfulActions}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Failed</p>
                      <p className="mt-2 text-3xl font-bold text-red-600">{stats.failedActions}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-100">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="mt-2 text-3xl font-bold text-blue-600">{stats.successRate}%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-100">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Export
              </h2>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Action
                    </label>
                    <select
                      value={filters.action}
                      onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Actions</option>
                      <option value="CREATE">Create</option>
                      <option value="UPDATE">Update</option>
                      <option value="DELETE">Delete</option>
                      <option value="LOGIN">Login</option>
                      <option value="LOGOUT">Logout</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entity Type
                    </label>
                    <select
                      value={filters.entityType}
                      onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="User">User</option>
                      <option value="Organization">Organization</option>
                      <option value="Role">Role</option>
                      <option value="Permission">Permission</option>
                      <option value="Settings">Settings</option>
                    </select>
                  </div>

                  
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport('csv')}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    Export CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport('json')}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    Export JSON
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Audit Logs Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden"
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entity Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entity ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log.entityType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log.entityId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log.description || '-'}
                      </td>
                
    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="mt-6 flex justify-between items-center px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {skip + 1} to {Math.min(skip + take, total)} of {total} logs
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSkip(Math.max(0, skip - take))}
                    disabled={skip === 0}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all font-medium"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setSkip(skip + take)}
                    disabled={skip + take >= total}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
