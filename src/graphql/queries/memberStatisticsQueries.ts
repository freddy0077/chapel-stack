import { gql } from '@apollo/client';

// Enhanced member statistics query with full backend capabilities
export const GET_MEMBER_STATISTICS_ENHANCED = gql`
  query MemberStatisticsEnhanced($branchId: String, $organisationId: String) {
    memberStatistics(branchId: $branchId, organisationId: $organisationId) {
      totalMembers
      activeMembers
      inactiveMembers
      newMembersInPeriod
      visitorsInPeriod
      growthRate
      retentionRate
      conversionRate
      averageAge
      genderDistribution {
        maleCount
        femaleCount
        otherCount
        malePercentage
        femalePercentage
        otherPercentage
      }
      ageGroups {
        range
        count
        percentage
      }
      membersByStatus {
        status
        count
        percentage
      }
      membersByMembershipStatus {
        status
        count
        percentage
      }
      lastMonth {
        totalMembers
        activeMembers
        inactiveMembers
        newMembersInPeriod
        visitorsInPeriod
      }
    }
  }
`;

// Member dashboard query for individual member insights
export const GET_MEMBER_DASHBOARD = gql`
  query MemberDashboard($memberId: String!) {
    memberDashboard(memberId: $memberId) {
      stats {
        groups
        attendance
        giving
      }
      upcomingEvents {
        id
        name
        date
        location
      }
      groups {
        id
        name
        role
      }
      milestones {
        baptismDate
        confirmationDate
      }
    }
  }
`;

// Types for the enhanced statistics
export interface MemberStatistics {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembersInPeriod: number;
  visitorsInPeriod: number;
  growthRate: number;
  retentionRate: number;
  conversionRate: number;
  averageAge: number;
  genderDistribution: {
    maleCount: number;
    femaleCount: number;
    otherCount: number;
    malePercentage: number;
    femalePercentage: number;
    otherPercentage: number;
  };
  ageGroups: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  membersByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  membersByMembershipStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  lastMonth?: {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    newMembersInPeriod: number;
    visitorsInPeriod: number;
  };
}

export interface MemberDashboard {
  stats: {
    groups: number;
    attendance: number;
    giving: string;
  };
  upcomingEvents: Array<{
    id: string;
    name: string;
    date: Date;
    location: string;
  }>;
  groups: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  milestones: {
    baptismDate?: Date;
    confirmationDate?: Date;
  };
}
