'use client';

import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { RouteGuard } from '@/components/RouteGuard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Database,
  Plus,
  Search,
  Download,
  Trash2,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  HardDrive,
  RotateCcw,
} from 'lucide-react';

const GET_BACKUPS_QUERY = gql`
  query GetBackups($skip: Int, $take: Int) {
    godModeBackups(skip: $skip, take: $take) {
      backups {
        id
        name
        type
        status
        size
        createdAt
        completedAt
        retentionDays
        isAutomatic
        description
      }
      total
      skip
      take
    }
  }
`;

const GET_BACKUP_STATS_QUERY = gql`
  query GetBackupStats {
    godModeBackupStats {
      totalBackups
      totalSize
      lastBackupDate
      nextScheduledBackup
      storageUsed
      storageQuota
    }
  }
`;

const CREATE_BACKUP_MUTATION = gql`
  mutation CreateBackup($input: CreateBackupInputType!) {
    godModeCreateBackup(input: $input) {
      id
      name
      type
      status
      size
      createdAt
    }
  }
`;

const DELETE_BACKUP_MUTATION = gql`
  mutation DeleteBackup($id: String!) {
    godModeDeleteBackup(id: $id)
  }
`;

const RESTORE_BACKUP_MUTATION = gql`
  mutation RestoreBackup($id: String!) {
    godModeRestoreBackup(id: $id) {
      id
      status
      completedAt
    }
  }
`;

const DOWNLOAD_BACKUP_MUTATION = gql`
  mutation DownloadBackup($id: String!) {
    godModeDownloadBackup(id: $id)
  }
`;

export default function BackupsPage() {
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBackup, setSelectedBackup] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'FULL',
    description: '',
    retentionDays: 30,
  });

  const { data, loading, refetch } = useQuery(GET_BACKUPS_QUERY, {
    variables: { skip, take },
  });

  const { data: statsData } = useQuery(GET_BACKUP_STATS_QUERY);

  const [createBackup] = useMutation(CREATE_BACKUP_MUTATION, {
    onCompleted: () => {
      toast.success('Backup created successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
      setShowForm(false);
      setFormData({ name: '', type: 'FULL', description: '', retentionDays: 30 });
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [deleteBackup] = useMutation(DELETE_BACKUP_MUTATION, {
    onCompleted: () => {
      toast.success('Backup deleted successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
      setSelectedBackup(null);
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [restoreBackup] = useMutation(RESTORE_BACKUP_MUTATION, {
    onCompleted: () => {
      toast.success('Backup restore started!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [downloadBackup] = useMutation(DOWNLOAD_BACKUP_MUTATION, {
    onCompleted: () => {
      toast.success('Backup download started!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBackup({ variables: { input: formData } });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this backup?')) {
      try {
        await deleteBackup({ variables: { id } });
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const handleRestore = async (id: string) => {
    if (confirm('This will restore the system to this backup. Continue?')) {
      try {
        await restoreBackup({ variables: { id } });
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const handleDownload = async (id: string) => {
    try {
      await downloadBackup({ variables: { id } });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const backups = data?.godModeBackups?.backups || [];
  const total = data?.godModeBackups?.total || 0;
  const stats = statsData?.godModeBackupStats || {};

  const filteredBackups = backups.filter((backup: any) =>
    backup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    backup.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'FULL':
        return 'bg-purple-100 text-purple-800';
      case 'INCREMENTAL':
        return 'bg-blue-100 text-blue-800';
      case 'DIFFERENTIAL':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <RouteGuard requiredRoles={['GOD_MODE', 'SYSTEM_ADMIN']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 p-8 shadow-2xl mb-8"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Backups</h1>
                  <p className="text-white/90 text-lg">Manage system backups and recovery</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <Database className="h-4 w-4" />
                      {total} Total Backups
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="h-4 w-4" />
                      {formatSize(stats.totalSize || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setFormData({ name: '', type: 'FULL', description: '', retentionDays: 30 });
                  }}
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Backup
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Backups</p>
                  <p className="text-2xl font-bold text-gray-900">{total}</p>
                </div>
                <Database className="h-8 w-8 text-blue-600 opacity-20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Size</p>
                  <p className="text-2xl font-bold text-gray-900">{formatSize(stats.totalSize || 0)}</p>
                </div>
                <HardDrive className="h-8 w-8 text-cyan-600 opacity-20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Backup</p>
                  <p className="text-lg font-bold text-gray-900">
                    {stats.lastBackupDate ? new Date(stats.lastBackupDate).toLocaleDateString() : 'Never'}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-teal-600 opacity-20" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Storage Used</p>
                  <p className="text-lg font-bold text-gray-900">
                    {Math.round(((stats.storageUsed || 0) / (stats.storageQuota || 1)) * 100)}%
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-20" />
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Backups List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Backups</h2>

                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search backups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-3">
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                            <div className="flex-1">
                              <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
                              <div className="w-48 h-3 bg-gray-200 rounded" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredBackups.length > 0 ? (
                    filteredBackups.map((backup: any, index: number) => (
                      <motion.button
                        key={backup.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedBackup(backup)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedBackup?.id === backup.id
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg">
                            <Database className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{backup.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(backup.type)}`}>
                                {backup.type}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(backup.status)}`}>
                                {backup.status}
                              </span>
                              <span className="text-xs text-gray-600">{formatSize(backup.size)}</span>
                            </div>
                          </div>
                          <ChevronRight
                            className={`h-5 w-5 transition-transform ${
                              selectedBackup?.id === backup.id ? 'text-blue-500' : 'text-gray-400'
                            }`}
                          />
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No backups found</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right: Details/Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {selectedBackup && !showForm ? (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-xl border border-blue-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold text-gray-900">{selectedBackup.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="font-semibold text-gray-900">{selectedBackup.status}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-semibold text-gray-900">{selectedBackup.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Size</p>
                        <p className="font-semibold text-gray-900">{formatSize(selectedBackup.size)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(selectedBackup.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-6">
                      <button
                        onClick={() => handleRestore(selectedBackup.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Restore
                      </button>
                      <button
                        onClick={() => handleDownload(selectedBackup.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(selectedBackup.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ) : showForm ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Backup</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Backup name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="FULL">Full</option>
                          <option value="INCREMENTAL">Incremental</option>
                          <option value="DIFFERENTIAL">Differential</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Retention (days) *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={formData.retentionDays}
                          onChange={(e) => setFormData({ ...formData, retentionDays: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Create
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 text-center"
                  >
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a backup to view details</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
