"use client";

import { useState } from 'react';
import { 
  UserIcon, 
  MagnifyingGlassIcon, 
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

// Staff member interface
interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  branch: string;
  branchId: string;
  imageUrl?: string;
  bio?: string;
  startDate: string;
  roles: string[];
  status: 'active' | 'on-leave' | 'former';
}

// Branch interface
interface Branch {
  id: string;
  name: string;
}

// Department interface
interface Department {
  id: string;
  name: string;
}

// Mock branches
const BRANCHES: Branch[] = [
  { id: 'all', name: 'All Branches' },
  { id: 'b1', name: 'Main Campus' },
  { id: 'b2', name: 'East Side' },
  { id: 'b3', name: 'West End' },
  { id: 'b4', name: 'South Chapel' }
];

// Mock departments
const DEPARTMENTS: Department[] = [
  { id: 'all', name: 'All Departments' },
  { id: 'd1', name: 'Pastoral' },
  { id: 'd2', name: 'Worship' },
  { id: 'd3', name: 'Children & Youth' },
  { id: 'd4', name: 'Administrative' },
  { id: 'd5', name: 'Outreach' },
  { id: 'd6', name: 'Technical' }
];

// Mock staff data
const STAFF_MEMBERS: StaffMember[] = [
  {
    id: 's1',
    name: 'Pastor John Wilson',
    email: 'john.wilson@church.org',
    phone: '(555) 123-4567',
    position: 'Senior Pastor',
    department: 'Pastoral',
    branch: 'Main Campus',
    branchId: 'b1',
    imageUrl: '/images/staff/john-wilson.jpg',
    bio: 'Pastor John has been leading our church for over 15 years. He has a passion for teaching the Word and mentoring leaders.',
    startDate: '2010-06-15',
    roles: ['Senior Leadership', 'Teaching', 'Vision Casting'],
    status: 'active'
  },
  {
    id: 's2',
    name: 'Sarah Miller',
    email: 'sarah.miller@church.org',
    phone: '(555) 234-5678',
    position: 'Worship Director',
    department: 'Worship',
    branch: 'Main Campus',
    branchId: 'b1',
    imageUrl: '/images/staff/sarah-miller.jpg',
    bio: 'Sarah leads our worship ministry with excellence and a heart for serving the congregation.',
    startDate: '2015-03-20',
    roles: ['Worship Leading', 'Music Training', 'Sunday Services'],
    status: 'active'
  },
  {
    id: 's3',
    name: 'David Thompson',
    email: 'david.thompson@church.org',
    phone: '(555) 345-6789',
    position: 'Youth Pastor',
    department: 'Children & Youth',
    branch: 'East Side',
    branchId: 'b2',
    imageUrl: '/images/staff/david-thompson.jpg',
    bio: 'David has a passion for helping young people grow in their faith and develop as leaders.',
    startDate: '2018-08-05',
    roles: ['Youth Ministry', 'Mentoring', 'Camp Planning'],
    status: 'active'
  },
  {
    id: 's4',
    name: 'Rebecca Johnson',
    email: 'rebecca.johnson@church.org',
    phone: '(555) 456-7890',
    position: 'Children\'s Director',
    department: 'Children & Youth',
    branch: 'Main Campus',
    branchId: 'b1',
    imageUrl: '/images/staff/rebecca-johnson.jpg',
    bio: 'Rebecca creates engaging programs that help children understand God\'s love for them.',
    startDate: '2017-01-10',
    roles: ['Children\'s Ministry', 'Curriculum Development', 'Volunteer Training'],
    status: 'active'
  },
  {
    id: 's5',
    name: 'Michael Davis',
    email: 'michael.davis@church.org',
    phone: '(555) 567-8901',
    position: 'Executive Director',
    department: 'Administrative',
    branch: 'Main Campus',
    branchId: 'b1',
    imageUrl: '/images/staff/michael-davis.jpg',
    bio: 'Michael oversees the day-to-day operations of our church, ensuring everything runs smoothly.',
    startDate: '2012-05-15',
    roles: ['Operations', 'HR Management', 'Finance Oversight'],
    status: 'active'
  },
  {
    id: 's6',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@church.org',
    phone: '(555) 678-9012',
    position: 'Campus Pastor',
    department: 'Pastoral',
    branch: 'West End',
    branchId: 'b3',
    imageUrl: '/images/staff/jennifer-lee.jpg',
    bio: 'Jennifer leads our West End campus with a heart for the local community and spiritual growth.',
    startDate: '2016-11-01',
    roles: ['Campus Leadership', 'Preaching', 'Community Outreach'],
    status: 'active'
  },
  {
    id: 's7',
    name: 'Robert Brown',
    email: 'robert.brown@church.org',
    phone: '(555) 789-0123',
    position: 'Technical Director',
    department: 'Technical',
    branch: 'Main Campus',
    branchId: 'b1',
    imageUrl: '/images/staff/robert-brown.jpg',
    bio: 'Robert ensures that our audio, video, and streaming systems work perfectly for all services.',
    startDate: '2019-02-15',
    roles: ['Audio/Visual', 'Live Streaming', 'Equipment Maintenance'],
    status: 'active'
  },
  {
    id: 's8',
    name: 'Amanda Clark',
    email: 'amanda.clark@church.org',
    phone: '(555) 890-1234',
    position: 'Outreach Coordinator',
    department: 'Outreach',
    branch: 'South Chapel',
    branchId: 'b4',
    imageUrl: '/images/staff/amanda-clark.jpg',
    bio: 'Amanda coordinates our local and global missions, helping our church serve those in need.',
    startDate: '2020-07-10',
    roles: ['Mission Trips', 'Local Service', 'Community Partnerships'],
    status: 'active'
  },
  {
    id: 's9',
    name: 'Kevin Martinez',
    email: 'kevin.martinez@church.org',
    phone: '(555) 901-2345',
    position: 'Campus Pastor',
    department: 'Pastoral',
    branch: 'East Side',
    branchId: 'b2',
    imageUrl: '/images/staff/kevin-martinez.jpg',
    bio: 'Kevin leads our East Side campus with a passion for discipleship and community building.',
    startDate: '2017-09-01',
    roles: ['Campus Leadership', 'Pastoral Care', 'Leadership Development'],
    status: 'active'
  },
  {
    id: 's10',
    name: 'Lisa Wright',
    email: 'lisa.wright@church.org',
    phone: '(555) 012-3456',
    position: 'Communications Director',
    department: 'Administrative',
    branch: 'Main Campus',
    branchId: 'b1',
    imageUrl: '/images/staff/lisa-wright.jpg',
    bio: 'Lisa manages all church communications, ensuring our message reaches the community effectively.',
    startDate: '2018-04-15',
    roles: ['Marketing', 'Social Media', 'Graphic Design'],
    status: 'on-leave'
  }
];

