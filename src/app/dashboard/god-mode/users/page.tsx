'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  UsersIcon,
  Plus,
  Edit2,
  Trash2,
  Key,
  Search,
} from 'lucide-react';
import { RouteGuard } from '@/components/RouteGuard';

const GET_USERS_QUERY = gql`
  query GetUsers($skip: Int, $take: Int) {
    godModeUsers(skip: $skip, take: $take) {
      users {
        id
        email
        name
        role
        status
        createdAt
        lastLogin
      }
      total
      skip
      take
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInputType!) {
    godModeCreateUser(input: $input) {
      id
      email
      name
      role
      status
      createdAt
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInputType!) {
    godModeUpdateUser(id: $id, input: $input) {
      id
      email
      name
      role
      status
      updatedAt
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: String!) {
    godModeDeleteUser(id: $id)
  }
`;

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($userId: String!, $newPassword: String!) {
    godModeResetUserPassword(userId: $userId, newPassword: $newPassword)
  }
`;

export default function UsersPage() {
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'ADMIN',
    status: 'active',
  });

  const { data, loading, error, refetch } = useQuery(GET_USERS_QUERY, {
    variables: { skip, take },
  });

  const [createUser] = useMutation(CREATE_USER_MUTATION, {
    onCompleted: () => {
      refetch();
      setShowForm(false);
      setFormData({ email: '', name: '', password: '', role: 'ADMIN', status: 'active' });
    },
  });

  const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      refetch();
      setEditingId(null);
      setFormData({ email: '', name: '', password: '', role: 'ADMIN', status: 'active' });
    },
  });

  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: () => {
      refetch();
    },
  });

  const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION, {
    onCompleted: () => {
      alert('Password reset successfully');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { password, ...updateData } = formData;
        await updateUser({
          variables: {
            id: editingId,
            input: updateData,
          },
        });
      } else {
        await createUser({
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
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser({
          variables: { id },
        });
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const handleResetPassword = async (userId: string) => {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
      try {
        await resetPassword({
          variables: { userId, newPassword },
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

  const users = data?.godModeUsers?.users || [];
  const total = data?.godModeUsers?.total || 0;

  return (
    <RouteGuard requiredRoles={['GOD_MODE', 'SYSTEM_ADMIN']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Modern Header */}
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
                  <UsersIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    User Management
                  </h1>
                  <p className="text-white/90 text-lg">
                    Manage all users in the system
                  </p>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
                    setShowForm(true);
                    setEditingId(null);
                    setFormData({ email: '', name: '', password: '', role: 'ADMIN', status: 'active' });
                  }}
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New User
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-6">
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingId ? 'Edit User' : 'Create New User'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {!editingId && (
                      <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    )}
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="GOD_MODE">God Mode</option>
                      <option value="SYSTEM_ADMIN">System Admin</option>
                      <option value="ADMIN">Admin</option>
                      <option value="BRANCH_ADMIN">Branch Admin</option>
                    </select>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                    >
                      {editingId ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden"
            >
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
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(user.id);
                          setFormData({
                            email: user.email,
                            name: user.name,
                            password: '',
                            role: user.role,
                            status: user.status,
                          });
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleResetPassword(user.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Reset Password
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

              {/* Pagination */}
              <div className="mt-6 flex justify-between items-center px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {skip + 1} to {Math.min(skip + take, total)} of {total} users
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
