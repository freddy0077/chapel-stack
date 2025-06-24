"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  ChartPieIcon, 
  UserGroupIcon,
  ArrowDownTrayIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import MembershipGrowthChart from '../components/MembershipGrowthChart';
import { Card, Title, Text, Grid, Col, Select, SelectItem, Flex, Subtitle, DateRangePicker } from '@tremor/react';

// Types for branch data
interface Branch {
  id: string;
  name: string;
  location: string;
}

// Mock data
const BRANCHES: Branch[] = [
  { id: 'all', name: 'All Branches', location: 'Organization-wide' },
  { id: 'b1', name: 'Main Campus', location: '123 Main St, Cityville' },
  { id: 'b2', name: 'East Side', location: '456 East Blvd, Cityville' },
  { id: 'b3', name: 'West End', location: '789 West Ave, Cityville' },
  { id: 'b4', name: 'South Chapel', location: '321 South Rd, Cityville' }
];

// Member demographics mock data
const demographicsData = [
  { age: "0-12", count: 670, percentage: 15.6 },
  { age: "13-18", count: 425, percentage: 9.9 },
  { age: "19-25", count: 380, percentage: 8.9 },
  { age: "26-35", count: 720, percentage: 16.8 },
  { age: "36-45", count: 850, percentage: 19.8 },
  { age: "46-55", count: 580, percentage: 13.5 },
  { age: "56-65", count: 420, percentage: 9.8 },
  { age: "66+", count: 242, percentage: 5.7 }
];

export default function MembershipGrowthPage() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedView, setSelectedView] = useState('growth');

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Link href="/dashboard/analytics" className="mr-4">
            <ArrowLeftIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Membership Growth Analytics</h1>
            <p className="mt-1 text-sm text-gray-500">
              Detailed analysis of membership trends across all branches
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
            Download Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="sm:max-w-xs">
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
            Branch
          </label>
          <select
            id="branch"
            name="branch"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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

        <div className="sm:max-w-xs">
          <label htmlFor="view" className="block text-sm font-medium text-gray-700">
            View Type
          </label>
          <select
            id="view"
            name="view"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
          >
            <option value="growth">Growth Trends</option>
            <option value="demographics">Demographics</option>
            <option value="retention">Retention Analysis</option>
          </select>
        </div>
        
        <div className="sm:max-w-xs sm:flex-1">
          <label htmlFor="date-range" className="block text-sm font-medium text-gray-700">
            Date Range
          </label>
          <DateRangePicker
            className="mt-1"
            enableDropdown={true}
            placeholder="Select date range"
          />
        </div>
      </div>

      {/* Growth Chart */}
      <div className="mt-6">
        <MembershipGrowthChart />
      </div>

      {/* Key Metrics */}
      <div className="mt-8">
        <Grid numItems={1} numItemsMd={2} numItemsLg={4} className="gap-6">
          <Card decoration="top" decorationColor="indigo">
            <Text>Total Members</Text>
            <Flex justifyContent="start" alignItems="baseline" className="space-x-2">
              <Title>4,287</Title>
              <Text className="text-emerald-600">+5.2% YoY</Text>
            </Flex>
          </Card>
          <Card decoration="top" decorationColor="emerald">
            <Text>New Members (Last 12mo)</Text>
            <Flex justifyContent="start" alignItems="baseline" className="space-x-2">
              <Title>354</Title>
              <Text className="text-emerald-600">+12.4% YoY</Text>
            </Flex>
          </Card>
          <Card decoration="top" decorationColor="amber">
            <Text>Average Retention Rate</Text>
            <Flex justifyContent="start" alignItems="baseline" className="space-x-2">
              <Title>95.7%</Title>
              <Text className="text-emerald-600">+1.2% YoY</Text>
            </Flex>
          </Card>
          <Card decoration="top" decorationColor="rose">
            <Text>Member Engagement</Text>
            <Flex justifyContent="start" alignItems="baseline" className="space-x-2">
              <Title>78.3%</Title>
              <Text className="text-emerald-600">+3.5% YoY</Text>
            </Flex>
          </Card>
        </Grid>
      </div>

      {/* Demographics Section */}
      <div className="mt-8">
        <Card>
          <Title>Membership Demographics</Title>
          <Subtitle>Age distribution across congregation</Subtitle>
          
          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age Group
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member Count
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % of Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distribution
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {demographicsData.map((group, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {group.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${group.percentage}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Growth Insights */}
      <div className="mt-8">
        <Card>
          <Title>Growth Insights</Title>
          <div className="mt-4 space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <Text className="font-medium">Main Campus Growth</Text>
              <Text className="text-sm text-gray-600">
                The Main Campus has seen a 5.2% increase in membership year-over-year, with the highest growth among young professionals in the 26-35 age range.
              </Text>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md">
              <Text className="font-medium">East Side Rapid Growth</Text>
              <Text className="text-sm text-gray-600">
                The East Side branch is experiencing the fastest growth at 8.3% YoY, likely due to the new family-focused programs introduced in Q1 2025.
              </Text>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-md">
              <Text className="font-medium">West End Retention Challenge</Text>
              <Text className="text-sm text-gray-600">
                While the West End branch is growing at 3.5% YoY, it has the lowest retention rate. The data suggests investment in more diverse programming may help improve retention.
              </Text>
            </div>
            
            <div className="bg-rose-50 p-4 rounded-md">
              <Text className="font-medium">South Chapel Youth Growth</Text>
              <Text className="text-sm text-gray-600">
                The South Chapel has seen a 12.6% increase in youth membership (ages 13-18), the highest youth growth rate across all branches, attributed to their revamped youth ministry program.
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
