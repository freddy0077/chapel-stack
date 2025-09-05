"use client";

import { useState } from "react";
import { Tab } from "@headlessui/react";
import {
  ShieldCheckIcon,
  UsersIcon,
  KeyIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

import RolePermissionManager from "./components/RolePermissionManager";
import UserRoleAssignment from "./components/UserRoleAssignment";
import DataSharingPolicies from "./components/DataSharingPolicies";
import AuditLogs from "./components/AuditLogs";
import BranchSwitcher from "@/app/dashboard/components/BranchSwitcher";
import DashboardHeader from "@/components/DashboardHeader";

import { useQuery } from "@apollo/client";
import { GET_SECURITY_OVERVIEW } from "@/graphql/queries/userQueries";
import { useAuth } from "@/contexts/AuthContextEnhanced";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SecurityAdministration() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const { state } = useAuth();
  const user = state.user;
  const organisationId = user?.organisationId;

  const { data: securityData, loading: securityLoading } = useQuery(
    GET_SECURITY_OVERVIEW,
    {
      variables: { organisationId },
      skip: !organisationId,
    },
  );

  // Extract counts from KPI cards
  const kpiCards = securityData?.dashboardData?.kpiCards || [];
  const activeUsersCard = kpiCards.find(
    (card: any) =>
      card.title?.toLowerCase().includes("member") ||
      card.title?.toLowerCase().includes("user"),
  );
  const rolesCard = kpiCards.find((card: any) =>
    card.title?.toLowerCase().includes("role"),
  );
  const activeUsersCount = activeUsersCard ? Number(activeUsersCard.value) : 0;
  const rolesCount = rolesCard ? Number(rolesCard.value) : 0;

  // Tab definitions
  const tabs = [
    { name: "User Access", icon: UsersIcon, component: UserRoleAssignment },
    {
      name: "Roles & Permissions",
      icon: KeyIcon,
      component: RolePermissionManager,
    },
    {
      name: "Data Sharing",
      icon: DocumentDuplicateIcon,
      component: DataSharingPolicies,
    },
    {
      name: "Audit Logs",
      icon: ClipboardDocumentListIcon,
      component: AuditLogs,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white pb-16">
      <DashboardHeader
        title="Security & Access Control"
        subtitle="Manage user access, roles, permissions, and security settings"
      />

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto mt-6">
        <div className="block">
          <Tab.Group
            selectedIndex={selectedTabIndex}
            onChange={setSelectedTabIndex}
          >
            <div className="border-b border-gray-200">
              <Tab.List className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }: { selected: boolean }) =>
                      classNames(
                        selected
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                        "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm focus:outline-none",
                      )
                    }
                  >
                    <tab.icon
                      className="-ml-0.5 mr-2 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span>{tab.name}</span>
                  </Tab>
                ))}
              </Tab.List>
            </div>
            <Tab.Panels className="mt-6">
              {tabs.map((tab, index) => (
                <Tab.Panel key={index}>
                  <tab.component />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <UsersIcon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Active Users
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {securityLoading ? "..." : activeUsersCount}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">&nbsp;</div>
                  <div className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View all
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <KeyIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Roles Defined
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {securityLoading ? "..." : rolesCount}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">&nbsp;</div>
                  <div className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Manage roles
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-amber-500 rounded-md p-3">
                  <DocumentDuplicateIcon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Data Policies
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">8</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    0 active / 0 inactive
                  </div>
                  <div className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View policies
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <ClipboardDocumentListIcon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Security Events
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">0</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Today: 0 events</div>
                  <div className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View logs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Guidelines Alert */}
        <div className="mt-6 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">
                Review our security guidelines and compliance recommendations
                for multi-branch church systems.
              </p>
              <p className="mt-3 text-sm md:mt-0 md:ml-6">
                <a
                  href="#"
                  className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                >
                  Learn more <span aria-hidden="true">&rarr;</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
