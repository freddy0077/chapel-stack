"use client";

import { useState, useMemo } from "react";
import { Tab } from "@headlessui/react";
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  UserIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import BranchSettingsEnhanced from "./components/BranchSettingsEnhanced";
import CommunicationSettings from "./components/CommunicationSettings";
import ProfileSettings from "./components/ProfileSettings";
import NotificationSettings from "./components/NotificationSettings";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/contexts/AuthContextEnhanced";

const allTabs = [
  { 
    name: "Branch Information", 
    icon: BuildingOfficeIcon, 
    component: BranchSettingsEnhanced, 
    roles: ["SUPER_ADMIN", "ADMIN", "BRANCH_ADMIN"],
    description: "Manage branch details and contact information"
  },
  { 
    name: "Communication", 
    icon: EnvelopeIcon, 
    component: CommunicationSettings, 
    roles: ["SUPER_ADMIN", "ADMIN", "BRANCH_ADMIN"],
    description: "Configure email and SMS settings for automated messages"
  },
  { 
    name: "My Profile", 
    icon: UserIcon, 
    component: ProfileSettings, 
    roles: ["SUPER_ADMIN", "ADMIN", "BRANCH_ADMIN", "USER"],
    description: "Update your personal information"
  },
  { 
    name: "Notifications", 
    icon: BellIcon, 
    component: NotificationSettings, 
    roles: ["SUPER_ADMIN", "ADMIN", "BRANCH_ADMIN", "USER"],
    description: "Manage notification preferences"
  },
];

export default function SettingsPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { state } = useAuth();
  
  // Extract role names from roles array (roles are objects with {id, name})
  const userRoleNames = state.user?.roles?.map((role: any) => role.name) || [];
  const primaryRole = state.user?.primaryRole || state.user?.role || "USER";

  // Filter tabs based on user roles
  const tabs = useMemo(() => {
    console.log('Settings Debug:', {
      userRoleNames,
      primaryRole,
      rawRoles: state.user?.roles,
      user: state.user,
    });
    
    return allTabs.filter(tab => {
      // Check if user has any of the required roles for this tab
      const hasAccess = tab.roles.some(requiredRole => 
        userRoleNames.includes(requiredRole) || primaryRole === requiredRole
      );
      console.log(`Tab "${tab.name}" - Required: ${tab.roles.join(', ')} - Access: ${hasAccess}`);
      return hasAccess;
    });
  }, [userRoleNames, primaryRole, state.user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <DashboardHeader
        title="Settings"
        subtitle="Configure your branch and personal preferences"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex rounded-3xl shadow-2xl bg-white/70 backdrop-blur-xl overflow-hidden border border-gray-100">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <div className="sm:flex">
              <Tab.List className="sm:w-80 bg-gradient-to-br from-white/80 via-indigo-50 to-blue-50 p-6 border-r border-gray-200 min-h-full flex flex-col gap-2">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">
                    Settings
                  </h3>
                </div>
                <div className="space-y-2">
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      className={({ selected }) =>
                        `w-full text-left px-4 py-4 rounded-xl flex flex-col gap-y-1 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                          selected
                            ? "bg-indigo-600 text-white shadow-lg scale-[1.02]"
                            : "text-gray-700 hover:bg-indigo-100/60 hover:scale-[1.01]"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <div className="flex items-center gap-x-3">
                            <tab.icon
                              className={`h-5 w-5 shrink-0 ${selected ? "text-white" : "text-indigo-600"}`}
                              aria-hidden="true"
                            />
                            <span className="font-semibold text-sm">{tab.name}</span>
                          </div>
                          <p className={`text-xs ml-8 ${selected ? "text-indigo-100" : "text-gray-500"}`}>
                            {tab.description}
                          </p>
                        </>
                      )}
                    </Tab>
                  ))}
                </div>
              </Tab.List>
              <Tab.Panels className="flex-1 p-8 bg-transparent">
                {tabs.map((tab) => (
                  <Tab.Panel
                    key={tab.name}
                    className={`space-y-8 transition-opacity duration-300 ${tab === tabs[selectedIndex] ? "opacity-100 animate-fadeIn" : "opacity-0"}`}
                  >
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
