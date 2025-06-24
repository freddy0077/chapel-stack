"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  UserGroupIcon, 
  UserIcon, 
  CalendarIcon, 
  PlusIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";

// Types
interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  availability: {
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    mornings: boolean;
    afternoons: boolean;
    evenings: boolean;
  };
  preferredBranches: string[];
  assignedEvents: number;
}

interface Assignment {
  id: string;
  eventId: number;
  eventTitle: string;
  date: string;
  time: string;
  branchId: string;
  branchName: string;
  role: string;
  volunteerId: string;
  volunteerName: string;
  status: "confirmed" | "pending" | "declined";
  notes?: string;
}

// Mock data
const mockBranches = [
  { id: "all", name: "All Branches" },
  { id: "b1", name: "Main Campus" },
  { id: "b2", name: "East Side" },
  { id: "b3", name: "West End" },
  { id: "b4", name: "South Chapel" }
];

const mockVolunteers: Volunteer[] = [
  {
    id: "v1",
    name: "Michael Smith",
    email: "michael.smith@example.com",
    phone: "555-123-4567",
    skills: ["Worship Leading", "Tech Support", "Setup"],
    availability: {
      sunday: true,
      monday: false,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: false,
      saturday: true,
      mornings: true,
      afternoons: true,
      evenings: false
    },
    preferredBranches: ["b1", "b2"],
    assignedEvents: 3
  },
  {
    id: "v2",
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    phone: "555-987-6543",
    skills: ["Technical Support", "Visual Media", "Sound Systems"],
    availability: {
      sunday: true,
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: false,
      mornings: false,
      afternoons: true,
      evenings: true
    },
    preferredBranches: ["b1"],
    assignedEvents: 2
  },
  {
    id: "v3",
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: "555-456-7890",
    skills: ["Usher", "Greeter", "Setup", "Cleanup"],
    availability: {
      sunday: true,
      monday: false,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: false,
      saturday: true,
      mornings: true,
      afternoons: false,
      evenings: false
    },
    preferredBranches: ["b1", "b3"],
    assignedEvents: 4
  },
  {
    id: "v4",
    name: "Rachel Thompson",
    email: "rachel.thompson@example.com",
    phone: "555-222-3333",
    skills: ["Bible Study Leader", "Children's Ministry", "Prayer Team"],
    availability: {
      sunday: true,
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: false,
      saturday: false,
      mornings: true,
      afternoons: true,
      evenings: true
    },
    preferredBranches: ["b3"],
    assignedEvents: 2
  },
  {
    id: "v5",
    name: "David Anderson",
    email: "david.anderson@example.com",
    phone: "555-444-5555",
    skills: ["Choir Director", "Worship Team", "Music Coordination"],
    availability: {
      sunday: true,
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: true,
      mornings: false,
      afternoons: true,
      evenings: true
    },
    preferredBranches: ["b1", "b2", "b3", "b4"],
    assignedEvents: 5
  }
];

const mockAssignments: Assignment[] = [
  {
    id: "a1",
    eventId: 1,
    eventTitle: "Sunday Service",
    date: "April 13, 2025",
    time: "10:00 AM - 12:00 PM",
    branchId: "b1",
    branchName: "Main Campus",
    role: "Worship Leader",
    volunteerId: "v1",
    volunteerName: "Michael Smith",
    status: "confirmed"
  },
  {
    id: "a2",
    eventId: 1,
    eventTitle: "Sunday Service",
    date: "April 13, 2025",
    time: "10:00 AM - 12:00 PM",
    branchId: "b1",
    branchName: "Main Campus",
    role: "Usher",
    volunteerId: "v3",
    volunteerName: "James Wilson",
    status: "confirmed"
  },
  {
    id: "a3",
    eventId: 1,
    eventTitle: "Sunday Service",
    date: "April 13, 2025",
    time: "10:00 AM - 12:00 PM",
    branchId: "b1",
    branchName: "Main Campus",
    role: "Technical Support",
    volunteerId: "v2",
    volunteerName: "Sarah Davis",
    status: "pending"
  },
  {
    id: "a4",
    eventId: 5,
    eventTitle: "Women's Bible Study",
    date: "April 9, 2025",
    time: "10:00 AM - 11:30 AM",
    branchId: "b3",
    branchName: "West End",
    role: "Study Leader",
    volunteerId: "v4",
    volunteerName: "Rachel Thompson",
    status: "confirmed"
  },
  {
    id: "a5",
    eventId: 7,
    eventTitle: "Choir Practice",
    date: "April 10, 2025",
    time: "6:00 PM - 7:30 PM",
    branchId: "b1",
    branchName: "Main Campus",
    role: "Choir Director",
    volunteerId: "v5",
    volunteerName: "David Anderson",
    status: "confirmed"
  }
];

// Helper function to get available volunteers for a role based on date and time
const getAvailableVolunteers = (date: string, branchId: string) => {
  // In a real app, this would do much more sophisticated filtering
  // For this example, we'll just return all volunteers who prefer this branch
  return mockVolunteers.filter(volunteer => 
    volunteer.preferredBranches.includes(branchId) || 
    volunteer.preferredBranches.includes("all")
  );
};

