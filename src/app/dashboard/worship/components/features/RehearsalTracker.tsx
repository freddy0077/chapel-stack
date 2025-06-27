"use client";

import { useState } from 'react';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  MusicalNoteIcon, 
  UserGroupIcon, 
  PlusCircleIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { ServicePlan } from '../ServicesList';

// Data model for rehearsal
export interface Rehearsal {
  id: number;
  title: string;
  serviceId?: number; // Optional reference to a service this rehearsal is for
  date: string; // ISO date string
  time: string; // Time string (e.g. "19:00")
  duration: number; // Duration in minutes
  location: string;
  description: string;
  teamMembers: RehearsalAttendee[];
  songs: string[]; // List of song titles to rehearse
  notes: string;
  completed: boolean;
}

// Data model for rehearsal attendee
export interface RehearsalAttendee {
  teamMemberId: number;
  name: string;
  role: string;
  confirmed: boolean;
  attended: boolean | null; // null means not yet marked
  notes: string;
}

// Mock data for rehearsals
export const mockRehearsals: Rehearsal[] = [
  {
    id: 1,
    title: "Sunday Service Rehearsal",
    serviceId: 1,
    date: "2025-04-12",
    time: "19:00",
    duration: 90,
    location: "Main Sanctuary",
    description: "Rehearsal for Sunday Morning Service",
    teamMembers: [
      { teamMemberId: 1, name: "Sarah Williams", role: "Worship Leader", confirmed: true, attended: true, notes: "" },
      { teamMemberId: 2, name: "David Chen", role: "Acoustic Guitar", confirmed: true, attended: true, notes: "" },
      { teamMemberId: 3, name: "Michelle Johnson", role: "Vocals", confirmed: true, attended: false, notes: "Called in sick" },
      { teamMemberId: 4, name: "James Wilson", role: "Drums", confirmed: true, attended: true, notes: "" },
      { teamMemberId: 5, name: "Tiffany Rodriguez", role: "Keys", confirmed: false, attended: null, notes: "Not confirmed yet" }
    ],
    songs: ["Amazing Grace", "How Great Thou Art", "Great Is Thy Faithfulness", "10,000 Reasons"],
    notes: "Focus on transitions between songs. Work on harmonies for 'Amazing Grace'.",
    completed: false
  },
  {
    id: 2,
    title: "Midweek Prayer Service Rehearsal",
    serviceId: 2,
    date: "2025-04-08",
    time: "18:00",
    duration: 60,
    location: "Fellowship Hall",
    description: "Quick rehearsal for Wednesday Night Prayer Service",
    teamMembers: [
      { teamMemberId: 6, name: "Thomas Anderson", role: "Worship Leader", confirmed: true, attended: true, notes: "" },
      { teamMemberId: 7, name: "Lisa Brown", role: "Keys", confirmed: true, attended: true, notes: "" },
      { teamMemberId: 8, name: "Jacob Martinez", role: "Acoustic Guitar", confirmed: true, attended: true, notes: "" }
    ],
    songs: ["Spirit Break Out", "Oceans", "Cornerstone"],
    notes: "Keep arrangements simple, focus on creating space for prayer.",
    completed: true
  },
  {
    id: 3,
    title: "Easter Service Rehearsal",
    serviceId: 3,
    date: "2025-04-18",
    time: "19:00",
    duration: 120,
    location: "Main Sanctuary",
    description: "Full rehearsal for Easter Sunday Service",
    teamMembers: [
      { teamMemberId: 1, name: "Sarah Williams", role: "Worship Leader", confirmed: true, attended: null, notes: "" },
      { teamMemberId: 2, name: "David Chen", role: "Acoustic Guitar", confirmed: true, attended: null, notes: "" },
      { teamMemberId: 3, name: "Michelle Johnson", role: "Vocals", confirmed: true, attended: null, notes: "" },
      { teamMemberId: 4, name: "James Wilson", role: "Drums", confirmed: true, attended: null, notes: "" },
      { teamMemberId: 5, name: "Tiffany Rodriguez", role: "Keys", confirmed: true, attended: null, notes: "" },
      { teamMemberId: 9, name: "Robert Kim", role: "Bass Guitar", confirmed: false, attended: null, notes: "Checking availability" },
      { teamMemberId: 10, name: "Choir Members", role: "Choir", confirmed: true, attended: null, notes: "Full choir needed" }
    ],
    songs: ["Christ The Lord Is Risen Today", "Forever", "Living Hope", "Resurrection Power"],
    notes: "Full run-through with choir. Special attention to Easter celebration songs and transitions.",
    completed: false
  }
];