export default function StaffDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [expandedStaff, setExpandedStaff] = useState<string | null>(null);

  // Filter staff based on search term, branch, and department
  const filteredStaff = STAFF_MEMBERS.filter(staff => {
    // Branch filter
    if (selectedBranch !== 'all' && staff.branchId !== selectedBranch) {
      return false;
    }
    
    // Department filter
    if (selectedDepartment !== 'all' && staff.department !== DEPARTMENTS.find(d => d.id === selectedDepartment)?.name) {
      return false;
    }
    
    // Search term filter (case insensitive)
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      return (
        staff.name.toLowerCase().includes(search) || 
        staff.position.toLowerCase().includes(search) ||
        staff.department.toLowerCase().includes(search) ||
        staff.branch.toLowerCase().includes(search) ||
        staff.roles.some(role => role.toLowerCase().includes(search))
      );
    }
    
    return true;
  });

  const toggleExpand = (id: string) => {
    if (expandedStaff === id) {
      setExpandedStaff(null);
    } else {
      setExpandedStaff(id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Staff Directory</h1>
            <p className="mt-2 text-sm text-gray-700">
              View and manage staff across all church branches
            </p>
          </div>
          <a
            href="/dashboard/staff/new"
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <UserIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Staff Member
          </a>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search staff by name, position, or role..."
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
          
          <div className="flex-1 md:max-w-xs">
            <select
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {DEPARTMENTS.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Staff List */}
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          {filteredStaff.length > 0 ? (
            filteredStaff.map((staff) => (
              <div key={staff.id} className="p-6">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpand(staff.id)}
                >
                  <div className="flex items-center">
                    {staff.imageUrl ? (
                      <img
                        className="h-16 w-16 rounded-full object-cover"
                        src={staff.imageUrl}
                        alt={staff.name}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                      </div>
                    )}
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{staff.name}</h3>
                      <p className="text-sm text-gray-500">{staff.position}</p>
                      <div className="flex items-center mt-1">
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-1" aria-hidden="true" />
                        <span className="text-xs text-gray-500">{staff.branch}</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-xs text-gray-500">{staff.department}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${staff.status === 'active' ? 'bg-green-100 text-green-800' : 
                          staff.status === 'on-leave' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}
                    >
                      {staff.status === 'active' ? 'Active' : 
                       staff.status === 'on-leave' ? 'On Leave' : 'Former'}
                    </span>
                    {expandedStaff === staff.id ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-400 ml-4" aria-hidden="true" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400 ml-4" aria-hidden="true" />
                    )}
                  </div>
                </div>
                
                {expandedStaff === staff.id && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                          <a href={`mailto:${staff.email}`} className="text-sm text-indigo-600 hover:text-indigo-900">
                            {staff.email}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                          <a href={`tel:${staff.phone}`} className="text-sm text-indigo-600 hover:text-indigo-900">
                            {staff.phone}
                          </a>
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-medium text-gray-900 mb-2 mt-4">Roles & Responsibilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {staff.roles.map((role, index) => (
                          <span 
                            key={index}
                            className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Bio</h4>
                      <p className="text-sm text-gray-500">{staff.bio || 'No bio available.'}</p>
                      
                      <div className="mt-4 flex justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Joined</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(staff.startDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <a
                            href={`/dashboard/staff/edit/${staff.id}`}
                            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-900"
                          >
                            Edit Profile
                          </a>
                          <a
                            href={`/dashboard/staff/schedule/${staff.id}`}
                            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-900"
                          >
                            View Schedule
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No staff members found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
