"use client";

import { useState } from 'react';
import { UserCircleIcon, CalendarIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

// Mock data for team members
export const mockTeamMembers = [
  {
    id: 1,
    name: "Sarah Williams",
    role: "Worship Leader",
    skills: ["Vocals", "Acoustic Guitar", "Piano"],
    email: "sarah.williams@example.com",
    phone: "(555) 123-4567",
    availability: "Sunday mornings, Wednesday evenings",
    status: "Active",
    scheduledServices: 2
  },
  {
    id: 2,
    name: "David Chen",
    role: "Acoustic Guitar",
    skills: ["Acoustic Guitar", "Electric Guitar", "Bass"],
    email: "david.chen@example.com",
    phone: "(555) 234-5678",
    availability: "Sunday mornings, Sunday evenings",
    status: "Active",
    scheduledServices: 2
  },
  {
    id: 3,
    name: "Michelle Johnson",
    role: "Vocals",
    skills: ["Vocals", "Choir Direction"],
    email: "michelle.johnson@example.com",
    phone: "(555) 345-6789",
    availability: "Sunday mornings, Special events",
    status: "Active",
    scheduledServices: 2
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Drums",
    skills: ["Drums", "Percussion"],
    email: "james.wilson@example.com",
    phone: "(555) 456-7890",
    availability: "Sunday mornings",
    status: "Active",
    scheduledServices: 2
  },
  {
    id: 5,
    name: "Tiffany Rodriguez",
    role: "Keys",
    skills: ["Piano", "Keyboard", "Organ"],
    email: "tiffany.rodriguez@example.com",
    phone: "(555) 567-8901",
    availability: "Sunday mornings, Wednesday evenings",
    status: "Active",
    scheduledServices: 2
  },
  {
    id: 6,
    name: "Thomas Anderson",
    role: "Worship Leader",
    skills: ["Vocals", "Acoustic Guitar"],
    email: "thomas.anderson@example.com",
    phone: "(555) 678-9012",
    availability: "Wednesday evenings",
    status: "Active",
    scheduledServices: 1
  },
  {
    id: 7,
    name: "Lisa Brown",
    role: "Keys",
    skills: ["Piano", "Keyboard"],
    email: "lisa.brown@example.com",
    phone: "(555) 789-0123",
    availability: "Wednesday evenings, Special events",
    status: "Active",
    scheduledServices: 1
  },
  {
    id: 8,
    name: "Mark Taylor",
    role: "Acoustic Guitar",
    skills: ["Acoustic Guitar", "Vocals"],
    email: "mark.taylor@example.com",
    phone: "(555) 890-1234",
    availability: "Wednesday evenings, Sunday evenings",
    status: "Active",
    scheduledServices: 1
  },
  {
    id: 9,
    name: "Robert Davis",
    role: "Bass",
    skills: ["Bass Guitar", "Electric Guitar"],
    email: "robert.davis@example.com",
    phone: "(555) 901-2345",
    availability: "Sunday mornings, Special events",
    status: "Active",
    scheduledServices: 1
  },
  {
    id: 10,
    name: "Jennifer Lopez",
    role: "Violin",
    skills: ["Violin", "Viola"],
    email: "jennifer.lopez@example.com",
    phone: "(555) 012-3456",
    availability: "Special events only",
    status: "Active",
    scheduledServices: 1
  },
  {
    id: 11,
    name: "Marcus Johnson",
    role: "Worship Leader",
    skills: ["Vocals", "Electric Guitar"],
    email: "marcus.johnson@example.com",
    phone: "(555) 123-7890",
    availability: "Youth services, Special events",
    status: "Active",
    scheduledServices: 1
  },
  {
    id: 12,
    name: "Emma Rodriguez",
    role: "Keys",
    skills: ["Piano", "Keyboard", "Vocals"],
    email: "emma.rodriguez@example.com",
    phone: "(555) 234-8901",
    availability: "Youth services, Sunday evenings",
    status: "Active",
    scheduledServices: 1
  }
];

// Mock data for upcoming schedules
export const mockSchedules = [
  {
    id: 1,
    serviceId: 1,
    serviceTitle: "Sunday Morning Service",
    serviceDate: "2025-04-13T10:00:00Z",
    teamMemberId: 1,
    teamMemberName: "Sarah Williams",
    role: "Worship Leader",
    confirmed: true,
    rehearsalDate: "2025-04-12T18:00:00Z"
  },
  {
    id: 2,
    serviceId: 1,
    serviceTitle: "Sunday Morning Service",
    serviceDate: "2025-04-13T10:00:00Z",
    teamMemberId: 2,
    teamMemberName: "David Chen",
    role: "Acoustic Guitar",
    confirmed: true,
    rehearsalDate: "2025-04-12T18:00:00Z"
  },
  {
    id: 3,
    serviceId: 1,
    serviceTitle: "Sunday Morning Service",
    serviceDate: "2025-04-13T10:00:00Z",
    teamMemberId: 3,
    teamMemberName: "Michelle Johnson",
    role: "Vocals",
    confirmed: true,
    rehearsalDate: "2025-04-12T18:00:00Z"
  },
  {
    id: 4,
    serviceId: 1,
    serviceTitle: "Sunday Morning Service",
    serviceDate: "2025-04-13T10:00:00Z",
    teamMemberId: 4,
    teamMemberName: "James Wilson",
    role: "Drums",
    confirmed: false,
    rehearsalDate: "2025-04-12T18:00:00Z"
  },
  {
    id: 5,
    serviceId: 1,
    serviceTitle: "Sunday Morning Service",
    serviceDate: "2025-04-13T10:00:00Z",
    teamMemberId: 5,
    teamMemberName: "Tiffany Rodriguez",
    role: "Keys",
    confirmed: true,
    rehearsalDate: "2025-04-12T18:00:00Z"
  },
  {
    id: 6,
    serviceId: 2,
    serviceTitle: "Wednesday Night Prayer",
    serviceDate: "2025-04-09T19:00:00Z",
    teamMemberId: 6,
    teamMemberName: "Thomas Anderson",
    role: "Worship Leader",
    confirmed: true,
    rehearsalDate: "2025-04-09T18:00:00Z"
  },
  {
    id: 7,
    serviceId: 2,
    serviceTitle: "Wednesday Night Prayer",
    serviceDate: "2025-04-09T19:00:00Z",
    teamMemberId: 7,
    teamMemberName: "Lisa Brown",
    role: "Keys",
    confirmed: true,
    rehearsalDate: "2025-04-09T18:00:00Z"
  },
  {
    id: 8,
    serviceId: 2,
    serviceTitle: "Wednesday Night Prayer",
    serviceDate: "2025-04-09T19:00:00Z",
    teamMemberId: 8,
    teamMemberName: "Mark Taylor",
    role: "Acoustic Guitar",
    confirmed: true,
    rehearsalDate: "2025-04-09T18:00:00Z"
  },
  {
    id: 9,
    serviceId: 3,
    serviceTitle: "Easter Sunday Service",
    serviceDate: "2025-04-20T10:00:00Z",
    teamMemberId: 1,
    teamMemberName: "Sarah Williams",
    role: "Worship Leader",
    confirmed: true,
    rehearsalDate: "2025-04-19T18:00:00Z"
  },
  {
    id: 10,
    serviceId: 3,
    serviceTitle: "Easter Sunday Service",
    serviceDate: "2025-04-20T10:00:00Z",
    teamMemberId: 2,
    teamMemberName: "David Chen",
    role: "Acoustic Guitar",
    confirmed: false,
    rehearsalDate: "2025-04-19T18:00:00Z"
  }
];

export interface TeamMemberProfile {
  id: number;
  name: string;
  role: string;
  skills: string[];
  email: string;
  phone: string;
  availability: string;
  status: 'Active' | 'Inactive';
  scheduledServices: number;
}

export interface Schedule {
  id: number;
  serviceId: number;
  serviceTitle: string;
  serviceDate: string;
  teamMemberId: number;
  teamMemberName: string;
  role: string;
  confirmed: boolean;
  rehearsalDate: string;
}

interface TeamSchedulingProps {
  teamMembers: TeamMemberProfile[];
  schedules: Schedule[];
  onViewTeamMember: (member: TeamMemberProfile) => void;
  onAddTeamMember: () => void;
  onManageSchedule: (serviceId: number) => void;
}

export default function TeamScheduling({ 
  teamMembers, 
  schedules, 
  onViewTeamMember, 
  onAddTeamMember,
  onManageSchedule
}: TeamSchedulingProps) {
  const [activeView, setActiveView] = useState<'team' | 'schedule'>('team');
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('All Skills');

  // Get all unique skills from team members
  const allSkills = ['All Skills', ...new Set(teamMembers.flatMap(member => member.skills))].sort();

  // Filter team members based on search term and skill
  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = skillFilter === 'All Skills' || member.skills.includes(skillFilter);
    
    return matchesSearch && matchesSkill;
  });

  // Group schedules by service
  const schedulesByService = schedules.reduce((acc, schedule) => {
    const key = `${schedule.serviceId}`;
    if (!acc[key]) {
      acc[key] = {
        serviceId: schedule.serviceId,
        serviceTitle: schedule.serviceTitle,
        serviceDate: schedule.serviceDate,
        rehearsalDate: schedule.rehearsalDate,
        team: []
      };
    }
    acc[key].team.push({
      memberId: schedule.teamMemberId,
      memberName: schedule.teamMemberName,
      role: schedule.role,
      confirmed: schedule.confirmed
    });
    return acc;
  }, {} as Record<string, {
    serviceId: number;
    serviceTitle: string;
    serviceDate: string;
    rehearsalDate: string;
    team: Array<{
      memberId: number;
      memberName: string;
      role: string;
      confirmed: boolean;
    }>;
  }>);

  // Convert to array for rendering
  const serviceSchedules = Object.values(schedulesByService).sort((a, b) => {
    return new Date(a.serviceDate).getTime() - new Date(b.serviceDate).getTime();
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Render team view
  const renderTeamView = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          {filteredTeamMembers.length} team members
        </div>
        <button
          type="button"
          onClick={onAddTeamMember}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <UserCircleIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Add Team Member
        </button>
      </div>

      <div className="mt-2 flex flex-col sm:flex-row gap-4">
        <div className="relative rounded-md shadow-sm flex-1">
          <input
            type="text"
            name="search"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search by name or role..."
          />
        </div>
        <div className="w-full sm:w-60">
          <select
            id="skill-filter"
            name="skill-filter"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            {allSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTeamMembers.map((member) => (
          <div
            key={member.id}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                  <UserCircleIcon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <div className="mt-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2">
                  <div className="col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Skills</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex flex-wrap gap-1">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div className="col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Availability</dt>
                    <dd className="mt-1 text-sm text-gray-900">{member.availability}</dd>
                  </div>
                  <div className="col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Scheduled Services</dt>
                    <dd className="mt-1 text-sm text-gray-900">{member.scheduledServices}</dd>
                  </div>
                </dl>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => onViewTeamMember(member)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render schedule view
  const renderScheduleView = () => (
    <div>
      <div className="space-y-8">
        {serviceSchedules.map((service) => (
          <div key={service.serviceId} className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">{service.serviceTitle}</h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <CalendarIcon className="mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                  {formatDate(service.serviceDate)} at {formatTime(service.serviceDate)}
                </div>
                <div className="text-xs text-gray-400 flex items-center">
                  <ClockIcon className="mr-1 h-3 w-3" aria-hidden="true" />
                  Rehearsal: {formatDate(service.rehearsalDate)} at {formatTime(service.rehearsalDate)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onManageSchedule(service.serviceId)}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Manage Team
              </button>
            </div>
            <div className="border-t border-gray-200">
              <ul role="list" className="divide-y divide-gray-200">
                {service.team.map((member) => (
                  <li key={member.memberId} className="px-4 py-4 sm:px-6 flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                        <p className="font-medium text-gray-900">{member.memberName}</p>
                      </div>
                      <p className="text-sm text-gray-500 ml-7">{member.role}</p>
                    </div>
                    <div>
                      {member.confirmed ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          <CheckCircleIcon className="mr-1 h-4 w-4" aria-hidden="true" />
                          Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          <XCircleIcon className="mr-1 h-4 w-4" aria-hidden="true" />
                          Pending
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <div className="sm:hidden">
          <label htmlFor="view-tabs" className="sr-only">
            Select a view
          </label>
          <select
            id="view-tabs"
            name="view-tabs"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={activeView}
            onChange={(e) => setActiveView(e.target.value as 'team' | 'schedule')}
          >
            <option value="team">Team Members</option>
            <option value="schedule">Schedules</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                className={`${
                  activeView === 'team'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                onClick={() => setActiveView('team')}
              >
                Team Members
              </button>
              <button
                className={`${
                  activeView === 'schedule'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                onClick={() => setActiveView('schedule')}
              >
                Schedules
              </button>
            </nav>
          </div>
        </div>
      </div>

      {activeView === 'team' ? renderTeamView() : renderScheduleView()}
    </div>
  );
}
