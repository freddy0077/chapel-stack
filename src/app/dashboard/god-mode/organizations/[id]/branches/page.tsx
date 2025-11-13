'use client';

import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { RouteGuard } from '@/components/RouteGuard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronRight,
  AlertCircle,
  Mail,
  Phone,
  Globe,
  Calendar,
} from 'lucide-react';

const GET_BRANCHES_QUERY = gql`
  query GetBranches($organisationId: String!, $skip: Int, $take: Int) {
    godModeBranches(organisationId: $organisationId, skip: $skip, take: $take) {
      branches {
        id
        name
        email
        phone
        city
        state
        country
        address
        website
        isActive
        createdAt
      }
      total
      skip
      take
    }
  }
`;

const CREATE_BRANCH_MUTATION = gql`
  mutation CreateBranch($input: CreateBranchInputType!) {
    godModeCreateBranch(input: $input) {
      id
      name
      email
      city
      isActive
      createdAt
    }
  }
`;

const UPDATE_BRANCH_MUTATION = gql`
  mutation UpdateBranch($id: String!, $input: UpdateBranchInputType!) {
    godModeUpdateBranch(id: $id, input: $input) {
      id
      name
      email
      city
      isActive
      updatedAt
    }
  }
`;

const DELETE_BRANCH_MUTATION = gql`
  mutation DeleteBranch($id: String!) {
    godModeDeleteBranch(id: $id)
  }
`;

export default function BranchesPage() {
  const params = useParams();
  const organisationId = params.id as string;

  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    organisationId,
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    address: '',
    website: '',
    isActive: true,
  });

  const { data, loading, refetch } = useQuery(GET_BRANCHES_QUERY, {
    variables: { organisationId, skip, take },
  });

  const [createBranch] = useMutation(CREATE_BRANCH_MUTATION, {
    onCompleted: () => {
      toast.success('Branch created successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
      setShowForm(false);
      setFormData({
        organisationId,
        name: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        country: '',
        address: '',
        website: '',
        isActive: true,
      });
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [updateBranch] = useMutation(UPDATE_BRANCH_MUTATION, {
    onCompleted: () => {
      toast.success('Branch updated successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
      setEditingId(null);
      setFormData({
        organisationId,
        name: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        country: '',
        address: '',
        website: '',
        isActive: true,
      });
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [deleteBranch] = useMutation(DELETE_BRANCH_MUTATION, {
    onCompleted: () => {
      toast.success('Branch deleted successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
      setSelectedBranch(null);
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { organisationId: _, ...updateData } = formData;
        await updateBranch({ variables: { id: editingId, input: updateData } });
      } else {
        await createBranch({ variables: { input: formData } });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      try {
        await deleteBranch({ variables: { id } });
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const branches = data?.godModeBranches?.branches || [];
  const total = data?.godModeBranches?.total || 0;

  const filteredBranches = branches.filter((branch: any) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RouteGuard requiredRoles={['GOD_MODE', 'SYSTEM_ADMIN']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 shadow-2xl mb-8"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Branches
                  </h1>
                  <p className="text-white/90 text-lg">Manage all branches for this organization</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {total} Total Branches
                    </span>
                  </div>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setEditingId(null);
                    setFormData({
                      organisationId,
                      name: '',
                      email: '',
                      phone: '',
                      city: '',
                      state: '',
                      country: '',
                      address: '',
                      website: '',
                      isActive: true,
                    });
                  }}
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Branch
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Branches List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Branches</h2>
                </div>

                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search branches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  ) : filteredBranches.length > 0 ? (
                    filteredBranches.map((branch: any, index: number) => (
                      <motion.button
                        key={branch.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedBranch(branch)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedBranch?.id === branch.id
                            ? 'border-green-500 bg-green-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{branch.name}</div>
                            <div className="text-sm text-gray-600">{branch.city || 'No city'}</div>
                          </div>
                          <ChevronRight
                            className={`h-5 w-5 transition-transform ${
                              selectedBranch?.id === branch.id ? 'text-green-500' : 'text-gray-400'
                            }`}
                          />
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No branches found</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right: Branch Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {selectedBranch && !showForm ? (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl border border-green-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Branch Details</h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold text-gray-900">{selectedBranch.name}</p>
                      </div>

                      {selectedBranch.email && (
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-semibold text-gray-900">{selectedBranch.email}</p>
                          </div>
                        </div>
                      )}

                      {selectedBranch.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-semibold text-gray-900">{selectedBranch.phone}</p>
                          </div>
                        </div>
                      )}

                      {selectedBranch.city && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-semibold text-gray-900">
                              {selectedBranch.city}
                              {selectedBranch.state && `, ${selectedBranch.state}`}
                              {selectedBranch.country && `, ${selectedBranch.country}`}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedBranch.website && (
                        <div className="flex items-start gap-3">
                          <Globe className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Website</p>
                            <p className="font-semibold text-gray-900">{selectedBranch.website}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            selectedBranch.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <span className="text-sm font-semibold text-gray-900">
                          {selectedBranch.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                        <Calendar className="h-4 w-4" />
                        Created {new Date(selectedBranch.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingId(selectedBranch.id);
                          setFormData({
                            organisationId,
                            name: selectedBranch.name,
                            email: selectedBranch.email || '',
                            phone: selectedBranch.phone || '',
                            city: selectedBranch.city || '',
                            state: selectedBranch.state || '',
                            country: selectedBranch.country || '',
                            address: selectedBranch.address || '',
                            website: selectedBranch.website || '',
                            isActive: selectedBranch.isActive,
                          });
                          setShowForm(true);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(selectedBranch.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </motion.button>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingId ? 'Edit Branch' : 'Create Branch'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Branch name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="branch@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="State"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Country"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Street address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="rounded"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                          Active
                        </label>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          {editingId ? 'Update' : 'Create'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForm(false);
                            setEditingId(null);
                            setFormData({
                              organisationId,
                              name: '',
                              email: '',
                              phone: '',
                              city: '',
                              state: '',
                              country: '',
                              address: '',
                              website: '',
                              isActive: true,
                            });
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
                    <p className="text-gray-500">Select a branch to view details</p>
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
