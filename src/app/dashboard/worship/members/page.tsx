"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { mockTeamMembers } from '../components/TeamScheduling';

export default function TeamMembersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Extract unique roles for filter dropdown
  const allRoles = ['All Roles', ...new Set(mockTeamMembers.map(member => member.role))].sort();
  
  // Extract unique statuses for filter dropdown
  const allStatuses = ['All Statuses', ...new Set(mockTeamMembers.map(member => member.status))].sort();

  // Filter team members based on search and filters
  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'All Roles' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'All Statuses' || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Group members by role for better organization
  const membersByRole = filteredMembers.reduce((groups, member) => {
    const role = member.role;
    if (!groups[role]) {
      groups[role] = [];
    }
    groups[role].push(member);
    return groups;
  }, {} as Record<string, typeof mockTeamMembers>);

  // Sort roles alphabetically
  const sortedRoles = Object.keys(membersByRole).sort();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Training':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-indigo-600 mr-3" aria-hidden="true" />
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Worship Team Members
              </h1>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Manage your worship team members, their roles, and availability
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => router.push('/dashboard/worship/members/add')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Team Member
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Search team members
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md text-sm"
                placeholder="Search by name, email, or role"
              />
            </div>
          </div>

          <div className="md:w-48">
            <select
              id="role-filter"
              name="role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {allRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="md:w-48">
            <select
              id="status-filter"
              name="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {allStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          {filteredMembers.length} members found
          {(searchTerm || roleFilter !== 'All Roles' || statusFilter !== 'All Statuses') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('All Roles');
                setStatusFilter('All Statuses');
              }}
              className="ml-3 text-indigo-600 hover:text-indigo-500"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Team Members List */}
      {filteredMembers.length > 0 ? (
        <div className="space-y-8">
          {sortedRoles.map((role) => (
            <div key={role} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-indigo-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">{role}</h2>
                <p className="text-sm text-gray-500 mt-1">{membersByRole[role].length} members</p>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {membersByRole[role].map((member) => (
                  <li key={member.id} className="group">
                    <div 
                      className="px-6 py-5 flex flex-col sm:flex-row sm:items-center hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/dashboard/worship/members/${member.id}`)}
                    >
                      <div className="flex-shrink-0 mr-4">
                        {/* Use UserCircleIcon as avatar since we don't have profile images in the mock data */
                        (
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <UserCircleIcon className="h-10 w-10 text-indigo-500" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900 truncate">{member.name}</h3>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                              {member.status}
                            </span>
                          </div>
                          
                          <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap">
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:mr-6">
                              <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                              {member.email}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:mr-6">
                              <PhoneIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                              {member.phone}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <CheckBadgeIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                              {member.scheduledServices} upcoming services
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 sm:mt-0">
                          <div className="flex flex-wrap gap-1">
                            {member.skills.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
                              >
                                {skill}
                              </span>
                            ))}
                            {member.skills.length > 3 && (
                              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
                                +{member.skills.length - 3}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            {member.availability}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-0 sm:ml-5 flex-shrink-0">
                        <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-16 text-center">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No team members found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || roleFilter !== 'All Roles' || statusFilter !== 'All Statuses'
              ? 'Try adjusting your search filters to find what you&apos;re looking for.'
              : 'Get started by adding your first team member.'}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => router.push('/dashboard/worship/members/add')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Team Member
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
