import { useState, useCallback, useMemo } from "react";
import {
  MemberFilters,
  Gender,
  MaritalStatus,
  MembershipStatus,
} from "../types/member.types";

interface UseMemberFiltersReturn {
  filters: MemberFilters;
  updateFilter: (newFilters: Partial<MemberFilters>) => void;
  clearFilters: () => void;
  clearFilter: (filterKey: keyof MemberFilters) => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  resetToDefaults: () => void;
  getFilterSummary: () => string[];
}

const defaultFilters: MemberFilters = {
  branchId: undefined,
  membershipStatus: undefined,
  gender: undefined,
  maritalStatus: undefined,
  ageRange: undefined,
  joinDateRange: undefined,
  lastActivityRange: undefined,
  hasRfidCard: undefined,
  isRegularAttendee: undefined,
  headOfHousehold: undefined,
  hasFamily: undefined,
  occupation: undefined,
  city: undefined,
  state: undefined,
  country: undefined,
};

export const useMemberFilters = (
  initialFilters: MemberFilters = {},
): UseMemberFiltersReturn => {
  const [filters, setFilters] = useState<MemberFilters>({
    ...defaultFilters,
    ...initialFilters,
  });

  // Update specific filters
  const updateFilter = useCallback((newFilters: Partial<MemberFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Clear specific filter
  const clearFilter = useCallback((filterKey: keyof MemberFilters) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: defaultFilters[filterKey],
    }));
  }, []);

  // Reset to default values
  const resetToDefaults = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (value === undefined || value === null) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    });
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      if (value === undefined || value === null) return count;
      if (Array.isArray(value) && value.length === 0) return count;
      if (typeof value === "string" && value.trim() === "") return count;
      return count + 1;
    }, 0);
  }, [filters]);

  // Get filter summary for display
  const getFilterSummary = useCallback((): string[] => {
    const summary: string[] = [];

    if (filters.membershipStatus && filters.membershipStatus.length > 0) {
      summary.push(`Status: ${filters.membershipStatus.join(", ")}`);
    }

    if (filters.gender && filters.gender.length > 0) {
      summary.push(`Gender: ${filters.gender.join(", ")}`);
    }

    if (filters.maritalStatus && filters.maritalStatus.length > 0) {
      summary.push(`Marital: ${filters.maritalStatus.join(", ")}`);
    }

    if (filters.ageRange) {
      summary.push(`Age: ${filters.ageRange.min}-${filters.ageRange.max}`);
    }

    if (filters.joinDateRange) {
      const start = filters.joinDateRange.start.toLocaleDateString();
      const end = filters.joinDateRange.end.toLocaleDateString();
      summary.push(`Joined: ${start} - ${end}`);
    }

    if (filters.lastActivityRange) {
      const start = filters.lastActivityRange.start.toLocaleDateString();
      const end = filters.lastActivityRange.end.toLocaleDateString();
      summary.push(`Active: ${start} - ${end}`);
    }

    if (filters.hasRfidCard !== undefined) {
      summary.push(`RFID: ${filters.hasRfidCard ? "Yes" : "No"}`);
    }

    if (filters.isRegularAttendee !== undefined) {
      summary.push(`Regular: ${filters.isRegularAttendee ? "Yes" : "No"}`);
    }

    if (filters.headOfHousehold !== undefined) {
      summary.push(
        `Head of Household: ${filters.headOfHousehold ? "Yes" : "No"}`,
      );
    }

    if (filters.hasFamily !== undefined) {
      summary.push(`Has Family: ${filters.hasFamily ? "Yes" : "No"}`);
    }

    if (filters.occupation && filters.occupation.trim()) {
      summary.push(`Occupation: ${filters.occupation}`);
    }

    if (filters.city && filters.city.trim()) {
      summary.push(`City: ${filters.city}`);
    }

    if (filters.state && filters.state.trim()) {
      summary.push(`State: ${filters.state}`);
    }

    if (filters.country && filters.country.trim()) {
      summary.push(`Country: ${filters.country}`);
    }

    return summary;
  }, [filters]);

  return {
    filters,
    updateFilter,
    clearFilters,
    clearFilter,
    hasActiveFilters,
    activeFilterCount,
    resetToDefaults,
    getFilterSummary,
  };
};

// Predefined filter presets
export const filterPresets = {
  activeMembers: {
    membershipStatus: [MembershipStatus.ACTIVE_MEMBER, MembershipStatus.MEMBER],
  },
  newMembers: {
    joinDateRange: {
      start: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1),
      end: new Date(),
    },
  },
  visitors: {
    membershipStatus: [MembershipStatus.VISITOR],
  },
  inactiveMembers: {
    membershipStatus: [MembershipStatus.INACTIVE, MembershipStatus.DEACTIVATED],
  },
  withRfid: {
    hasRfidCard: true,
  },
  withoutRfid: {
    hasRfidCard: false,
  },
  regularAttendees: {
    isRegularAttendee: true,
  },
  headsOfHousehold: {
    headOfHousehold: true,
  },
  marriedMembers: {
    maritalStatus: [MaritalStatus.MARRIED],
  },
  singleMembers: {
    maritalStatus: [MaritalStatus.SINGLE],
  },
  youngAdults: {
    ageRange: { min: 18, max: 35 },
  },
  seniors: {
    ageRange: { min: 65, max: 120 },
  },
};

// Hook for managing filter presets
export const useFilterPresets = () => {
  const applyPreset = useCallback(
    (presetName: keyof typeof filterPresets): MemberFilters => {
      return filterPresets[presetName];
    },
    [],
  );

  const getPresetNames = useCallback((): string[] => {
    return Object.keys(filterPresets);
  }, []);

  const getPresetLabel = useCallback(
    (presetName: keyof typeof filterPresets): string => {
      const labels: Record<keyof typeof filterPresets, string> = {
        activeMembers: "Active Members",
        newMembers: "New Members (3 months)",
        visitors: "Visitors",
        inactiveMembers: "Inactive Members",
        withRfid: "With RFID Card",
        withoutRfid: "Without RFID Card",
        regularAttendees: "Regular Attendees",
        headsOfHousehold: "Heads of Household",
        marriedMembers: "Married Members",
        singleMembers: "Single Members",
        youngAdults: "Young Adults (18-35)",
        seniors: "Seniors (65+)",
      };
      return labels[presetName];
    },
    [],
  );

  return {
    applyPreset,
    getPresetNames,
    getPresetLabel,
    presets: filterPresets,
  };
};
