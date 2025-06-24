"use client";

import { useState } from 'react';
import { Role, UserRole } from '@/lib/auth/types';
import { useAdminRoles } from '@/graphql/hooks/useAdminRoles';

export default function RoleManagement() {
  const { roles, loading, error } = useAdminRoles();
  console.log("🚀 ~ file: RoleManagement.tsx:14 ~ RoleManagement ~ roles:", roles)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading roles...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Failed to load roles: {error.message}</div>;

  // Handler for selecting a role
  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditing(false);
  };

  // Handler for editing a role
  const handleEditRole = () => {
    setIsEditing(true);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Role Management
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage system roles and their permissions
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row">
        {/* Role list */}
        <div className="w-full lg:w-1/3 border-r border-gray-200 overflow-auto" style={{ maxHeight: '600px' }}>
          <ul className="divide-y divide-gray-200">
            {roles.map((role) => (
              <li 
                key={role.id}
                className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${selectedRole?.id === role.id ? 'bg-indigo-50' : ''}`}
                onClick={() => handleSelectRole(role)}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{role.name}</p>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                  {role.isCustom && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Custom
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
              Create New Role
            </button>
          </div>
        </div>
        
        {/* Role details */}
        <div className="w-full lg:w-2/3 p-4">
          {selectedRole ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">{selectedRole.name}</h4>
                <div>
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={handleEditRole}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit Role
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
                <h5 className="text-sm font-medium text-gray-700 mb-2">Role Details</h5>
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        defaultValue={selectedRole.name}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Description</label>
                      <textarea
                        rows={2}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        defaultValue={selectedRole.description}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{selectedRole.description}</p>
                    <p className="text-xs text-gray-500">ID: {selectedRole.id}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Permissions</h5>
                <div className="bg-white border border-gray-200 rounded-md divide-y divide-gray-200 max-h-96 overflow-auto">
                  {selectedRole.permissions.map((permission) => (
                    <div key={permission} className="flex justify-between items-center p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{permission}</p>
                      </div>
                      {isEditing && (
                        <button
                          type="button"
                          className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Permission
                    </button>
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Select a role to view or edit its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
