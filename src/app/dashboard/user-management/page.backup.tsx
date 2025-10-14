"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS, GET_ALL_ROLES } from "@/graphql/queries/userManagementQueries";
import { CreateUserModal } from "./components/CreateUserModal";
import { EditUserModal } from "./components/EditUserModal";
import {
  ShieldCheckIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  CheckCircleIcon,
  EyeIcon,
  ArrowPathIcon,
  FunnelIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { RoleRoute } from "@/components/auth/RoleRoute";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  roles?: Array<{ id: string; name: string; description: string | null }>;
  userBranches?: Array<{
    userId: string;
    branchId: string;
    roleId: string;
    branch: { id: string; name: string };
    role: { id: string; name: string };
  }>;
}

export default function UsersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS, {
    variables: {
      pagination: {
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: rolesData } = useQuery(GET_ALL_ROLES);
  const allRoles = rolesData?.adminRoles || [];

  const users: User[] = data?.adminUsers?.items || [];
  const total = data?.adminUsers?.totalCount || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      user.email.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "All Status" ||
      (statusFilter === "Active" && user.isActive) ||
      (statusFilter === "Inactive" && !user.isActive);

    return matchesSearch && matchesStatus;
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSuccess = () => {
    refetch();
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const getAvatarColor = (email: string) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
    ];
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <RoleRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500">Manage system users and their roles</p>
              </div>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create User</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <FunnelIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
              >
                <option>All Roles</option>
                {allRoles.map((role: any) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FunnelIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {total} users
            </p>
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </p>
          </div>
        </div>

        {/* User Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading users...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-red-600 font-medium">Error loading users</p>
            <p className="text-gray-500 text-sm mt-2">{error.message}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 font-medium">No users found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 relative"
                >
                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4">
                    <CheckCircleIcon
                      className={`w-5 h-5 ${user.isActive ? "text-green-500" : "text-gray-300"}`}
                    />
                  </div>

                  {/* Avatar and Name */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div
                      className={`w-12 h-12 ${getAvatarColor(user.email)} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
                    >
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">System User</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                    <EnvelopeIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  {/* Roles */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Roles:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <span
                            key={role.id}
                            className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium"
                          >
                            {role.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No roles assigned</span>
                      )}
                    </div>
                  </div>

                  {/* Branches */}
                  {user.userBranches && user.userBranches.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Branches:</p>
                      <div className="space-y-1">
                        {user.userBranches.map((ub) => (
                          <div key={`${ub.userId}-${ub.branchId}-${ub.roleId}`} className="text-xs text-gray-600">
                            {ub.branch.name} ({ub.role.name})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Last Login */}
                  <div className="text-xs text-gray-500 mb-4">
                    Last login: {formatDate(user.lastLoginAt)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors flex-1 justify-center"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors flex-1 justify-center"
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Reset password for this user?")) {
                          // Handle reset password
                        }
                      }}
                      className="flex items-center space-x-1 px-3 py-1.5 text-orange-600 hover:bg-orange-50 rounded text-sm transition-colors flex-1 justify-center"
                    >
                      <ArrowPathIcon className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-sm p-4 mt-6 flex items-center justify-between">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Modals */}
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleSuccess}
        />
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSuccess={handleSuccess}
          user={selectedUser}
        />
      </div>
    </RoleRoute>
  );
}
