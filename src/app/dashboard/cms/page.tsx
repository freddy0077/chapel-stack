"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  DocumentTextIcon,
  CalendarIcon,
  MegaphoneIcon,
  UserGroupIcon,
  ChartBarIcon,
  BookOpenIcon,
  DocumentDuplicateIcon,
  PhotoIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import {
  Card,
  Title,
  Text,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Badge,
  AreaChart,
  Select,
  SelectItem,
  TextInput,
  Button,
} from "@tremor/react";

// Content type and metrics data for the dashboard
const contentTypeCounts = [
  { name: 'Sermons', count: 124, icon: BookOpenIcon, color: 'indigo', route: '/dashboard/cms/sermons' },
  { name: 'Events', count: 57, icon: CalendarIcon, color: 'green', route: '/dashboard/cms/events' },
  { name: 'Announcements', count: 42, icon: MegaphoneIcon, color: 'amber', route: '/dashboard/cms/announcements' },
  { name: 'Small Group Resources', count: 35, icon: UserGroupIcon, color: 'blue', route: '/dashboard/cms/resources' },
  { name: 'Ministry Information', count: 18, icon: DocumentTextIcon, color: 'purple', route: '/dashboard/cms/ministries' },
  { name: 'Sacramental Templates', count: 8, icon: DocumentDuplicateIcon, color: 'red', route: '/dashboard/cms/sacramental-templates' },
  { name: 'Pages', count: 31, icon: DocumentTextIcon, color: 'gray', route: '/dashboard/cms/pages' },
  { name: 'Visitor Follow-ups', count: 24, icon: FunnelIcon, color: 'pink', route: '/dashboard/cms/followups' },
];

// Mock data for content performance chart
const contentPerformanceData = [
  { date: 'Jan', Sermons: 250, Events: 180, Announcements: 120, Resources: 90 },
  { date: 'Feb', Sermons: 280, Events: 200, Announcements: 140, Resources: 95 },
  { date: 'Mar', Sermons: 310, Events: 190, Announcements: 150, Resources: 110 },
  { date: 'Apr', Sermons: 340, Events: 240, Announcements: 160, Resources: 130 },
  { date: 'May', Sermons: 390, Events: 280, Announcements: 170, Resources: 150 },
  { date: 'Jun', Sermons: 420, Events: 300, Announcements: 190, Resources: 180 },
  { date: 'Jul', Sermons: 450, Events: 310, Announcements: 210, Resources: 200 },
];

// Mock data for recent content
const recentContent = [
  {
    id: 'content-1',
    title: 'Sunday Sermon: Living with Purpose',
    type: 'sermon',
    author: 'Pastor David Wilson',
    branch: 'Main Campus',
    status: 'published',
    createdAt: new Date(2025, 3, 10),
    views: 382
  },
  {
    id: 'content-2',
    title: 'Youth Summer Camp Registration',
    type: 'event',
    author: 'Sarah Johnson',
    branch: 'Main Campus',
    status: 'published',
    createdAt: new Date(2025, 3, 8),
    views: 543
  },
  {
    id: 'content-3',
    title: 'New Small Group Starting Next Week',
    type: 'announcement',
    author: 'Michael Chen',
    branch: 'East Side Chapel',
    status: 'published',
    createdAt: new Date(2025, 3, 7),
    views: 291
  },
  {
    id: 'content-4',
    title: 'Bible Study Curriculum: Gospel of John',
    type: 'small-group-resource',
    author: 'Rebecca Thomas',
    branch: 'All Branches',
    status: 'published',
    createdAt: new Date(2025, 3, 5),
    views: 176
  },
  {
    id: 'content-5',
    title: 'Volunteer Ministry Overview',
    type: 'ministry-info',
    author: 'James Williams',
    branch: 'West End Community',
    status: 'draft',
    createdAt: new Date(2025, 3, 4),
    views: 0
  }
];

