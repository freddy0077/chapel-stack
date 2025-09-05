"use client";

import React from "react";
import {
  Card,
  Badge,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@tremor/react";
import {
  DocumentTextIcon,
  CalendarDaysIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { DeathRegister } from "../../types/deathRegister";
import { DeathRegisterSearchFilters } from "./DeathRegisterSearchFilters";
import { RecentDeathsSection } from "./RecentDeathsSection";
import { MemorialCalendarSection } from "./MemorialCalendarSection";
import { AnalyticsSection } from "./AnalyticsSection";
import { DeathRegisterManagement } from "./DeathRegisterManagement";

interface DeathRegisterTabsProps {
  selectedTab: number;
  onTabChange: (index: number) => void;
  filteredRecords: DeathRegister[];
  recentDeaths: DeathRegister[];
  upcomingMemorials: DeathRegister[];
  deathRegisters: DeathRegister[];
  loading: boolean;
  memorialLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterYear: string;
  onFilterYearChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  availableYears: string[];
  onEdit: (record: DeathRegister) => void;
  onDelete: (id: string) => void;
  onMarkFamilyNotified: (id: string) => void;
}

export const DeathRegisterTabs: React.FC<DeathRegisterTabsProps> = ({
  selectedTab,
  onTabChange,
  filteredRecords,
  recentDeaths,
  upcomingMemorials,
  deathRegisters,
  loading,
  memorialLoading,
  searchTerm,
  onSearchChange,
  filterYear,
  onFilterYearChange,
  sortBy,
  onSortByChange,
  availableYears,
  onEdit,
  onDelete,
  onMarkFamilyNotified,
}) => {
  return (
    <Card className="p-0 overflow-hidden">
      <TabGroup index={selectedTab} onIndexChange={onTabChange}>
        <TabList className="bg-slate-50 border-b border-slate-200">
          <Tab className="flex items-center space-x-2 px-6 py-4 text-slate-600 hover:text-slate-900 font-medium">
            <DocumentTextIcon className="h-5 w-5" />
            <span>Death Records</span>
            <Badge className="bg-slate-200 text-slate-700 ml-2">
              {filteredRecords.length}
            </Badge>
          </Tab>
          <Tab className="flex items-center space-x-2 px-6 py-4 text-slate-600 hover:text-slate-900 font-medium">
            <CalendarDaysIcon className="h-5 w-5" />
            <span>Memorial Calendar</span>
            <Badge className="bg-purple-100 text-purple-700 ml-2">
              {upcomingMemorials?.length || 0}
            </Badge>
          </Tab>
          <Tab className="flex items-center space-x-2 px-6 py-4 text-slate-600 hover:text-slate-900 font-medium">
            <ChartBarIcon className="h-5 w-5" />
            <span>Reports & Analytics</span>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Death Records Tab */}
          <TabPanel className="p-6">
            <DeathRegisterSearchFilters
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              filterYear={filterYear}
              onFilterYearChange={onFilterYearChange}
              sortBy={sortBy}
              onSortByChange={onSortByChange}
              availableYears={availableYears}
            />

            <RecentDeathsSection recentDeaths={recentDeaths} />

            <DeathRegisterManagement
              records={filteredRecords}
              loading={loading}
              onEdit={onEdit}
              onDelete={onDelete}
              onMarkFamilyNotified={onMarkFamilyNotified}
            />
          </TabPanel>

          {/* Memorial Calendar Tab */}
          <TabPanel className="p-6">
            <MemorialCalendarSection
              upcomingMemorials={upcomingMemorials}
              loading={memorialLoading}
            />
          </TabPanel>

          {/* Reports & Analytics Tab */}
          <TabPanel className="p-6">
            <AnalyticsSection deathRegisters={deathRegisters} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
};
