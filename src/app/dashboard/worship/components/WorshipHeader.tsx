"use client";

import { MusicalNoteIcon } from '@heroicons/react/24/outline';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

interface WorshipHeaderProps {
  onCreateService: () => void;
}

export default function WorshipHeader({ onCreateService }: WorshipHeaderProps) {
  return (
    <div className="pb-6 mb-6 border-b border-indigo-100 flex flex-col md:flex-row md:items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
          <MusicalNoteIcon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-1">Worship Ministry</h1>
          <p className="text-md text-gray-600 max-w-3xl">
            Manage your worship team, song library, service planning, and resources all in one place.
          </p>
        </div>
      </div>
      <div className="mt-4 md:mt-0">
        <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
          <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
            Week View
          </button>
          <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
            Month View
          </button>
        </div>
        <button
          type="button"
          onClick={onCreateService}
          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-4"
        >
          <PlusCircleIcon className="h-5 w-5 inline mr-1 -mt-1" />
          Create Service Plan
        </button>
      </div>
    </div>
  );
}