export default function CMSDashboard() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Content Management System
              </h1>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <DocumentTextIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  Manage all church content in one place
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <ChartBarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  Track content performance and engagement
                </div>
              </div>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <Link href="/dashboard/cms/content/new">
                <Button icon={PlusCircleIcon} color="indigo">
                  Create Content
                </Button>
              </Link>
              <Link href="/dashboard/cms/settings">
                <Button icon={Cog6ToothIcon} variant="secondary">
                  CMS Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Branch Filter */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="mr-4 text-lg font-medium text-gray-900">Content Dashboard</h2>
            <Button 
              icon={ArrowPathIcon} 
              variant="light" 
              color="gray"
              className="ml-2"
            >
              Refresh
            </Button>
          </div>
          <div className="w-64">
            <Select
              value={selectedBranch}
              onValueChange={setSelectedBranch}
              placeholder="Filter by Branch"
            >
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="branch-1">Main Campus</SelectItem>
              <SelectItem value="branch-2">East Side Chapel</SelectItem>
              <SelectItem value="branch-3">West End Community</SelectItem>
            </Select>
          </div>
        </div>
      
        {/* Content Type Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {contentTypeCounts.map((type) => (
            <Link key={type.name} href={type.route}>
              <Card decoration="top" decorationColor={type.color as any}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-md bg-${type.color}-100 text-${type.color}-600`}>
                    <type.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <Text>{type.name}</Text>
                    <Title>{type.count}</Title>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        <TabGroup
          index={selectedTab}
          onIndexChange={setSelectedTab}
        >
          <TabList className="mb-6">
            <Tab>Overview</Tab>
            <Tab>Recent Content</Tab>
            <Tab>My Drafts</Tab>
            <Tab>Performance</Tab>
          </TabList>
          
          <TabPanels>
            {/* Overview Tab */}
            <TabPanel>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance at a glance */}
                <div className="lg:col-span-2">
                  <Card>
                    <Title>Content Performance</Title>
                    <Text>Engagement metrics over time</Text>
                    <AreaChart
                      className="h-72 mt-4"
                      data={contentPerformanceData}
                      index="date"
                      categories={["Sermons", "Events", "Announcements", "Resources"]}
                      colors={["indigo", "green", "amber", "blue"]}
                    />
                  </Card>
                </div>
                
                {/* Quick Access */}
                <div className="lg:col-span-1">
                  <Card>
                    <Title>Quick Actions</Title>
                    <Text>Commonly used content tasks</Text>
                    
                    <div className="mt-4 space-y-3">
                      <Link href="/dashboard/cms/content/new?type=sermon">
                        <Button size="sm" icon={BookOpenIcon} color="indigo" className="w-full justify-start">
                          Upload New Sermon
                        </Button>
                      </Link>
                      
                      <Link href="/dashboard/cms/content/new?type=event">
                        <Button size="sm" icon={CalendarIcon} color="green" className="w-full justify-start">
                          Create Event
                        </Button>
                      </Link>
                      
                      <Link href="/dashboard/cms/content/new?type=announcement">
                        <Button size="sm" icon={MegaphoneIcon} color="amber" className="w-full justify-start">
                          Post Announcement
                        </Button>
                      </Link>
                      
                      <Link href="/dashboard/cms/assets">
                        <Button size="sm" icon={PhotoIcon} variant="secondary" className="w-full justify-start">
                          Manage Media Assets
                        </Button>
                      </Link>
                      
                      <Link href="/dashboard/cms/pages">
                        <Button size="sm" icon={DocumentTextIcon} variant="secondary" className="w-full justify-start">
                          Edit Website Pages
                        </Button>
                      </Link>
                    </div>
                  </Card>
                  
                  <Card className="mt-6">
                    <Title>Content Awaiting Review</Title>
                    <Text>Items that need your attention</Text>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <Text>Pending Approval</Text>
                        <Badge color="amber">4</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <Text>Ready to Publish</Text>
                        <Badge color="emerald">7</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <Text>Expiring Soon</Text>
                        <Badge color="red">2</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <Text>Scheduled</Text>
                        <Badge color="blue">12</Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabPanel>
            
            {/* Recent Content Tab */}
            <TabPanel>
              <Card>
                <div className="mb-4 flex justify-between items-center">
                  <Title>Recently Created Content</Title>
                  <div className="w-80">
                    <TextInput 
                      placeholder="Search content..." 
                      icon={DocumentTextIcon}
                    />
                  </div>
                </div>
                
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Author
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Branch
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentContent.map((content) => (
                        <tr key={content.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                              <Link href={`/dashboard/cms/content/${content.id}`}>
                                {content.title}
                              </Link>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              color={
                                content.type === 'sermon' ? 'indigo' :
                                content.type === 'event' ? 'green' :
                                content.type === 'announcement' ? 'amber' :
                                content.type === 'small-group-resource' ? 'blue' :
                                'gray'
                              }
                              size="sm"
                            >
                              {content.type === 'small-group-resource' ? 'Resource' : 
                               content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{content.author}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{content.branch}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              color={content.status === 'published' ? 'emerald' : 'gray'} 
                              size="sm"
                            >
                              {content.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {content.createdAt.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {content.views}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabPanel>
            
            {/* My Drafts Tab */}
            <TabPanel>
              <Card>
                <div className="text-center py-12">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No drafts found</h3>
                  <p className="mt-1 text-gray-500">
                    You don't have any content drafts at the moment.
                  </p>
                  <div className="mt-6">
                    <Link href="/dashboard/cms/content/new">
                      <Button>Create New Content</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </TabPanel>
            
            {/* Performance Tab */}
            <TabPanel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card decoration="top" decorationColor="indigo">
                  <Title>Total Views</Title>
                  <Text>Last 30 days</Text>
                  <Title className="mt-2">8,724</Title>
                  <Text className="text-emerald-500">↑ 12.3% from previous 30 days</Text>
                </Card>
                
                <Card decoration="top" decorationColor="emerald">
                  <Title>Avg. Engagement Time</Title>
                  <Text>Last 30 days</Text>
                  <Title className="mt-2">3:24</Title>
                  <Text className="text-emerald-500">↑ 2.7% from previous 30 days</Text>
                </Card>
                
                <Card decoration="top" decorationColor="blue">
                  <Title>Downloads</Title>
                  <Text>Last 30 days</Text>
                  <Title className="mt-2">1,245</Title>
                  <Text className="text-emerald-500">↑ 8.1% from previous 30 days</Text>
                </Card>
              </div>
              
              <Card>
                <Title>Top Performing Content</Title>
                <Text>Content with highest engagement in the past 30 days</Text>
                
                <div className="mt-6 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg. Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completion Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-indigo-600">
                            Easter Sunday Service: Hope Renewed
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge color="indigo" size="sm">Sermon</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          1,245
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          28:12
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          87%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-indigo-600">
                            Summer Youth Camp Registration
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge color="green" size="sm">Event</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          982
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          4:35
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          92%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-indigo-600">
                            Gospel of John Study Guide
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge color="blue" size="sm">Resource</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          854
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          12:07
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          78%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-indigo-600">
                            Building Fund Campaign Update
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge color="amber" size="sm">Announcement</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          798
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          3:21
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          95%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
