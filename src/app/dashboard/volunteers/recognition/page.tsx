"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  UserIcon, 
  ClockIcon,
  TrophyIcon,
  HandRaisedIcon,
  CalendarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

// Types
interface VolunteerAward {
  id: string;
  name: string;
  description: string;
  criteria: string;
  imageUrl?: string;
}

interface VolunteerRecognition {
  id: string;
  volunteerId: string;
  volunteerName: string;
  email: string;
  totalHours: number;
  currentYearHours: number;
  yearsOfService: number;
  startDate: string;
  branch: string;
  branchId: string;
  awards: {
    awardId: string;
    awardName: string;
    dateAwarded: string;
    presenter?: string;
  }[];
  milestones: {
    type: 'hours' | 'years';
    value: number;
    achievedDate: string;
    celebrated: boolean;
  }[];
  teams: string[];
}

// Mock data
const AWARDS: VolunteerAward[] = [
  {
    id: 'a1',
    name: 'Faithful Servant',
    description: 'Awarded to volunteers who have served over 100 hours in a calendar year',
    criteria: '100+ hours in a calendar year',
    imageUrl: '/images/awards/faithful-servant.png'
  },
  {
    id: 'a2',
    name: 'Dedicated Team Member',
    description: 'Recognizes 5 years of consistent volunteer service',
    criteria: '5+ years of service',
    imageUrl: '/images/awards/dedicated-member.png'
  },
  {
    id: 'a3',
    name: 'Above & Beyond',
    description: 'For volunteers who consistently go beyond what is expected',
    criteria: 'Nominated by ministry leaders',
    imageUrl: '/images/awards/above-beyond.png'
  },
  {
    id: 'a4',
    name: 'Leadership Excellence',
    description: 'Recognizes volunteer team leaders who exemplify servant leadership',
    criteria: 'Team leader for 2+ years with positive team feedback',
    imageUrl: '/images/awards/leadership.png'
  },
  {
    id: 'a5',
    name: 'Cross-Branch Ambassador',
    description: 'For volunteers who serve across multiple branches',
    criteria: 'Regular service at 2+ branches',
    imageUrl: '/images/awards/ambassador.png'
  }
];

