"use client";

import { 
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function AnalyticsTab() {
  return (
    <>
      {/* Analytics Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Church Analytics</h2>
        <div className="flex items-center space-x-2">
          <select className="rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last 12 months</option>
            <option>All time</option>
          </select>
          <button className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Export
          </button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { 
            label: "Service Attendance", 
            value: "297", 
            change: "+4.5%", 
            trend: "up", 
            compareLabel: "vs last month", 
            color: "blue" 
          },
          { 
            label: "Giving", 
            value: "$32,594", 
            change: "+12.3%", 
            trend: "up", 
            compareLabel: "vs last month", 
            color: "green" 
          },
          { 
            label: "New Members", 
            value: "24", 
            change: "-2.7%", 
            trend: "down", 
            compareLabel: "vs last month", 
            color: "indigo" 
          },
          { 
            label: "Digital Engagement", 
            value: "1,482", 
            change: "+24.3%", 
            trend: "up", 
            compareLabel: "vs last month", 
            color: "purple" 
          }
        ].map((stat, index) => (
          <div key={index} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              <div className={`rounded-full bg-${stat.color}-100 p-1.5`}>
                {stat.label.includes("Attendance") ? (
                  <UsersIcon className={`h-4 w-4 text-${stat.color}-600`} />
                ) : stat.label.includes("Giving") ? (
                  <CurrencyDollarIcon className={`h-4 w-4 text-${stat.color}-600`} />
                ) : (
                  <ChartBarIcon className={`h-4 w-4 text-${stat.color}-600`} />
                )}
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">{stat.compareLabel}</p>
          </div>
        ))}
      </div>
      
      {/* Main Charts */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Attendance Trends */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Attendance Trends</h3>
            <select className="rounded-md border-gray-300 py-1 text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option>Last 12 weeks</option>
              <option>Last 6 months</option>
            </select>
          </div>
          
          {/* Mocked line chart */}
          <div className="h-64 w-full">
            <div className="h-full w-full rounded border border-gray-200 bg-gray-50 p-4">
              <div className="flex h-full flex-col">
                <div className="relative flex-1">
                  {/* Chart line */}
                  <div className="absolute bottom-0 left-0 h-[40%] w-full rounded-lg bg-indigo-50"></div>
                  <div className="absolute bottom-0 left-0 h-1 w-full rounded-lg bg-indigo-500" style={{ height: "40%" }}></div>
                  
                  {/* Data points */}
                  {[20, 35, 25, 45, 30, 55, 40, 60, 45, 70, 50, 65].map((height, i) => (
                    <div
                      key={i}
                      className="absolute bottom-0 h-2 w-2 rounded-full bg-indigo-600"
                      style={{
                        left: `${(i / 11) * 100}%`,
                        bottom: `${height}%`,
                      }}
                    ></div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => (
                    i % 2 === 0 && (
                      <div key={i} className="text-xs text-gray-500">
                        {month}
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Giving Distribution */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Giving Distribution</h3>
            <select className="rounded-md border-gray-300 py-1 text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option>Current year</option>
              <option>Previous year</option>
            </select>
          </div>
          
          {/* Mocked pie chart */}
          <div className="flex h-64 w-full items-center justify-center">
            <div className="relative h-48 w-48 rounded-full">
              <div className="absolute inset-0 rounded-full border-8 border-l-indigo-500 border-r-green-500 border-t-blue-500 border-b-purple-500"></div>
              <div className="absolute inset-4 rounded-full bg-white"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">$122,584</p>
                  <p className="text-xs text-gray-500">Total Giving</p>
                </div>
              </div>
            </div>
            
            <div className="ml-8">
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="ml-2 text-sm text-gray-600">General Fund (45%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                  <span className="ml-2 text-sm text-gray-600">Building Fund (25%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-sm text-gray-600">Missions (20%)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                  <span className="ml-2 text-sm text-gray-600">Special Projects (10%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Demographics Section */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-medium text-gray-900">Membership Demographics</h3>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Age Distribution */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">Age Distribution</h4>
            <div className="space-y-2">
              {[
                { label: "Under 18", percentage: 15 },
                { label: "18-30", percentage: 25 },
                { label: "31-45", percentage: 30 },
                { label: "46-65", percentage: 20 },
                { label: "Over 65", percentage: 10 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{item.label}</span>
                    <span className="text-xs font-medium text-gray-700">{item.percentage}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div 
                      className="h-full rounded-full bg-indigo-500" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Gender Distribution */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">Gender Distribution</h4>
            <div className="flex h-32 items-center justify-center space-x-8">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 p-4">
                  <UsersIcon className="h-8 w-8 text-blue-600" />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">Male</p>
                <p className="text-lg font-bold text-blue-600">48%</p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-pink-100 p-4">
                  <UsersIcon className="h-8 w-8 text-pink-600" />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">Female</p>
                <p className="text-lg font-bold text-pink-600">52%</p>
              </div>
            </div>
          </div>
          
          {/* Attendance Frequency */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">Attendance Frequency</h4>
            <div className="space-y-2">
              {[
                { label: "Weekly", percentage: 65 },
                { label: "Bi-weekly", percentage: 15 },
                { label: "Monthly", percentage: 10 },
                { label: "Occasional", percentage: 10 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{item.label}</span>
                    <span className="text-xs font-medium text-gray-700">{item.percentage}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div 
                      className="h-full rounded-full bg-green-500" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* View detailed reports link */}
      <div className="mt-6 text-center">
        <Link href="/dashboard/reports" className="inline-flex items-center rounded-md bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100">
          View detailed analytics reports
          <ChartBarIcon className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </>
  );
}
