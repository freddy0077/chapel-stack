"use client";

import { useState, useEffect } from "react";
import {
  LockClosedIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";

// Types
interface Branch {
  id: string;
  name: string;
  location: string;
  region: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  branchId: string;
  avatar?: string;
}

interface BranchAccess {
  branchId: string;
  permissionLevel: "none" | "read" | "write" | "admin";
}

interface AccessRole {
  id: string;
  name: string;
  description: string;
  defaultPermissionLevel: "none" | "read" | "write" | "admin";
}

interface UserWithAccess extends User {
  branchAccess: BranchAccess[];
}

// Mock data
const mockBranches: Branch[] = [
  {
    id: "b1",
    name: "Main Campus",
    location: "123 Main St, Cityville",
    region: "North",
  },
  {
    id: "b2",
    name: "East Side",
    location: "456 East Blvd, Cityville",
    region: "East",
  },
  {
    id: "b3",
    name: "West End",
    location: "789 West Ave, Cityville",
    region: "West",
  },
  {
    id: "b4",
    name: "South Chapel",
    location: "321 South Rd, Cityville",
    region: "South",
  },
  {
    id: "b5",
    name: "Downtown",
    location: "555 Center St, Cityville",
    region: "Central",
  },
];

const mockAccessRoles: AccessRole[] = [
  {
    id: "role1",
    name: "Administrator",
    description: "Full access to all sacramental records across all branches",
    defaultPermissionLevel: "admin",
  },
  {
    id: "role2",
    name: "Branch Manager",
    description: "Full access to branch records, read-only for other branches",
    defaultPermissionLevel: "write",
  },
  {
    id: "role3",
    name: "Record Keeper",
    description: "Can create and edit records for their branch only",
    defaultPermissionLevel: "write",
  },
  {
    id: "role4",
    name: "Viewer",
    description: "Read-only access to records",
    defaultPermissionLevel: "read",
  },
  {
    id: "role5",
    name: "No Access",
    description: "No access to sacramental records",
    defaultPermissionLevel: "none",
  },
];

const mockUsers: UserWithAccess[] = [
  {
    id: "u1",
    name: "John Smith",
    email: "john.smith@church.org",
    role: "Administrator",
    branchId: "b1",
    branchAccess: [
      { branchId: "b1", permissionLevel: "admin" },
      { branchId: "b2", permissionLevel: "admin" },
      { branchId: "b3", permissionLevel: "admin" },
      { branchId: "b4", permissionLevel: "admin" },
      { branchId: "b5", permissionLevel: "admin" },
    ],
  },
  {
    id: "u2",
    name: "Maria Garcia",
    email: "maria.garcia@church.org",
    role: "Branch Manager",
    branchId: "b2",
    branchAccess: [
      { branchId: "b1", permissionLevel: "read" },
      { branchId: "b2", permissionLevel: "admin" },
      { branchId: "b3", permissionLevel: "read" },
      { branchId: "b4", permissionLevel: "read" },
      { branchId: "b5", permissionLevel: "read" },
    ],
  },
  {
    id: "u3",
    name: "David Johnson",
    email: "david.johnson@church.org",
    role: "Record Keeper",
    branchId: "b3",
    branchAccess: [
      { branchId: "b1", permissionLevel: "none" },
      { branchId: "b2", permissionLevel: "none" },
      { branchId: "b3", permissionLevel: "write" },
      { branchId: "b4", permissionLevel: "none" },
      { branchId: "b5", permissionLevel: "none" },
    ],
  },
  {
    id: "u4",
    name: "Sarah Williams",
    email: "sarah.williams@church.org",
    role: "Viewer",
    branchId: "b1",
    branchAccess: [
      { branchId: "b1", permissionLevel: "read" },
      { branchId: "b2", permissionLevel: "read" },
      { branchId: "b3", permissionLevel: "read" },
      { branchId: "b4", permissionLevel: "read" },
      { branchId: "b5", permissionLevel: "read" },
    ],
  },
];

interface BranchAccessControlsProps {
  selectedRecordType?:
    | "baptism"
    | "communion"
    | "confirmation"
    | "marriage"
    | "all";
}

const BranchAccessControls: React.FC<BranchAccessControlsProps> = ({
  selectedRecordType = "all",
}) => {
  const [branches] = useState<Branch[]>(mockBranches);
  const [accessRoles] = useState<AccessRole[]>(mockAccessRoles);
  const [users, setUsers] = useState<UserWithAccess[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] =
    useState<UserWithAccess[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<UserWithAccess | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [editedUserAccess, setEditedUserAccess] = useState<BranchAccess[]>([]);

  // Filter users whenever search query or filters change
  useEffect(() => {
    let result = users;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query),
      );
    }

    // Apply role filter
    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Apply branch filter
    if (branchFilter) {
      result = result.filter(
        (user) =>
          user.branchId === branchFilter ||
          user.branchAccess.some(
            (access) =>
              access.branchId === branchFilter &&
              access.permissionLevel !== "none",
          ),
      );
    }

    setFilteredUsers(result);
  }, [users, searchQuery, roleFilter, branchFilter]);

  // Open edit modal for a user
  const handleEditUser = (user: UserWithAccess) => {
    setSelectedUser(user);
    setEditedUserAccess([...user.branchAccess]);
    setIsEditModalOpen(true);
  };

  // Update a user's access to a specific branch
  const handleUpdateAccess = (
    branchId: string,
    permissionLevel: "none" | "read" | "write" | "admin",
  ) => {
    if (!selectedUser) return;

    setEditedUserAccess((prev) => {
      return prev.map((access) => {
        if (access.branchId === branchId) {
          return { ...access, permissionLevel };
        }
        return access;
      });
    });
  };

  // Apply a role's default permissions to all branches
  const handleApplyRole = (roleId: string) => {
    const role = accessRoles.find((r) => r.id === roleId);
    if (!role) return;

    setEditedUserAccess((prev) => {
      return prev.map((access) => {
        return { ...access, permissionLevel: role.defaultPermissionLevel };
      });
    });
  };

  // Save changes to user access
  const handleSaveChanges = () => {
    if (!selectedUser) return;

    setIsSaving(true);

    // Simulate API call to save changes
    setTimeout(() => {
      // Update users array with new access settings
      setUsers((prev) => {
        return prev.map((user) => {
          if (user.id === selectedUser.id) {
            return { ...user, branchAccess: editedUserAccess };
          }
          return user;
        });
      });

      setIsSaving(false);
      setIsEditModalOpen(false);
      setSelectedUser(null);
    }, 1000);
  };

  // Get label for permission level
  const getPermissionLabel = (level: "none" | "read" | "write" | "admin") => {
    switch (level) {
      case "none":
        return "No Access";
      case "read":
        return "Read Only";
      case "write":
        return "Create & Edit";
      case "admin":
        return "Full Access";
    }
  };

  // Get color classes for permission level badge
  const getPermissionColor = (level: "none" | "read" | "write" | "admin") => {
    switch (level) {
      case "none":
        return "bg-gray-100 text-gray-800";
      case "read":
        return "bg-blue-100 text-blue-800";
      case "write":
        return "bg-green-100 text-green-800";
      case "admin":
        return "bg-purple-100 text-purple-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Sacramental Records Access Controls
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage who can access and modify sacramental records across
              different branches
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <LockClosedIcon className="h-5 w-5" />
            <span>Centralized access management</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search users..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="role-filter" className="sr-only">
              Filter by Role
            </label>
            <select
              id="role-filter"
              name="role-filter"
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              {accessRoles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="branch-filter" className="sr-only">
              Filter by Branch
            </label>
            <select
              id="branch-filter"
              name="branch-filter"
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* User list */}
      <div className="overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Primary Branch
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Access Level
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <UserGroupIcon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No users found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try a different search term or filter.
                  </p>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <span className="text-gray-500 font-medium">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {branches.find((b) => b.id === user.branchId)?.name ||
                        "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {user.branchAccess
                        .filter((access) => access.permissionLevel !== "none")
                        .slice(0, 2)
                        .map((access) => {
                          const branch = branches.find(
                            (b) => b.id === access.branchId,
                          );
                          return (
                            <span
                              key={access.branchId}
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPermissionColor(access.permissionLevel)}`}
                            >
                              {branch?.name}:{" "}
                              {getPermissionLabel(access.permissionLevel)}
                            </span>
                          );
                        })}

                      {user.branchAccess.filter(
                        (access) => access.permissionLevel !== "none",
                      ).length > 2 && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          +
                          {user.branchAccess.filter(
                            (access) => access.permissionLevel !== "none",
                          ).length - 2}{" "}
                          more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit Access
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Access Modal */}
      <Transition.Root show={isEditModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsEditModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                  {selectedUser && (
                    <>
                      <div>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                          <ShieldCheckIcon
                            className="h-6 w-6 text-indigo-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 text-center sm:mt-5">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            Edit Branch Access for {selectedUser.name}
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Configure which branches this user can access and
                              their permission level for each
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quick access templates */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            Apply access template
                          </h4>
                          <div className="relative z-0 inline-flex shadow-sm rounded-md">
                            {accessRoles.map((role) => (
                              <button
                                key={role.id}
                                type="button"
                                className="relative inline-flex items-center px-3 py-1.5 text-xs font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 first:rounded-l-md last:rounded-r-md -ml-px first:ml-0"
                                onClick={() => handleApplyRole(role.id)}
                              >
                                {role.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Branch access configuration */}
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">
                          Branch permissions for{" "}
                          {selectedRecordType === "all"
                            ? "all records"
                            : `${selectedRecordType} records`}
                        </h4>

                        <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Branch
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Permission
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {editedUserAccess.map((access) => {
                                const branch = branches.find(
                                  (b) => b.id === access.branchId,
                                );
                                return (
                                  <tr key={access.branchId}>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      <div className="flex items-center">
                                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        {branch?.name}
                                        {branch?.id ===
                                          selectedUser.branchId && (
                                          <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800">
                                            Primary
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <select
                                        value={access.permissionLevel}
                                        onChange={(e) =>
                                          handleUpdateAccess(
                                            access.branchId,
                                            e.target.value as
                                              | "none"
                                              | "read"
                                              | "write"
                                              | "admin",
                                          )
                                        }
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                      >
                                        <option value="none">No Access</option>
                                        <option value="read">Read Only</option>
                                        <option value="write">
                                          Create & Edit
                                        </option>
                                        <option value="admin">
                                          Full Access
                                        </option>
                                      </select>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4">
                          <div className="rounded-md bg-yellow-50 p-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-yellow-400"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                  Access control notice
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                  <p>
                                    Changes to access permissions will take
                                    effect immediately. Users with &quot;Full
                                    Access&quot; permission can further delegate
                                    access to others for their branch.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                          onClick={handleSaveChanges}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={() => setIsEditModalOpen(false)}
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default BranchAccessControls;
