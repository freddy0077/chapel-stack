"use client";

import { useState } from 'react';
import { User, UserRole, Branch } from '@/lib/auth/types';

// Mock data for the user list
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@church.org',
    name: 'Admin User',
    roles: ['super_admin'],
    primaryBranchId: 'main',
    accessibleBranches: [
      { userId: '1', branchId: 'main', role: 'super_admin', isHomeBranch: true },
      { userId: '1', branchId: 'east', role: 'super_admin', isHomeBranch: false },
      { userId: '1', branchId: 'west', role: 'super_admin', isHomeBranch: false },
      { userId: '1', branchId: 'south', role: 'super_admin', isHomeBranch: false }
    ],
    directPermissions: [],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-04-01')
  },
  {
    id: '2',
    email: 'branch.admin@church.org',
    name: 'Branch Admin',
    roles: ['branch_admin'],
    primaryBranchId: 'main',
    accessibleBranches: [
      { userId: '2', branchId: 'main', role: 'branch_admin', isHomeBranch: true }
    ],
    directPermissions: [],
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-03-15')
  },
  {
    id: '3',
    email: 'pastor@church.org',
    name: 'Pastor Smith',
    roles: ['pastor'],
    primaryBranchId: 'main',
    accessibleBranches: [
      { userId: '3', branchId: 'main', role: 'pastor', isHomeBranch: true },
      { userId: '3', branchId: 'east', role: 'staff', isHomeBranch: false },
      { userId: '3', branchId: 'west', role: 'staff', isHomeBranch: false }
    ],
    directPermissions: [],
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2025-02-01')
  },
  {
    id: '4',
    email: 'east.admin@church.org',
    name: 'East Branch Admin',
    roles: ['branch_admin'],
    primaryBranchId: 'east',
    accessibleBranches: [
      { userId: '4', branchId: 'east', role: 'branch_admin', isHomeBranch: true }
    ],
    directPermissions: [],
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '5',
    email: 'staff@church.org',
    name: 'Staff Member',
    roles: ['staff'],
    primaryBranchId: 'main',
    accessibleBranches: [
      { userId: '5', branchId: 'main', role: 'staff', isHomeBranch: true }
    ],
    directPermissions: [],
    isActive: true,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2025-01-15')
  }
];

// Mock branch data
const mockBranches: Branch[] = [
  { id: 'main', name: 'Main Campus', location: '123 Main St, Cityville' },
  { id: 'east', name: 'East Side', location: '456 East Blvd, Cityville' },
  { id: 'west', name: 'West End', location: '789 West Ave, Cityville' },
  { id: 'south', name: 'South Chapel', location: '321 South Rd, Cityville' }
];

// Available roles for assignment
const availableRoles: { value: UserRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'branch_admin', label: 'Branch Admin' },
  { value: 'pastor', label: 'Pastor' },
  { value: 'ministry_leader', label: 'Ministry Leader' },
  { value: 'staff', label: 'Staff' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'member', label: 'Member' }
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler for selecting a user
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(false);
  };

  // Handler for editing a user
  const handleEditUser = () => {
    setIsEditing(true);
  };

  // Handler for branch role change
  const handleBranchRoleChange = (branchId: string, newRole: UserRole) => {
    if (!selectedUser) return;
    
    // In a real app, this would be an API call
    // For now, we'll just update the state
    const updatedUser = { ...selectedUser };
    const branchIndex = updatedUser.accessibleBranches.findIndex(b => b.branchId === branchId);
    
    if (branchIndex >= 0) {
      updatedUser.accessibleBranches[branchIndex] = {
        ...updatedUser.accessibleBranches[branchIndex],
        role: newRole
      };
    } else {
      updatedUser.accessibleBranches.push({
        userId: selectedUser.id,
        branchId,
        role: newRole,
        isHomeBranch: false
      });
    }
    
    setSelectedUser(updatedUser);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          User Access Management
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage user roles and branch access permissions
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row">
        {/* User list */}
        <div className="w-full lg:w-1/3 border-r border-gray-200">
          <div className="p-4">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-10 py-2 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <ul className="divide-y divide-gray-200 overflow-auto max-h-96">
            {filteredUsers.map((user) => (
              <li 
                key={user.id}
                className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${selectedUser?.id === user.id ? 'bg-indigo-50' : ''}`}
                onClick={() => handleSelectUser(user)}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <div className="mt-1">
                      {user.roles.map((role) => (
                        <span key={role} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1">
                          {role.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  {!user.isActive && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          
          <div className="p-4 border-t border-gray-200">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New User
            </button>
          </div>
        </div>
        
        {/* User details */}
        <div className="w-full lg:w-2/3 p-4">
          {selectedUser ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">{selectedUser.name}</h4>
                <div>
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={handleEditUser}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit Access
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
              
              <div className="bg-gray-50 p-4 mb-4 rounded">
                <h5 className="text-sm font-medium text-gray-700 mb-2">User Information</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedUser.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Primary Branch</p>
                    <p className="text-sm text-gray-900">
                      {mockBranches.find(b => b.id === selectedUser.primaryBranchId)?.name || 'None'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm text-gray-900">
                      {selectedUser.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Branch Access & Roles</h5>
                <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Branch
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Is Home Branch
                        </th>
                        {isEditing && (
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedUser.accessibleBranches.map((branchAccess) => {
                        const branch = mockBranches.find(b => b.id === branchAccess.branchId);
                        return (
                          <tr key={branchAccess.branchId}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {branch?.name || branchAccess.branchId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {isEditing ? (
                                <select
                                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                  value={branchAccess.role}
                                  onChange={(e) => handleBranchRoleChange(
                                    branchAccess.branchId, 
                                    e.target.value as UserRole
                                  )}
                                >
                                  {availableRoles.map(role => (
                                    <option key={role.value} value={role.value}>
                                      {role.label}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {branchAccess.role.replace('_', ' ')}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {branchAccess.isHomeBranch ? (
                                <span className="text-green-600">Yes</span>
                              ) : (
                                <span className="text-gray-500">No</span>
                              )}
                            </td>
                            {isEditing && (
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  type="button"
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Remove
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                      
                      {isEditing && (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-center">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Add Branch Access
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Additional Permissions</h5>
                {selectedUser.directPermissions.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-md p-4">
                    <ul className="divide-y divide-gray-200">
                      {selectedUser.directPermissions.map((permission, index) => (
                        <li key={index} className="py-2 flex justify-between">
                          <div>
                            <p className="text-sm text-gray-900">{permission.permissionId}</p>
                            {permission.branchId && (
                              <p className="text-xs text-gray-500">Branch: {
                                mockBranches.find(b => b.id === permission.branchId)?.name || permission.branchId
                              }</p>
                            )}
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            permission.granted
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {permission.granted ? 'Granted' : 'Denied'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-md p-4 text-center">
                    <p className="text-sm text-gray-500">No additional permissions assigned</p>
                    {isEditing && (
                      <button
                        type="button"
                        className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Add Permission
                      </button>
                    )}
                  </div>
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Select a user to view or edit access permissions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
