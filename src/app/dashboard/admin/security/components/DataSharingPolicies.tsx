"use client";

import { useState } from "react";
import { DataSharingPolicy, Branch } from "@/lib/auth/types";

// Mock branches data
const mockBranches: Branch[] = [
  { id: "main", name: "Main Campus", location: "123 Main St, Cityville" },
  { id: "east", name: "East Side", location: "456 East Blvd, Cityville" },
  { id: "west", name: "West End", location: "789 West Ave, Cityville" },
  { id: "south", name: "South Chapel", location: "321 South Rd, Cityville" },
];

// Mock ministries data
const mockMinistries = [
  { id: "worship", name: "Worship Ministry" },
  { id: "children", name: "Children's Ministry" },
  { id: "youth", name: "Youth Ministry" },
  { id: "outreach", name: "Outreach & Missions" },
  { id: "admin", name: "Administration" },
];

// Mock roles data
const mockRoles = [
  { id: "super_admin", name: "Super Admin" },
  { id: "branch_admin", name: "Branch Admin" },
  { id: "pastor", name: "Pastor" },
  { id: "ministry_leader", name: "Ministry Leader" },
  { id: "staff", name: "Staff" },
];

// Mock resource types that can be shared
const resourceTypes = [
  { id: "member_data", name: "Member Information" },
  { id: "financial_data", name: "Financial Records" },
  { id: "event_data", name: "Events & Calendar" },
  { id: "ministry_data", name: "Ministry Resources" },
  { id: "attendance_data", name: "Attendance Records" },
  { id: "volunteer_data", name: "Volunteer Information" },
];

// Mock data sharing policies
const mockPolicies: DataSharingPolicy[] = [
  {
    id: "policy1",
    name: "Main to All - Limited Member Data",
    description: "Share limited member data from Main Campus to all branches",
    sourceType: "branch",
    sourceId: "main",
    targetType: "branch",
    targetId: "all",
    resourceType: "member_data",
    permissions: ["read"],
    active: true,
  },
  {
    id: "policy2",
    name: "East to West - Financial Data",
    description: "Share financial data between East Side and West End",
    sourceType: "branch",
    sourceId: "east",
    targetType: "branch",
    targetId: "west",
    resourceType: "financial_data",
    permissions: ["read"],
    active: true,
  },
  {
    id: "policy3",
    name: "Youth Ministry Cross-Branch",
    description: "Share Youth Ministry resources across all branches",
    sourceType: "ministry",
    sourceId: "youth",
    targetType: "ministry",
    targetId: "youth",
    resourceType: "ministry_data",
    permissions: ["read", "update"],
    active: true,
  },
  {
    id: "policy4",
    name: "Pastors Access to Attendance",
    description: "Allow pastors to view attendance data from all branches",
    sourceType: "branch",
    sourceId: "all",
    targetType: "role",
    targetId: "pastor",
    resourceType: "attendance_data",
    permissions: ["read"],
    active: true,
  },
  {
    id: "policy5",
    name: "Main to South - Full Access",
    description: "Share all data from Main Campus to South Chapel",
    sourceType: "branch",
    sourceId: "main",
    targetType: "branch",
    targetId: "south",
    resourceType: "all",
    permissions: ["read", "update", "delete"],
    active: false,
  },
];

