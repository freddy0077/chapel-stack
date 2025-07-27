"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheckIcon,
  ChevronLeftIcon,
  XMarkIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';

// Permission categories and their specific permissions
const permissionGroups = [
  {
    category: 'Members',
    permissions: [
      { id: 'members.view', name: 'View Members' },
      { id: 'members.create', name: 'Create Members' },
      { id: 'members.edit', name: 'Edit Members' },
      { id: 'members.delete', name: 'Delete Members' },
      { id: 'members.transfer', name: 'Transfer Members' },
    ]
  },
  {
    category: 'Sacraments',
    permissions: [
      { id: 'sacraments.view', name: 'View Sacramental Records' },
      { id: 'sacraments.create', name: 'Create Sacramental Records' },
      { id: 'sacraments.edit', name: 'Edit Sacramental Records' },
      { id: 'sacraments.delete', name: 'Delete Sacramental Records' },
      { id: 'sacraments.certificates', name: 'Generate Certificates' },
    ]
  },
  {
    category: 'Branches',
    permissions: [
      { id: 'branches.view', name: 'View Branches' },
      { id: 'branches.create', name: 'Create Branches' },
      { id: 'branches.edit', name: 'Edit Branch Information' },
      { id: 'branches.delete', name: 'Delete Branches' },
      { id: 'branches.manage_staff', name: 'Manage Branch Staff' },
    ]
  },
  {
    category: 'Events',
    permissions: [
      { id: 'events.view', name: 'View Events' },
      { id: 'events.create', name: 'Create Events' },
      { id: 'events.edit', name: 'Edit Events' },
      { id: 'events.delete', name: 'Delete Events' },
      { id: 'events.attendance', name: 'Manage Event Attendance' },
    ]
  },
  {
    category: 'Reports',
    permissions: [
      { id: 'reports.view', name: 'View Reports' },
      { id: 'reports.export', name: 'Export Reports' },
      { id: 'reports.create_custom', name: 'Create Custom Reports' },
      { id: 'reports.diocese_level', name: 'View Diocese-Level Reports' },
    ]
  },
  {
    category: 'Administrative',
    permissions: [
      { id: 'admin.view_logs', name: 'View Audit Logs' },
      { id: 'admin.manage_roles', name: 'Manage Roles & Permissions' },
      { id: 'admin.manage_users', name: 'Manage System Users' },
      { id: 'admin.system_settings', name: 'Edit System Settings' },
      { id: 'admin.resource_approval', name: 'Approve Resource Sharing' },
    ]
  }
];

// Branch access levels
const branchAccessLevels = [
  { id: 'diocese', name: 'Diocese-Level (All Branches)' },
  { id: 'regional', name: 'Regional-Level (Group of Branches)' },
  { id: 'branch', name: 'Branch-Level (Specific Branch)' },
];

// Mock branches for regional and branch selection
const mockBranches = [
  // Northern Region
  { id: 'branch-001', name: 'St. Mary\'s Cathedral', region: 'Northern' },
  { id: 'branch-002', name: 'St. Joseph\'s Church', region: 'Northern' },
  { id: 'branch-003', name: 'Holy Trinity Church', region: 'Northern' },
  
  // Southern Region
  { id: 'branch-004', name: 'Sacred Heart Parish', region: 'Southern' },
  { id: 'branch-005', name: 'Good Shepherd Church', region: 'Southern' },
  
  // Eastern Region
  { id: 'branch-006', name: 'St. Peter\'s Parish', region: 'Eastern' },
  { id: 'branch-007', name: 'St. Paul\'s Church', region: 'Eastern' },
  
  // Western Region
  { id: 'branch-008', name: 'St. Francis Church', region: 'Western' },
  { id: 'branch-009', name: 'Christ the King Parish', region: 'Western' },
];

// Available regions
const regions = ['Northern', 'Southern', 'Eastern', 'Western'];