const VOLUNTEER_RECOGNITIONS: VolunteerRecognition[] = [
  {
    id: 'r1',
    volunteerId: 'v1',
    volunteerName: 'Michael Smith',
    email: 'michael.smith@example.com',
    totalHours: 487,
    currentYearHours: 56,
    yearsOfService: 3,
    startDate: '2022-03-15',
    branch: 'Main Campus',
    branchId: 'b1',
    awards: [
      {
        awardId: 'a1',
        awardName: 'Faithful Servant',
        dateAwarded: '2023-12-15',
        presenter: 'Pastor Johnson'
      }
    ],
    milestones: [
      {
        type: 'hours',
        value: 100,
        achievedDate: '2022-09-30',
        celebrated: true
      },
      {
        type: 'hours',
        value: 250,
        achievedDate: '2023-06-12',
        celebrated: true
      }
    ],
    teams: ['Worship Team', 'Tech Team']
  },
  {
    id: 'r2',
    volunteerId: 'v2',
    volunteerName: 'Sarah Davis',
    email: 'sarah.davis@example.com',
    totalHours: 623,
    currentYearHours: 78,
    yearsOfService: 4,
    startDate: '2021-05-22',
    branch: 'East Side',
    branchId: 'b2',
    awards: [
      {
        awardId: 'a1',
        awardName: 'Faithful Servant',
        dateAwarded: '2022-12-10',
        presenter: 'Pastor Williams'
      },
      {
        awardId: 'a3',
        awardName: 'Above & Beyond',
        dateAwarded: '2023-11-05',
        presenter: 'Pastor Williams'
      }
    ],
    milestones: [
      {
        type: 'hours',
        value: 100,
        achievedDate: '2021-12-31',
        celebrated: true
      },
      {
        type: 'hours',
        value: 250,
        achievedDate: '2022-08-15',
        celebrated: true
      },
      {
        type: 'hours',
        value: 500,
        achievedDate: '2023-09-01',
        celebrated: true
      }
    ],
    teams: ['Children\'s Ministry', 'Hospitality Team']
  },
  {
    id: 'r3',
    volunteerId: 'v3',
    volunteerName: 'James Wilson',
    email: 'james.wilson@example.com',
    totalHours: 925,
    currentYearHours: 45,
    yearsOfService: 7,
    startDate: '2018-02-10',
    branch: 'Main Campus',
    branchId: 'b1',
    awards: [
      {
        awardId: 'a1',
        awardName: 'Faithful Servant',
        dateAwarded: '2019-12-10',
        presenter: 'Pastor Johnson'
      },
      {
        awardId: 'a2',
        awardName: 'Dedicated Team Member',
        dateAwarded: '2023-02-10',
        presenter: 'Pastor Johnson'
      },
      {
        awardId: 'a4',
        awardName: 'Leadership Excellence',
        dateAwarded: '2022-05-15',
        presenter: 'Michael Davis'
      }
    ],
    milestones: [
      {
        type: 'hours',
        value: 100,
        achievedDate: '2018-12-31',
        celebrated: true
      },
      {
        type: 'hours',
        value: 500,
        achievedDate: '2020-06-30',
        celebrated: true
      },
      {
        type: 'years',
        value: 5,
        achievedDate: '2023-02-10',
        celebrated: true
      }
    ],
    teams: ['Deacon Board', 'Outreach Team']
  },
  {
    id: 'r4',
    volunteerId: 'v6',
    volunteerName: 'Jennifer Miller',
    email: 'jennifer.miller@example.com',
    totalHours: 342,
    currentYearHours: 86,
    yearsOfService: 2,
    startDate: '2023-01-15',
    branch: 'West End',
    branchId: 'b3',
    awards: [
      {
        awardId: 'a5',
        awardName: 'Cross-Branch Ambassador',
        dateAwarded: '2024-03-01',
        presenter: 'Jennifer Lee'
      }
    ],
    milestones: [
      {
        type: 'hours',
        value: 100,
        achievedDate: '2023-07-31',
        celebrated: true
      },
      {
        type: 'hours',
        value: 250,
        achievedDate: '2024-02-15',
        celebrated: true
      }
    ],
    teams: ['Welcome Team', 'Prayer Team']
  },
  {
    id: 'r5',
    volunteerId: 'v5',
    volunteerName: 'David Anderson',
    email: 'david.anderson@example.com',
    totalHours: 1235,
    currentYearHours: 112,
    yearsOfService: 8,
    startDate: '2017-06-01',
    branch: 'Main Campus',
    branchId: 'b1',
    awards: [
      {
        awardId: 'a1',
        awardName: 'Faithful Servant',
        dateAwarded: '2018-12-15',
        presenter: 'Pastor Johnson'
      },
      {
        awardId: 'a2',
        awardName: 'Dedicated Team Member',
        dateAwarded: '2022-06-01',
        presenter: 'Pastor Johnson'
      },
      {
        awardId: 'a4',
        awardName: 'Leadership Excellence',
        dateAwarded: '2020-05-15',
        presenter: 'Michael Davis'
      }
    ],
    milestones: [
      {
        type: 'hours',
        value: 500,
        achievedDate: '2019-12-31',
        celebrated: true
      },
      {
        type: 'hours',
        value: 1000,
        achievedDate: '2022-03-15',
        celebrated: true
      },
      {
        type: 'years',
        value: 5,
        achievedDate: '2022-06-01',
        celebrated: true
      }
    ],
    teams: ['Worship Team', 'Choir']
  }
];

// Branch data
const BRANCHES = [
  { id: 'all', name: 'All Branches' },
  { id: 'b1', name: 'Main Campus' },
  { id: 'b2', name: 'East Side' },
  { id: 'b3', name: 'West End' },
  { id: 'b4', name: 'South Chapel' }
];

