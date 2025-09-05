import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Chip } from "@/components/ui/chip";
import { useRecipientGroups } from "@/graphql/hooks/useRecipientGroups";
import { useMemberSearch } from "@/graphql/hooks/useMemberSearch";
import { useFilteredMembers } from "@/graphql/hooks/useFilteredMembers";
import { useBirthdayMembers } from "@/graphql/hooks/useBirthdayMembers";
import { useRecipientFilterCounts } from "@/graphql/hooks/useRecipientFilterCounts";
import DemographicsModal from "./modals/DemographicsModal";
import EventAttendeesModal from "./modals/EventAttendeesModal";
import CustomListModal from "./modals/CustomListModal";

// Icons for the tabs
const GroupsIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
  </svg>
);

const BirthdayIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
    />
  </svg>
);

export default function RecipientSelector({
  recipients,
  setRecipients,
  birthdayRange,
  setBirthdayRange,
}) {
  const [mode, setMode] = useState("groups");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const {
    groups,
    loading: groupsLoading,
    error: groupsError,
  } = useRecipientGroups();
  const {
    members: searchMembers,
    searchMembers: triggerSearch,
    loading: searchLoading,
  } = useMemberSearch();
  const {
    members: filteredMembers,
    fetchFiltered,
    loading: filterLoading,
  } = useFilteredMembers();
  const {
    members: birthdayMembers,
    fetchBirthdays,
    loading: birthdayLoading,
  } = useBirthdayMembers();

  // Define all available filter keys
  const availableFilterKeys = [
    "all-members",
    "volunteers",
    "inactive",
    "donors",
    "parents",
    "families",
    "anniversary-celebrants",
    "prayer-request-submitters",
    "new-members",
    "recently-baptised",
  ];

  // Add recipient filter counts hook - fetch counts when filter tab is active
  const {
    counts,
    loading: countsLoading,
    refetch: refetchCounts,
  } = useRecipientFilterCounts(availableFilterKeys, {
    contactType: "email", // Default to email counts, could be made configurable
    skip: mode !== "filter", // Only fetch when filter tab is active
  });

  // Get currently selected filter keys to fetch counts for
  const selectedFilterKeys = recipients
    .filter((r) => r.type === "Filter")
    .map((r) => r.key);

  // Add/remove logic
  const handleAddRecipient = (recipient) => {
    if (!recipients.find((r) => r.id === recipient.id)) {
      setRecipients([...recipients, recipient]);
    }
  };
  const handleRemoveRecipient = (recipientId) => {
    setRecipients(recipients.filter((r) => r.id !== recipientId));
  };
  const handleRemoveAll = () => setRecipients([]);

  // Add handler for birthday range
  function handleBirthdayRange(range) {
    setBirthdayRange(range);
    fetchBirthdays({ variables: { range } });
    // After fetching, automatically select all birthdayMembers
    // We'll use a useEffect to watch birthdayMembers and mode
    setAutoSelectBirthdaysTrigger(range + "-" + Date.now()); // force effect trigger
  }

  // Track auto-select birthdays
  const [autoSelectBirthdaysTrigger, setAutoSelectBirthdaysTrigger] =
    useState("");
  useEffect(() => {
    if (mode === "birthdays" && birthdayMembers.length > 0) {
      // Add all birthdayMembers not already in recipients
      setRecipients((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newBirthday = birthdayMembers.filter(
          (m) => !existingIds.has(m.id),
        );
        return [...prev, ...newBirthday.map((m) => ({ ...m, type: "Member" }))];
      });
    }
    // eslint-disable-next-line
  }, [birthdayMembers, mode, autoSelectBirthdaysTrigger]);

  // Get unique recipient types count
  const recipientCounts = recipients.reduce(
    (acc, r) => {
      if (r.type === "Group") acc.groups++;
      else if (r.type === "Member") acc.individuals++;
      else if (r.type === "Filter") acc.filters++;
      return acc;
    },
    { groups: 0, individuals: 0, filters: 0 },
  );

  // Modals for additional info
  const [demographicsOpen, setDemographicsOpen] = useState(false);
  const [eventAttendeesOpen, setEventAttendeesOpen] = useState(false);
  const [customListOpen, setCustomListOpen] = useState(false);
  const [pendingFilter, setPendingFilter] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Recipients</h2>
            <p className="text-sm text-gray-500">
              Select who should receive this message
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {recipients.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveAll}
              className="text-gray-500 border-gray-300"
            >
              Clear All
            </Button>
          )}
          <div className="bg-gray-100 rounded-full px-4 py-1 text-sm font-medium">
            {recipientCounts.groups +
              recipientCounts.individuals +
              recipientCounts.filters}{" "}
            selected
          </div>
        </div>
      </div>

      {/* Selection area */}
      <Tabs
        defaultValue="groups"
        className="w-full"
        onValueChange={setMode}
        value={mode}
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger
            value="filter"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white"
          >
            <FilterIcon />
            <span className="ml-2">Filter</span>
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white rounded-l-lg"
          >
            <GroupsIcon />
            <span className="ml-2">Groups</span>
          </TabsTrigger>
          <TabsTrigger
            value="search"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white"
          >
            <SearchIcon />
            <span className="ml-2">Search</span>
          </TabsTrigger>

          <TabsTrigger
            value="birthdays"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white rounded-r-lg"
          >
            <BirthdayIcon />
            <span className="ml-2">Birthdays</span>
          </TabsTrigger>
        </TabsList>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 min-h-[200px]">
          <TabsContent value="groups" className="mt-0">
            <div className="transition-opacity duration-200">
              {groupsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
                </div>
              ) : groupsError ? (
                <div className="text-center py-8">
                  <div className="text-red-500 mb-2">Failed to load groups</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Select groups to message all their members:
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {groups.map((group) => (
                      <div
                        key={group.id}
                        className="transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <div
                          className={`
                            rounded-lg p-3 cursor-pointer transition-all
                            ${
                              recipients.find((r) => r.id === group.id)
                                ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm"
                                : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"
                            }
                          `}
                          onClick={() =>
                            handleAddRecipient({ ...group, type: "Group" })
                          }
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                              <svg
                                width="16"
                                height="16"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <div className="flex-1 truncate">
                              <div className="font-medium text-gray-900 truncate">
                                {group.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {group.memberCount || "unknown"} members
                              </div>
                            </div>
                            {recipients.find((r) => r.id === group.id) && (
                              <div className="ml-2 text-violet-600">
                                <svg
                                  width="16"
                                  height="16"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="search" className="mt-0">
            <div className="transition-opacity duration-200 space-y-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value.length > 1)
                      triggerSearch({ variables: { query: e.target.value } });
                  }}
                  placeholder="Search by name, email, or phone..."
                  className="pl-10 rounded-full bg-white border-gray-300 focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
                />
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {searchLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-violet-500"></div>
                  </div>
                ) : searchMembers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm.length > 1
                      ? "No members found"
                      : "Type to search members"}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                    {searchMembers.map((member) => (
                      <div
                        key={member.id}
                        className={`
                          flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition
                          ${recipients.find((r) => r.id === member.id) ? "bg-violet-50" : ""}
                        `}
                        onClick={() =>
                          handleAddRecipient({ ...member, type: "Member" })
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 bg-violet-200 text-violet-700">
                            {member.firstName?.[0]}
                            {member.lastName?.[0]}
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {member.email || "No email"}
                            </div>
                          </div>
                        </div>

                        {recipients.find((r) => r.id === member.id) ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-violet-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveRecipient(member.id);
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-violet-100 hover:text-violet-700"
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="birthdays" className="mt-0">
            <div className="transition-opacity duration-200 space-y-5">
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={birthdayRange === "TODAY" ? "default" : "outline"}
                  onClick={() => handleBirthdayRange("TODAY")}
                  className={
                    birthdayRange === "TODAY"
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                      : ""
                  }
                >
                  Today
                </Button>
                <Button
                  size="sm"
                  variant={
                    birthdayRange === "THIS_WEEK" ? "default" : "outline"
                  }
                  onClick={() => handleBirthdayRange("THIS_WEEK")}
                  className={
                    birthdayRange === "THIS_WEEK"
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                      : ""
                  }
                >
                  This Week
                </Button>
                <Button
                  size="sm"
                  variant={
                    birthdayRange === "THIS_MONTH" ? "default" : "outline"
                  }
                  onClick={() => handleBirthdayRange("THIS_MONTH")}
                  className={
                    birthdayRange === "THIS_MONTH"
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                      : ""
                  }
                >
                  This Month
                </Button>
              </div>

              {birthdayLoading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500"></div>
                </div>
              ) : (
                <>
                  {birthdayRange && (
                    <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 text-sm">
                      <div className="flex items-center">
                        <BirthdayIcon className="text-violet-500 mr-2" />
                        <span className="font-medium text-violet-700">
                          {birthdayMembers.length}{" "}
                          {birthdayMembers.length === 1 ? "person" : "people"}{" "}
                          have birthdays{" "}
                          {birthdayRange === "TODAY"
                            ? "today"
                            : birthdayRange === "THIS_WEEK"
                              ? "this week"
                              : "this month"}
                        </span>
                      </div>
                      <div className="text-gray-600 mt-1 text-sm">
                        All birthday recipients have been automatically added to
                        your selection
                      </div>
                    </div>
                  )}

                  {birthdayRange && birthdayMembers.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                        {birthdayMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between px-4 py-2 hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-medium">
                                {member.firstName?.[0]}
                                {member.lastName?.[0]}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {member.firstName} {member.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Birthday:{" "}
                                  {new Date(
                                    member.dateOfBirth,
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="filter" className="mt-0">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Select advanced recipient groups not covered by Groups, Search,
                or Birthdays:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* All Members */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "all-members") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "all-members",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) =>
                            !(r.type === "Filter" && r.key === "all-members"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-all-members",
                          type: "Filter",
                          key: "all-members",
                          label: "All Members",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="All Members">
                        👥
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        All Members
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        All active church members
                        {countsLoading ? (
                          <span className="ml-1 text-violet-500">
                            Loading...
                          </span>
                        ) : counts["all-members"] ? (
                          <span className="ml-1 font-medium text-violet-600">
                            ({counts["all-members"]} recipients)
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "all-members",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Volunteers */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "volunteers") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "volunteers",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) =>
                            !(r.type === "Filter" && r.key === "volunteers"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-volunteers",
                          type: "Filter",
                          key: "volunteers",
                          label: "Volunteers",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Volunteers">
                        🙋‍♂️
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        Volunteers
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Active ministry volunteers
                        {countsLoading ? (
                          <span className="ml-1 text-violet-500">
                            Loading...
                          </span>
                        ) : counts.volunteers ? (
                          <span className="ml-1 font-medium text-violet-600">
                            ({counts.volunteers} recipients)
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "volunteers",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* New Members */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "new-members") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "new-members",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) =>
                            !(r.type === "Filter" && r.key === "new-members"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-new-members",
                          type: "Filter",
                          key: "new-members",
                          label: "New Members",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="New Members">
                        🆕
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        New Members
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Joined in last 30 days
                        {countsLoading ? (
                          <span className="ml-1 text-violet-500">
                            Loading...
                          </span>
                        ) : counts["new-members"] ? (
                          <span className="ml-1 font-medium text-violet-600">
                            ({counts["new-members"]} recipients)
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "new-members",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inactive Members */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "inactive") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "inactive",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) => !(r.type === "Filter" && r.key === "inactive"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-inactive",
                          type: "Filter",
                          key: "inactive",
                          label: "Inactive Members",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Inactive">
                        😴
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        Inactive Members
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Members with inactive status
                        {countsLoading ? (
                          <span className="ml-1 text-violet-500">
                            Loading...
                          </span>
                        ) : counts.inactive ? (
                          <span className="ml-1 font-medium text-violet-600">
                            ({counts.inactive} recipients)
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "inactive",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Parents & Families */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "parents") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "parents",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) => !(r.type === "Filter" && r.key === "parents"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-parents",
                          type: "Filter",
                          key: "parents",
                          label: "Parents & Families",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Parents">
                        👨‍👩‍👧‍👦
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        Parents & Families
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Households with children
                        {countsLoading ? (
                          <span className="ml-1 text-violet-500">
                            Loading...
                          </span>
                        ) : counts.parents ? (
                          <span className="ml-1 font-medium text-violet-600">
                            ({counts.parents} recipients)
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "parents",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {/* Newsletter Subscribers */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "newsletter") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "newsletter",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) =>
                            !(r.type === "Filter" && r.key === "newsletter"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-newsletter",
                          type: "Filter",
                          key: "newsletter",
                          label: "Newsletter Subscribers",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Newsletter">
                        📰
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        Newsletter Subscribers
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Opted-in for newsletters
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "newsletter",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {/* Anniversary Celebrants */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "anniversary") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "anniversary",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) =>
                            !(r.type === "Filter" && r.key === "anniversary"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-anniversary",
                          type: "Filter",
                          key: "anniversary",
                          label: "Anniversary Celebrants",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Anniversary">
                        🎉
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        Anniversary Celebrants
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        This month's anniversaries
                        {countsLoading ? (
                          <span className="ml-1 text-violet-500">
                            Loading...
                          </span>
                        ) : counts["anniversary-celebrants"] ? (
                          <span className="ml-1 font-medium text-violet-600">
                            ({counts["anniversary-celebrants"]} recipients)
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "anniversary",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {/* Recently Baptized */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "baptized") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "baptized",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) => !(r.type === "Filter" && r.key === "baptized"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-baptized",
                          type: "Filter",
                          key: "baptized",
                          label: "Recently Baptized",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Baptized">
                        💧
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        Recently Baptized
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Members baptized recently
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "baptized",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {/* Milestone Achievers */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "milestone") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "milestone",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) =>
                            !(r.type === "Filter" && r.key === "milestone"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-milestone",
                          type: "Filter",
                          key: "milestone",
                          label: "Milestone Achievers",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Milestone">
                        🏅
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        Milestone Achievers
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Special recognitions
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "milestone",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {/* Custom List */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "custom") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    setPendingFilter("custom");
                    setCustomListOpen(true);
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Custom">
                        📋
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        Custom List (CSV/Manual)
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Upload or paste emails
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "custom",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {/* Demographics */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "demographics") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    setPendingFilter("demographics");
                    setDemographicsOpen(true);
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Demographics">
                        📊
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        By Demographics
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Filter by age, gender, location
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "demographics",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {/* Inactive Members */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "inactive") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "inactive",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) => !(r.type === "Filter" && r.key === "inactive"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-inactive",
                          type: "Filter",
                          key: "inactive",
                          label: "Inactive Members",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Inactive">
                        🛌
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        Inactive Members
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Not active recently
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "inactive",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {/* Prayer Request Submitters */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "prayer") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "prayer",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) => !(r.type === "Filter" && r.key === "prayer"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-prayer",
                          type: "Filter",
                          key: "prayer",
                          label: "Prayer Request Submitters",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Prayer">
                        🙏
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        Prayer Request Submitters
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        People who submitted prayers
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "prayer",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {/* Guests/Visitors */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "guests") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "guests",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) => !(r.type === "Filter" && r.key === "guests"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-guests",
                          type: "Filter",
                          key: "guests",
                          label: "Guests & Visitors",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Guests">
                        🎟️
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        Guests & Visitors
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Recent church visitors
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "guests",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {/* Donors */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "donors") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "donors",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) => !(r.type === "Filter" && r.key === "donors"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-donors",
                          type: "Filter",
                          key: "donors",
                          label: "Donors",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Donors">
                        💸
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        Donors
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Financial supporters
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "donors",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {/* Staff */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "staff") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "staff",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) => !(r.type === "Filter" && r.key === "staff"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-staff",
                          type: "Filter",
                          key: "staff",
                          label: "Staff",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Staff">
                        🧑‍💼
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        Staff
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Church staff and leaders
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "staff",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {/* Volunteers */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "volunteers") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "volunteers",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) =>
                            !(r.type === "Filter" && r.key === "volunteers"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-volunteers",
                          type: "Filter",
                          key: "volunteers",
                          label: "Volunteers",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="Volunteers">
                        🤝
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        Volunteers
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Active volunteers
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "volunteers",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {/* New Members */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "new-members") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "new-members",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) =>
                            !(r.type === "Filter" && r.key === "new-members"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-new-members",
                          type: "Filter",
                          key: "new-members",
                          label: "New Members",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="New Members">
                        🆕
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        New Members
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Recently joined
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "new-members",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {/* All Members */}
                <div
                  className={`rounded-lg p-3 cursor-pointer transition-all ${recipients.find((r) => r.type === "Filter" && r.key === "all-members") ? "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 shadow-sm" : "bg-white border border-gray-200 hover:border-violet-200 hover:bg-violet-50"}`}
                  onClick={() => {
                    const exists = recipients.find(
                      (r) => r.type === "Filter" && r.key === "all-members",
                    );
                    if (exists) {
                      setRecipients(
                        recipients.filter(
                          (r) =>
                            !(r.type === "Filter" && r.key === "all-members"),
                        ),
                      );
                    } else {
                      setRecipients([
                        ...recipients,
                        {
                          id: "filter-all-members",
                          type: "Filter",
                          key: "all-members",
                          label: "All Members",
                        },
                      ]);
                    }
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center mr-3">
                      <span role="img" aria-label="All Members">
                        👥
                      </span>
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-medium text-gray-900 truncate">
                        All Members
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Everyone in the system
                      </div>
                    </div>
                    {recipients.find(
                      (r) => r.type === "Filter" && r.key === "all-members",
                    ) && (
                      <div className="ml-2 text-violet-600">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                These filters let you target special groups not covered by
                Groups, Search, or Birthdays.
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Selected Recipients Display */}
      {recipients.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-700">Selected Recipients</h3>
            <div className="text-sm text-gray-500">
              {recipientCounts.groups} groups, {recipientCounts.individuals}{" "}
              individuals, {recipientCounts.filters} filters
            </div>
          </div>
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[60px]">
            {recipients.map((recipient) => (
              <div key={recipient.id} className="transition-all duration-200">
                <Badge
                  className={`
                    px-3 py-2 flex items-center gap-1 rounded-full text-sm
                    ${
                      recipient.type === "Group"
                        ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                        : recipient.type === "Member"
                          ? "bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }
                  `}
                >
                  {recipient.type === "Group" ? (
                    <GroupsIcon className="h-3 w-3 mr-1" />
                  ) : recipient.type === "Member" ? (
                    <span className="h-4 w-4 rounded-full bg-fuchsia-200 text-fuchsia-700 flex items-center justify-center text-xs font-bold mr-1">
                      {recipient.firstName?.[0]}
                    </span>
                  ) : (
                    <span className="h-4 w-4 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold mr-1">
                      {recipient.label?.[0]}
                    </span>
                  )}
                  {recipient.type === "Group"
                    ? recipient.name
                    : recipient.type === "Member"
                      ? `${recipient.firstName} ${recipient.lastName}`
                      : recipient.label}
                  <button
                    className="ml-1 hover:text-red-500"
                    onClick={() => handleRemoveRecipient(recipient.id)}
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals for additional info */}
      <DemographicsModal
        open={demographicsOpen}
        onClose={() => setDemographicsOpen(false)}
        onSave={(data) => {
          setRecipients([
            ...recipients.filter(
              (r) => !(r.type === "Filter" && r.key === "demographics"),
            ),
            {
              id: "filter-demographics",
              type: "Filter",
              key: "demographics",
              label: `By Demographics: ${data.summary}`,
            },
          ]);
          setDemographicsOpen(false);
        }}
      />
      <EventAttendeesModal
        open={eventAttendeesOpen}
        onClose={() => setEventAttendeesOpen(false)}
        onSave={(data) => {
          setRecipients([
            ...recipients.filter(
              (r) => !(r.type === "Filter" && r.key === "event-attendees"),
            ),
            {
              id: "filter-event-attendees",
              type: "Filter",
              key: "event-attendees",
              label: `Event: ${data.eventName}`,
            },
          ]);
          setEventAttendeesOpen(false);
        }}
      />
      <CustomListModal
        open={customListOpen}
        onClose={() => setCustomListOpen(false)}
        onSave={(data) => {
          setRecipients([
            ...recipients.filter(
              (r) => !(r.type === "Filter" && r.key === "custom"),
            ),
            {
              id: "filter-custom",
              type: "Filter",
              key: "custom",
              label: `Custom List (${data.count} emails)`,
            },
          ]);
          setCustomListOpen(false);
        }}
      />
    </div>
  );
}