export default function CreateRolePage() {
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [accessLevel, setAccessLevel] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  
  const handlePermissionToggle = (permissionId: string) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };
  
  const handleSelectAllInCategory = (category: string) => {
    const categoryPermissions = permissionGroups.find(group => group.category === category)?.permissions || [];
    const categoryPermissionIds = categoryPermissions.map(p => p.id);
    
    // Check if all permissions in this category are already selected
    const allSelected = categoryPermissionIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      // If all are selected, deselect all in this category
      setSelectedPermissions(selectedPermissions.filter(id => !categoryPermissionIds.includes(id)));
    } else {
      // Otherwise select all missing permissions in this category
      const currentSelected = new Set(selectedPermissions);
      categoryPermissionIds.forEach(id => currentSelected.add(id));
      setSelectedPermissions(Array.from(currentSelected));
    }
  };
  
  const handleRegionToggle = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
      // Also remove branches from this region
      const regionBranchIds = mockBranches.filter(b => b.region === region).map(b => b.id);
      setSelectedBranches(selectedBranches.filter(b => !regionBranchIds.includes(b)));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };
  
  const handleBranchToggle = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      setSelectedBranches(selectedBranches.filter(id => id !== branchId));
    } else {
      setSelectedBranches([...selectedBranches, branchId]);
    }
  };
  
  const handleCreateRole = () => {
    // In a real application, this would send data to a server
    // Removed console.log for performance
    
    alert('Role created successfully');
    // Then redirect to roles list page
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6">
        <div className="flex items-center mb-2">
          <Link 
            href="/dashboard/admin/roles" 
            className="inline-flex items-center justify-center mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Role</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define a new administrative role with specific permissions and access levels
        </p>
      </header>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="space-y-6">
            {/* Role Basic Info */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Role Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="role-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="role-name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    placeholder="e.g., Branch Administrator"
                  />
                </div>
                
                <div>
                  <label htmlFor="role-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="role-description"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Describe the purpose and scope of this role"
                  />
                </div>
              </div>
            </div>
            
            {/* Access Level */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Access Level</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {branchAccessLevels.map(level => (
                  <div key={level.id} className="relative">
                    <input
                      type="radio"
                      id={`access-${level.id}`}
                      name="access-level"
                      className="peer absolute h-0 w-0 opacity-0"
                      checked={accessLevel === level.id}
                      onChange={() => setAccessLevel(level.id)}
                    />
                    <label
                      htmlFor={`access-${level.id}`}
                      className="flex h-full items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:border-gray-300 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/20 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 text-gray-400 peer-checked:text-indigo-500 mr-3" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{level.name}</span>
                      </div>
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300 dark:border-gray-600 peer-checked:border-indigo-500 peer-checked:bg-indigo-500 peer-checked:border-4 transition-all" />
                    </label>
                  </div>
                ))}
              </div>
              
              {/* Region Selection - shown only when regional access is selected */}
              {accessLevel === 'regional' && (
                <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-750">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Regions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {regions.map(region => (
                      <div key={region} className="flex items-center">
                        <input
                          id={`region-${region}`}
                          name={`region-${region}`}
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedRegions.includes(region)}
                          onChange={() => handleRegionToggle(region)}
                        />
                        <label htmlFor={`region-${region}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {region} Region
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Branch Selection - shown only when branch access is selected */}
              {accessLevel === 'branch' && (
                <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-750">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Branches</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {mockBranches.map(branch => (
                      <div key={branch.id} className="flex items-center">
                        <input
                          id={`branch-${branch.id}`}
                          name={`branch-${branch.id}`}
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedBranches.includes(branch.id)}
                          onChange={() => handleBranchToggle(branch.id)}
                        />
                        <label htmlFor={`branch-${branch.id}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {branch.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Permissions */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Permissions</h2>
              
              <div className="space-y-6">
                {permissionGroups.map((group) => (
                  <div key={group.category} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-750 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{group.category}</h3>
                      <button
                        type="button"
                        onClick={() => handleSelectAllInCategory(group.category)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                      >
                        {group.permissions.every(p => selectedPermissions.includes(p.id)) ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {group.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center">
                          <input
                            id={permission.id}
                            name={permission.id}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                          />
                          <label htmlFor={permission.id} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {permission.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-end space-x-4">
            <Link
              href="/dashboard/admin/roles"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleCreateRole}
              disabled={!roleName || !accessLevel || selectedPermissions.length === 0}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Create Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
