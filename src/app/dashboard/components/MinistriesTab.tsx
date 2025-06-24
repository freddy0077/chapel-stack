"use client";

import { 
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

const ministries = [
  { 
    id: 1, 
    name: "Worship Team", 
    members: 24, 
    leader: "David Anderson",
    nextMeeting: "April 12, 2025 at 5:00 PM",
    color: "bg-indigo-100 text-indigo-700" 
  },
  { 
    id: 2, 
    name: "Youth Ministry", 
    members: 18, 
    leader: "Sarah Johnson",
    nextMeeting: "April 13, 2025 at 4:00 PM",
    color: "bg-green-100 text-green-700" 
  },
  { 
    id: 3, 
    name: "Children's Ministry", 
    members: 15, 
    leader: "Rachel Thompson",
    nextMeeting: "April 14, 2025 at 6:00 PM",
    color: "bg-yellow-100 text-yellow-700" 
  },
  { 
    id: 4, 
    name: "Outreach Team", 
    members: 12, 
    leader: "Michael Brown",
    nextMeeting: "April 15, 2025 at 7:00 PM",
    color: "bg-blue-100 text-blue-700" 
  },
  { 
    id: 5, 
    name: "Prayer Team", 
    members: 20, 
    leader: "Jennifer Davis",
    nextMeeting: "April 16, 2025 at 6:30 PM",
    color: "bg-purple-100 text-purple-700" 
  },
  { 
    id: 6, 
    name: "Hospitality Team", 
    members: 14, 
    leader: "John Wilson",
    nextMeeting: "April 17, 2025 at 5:30 PM",
    color: "bg-pink-100 text-pink-700" 
  },
];

export default function MinistriesTab() {
  return (
    <>
      {/* Header with search and add button */}
      <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h2 className="text-lg font-semibold text-gray-900">Active Ministries</h2>
        
        <div className="flex space-x-3">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search ministries"
            />
          </div>
          
          <Link 
            href="/dashboard/ministries/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
            New Ministry
          </Link>
        </div>
      </div>
      
      {/* Ministries Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ministries.map((ministry) => (
          <Link key={ministry.id} href={`/dashboard/ministries/${ministry.id}`} className="group">
            <div className="h-full overflow-hidden rounded-xl bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="border-b border-gray-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`rounded-lg ${ministry.color} p-2`}>
                      <UserGroupIcon className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium text-gray-900">{ministry.name}</h3>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {ministry.members} members
                  </span>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="mb-4">
                  <p className="text-xs font-medium uppercase text-gray-500">Ministry Leader</p>
                  <p className="text-sm text-gray-900">{ministry.leader}</p>
                </div>
                
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">Next Meeting</p>
                  <div className="mt-1 flex items-center text-sm text-gray-700">
                    <CalendarIcon className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                    {ministry.nextMeeting}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-indigo-600 group-hover:text-indigo-800">View details</span>
                  <span className="text-gray-500">Last activity: 2d ago</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Add New Ministry Card */}
        <Link href="/dashboard/ministries/new" className="group">
          <div className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition duration-200 hover:border-indigo-300 hover:bg-indigo-50">
            <div className="mb-3 rounded-full bg-gray-100 p-3 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600">
              <PlusIcon className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Add New Ministry</h3>
            <p className="mt-1 text-xs text-gray-500">Create a new ministry group</p>
          </div>
        </Link>
      </div>
      
      {/* Ministry Health Overview */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Ministry Health Overview</h3>
        
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ministry
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Growth Rate
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Attendance
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {ministries.slice(0, 4).map((ministry) => (
                <tr key={ministry.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center">
                      <div className={`mr-2 rounded-md ${ministry.color} p-1.5`}>
                        <UserGroupIcon className="h-3.5 w-3.5" />
                      </div>
                      <div className="font-medium text-gray-900">{ministry.name}</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {ministry.id % 2 === 0 ? '+4.3%' : '+2.7%'} this month
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {ministry.id * 7 + 10} / {ministry.members}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      ministry.id % 3 === 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {ministry.id % 3 === 0 ? 'Needs attention' : 'Healthy'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {ministry.id % 2 === 0 ? '2 days ago' : '1 week ago'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <button className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-900">
            <ArrowPathIcon className="mr-1.5 h-4 w-4" />
            Refresh data
          </button>
          
          <Link href="/dashboard/ministries/reports" className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
            View full ministry report
          </Link>
        </div>
      </div>
    </>
  );
}