export default function VolunteerScheduling() {
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedAssignmentStatus, setSelectedAssignmentStatus] = useState<string>("all");
  const [showAvailableVolunteersFor, setShowAvailableVolunteersFor] = useState<string | null>(null);
  
  // Filter assignments based on selections
  const filteredAssignments = mockAssignments.filter(assignment => {
    if (selectedBranch !== "all" && assignment.branchId !== selectedBranch) {
      return false;
    }
    
    if (selectedAssignmentStatus !== "all" && assignment.status !== selectedAssignmentStatus) {
      return false;
    }
    
    return true;
  });
  
  // Group assignments by event
  const assignmentsByEvent = filteredAssignments.reduce((acc, assignment) => {
    const key = `${assignment.eventId}-${assignment.date}`;
    if (!acc[key]) {
      acc[key] = {
        eventId: assignment.eventId,
        eventTitle: assignment.eventTitle,
        date: assignment.date,
        time: assignment.time,
        branchId: assignment.branchId,
        branchName: assignment.branchName,
        assignments: []
      };
    }
    acc[key].assignments.push(assignment);
    return acc;
  }, {} as Record<string, { eventId: number; eventTitle: string; date: string; time: string; branchId: string; branchName: string; assignments: Assignment[] }>);
  
  // Get volunteers available for assignment when "Find Volunteers" is clicked
  const availableVolunteers = showAvailableVolunteersFor 
    ? getAvailableVolunteers(
        filteredAssignments.find(a => a.id === showAvailableVolunteersFor)?.date || "",
        filteredAssignments.find(a => a.id === showAvailableVolunteersFor)?.branchId || ""
      )
    : [];

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Volunteer Scheduling</h1>
          <p className="mt-2 text-sm text-gray-700">
            Schedule and manage volunteers for events across all church branches.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link href="/dashboard/calendar/volunteers/new">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="h-5 w-5 inline-block mr-1" />
              Add Volunteer
            </button>
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-base font-medium text-gray-900 mb-4">Assignment Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="branch-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <select
              id="branch-filter"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {mockBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Status
            </label>
            <select
              id="status-filter"
              value={selectedAssignmentStatus}
              onChange={(e) => setSelectedAssignmentStatus(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Assignments by Event */}
      <div className="space-y-6">
        {Object.values(assignmentsByEvent).map((eventGroup) => (
          <div key={`${eventGroup.eventId}-${eventGroup.date}`} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h3 className="text-lg font-medium text-gray-900">{eventGroup.eventTitle}</h3>
                <div className="mt-2 sm:mt-0 flex items-center space-x-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <span>{eventGroup.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <span>{eventGroup.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <BuildingOfficeIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <span>{eventGroup.branchName}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <ul role="list" className="divide-y divide-gray-200">
              {eventGroup.assignments.map((assignment) => (
                <li key={assignment.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`
                        flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center
                        ${assignment.status === 'confirmed' ? 'bg-green-100' : 
                          assignment.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'}
                      `}>
                        <UserIcon 
                          className={`h-6 w-6 
                            ${assignment.status === 'confirmed' ? 'text-green-700' : 
                              assignment.status === 'pending' ? 'text-yellow-700' : 'text-red-700'}
                          `} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{assignment.volunteerName}</div>
                        <div className="text-sm text-gray-500">{assignment.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${assignment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          type="button" 
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => setShowAvailableVolunteersFor(
                            showAvailableVolunteersFor === assignment.id ? null : assignment.id
                          )}
                        >
                          {showAvailableVolunteersFor === assignment.id ? 
                            "Hide Volunteers" : "Find Volunteers"}
                        </button>
                        
                        <Link href={`/dashboard/calendar/volunteers/contact/${assignment.volunteerId}`}>
                          <button type="button" className="text-gray-400 hover:text-gray-500">
                            <EnvelopeIcon className="h-5 w-5" />
                          </button>
                        </Link>
                        
                        {assignment.status === 'pending' && (
                          <>
                            <button type="button" className="text-green-600 hover:text-green-900">
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button type="button" className="text-red-600 hover:text-red-900">
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Available Volunteers Panel */}
                  {showAvailableVolunteersFor === assignment.id && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Available Volunteers</h4>
                      {availableVolunteers.length === 0 ? (
                        <p className="text-sm text-gray-500">No volunteers available for this slot.</p>
                      ) : (
                        <ul role="list" className="divide-y divide-gray-200">
                          {availableVolunteers.map((volunteer) => (
                            <li key={volunteer.id} className="py-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <UserIcon className="h-5 w-5 text-indigo-700" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">{volunteer.name}</p>
                                  <div className="flex text-xs text-gray-500 space-x-2">
                                    <span>{volunteer.skills.join(", ")}</span>
                                    <span>•</span>
                                    <span>{volunteer.assignedEvents} events</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                              >
                                Assign
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <Link href={`/dashboard/calendar/${eventGroup.eventId}`}>
                <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View Event Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Available Volunteers Summary */}
      <div className="mt-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Available Volunteers</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul role="list" className="divide-y divide-gray-200">
            {mockVolunteers.map((volunteer) => (
              <li key={volunteer.id} className="px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-indigo-700" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{volunteer.name}</div>
                      <div className="text-sm text-gray-500">{volunteer.skills.join(", ")}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{volunteer.assignedEvents}</span> assignments
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/calendar/volunteers/${volunteer.id}`}>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Details
                        </button>
                      </Link>
                      <Link href={`/dashboard/calendar/volunteers/schedule/${volunteer.id}`}>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                          Schedule
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Skills and Availability Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {volunteer.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                    >
                      {skill}
                    </span>
                  ))}
                  
                  {volunteer.preferredBranches.map((branchId) => (
                    <span 
                      key={branchId} 
                      className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                    >
                      {mockBranches.find(b => b.id === branchId)?.name || branchId}
                    </span>
                  ))}
                </div>
                
                {/* Contact Info */}
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    {volunteer.email}
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    {volunteer.phone}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
