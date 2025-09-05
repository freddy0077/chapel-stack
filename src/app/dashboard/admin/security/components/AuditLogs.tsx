"use client";

import { useState } from "react";
import { UserAuditEvent, Branch } from "@/lib/auth/types";

// Mock branches data
const mockBranches: Branch[] = [
  { id: "main", name: "Main Campus", location: "123 Main St, Cityville" },
  { id: "east", name: "East Side", location: "456 East Blvd, Cityville" },
  { id: "west", name: "West End", location: "789 West Ave, Cityville" },
  { id: "south", name: "South Chapel", location: "321 South Rd, Cityville" },
];

// Mock users for the audit logs
const mockUsers = [
  { id: "1", name: "Admin User" },
  { id: "2", name: "Branch Admin" },
  { id: "3", name: "Pastor Smith" },
  { id: "4", name: "East Branch Admin" },
  { id: "5", name: "Staff Member" },
];

// Mock audit log data
const mockAuditLogs: UserAuditEvent[] = [
  {
    id: "audit-1",
    userId: "1",
    action: "login",
    resource: "auth",
    resourceId: "",
    timestamp: new Date(2025, 3, 12, 14, 30, 0),
    metadata: { ipAddress: "192.168.1.100", browser: "Chrome" },
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0.0.0",
  },
  {
    id: "audit-2",
    userId: "1",
    action: "grant_access",
    resource: "user",
    resourceId: "5",
    branchId: "east",
    timestamp: new Date(2025, 3, 12, 14, 35, 0),
    metadata: { role: "staff", permissions: ["read"] },
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0.0.0",
  },
  {
    id: "audit-3",
    userId: "2",
    action: "view_sensitive",
    resource: "financial_data",
    resourceId: "budget-2025",
    branchId: "main",
    timestamp: new Date(2025, 3, 12, 15, 10, 0),
    metadata: { reportType: "budget", year: "2025" },
    ipAddress: "192.168.1.105",
    userAgent: "Firefox/115.0",
  },
  {
    id: "audit-4",
    userId: "3",
    action: "update",
    resource: "member",
    resourceId: "member-123",
    branchId: "main",
    timestamp: new Date(2025, 3, 12, 16, 5, 0),
    metadata: { fields: ["address", "phone"] },
    ipAddress: "192.168.1.110",
    userAgent: "Safari/17.0",
  },
  {
    id: "audit-5",
    userId: "4",
    action: "create",
    resource: "event",
    resourceId: "event-456",
    branchId: "east",
    timestamp: new Date(2025, 3, 12, 16, 45, 0),
    metadata: { eventType: "service", attendees: "expected:150" },
    ipAddress: "192.168.1.120",
    userAgent: "Edge/120.0.0.0",
  },
  {
    id: "audit-6",
    userId: "1",
    action: "change_setting",
    resource: "system",
    resourceId: "data_sharing",
    timestamp: new Date(2025, 3, 12, 17, 30, 0),
    metadata: { policy: "Main to All - Limited Member Data", status: "active" },
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0.0.0",
  },
  {
    id: "audit-7",
    userId: "5",
    action: "view_sensitive",
    resource: "member",
    resourceId: "member-456",
    branchId: "main",
    timestamp: new Date(2025, 3, 12, 18, 15, 0),
    metadata: { fields: ["financial", "pastoral_notes"] },
    ipAddress: "192.168.1.130",
    userAgent: "Chrome/120.0.0.0",
  },
  {
    id: "audit-8",
    userId: "1",
    action: "logout",
    resource: "auth",
    resourceId: "",
    timestamp: new Date(2025, 3, 12, 19, 0, 0),
    metadata: {},
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0.0.0",
  },
];

// Resource types for filtering
const resourceTypes = [
  { id: "all", name: "All Resources" },
  { id: "auth", name: "Authentication" },
  { id: "user", name: "User Management" },
  { id: "member", name: "Member Records" },
  { id: "financial_data", name: "Financial Data" },
  { id: "event", name: "Events" },
  { id: "system", name: "System Settings" },
];

// Action types for filtering
const actionTypes = [
  { id: "all", name: "All Actions" },
  { id: "login", name: "Login" },
  { id: "logout", name: "Logout" },
  { id: "create", name: "Create" },
  { id: "update", name: "Update" },
  { id: "delete", name: "Delete" },
  { id: "view_sensitive", name: "View Sensitive Data" },
  { id: "grant_access", name: "Grant Access" },
  { id: "revoke_access", name: "Revoke Access" },
  { id: "change_setting", name: "Change Setting" },
];

