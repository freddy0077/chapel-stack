"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  UserIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import {
  Card,
  Select,
  SelectItem,
  Button,
  Badge,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from "@tremor/react";

// Types
interface Group {
  id: string;
  name: string;
  members: number;
  leader: string;
  meetingDay: string;
  type: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
  skills: string[];
  roleStatus: 'leader' | 'assistant' | 'member';
  trainingStatus: 'completed' | 'in-progress' | 'not-started';
  notes?: string;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  moduleType: 'video' | 'document' | 'quiz';
  duration: string;
  required: boolean;
}

// Mock data
const mockGroups: Group[] = [
  { id: '1', name: 'Young Adults Bible Study', members: 15, leader: 'Michael Chen', meetingDay: 'Tuesday', type: 'Bible Study' },
  { id: '2', name: 'Prayer Warriors', members: 12, leader: 'Sarah Johnson', meetingDay: 'Thursday', type: 'Prayer' },
  { id: '3', name: 'Men\'s Fellowship', members: 18, leader: 'Marcus Williams', meetingDay: 'Saturday', type: 'Fellowship' },
  { id: '4', name: 'Women\'s Bible Study', members: 21, leader: 'Rebecca Thomas', meetingDay: 'Monday', type: 'Bible Study' },
  { id: '5', name: 'College Ministry', members: 25, leader: 'David Patel', meetingDay: 'Wednesday', type: 'Outreach' },
  { id: '6', name: 'Seniors Group', members: 14, leader: 'Elizabeth Warren', meetingDay: 'Friday', type: 'Fellowship' },
];

// Mock members with leadership info
const mockMembers: Record<string, Member[]> = {
  '1': [
    { 
      id: '101', 
      name: 'Michael Chen', 
      email: 'michael@example.com', 
      phone: '555-0001', 
      joined: '2023-01-15', 
      skills: ['Teaching', 'Organization', 'Public Speaking'],
      roleStatus: 'leader',
      trainingStatus: 'completed',
      notes: 'Experienced Bible study leader, 5+ years'
    },
    { 
      id: '102', 
      name: 'Taylor Swift', 
      email: 'taylor@example.com', 
      phone: '555-2345', 
      joined: '2023-02-10', 
      skills: ['Music', 'Administration'],
      roleStatus: 'assistant',
      trainingStatus: 'completed'
    },
    { 
      id: '103', 
      name: 'Jordan Lee', 
      email: 'jordan@example.com', 
      phone: '555-3456', 
      joined: '2023-05-20', 
      skills: ['Prayer', 'Hospitality'],
      roleStatus: 'member',
      trainingStatus: 'in-progress'
    },
    { 
      id: '104', 
      name: 'Morgan Chen', 
      email: 'morgan@example.com', 
      phone: '555-4567', 
      joined: '2023-06-15', 
      skills: ['Teaching', 'Counseling'],
      roleStatus: 'member',
      trainingStatus: 'not-started'
    }
  ],
  '2': [
    { 
      id: '201', 
      name: 'Sarah Johnson', 
      email: 'sarah@example.com', 
      phone: '555-0002', 
      joined: '2022-11-05', 
      skills: ['Prayer', 'Encouragement', 'Hospitality'],
      roleStatus: 'leader',
      trainingStatus: 'completed'
    },
    { 
      id: '202', 
      name: 'Sam Rodriguez', 
      email: 'sam@example.com', 
      phone: '555-2222', 
      joined: '2023-01-20', 
      skills: ['Administration', 'Pastoral Care'],
      roleStatus: 'assistant',
      trainingStatus: 'completed'
    }
  ]
};

// Mock leadership training modules
const mockTrainingModules: TrainingModule[] = [
  {
    id: 'trn1',
    title: 'Group Leadership Fundamentals',
    description: 'Core principles of leading a small group effectively',
    moduleType: 'video',
    duration: '45 min',
    required: true
  },
  {
    id: 'trn2',
    title: 'Facilitating Discussions',
    description: 'How to guide productive discussions in your group',
    moduleType: 'video',
    duration: '30 min',
    required: true
  },
  {
    id: 'trn3',
    title: 'Pastoral Care Basics',
    description: 'Fundamentals of caring for group members',
    moduleType: 'document',
    duration: '25 min',
    required: true
  },
  {
    id: 'trn4',
    title: 'Conflict Resolution',
    description: 'Managing disagreements within your group',
    moduleType: 'video',
    duration: '35 min',
    required: true
  },
  {
    id: 'trn5',
    title: 'Leadership Assessment',
    description: 'Quiz to evaluate your leadership readiness',
    moduleType: 'quiz',
    duration: '20 min',
    required: true
  }
];

