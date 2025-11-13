'use client';

import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RouteGuard } from '@/components/RouteGuard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ChevronRight,
  AlertCircle,
  Mail,
  MapPin,
  Phone,
  Globe,
} from 'lucide-react';

const GET_ORGANIZATIONS_QUERY = gql`
  query GetOrganizations($skip: Int, $take: Int) {
    godModeOrganizations(skip: $skip, take: $take) {
      organizations {
        id
        name
        email
        phone
        city
        status
        createdAt
      }
      total
      skip
      take
    }
  }
`;

const CREATE_ORGANIZATION_MUTATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInputType!) {
    godModeCreateOrganization(input: $input) {
      id
      name
      email
      status
      createdAt
    }
  }
`;

const UPDATE_ORGANIZATION_MUTATION = gql`
  mutation UpdateOrganization($id: String!, $input: UpdateOrganizationInputType!) {
    godModeUpdateOrganization(id: $id, input: $input) {
      id
      name
      email
      status
      updatedAt
    }
  }
`;

const DELETE_ORGANIZATION_MUTATION = gql`
  mutation DeleteOrganization($id: String!) {
    godModeDeleteOrganization(id: $id)
  }
`;

export default function OrganizationsPage() {
  const router = useRouter();
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    country: '',
  });

  const { data, loading, refetch } = useQuery(GET_ORGANIZATIONS_QUERY, {
    variables: { skip, take },
  });

  const [createOrganization] = useMutation(CREATE_ORGANIZATION_MUTATION, {
    onCompleted: () => {
      toast.success('Organization created successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', city: '', address: '', country: '' });
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION_MUTATION, {
    onCompleted: () => {
      toast.success('Organization updated successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '', city: '', address: '', country: '' });
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [deleteOrganization] = useMutation(DELETE_ORGANIZATION_MUTATION, {
    onCompleted: () => {
      toast.success('Organization deleted successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
      setSelectedOrg(null);
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateOrganization({ variables: { id: editingId, input: formData } });
      } else {
        await createOrganization({ variables: { input: formData } });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      try {
        await deleteOrganization({ variables: { id } });
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const organizations = data?.godModeOrganizations?.organizations || [];
  const total = data?.godModeOrganizations?.total || 0;

  const filteredOrganizations = organizations.filter((org: any) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Organizations
                  </h1>
                  <p className="text-white/90 text-lg">Manage all organizations in the system</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {total} Total Organizations
                    </span>
                  </div>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setEditingId(null);
                    setFormData({ name: '', email: '', phone: '', city: '', address: '', country: '' });
                  }}
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Organization
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Organizations List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Organizations</h2>
                </div>

                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  ) : filteredOrganizations.length > 0 ? (
                    filteredOrganizations.map((org: any, index: number) => (
                      <motion.button
                        key={org.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedOrg(org)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedOrg?.id === org.id
                            ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{org.name}</div>
                            <div className="text-sm text-gray-600">{org.email}</div>
                          </div>
                          <ChevronRight
                            className={`h-5 w-5 transition-all ${
                              selectedOrg?.id === org.id ? 'text-indigo-600 rotate-90' : 'text-gray-400'
                            }`}
                          />
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations found</h3>
                      <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right: Details & Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Selected Organization Details */}
              {selectedOrg && !showForm && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Details</h3>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{selectedOrg.name}</div>
                          <div className="text-xs text-gray-600">Organization</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      {selectedOrg.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-600">Email</div>
                            <div className="text-sm font-medium text-gray-900">{selectedOrg.email}</div>
                          </div>
                        </div>
                      )}
                      {selectedOrg.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-600">Phone</div>
                            <div className="text-sm font-medium text-gray-900">{selectedOrg.phone}</div>
                          </div>
                        </div>
                      )}
                      {selectedOrg.city && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-600">Location</div>
                            <div className="text-sm font-medium text-gray-900">
                              {selectedOrg.city}
                              {selectedOrg.country && `, ${selectedOrg.country}`}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      {/* Manage Branches Button */}
                      <button
                        onClick={() => router.push(`/dashboard/god-mode/organizations/${selectedOrg.id}/branches`)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                      >
                        <Globe className="h-4 w-4" />
                        Manage Branches
                      </button>

                      {/* Edit and Delete Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(selectedOrg.id);
                            setFormData({
                              name: selectedOrg.name,
                              email: selectedOrg.email,
                              phone: selectedOrg.phone || '',
                              city: selectedOrg.city || '',
                              address: selectedOrg.address || '',
                              country: selectedOrg.country || '',
                            });
                            setShowForm(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(selectedOrg.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingId ? 'Edit Organization' : 'Create New Organization'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Organization Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          {editingId ? 'Update' : 'Create'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForm(false);
                            setEditingId(null);
                          }}
                          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
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