export default function VolunteerRecognitionPage() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [upcomingMilestones, setUpcomingMilestones] = useState<any[]>([]);
  
  // Filter recognitions based on branch and search
  const filteredRecognitions = VOLUNTEER_RECOGNITIONS.filter(recognition => {
    // Branch filter
    if (selectedBranch !== 'all' && recognition.branchId !== selectedBranch) {
      return false;
    }
    
    // Search term filter
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      return (
        recognition.volunteerName.toLowerCase().includes(search) ||
        recognition.email.toLowerCase().includes(search) ||
        recognition.teams.some(team => team.toLowerCase().includes(search))
      );
    }
    
    return true;
  });
  
  // Sort by total hours (descending)
  const sortedRecognitions = [...filteredRecognitions].sort((a, b) => b.totalHours - a.totalHours);
  
  // Calculate upcoming milestones (for a real app, this would be generated based on actual data)
  const getUpcomingMilestones = () => {
    return [
      {
        volunteerId: 'v2',
        volunteerName: 'Sarah Davis',
        milestone: 'Will reach 5 years of service',
        date: 'May 22, 2025',
        branch: 'East Side'
      },
      {
        volunteerId: 'v6',
        volunteerName: 'Jennifer Miller',
        milestone: 'Approaching 500 service hours',
        date: 'June 2025 (estimated)',
        branch: 'West End'
      },
      {
        volunteerId: 'v1',
        volunteerName: 'Michael Smith',
        milestone: 'Approaching 500 service hours',
        date: 'May 2025 (estimated)',
        branch: 'Main Campus'
      }
    ];
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate total statistics
  const totalVolunteerHours = VOLUNTEER_RECOGNITIONS.reduce((sum, v) => sum + v.totalHours, 0);
  const avgYearsOfService = Math.round(VOLUNTEER_RECOGNITIONS.reduce((sum, v) => sum + v.yearsOfService, 0) / VOLUNTEER_RECOGNITIONS.length);
  const totalAwardsGiven = VOLUNTEER_RECOGNITIONS.reduce((sum, v) => sum + v.awards.length, 0);
  
  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Volunteer Recognition</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track service hours and recognize volunteer contributions
          </p>
        </div>
        <Link
          href="/dashboard/volunteers/recognition/awards/new"
          className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Present Award
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Volunteer Hours</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{totalVolunteerHours.toLocaleString()}</div>
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
                <CalendarIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Years of Service</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{avgYearsOfService}</div>
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
                <TrophyIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Awards Presented</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{totalAwardsGiven}</div>
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
                <UserIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Volunteers</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{VOLUNTEER_RECOGNITIONS.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            className="block w-full pr-3 py-2 pl-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search volunteers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="sm:max-w-xs">
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
      </div>

      {/* Main Content - Split into two columns on larger screens */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Volunteer Service Hours - Takes up 2/3 on larger screens */}
        <div className="lg:col-span-2 bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Volunteer Service Hours</h3>
            <p className="mt-1 text-sm text-gray-500">Sorted by total hours contributed</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volunteer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Years of Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Awards
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedRecognitions.map((recognition) => (
                  <tr key={recognition.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{recognition.volunteerName}</div>
                          <div className="text-xs text-gray-500">{recognition.teams.join(', ')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{recognition.totalHours}</div>
                      <div className="text-xs text-gray-500">{recognition.currentYearHours} this year</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{recognition.yearsOfService} years</div>
                      <div className="text-xs text-gray-500">Since {formatDate(recognition.startDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-1.5" aria-hidden="true" />
                        <span className="text-sm text-gray-900">{recognition.branch}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {recognition.awards.map((award, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            <TrophyIcon className="h-3 w-3 mr-1" />
                            {award.awardName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/dashboard/volunteers/recognition/${recognition.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Sections - Takes up 1/3 on larger screens */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upcoming Recognition */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Milestones</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {getUpcomingMilestones().map((milestone, index) => (
                <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HandRaisedIcon className="h-5 w-5 text-yellow-500 mr-2" />
                      <p className="text-sm font-medium text-gray-900">{milestone.volunteerName}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {milestone.branch}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{milestone.milestone}</p>
                    <p className="text-xs text-gray-400 mt-1">{milestone.date}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
              <Link href="/dashboard/volunteers/recognition/milestones" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View all upcoming milestones
              </Link>
            </div>
          </div>

          {/* Award Categories */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recognition Awards</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {AWARDS.map((award) => (
                <li key={award.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center">
                    <TrophyIcon className="h-5 w-5 text-yellow-500 mr-2" />
                    <p className="text-sm font-medium text-gray-900">{award.name}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{award.description}</p>
                  <p className="mt-1 text-xs text-gray-400">Criteria: {award.criteria}</p>
                </li>
              ))}
            </ul>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
              <Link href="/dashboard/volunteers/recognition/awards/manage" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Manage award categories
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recognition Events */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Volunteer Appreciation Events</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Plan and schedule recognition events to celebrate your volunteers' contributions.
              These events can be branch-specific or organization-wide.
            </p>
          </div>
          <div className="mt-5">
            <Link
              href="/dashboard/volunteers/recognition/events"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Recognition Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
