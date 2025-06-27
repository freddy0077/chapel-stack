"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  BuildingOfficeIcon,
  PlusIcon,
  UsersIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Types
interface VolunteerTeam {
  id: string;
  name: string;
  description: string;
  branch: string;
  branchId: string;
  membersCount: number;
  leader: string;
  leaderId: string;
  roles: string[];
  schedule: string;
  isSharedWithOtherBranches: boolean;
  sharedWithBranches?: string[];
  createdDate: string;
}

// Mock branches
const BRANCHES = [
  { id: 'all', name: 'All Branches' },
  { id: 'b1', name: 'Main Campus' },
  { id: 'b2', name: 'East Side' },
  { id: 'b3', name: 'West End' },
  { id: 'b4', name: 'South Chapel' }
];

// Mock teams data
const TEAMS: VolunteerTeam[] = [
  {
    id: 't1',
    name: 'Worship Team',
    description: 'Musicians, singers, and production volunteers for Sunday services',
    branch: 'Main Campus',
    branchId: 'b1',
    membersCount: 18,
    leader: 'Sarah Miller',
    leaderId: 's2',
    roles: ['Vocalist', 'Instrumentalist', 'Sound Tech', 'Visual Tech'],
    schedule: 'Sundays, Weekly',
    isSharedWithOtherBranches: true,
    sharedWithBranches: ['East Side', 'West End'],
    createdDate: '2020-01-15'
  },
  {
    id: 't2',
    name: 'Children\'s Ministry',
    description: 'Volunteers who serve in various children\'s programs',
    branch: 'Main Campus',
    branchId: 'b1',
    membersCount: 25,
    leader: 'Rebecca Johnson',
    leaderId: 's4',
    roles: ['Teacher', 'Assistant', 'Check-in', 'Games Leader'],
    schedule: 'Sundays, Rotational',
    isSharedWithOtherBranches: false,
    createdDate: '2020-03-10'
  },
  {
    id: 't3',
    name: 'Welcome Team',
    description: 'Greeters, ushers, and hospitality volunteers',
    branch: 'East Side',
    branchId: 'b2',
    membersCount: 15,
    leader: 'Michael Williams',
    leaderId: 'v8',
    roles: ['Greeter', 'Usher', 'Information Desk', 'Parking Lot'],
    schedule: 'Sundays, Bi-weekly',
    isSharedWithOtherBranches: false,
    createdDate: '2021-02-20'
  },
  {
    id: 't4',
    name: 'Youth Ministry',
    description: 'Volunteers serving middle and high school students',
    branch: 'East Side',
    branchId: 'b2',
    membersCount: 12,
    leader: 'David Thompson',
    leaderId: 's3',
    roles: ['Youth Leader', 'Small Group Leader', 'Activities Coordinator'],
    schedule: 'Wednesdays and Sundays',
    isSharedWithOtherBranches: true,
    sharedWithBranches: ['Main Campus'],
    createdDate: '2022-08-05'
  },
  {
    id: 't5',
    name: 'Prayer Team',
    description: 'Dedicated intercessors and prayer ministers',
    branch: 'West End',
    branchId: 'b3',
    membersCount: 10,
    leader: 'Jennifer Lee',
    leaderId: 's6',
    roles: ['Prayer Leader', 'Intercessor', 'Altar Ministry'],
    schedule: 'Sundays and Prayer Meetings',
    isSharedWithOtherBranches: true,
    sharedWithBranches: ['Main Campus', 'East Side', 'South Chapel'],
    createdDate: '2021-06-15'
  },
  {
    id: 't6',
    name: 'Technical Team',
    description: 'Audio, video, lighting, and streaming specialists',
    branch: 'Main Campus',
    branchId: 'b1',
    membersCount: 8,
    leader: 'Robert Brown',
    leaderId: 's7',
    roles: ['Sound Engineer', 'Camera Operator', 'Lighting Technician', 'Stream Manager'],
    schedule: 'Sundays and Special Events',
    isSharedWithOtherBranches: true,
    sharedWithBranches: ['West End'],
    createdDate: '2020-09-01'
  },
  {
    id: 't7',
    name: 'Outreach Team',
    description: 'Community service and local mission volunteers',
    branch: 'South Chapel',
    branchId: 'b4',
    membersCount: 20,
    leader: 'Amanda Clark',
    leaderId: 's8',
    roles: ['Project Coordinator', 'Team Leader', 'Volunteer'],
    schedule: 'Monthly Project Days',
    isSharedWithOtherBranches: false,
    createdDate: '2022-01-10'
  },
  {
    id: 't8',
    name: 'Care Team',
    description: 'Visitation, meals, and support for those in need',
    branch: 'West End',
    branchId: 'b3',
    membersCount: 15,
    leader: 'Thomas Wilson',
    leaderId: 'v12',
    roles: ['Visitor', 'Meal Coordinator', 'Support Coordinator'],
    schedule: 'As Needed',
    isSharedWithOtherBranches: false,
    createdDate: '2021-11-05'
  }
];