export default function GroupLeadershipManagement() {
  const [selectedGroup, setSelectedGroup] = useState<string>(mockGroups[0]?.id || '');
  const [selectedTab, setSelectedTab] = useState<number>(0);
  
  // Get group members
  const groupMembers = selectedGroup ? (mockMembers[selectedGroup] || []) : [];
  
  // Get current leader and assistants
  const currentLeader = groupMembers.find(m => m.roleStatus === 'leader');
  const assistantLeaders = groupMembers.filter(m => m.roleStatus === 'assistant');
  const potentialLeaders = groupMembers.filter(m => m.roleStatus === 'member' && m.trainingStatus !== 'not-started');
  
  // Promote member function (mock)
  const promoteMember = (memberId: string, role: 'leader' | 'assistant') => {
    // In a real app, this would update the backend
    alert(`${memberId} promoted to ${role}`);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Group Leadership Management
              </h1>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  Assign and manage group leaders
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <AcademicCapIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  Leader training and development
                </div>
              </div>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link href="/dashboard/groups">
                <Button variant="secondary" className="mr-3">
                  Back to Groups
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Group selection sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Groups
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a group to manage leadership
                </p>
              </div>
              <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {mockGroups.map((group) => (
                  <li key={group.id}>
                    <button
                      onClick={() => setSelectedGroup(group.id)}
                      className={`w-full px-4 py-4 flex items-center hover:bg-gray-50 transition-colors duration-150 ease-in-out ${
                        selectedGroup === group.id ? 'bg-indigo-50' : ''
                      }`}
                    >
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        selectedGroup === group.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <UserGroupIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4 text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {group.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Leader: {group.leader}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Leadership management */}
          <div className="lg:col-span-3">
            {selectedGroup ? (
              <div>
                <Card>
                  <TabGroup 
                    index={selectedTab} 
                    onIndexChange={setSelectedTab}
                  >
                    <TabList>
                      <Tab>Current Leadership</Tab>
                      <Tab>Leadership Training</Tab>
                      <Tab>Leadership Reports</Tab>
                    </TabList>
                    <TabPanels>
                      {/* Current Leadership Tab */}
                      <TabPanel>
                        <div className="space-y-6 mt-6">
                          {/* Current leader */}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Leader</h3>
                            {currentLeader ? (
                              <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <UserIcon className="h-6 w-6" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="flex items-center">
                                      <h4 className="text-lg font-medium text-gray-900">{currentLeader.name}</h4>
                                      <Badge color="indigo" size="sm" className="ml-2">
                                        Leader
                                      </Badge>
                                    </div>
                                    <div className="mt-1 flex items-center">
                                      <div className="text-sm text-gray-500 mr-4">
                                        <span className="block">Email: {currentLeader.email}</span>
                                        <span className="block mt-1">Phone: {currentLeader.phone}</span>
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        <span className="block">Joined: {currentLeader.joined}</span>
                                        <span className="block mt-1">
                                          Training: 
                                          <Badge 
                                            color={
                                              currentLeader.trainingStatus === 'completed' ? 'emerald' : 
                                              currentLeader.trainingStatus === 'in-progress' ? 'amber' : 'red'
                                            } 
                                            size="xs" 
                                            className="ml-1"
                                          >
                                            {currentLeader.trainingStatus.replace(/-/g, ' ')}
                                          </Badge>
                                        </span>
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <span className="text-sm font-medium text-gray-700">Skills:</span>
                                      <div className="mt-1 flex flex-wrap gap-1">
                                        {currentLeader.skills.map((skill, index) => (
                                          <Badge key={index} color="gray" size="sm">
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    {currentLeader.notes && (
                                      <div className="mt-2 text-sm text-gray-600 italic">
                                        "{currentLeader.notes}"
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="flex">
                                  <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">No leader assigned</h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                      <p>This group currently has no designated leader.</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Assistant leaders */}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Assistant Leaders</h3>
                            {assistantLeaders.length > 0 ? (
                              <div className="space-y-4">
                                {assistantLeaders.map(assistant => (
                                  <div key={assistant.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start">
                                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <UserIcon className="h-6 w-6" />
                                      </div>
                                      <div className="ml-4">
                                        <div className="flex items-center">
                                          <h4 className="text-md font-medium text-gray-900">{assistant.name}</h4>
                                          <Badge color="blue" size="sm" className="ml-2">
                                            Assistant
                                          </Badge>
                                        </div>
                                        <div className="mt-1 flex items-center">
                                          <div className="text-sm text-gray-500 mr-4">
                                            <span className="block">Email: {assistant.email}</span>
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            <span className="block">
                                              Training: 
                                              <Badge 
                                                color={
                                                  assistant.trainingStatus === 'completed' ? 'emerald' : 
                                                  assistant.trainingStatus === 'in-progress' ? 'amber' : 'red'
                                                } 
                                                size="xs" 
                                                className="ml-1"
                                              >
                                                {assistant.trainingStatus.replace(/-/g, ' ')}
                                              </Badge>
                                            </span>
                                          </div>
                                        </div>
                                        <div className="mt-2 flex space-x-2">
                                          <Button size="xs" variant="secondary" onClick={() => promoteMember(assistant.id, 'leader')}>
                                            Promote to Leader
                                          </Button>
                                          <Button size="xs" variant="light" color="red">
                                            Remove Role
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <p className="text-gray-500">No assistant leaders assigned</p>
                                <Button size="xs" className="mt-2">
                                  Add Assistant Leader
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          {/* Potential leaders */}
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-medium text-gray-900">Potential Leaders</h3>
                              <Button size="xs">
                                Add from Members
                              </Button>
                            </div>
                            
                            {potentialLeaders.length > 0 ? (
                              <div className="bg-white overflow-hidden shadow rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Skills
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Training
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {potentialLeaders.map(member => (
                                      <tr key={member.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex flex-wrap gap-1">
                                            {member.skills.map((skill, index) => (
                                              <Badge key={index} color="gray" size="sm">
                                                {skill}
                                              </Badge>
                                            ))}
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <Badge 
                                            color={
                                              member.trainingStatus === 'completed' ? 'emerald' : 
                                              member.trainingStatus === 'in-progress' ? 'amber' : 'red'
                                            }
                                          >
                                            {member.trainingStatus.replace(/-/g, ' ')}
                                          </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                          <div className="flex space-x-2">
                                            <Button size="xs" color="blue" onClick={() => promoteMember(member.id, 'assistant')}>
                                              Make Assistant
                                            </Button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="bg-gray-50 p-4 rounded-lg text-center">
                                <p className="text-gray-500">No potential leaders identified</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabPanel>
                      
                      {/* Leadership Training Tab */}
                      <TabPanel>
                        <div className="space-y-6 mt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Leadership Training Modules</h3>
                            <Badge color="indigo" icon={CheckCircleIcon}>
                              5 Modules Required
                            </Badge>
                          </div>
                          
                          <div className="bg-white overflow-hidden shadow rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Module
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Required
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {mockTrainingModules.map(module => (
                                  <tr key={module.id}>
                                    <td className="px-6 py-4">
                                      <div className="text-sm font-medium text-gray-900">{module.title}</div>
                                      <div className="text-sm text-gray-500">{module.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <Badge 
                                        color={
                                          module.moduleType === 'video' ? 'blue' : 
                                          module.moduleType === 'document' ? 'amber' : 'indigo'
                                        }
                                      >
                                        {module.moduleType}
                                      </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {module.duration}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {module.required ? 'Yes' : 'Optional'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <Button size="xs">
                                        View Module
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <AcademicCapIcon className="h-5 w-5 text-indigo-400" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-indigo-800">
                                  Leadership Development Program
                                </h3>
                                <div className="mt-2 text-sm text-indigo-700">
                                  <p>Our comprehensive leadership training program prepares group members for leadership roles.</p>
                                  <p className="mt-1">Members must complete all required modules before being eligible for leadership positions.</p>
                                </div>
                                <div className="mt-3">
                                  <Button size="xs" icon={DocumentTextIcon}>
                                    Download Leadership Guide
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                      
                      {/* Leadership Reports Tab */}
                      <TabPanel>
                        <div className="space-y-6 mt-6">
                          <div className="text-center py-12">
                            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">Leadership Reports</h3>
                            <p className="mt-1 text-gray-500 max-w-md mx-auto">
                              Generate reports and insights about leadership effectiveness and engagement across all groups.
                            </p>
                            <div className="mt-6">
                              <Button>
                                Generate Reports
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                </Card>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No group selected</h3>
                <p className="mt-1 text-gray-500">
                  Please select a group from the list to manage leadership.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
