"use client";

import {
  CalendarDaysIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface WorshipTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function WorshipTabs({ activeTab, onTabChange }: WorshipTabsProps) {
  const tabs = [
    { name: 'Service Plans', value: 'services', icon: <CalendarDaysIcon className="w-5 h-5" /> },
    { name: 'Song Library', value: 'songs', icon: <MusicalNoteIcon className="w-5 h-5" /> },
    { name: 'Team Scheduling', value: 'teams', icon: <UserGroupIcon className="w-5 h-5" /> },
    { name: 'Rehearsals', value: 'rehearsals', icon: <ClockIcon className="w-5 h-5" /> },
    { name: 'Resources', value: 'resources', icon: <BookOpenIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="my-6">
      {/* Mobile Tabs */}
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-lg border-gray-300 py-2.5 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 shadow-sm"
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.value} value={tab.value}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:block">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <nav className="flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={`
                  flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-all duration-200 flex-1
                  ${activeTab === tab.value
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <span className={`${activeTab === tab.value ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {tab.icon}
                </span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