export default function VolunteerTeamsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [showSharedOnly, setShowSharedOnly] = useState(false);
  
  // Filter teams based on search, branch, and sharing status
  const filteredTeams = TEAMS.filter(team => {
    // Branch filter
    if (selectedBranch !== 'all' && team.branchId !== selectedBranch) {
      return false;
    }
    
    // Shared teams filter
    if (showSharedOnly && !team.isSharedWithOtherBranches) {
      return false;
    }
    
    // Search term filter
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      return (
        team.name.toLowerCase().includes(search) ||
        team.description.toLowerCase().includes(search) ||
        team.leader.toLowerCase().includes(search) ||
        team.roles.some(role => role.toLowerCase().includes(search))
      );
    }
    
    return true;
  });

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Volunteer Teams</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage volunteer teams and share resources across branches
          </p>
        </div>
        <Link
          href="/dashboard/volunteers/teams/create"
          className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create Team
        </Link>
      </div>

      {/* Dashboard Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Teams</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{TEAMS.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Team Members</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {TEAMS.reduce((sum, team) => sum + team.membersCount, 0)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowPathIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Shared Teams</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {TEAMS.filter(team => team.isSharedWithOtherBranches).length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOfficeIcon className="h-6 w-6 text-purple-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Branches</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{BRANCHES.length - 1}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search teams by name, role, or leader..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1 md:max-w-xs">
          <select
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            {BRANCHES.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            id="shared-only"
            name="shared-only"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            checked={showSharedOnly}
            onChange={(e) => setShowSharedOnly(e.target.checked)}
          />
          <label htmlFor="shared-only" className="ml-2 block text-sm text-gray-900">
            Show shared teams only
          </label>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <div key={team.id} className="bg-white overflow-hidden shadow rounded-lg flex flex-col">
              <div className="px-4 py-5 sm:p-6 flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{team.name}</h3>
                  {team.isSharedWithOtherBranches && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Shared
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center">
                  <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-1" aria-hidden="true" />
                  <p className="text-sm text-gray-500">{team.branch}</p>
                </div>
                <p className="mt-3 text-sm text-gray-500 line-clamp-2">{team.description}</p>
                
                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-1">Team Roles</div>
                  <div className="flex flex-wrap gap-1">
                    {team.roles.slice(0, 3).map((role, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {role}
                      </span>
                    ))}
                    {team.roles.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        +{team.roles.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Members</div>
                    <div className="text-sm font-medium">{team.membersCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Team Leader</div>
                    <div className="text-sm font-medium truncate">{team.leader}</div>
                  </div>
                </div>
                
                {team.isSharedWithOtherBranches && team.sharedWithBranches && (
                  <div className="mt-4">
                    <div className="text-xs text-gray-500 mb-1">Shared with</div>
                    <div className="text-sm text-gray-700">{team.sharedWithBranches.join(', ')}</div>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <Link
                    href={`/dashboard/volunteers/teams/${team.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/dashboard/volunteers/teams/${team.id}/members`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Manage Members
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-lg shadow">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No teams found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/volunteers/teams/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Create a team
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Cross-Branch Sharing Guide */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Cross-Branch Team Sharing</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Team sharing allows volunteers to serve across multiple branches while maintaining their primary branch affiliation.
              This feature is perfect for special events, covering volunteer shortages, or building cross-branch community.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-white shadow rounded p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Step 1: Create a Team</h4>
              <p className="text-xs text-gray-500">Start by creating a team in its primary branch with all required roles.</p>
            </div>
            <div className="bg-white shadow rounded p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Step 2: Enable Sharing</h4>
              <p className="text-xs text-gray-500">Edit the team settings to enable cross-branch sharing and select target branches.</p>
            </div>
            <div className="bg-white shadow rounded p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Step 3: Schedule Volunteers</h4>
              <p className="text-xs text-gray-500">Volunteers from other branches can now be scheduled for this team&apos;s roles.</p>
            </div>
          </div>
          <div className="mt-5">
            <Link
              href="/dashboard/volunteers/resources/cross-branch-guide"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