export default function DataSharingPolicies() {
  const [policies, setPolicies] = useState<DataSharingPolicy[]>(mockPolicies);
  const [selectedPolicy, setSelectedPolicy] =
    useState<DataSharingPolicy | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Handler for selecting a policy
  const handleSelectPolicy = (policy: DataSharingPolicy) => {
    setSelectedPolicy(policy);
    setIsEditing(false);
    setIsCreating(false);
  };

  // Handler for editing a policy
  const handleEditPolicy = () => {
    setIsEditing(true);
    setIsCreating(false);
  };

  // Handler for creating a new policy
  const handleCreatePolicy = () => {
    setSelectedPolicy(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  // Handler for toggling policy active status
  const handleToggleActive = (policyId: string) => {
    const updatedPolicies = policies.map((policy) => {
      if (policy.id === policyId) {
        return { ...policy, active: !policy.active };
      }
      return policy;
    });
    setPolicies(updatedPolicies);

    if (selectedPolicy && selectedPolicy.id === policyId) {
      setSelectedPolicy({ ...selectedPolicy, active: !selectedPolicy.active });
    }
  };

  // Function to get entity name by id and type
  const getEntityName = (
    entityType: "branch" | "ministry" | "role",
    entityId: string,
  ): string => {
    if (entityId === "all") return "All";

    if (entityType === "branch") {
      return mockBranches.find((b) => b.id === entityId)?.name || entityId;
    } else if (entityType === "ministry") {
      return mockMinistries.find((m) => m.id === entityId)?.name || entityId;
    } else if (entityType === "role") {
      return mockRoles.find((r) => r.id === entityId)?.name || entityId;
    }

    return entityId;
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Data Sharing Policies
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure how data is shared between branches, ministries, and roles
        </p>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Policy list */}
        <div className="w-full lg:w-1/3 border-r border-gray-200">
          <ul className="divide-y divide-gray-200 overflow-auto max-h-96">
            {policies.map((policy) => (
              <li
                key={policy.id}
                className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${selectedPolicy?.id === policy.id ? "bg-indigo-50" : ""}`}
                onClick={() => handleSelectPolicy(policy)}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {policy.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {policy.description}
                    </p>
                    <div className="mt-1 text-xs text-gray-500">
                      <span>
                        {getEntityName(policy.sourceType, policy.sourceId)} →{" "}
                        {getEntityName(policy.targetType, policy.targetId)}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      policy.active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {policy.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="p-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCreatePolicy}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Policy
            </button>
          </div>
        </div>

        {/* Policy details */}
        <div className="w-full lg:w-2/3 p-4">
          {selectedPolicy ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  {selectedPolicy.name}
                </h4>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(selectedPolicy.id)}
                    className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm font-medium rounded ${
                      selectedPolicy.active
                        ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        : "border-transparent text-white bg-green-600 hover:bg-green-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {selectedPolicy.active ? "Deactivate" : "Activate"}
                  </button>

                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={handleEditPolicy}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit Policy
                    </button>
                  ) : (
                    <div className="space-x-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Policy details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Source
                  </h5>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Type
                        </label>
                        <select
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          defaultValue={selectedPolicy.sourceType}
                        >
                          <option value="branch">Branch</option>
                          <option value="ministry">Ministry</option>
                          <option value="role">Role</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Entity
                        </label>
                        <select
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          defaultValue={selectedPolicy.sourceId}
                        >
                          <option value="all">All</option>
                          {selectedPolicy.sourceType === "branch" &&
                            mockBranches.map((branch) => (
                              <option key={branch.id} value={branch.id}>
                                {branch.name}
                              </option>
                            ))}
                          {selectedPolicy.sourceType === "ministry" &&
                            mockMinistries.map((ministry) => (
                              <option key={ministry.id} value={ministry.id}>
                                {ministry.name}
                              </option>
                            ))}
                          {selectedPolicy.sourceType === "role" &&
                            mockRoles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-900">
                        {selectedPolicy.sourceType.charAt(0).toUpperCase() +
                          selectedPolicy.sourceType.slice(1)}
                        :{" "}
                        {getEntityName(
                          selectedPolicy.sourceType,
                          selectedPolicy.sourceId,
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Target
                  </h5>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Type
                        </label>
                        <select
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          defaultValue={selectedPolicy.targetType}
                        >
                          <option value="branch">Branch</option>
                          <option value="ministry">Ministry</option>
                          <option value="role">Role</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Entity
                        </label>
                        <select
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          defaultValue={selectedPolicy.targetId}
                        >
                          <option value="all">All</option>
                          {selectedPolicy.targetType === "branch" &&
                            mockBranches.map((branch) => (
                              <option key={branch.id} value={branch.id}>
                                {branch.name}
                              </option>
                            ))}
                          {selectedPolicy.targetType === "ministry" &&
                            mockMinistries.map((ministry) => (
                              <option key={ministry.id} value={ministry.id}>
                                {ministry.name}
                              </option>
                            ))}
                          {selectedPolicy.targetType === "role" &&
                            mockRoles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-900">
                        {selectedPolicy.targetType.charAt(0).toUpperCase() +
                          selectedPolicy.targetType.slice(1)}
                        :{" "}
                        {getEntityName(
                          selectedPolicy.targetType,
                          selectedPolicy.targetId,
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Shared Data & Permissions
                </h5>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Resource Type
                      </label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        defaultValue={selectedPolicy.resourceType}
                      >
                        <option value="all">All Resources</option>
                        {resourceTypes.map((resource) => (
                          <option key={resource.id} value={resource.id}>
                            {resource.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Permissions
                      </label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <input
                            id="permission-read"
                            name="permission-read"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            defaultChecked={selectedPolicy.permissions.includes(
                              "read",
                            )}
                          />
                          <label
                            htmlFor="permission-read"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Read
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="permission-update"
                            name="permission-update"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            defaultChecked={selectedPolicy.permissions.includes(
                              "update",
                            )}
                          />
                          <label
                            htmlFor="permission-update"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Update
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="permission-delete"
                            name="permission-delete"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            defaultChecked={selectedPolicy.permissions.includes(
                              "delete",
                            )}
                          />
                          <label
                            htmlFor="permission-delete"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Delete
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">Data Type:</span>{" "}
                      {selectedPolicy.resourceType === "all"
                        ? "All Resources"
                        : resourceTypes.find(
                            (r) => r.id === selectedPolicy.resourceType,
                          )?.name || selectedPolicy.resourceType}
                    </p>
                    <div className="mt-2">
                      <p className="text-sm text-gray-900 mb-1">
                        <span className="font-semibold">Allowed Actions:</span>
                      </p>
                      <div className="flex flex-wrap">
                        {selectedPolicy.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="mr-2 mb-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {permission.charAt(0).toUpperCase() +
                              permission.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Description
                </h5>
                {isEditing ? (
                  <textarea
                    rows={3}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultValue={selectedPolicy.description}
                  />
                ) : (
                  <p className="text-sm text-gray-600">
                    {selectedPolicy.description}
                  </p>
                )}
              </div>
            </div>
          ) : isCreating ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Create New Policy
                </h4>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Policy Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter policy name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Source Type
                    </label>
                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option value="branch">Branch</option>
                      <option value="ministry">Ministry</option>
                      <option value="role">Role</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Source Entity
                    </label>
                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option value="all">All</option>
                      {mockBranches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Target Type
                    </label>
                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option value="branch">Branch</option>
                      <option value="ministry">Ministry</option>
                      <option value="role">Role</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Target Entity
                    </label>
                    <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option value="all">All</option>
                      {mockBranches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Resource Type
                  </label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="all">All Resources</option>
                    {resourceTypes.map((resource) => (
                      <option key={resource.id} value={resource.id}>
                        {resource.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Permissions
                  </label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="new-permission-read"
                        name="new-permission-read"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        defaultChecked={true}
                      />
                      <label
                        htmlFor="new-permission-read"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Read
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="new-permission-update"
                        name="new-permission-update"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="new-permission-update"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Update
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="new-permission-delete"
                        name="new-permission-delete"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="new-permission-delete"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Delete
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Describe the purpose of this policy"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Policy
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">
                Select a policy to view details or create a new one
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
