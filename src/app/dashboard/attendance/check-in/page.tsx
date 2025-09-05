"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserPlusIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import CheckInModal from "../../attendance/components/CheckInModal";

// Mock data for children
const mockChildren = [
  {
    id: "1",
    firstName: "Emma",
    lastName: "Johnson",
    age: 6,
    birthdate: "2017-05-12",
    parentName: "Michael & Sarah Johnson",
    parentPhone: "(555) 123-4567",
    allergies: "Peanuts",
    emergencyContact: "Grandma - (555) 987-6543",
    checkedIn: false,
    lastCheckIn: "2023-03-26 09:45 AM",
    className: "Elementary (K-2)",
  },
  {
    id: "2",
    firstName: "Noah",
    lastName: "Smith",
    age: 4,
    birthdate: "2019-01-30",
    parentName: "James & Emily Smith",
    parentPhone: "(555) 234-5678",
    allergies: "None",
    emergencyContact: "Uncle Bob - (555) 876-5432",
    checkedIn: true,
    lastCheckIn: "2023-04-02 09:30 AM",
    className: "Preschool (3-5)",
  },
  {
    id: "3",
    firstName: "Olivia",
    lastName: "Williams",
    age: 8,
    birthdate: "2015-09-18",
    parentName: "David & Jennifer Williams",
    parentPhone: "(555) 345-6789",
    allergies: "Dairy",
    emergencyContact: "Aunt Mary - (555) 765-4321",
    checkedIn: false,
    lastCheckIn: "2023-03-26 09:50 AM",
    className: "Elementary (3-5)",
  },
  {
    id: "4",
    firstName: "Liam",
    lastName: "Brown",
    age: 3,
    birthdate: "2020-11-05",
    parentName: "Robert & Jessica Brown",
    parentPhone: "(555) 456-7890",
    allergies: "None",
    emergencyContact: "Grandmother - (555) 654-3210",
    checkedIn: true,
    lastCheckIn: "2023-04-02 09:15 AM",
    className: "Toddler (1-2)",
  },
  {
    id: "5",
    firstName: "Sophia",
    lastName: "Miller",
    age: 7,
    birthdate: "2016-03-22",
    parentName: "William & Elizabeth Miller",
    parentPhone: "(555) 567-8901",
    allergies: "Strawberries",
    emergencyContact: "Grandfather - (555) 543-2109",
    checkedIn: false,
    lastCheckIn: "2023-03-19 09:40 AM",
    className: "Elementary (K-2)",
  },
  {
    id: "6",
    firstName: "Jackson",
    lastName: "Davis",
    age: 5,
    birthdate: "2018-07-09",
    parentName: "Joseph & Maria Davis",
    parentPhone: "(555) 678-9012",
    allergies: "None",
    emergencyContact: "Uncle John - (555) 432-1098",
    checkedIn: false,
    lastCheckIn: "2023-03-26 09:35 AM",
    className: "Preschool (3-5)",
  },
];

// Mock events
const mockEvents = [
  { id: "1", name: "Sunday School", date: "2023-04-02", active: true },
  {
    id: "2",
    name: "Wednesday Night Kids Club",
    date: "2023-04-05",
    active: false,
  },
  {
    id: "3",
    name: "Special Easter Program",
    date: "2023-04-09",
    active: false,
  },
];

