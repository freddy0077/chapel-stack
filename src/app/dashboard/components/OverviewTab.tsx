"use client";

import Link from "next/link";
import {
  UsersIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  EnvelopeIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowTrendingUpIcon,
  MapPinIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

// Mock data - would normally be imported from shared location
const mockStats = [
  {
    id: 1,
    name: "Total Members",
    stat: "2,543",
    icon: UsersIcon,
    href: "/dashboard/members",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Monthly Donations",
    stat: "$45,675",
    icon: CurrencyDollarIcon,
    href: "/dashboard/finances",
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "Active Ministries",
    stat: "12",
    icon: UserGroupIcon,
    href: "/dashboard/ministries",
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Upcoming Events",
    stat: "8",
    icon: CalendarIcon,
    href: "/dashboard/calendar",
    color: "bg-yellow-500",
  },
];

const recentActivities = [
  {
    id: 1,
    event: "New member registration",
    name: "John Smith",
    time: "2 hours ago",
  },
  {
    id: 2,
    event: "Donation received",
    name: "Maria Johnson",
    amount: "$150",
    time: "5 hours ago",
  },
  { id: 3, event: "Event created", name: "James Brown", time: "Yesterday" },
  {
    id: 4,
    event: "Prayer request submitted",
    name: "Sarah Williams",
    time: "2 days ago",
  },
];

const upcomingEvents = [
  { id: 1, name: "Sunday Service", date: "April 13, 2025", time: "10:00 AM" },
  {
    id: 2,
    name: "Youth Group Meeting",
    date: "April 13, 2025",
    time: "4:00 PM",
  },
  { id: 3, name: "Bible Study", date: "April 14, 2025", time: "7:00 PM" },
  { id: 4, name: "Board Meeting", date: "April 14, 2025", time: "5:00 PM" },
];

export default function OverviewTab() {
  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((item) => (
          <Link key={item.id} href={item.href}>
            <div className="group h-full overflow-hidden rounded-xl bg-white p-1 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="h-full rounded-lg bg-gradient-to-br from-white to-gray-50 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex-shrink-0 rounded-full p-3 ${item.color} bg-opacity-10`}
                  >
                    <item.icon
                      className={`h-6 w-6 ${item.color.replace("bg-", "text-")} text-opacity-90`}
                      aria-hidden="true"
                    />
                  </div>
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {item.name}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {item.stat}
                  </p>
                </div>
                <div className="mt-3 flex items-center text-xs font-medium text-green-500">
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                  <span>4.3% from last week</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Column - Activities Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Stream */}
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
              <Link
                href="/dashboard/reports"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View all
              </Link>
            </div>
            <div className="p-6">
              <ul role="list" className="space-y-5">
                {recentActivities.map((activity) => (
                  <li
                    key={activity.id}
                    className="relative flex items-start space-x-4 py-2"
                  >
                    <div className="flex-shrink-0">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full">
                        {activity.event.includes("member") ? (
                          <div className="rounded-full bg-blue-100 p-2">
                            <UsersIcon
                              className="h-5 w-5 text-blue-600"
                              aria-hidden="true"
                            />
                          </div>
                        ) : activity.event.includes("Donation") ? (
                          <div className="rounded-full bg-green-100 p-2">
                            <CurrencyDollarIcon
                              className="h-5 w-5 text-green-600"
                              aria-hidden="true"
                            />
                          </div>
                        ) : activity.event.includes("Event") ? (
                          <div className="rounded-full bg-purple-100 p-2">
                            <CalendarIcon
                              className="h-5 w-5 text-purple-600"
                              aria-hidden="true"
                            />
                          </div>
                        ) : activity.event.includes("Prayer") ? (
                          <div className="rounded-full bg-yellow-100 p-2">
                            <HeartIcon
                              className="h-5 w-5 text-yellow-600"
                              aria-hidden="true"
                            />
                          </div>
                        ) : (
                          <div className="rounded-full bg-gray-100 p-2">
                            <UserGroupIcon
                              className="h-5 w-5 text-gray-600"
                              aria-hidden="true"
                            />
                          </div>
                        )}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-900">
                          {activity.event}
                        </p>
                        <div className="whitespace-nowrap text-sm text-gray-500">
                          {activity.time}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {activity.name}{" "}
                        {activity.amount && (
                          <span className="font-medium text-green-600">
                            {activity.amount}
                          </span>
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Attendance Analytics */}
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Attendance Metrics
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Last 4 Weeks Average
                  </p>
                  <p className="text-2xl font-bold text-gray-900">237</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">
                    Peak Attendance
                  </p>
                  <p className="text-2xl font-bold text-gray-900">312</p>
                </div>
              </div>

              {/* Mocked bar chart */}
              <div className="mt-4 h-28 w-full rounded-lg">
                <div className="flex h-full items-end justify-between space-x-2">
                  {[40, 60, 75, 82, 58, 90, 78].map((height, i) => (
                    <div
                      key={i}
                      className="group relative flex w-full flex-col items-center"
                    >
                      <div
                        className={`w-full rounded-t ${i === 5 ? "bg-indigo-500" : "bg-indigo-200"}`}
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="mt-1 text-xs text-gray-500">
                        Mar {i + 18}
                      </span>
                      <div className="absolute bottom-full mb-2 hidden rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                        {Math.round(height * 3.12)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Events
              </h2>
              <Link
                href="/dashboard/calendar"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View calendar
              </Link>
            </div>
            <div className="divide-y divide-gray-200 px-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex py-5">
                  <div className="mr-4 flex-shrink-0 self-start text-center">
                    <div className="flex h-14 w-14 flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      <div className="bg-indigo-500 py-1 text-xs font-semibold uppercase text-white">
                        {event.date.split(" ")[0].substring(0, 3)}
                      </div>
                      <div className="flex flex-1 items-center justify-center text-xl font-bold text-gray-700">
                        {event.date.split(" ")[1].replace(",", "")}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <ClockIcon
                        className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      {event.time}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPinIcon
                        className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      Main Sanctuary
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <button className="flex w-full items-center justify-center rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900">
                <PlusIcon
                  className="-ml-0.5 mr-1.5 h-4 w-4"
                  aria-hidden="true"
                />
                Add new event
              </button>
            </div>
          </div>

          {/* Prayer Requests */}
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Prayer Requests
              </h2>
            </div>
            <div className="divide-y divide-gray-100 px-6">
              {[
                {
                  id: 1,
                  name: "Sarah Martinez",
                  request: "For my daughter's college applications",
                  time: "12h ago",
                },
                {
                  id: 2,
                  name: "James Wilson",
                  request: "Recovery from surgery",
                  time: "1d ago",
                },
                {
                  id: 3,
                  name: "Michael Chen",
                  request: "Job search",
                  time: "2d ago",
                },
              ].map((prayer) => (
                <div key={prayer.id} className="py-4">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-900">{prayer.name}</p>
                    <p className="text-xs text-gray-500">{prayer.time}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{prayer.request}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <Link
                href="/dashboard/prayer"
                className="flex w-full items-center justify-center rounded-lg text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                View all prayer requests
                <ChevronRightIcon className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-xl bg-white shadow-md">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/members/new" className="group">
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center transition duration-200 hover:border-indigo-200 hover:bg-indigo-50">
                <div className="mb-3 rounded-full bg-indigo-100 p-3 text-indigo-600 transition-colors group-hover:bg-indigo-200">
                  <UsersIcon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold">Add New Member</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Register a new church member
                </p>
              </div>
            </Link>

            <Link href="/dashboard/finances/donations/new" className="group">
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center transition duration-200 hover:border-indigo-200 hover:bg-indigo-50">
                <div className="mb-3 rounded-full bg-green-100 p-3 text-green-600 transition-colors group-hover:bg-green-200">
                  <CurrencyDollarIcon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold">Record Donation</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Process a new donation
                </p>
              </div>
            </Link>

            <Link href="/dashboard/calendar/new" className="group">
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center transition duration-200 hover:border-indigo-200 hover:bg-indigo-50">
                <div className="mb-3 rounded-full bg-purple-100 p-3 text-purple-600 transition-colors group-hover:bg-purple-200">
                  <CalendarIcon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold">Schedule Event</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Create a new church event
                </p>
              </div>
            </Link>

            <Link href="/dashboard/communication/new" className="group">
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-center transition duration-200 hover:border-indigo-200 hover:bg-indigo-50">
                <div className="mb-3 rounded-full bg-pink-100 p-3 text-pink-600 transition-colors group-hover:bg-pink-200">
                  <EnvelopeIcon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold">Send Communication</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Email or message members
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
