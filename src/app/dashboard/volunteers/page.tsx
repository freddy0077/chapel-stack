"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  BuildingOfficeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function VolunteerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Volunteer Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track, organize, and recognize volunteer teams across all branches
          </p>
        </div>
        <Link
          href="/dashboard/volunteers/new"
          className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Volunteer
        </Link>
      </div>

      {/* Feature Tabs */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/dashboard/volunteers/teams"
          className="bg-white overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Teams</h3>
                <p className="text-sm text-gray-500">Manage volunteer teams</p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/volunteers/background-checks"
          className="bg-white overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Background Checks</h3>
                <p className="text-sm text-gray-500">Track screening status</p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/volunteers/training"
          className="bg-white overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Training</h3>
                <p className="text-sm text-gray-500">Manage certifications</p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/volunteers/recognition"
          className="bg-white overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Recognition</h3>
                <p className="text-sm text-gray-500">Celebrate volunteer service</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Volunteer Overview</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Volunteers</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">248</dd>
            </div>
            <div className="bg-gray-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Active Teams</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">12</dd>
            </div>
            <div className="bg-gray-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Hours Served (Month)</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">1,429</dd>
            </div>
            <div className="bg-gray-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Background Check Compliance</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">94%</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Links */}
      <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Access</h3>
          <div className="space-y-4">
            <Link href="/dashboard/calendar/volunteers" className="block hover:bg-gray-50 p-3 rounded-lg transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-3 text-gray-900 font-medium">Volunteer Scheduling</span>
                </div>
                <span className="text-gray-400">&rarr;</span>
              </div>
            </Link>
            
            <Link href="/dashboard/volunteers/reports" className="block hover:bg-gray-50 p-3 rounded-lg transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="ml-3 text-gray-900 font-medium">Volunteer Reports</span>
                </div>
                <span className="text-gray-400">&rarr;</span>
              </div>
            </Link>
            
            <Link href="/dashboard/volunteers/teams/create" className="block hover:bg-gray-50 p-3 rounded-lg transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="ml-3 text-gray-900 font-medium">Create New Team</span>
                </div>
                <span className="text-gray-400">&rarr;</span>
              </div>
            </Link>
            
            <Link href="/dashboard/volunteers/import" className="block hover:bg-gray-50 p-3 rounded-lg transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="ml-3 text-gray-900 font-medium">Import Volunteers</span>
                </div>
                <span className="text-gray-400">&rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
