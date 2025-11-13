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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    country: '',
  });

  const { data, loading, error, refetch } = useQuery(GET_ORGANIZATIONS_QUERY, {
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
    onError: (error) => {
      toast.error(`Failed: ${error.message}`);
    },
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
    onError: (error) => {
      toast.error(`Failed: ${error.message}`);
    },
  });

  const [deleteOrganization] = useMutation(DELETE_ORGANIZATION_MUTATION, {
    onCompleted: () => {
      toast.success('Organization deleted successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateOrganization({
          variables: {
            id: editingId,
            input: formData,
          },
        });
      } else {
        await createOrganization({
          variables: {
            input: formData,
          },
        });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      try {
        await deleteOrganization({
          variables: { id },
        });
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const organizations = data?.godModeOrganizations?.organizations || [];
  const total = data?.godModeOrganizations?.total || 0;

  return (
    <RouteGuard requiredRoles={['GOD_MODE', 'SYSTEM_ADMIN']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
                <p className="mt-2 text-gray-600">Manage all organizations in the system</p>
              </div>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData({ name: '', email: '', phone: '', city: '', address: '', country: '' });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + New Organization
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingId ? 'Edit Organization' : 'Create New Organization'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Organization Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Organizations Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {organizations.map((org: any) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {org.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{org.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{org.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          org.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {org.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(org.id);
                          setFormData({
                            name: org.name,
                            email: org.email,
                            phone: org.phone || '',
                            city: org.city || '',
                            address: org.address || '',
                            country: org.country || '',
                          });
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(org.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {skip + 1} to {Math.min(skip + take, total)} of {total} organizations
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSkip(Math.max(0, skip - take))}
                disabled={skip === 0}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setSkip(skip + take)}
                disabled={skip + take >= total}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
