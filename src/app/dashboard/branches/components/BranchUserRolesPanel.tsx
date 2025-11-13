"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_BRANCH_USERS } from "@/graphql/queries/branchQueries";
import {
  ASSIGN_USER_ROLE,
  REMOVE_USER_ROLE,
  ADD_USER_TO_BRANCH,
} from "@/graphql/mutations/userMutations";
import { USERS_QUERY } from "@/graphql/queries/user";
import { usePermissions } from "@/hooks/usePermissions";
import toast from "react-hot-toast";

// Define types
interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

interface BranchUserRolesPanelProps {
  branchId: string;
  onCreateUser?: () => void;
  shouldRefetchUsers?: boolean;
  onRefetchComplete?: () => void;
}

export default function BranchUserRolesPanel({
  branchId,
  onCreateUser,
  shouldRefetchUsers,
  onRefetchComplete,
}: BranchUserRolesPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState("MEMBER");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserSearchTerm, setNewUserSearchTerm] = useState("");
  const [selectedNewUser, setSelectedNewUser] = useState<any>(null);
  const [selectedNewUserRole, setSelectedNewUserRole] = useState("MEMBER");
  const [newUser, setNewUser] = useState<any>(null);
  const { isSuperAdmin, isBranchAdmin } = usePermissions();

  // Fetch branch users
  const { loading, error, data, refetch } = useQuery(GET_BRANCH_USERS, {
    variables: { branchId },
    skip: !branchId,
    fetchPolicy: "cache-and-network",
  });

  // Fetch all users for the add user modal
  const { loading: loadingAllUsers, data: allUsersData } = useQuery(
    USERS_QUERY,
    {
      variables: { pagination: { take: 50 } },
      skip: !showAddUserModal,
    },
  );

  // Mutations
  const [assignUserRole, { loading: assigningRole }] =
    useMutation(ASSIGN_USER_ROLE);
  const [removeUserRole, { loading: removingRole }] =
    useMutation(REMOVE_USER_ROLE);
  const [addUserToBranch, { loading: addingUser }] =
    useMutation(ADD_USER_TO_BRANCH);

  // Update users when data changes
  useEffect(() => {
    if (data?.branchUsers) {
      setUsers(data.branchUsers);
    }
  }, [data]);

  // Refetch users when shouldRefetchUsers changes to true
  useEffect(() => {
    if (shouldRefetchUsers) {
      refetch().then(() => {
        if (onRefetchComplete) {
          onRefetchComplete();
        }
      });
    }
  }, [shouldRefetchUsers, refetch, onRefetchComplete]);

  // Filter users based on search term and exclude users with SUBSCRIPTION_MANAGER role
  const filteredUsers = users.filter(
    (user) =>
      !user.roles.includes("SUBSCRIPTION_MANAGER") && // Exclude subscription manager users
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Filter all users for the add user modal (also exclude subscription managers)
  const allUsers = allUsersData?.users?.items || [];
  const filteredAllUsers = allUsers.filter(
    (user) =>
      !users.some((branchUser) => branchUser.id === user.id) && // Only show users not already in the branch
      !user.roles?.includes("SUBSCRIPTION_MANAGER") && // Exclude subscription manager users
      (user.firstName
        ?.toLowerCase()
        .includes(newUserSearchTerm.toLowerCase()) ||
        user.lastName
          ?.toLowerCase()
          .includes(newUserSearchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(newUserSearchTerm.toLowerCase())),
  );

  // Handle role assignment
  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error("Please select a user and role");
      return;
    }

    try {
      await assignUserRole({
        variables: {
          userId: selectedUser.id,
          branchId,
          role: selectedRole,
        },
      });
      toast.success(`Role ${selectedRole} assigned to ${selectedUser.name}`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to assign role");
    }
  };

  // Handle adding a user to branch with role
  const handleAddUserToBranch = async () => {
    if (!selectedNewUser || !selectedNewUserRole) {
      toast.error("Please select a user and role");
      return;
    }

    try {
      await addUserToBranch({
        variables: {
          userId: selectedNewUser.id,
          branchId,
          role: selectedNewUserRole,
        },
      });
      toast.success(`User added to branch with role ${selectedNewUserRole}`);
      setShowAddUserModal(false);
      setSelectedNewUser(null);
      setNewUserSearchTerm("");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to add user to branch");
    }
  };

  // Handle role removal
  const handleRemoveRole = async (userId: string, role: string) => {
    try {
      await removeUserRole({
        variables: {
          userId,
          branchId,
          role,
        },
      });
      toast.success(`Role ${role} removed`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove role");
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "MODERATOR":
        return "bg-blue-100 text-blue-800";
      case "MEMBER":
        return "bg-yellow-100 text-yellow-800";
      case "BRANCH_ADMIN":
        return "bg-green-100 text-green-800";
      case "FINANCE":
        return "bg-orange-100 text-orange-800";
      case "PASTORAL":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading users: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          User Role Management
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Assign and manage user roles for this branch
        </p>
      </div>

      {/* Search and Add Role Section */}
      {(isSuperAdmin || isBranchAdmin) && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Manage Existing Branch Users
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={onCreateUser}
                className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                Create New User
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Search Users
              </label>
              <input
                type="text"
                id="search"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <label
                htmlFor="user"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Select User
              </label>
              <select
                id="user"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                value={selectedUser?.id || ""}
                onChange={(e) => {
                  const user = users.find((u) => u.id === e.target.value);
                  setSelectedUser(user || null);
                }}
              >
                <option value="">Select a user</option>
                {filteredUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || `${user.firstName} ${user.lastName}`} (
                    {user.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Select Role
              </label>
              <div className="flex space-x-2">
                <select
                  id="role"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="MEMBER">Member</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="BRANCH_ADMIN">Branch Admin</option>
                  <option value="FINANCE">Finance</option>
                  <option value="PASTORAL">Pastoral</option>
                  {isSuperAdmin && <option value="ADMIN">Admin</option>}
                </select>
                <button
                  onClick={handleAssignRole}
                  disabled={!selectedUser || assigningRole}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {assigningRole ? "Assigning..." : "Assign"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Roles
              </th>
              {(isSuperAdmin || isBranchAdmin) && (
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {user.name
                            ? user.name[0]
                            : `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name || `${user.firstName} ${user.lastName}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.length === 0 ? (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          No roles
                        </span>
                      ) : (
                        user.roles.map((role) => (
                          <span
                            key={role}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(role)}`}
                          >
                            {role}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  {(isSuperAdmin || isBranchAdmin) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {user.roles.map((role) => (
                          <button
                            key={role}
                            onClick={() => handleRemoveRole(user.id, role)}
                            disabled={removingRole}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-xs"
                          >
                            Remove {role}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add User to Branch
                </h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label
                  htmlFor="newUserSearch"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Search Users
                </label>
                <input
                  type="text"
                  id="newUserSearch"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                  placeholder="Search by name or email"
                  value={newUserSearchTerm}
                  onChange={(e) => setNewUserSearchTerm(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="newUser"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Select User
                </label>
                <select
                  id="newUser"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                  value={selectedNewUser?.id || ""}
                  onChange={(e) => {
                    const user = allUsers.find((u) => u.id === e.target.value);
                    setSelectedNewUser(user || null);
                  }}
                >
                  <option value="">Select a user</option>
                  {filteredAllUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="newUserRole"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Select Role
                </label>
                <select
                  id="newUserRole"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                  value={selectedNewUserRole}
                  onChange={(e) => setSelectedNewUserRole(e.target.value)}
                >
                  <option value="MEMBER">Member</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="BRANCH_ADMIN">Branch Admin</option>
                  <option value="FINANCE">Finance</option>
                  <option value="PASTORAL">Pastoral</option>
                  {isSuperAdmin && <option value="ADMIN">Admin</option>}
                </select>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUserToBranch}
                  disabled={!selectedNewUser || addingUser || loadingAllUsers}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {addingUser ? "Adding..." : "Add User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
