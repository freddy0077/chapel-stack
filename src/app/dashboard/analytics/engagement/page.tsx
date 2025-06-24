"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  ArrowDownTrayIcon,
  ChartPieIcon,
  UsersIcon,
  PuzzlePieceIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import MinistryEngagementTracker from '../components/MinistryEngagementTracker';
import { Card, Title, Text, BarList, Grid, Col, Select, SelectItem, Flex, Subtitle } from '@tremor/react';

// Mock ministry categories
const ministryCategories = [
  { name: "All Categories", value: "all" },
  { name: "Worship", value: "worship" },
  { name: "Education", value: "education" },
  { name: "Outreach", value: "outreach" },
  { name: "Fellowship", value: "fellowship" },
  { name: "Administration", value: "administration" }
];

// Mock top ministries by engagement
const topMinistries = [
  { name: "Adult Bible Study", value: 281 },
  { name: "Children's Ministry", value: 159 },
  { name: "Worship Team", value: 90 },
  { name: "Outreach & Missions", value: 182 },
  { name: "Youth Group", value: 147 },
  { name: "Prayer Team", value: 109 },
  { name: "Hospitality", value: 146 }
];

// Mock most growing ministries
const growingMinistries = [
  { name: "Young Adults Ministry", value: 28.5 },
  { name: "Outreach & Missions", value: 15.7 },
  { name: "Children's Ministry", value: 12.3 },
  { name: "Hospitality", value: 9.5 },
  { name: "Worship Team", value: 8.5 }
];

// Mock top volunteer stats
const volunteerStats = [
  { name: "Active Volunteers", value: 623, change: "+8.5%" },
  { name: "Volunteer Hours (Monthly)", value: 2875, change: "+12.3%" },
  { name: "Avg Hours per Volunteer", value: 4.6, change: "+3.4%" },
  { name: "Multi-Ministry Volunteers", value: 215, change: "+15.1%" }
];

export default function MinistryEngagementPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Link href="/dashboard/analytics" className="mr-4">
            <ArrowLeftIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Ministry Engagement</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track participation across ministries and branches
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
            Export Data
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="sm:max-w-xs">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Ministry Category
          </label>
          <select
            id="category"
            name="category"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {ministryCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ministry Engagement Chart */}
      <div className="mt-6">
        <MinistryEngagementTracker />
      </div>

      {/* Key Statistics */}
      <div className="mt-8">
        <Grid numItems={1} numItemsMd={2} numItemsLg={4} className="gap-6">
          {volunteerStats.map((stat, index) => (
            <Card key={index} decoration="top" decorationColor={index === 0 ? "indigo" : index === 1 ? "emerald" : index === 2 ? "amber" : "rose"}>
              <Text>{stat.name}</Text>
              <Flex justifyContent="start" alignItems="baseline" className="space-x-2">
                <Title>{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</Title>
                <Text className="text-emerald-600">{stat.change}</Text>
              </Flex>
            </Card>
          ))}
        </Grid>
      </div>

      {/* Top Ministries and Growing Ministries */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <Title>Top Ministries by Engagement</Title>
          <Subtitle>Total volunteer participation</Subtitle>
          <Flex className="mt-6">
            <Text>
              <span className="font-semibold">Ministry</span>
            </Text>
            <Text>
              <span className="font-semibold">Volunteers</span>
            </Text>
          </Flex>
          <BarList 
            data={topMinistries} 
            className="mt-2" 
            valueFormatter={(number) => `${number} volunteers`}
            color="indigo"
          />
        </Card>

        <Card>
          <Title>Fastest Growing Ministries</Title>
          <Subtitle>Year-over-year growth percentage</Subtitle>
          <Flex className="mt-6">
            <Text>
              <span className="font-semibold">Ministry</span>
            </Text>
            <Text>
              <span className="font-semibold">Growth %</span>
            </Text>
          </Flex>
          <BarList 
            data={growingMinistries} 
            className="mt-2" 
            valueFormatter={(number) => `+${number}%`}
            color="emerald"
          />
        </Card>
      </div>

      {/* Engagement Analysis */}
      <div className="mt-8">
        <Card>
          <Title>Engagement Insights & Recommendations</Title>
          
          <div className="mt-4 space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <Text className="font-medium">Cross-Branch Opportunities</Text>
              <Text className="text-sm text-gray-600">
                Volunteers at East Side and South Chapel branches show higher engagement rates (22.0% and 25.5% respectively) 
                than Main Campus (18.5%). Consider implementing their recruitment and retention strategies across all branches.
              </Text>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md">
              <Text className="font-medium">High-Growth Potential</Text>
              <Text className="text-sm text-gray-600">
                Young Adults Ministry shows the highest growth rate at 28.5%. This demonstrates significant opportunity 
                to engage this demographic further across all branches with targeted programming and leadership development.
              </Text>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-md">
              <Text className="font-medium">Multi-Ministry Participation</Text>
              <Text className="text-sm text-gray-600">
                215 volunteers (34.5% of all volunteers) serve in multiple ministries, up 15.1% from last year. 
                These highly engaged members should be prioritized for leadership development and mentoring opportunities.
              </Text>
            </div>
            
            <div className="bg-rose-50 p-4 rounded-md">
              <Text className="font-medium">Resource Allocation</Text>
              <Text className="text-sm text-gray-600">
                Outreach & Missions ministry shows both high engagement (182 volunteers) and strong growth (15.7%). 
                Consider increasing resources and support for this ministry to capitalize on momentum and impact.
              </Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Ministry Activity Calendar */}
      <div className="mt-8">
        <Card>
          <Title>Recent Ministry Activities</Title>
          <Subtitle>Last 30 days of engagement across branches</Subtitle>
          
          <div className="mt-4 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ministry
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volunteers
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Apr 10, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Youth Group</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Main Campus</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">68</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Apr 9, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Adult Bible Study</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">East Side</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">42</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Apr 8, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Outreach & Missions</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">South Chapel</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">35</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Apr 7, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Prayer Team</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">West End</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">24</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Apr 5, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Children's Ministry</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Main Campus</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">72</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Link href="/dashboard/analytics/engagement/activities" className="text-sm text-indigo-600 hover:text-indigo-800">
              View all activities →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