export default function AuditLogs() {
  const [logs] = useState<UserAuditEvent[]>(mockAuditLogs);
  const [selectedEvent, setSelectedEvent] = useState<UserAuditEvent | null>(
    null,
  );
  const [filters, setFilters] = useState({
    user: "all",
    branch: "all",
    resource: "all",
    action: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Apply filters to logs
  const filteredLogs = logs.filter((log) => {
    if (filters.user !== "all" && log.userId !== filters.user) return false;
    if (filters.branch !== "all" && log.branchId !== filters.branch)
      return false;
    if (filters.resource !== "all" && log.resource !== filters.resource)
      return false;
    if (filters.action !== "all" && log.action !== filters.action) return false;

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      if (log.timestamp < fromDate) return false;
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      if (log.timestamp > toDate) return false;
    }

    return true;
  });

  // Update filters
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Select an event to view details
  const handleSelectEvent = (event: UserAuditEvent) => {
    setSelectedEvent(event);
  };

  // Helper to get user name by ID
  const getUserName = (userId: string): string => {
    const user = mockUsers.find((u) => u.id === userId);
    return user ? user.name : userId;
  };

  // Helper to get branch name by ID
  const getBranchName = (branchId: string): string => {
    const branch = mockBranches.find((b) => b.id === branchId);
    return branch ? branch.name : branchId;
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Security Audit Log
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Track all security-related actions and sensitive data access
        </p>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User
            </label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filters.user}
              onChange={(e) => handleFilterChange("user", e.target.value)}
            >
              <option value="all">All Users</option>
              {mockUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Branch
            </label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filters.branch}
              onChange={(e) => handleFilterChange("branch", e.target.value)}
            >
              <option value="all">All Branches</option>
              {mockBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Resource Type
            </label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filters.resource}
              onChange={(e) => handleFilterChange("resource", e.target.value)}
            >
              {resourceTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Action
            </label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filters.action}
              onChange={(e) => handleFilterChange("action", e.target.value)}
            >
              {actionTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              To Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() =>
              setFilters({
                user: "all",
                branch: "all",
                resource: "all",
                action: "all",
                dateFrom: "",
                dateTo: "",
              })
            }
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Clear Filters
          </button>
          <button
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Export Logs
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Audit log list */}
        <div className="w-full lg:w-2/3 overflow-x-auto border-r border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Timestamp
                </th>
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
                  Action
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Resource
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Branch
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => handleSelectEvent(log)}
                    className={`cursor-pointer hover:bg-gray-50 ${selectedEvent?.id === log.id ? "bg-indigo-50" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getUserName(log.userId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.action === "view_sensitive" ||
                          log.action === "delete"
                            ? "bg-red-100 text-red-800"
                            : log.action === "login" || log.action === "logout"
                              ? "bg-blue-100 text-blue-800"
                              : log.action === "grant_access" ||
                                  log.action === "revoke_access"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                        }`}
                      >
                        {log.action.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.resource}
                      {log.resourceId && (
                        <span className="text-xs text-gray-400 ml-1">
                          ({log.resourceId.slice(0, 8)})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.branchId ? getBranchName(log.branchId) : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No audit logs match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Event details */}
        <div className="w-full lg:w-1/3 p-4">
          {selectedEvent ? (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Event Details
              </h4>

              <div className="bg-gray-50 p-4 rounded mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Event ID</p>
                    <p className="text-sm font-mono text-gray-900">
                      {selectedEvent.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Timestamp</p>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedEvent.timestamp)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">User</p>
                    <p className="text-sm text-gray-900">
                      {getUserName(selectedEvent.userId)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">IP Address</p>
                    <p className="text-sm text-gray-900">
                      {selectedEvent.ipAddress || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Action Information
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Action</p>
                    <p className="text-sm text-gray-900">
                      {selectedEvent.action.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Resource Type</p>
                    <p className="text-sm text-gray-900">
                      {selectedEvent.resource}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Resource ID</p>
                    <p className="text-sm text-gray-900">
                      {selectedEvent.resourceId || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Branch Context</p>
                    <p className="text-sm text-gray-900">
                      {selectedEvent.branchId
                        ? getBranchName(selectedEvent.branchId)
                        : "Organization-wide"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Additional Metadata
                </h5>
                {Object.keys(selectedEvent.metadata).length > 0 ? (
                  <div className="border border-gray-200 rounded-md bg-white overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                      <pre className="text-xs text-gray-800 overflow-auto max-h-56">
                        {JSON.stringify(selectedEvent.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No additional metadata
                  </p>
                )}
              </div>
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">
                Select an event to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
