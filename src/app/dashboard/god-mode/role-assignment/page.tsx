'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { RouteGuard } from '@/components/RouteGuard';
import {
  ShieldCheck,
  Users,
  Sparkles,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Lock,
  Unlock,
  AlertCircle,
} from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ROLES } from '@/graphql/queries/roleSystemQueries';
import { ASSIGN_ROLE_TO_USER } from '@/graphql/mutations/assignRoleMutations';
import { GET_ALL_USERS } from '@/graphql/queries/userManagementQueries';

interface RoleData {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  icon?: string;
  color?: string;
  level: number;
  isSystem: boolean;
}

interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Modern Role Assignment Page - Centered, Beautiful Design
 * Inspired by Birth Registry page layout
 */
export default function RoleAssignmentPage() {
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Fetch roles
  const { data, loading: rolesLoading, error: rolesError } = useQuery(GET_ROLES);
  const roles = data?.getRoles || [];

  // Fetch users
  const { data: usersData, loading: usersLoading } = useQuery(GET_ALL_USERS, {
    variables: {
      pagination: { skip: 0, take: 100 },
    },
  });
  const users = usersData?.adminUsers?.items || [];

  // Assign role mutation
  const [assignRole, { loading: assigningRole }] = useMutation(ASSIGN_ROLE_TO_USER, {
    onCompleted: (data) => {
      toast.success(
        `Role "${selectedRole?.displayName || selectedRole?.name}" assigned to ${selectedUser?.email}`,
        {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#10B981',
            color: '#fff',
          },
        }
      );
      setSelectedUser(null);
      setShowUserModal(false);
    },
    onError: (error) => {
      toast.error(`Failed to assign role: ${error.message}`);
    },
  });

  // Log errors for debugging
  useEffect(() => {
    if (rolesError) {
      console.error('[Role Assignment] Query error:', rolesError);
    }
  }, [rolesError]);

  const handleSelectRole = useCallback((role: RoleData) => {
    setSelectedRole(role);
  }, []);

  const handleSelectUser = useCallback((user: UserData) => {
    setSelectedUser(user);
  }, []);

  const handleAssignRole = useCallback(() => {
    if (!selectedRole) {
      toast.error('Please select a role first');
      return;
    }
    if (!selectedUser) {
      toast.error('Please select a user first');
      return;
    }

    assignRole({
      variables: {
        userId: selectedUser.id,
        roleId: selectedRole.id,
      },
    });
  }, [selectedRole, selectedUser, assignRole]);

  const filteredRoles = roles.filter((role: RoleData) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleColors: Record<string, string> = {
    GOD_MODE: 'from-red-500 to-red-600',
    SYSTEM_ADMIN: 'from-purple-500 to-purple-600',
    ADMIN: 'from-blue-500 to-blue-600',
    BRANCH_ADMIN: 'from-indigo-500 to-indigo-600',
    FINANCE_MANAGER: 'from-green-500 to-green-600',
    PASTORAL_STAFF: 'from-amber-500 to-amber-600',
    MINISTRY_LEADER: 'from-pink-500 to-pink-600',
    MEMBER: 'from-cyan-500 to-cyan-600',
  };

  return (
    <RouteGuard requiredRoles={['GOD_MODE', 'SYSTEM_ADMIN']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Modern Header with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl mb-8"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Role Assignment
                </h1>
                <p className="text-white/90 text-lg">
                  Manage and assign system roles to users
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" />
                    {roles.length} Available Roles
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    System Management
                  </span>
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setShowUserModal(true)}
                disabled={!selectedRole}
                size="lg"
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                <Plus className="h-5 w-5 mr-2" />
                Assign to User
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content - Centered Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Role Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              {/* Search and Filter */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Available Roles</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    showFilters
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Search Input */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search roles by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Roles Grid */}
              <div className="space-y-3">
                {rolesLoading ? (
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
                ) : filteredRoles.length > 0 ? (
                  filteredRoles.map((role: RoleData, index: number) => (
                    <motion.button
                      key={role.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelectRole(role)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedRole?.id === role.id
                          ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-r ${
                            roleColors[role.name] || 'from-gray-500 to-gray-600'
                          } text-white shadow-lg`}
                        >
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {role.displayName || role.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {role.description || 'No description'}
                          </div>
                        </div>
                        <ChevronRight
                          className={`h-5 w-5 transition-all ${
                            selectedRole?.id === role.id
                              ? 'text-indigo-600 rotate-90'
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
                      No roles found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: Role Details & Assignment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Selected Role Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Details</h3>

              {selectedRole ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${
                          roleColors[selectedRole.name] || 'from-gray-500 to-gray-600'
                        } text-white`}
                      >
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {selectedRole.displayName || selectedRole.name}
                        </div>
                        <div className="text-xs text-gray-600">Level {selectedRole.level}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      {selectedRole.description || 'No description available'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">System Role</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedRole.isSystem
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {selectedRole.isSystem ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserModal(true)}
                    className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                    disabled={assigningRole}
                  >
                    <Unlock className="h-4 w-4 inline mr-2" />
                    {assigningRole ? 'Assigning...' : 'Assign This Role'}
                  </motion.button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShieldCheck className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-600">
                    Select a role to view details and assign it to users
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Total Roles</span>
                  <span className="text-2xl font-bold text-indigo-600">{roles.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">System Roles</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {roles.filter((r: RoleData) => r.isSystem).length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        </div>

        {/* User Selection Modal */}
        <AnimatePresence>
          {showUserModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowUserModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                  <h2 className="text-2xl font-bold">Select User</h2>
                  <p className="text-white/90 mt-1">
                    Assign "{selectedRole?.displayName || selectedRole?.name}" role to a user
                  </p>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Search Input */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users by email..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Users List */}
                  <div className="space-y-3">
                    {usersLoading ? (
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
                    ) : users
                        .filter((user: UserData) =>
                          user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                        )
                        .map((user: UserData) => (
                          <motion.button
                            key={user.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectUser(user)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                              selectedUser?.id === user.id
                                ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
                                {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900">
                                  {user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.email}
                                </div>
                                <div className="text-sm text-gray-600">{user.email}</div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignRole}
                    disabled={!selectedUser || assigningRole}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {assigningRole ? 'Assigning...' : 'Confirm Assignment'}
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
