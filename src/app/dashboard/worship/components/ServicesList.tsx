"use client";

import { CalendarIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";

// Mock data for service plans
export const mockServices = [
  {
    id: 1,
    title: "Sunday Morning Service",
    date: "2025-04-13T10:00:00Z",
    theme: "Amazing Grace",
    description: "Regular Sunday worship service focused on God's grace.",
    location: "Main Sanctuary",
    status: "Planning",
    serviceType: "Weekly Service",
    leadPastor: "Pastor John Smith",
    worshipLeader: "Sarah Williams",
    songs: [
      { title: "Amazing Grace", key: "G", artist: "John Newton" },
      { title: "How Great Thou Art", key: "D", artist: "Stuart K. Hine" },
      {
        title: "Great Is Thy Faithfulness",
        key: "E",
        artist: "Thomas O. Chisholm",
      },
      { title: "10,000 Reasons", key: "G", artist: "Matt Redman" },
    ],
    team: [
      { name: "Sarah Williams", role: "Worship Leader" },
      { name: "David Chen", role: "Acoustic Guitar" },
      { name: "Michelle Johnson", role: "Vocals" },
      { name: "James Wilson", role: "Drums" },
      { name: "Tiffany Rodriguez", role: "Keys" },
    ],
    completed: false,
  },
  {
    id: 2,
    title: "Wednesday Night Prayer",
    date: "2025-04-09T19:00:00Z",
    theme: "Seeking God's Presence",
    description: "Midweek prayer and worship service.",
    location: "Fellowship Hall",
    status: "Confirmed",
    serviceType: "Prayer Service",
    leadPastor: "Pastor Michelle Davis",
    worshipLeader: "Thomas Anderson",
    songs: [
      { title: "Spirit Break Out", key: "B", artist: "Kim Walker-Smith" },
      { title: "Oceans", key: "D", artist: "Hillsong United" },
      { title: "Cornerstone", key: "C", artist: "Hillsong Worship" },
    ],
    team: [
      { name: "Thomas Anderson", role: "Worship Leader" },
      { name: "Lisa Brown", role: "Keys" },
      { name: "Mark Taylor", role: "Acoustic Guitar" },
    ],
    completed: false,
  },
  {
    id: 3,
    title: "Easter Sunday Service",
    date: "2025-04-20T10:00:00Z",
    theme: "Resurrection Power",
    description: "Easter celebration service.",
    location: "Main Sanctuary",
    status: "Planning",
    serviceType: "Special Service",
    leadPastor: "Pastor John Smith",
    worshipLeader: "Sarah Williams",
    songs: [
      { title: "Resurrecting", key: "C", artist: "Elevation Worship" },
      { title: "Christ Is Risen", key: "G", artist: "Matt Maher" },
      { title: "Living Hope", key: "C", artist: "Phil Wickham" },
      { title: "King of Kings", key: "D", artist: "Hillsong Worship" },
      { title: "Forever", key: "G", artist: "Kari Jobe" },
    ],
    team: [
      { name: "Sarah Williams", role: "Worship Leader" },
      { name: "David Chen", role: "Acoustic Guitar" },
      { name: "Michelle Johnson", role: "Vocals" },
      { name: "James Wilson", role: "Drums" },
      { name: "Tiffany Rodriguez", role: "Keys" },
      { name: "Robert Davis", role: "Bass" },
      { name: "Jennifer Lopez", role: "Violin" },
    ],
    completed: false,
  },
  {
    id: 4,
    title: "Youth Service",
    date: "2025-04-18T18:30:00Z",
    theme: "Identity in Christ",
    description: "Special worship service for youth and young adults.",
    location: "Youth Center",
    status: "Draft",
    serviceType: "Youth Service",
    leadPastor: "Youth Pastor Alex Kim",
    worshipLeader: "Marcus Johnson",
    songs: [
      { title: "See A Victory", key: "B", artist: "Elevation Worship" },
      { title: "Graves Into Gardens", key: "C#", artist: "Elevation Worship" },
      { title: "Reckless Love", key: "D", artist: "Cory Asbury" },
      { title: "Battle Belongs", key: "A", artist: "Phil Wickham" },
    ],
    team: [
      { name: "Marcus Johnson", role: "Worship Leader" },
      { name: "Ethan Park", role: "Electric Guitar" },
      { name: "Zoe Miller", role: "Vocals" },
      { name: "Tyler Washington", role: "Drums" },
      { name: "Emma Rodriguez", role: "Keys" },
    ],
    completed: false,
  },
  {
    id: 5,
    title: "Sunday Morning Service",
    date: "2025-04-06T10:00:00Z",
    theme: "Faith Over Fear",
    description: "Regular Sunday worship service.",
    location: "Main Sanctuary",
    status: "Completed",
    serviceType: "Weekly Service",
    leadPastor: "Pastor John Smith",
    worshipLeader: "Sarah Williams",
    songs: [
      { title: "Raise A Hallelujah", key: "G", artist: "Bethel Music" },
      { title: "Way Maker", key: "E", artist: "Sinach" },
      { title: "Goodness of God", key: "C", artist: "Bethel Music" },
      { title: "Blessed Assurance", key: "D", artist: "Fanny Crosby" },
    ],
    team: [
      { name: "Sarah Williams", role: "Worship Leader" },
      { name: "David Chen", role: "Acoustic Guitar" },
      { name: "Michelle Johnson", role: "Vocals" },
      { name: "James Wilson", role: "Drums" },
      { name: "Tiffany Rodriguez", role: "Keys" },
    ],
    completed: true,
  },
];

export interface ServiceSong {
  title: string;
  key: string;
  artist: string;
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface ServicePlan {
  id: number;
  title: string;
  date: string;
  theme: string;
  description: string;
  location: string;
  status: "Draft" | "Planning" | "Confirmed" | "Completed";
  serviceType: string;
  leadPastor: string;
  worshipLeader: string;
  songs: ServiceSong[];
  team: TeamMember[];
  completed: boolean;
}

interface ServicesListProps {
  services: ServicePlan[];
  onViewService: (service: ServicePlan) => void;
}

export default function ServicesList({
  services,
  onViewService,
}: ServicesListProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Planning":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Check if service is upcoming
  const isUpcoming = (dateString: string) => {
    const serviceDate = new Date(dateString);
    const now = new Date();
    return serviceDate > now;
  };

  return (
    <div className="mt-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Upcoming Services
        </h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" /> Calendar View
          </button>
          <button className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className={`bg-white border ${service.completed ? "border-gray-200" : isUpcoming(service.date) ? "border-indigo-200" : "border-gray-200"} rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <div
              className={`h-2 ${service.completed ? "bg-blue-500" : isUpcoming(service.date) ? "bg-indigo-500" : "bg-yellow-500"}`}
            ></div>
            <div className="p-5">
              {/* Service Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600">{service.theme}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(service.status)}`}
                >
                  {service.status}
                </span>
              </div>

              {/* Service Details */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-700">
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  <div>
                    <div>{formatDate(service.date)}</div>
                    <div className="text-xs text-gray-500">
                      {formatTime(service.date)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div className="line-clamp-1">{service.location}</div>
                </div>

                <div className="flex items-center text-sm text-gray-700">
                  <MusicalNoteIcon className="mr-2 h-4 w-4 text-gray-500" />
                  <div className="line-clamp-1">
                    Led by {service.worshipLeader}
                  </div>
                </div>
              </div>

              {/* Songs Count */}
              <div className="mt-4 flex items-center">
                <div className="bg-indigo-50 text-indigo-700 py-1 px-2 rounded text-xs font-medium">
                  {service.songs.length} Songs
                </div>
                <div className="bg-blue-50 text-blue-700 py-1 px-2 rounded text-xs font-medium ml-2">
                  {service.team.length} Team Members
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex justify-between border-t border-gray-100 pt-4">
                <button
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                  onClick={() => window.alert("Edit feature coming soon!")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                  onClick={() => onViewService(service)}
                >
                  View Details
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 6h8M8 10h8M8 14h4"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No services found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new service plan.
          </p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Service Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
