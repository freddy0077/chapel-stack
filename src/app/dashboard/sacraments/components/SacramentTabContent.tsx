"use client";

import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SparklesIcon,
  GiftIcon,
  HeartIcon,
  UserGroupIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

// Import existing record components
import { BaptismRecordsLoader } from "../BaptismRecordsLoader";
import type { BaptismRecord } from "@/graphql/hooks/useBaptismRecords";
import { CommunionRecordsLoader } from "../CommunionRecordsLoader";
import type { CommunionRecord } from "@/graphql/hooks/useCommunionRecords";
import { ConfirmationRecordsLoader } from "../ConfirmationRecordsLoader";
import type { ConfirmationRecord } from "@/graphql/hooks/useConfirmationRecords";
import { MarriageRecordsLoader } from "../MarriageRecordsLoader";
import type { MarriageRecord } from "@/graphql/hooks/useMarriageRecords";
import { UpcomingAnniversariesLoader } from "../UpcomingAnniversariesLoader";

// Individual tab content components
const BaptismRecords = ({
  onOpenModal,
  refetch,
}: {
  onOpenModal?: () => void;
  refetch?: () => void;
}) => (
  <BaptismRecordsLoader>
    {(
      records: BaptismRecord[],
      loading: boolean,
      error: unknown,
      loaderRefetch: () => void,
    ) => (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SparklesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Baptism Records
                </h3>
                <p className="text-sm text-gray-600">
                  Sacred water baptisms and initiations
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {records.length}
              </p>
              <p className="text-xs text-gray-500">Total records</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Failed to load baptism records</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No baptism records
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new baptism record.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <SparklesIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Member ID: {record.memberId}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(record.dateOfSacrament).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {record.officiantName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {record.locationOfSacrament}
                    </p>
                  </div>
                </div>
              ))}
              {records.length > 5 && (
                <div className="text-center pt-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all {records.length} records →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )}
  </BaptismRecordsLoader>
);

const CommunionRecords = ({
  onOpenModal,
  refetch,
}: {
  onOpenModal?: () => void;
  refetch?: () => void;
}) => (
  <CommunionRecordsLoader>
    {(
      records: CommunionRecord[],
      loading: boolean,
      error: unknown,
      loaderRefetch: () => void,
    ) => (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <GiftIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  First Communion Records
                </h3>
                <p className="text-sm text-gray-600">
                  First reception of the Eucharist
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-600">
                {records.length}
              </p>
              <p className="text-xs text-gray-500">Total records</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Failed to load communion records</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <GiftIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No communion records
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new communion record.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <GiftIcon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Member ID: {record.memberId}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(record.dateOfSacrament).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {record.officiantName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {record.locationOfSacrament}
                    </p>
                  </div>
                </div>
              ))}
              {records.length > 5 && (
                <div className="text-center pt-4">
                  <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                    View all {records.length} records →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )}
  </CommunionRecordsLoader>
);

const ConfirmationRecords = ({
  onOpenModal,
  refetch,
}: {
  onOpenModal?: () => void;
  refetch?: () => void;
}) => (
  <ConfirmationRecordsLoader>
    {(
      records: ConfirmationRecord[],
      loading: boolean,
      error: unknown,
      loaderRefetch: () => void,
    ) => (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <HeartIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmation Records
                </h3>
                <p className="text-sm text-gray-600">
                  Strengthening of faith through the Spirit
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">
                {records.length}
              </p>
              <p className="text-xs text-gray-500">Total records</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">
                Failed to load confirmation records
              </p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No confirmation records
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new confirmation record.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <HeartIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Member ID: {record.memberId}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(record.dateOfSacrament).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {record.officiantName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {record.locationOfSacrament}
                    </p>
                  </div>
                </div>
              ))}
              {records.length > 5 && (
                <div className="text-center pt-4">
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    View all {records.length} records →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )}
  </ConfirmationRecordsLoader>
);

const MarriageRecords = ({
  onOpenModal,
  refetch,
}: {
  onOpenModal?: () => void;
  refetch?: () => void;
}) => (
  <MarriageRecordsLoader>
    {(
      records: MarriageRecord[],
      loading: boolean,
      error: unknown,
      loaderRefetch: () => void,
    ) => (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Marriage Records
                </h3>
                <p className="text-sm text-gray-600">
                  Sacred unions blessed in matrimony
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-rose-600">
                {records.length}
              </p>
              <p className="text-xs text-gray-500">Total records</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Failed to load marriage records</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No marriage records
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new marriage record.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Member ID: {record.memberId}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(record.dateOfSacrament).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {record.officiantName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {record.locationOfSacrament}
                    </p>
                  </div>
                </div>
              ))}
              {records.length > 5 && (
                <div className="text-center pt-4">
                  <button className="text-rose-600 hover:text-rose-700 text-sm font-medium">
                    View all {records.length} records →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )}
  </MarriageRecordsLoader>
);

const AnniversaryTracker = () => (
  <UpcomingAnniversariesLoader>
    {(anniversaries: any[], loading: boolean, error: unknown) => (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Upcoming Anniversaries
                </h3>
                <p className="text-sm text-gray-600">
                  Celebrating spiritual milestones
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {anniversaries.length}
              </p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Failed to load anniversaries</p>
            </div>
          ) : anniversaries.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No upcoming anniversaries
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back later for milestone celebrations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {anniversaries.slice(0, 5).map((anniversary, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Anniversary #{index + 1}
                      </p>
                      <p className="text-sm text-gray-500">
                        Details coming soon
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )}
  </UpcomingAnniversariesLoader>
);

interface SacramentTabContentProps {
  baptismRefetchRef: React.MutableRefObject<(() => void) | null>;
  communionRefetchRef: React.MutableRefObject<(() => void) | null>;
  confirmationRefetchRef: React.MutableRefObject<(() => void) | null>;
  marriageRefetchRef: React.MutableRefObject<(() => void) | null>;
}

export default function SacramentTabContent({
  baptismRefetchRef,
  communionRefetchRef,
  confirmationRefetchRef,
  marriageRefetchRef,
}: SacramentTabContentProps) {
  return (
    <Tabs defaultValue="baptism" className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-1">
        <TabsTrigger
          value="baptism"
          className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-lg transition-all"
        >
          <SparklesIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Baptism</span>
        </TabsTrigger>
        <TabsTrigger
          value="communion"
          className="flex items-center space-x-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 rounded-lg transition-all"
        >
          <GiftIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Communion</span>
        </TabsTrigger>
        <TabsTrigger
          value="confirmation"
          className="flex items-center space-x-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg transition-all"
        >
          <HeartIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Confirmation</span>
        </TabsTrigger>
        <TabsTrigger
          value="marriage"
          className="flex items-center space-x-2 data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 rounded-lg transition-all"
        >
          <UserGroupIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Marriage</span>
        </TabsTrigger>
        <TabsTrigger
          value="anniversaries"
          className="flex items-center space-x-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 rounded-lg transition-all"
        >
          <CalendarIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Anniversaries</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="baptism" className="mt-0">
          <BaptismRecords refetch={() => baptismRefetchRef.current?.()} />
        </TabsContent>

        <TabsContent value="communion" className="mt-0">
          <CommunionRecords refetch={() => communionRefetchRef.current?.()} />
        </TabsContent>

        <TabsContent value="confirmation" className="mt-0">
          <ConfirmationRecords
            refetch={() => confirmationRefetchRef.current?.()}
          />
        </TabsContent>

        <TabsContent value="marriage" className="mt-0">
          <MarriageRecords refetch={() => marriageRefetchRef.current?.()} />
        </TabsContent>

        <TabsContent value="anniversaries" className="mt-0">
          <AnniversaryTracker />
        </TabsContent>
      </div>
    </Tabs>
  );
}
