"use client";

import { 
  UsersIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowUpRightIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

const members = [
  { 
    id: 1, 
    name: "John Smith", 
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    ministry: "Worship Team",
    status: "Active",
    joinDate: "Jan 15, 2023",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  { 
    id: 2, 
    name: "Maria Johnson", 
    email: "maria.johnson@example.com",
    phone: "(555) 234-5678",
    address: "456 Oak Ave, Anytown, USA",
    ministry: "Children's Ministry",
    status: "Active",
    joinDate: "Mar 3, 2022",
    imageUrl: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  { 
    id: 3, 
    name: "Robert Davis", 
    email: "robert.davis@example.com",
    phone: "(555) 345-6789",
    address: "789 Pine Rd, Anytown, USA",
    ministry: "Prayer Team",
    status: "Active",
    joinDate: "Nov 12, 2021",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  { 
    id: 4, 
    name: "Sarah Wilson", 
    email: "sarah.wilson@example.com",
    phone: "(555) 456-7890",
    address: "101 Elm St, Anytown, USA",
    ministry: "Outreach Team",
    status: "Inactive",
    joinDate: "Jun 28, 2022",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  { 
    id: 5, 
    name: "Michael Brown", 
    email: "michael.brown@example.com",
    phone: "(555) 567-8901",
    address: "202 Cedar Ln, Anytown, USA",
    ministry: "Youth Ministry",
    status: "Active",
    joinDate: "Feb 14, 2023",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  { 
    id: 6, 
    name: "Jennifer Thompson", 
    email: "jennifer.thompson@example.com",
    phone: "(555) 678-9012",
    address: "303 Birch Blvd, Anytown, USA",
    ministry: "Hospitality Team",
    status: "Active",
    joinDate: "Apr 7, 2023",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
];

export default function MembersTab() {
  return (
    <>
      {/* Header with search and add button */}
      <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Church Members</h2>
          <p className="text-sm text-gray-500">Manage your church members and their information</p>
        </div>
        
        <div className="flex space-x-3">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search members"
            />
          </div>
          
          <Link 
            href="/dashboard/members/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-4 w-4" aria-hidden="true" />
            Add Member
          </Link>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Members", value: "2,543", icon: UsersIcon, color: "blue" },
          { label: "New This Month", value: "48", icon: UsersIcon, color: "green" },
          { label: "Active Members", value: "2,128", icon: UsersIcon, color: "indigo" },
          { label: "Needs Follow-up", value: "24", icon: UsersIcon, color: "yellow" },
        ].map((stat, i) => (
          <div key={i} className="overflow-hidden rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md bg-${stat.color}-100 p-3`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600`} aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">{stat.label}</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Member List */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium leading-6 text-gray-900">Recent Members</h3>
            <div className="flex items-center space-x-3">
              <select className="rounded-md border-gray-300 py-1 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option>All Members</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>New</option>
              </select>
              <Link href="/dashboard/members" className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                View all
              </Link>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Member
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ministry
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Join Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 relative">
                        <Image 
                          className="rounded-full object-cover" 
                          src={member.imageUrl} 
                          alt={`${member.name}'s profile`}
                          fill
                          sizes="40px"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <EnvelopeIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                        {member.email}
                      </div>
                      <div className="mt-1 flex items-center">
                        <PhoneIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                        {member.phone}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {member.ministry}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      member.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {member.joinDate}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link href={`/dashboard/members/${member.id}`} className="text-indigo-600 hover:text-indigo-900">
                      <span className="flex items-center justify-end">
                        View <ArrowUpRightIcon className="ml-1 h-4 w-4" />
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">6</span> of <span className="font-medium">2,543</span> members
            </div>
            <div className="flex items-center space-x-2">
              <button className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Member Map */}
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-base font-medium leading-6 text-gray-900">Member Distribution</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="text-center">
              <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">Member Map</p>
              <p className="text-xs text-gray-500">View geographic distribution of church members</p>
              <button className="mt-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                Open Map View
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
