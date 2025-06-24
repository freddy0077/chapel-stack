"use client";

import { PlusCircleIcon } from '@heroicons/react/24/outline';

interface CommunicationHeaderProps {
  onNewMessage: () => void;
  onNewAnnouncement: () => void;
  onSearch: (query: string) => void;
}

export default function CommunicationHeader({ onNewMessage, onNewAnnouncement, onSearch }: CommunicationHeaderProps) {
  return (
    <div className="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 className="text-base font-semibold leading-6 text-gray-900">Communication Tools</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage messaging, announcements, and prayer requests for your church community
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex space-x-3 items-center">
        <div className="relative rounded-md shadow-sm mr-3">
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search..."
            onChange={(e) => onSearch(e.target.value)}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <button
          type="button"
          onClick={onNewMessage}
          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusCircleIcon className="h-5 w-5 inline mr-1 -mt-1" />
          New Message
        </button>
        <button
          type="button"
          onClick={onNewAnnouncement}
          className="block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <PlusCircleIcon className="h-5 w-5 inline mr-1 -mt-1" />
          New Announcement
        </button>
      </div>
    </div>
  );
}
