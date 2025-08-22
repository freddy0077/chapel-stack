import { useQuery } from '@apollo/client';
import { GET_MARRIAGE_ANALYTICS, GET_MEMBER_MARRIAGE_HISTORY } from '../queries/marriageAnalyticsQueries';

// Types for marriage analytics
export interface MonthlyMarriageData {
  month: string;
  count: number;
  memberMarriages: number;
  mixedMarriages: number;
  externalMarriages: number;
}

export interface OfficiantStats {
  officiantId: string;
  officiantName: string;
  marriageCount: number;
  memberOfficiant: boolean;
}

export interface MarriageAnalytics {
  totalMarriages: number;
  memberMarriages: number;
  mixedMarriages: number;
  externalMarriages: number;
  thisYearMarriages: number;
  lastYearMarriages: number;
  growthPercentage: number;
  averageAge: number;
  upcomingAnniversaries: number;
  monthlyTrends: MonthlyMarriageData[];
  topOfficiants: OfficiantStats[];
}

export interface MemberMarriageHistory {
  memberId: string;
  memberName: string;
  spouseName: string;
  spouseMemberId?: string;
  marriageDate: string;
  marriageLocation?: string;
  officiantName?: string;
  yearsMarried: number;
  nextAnniversary: string;
  certificateUrl?: string;
}

export interface MarriageAnalyticsInput {
  branchId: string;
  startDate?: string;
  endDate?: string;
  organisationId?: string;
}

export interface MemberMarriageHistoryInput {
  memberId: string;
  branchId?: string;
}

// Hook for marriage analytics
export const useMarriageAnalytics = (input: MarriageAnalyticsInput) => {
  return useQuery<{ marriageAnalytics: MarriageAnalytics }>(GET_MARRIAGE_ANALYTICS, {
    variables: { input },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  });
};

// Hook for member marriage history
export const useMemberMarriageHistory = (input: MemberMarriageHistoryInput) => {
  return useQuery<{ memberMarriageHistory: MemberMarriageHistory | null }>(GET_MEMBER_MARRIAGE_HISTORY, {
    variables: { input },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
    skip: !input.memberId, // Skip query if no member ID provided
  });
};
