"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  UPDATE_USER_ACTIVE_STATUS,
  ASSIGN_ROLE_TO_USER,
  REMOVE_ROLE_FROM_USER,
  ASSIGN_BRANCH_ROLE_TO_USER,
  REMOVE_BRANCH_ROLE_FROM_USER,
} from "@/graphql/mutations/userManagementMutations";
import { GET_ALL_ROLES, GET_BRANCHES } from "@/graphql/queries/userManagementQueries";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { XMarkIcon, PlusIcon, TrashIcon, ShieldCheckIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  roles?: Array<{ id: string; name: string }>;
  userBranches?: Array<{
    userId: string;
    branchId: string;
    roleId: string;
    branch: { id: string; name: string };
    role: { id: string; name: string };
  }>;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

// Roles that Branch Admins can manage
const MANAGEABLE_ROLE_NAMES = ['MEMBER', 'FINANCE', 'PASTORAL', 'BRANCH_ADMIN'];

export function EditUserModal({ isOpen, onClose, onSuccess, user }: EditUserModalProps) {
  const { organisationId } = useOrganisationBranch();
  const [isActive, setIsActive] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  const { data: rolesData } = useQuery(GET_ALL_ROLES);
  const { data: branchesData } = useQuery(GET_BRANCHES, {
    variables: { organisationId },
    skip: !organisationId,
  });

  // Filter to only manageable roles
  const manageableRoles = rolesData?.adminRoles?.filter((role: any) =>
    MANAGEABLE_ROLE_NAMES.includes(role.name)
  ) || [];

  useEffect(() => {
    if (user) {
      setIsActive(user.isActive);
    }
  }, [user]);

  const [updateActiveStatus] = useMutation(UPDATE_USER_ACTIVE_STATUS, {
    onCompleted: () => {
      toast.success("User status updated successfully!");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user status");
    },
    refetchQueries: ["GetAllUsers"],
  });

  const [assignRole] = useMutation(ASSIGN_ROLE_TO_USER, {
    onCompleted: () => {
      toast.success("Role assigned successfully!");
      setSelectedRoleId("");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign role");
    },
    refetchQueries: ["GetAllUsers", "GetUserById"],
  });

  const [removeRole] = useMutation(REMOVE_ROLE_FROM_USER, {
    onCompleted: () => {
      toast.success("Role removed successfully!");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove role");
    },
    refetchQueries: ["GetAllUsers", "GetUserById"],
  });

  const [assignBranchRole] = useMutation(ASSIGN_BRANCH_ROLE_TO_USER, {
    onCompleted: () => {
      toast.success("Branch role assigned successfully!");
      setSelectedRoleId("");
      setSelectedBranchId("");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign branch role");
    },
    refetchQueries: ["GetAllUsers", "GetUserById"],
  });

  const [removeBranchRole] = useMutation(REMOVE_BRANCH_ROLE_FROM_USER, {
    onCompleted: () => {
      toast.success("Branch role removed successfully!");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove branch role");
    },
    refetchQueries: ["GetAllUsers", "GetUserById"],
  });

  const handleUpdateStatus = async () => {
    if (!user) return;
    await updateActiveStatus({
      variables: {
        id: user.id,
        isActive,
      },
    });
  };

  const handleAssignRole = async () => {
    if (!user || !selectedRoleId) {
      toast.error("Please select a role");
      return;
    }

    await assignRole({
      variables: {
        userId: user.id,
        roleId: selectedRoleId,
      },
    });
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!user) return;

    if (confirm("Are you sure you want to remove this role?")) {
      await removeRole({
        variables: {
          userId: user.id,
          roleId,
        },
      });
    }
  };

  const handleAssignBranchRole = async () => {
    if (!user || !selectedRoleId || !selectedBranchId) {
      toast.error("Please select both a role and a branch");
      return;
    }

    await assignBranchRole({
      variables: {
        userId: user.id,
        branchId: selectedBranchId,
        roleId: selectedRoleId,
      },
    });
  };

  const handleRemoveBranchRole = async (branchId: string, roleId: string) => {
    if (!user) return;

    if (confirm("Are you sure you want to remove this branch role?")) {
      await removeBranchRole({
        variables: {
          userId: user.id,
          branchId,
          roleId,
        },
      });
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Edit User</h2>
                  <p className="text-blue-100 text-sm mt-0.5">
                    {user.firstName} {user.lastName} • {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Active Status */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Account Status</h3>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Active Status</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isActive ? "User can access the system" : "User is blocked from accessing the system"}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <button
                    onClick={handleUpdateStatus}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>

            {/* System Roles */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">System Roles</h3>
              </div>

              {/* Current Roles */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Current Roles:</p>
                <div className="flex flex-wrap gap-2">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <div
                        key={role.id}
                        className="group flex items-center space-x-2 bg-white border border-orange-200 px-3 py-2 rounded-lg text-sm hover:border-orange-300 transition-all"
                      >
                        <span className="font-medium text-gray-900">{role.name}</span>
                        <button
                          onClick={() => handleRemoveRole(role.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-600 hover:bg-red-50 rounded p-1 transition-all"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No system roles assigned</p>
                  )}
                </div>
              </div>

              {/* Assign New Role */}
              <div className="flex items-end space-x-3 bg-white rounded-lg p-4 border border-orange-200">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign New Role
                  </label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select a role</option>
                    {manageableRoles.map((role: any) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAssignRole}
                  disabled={!selectedRoleId}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium shadow-md hover:shadow-lg"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Assign</span>
                </button>
              </div>
            </div>

            {/* Branch Roles */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Branch Roles</h3>
              </div>

              {/* Current Branch Roles */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Current Branch Assignments:</p>
                <div className="space-y-2">
                  {user.userBranches && user.userBranches.length > 0 ? (
                    user.userBranches.map((userBranch) => (
                      <div
                        key={`${userBranch.userId}-${userBranch.branchId}-${userBranch.roleId}`}
                        className="group flex items-center justify-between bg-white p-4 rounded-lg border border-purple-200 hover:border-purple-300 transition-all"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{userBranch.branch.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{userBranch.role.name}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveBranchRole(userBranch.branchId, userBranch.role.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No branch roles assigned</p>
                  )}
                </div>
              </div>

              {/* Assign New Branch Role */}
              <div className="bg-white rounded-lg p-4 border border-purple-200 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Branch
                    </label>
                    <select
                      value={selectedBranchId}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      <option value="">Select a branch</option>
                      {branchesData?.branches?.map((branch: any) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Role
                    </label>
                    <select
                      value={selectedRoleId}
                      onChange={(e) => setSelectedRoleId(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      <option value="">Select a role</option>
                      {manageableRoles.map((role: any) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleAssignBranchRole}
                  disabled={!selectedRoleId || !selectedBranchId}
                  className="w-full px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium shadow-md hover:shadow-lg"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Assign Branch Role</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-8 py-4 rounded-b-2xl border-t border-gray-200 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-all shadow-sm hover:shadow"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
