"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  UserGroupIcon,
  CalendarIcon,
  IdentificationIcon,
  HeartIcon,
  EnvelopeIcon,
  PhoneIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import {
  MemberFilters,
  Gender,
  MaritalStatus,
  MembershipStatus,
  MemberStatus,
  FilterOption,
  Member,
} from "../types/member.types";
import { MemberFilterService } from "../services/memberFilterService";

interface FilterPanelProps {
  filters: MemberFilters;
  onFiltersChange: (filters: MemberFilters) => void;
  members?: Member[];
  statistics?: any;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  members = [],
  statistics,
  className = "",
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic"]),
  );

  // Generate filter statistics
  const filterStats = useMemo(() => {
    return MemberFilterService.generateFilterStats(members);
  }, [members]);

  const activeFilterCount = MemberFilterService.getActiveFilterCount(filters);
  const hasActiveFilters = MemberFilterService.hasActiveFilters(filters);

  // Toggle section expansion
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Update filter helper
  const updateFilter = (key: keyof MemberFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFiltersChange(MemberFilterService.clearAllFilters());
  };

  // Filter options with counts (prefer API statistics when available)
  const genderOptions: FilterOption[] = [
    {
      label: "Male",
      value: Gender.MALE,
      count:
        statistics?.membersByGender?.male ??
        undefined ??
        (filterStats.gender.get(Gender.MALE) || 0),
    },
    {
      label: "Female",
      value: Gender.FEMALE,
      count:
        statistics?.membersByGender?.female ??
        undefined ??
        (filterStats.gender.get(Gender.FEMALE) || 0),
    },
    {
      label: "Not Specified",
      value: Gender.NOT_SPECIFIED,
      count:
        statistics?.membersByGender?.notSpecified ??
        undefined ??
        (filterStats.gender.get(Gender.NOT_SPECIFIED) || 0),
    },
  ];

  const maritalStatusOptions: FilterOption[] = [
    {
      label: "Single",
      value: MaritalStatus.SINGLE,
      count: filterStats.maritalStatus.get(MaritalStatus.SINGLE) || 0,
    },
    {
      label: "Married",
      value: MaritalStatus.MARRIED,
      count: filterStats.maritalStatus.get(MaritalStatus.MARRIED) || 0,
    },
    {
      label: "Divorced",
      value: MaritalStatus.DIVORCED,
      count: filterStats.maritalStatus.get(MaritalStatus.DIVORCED) || 0,
    },
    {
      label: "Widowed",
      value: MaritalStatus.WIDOWED,
      count: filterStats.maritalStatus.get(MaritalStatus.WIDOWED) || 0,
    },
    {
      label: "Separated",
      value: MaritalStatus.SEPARATED,
      count: filterStats.maritalStatus.get(MaritalStatus.SEPARATED) || 0,
    },
  ];

  const membershipStatusOptions: FilterOption[] = [
    {
      label: "Visitor",
      value: MembershipStatus.VISITOR,
      count: filterStats.membershipStatus.get(MembershipStatus.VISITOR) || 0,
    },
    {
      label: "Regular Attendee",
      value: MembershipStatus.REGULAR_ATTENDEE,
      count:
        filterStats.membershipStatus.get(MembershipStatus.REGULAR_ATTENDEE) ||
        0,
    },
    {
      label: "Member",
      value: MembershipStatus.MEMBER,
      count: filterStats.membershipStatus.get(MembershipStatus.MEMBER) || 0,
    },
    {
      label: "Active Member",
      value: MembershipStatus.ACTIVE_MEMBER,
      count:
        filterStats.membershipStatus.get(MembershipStatus.ACTIVE_MEMBER) || 0,
    },
    {
      label: "Inactive Member",
      value: MembershipStatus.INACTIVE_MEMBER,
      count:
        filterStats.membershipStatus.get(MembershipStatus.INACTIVE_MEMBER) || 0,
    },
  ];

  const memberStatusOptions: FilterOption[] = [
    {
      label: "Active",
      value: MemberStatus.ACTIVE,
      count:
        statistics?.membersByStatus?.active ??
        undefined ??
        (filterStats.memberStatus.get(MemberStatus.ACTIVE) || 0),
    },
    {
      label: "Inactive",
      value: MemberStatus.INACTIVE,
      count:
        statistics?.membersByStatus?.inactive ??
        undefined ??
        (filterStats.memberStatus.get(MemberStatus.INACTIVE) || 0),
    },
    {
      label: "Suspended",
      value: MemberStatus.SUSPENDED,
      count: filterStats.memberStatus.get(MemberStatus.SUSPENDED) || 0,
    },
    {
      label: "Transferred",
      value: MemberStatus.TRANSFERRED,
      count:
        statistics?.membersByStatus?.transferred ??
        undefined ??
        (filterStats.memberStatus.get(MemberStatus.TRANSFERRED) || 0),
    },
  ];

  // Filter section component
  const FilterSection = ({
    title,
    children,
    sectionKey,
    defaultExpanded = false,
  }: {
    title: string;
    children: React.ReactNode;
    sectionKey: string;
    defaultExpanded?: boolean;
  }) => (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-150"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <motion.div
          animate={{ rotate: expandedSections.has(sectionKey) ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expandedSections.has(sectionKey) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {activeFilterCount} active
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* API-Powered Filters */}
      <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
        <p className="text-xs text-blue-800 font-medium">API-Powered Filters</p>
      </div>

      {/* Member ID Filter */}
      <FilterSection title="Member ID Status" sectionKey="memberId">
        <div className="space-y-2">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.hasMemberId === true}
                onChange={(e) => {
                  updateFilter(
                    "hasMemberId",
                    e.target.checked ? true : undefined,
                  );
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Has Member ID</span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {members.filter((m) => m.memberId).length}
            </span>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.hasMemberId === false}
                onChange={(e) => {
                  updateFilter(
                    "hasMemberId",
                    e.target.checked ? false : undefined,
                  );
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">No Member ID</span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {members.filter((m) => !m.memberId).length}
            </span>
          </label>
        </div>
      </FilterSection>

      {/* Client-Side Filters */}
      <div className="bg-green-50 px-4 py-2 border-b border-gray-200">
        <p className="text-xs text-green-800 font-medium">
          Client-Side Filters
        </p>
      </div>

      {/* Gender Filter */}
      <FilterSection title="Gender" sectionKey="gender">
        <div className="space-y-2">
          {genderOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(filters.gender || []).includes(
                    option.value as Gender,
                  )}
                  onChange={(e) => {
                    const currentGenders = filters.gender || [];
                    if (e.target.checked) {
                      updateFilter("gender", [
                        ...currentGenders,
                        option.value as Gender,
                      ]);
                    } else {
                      updateFilter(
                        "gender",
                        currentGenders.filter((g) => g !== option.value),
                      );
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {option.count}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Marital Status Filter */}
      <FilterSection title="Marital Status" sectionKey="maritalStatus">
        <div className="space-y-2">
          {maritalStatusOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(filters.maritalStatus || []).includes(
                    option.value as MaritalStatus,
                  )}
                  onChange={(e) => {
                    const currentStatuses = filters.maritalStatus || [];
                    if (e.target.checked) {
                      updateFilter("maritalStatus", [
                        ...currentStatuses,
                        option.value as MaritalStatus,
                      ]);
                    } else {
                      updateFilter(
                        "maritalStatus",
                        currentStatuses.filter((s) => s !== option.value),
                      );
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {option.count}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Membership Status Filter */}
      <FilterSection title="Membership Status" sectionKey="membershipStatus">
        <div className="space-y-2">
          {membershipStatusOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(filters.membershipStatus || []).includes(
                    option.value as MembershipStatus,
                  )}
                  onChange={(e) => {
                    const currentStatuses = filters.membershipStatus || [];
                    if (e.target.checked) {
                      updateFilter("membershipStatus", [
                        ...currentStatuses,
                        option.value as MembershipStatus,
                      ]);
                    } else {
                      updateFilter(
                        "membershipStatus",
                        currentStatuses.filter((s) => s !== option.value),
                      );
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {option.count}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Member Status Filter */}
      <FilterSection title="Member Status" sectionKey="memberStatus">
        <div className="space-y-2">
          {memberStatusOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(filters.memberStatus || []).includes(
                    option.value as MemberStatus,
                  )}
                  onChange={(e) => {
                    const currentStatuses = filters.memberStatus || [];
                    if (e.target.checked) {
                      updateFilter("memberStatus", [
                        ...currentStatuses,
                        option.value as MemberStatus,
                      ]);
                    } else {
                      updateFilter(
                        "memberStatus",
                        currentStatuses.filter((s) => s !== option.value),
                      );
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {option.count}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Additional Boolean Filters */}
      <FilterSection title="Additional Options" sectionKey="additional">
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.hasProfileImage === true}
                onChange={(e) =>
                  updateFilter(
                    "hasProfileImage",
                    e.target.checked ? true : undefined,
                  )
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Has Profile Image</span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {filterStats.hasProfileImage.true}
            </span>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.hasEmail === true}
                onChange={(e) =>
                  updateFilter("hasEmail", e.target.checked ? true : undefined)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Has Email</span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {filterStats.hasEmail.true}
            </span>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.hasPhone === true}
                onChange={(e) =>
                  updateFilter("hasPhone", e.target.checked ? true : undefined)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Has Phone</span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {filterStats.hasPhone.true}
            </span>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.isRegularAttendee === true}
                onChange={(e) =>
                  updateFilter(
                    "isRegularAttendee",
                    e.target.checked ? true : undefined,
                  )
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Regular Attendee</span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {filterStats.isRegularAttendee.true}
            </span>
          </label>
        </div>
      </FilterSection>

      {/* Age Range Filter */}
      <FilterSection title="Age Range" sectionKey="ageRange">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">
                Min Age
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={filters.ageRange?.min || ""}
                onChange={(e) =>
                  updateFilter("ageRange", {
                    ...filters.ageRange,
                    min: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">
                Max Age
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={filters.ageRange?.max || ""}
                onChange={(e) =>
                  updateFilter("ageRange", {
                    ...filters.ageRange,
                    max: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="120"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Date Range Filter */}
      <FilterSection title="Joined Date Range" sectionKey="dateRange">
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Joined After
            </label>
            <input
              type="date"
              value={filters.dateRange?.joinedAfter || ""}
              onChange={(e) =>
                updateFilter("dateRange", {
                  ...filters.dateRange,
                  joinedAfter: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Joined Before
            </label>
            <input
              type="date"
              value={filters.dateRange?.joinedBefore || ""}
              onChange={(e) =>
                updateFilter("dateRange", {
                  ...filters.dateRange,
                  joinedBefore: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </FilterSection>
    </motion.div>
  );
};

export default FilterPanel;
