import { useQuery } from "@apollo/client";
import { GET_BRANCHES_WITH_STATISTICS } from "../queries/memberQueries";

export interface BranchStatistics {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembersInPeriod: number;
  lastMonth?: {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    newMembersInPeriod: number;
  };
  percentageChanges?: {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    newMembersInPeriod: number;
  };
}

export interface Branch {
  id: string;
  name: string;
  statistics: BranchStatistics;
}

export interface PaginatedBranches {
  items: Branch[];
  totalCount: number;
}

export interface BranchesData {
  branches: PaginatedBranches;
}

export const useBranchStatistics = (branchId?: string) => {
  const { data, loading, error } = useQuery<BranchesData>(
    GET_BRANCHES_WITH_STATISTICS,
    {
      variables: branchId ? { branchId } : {},
    },
  );

  // If a specific branchId is provided, filter for that branch
  const selectedBranch =
    branchId && data?.branches?.items
      ? data.branches.items.find((branch) => branch.id === branchId)
      : undefined;

  // If no specific branch is requested, return all branches
  const branches = data?.branches?.items || [];

  // Calculate totals across all branches
  const totalStatistics = branches.reduce(
    (acc, branch) => {
      return {
        totalMembers: acc.totalMembers + (branch.statistics?.totalMembers || 0),
        activeMembers:
          acc.activeMembers + (branch.statistics?.activeMembers || 0),
        inactiveMembers:
          acc.inactiveMembers + (branch.statistics?.inactiveMembers || 0),
        newMembersInPeriod:
          acc.newMembersInPeriod + (branch.statistics?.newMembersInPeriod || 0),
        lastMonth: {
          totalMembers:
            acc.lastMonth.totalMembers +
            (branch.statistics?.lastMonth?.totalMembers || 0),
          activeMembers:
            acc.lastMonth.activeMembers +
            (branch.statistics?.lastMonth?.activeMembers || 0),
          inactiveMembers:
            acc.lastMonth.inactiveMembers +
            (branch.statistics?.lastMonth?.inactiveMembers || 0),
          newMembersInPeriod:
            acc.lastMonth.newMembersInPeriod +
            (branch.statistics?.lastMonth?.newMembersInPeriod || 0),
        },
      };
    },
    {
      totalMembers: 0,
      activeMembers: 0,
      inactiveMembers: 0,
      newMembersInPeriod: 0,
      lastMonth: {
        totalMembers: 0,
        activeMembers: 0,
        inactiveMembers: 0,
        newMembersInPeriod: 0,
      },
    },
  );

  // Calculate percentage changes for each stat
  function calculatePercentageChange(current: number, previous: number) {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  }

  const statisticsWithChanges = {
    ...totalStatistics,
    percentageChanges: {
      totalMembers: calculatePercentageChange(
        totalStatistics.totalMembers,
        totalStatistics.lastMonth.totalMembers,
      ),
      activeMembers: calculatePercentageChange(
        totalStatistics.activeMembers,
        totalStatistics.lastMonth.activeMembers,
      ),
      inactiveMembers: calculatePercentageChange(
        totalStatistics.inactiveMembers,
        totalStatistics.lastMonth.inactiveMembers,
      ),
      newMembersInPeriod: calculatePercentageChange(
        totalStatistics.newMembersInPeriod,
        totalStatistics.lastMonth.newMembersInPeriod,
      ),
    },
  };

  // Get total count
  const totalCount = data?.branches?.totalCount || 0;

  return {
    branches,
    selectedBranch,
    totalStatistics: statisticsWithChanges, // Return the enhanced statistics with percentage changes
    loading,
    error,
    totalCount,
  };
};