interface RehearsalTrackerProps {
  services: ServicePlan[];
  onViewRehearsal: (rehearsal: Rehearsal) => void;
  onCreateRehearsal: () => void;
}

export default function RehearsalTracker({ 
  services, 
  onViewRehearsal, 
  onCreateRehearsal 
}: RehearsalTrackerProps) {
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [searchQuery, setSearchQuery] = useState("");

  // Filter rehearsals based on search query and filter setting
  const filteredRehearsals = mockRehearsals.filter(rehearsal => {
    const matchesSearch = 
      rehearsal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rehearsal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rehearsal.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rehearsal.teamMembers.some(member => 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rehearsalDate = new Date(rehearsal.date);
    rehearsalDate.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') {
      return matchesSearch && rehearsalDate >= today;
    } else if (filter === 'past') {
      return matchesSearch && rehearsalDate < today;
    } else {
      return matchesSearch;
    }
  });

  // Format attendance status for display
  const formatAttendanceStatus = (rehearsal: Rehearsal) => {
    const confirmed = rehearsal.teamMembers.filter(m => m.confirmed).length;
    const attended = rehearsal.teamMembers.filter(m => m.attended === true).length;
    const total = rehearsal.teamMembers.length;

    if (isRehearsalPast(rehearsal)) {
      return `${attended}/${confirmed} attended`;
    } else {
      return `${confirmed}/${total} confirmed`;
    }
  };

  // Check if rehearsal date is in the past
  const isRehearsalPast = (rehearsal: Rehearsal) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rehearsalDate = new Date(rehearsal.date);
    rehearsalDate.setHours(0, 0, 0, 0);
    return rehearsalDate < today;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-lg font-semibold leading-6 text-gray-900">Rehearsal Tracker</h3>
            <p className="mt-2 text-sm text-gray-500">
              Schedule and track attendance for team rehearsals.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={onCreateRehearsal}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusCircleIcon className="inline-block h-5 w-5 mr-1 -mt-0.5" aria-hidden="true" />
              New Rehearsal
            </button>
          </div>
        </div>

        <div className="mt-6 sm:flex sm:items-center">
          <div className="relative flex-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rehearsals..."
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="mt-3 sm:ml-4 sm:mt-0">
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setFilter('upcoming')}
                className={`relative -ml-px inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10 ${
                  filter === 'upcoming' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                Upcoming
              </button>
              <button
                type="button"
                onClick={() => setFilter('past')}
                className={`relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10 ${
                  filter === 'past' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                Past
              </button>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10 ${
                  filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {filteredRehearsals.length === 0 ? (
                <div className="text-center py-10">
                  <MusicalNoteIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No rehearsals found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {filter === 'upcoming' 
                      ? 'No upcoming rehearsals scheduled.' 
                      : filter === 'past' 
                      ? 'No past rehearsals found.' 
                      : 'No rehearsals match your search.'}
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={onCreateRehearsal}
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <PlusCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                      New Rehearsal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Rehearsal
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Date & Time
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Location
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Team
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredRehearsals.map((rehearsal) => (
                        <tr 
                          key={rehearsal.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => onViewRehearsal(rehearsal)}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            <div>{rehearsal.title}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {rehearsal.serviceId ? `For: ${services.find(s => s.id === rehearsal.serviceId)?.title || 'Service'}` : ''}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{formatDate(rehearsal.date)}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{rehearsal.time} ({rehearsal.duration} mins)</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{rehearsal.location}</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex items-start">
                              <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400 mt-0.5" />
                              <div>
                                {rehearsal.teamMembers.slice(0, 2).map((member, idx) => (
                                  <div key={idx} className="text-gray-900">{member.name}</div>
                                ))}
                                {rehearsal.teamMembers.length > 2 && (
                                  <div className="text-gray-500 text-xs">
                                    +{rehearsal.teamMembers.length - 2} more
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                              rehearsal.completed 
                                ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' 
                                : 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20'
                            }`}>
                              {rehearsal.completed ? 'Completed' : 'Scheduled'}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatAttendanceStatus(rehearsal)}
                            </div>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewRehearsal(rehearsal);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View<span className="sr-only">, {rehearsal.title}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
