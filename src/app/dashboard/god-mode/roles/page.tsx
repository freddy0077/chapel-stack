'use client';

import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { RouteGuard } from '@/components/RouteGuard';

// Placeholder queries and mutations for role management
const GET_ROLES_QUERY = `
  query {
    godModeRoles {
      id
      name
      displayName
      description
      level
      isSystem
      permissionCount
      userCount
      createdAt
    }
  }
`;

const CREATE_ROLE_MUTATION = `
  mutation CreateRole($input: CreateRoleInputType!) {
    godModeCreateRole(input: $input) {
      id
      name
      displayName
      description
      level
      isSystem
      createdAt
    }
  }
`;

const UPDATE_ROLE_MUTATION = `
  mutation UpdateRole($id: String!, $input: UpdateRoleInputType!) {
    godModeUpdateRole(id: $id, input: $input) {
      id
      name
      displayName
      description
      level
      updatedAt
    }
  }
`;

const DELETE_ROLE_MUTATION = `
  mutation DeleteRole($id: String!) {
    godModeDeleteRole(id: $id)
  }
`;

export default function RolesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    level: 3,
  });

  // Mock data for demonstration
  const mockRoles = [
    {
      id: '1',
      name: 'GOD_MODE',
      displayName: 'God Mode',
      description: 'Complete system control',
      level: 1,
      isSystem: true,
      permissionCount: 150,
      userCount: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'SYSTEM_ADMIN',
      displayName: 'System Administrator',
      description: 'System administration',
      level: 1,
      isSystem: true,
      permissionCount: 120,
      userCount: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'ADMIN',
      displayName: 'Administrator',
      description: 'Organization-level administration',
      level: 3,
      isSystem: true,
      permissionCount: 80,
      userCount: 15,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'BRANCH_ADMIN',
      displayName: 'Branch Administrator',
      description: 'Branch-level administration',
      level: 2,
      isSystem: true,
      permissionCount: 60,
      userCount: 25,
      createdAt: new Date().toISOString(),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setShowForm(false);
    setFormData({ name: '', displayName: '', description: '', level: 3 });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      // Handle deletion
    }
  };

  return (
    <RouteGuard requiredRoles={['GOD_MODE', 'SYSTEM_ADMIN']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Roles</h1>
                <p className="mt-2 text-gray-600">Manage system roles and permissions</p>
              </div>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData({ name: '', displayName: '', description: '', level: 3 });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + New Role
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingId ? 'Edit Role' : 'Create New Role'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., FINANCE_MANAGER"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Finance Manager"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Role description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>Level 1 (Highest)</option>
                      <option value={2}>Level 2</option>
                      <option value={3}>Level 3</option>
                      <option value={4}>Level 4</option>
                      <option value={5}>Level 5 (Lowest)</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRoles.map((role) => (
              <div key={role.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{role.displayName}</h3>
                    <p className="text-sm text-gray-600 font-mono">{role.name}</p>
                  </div>
                  {role.isSystem && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                      System
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">{role.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Permissions</p>
                    <p className="text-lg font-bold text-gray-900">{role.permissionCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Users</p>
                    <p className="text-lg font-bold text-gray-900">{role.userCount}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(role.id);
                      setFormData({
                        name: role.name,
                        displayName: role.displayName,
                        description: role.description,
                        level: role.level,
                      });
                      setShowForm(true);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium"
                  >
                    Edit
                  </button>
                  {!role.isSystem && (
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm font-medium"
                  >
                    Permissions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
