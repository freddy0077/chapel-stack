'use client';

import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { RouteGuard } from '@/components/RouteGuard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Key,
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronRight,
  AlertCircle,
  Copy,
  CheckCircle,
  XCircle,
  Calendar,
  Shield,
} from 'lucide-react';

const GET_LICENSES_QUERY = gql`
  query GetLicenses($skip: Int, $take: Int) {
    godModeLicenses(skip: $skip, take: $take) {
      licenses {
        id
        key
        type
        status
        expiresAt
        createdAt
        activatedAt
        maxUsers
        currentUsers
        features
      }
      total
      skip
      take
    }
  }
`;

const CREATE_LICENSE_MUTATION = gql`
  mutation CreateLicense($input: CreateLicenseInputType!) {
    godModeCreateLicense(input: $input) {
      id
      key
      type
      status
      expiresAt
      createdAt
    }
  }
`;

const UPDATE_LICENSE_MUTATION = gql`
  mutation UpdateLicense($id: String!, $input: UpdateLicenseInputType!) {
    godModeUpdateLicense(id: $id, input: $input) {
      id
      key
      type
      status
      expiresAt
      updatedAt
    }
  }
`;

const DELETE_LICENSE_MUTATION = gql`
  mutation DeleteLicense($id: String!) {
    godModeDeleteLicense(id: $id)
  }
`;

const ACTIVATE_LICENSE_MUTATION = gql`
  mutation ActivateLicense($id: String!) {
    godModeActivateLicense(id: $id) {
      id
      status
      activatedAt
    }
  }
`;

const DEACTIVATE_LICENSE_MUTATION = gql`
  mutation DeactivateLicense($id: String!) {
    godModeDeactivateLicense(id: $id) {
      id
      status
    }
  }
`;

export default function LicensesPage() {
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLicense, setSelectedLicense] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    type: 'STANDARD',
    maxUsers: 10,
    features: [] as string[],
    expiresAt: '',
  });

  const { data, loading, refetch } = useQuery(GET_LICENSES_QUERY, {
    variables: { skip, take },
  });

  const [createLicense] = useMutation(CREATE_LICENSE_MUTATION, {
    onCompleted: () => {
      toast.success('License created successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
      setShowForm(false);
      setFormData({ key: '', type: 'STANDARD', maxUsers: 10, features: [], expiresAt: '' });
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [updateLicense] = useMutation(UPDATE_LICENSE_MUTATION, {
    onCompleted: () => {
      toast.success('License updated successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
      setEditingId(null);
      setFormData({ key: '', type: 'STANDARD', maxUsers: 10, features: [], expiresAt: '' });
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [deleteLicense] = useMutation(DELETE_LICENSE_MUTATION, {
    onCompleted: () => {
      toast.success('License deleted successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
      setSelectedLicense(null);
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [activateLicense] = useMutation(ACTIVATE_LICENSE_MUTATION, {
    onCompleted: () => {
      toast.success('License activated!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [deactivateLicense] = useMutation(DEACTIVATE_LICENSE_MUTATION, {
    onCompleted: () => {
      toast.success('License deactivated!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateLicense({ variables: { id: editingId, input: formData } });
      } else {
        await createLicense({ variables: { input: formData } });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this license?')) {
      try {
        await deleteLicense({ variables: { id } });
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const licenses = data?.godModeLicenses?.licenses || [];
  const total = data?.godModeLicenses?.total || 0;

  const filteredLicenses = licenses.filter((license: any) =>
    license.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    license.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PREMIUM':
        return 'bg-purple-100 text-purple-800';
      case 'PROFESSIONAL':
        return 'bg-blue-100 text-blue-800';
      case 'STANDARD':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <RouteGuard requiredRoles={['GOD_MODE', 'SYSTEM_ADMIN']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-2xl mb-8"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Key className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Licenses
                  </h1>
                  <p className="text-white/90 text-lg">Manage system licenses and access control</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      {total} Total Licenses
                    </span>
                  </div>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setEditingId(null);
                    setFormData({ key: '', type: 'STANDARD', maxUsers: 10, features: [], expiresAt: '' });
                  }}
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New License
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Licenses List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Licenses</h2>
                </div>

                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search licenses..."
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
                  ) : filteredLicenses.length > 0 ? (
                    filteredLicenses.map((license: any, index: number) => (
                      <motion.button
                        key={license.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedLicense(license)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedLicense?.id === license.id
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
                            <Key className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{license.key}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(license.type)}`}>
                                {license.type}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(license.status)}`}>
                                {license.status}
                              </span>
                            </div>
                          </div>
                          <ChevronRight
                            className={`h-5 w-5 transition-transform ${
                              selectedLicense?.id === license.id ? 'text-blue-500' : 'text-gray-400'
                            }`}
                          />
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No licenses found</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right: License Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {selectedLicense && !showForm ? (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl border border-blue-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">License Details</h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">License Key</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="font-mono text-sm font-semibold text-gray-900 break-all">
                            {selectedLicense.key}
                          </p>
                          <button
                            onClick={() => handleCopyKey(selectedLicense.key)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            {copiedKey === selectedLicense.key ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Type</p>
                          <p className="font-semibold text-gray-900">{selectedLicense.type}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white">
                          {selectedLicense.status === 'ACTIVE' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className={`font-semibold ${selectedLicense.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedLicense.status}
                          </p>
                        </div>
                      </div>

                      {selectedLicense.maxUsers && (
                        <div>
                          <p className="text-sm text-gray-600">User Limit</p>
                          <p className="font-semibold text-gray-900">
                            {selectedLicense.currentUsers || 0} / {selectedLicense.maxUsers} users
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${((selectedLicense.currentUsers || 0) / selectedLicense.maxUsers) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {selectedLicense.expiresAt && (
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Expires</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(selectedLicense.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedLicense.activatedAt && (
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Activated</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(selectedLicense.activatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingId(selectedLicense.id);
                          setFormData({
                            key: selectedLicense.key,
                            type: selectedLicense.type,
                            maxUsers: selectedLicense.maxUsers || 10,
                            features: selectedLicense.features || [],
                            expiresAt: selectedLicense.expiresAt || '',
                          });
                          setShowForm(true);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(selectedLicense.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </motion.button>
                    </div>

                    {selectedLicense.status === 'ACTIVE' ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => deactivateLicense({ variables: { id: selectedLicense.id } })}
                        className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Deactivate
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => activateLicense({ variables: { id: selectedLicense.id } })}
                        className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Activate
                      </motion.button>
                    )}
                  </motion.div>
                ) : showForm ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingId ? 'Edit License' : 'Create License'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          License Key *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.key}
                          onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                          placeholder="XXXX-XXXX-XXXX-XXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type *
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="STANDARD">Standard</option>
                          <option value="PROFESSIONAL">Professional</option>
                          <option value="PREMIUM">Premium</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Users
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.maxUsers}
                          onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expires At
                        </label>
                        <input
                          type="date"
                          value={formData.expiresAt}
                          onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          {editingId ? 'Update' : 'Create'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForm(false);
                            setEditingId(null);
                            setFormData({ key: '', type: 'STANDARD', maxUsers: 10, features: [], expiresAt: '' });
                          }}
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
                    <p className="text-gray-500">Select a license to view details</p>
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
