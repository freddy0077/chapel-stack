"use client";

import { useState, Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  PlusIcon,
  CalendarIcon,
  DocumentTextIcon,
  SparklesIcon,
  HeartIcon,
  GiftIcon,
  UserGroupIcon,
  ChartBarIcon,
  EyeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { SacramentStatsLoader } from "./SacramentStatsLoader";
import { UpcomingAnniversariesLoader } from "./UpcomingAnniversariesLoader";

// Placeholder components for each sacrament tab
import { BaptismRecordsLoader } from "./BaptismRecordsLoader";
import type { BaptismRecord } from "@/graphql/hooks/useBaptismRecords";
import { CommunionRecordsLoader } from "./CommunionRecordsLoader";
import type { CommunionRecord } from "@/graphql/hooks/useCommunionRecords";
import { ConfirmationRecordsLoader } from "./ConfirmationRecordsLoader";
import type { ConfirmationRecord } from "@/graphql/hooks/useConfirmationRecords";
import { MarriageRecordsLoader } from "./MarriageRecordsLoader";
import type { MarriageRecord } from "@/graphql/hooks/useMarriageRecords";
import DashboardHeader from "@/components/DashboardHeader";

// Import modal components
import CreateBaptismModal from "./components/CreateBaptismModal";
import CreateCommunionModal from "./components/CreateCommunionModal";
import CreateConfirmationModal from "./components/CreateConfirmationModal";
import CreateMarriageModal from "./components/CreateMarriageModal";

const BaptismRecords = ({ onOpenModal, refetch }: { onOpenModal?: () => void, refetch?: () => void }) => (
  <BaptismRecordsLoader>
    {(records: BaptismRecord[], loading: boolean, error: unknown, loaderRefetch: () => void) => (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <SparklesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Baptism Records</h3>
                <p className="text-sm text-gray-600">Sacred initiation into faith</p>
              </div>
            </div>
            <div className="bg-blue-100 px-3 py-1 rounded-full">
              <span className="text-blue-800 font-medium text-sm">{records.length} Records</span>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
              <SparklesIcon className="h-6 w-6 text-blue-600 absolute top-3 left-3" />
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="bg-red-50 p-4 rounded-full inline-flex mb-4">
              <DocumentTextIcon className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-red-600 font-semibold">Failed to load baptism records</p>
            <p className="text-gray-500 text-sm mt-1">Please try refreshing the page</p>
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-blue-50 p-4 rounded-full inline-flex mb-4">
              <SparklesIcon className="h-12 w-12 text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Baptism Records</h4>
            <p className="text-gray-500 mb-6">Start by adding your first baptism record</p>
            <button
              onClick={onOpenModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Baptism Record
            </button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {records.map((rec) => (
                <div key={rec.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <SparklesIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">
                      {new Date(rec.dateOfSacrament).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/*<h4 className="font-semibold text-gray-900 mb-2">{rec.memberId}</h4>*/}
                  <h4 className="font-semibold text-gray-900 mb-2">{rec.sacramentType}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{rec.officiantName}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{rec.locationOfSacrament}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    {rec.certificateUrl ? (
                      <a 
                        href={rec.certificateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                        Certificate
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">No certificate</span>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </BaptismRecordsLoader>
);

const CommunionRecords = ({ onOpenModal, refetch }: { onOpenModal?: () => void, refetch?: () => void }) => (
  <CommunionRecordsLoader>
    {(records: CommunionRecord[], loading: boolean, error: unknown, loaderRefetch: () => void) => (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <GiftIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">First Communion Records</h3>
                <p className="text-sm text-gray-600">First reception of the Eucharist</p>
              </div>
            </div>
            <div className="bg-amber-100 px-3 py-1 rounded-full">
              <span className="text-amber-800 font-medium text-sm">{records.length} Records</span>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin"></div>
              <GiftIcon className="h-6 w-6 text-amber-600 absolute top-3 left-3" />
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="bg-red-50 p-4 rounded-full inline-flex mb-4">
              <DocumentTextIcon className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-red-600 font-semibold">Failed to load communion records</p>
            <p className="text-gray-500 text-sm mt-1">Please try refreshing the page</p>
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-amber-50 p-4 rounded-full inline-flex mb-4">
              <GiftIcon className="h-12 w-12 text-amber-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Communion Records</h4>
            <p className="text-gray-500 mb-6">Start by adding your first communion record</p>
            <button
              onClick={onOpenModal}
              className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Communion Record
            </button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {records.map((rec) => (
                <div key={rec.id} className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-amber-100 p-2 rounded-lg group-hover:bg-amber-200 transition-colors">
                      <GiftIcon className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full font-medium">
                      {new Date(rec.dateOfSacrament).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/*<h4 className="font-semibold text-gray-900 mb-2">{rec.memberId}</h4>*/}
                  <h4 className="font-semibold text-gray-900 mb-2">{rec.sacramentType}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{rec.officiantName}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{rec.locationOfSacrament}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    {rec.certificateUrl ? (
                      <a 
                        href={rec.certificateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center text-amber-600 hover:text-amber-800 text-sm font-medium"
                      >
                        <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                        Certificate
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">No certificate</span>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </CommunionRecordsLoader>
);

const ConfirmationRecords = ({ onOpenModal, refetch }: { onOpenModal?: () => void, refetch?: () => void }) => (
  <ConfirmationRecordsLoader>
    {(records: ConfirmationRecord[], loading: boolean, error: unknown, loaderRefetch: () => void) => (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <HeartIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmation Records</h3>
                <p className="text-sm text-gray-600">Strengthening of faith through the Spirit</p>
              </div>
            </div>
            <div className="bg-purple-100 px-3 py-1 rounded-full">
              <span className="text-purple-800 font-medium text-sm">{records.length} Records</span>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
              <HeartIcon className="h-6 w-6 text-purple-600 absolute top-3 left-3" />
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="bg-red-50 p-4 rounded-full inline-flex mb-4">
              <DocumentTextIcon className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-red-600 font-semibold">Failed to load confirmation records</p>
            <p className="text-gray-500 text-sm mt-1">Please try refreshing the page</p>
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-purple-50 p-4 rounded-full inline-flex mb-4">
              <HeartIcon className="h-12 w-12 text-purple-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Confirmation Records</h4>
            <p className="text-gray-500 mb-6">Start by adding your first confirmation record</p>
            <button
              onClick={onOpenModal}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Confirmation Record
            </button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {records.map((rec) => (
                <div key={rec.id} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <HeartIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full font-medium">
                      {new Date(rec.dateOfSacrament).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/*<h4 className="font-semibold text-gray-900 mb-2">{rec.memberId}</h4>*/}
                  <h4 className="font-semibold text-gray-900 mb-2">{rec.sacramentType}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{rec.officiantName}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{rec.locationOfSacrament}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    {rec.certificateUrl ? (
                      <a 
                        href={rec.certificateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                        Certificate
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">No certificate</span>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </ConfirmationRecordsLoader>
);

const MarriageRecords = ({ onOpenModal, refetch }: { onOpenModal?: () => void, refetch?: () => void }) => (
  <MarriageRecordsLoader>
    {(records: MarriageRecord[], loading: boolean, error: unknown, loaderRefetch: () => void) => (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-rose-100 p-2 rounded-lg">
                <HeartIcon className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Marriage Records</h3>
                <p className="text-sm text-gray-600">Sacred union blessed by God</p>
              </div>
            </div>
            <div className="bg-rose-100 px-3 py-1 rounded-full">
              <span className="text-rose-800 font-medium text-sm">{records.length} Records</span>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-rose-200 border-t-rose-600 animate-spin"></div>
              <HeartIcon className="h-6 w-6 text-rose-600 absolute top-3 left-3" />
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="bg-red-50 p-4 rounded-full inline-flex mb-4">
              <DocumentTextIcon className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-red-600 font-semibold">Failed to load marriage records</p>
            <p className="text-gray-500 text-sm mt-1">Please try refreshing the page</p>
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-rose-50 p-4 rounded-full inline-flex mb-4">
              <HeartIcon className="h-12 w-12 text-rose-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Marriage Records</h4>
            <p className="text-gray-500 mb-6">Start by adding your first marriage record</p>
            <button
              onClick={onOpenModal}
              className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Marriage Record
            </button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {records.map((rec) => (
                <div key={rec.id} className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-rose-100 p-2 rounded-lg group-hover:bg-rose-200 transition-colors">
                      <HeartIcon className="h-5 w-5 text-rose-600" />
                    </div>
                    <span className="text-xs text-rose-600 bg-rose-100 px-2 py-1 rounded-full font-medium">
                      {new Date(rec.dateOfSacrament).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/*<h4 className="font-semibold text-gray-900 mb-2">{rec.memberId}</h4>*/}
                  <h4 className="font-semibold text-gray-900 mb-2">{rec.sacramentType}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{rec.officiantName}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{rec.locationOfSacrament}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    {rec.certificateUrl ? (
                      <a 
                        href={rec.certificateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center text-rose-600 hover:text-rose-800 text-sm font-medium"
                      >
                        <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                        Certificate
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">No certificate</span>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
  const [isBaptismModalOpen, setIsBaptismModalOpen] = useState(false);
  const [isCommunionModalOpen, setIsCommunionModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isMarriageModalOpen, setIsMarriageModalOpen] = useState(false);

  // Store refetch functions for each sacrament type
  const baptismRefetchRef = useRef<(() => void) | null>(null);
  const communionRefetchRef = useRef<(() => void) | null>(null);
  const confirmationRefetchRef = useRef<(() => void) | null>(null);
  const marriageRefetchRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const handleBaptismSuccess = () => {
      setIsBaptismModalOpen(false);
      if (baptismRefetchRef.current) {
        baptismRefetchRef.current();
      }
      toast.success("Baptism record created successfully!");
    };

    const handleCommunionSuccess = () => {
      setIsCommunionModalOpen(false);
      if (communionRefetchRef.current) {
        communionRefetchRef.current();
      }
      toast.success("Communion record created successfully!");
    };

    const handleConfirmationSuccess = () => {
      setIsConfirmationModalOpen(false);
      if (confirmationRefetchRef.current) {
        confirmationRefetchRef.current();
      }
      toast.success("Confirmation record created successfully!");
    };

    const handleMarriageSuccess = () => {
      setIsMarriageModalOpen(false);
      if (marriageRefetchRef.current) {
        marriageRefetchRef.current();
      }
      toast.success("Marriage record created successfully!");
    };

    const handleModalSuccess = () => {
      // Optionally trigger a refetch of data here
      toast.success("Record added successfully!");
    };

    return () => {
      // Clean up
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <DashboardHeader
        title="Sacraments"
        subtitle="Track and manage all sacramental records and spiritual milestones"
        icon={<SparklesIcon className="h-10 w-10 text-white" />}
        action={
          <div className="mt-6 sm:mt-0 flex flex-wrap gap-3 justify-start sm:justify-end">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-lg bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-indigo-700 shadow-lg hover:bg-white focus:outline-none ring-1 ring-inset ring-indigo-200 transition-all duration-200">
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
                <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none backdrop-blur-sm">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setIsBaptismModalOpen(true)}
                          className={`${active ? "bg-blue-50 text-blue-900" : "text-gray-700"} flex items-center px-4 py-3 text-sm rounded-md mx-1 transition-colors w-full text-left`}
                        >
                          <SparklesIcon className="h-4 w-4 mr-3 text-blue-600" />
                          New Baptism Record
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setIsCommunionModalOpen(true)}
                          className={`${active ? "bg-amber-50 text-amber-900" : "text-gray-700"} flex items-center px-4 py-3 text-sm rounded-md mx-1 transition-colors w-full text-left`}
                        >
                          <GiftIcon className="h-4 w-4 mr-3 text-amber-600" />
                          New First Communion Record
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setIsConfirmationModalOpen(true)}
                          className={`${active ? "bg-purple-50 text-purple-900" : "text-gray-700"} flex items-center px-4 py-3 text-sm rounded-md mx-1 transition-colors w-full text-left`}
                        >
                          <HeartIcon className="h-4 w-4 mr-3 text-purple-600" />
                          New Confirmation Record
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setIsMarriageModalOpen(true)}
                          className={`${active ? "bg-rose-50 text-rose-900" : "text-gray-700"} flex items-center px-4 py-3 text-sm rounded-md mx-1 transition-colors w-full text-left`}
                        >
                          <HeartIcon className="h-4 w-4 mr-3 text-rose-600" />
                          New Marriage Record
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        }
      />
   
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Overview */}
        <div className="mb-8">
          <SacramentStatsLoader period="all">
            {(stats: any[], loading: boolean, error: unknown, loaderRefetch: () => void) => (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Baptisms"
                  value={stats.find(s => s.type === 'BAPTISM')?.count || 0}
                  description="Sacred initiations"
                  icon={SparklesIcon}
                  iconColor="text-blue-600"
                  trend="up"
                  percentage={12}
                />
                <StatsCard
                  title="First Communions"
                  value={stats.find(s => s.type === 'EUCHARIST_FIRST_COMMUNION')?.count || 0}
                  description="First Eucharist receptions"
                  icon={GiftIcon}
                  iconColor="text-amber-600"
                  trend="up"
                  percentage={8}
                />
                <StatsCard
                  title="Confirmations"
                  value={stats.find(s => s.type === 'CONFIRMATION')?.count || 0}
                  description="Faith strengthened"
                  icon={HeartIcon}
                  iconColor="text-purple-600"
                  trend="neutral"
                />
                <StatsCard
                  title="Marriages"
                  value={stats.find(s => s.type === 'MARRIAGE')?.count || 0}
                  description="Sacred unions"
                  icon={HeartIcon}
                  iconColor="text-rose-600"
                  trend="up"
                  percentage={5}
                />
              </div>
            )}
          </SacramentStatsLoader>
        </div>

        {/* Upcoming Anniversaries */}
        <div className="mb-8">
          <UpcomingAnniversariesLoader>
            {(anniversaries: any[], loading: boolean, error: unknown, loaderRefetch: () => void) => (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <CalendarIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Upcoming Anniversaries</h3>
                        <p className="text-sm text-gray-600">Celebrate spiritual milestones</p>
                      </div>
                    </div>
                    <Link 
                      href="/dashboard/sacraments/anniversaries"
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                    >
                      View All
                      <ChartBarIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
                
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : anniversaries.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p>No upcoming anniversaries</p>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="space-y-3">
                      {anniversaries.slice(0, 5).map((anniversary, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="bg-indigo-100 p-2 rounded-full">
                              <CalendarIcon className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{anniversary.memberName}</p>
                              <p className="text-sm text-gray-600">{anniversary.sacramentType} Anniversary</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{anniversary.anniversaryDate}</p>
                            <p className="text-xs text-gray-500">{anniversary.yearsAgo} years</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </UpcomingAnniversariesLoader>
        </div>

        {/* Sacrament Records Tabs */}
        <Tabs defaultValue="baptism" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/50 backdrop-blur-sm rounded-xl p-1">
            <TabsTrigger value="baptism" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <SparklesIcon className="h-4 w-4" />
              <span>Baptism</span>
            </TabsTrigger>
            <TabsTrigger value="communion" className="flex items-center space-x-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">
              <GiftIcon className="h-4 w-4" />
              <span>Communion</span>
            </TabsTrigger>
            <TabsTrigger value="confirmation" className="flex items-center space-x-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              <HeartIcon className="h-4 w-4" />
              <span>Confirmation</span>
            </TabsTrigger>
            <TabsTrigger value="marriage" className="flex items-center space-x-2 data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700">
              <HeartIcon className="h-4 w-4" />
              <span>Marriage</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="baptism">
            <BaptismRecords 
              onOpenModal={() => setIsBaptismModalOpen(true)} 
              refetch={(loaderRefetch) => baptismRefetchRef.current = loaderRefetch}
            />
          </TabsContent>
          <TabsContent value="communion">
            <CommunionRecords 
              onOpenModal={() => setIsCommunionModalOpen(true)} 
              refetch={(loaderRefetch) => communionRefetchRef.current = loaderRefetch}
            />
          </TabsContent>
          <TabsContent value="confirmation">
            <ConfirmationRecords 
              onOpenModal={() => setIsConfirmationModalOpen(true)} 
              refetch={(loaderRefetch) => confirmationRefetchRef.current = loaderRefetch}
            />
          </TabsContent>
          <TabsContent value="marriage">
            <MarriageRecords 
              onOpenModal={() => setIsMarriageModalOpen(true)} 
              refetch={(loaderRefetch) => marriageRefetchRef.current = loaderRefetch}
            />
          </TabsContent>
        </Tabs>
      </div>
      {isBaptismModalOpen && (
        <CreateBaptismModal
          isOpen={isBaptismModalOpen}
          onClose={() => setIsBaptismModalOpen(false)}
          onSuccess={() => {
            setIsBaptismModalOpen(false);
            if (baptismRefetchRef.current) {
              baptismRefetchRef.current();
            }
            toast.success("Baptism record created successfully!");
          }}
        />
      )}
      {isCommunionModalOpen && (
        <CreateCommunionModal
          isOpen={isCommunionModalOpen}
          onClose={() => setIsCommunionModalOpen(false)}
          onSuccess={() => {
            setIsCommunionModalOpen(false);
            if (communionRefetchRef.current) {
              communionRefetchRef.current();
            }
            toast.success("Communion record created successfully!");
          }}
        />
      )}
      {isConfirmationModalOpen && (
        <CreateConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onSuccess={() => {
            setIsConfirmationModalOpen(false);
            if (confirmationRefetchRef.current) {
              confirmationRefetchRef.current();
            }
            toast.success("Confirmation record created successfully!");
          }}
        />
      )}
      {isMarriageModalOpen && (
        <CreateMarriageModal
          isOpen={isMarriageModalOpen}
          onClose={() => setIsMarriageModalOpen(false)}
          onSuccess={() => {
            setIsMarriageModalOpen(false);
            if (marriageRefetchRef.current) {
              marriageRefetchRef.current();
            }
            toast.success("Marriage record created successfully!");
          }}
        />
      )}
    </div>
  );
}