export default function CheckInSystem() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(mockEvents[0]);
  const [children, setChildren] = useState(mockChildren);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<
    (typeof mockChildren)[0] | null
  >(null);
  const [checkinMode, setCheckinMode] = useState<"in" | "out">("in");

  // Filter children based on search query
  const filteredChildren = children.filter((child) => {
    const fullName = `${child.firstName} ${child.lastName}`.toLowerCase();
    const parentName = child.parentName.toLowerCase();
    const query = searchQuery.toLowerCase();

    return fullName.includes(query) || parentName.includes(query);
  });

  // Handlers
  const handleCheckIn = (childId: string) => {
    const child = children.find((c) => c.id === childId);
    if (child) {
      setSelectedChild(child);
      setCheckinMode(child.checkedIn ? "out" : "in");
      setIsModalOpen(true);
    }
  };

  const handleCheckInComplete = (childId: string, isCheckedIn: boolean) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === childId
          ? {
              ...child,
              checkedIn: isCheckedIn,
              lastCheckIn: isCheckedIn
                ? new Date().toLocaleString()
                : child.lastCheckIn,
            }
          : child,
      ),
    );
    setIsModalOpen(false);
    setSelectedChild(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="mb-8">
        <div className="flex items-center">
          <Link
            href="/dashboard/attendance"
            className="mr-2 rounded-md bg-white p-1 text-gray-400 hover:text-gray-500"
          >
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Children&apos;s Ministry Check-In
          </h1>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Check-in and check-out for today&apos;s children&apos;s ministry and
          events
        </p>
      </div>

      {/* Event selection and controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Active Event</h2>
            <div className="mt-2">
              <select
                id="event"
                name="event"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={selectedEvent.id}
                onChange={(e) => {
                  const eventId = e.target.value;
                  const event = mockEvents.find((evt) => evt.id === eventId);
                  if (event) {
                    setSelectedEvent(event);
                  }
                }}
              >
                {mockEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {event.date}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <Link
              href="/dashboard/attendance/events/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Event
            </Link>
            <Link
              href="/dashboard/children/new"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            >
              <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add New Child
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-5 mt-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-grow max-w-lg">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search by name or parent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                {children.filter((c) => c.checkedIn).length} Checked In
              </span>
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                {children.length - children.filter((c) => c.checkedIn).length}{" "}
                Not Checked In
              </span>
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-2.5 py-0.5 text-sm font-medium text-gray-500 hover:text-gray-700"
                onClick={() => setChildren([...mockChildren])}
              >
                <ArrowPathIcon
                  className="-ml-0.5 mr-1 h-4 w-4"
                  aria-hidden="true"
                />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Children check-in list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Children Check-in List
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredChildren.length === 0 ? (
            <li className="px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <UserPlusIcon
                  className="h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No children found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try a different search term or add a new child to the system.
              </p>
              <div className="mt-6">
                <Link
                  href="/dashboard/children/new"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline"
                >
                  <PlusIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5"
                    aria-hidden="true"
                  />
                  Add New Child
                </Link>
              </div>
            </li>
          ) : (
            filteredChildren.map((child) => (
              <li key={child.id} className="px-6 py-5 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                        {child.firstName.charAt(0)}
                        {child.lastName.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-900">
                          {child.firstName} {child.lastName}
                        </h4>
                        {child.checkedIn ? (
                          <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            <CheckCircleIcon className="-ml-0.5 mr-1 h-3 w-3" />
                            Checked In
                          </span>
                        ) : (
                          <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            <XCircleIcon className="-ml-0.5 mr-1 h-3 w-3" />
                            Not Checked In
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Age: {child.age} • Class: {child.className}
                      </p>
                      <p className="text-xs text-gray-500">
                        Parent: {child.parentName} • Phone: {child.parentPhone}
                      </p>
                      {child.allergies !== "None" && (
                        <p className="text-xs text-red-500 mt-1">
                          <span className="font-medium">Allergies:</span>{" "}
                          {child.allergies}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleCheckIn(child.id)}
                      className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
                        child.checkedIn
                          ? "bg-red-50 text-red-700 hover:bg-red-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {child.checkedIn ? "Check Out" : "Check In"}
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Check-in Modal */}
      {selectedChild && (
        <CheckInModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedChild(null);
          }}
          child={selectedChild}
          mode={checkinMode}
          onComplete={handleCheckInComplete}
          eventName={selectedEvent.name}
        />
      )}
    </div>
  );
}
