"use client";

import { MegaphoneIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

// Mock data for announcements
export const mockAnnouncements = [
  {
    id: 1,
    title: "Church Picnic Next Sunday",
    content: "Join us for our annual church picnic after the service next Sunday. Bring your favorite dish to share!",
    startDate: "2025-04-14T12:00:00Z",
    endDate: "2025-04-14T15:00:00Z",
    publishedDate: "2025-04-01T10:00:00Z",
    status: "Active",
    priority: "High",
    visibleTo: "Everyone"
  },
  {
    id: 2,
    title: "Worship Team Auditions",
    content: "Worship team auditions will be held on April 20th at 5 PM. Sign up at the welcome desk if you're interested in serving.",
    startDate: "2025-04-20T17:00:00Z",
    endDate: "2025-04-20T19:00:00Z",
    publishedDate: "2025-03-28T14:30:00Z",
    status: "Active",
    priority: "Medium",
    visibleTo: "Everyone"
  },
  {
    id: 3,
    title: "Building Fund Update",
    content: "We've reached 75% of our building fund goal! Thank you for your generous contributions. We're getting closer to breaking ground!",
    startDate: "2025-04-01T00:00:00Z",
    endDate: "2025-04-30T23:59:59Z",
    publishedDate: "2025-04-01T08:15:00Z",
    status: "Active",
    priority: "Medium",
    visibleTo: "Members"
  },
  {
    id: 4,
    title: "Children's Ministry Volunteer Training",
    content: "Mandatory training for all children's ministry volunteers will be held on April 18th from 9-11 AM.",
    startDate: "2025-04-18T09:00:00Z",
    endDate: "2025-04-18T11:00:00Z",
    publishedDate: "2025-03-25T15:45:00Z",
    status: "Active",
    priority: "High",
    visibleTo: "Children's Ministry Volunteers"
  },
  {
    id: 5,
    title: "Office Closed for Holiday",
    content: "The church office will be closed on Monday, April 21st in observance of the holiday. Normal hours will resume on Tuesday.",
    startDate: "2025-04-21T00:00:00Z",
    endDate: "2025-04-21T23:59:59Z",
    publishedDate: "2025-04-05T11:20:00Z",
    status: "Scheduled",
    priority: "Low",
    visibleTo: "Everyone"
  }
];

export interface Announcement {
  id: number;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  publishedDate: string;
  status: 'Active' | 'Scheduled' | 'Archived';
  priority: 'Low' | 'Medium' | 'High';
  visibleTo: string;
}

interface AnnouncementsListProps {
  announcements: Announcement[];
  onViewAnnouncement: (announcement: Announcement) => void;
}

export default function AnnouncementsList({ announcements, onViewAnnouncement }: AnnouncementsListProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Get priority badge color
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mt-4 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Announcement
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Dates
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Priority
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Visible To
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {announcements.map((announcement) => (
                  <tr key={announcement.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <div className="flex items-center">
                        <MegaphoneIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                        {announcement.title}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 max-w-xs truncate">
                        {announcement.content}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                        {formatDate(announcement.startDate)}
                        {announcement.startDate !== announcement.endDate && 
                          ` - ${formatDate(announcement.endDate)}`}
                      </div>
                      <div className="text-xs flex items-center text-gray-400">
                        <ClockIcon className="mr-1 h-3 w-3" aria-hidden="true" />
                        Published {formatDate(announcement.publishedDate)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(announcement.status)}`}>
                        {announcement.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeClass(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {announcement.visibleTo}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => onViewAnnouncement(announcement)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View<span className="sr-only">, {announcement.title}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
