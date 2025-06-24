"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheckIcon, 
  ChevronLeftIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  ArrowUpCircleIcon,
  BuildingOffice2Icon,
  GlobeAmericasIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

// TypeScript interfaces
type AccessLevel = 'diocese' | 'regional' | 'branch';

interface Role {
  id: string;
  name: string;
  description: string;
  accessLevel: AccessLevel;
  permissions: number;
  regions?: string[];
  branches?: string[];
  createdAt: string;
  updatedAt: string;
}

// Role access level options
const roleTypes = [
  { id: 'diocese' as AccessLevel, name: 'Diocese-Level' },
  { id: 'regional' as AccessLevel, name: 'Regional-Level' },
  { id: 'branch' as AccessLevel, name: 'Branch-Level' },
];

// Mock data for roles
const mockRoles: Role[] = [
  { 
    id: 'role-001', 
    name: 'Diocese Administrator', 
    description: 'Full access to manage all branches, roles, and resources', 
    accessLevel: 'diocese', 
    permissions: 25,
    createdAt: '2025-02-10T08:30:00Z', 
    updatedAt: '2025-03-15T14:20:00Z'
  },
  { 
    id: 'role-002', 
    name: 'Regional Director', 
    description: 'Manages branches and operations within a specific region', 
    accessLevel: 'regional', 
    permissions: 18,
    regions: ['Northern', 'Eastern'],
    createdAt: '2025-02-15T10:45:00Z', 
    updatedAt: '2025-03-15T14:25:00Z' 
  },
  { 
    id: 'role-003', 
    name: 'Branch Pastor', 
    description: 'Manages all aspects of an individual branch', 
    accessLevel: 'branch', 
    permissions: 15,
    branches: ['St. Mary\'s Cathedral', 'Sacred Heart Parish'],
    createdAt: '2025-02-15T11:20:00Z', 
    updatedAt: '2025-03-01T09:15:00Z' 
  },
  { 
    id: 'role-004', 
    name: 'Sacraments Officer', 
    description: 'Manages baptism, communion, confirmation, and marriage records', 
    accessLevel: 'branch', 
    permissions: 8,
    branches: ['St. Joseph\'s Church'],
    createdAt: '2025-02-20T15:10:00Z', 
    updatedAt: '2025-03-05T13:30:00Z' 
  },
  { 
    id: 'role-005', 
    name: 'Membership Coordinator', 
    description: 'Manages member profiles and transfers between branches', 
    accessLevel: 'branch', 
    permissions: 10,
    branches: ['Holy Trinity Church', 'St. Peter\'s Parish'],
    createdAt: '2025-02-22T09:00:00Z', 
    updatedAt: '2025-03-10T16:45:00Z' 
  },
  { 
    id: 'role-006', 
    name: 'Reports Analyst', 
    description: 'Access to view and generate reports across branches', 
    accessLevel: 'diocese', 
    permissions: 7,
    createdAt: '2025-02-25T13:15:00Z', 
    updatedAt: '2025-03-18T10:20:00Z' 
  }
];

export default function RolesManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [accessLevelFilter, setAccessLevelFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter roles based on search query and access level filter
  const filteredRoles = mockRoles.filter(role => {
    const matchesSearch = 
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesAccessLevel = 
      accessLevelFilter === 'all' || role.accessLevel === accessLevelFilter;
      
    return matchesSearch && matchesAccessLevel;
  });
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  // Get icon based on access level
  const getAccessLevelIcon = (accessLevel: AccessLevel) => {
    switch(accessLevel) {
      case 'diocese':
        return <GlobeAmericasIcon className="h-5 w-5 text-purple-500" />;
      case 'regional':
        return <ArrowUpCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'branch':
        return <BuildingOffice2Icon className="h-5 w-5 text-green-500" />;
      default:
        return <ShieldCheckIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get color scheme based on access level
  const getAccessLevelStyles = (accessLevel: AccessLevel): string => {
    switch(accessLevel) {
      case 'diocese':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'regional':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'branch':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center mb-2">
          <Link 
            href="/dashboard/admin" 
            className="inline-flex items-center justify-center mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Management</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Create and manage administrative roles with branch-specific access controls
        </p>
      </header>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
              placeholder="Search roles..."
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FunnelIcon className="h-4 w-4 mr-2 text-gray-500" />
              Filters
            </button>

            <Link
              href="/dashboard/admin/roles/new"
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              <span>New Role</span>
            </Link>
          </div>
        </div>
        
        {showFilters && (
          <div className="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="access-level-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Access Level
                </label>
                <select
                  id="access-level-filter"
                  value={accessLevelFilter}
                  onChange={(e) => setAccessLevelFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                >
                  <option value="all">All Access Levels</option>
                  <option value="diocese">Diocese-Level</option>
                  <option value="regional">Regional-Level</option>
                  <option value="branch">Branch-Level</option>
                </select>
              </div>
              
              {/* Additional filters could be added here */}
              
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredRoles.length > 0 ? (
          filteredRoles.map((role) => (
            <div key={role.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-6 py-5 flex justify-between items-start">
                <div className="flex items-start">
                  <div className={`rounded-lg p-3 ${getAccessLevelStyles(role.accessLevel)} mr-4`}>
                    {getAccessLevelIcon(role.accessLevel)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{role.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{role.description}</p>
                    
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccessLevelStyles(role.accessLevel)}`}>
                        {role.accessLevel === 'diocese' ? 'Diocese-Level' : 
                         role.accessLevel === 'regional' ? 'Regional-Level' : 'Branch-Level'}
                      </span>
                      
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                        <CheckBadgeIcon className="h-3 w-3 mr-1" />
                        {role.permissions} Permissions
                      </span>
                      
                      {role.regions && role.regions.map((region) => (
                        <span key={region} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {region} Region
                        </span>
                      ))}
                      
                      {role.branches && role.branches.map((branch) => (
                        <span key={branch} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          {branch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link 
                    href={`/dashboard/admin/roles/${role.id}/edit`}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Edit role"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <button
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      // In a real app, would open a confirmation dialog
                      alert(`Delete ${role.name}? This action cannot be undone.`);
                    }}
                    aria-label="Delete role"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-750 text-xs border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-gray-500 dark:text-gray-400">
                <span>Created: {formatDate(role.createdAt)}</span>
                <span>Last updated: {formatDate(role.updatedAt)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 py-10 px-6 text-center">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No roles found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/admin/roles/new"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <PlusCircleIcon className="mr-2 h-5 w-5" />
                Create New Role
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
