'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Cog6ToothIcon, UserIcon, BellIcon, ShieldCheckIcon, GlobeAltIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import PageHeader from '../components/PageHeader';
import GeneralSettings from './components/GeneralSettings';
import ProfileSettings from './components/ProfileSettings';
import NotificationSettings from './components/NotificationSettings';
import SecuritySettings from './components/SecuritySettings';
import BranchSettings from './components/BranchSettings';
import DeviceSettings from './components/DeviceSettings';
import DashboardHeader from '@/components/DashboardHeader';

const tabs = [
  { name: 'General', icon: Cog6ToothIcon, component: GeneralSettings },
  { name: 'Profile', icon: UserIcon, component: ProfileSettings },
  { name: 'Notifications', icon: BellIcon, component: NotificationSettings },
  { name: 'Security', icon: ShieldCheckIcon, component: SecuritySettings },
  // { name: 'Branch', icon: GlobeAltIcon, component: BranchSettings },
  // { name: 'Devices', icon: DevicePhoneMobileIcon, component: DeviceSettings }, // Hidden
];

export default function SettingsPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <DashboardHeader
        title="Settings"
        subtitle="Manage your account settings and preferences"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex rounded-3xl shadow-2xl bg-white/70 backdrop-blur-xl overflow-hidden border border-gray-100">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <div className="sm:flex">
              <Tab.List className="sm:w-72 bg-gradient-to-br from-white/80 via-indigo-50 to-blue-50 p-6 border-r border-gray-200 min-h-full flex flex-col gap-2">
                <div className="space-y-1">
                  {tabs.map((tab, index) => (
                    <Tab
                      key={tab.name}
                      className={({ selected }) =>
                        `w-full text-left px-4 py-3 rounded-xl flex items-center gap-x-4 text-base font-semibold transition-all duration-150 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                          selected
                            ? 'bg-primary-100 text-primary-700 scale-[1.03] ring-2 ring-primary-200 shadow-md'
                            : 'text-gray-700 hover:bg-indigo-100/60 hover:scale-[1.01]'
                        }`
                      }
                    >
                      <tab.icon className="h-6 w-6 shrink-0 text-primary-400" aria-hidden="true" />
                      {tab.name}
                    </Tab>
                  ))}
                </div>
              </Tab.List>
              <Tab.Panels className="flex-1 p-8 bg-transparent">
                {tabs.map((tab, index) => (
                  <Tab.Panel key={tab.name} className={`space-y-8 transition-opacity duration-300 ${index === selectedIndex ? 'opacity-100 animate-fadeIn' : 'opacity-0'}`}>
                    <tab.component />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </div>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
