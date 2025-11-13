'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { RouteGuard } from '@/components/RouteGuard';
import {
  Lock,
  Users,
  Plus,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PERMISSIONS, GET_ROLES } from '@/graphql/queries/roleSystemQueries';
import { GOD_MODE_ASSIGN_PERMISSION_TO_ROLE } from '@/graphql/mutations/permissionMutations';

interface PermissionData {
  id: string;
  action: string;
  subject: string;
  description?: string;
  category: string;
  isSystem: boolean;
}

interface RoleData {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  level: number;
  isSystem: boolean;
}

/**
 * Modern Permission Assignment Page - Centered, Beautiful Design
 */
export default function PermissionAssignmentPage() {
  const [selectedPermission, setSelectedPermission] = useState<PermissionData | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Fetch permissions
  const { data, loading: permissionsLoading, error: permissionsError } = useQuery(GET_PERMISSIONS);
  const permissions = data?.getPermissions || [];

  // Fetch roles
  const { data: rolesData, loading: rolesLoading } = useQuery(GET_ROLES);
  const roles = rolesData?.getRoles || [];

  // Assign permission mutation
  const [assignPermission, { loading: assigningPermission }] = useMutation(
    GOD_MODE_ASSIGN_PERMISSION_TO_ROLE,
    {
      onCompleted: (data) => {
        toast.success(
          `Permission "${selectedPermission?.action}" assigned to role "${selectedRole?.displayName || selectedRole?.name}"`,
          {
            icon: '✅',
            style: {
              borderRadius: '10px',
              background: '#10B981',
              color: '#fff',
            },
          }
        );
        setSelectedRole(null);
        setShowRoleModal(false);
      },
      onError: (error) => {
        toast.error(`Failed to assign permission: ${error.message}`);
      },
    }
  );

  // Log errors for debugging
  useEffect(() => {
    if (permissionsError) {
      console.error('[Permission Assignment] Query error:', permissionsError);
    }
  }, [permissionsError]);

  const handleSelectPermission = useCallback((permission: PermissionData) => {
    setSelectedPermission(permission);
  }, []);

  const handleSelectRole = useCallback((role: RoleData) => {
    setSelectedRole(role);
  }, []);

  const handleAssignPermission = useCallback(() => {
    if (!selectedPermission) {
      toast.error('Please select a permission first');
      return;
    }
    if (!selectedRole) {
      toast.error('Please select a role first');
      return;
    }

    assignPermission({
      variables: {
        roleId: selectedRole.id,
        permissionId: selectedPermission.id,
      },
    });
  }, [selectedPermission, selectedRole, assignPermission]);

  const categories = Array.from(new Set(permissions.map((p: PermissionData) => p.category)));

  const filteredPermissions = permissions.filter((permission: PermissionData) =>
    (permission.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!categoryFilter || permission.category === categoryFilter)
  );

  const categoryColors: Record<string, string> = {
    members: 'from-blue-500 to-blue-600',
    finances: 'from-green-500 to-green-600',
    attendance: 'from-purple-500 to-purple-600',
    communications: 'from-pink-500 to-pink-600',
    administration: 'from-amber-500 to-amber-600',
    pastoral: 'from-red-500 to-red-600',
  };

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
                <Lock className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Permission Assignment
                </h1>
                <p className="text-white/90 text-lg">
                  Manage and assign system permissions to roles
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    {permissions.length} Total Permissions
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {categories.length} Categories
                  </span>
                </div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowRoleModal(true)}
                disabled={!selectedPermission}
                size="lg"
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                <Plus className="h-5 w-5 mr-2" />
                Assign to Role
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Permission Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat: string) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Permissions List */}
              <div className="space-y-3">
                {permissionsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
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
                ) : filteredPermissions.length > 0 ? (
                  filteredPermissions.map((permission: PermissionData, index: number) => (
                    <motion.button
                      key={permission.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelectPermission(permission)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedPermission?.id === permission.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-r ${
                            categoryColors[permission.category] || 'from-gray-500 to-gray-600'
                          } text-white shadow-lg`}
                        >
                          <Shield className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {permission.action} {permission.subject}
                          </div>
                          <div className="text-sm text-gray-600">
                            {permission.description || permission.category}
                          </div>
                        </div>
                        <ChevronRight
                          className={`h-5 w-5 transition-all ${
                            selectedPermission?.id === permission.id
                              ? 'text-blue-600 rotate-90'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No permissions found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: Permission Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Selected Permission Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Details</h3>

              {selectedPermission ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${
                          categoryColors[selectedPermission.category] || 'from-gray-500 to-gray-600'
                        } text-white`}
                      >
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {selectedPermission.action}
                        </div>
                        <div className="text-xs text-gray-600">{selectedPermission.subject}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      {selectedPermission.description || 'No description available'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">Category</span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {selectedPermission.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">System Permission</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedPermission.isSystem
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {selectedPermission.isSystem ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowRoleModal(true)}
                    className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                    disabled={assigningPermission}
                  >
                    <Lock className="h-4 w-4 inline mr-2" />
                    {assigningPermission ? 'Assigning...' : 'Assign This Permission'}
                  </motion.button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lock className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-600">
                    Select a permission to view details and assign it to roles
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Total Permissions</span>
                  <span className="text-2xl font-bold text-blue-600">{permissions.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Categories</span>
                  <span className="text-2xl font-bold text-cyan-600">{categories.length}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Role Selection Modal */}
      <AnimatePresence>
        {showRoleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRoleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                <h2 className="text-2xl font-bold">Select Role</h2>
                <p className="text-white/90 mt-1">
                  Assign permission "{selectedPermission?.action}" to a role
                </p>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Search Input */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search roles by name..."
                    value={roleSearchTerm}
                    onChange={(e) => setRoleSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Roles List */}
                <div className="space-y-3">
                  {rolesLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
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
                  ) : roles
                      .filter((role: RoleData) =>
                        role.name.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
                        role.displayName?.toLowerCase().includes(roleSearchTerm.toLowerCase())
                      )
                      .map((role: RoleData) => (
                        <motion.button
                          key={role.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectRole(role)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedRole?.id === role.id
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white flex items-center justify-center font-bold">
                              {role.name[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">
                                {role.displayName || role.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {role.description || 'No description'}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignPermission}
                  disabled={!selectedRole || assigningPermission}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {assigningPermission ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </RouteGuard>
  );
}
