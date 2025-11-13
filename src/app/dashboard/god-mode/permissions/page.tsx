'use client';

import { useState } from 'react';
import { RouteGuard } from '@/components/RouteGuard';

// Mock permissions data
const mockPermissions = [
  {
    id: '1',
    name: 'MANAGE_USERS',
    displayName: 'Manage Users',
    description: 'Create, update, and delete users',
    category: 'User Management',
    roles: ['GOD_MODE', 'SYSTEM_ADMIN', 'ADMIN'],
  },
  {
    id: '2',
    name: 'MANAGE_ROLES',
    displayName: 'Manage Roles',
    description: 'Create, update, and delete roles',
    category: 'Role Management',
    roles: ['GOD_MODE', 'SYSTEM_ADMIN'],
  },
  {
    id: '3',
    name: 'MANAGE_PERMISSIONS',
    displayName: 'Manage Permissions',
    description: 'Assign and revoke permissions',
    category: 'Permission Management',
    roles: ['GOD_MODE', 'SYSTEM_ADMIN'],
  },
  {
    id: '4',
    name: 'MANAGE_ORGANIZATIONS',
    displayName: 'Manage Organizations',
    description: 'Create, update, and delete organizations',
    category: 'Organization Management',
    roles: ['GOD_MODE', 'SYSTEM_ADMIN'],
  },
  {
    id: '5',
    name: 'VIEW_AUDIT_LOGS',
    displayName: 'View Audit Logs',
    description: 'View system audit logs',
    category: 'Audit',
    roles: ['GOD_MODE', 'SYSTEM_ADMIN', 'ADMIN'],
  },
  {
    id: '6',
    name: 'MANAGE_SETTINGS',
    displayName: 'Manage Settings',
    description: 'Manage system settings',
    category: 'Settings',
    roles: ['GOD_MODE', 'SYSTEM_ADMIN'],
  },
  {
    id: '7',
    name: 'MANAGE_FINANCES',
    displayName: 'Manage Finances',
    description: 'Manage financial records',
    category: 'Finance',
    roles: ['GOD_MODE', 'SYSTEM_ADMIN', 'ADMIN', 'BRANCH_ADMIN'],
  },
  {
    id: '8',
    name: 'VIEW_REPORTS',
    displayName: 'View Reports',
    description: 'View system reports',
    category: 'Reporting',
    roles: ['GOD_MODE', 'SYSTEM_ADMIN', 'ADMIN'],
  },
];

const categories = ['User Management', 'Role Management', 'Permission Management', 'Organization Management', 'Audit', 'Settings', 'Finance', 'Reporting'];

export default function PermissionsPage() {
  const [selectedCategory, setSelectedCategory] = useState('User Management');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPermissions = mockPermissions.filter((perm) => {
    const matchesCategory = perm.category === selectedCategory;
    const matchesSearch = perm.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perm.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <RouteGuard requiredRoles={['GOD_MODE', 'SYSTEM_ADMIN']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Permissions</h1>
            <p className="mt-2 text-gray-600">Manage system permissions and role assignments</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Permissions
                </label>
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Permissions Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPermissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{permission.displayName}</p>
                        <p className="text-xs text-gray-500 font-mono">{permission.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {permission.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {permission.roles.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        Assign Roles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Permission Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Permissions
              </h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">{mockPermissions.length}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Categories
              </h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">{categories.length}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                System Roles
              </h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">4</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Custom Roles
              </h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
