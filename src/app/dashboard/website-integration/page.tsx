"use client";

import { useState } from "react";
import { Tab } from "@headlessui/react";
import {
  GlobeAltIcon,
  CodeBracketIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import PageHeader from "../components/PageHeader";
import GeneralIntegration from "./components/GeneralIntegration";
import APISettings from "./components/APISettings";
import EventsIntegration from "./components/EventsIntegration";
import SermonIntegration from "./components/SermonIntegration";
import MemberPortalIntegration from "./components/MemberPortalIntegration";
import MediaIntegration from "./components/MediaIntegration";

const tabs = [
  { name: "General", icon: GlobeAltIcon, component: GeneralIntegration },
  { name: "API Access", icon: CodeBracketIcon, component: APISettings },
  { name: "Events", icon: CalendarIcon, component: EventsIntegration },
  { name: "Sermons", icon: DocumentTextIcon, component: SermonIntegration },
  {
    name: "Member Portal",
    icon: UserGroupIcon,
    component: MemberPortalIntegration,
  },
  { name: "Media", icon: PhotoIcon, component: MediaIntegration },
];

export default function WebsiteIntegrationPage() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Website Integration"
        description="Configure how your church management system integrates with your public website"
        breadcrumbs={[
          { name: "Dashboard", href: "/dashboard" },
          {
            name: "Website Integration",
            href: "/dashboard/website-integration",
          },
        ]}
      />

      <div className="mt-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <Tab.Group
          selectedIndex={selectedTabIndex}
          onChange={setSelectedTabIndex}
        >
          <Tab.List className="flex space-x-4 border-b border-gray-200 px-6 py-4">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `flex items-center border-b-2 px-3 py-2 text-sm font-medium focus:outline-none ${
                    selected
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`
                }
              >
                <tab.icon
                  className="mr-2 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="p-6">
            {tabs.map((tab, idx) => {
              const TabComponent = tab.component;
              return (
                <Tab.Panel
                  key={tab.name}
                  className={idx === selectedTabIndex ? "block" : "hidden"}
                >
                  <TabComponent />
                </Tab.Panel>
              );
            })}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
