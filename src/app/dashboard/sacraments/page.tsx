"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  PlusIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  DocumentTextIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { SacramentStatsLoader } from "./SacramentStatsLoader";
import { UpcomingAnniversariesLoader } from "./UpcomingAnniversariesLoader";

// Placeholder components for each sacrament tab
import { BaptismRecordsLoader } from "./BaptismRecordsLoader";
import type { BaptismRecord } from "@/graphql/hooks/useBaptismRecords";

const BaptismRecords = () => (
  <BaptismRecordsLoader>
    {(records: BaptismRecord[], loading: boolean, error: unknown) => (
      <div>
        <h3 className="text-lg font-medium mb-4">Baptism Records</h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : error ? (
          <div className="text-red-600 font-semibold text-center py-4">Failed to load baptism records.</div>
        ) : records.length === 0 ? (
          <div className="py-4 text-center text-gray-500">No baptism records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officiant</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {records.map((rec) => (
  <tr key={rec.id}>
    <td className="px-4 py-2 whitespace-nowrap">{rec.memberId}</td>
    <td className="px-4 py-2 whitespace-nowrap">{new Date(rec.dateOfSacrament).toLocaleDateString()}</td>
    <td className="px-4 py-2 whitespace-nowrap">{rec.officiantName}</td>
    <td className="px-4 py-2 whitespace-nowrap">{rec.locationOfSacrament}</td>
    <td className="px-4 py-2 whitespace-nowrap">
      {rec.certificateUrl ? (
        <a href={rec.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">View</a>
      ) : (
        <span className="text-gray-400">—</span>
      )}
    </td>
    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{new Date(rec.createdAt).toLocaleDateString()}</td>
  </tr>
))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )}
  </BaptismRecordsLoader>
);
import { CommunionRecordsLoader } from "./CommunionRecordsLoader";
import type { CommunionRecord } from "@/graphql/hooks/useCommunionRecords";

const CommunionRecords = () => (
  <CommunionRecordsLoader>
    {(records: CommunionRecord[], loading: boolean, error: unknown) => (
      <div>
        <h3 className="text-lg font-medium mb-4">First Communion Records</h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : error ? (
          <div className="text-red-600 font-semibold text-center py-4">Failed to load communion records.</div>
        ) : records.length === 0 ? (
          <div className="py-4 text-center text-gray-500">No communion records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officiant</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.memberId}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{new Date(rec.dateOfSacrament).toLocaleDateString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.officiantName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.locationOfSacrament}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {rec.certificateUrl ? (
                        <a href={rec.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">View</a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{new Date(rec.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )}
  </CommunionRecordsLoader>
);
import { ConfirmationRecordsLoader } from "./ConfirmationRecordsLoader";
import type { ConfirmationRecord } from "@/graphql/hooks/useConfirmationRecords";

const ConfirmationRecords = () => (
  <ConfirmationRecordsLoader>
    {(records: ConfirmationRecord[], loading: boolean, error: unknown) => (
      <div>
        <h3 className="text-lg font-medium mb-4">Confirmation Records</h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : error ? (
          <div className="text-red-600 font-semibold text-center py-4">Failed to load confirmation records.</div>
        ) : records.length === 0 ? (
          <div className="py-4 text-center text-gray-500">No confirmation records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officiant</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.memberId}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{new Date(rec.dateOfSacrament).toLocaleDateString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.officiantName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.locationOfSacrament}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {rec.certificateUrl ? (
                        <a href={rec.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">View</a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{new Date(rec.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )}
  </ConfirmationRecordsLoader>
);
import { MarriageRecordsLoader } from "./MarriageRecordsLoader";
import type { MarriageRecord } from "@/graphql/hooks/useMarriageRecords";
import DashboardHeader from "@/components/DashboardHeader";

const MarriageRecords = () => (
  <MarriageRecordsLoader>
    {(records: MarriageRecord[], loading: boolean, error: unknown) => (
      <div>
        <h3 className="text-lg font-medium mb-4">Marriage Records</h3>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : error ? (
          <div className="text-red-600 font-semibold text-center py-4">Failed to load marriage records.</div>
        ) : records.length === 0 ? (
          <div className="py-4 text-center text-gray-500">No marriage records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officiant</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Witness 1</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Witness 2</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate #</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {records.map((rec) => (
                  <tr key={rec.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.memberId}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{new Date(rec.dateOfSacrament).toLocaleDateString()}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.officiantName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.locationOfSacrament}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.witness1Name || '—'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.witness2Name || '—'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.certificateNumber || '—'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {rec.certificateUrl ? (
                        <a href={rec.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">View</a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{rec.notes || '—'}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">{new Date(rec.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )}
  </MarriageRecordsLoader>
);
const AnniversaryTracker = () => (
  <div className="text-center py-8">
    <h3 className="text-lg font-medium">Anniversary Tracker</h3>
    <p className="text-gray-500 mt-2">Track upcoming sacramental anniversaries</p>
  </div>
);

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  trend?: "up" | "down" | "neutral";
  percentage?: number;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  iconColor: string;
}
const StatsCard = ({ title, value, description, trend, percentage, icon: Icon, iconColor }: StatsCardProps) => (
  <div className="bg-white overflow-hidden rounded-lg shadow-sm">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${iconColor}`}>
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
          <dd>
            <div className="text-lg font-medium text-gray-900">{value}</div>
          </dd>
        </div>
      </div>
    </div>
    <div className="bg-gray-50 px-5 py-3">
      <div className="text-sm">
        <span className="text-gray-500">{description}</span>
        {trend && percentage && (
          <span
            className={`ml-2 ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"}`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
            {percentage}%
          </span>
        )}
      </div>
    </div>
  </div>
);

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export default function SacramentsPage() {
  const [, setActiveTab] = useState("overview");
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white pb-16 overflow-visible">
      {/* Wrapping DashboardHeader in relative z-20 to ensure dropdown menu is visible above all content */}
      <div className="relative z-20">
        <DashboardHeader
          title="Sacraments"
          subtitle="Track and manage all sacramental records and spiritual milestones"
          action={
            <div className="mt-6 sm:mt-0 flex flex-wrap gap-3 justify-start sm:justify-end">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow hover:bg-white focus:outline-none ring-1 ring-inset ring-indigo-200">
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5 text-indigo-600" aria-hidden="true" />
                    New Record
                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 text-indigo-400" aria-hidden="true" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard/sacraments/baptism/new"
                            className={`${active ? "bg-indigo-50 text-indigo-900" : "text-gray-700"} block px-4 py-2 text-sm rounded-md`}
                          >
                            New Baptism Record
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard/sacraments/communion/new"
                            className={`${active ? "bg-indigo-50 text-indigo-900" : "text-gray-700"} block px-4 py-2 text-sm rounded-md`}
                          >
                            New First Communion Record
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard/sacraments/confirmation/new"
                            className={`${active ? "bg-indigo-50 text-indigo-900" : "text-gray-700"} block px-4 py-2 text-sm rounded-md`}
                          >
                            New Confirmation Record
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard/sacraments/marriage/new"
                            className={`${active ? "bg-indigo-50 text-indigo-900" : "text-gray-700"} block px-4 py-2 text-sm rounded-md`}
                          >
                            New Marriage Record
                          </Link>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          }
        />
      </div>
   
      {/* Header */}
      {/* <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 shadow-lg px-8 py-8 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Sacramental Records</h1>
          <p className="mt-2 text-base text-indigo-100">Track and manage all sacramental records and spiritual milestones</p>
        </div>
        <div className="mt-6 sm:mt-0 flex flex-wrap gap-3 justify-start sm:justify-end">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow hover:bg-white focus:outline-none ring-1 ring-inset ring-indigo-200">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5 text-indigo-600" aria-hidden="true" />
                New Record
                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 text-indigo-400" aria-hidden="true" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/sacraments/baptism/new"
                        className={`${active ? "bg-indigo-50 text-indigo-900" : "text-gray-700"} block px-4 py-2 text-sm rounded-md`}
                      >
                        New Baptism Record
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/sacraments/communion/new"
                        className={`${active ? "bg-indigo-50 text-indigo-900" : "text-gray-700"} block px-4 py-2 text-sm rounded-md`}
                      >
                        New First Communion Record
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/sacraments/confirmation/new"
                        className={`${active ? "bg-indigo-50 text-indigo-900" : "text-gray-700"} block px-4 py-2 text-sm rounded-md`}
                      >
                        New Confirmation Record
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard/sacraments/marriage/new"
                        className={`${active ? "bg-indigo-50 text-indigo-900" : "text-gray-700"} block px-4 py-2 text-sm rounded-md`}
                      >
                        New Marriage Record
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white/80 px-3 py-2 text-sm font-semibold text-indigo-700 shadow hover:bg-white focus:outline-none ring-1 ring-inset ring-indigo-200">
                <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-indigo-400" aria-hidden="true" />
                Export
                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 text-indigo-300" aria-hidden="true" />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={`${active ? "bg-indigo-50 text-indigo-900" : "text-gray-700"} block px-4 py-2 text-sm rounded-md`}
                      >
                        Export to Excel
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={`${active ? "bg-indigo-50 text-indigo-900" : "text-gray-700"} block px-4 py-2 text-sm rounded-md`}
                      >
                        Export to PDF
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={`${active ? "bg-indigo-50 text-indigo-900" : "text-gray-700"} block px-4 py-2 text-sm rounded-md`}
                      >
                        Export to CSV
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <Link
            href="/dashboard/sacraments/anniversaries"
            className="inline-flex items-center rounded-md bg-white/80 px-3 py-2 text-sm font-semibold text-indigo-700 shadow hover:bg-white focus:outline-none ring-1 ring-inset ring-indigo-200"
          >
            <CalendarIcon className="-ml-1 mr-2 h-5 w-5 text-indigo-400" aria-hidden="true" />
            Anniversaries
          </Link>
        </div>
      </div> */}
    

      <div className="bg-white/90 rounded-2xl shadow-xl ring-1 ring-indigo-100">
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
          <div className="px-4 border-b border-indigo-100">
            <TabsList className="flex items-center space-x-6">
              <TabsTrigger
                value="overview"
                className="py-4 px-1 border-b-2 transition-colors hover:text-indigo-600 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 data-[state=inactive]:border-transparent text-base font-semibold tracking-tight"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="baptism"
                className="py-4 px-1 border-b-2 transition-colors hover:text-indigo-600 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 data-[state=inactive]:border-transparent text-base font-semibold tracking-tight"
              >
                Baptism
              </TabsTrigger>
              <TabsTrigger
                value="communion"
                className="py-4 px-1 border-b-2 transition-colors hover:text-indigo-600 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 data-[state=inactive]:border-transparent text-base font-semibold tracking-tight"
              >
                First Communion
              </TabsTrigger>
              <TabsTrigger
                value="confirmation"
                className="py-4 px-1 border-b-2 transition-colors hover:text-indigo-600 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 data-[state=inactive]:border-transparent text-base font-semibold tracking-tight"
              >
                Confirmation
              </TabsTrigger>
              <TabsTrigger
                value="marriage"
                className="py-4 px-1 border-b-2 transition-colors hover:text-indigo-600 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 data-[state=inactive]:border-transparent text-base font-semibold tracking-tight"
              >
                Marriage
              </TabsTrigger>
              <TabsTrigger
                value="anniversaries"
                className="py-4 px-1 border-b-2 transition-colors hover:text-indigo-600 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 data-[state=inactive]:border-transparent text-base font-semibold tracking-tight"
              >
                Anniversary Tracker
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="p-6">
            <SacramentStatsLoader period="last12months">
              {(stats, loading, error) => (
                <>
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    </div>
                  ) : error ? (
                    <div className="text-red-600 font-semibold text-center py-4">Failed to load sacrament stats.</div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {stats.map((stat, index) => {
                        let icon = DocumentTextIcon;
                        let iconColor = "bg-blue-500";
                        if (stat.sacramentType === "BAPTISM") { icon = DocumentTextIcon; iconColor = "bg-blue-500"; }
                        else if (stat.sacramentType === "COMMUNION") { icon = DocumentTextIcon; iconColor = "bg-green-500"; }
                        else if (stat.sacramentType === "CONFIRMATION") { icon = DocumentTextIcon; iconColor = "bg-purple-500"; }
                        else if (stat.sacramentType === "MARRIAGE") { icon = DocumentTextIcon; iconColor = "bg-pink-500"; }
                        else if (stat.sacramentType === "ANNIVERSARY") { icon = CalendarIcon; iconColor = "bg-amber-500"; }
                        else if (stat.sacramentType === "CERTIFICATE") { icon = ClockIcon; iconColor = "bg-orange-500"; }
                        return (
                          <StatsCard
                            key={index}
                            title={stat.sacramentType.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            value={stat.count}
                            description={stat.period || 'Last 12 months'.replace("'", "&apos;")}
                            trend={stat.trend}
                            percentage={stat.percentage}
                            icon={icon}
                            iconColor={iconColor}
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </SacramentStatsLoader>
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Recent Activity Card */}
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Activity</h3>
                  <div className="mt-2 divide-y divide-gray-200">
                    <div className="py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
                          <DocumentTextIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">New baptism record added</p>
                          <p className="text-sm text-gray-500">Emma Wilson's baptism recorded by Pastor Thomas</p>
                          <p className="mt-1 text-xs text-gray-500">Today at 9:42 AM</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                          <DocumentTextIcon className="h-5 w-5 text-green-600" aria-hidden="true" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">First Communion record added</p>
                          <p className="text-sm text-gray-500">Noah Martinez received first communion</p>
                          <p className="mt-1 text-xs text-gray-500">Yesterday at 2:15 PM</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-pink-100 rounded-full p-1">
                          <DocumentTextIcon className="h-5 w-5 text-pink-600" aria-hidden="true" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">Marriage certificate uploaded</p>
                          <p className="text-sm text-gray-500">Michael &amp; Sarah Johnson's marriage certificate</p>
                          <p className="mt-1 text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      View all activity
                      <span aria-hidden="true"> &rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Upcoming Anniversaries</h3>
                  <div className="mt-2 divide-y divide-gray-200">
                    <UpcomingAnniversariesLoader limit={5}>
                      {(anniversaries, loading, error) => (
                        loading ? (
                          <div className="flex justify-center items-center h-20">
                            <svg className="animate-spin h-6 w-6 text-indigo-600" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                          </div>
                        ) : error ? (
                          <div className="text-red-600 font-semibold text-center py-4">Failed to load anniversaries.</div>
                        ) : anniversaries.length === 0 ? (
                          <div className="py-4 text-center text-gray-500">No upcoming anniversaries.</div>
                        ) : (
                          anniversaries.map((a, i) => (
                            <div className="py-4" key={i}>
                              <div className="flex items-center">
                                <div className={`flex-shrink-0 rounded-full p-1 ${a.isSpecial ? 'bg-amber-100' : 'bg-blue-100'}`}>
                                  <CalendarIcon className={`h-5 w-5 ${a.isSpecial ? 'text-amber-600' : 'text-blue-600'}`} aria-hidden="true" />
                                </div>
                                <div className="ml-4">
                                  <p className="text-sm font-medium text-gray-900">{a.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {a.anniversaryType || a.sacramentType} Anniversary
                                    {a.isSpecial && (
                                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 ml-2">Special</span>
                                    )}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500">{a.timeUntil}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )
                      )}
                    </UpcomingAnniversariesLoader>
                    <div className="mt-6">
                      <Link href="/dashboard/sacraments/anniversaries" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        View all anniversaries
                        <span aria-hidden="true"> &rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="baptism" className="p-6">
            <BaptismRecords />
          </TabsContent>
          <TabsContent value="communion" className="p-6">
            <CommunionRecords />
          </TabsContent>
          <TabsContent value="confirmation" className="p-6">
            <ConfirmationRecords />
          </TabsContent>
          <TabsContent value="marriage" className="p-6">
            <MarriageRecords />
          </TabsContent>
          <TabsContent value="anniversaries" className="p-6">
            <AnniversaryTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
