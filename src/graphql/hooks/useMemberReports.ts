import { useLazyQuery, useQuery } from "@apollo/client";
import {
  GENERATE_MEMBER_REPORT,
  GET_MEMBER_STATS,
} from "../queries/memberReports";

// TypeScript interfaces
export enum MemberReportType {
  SUMMARY = "SUMMARY",
  DETAILED = "DETAILED",
  DEMOGRAPHICS = "DEMOGRAPHICS",
  GROWTH_TRENDS = "GROWTH_TRENDS",
  ENGAGEMENT = "ENGAGEMENT",
  RETENTION = "RETENTION",
  GEOGRAPHIC = "GEOGRAPHIC",
}

export enum MemberReportGroupBy {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  QUARTER = "QUARTER",
  YEAR = "YEAR",
}

export enum MemberReportFormat {
  JSON = "JSON",
  CSV = "CSV",
  PDF = "PDF",
  EXCEL = "EXCEL",
}

export interface MemberReportInput {
  type: MemberReportType;
  startDate: string;
  endDate: string;
  groupBy?: MemberReportGroupBy;
  format?: MemberReportFormat;
  organisationId?: string;
  branchId?: string;
  includeInactive?: boolean;
  includeVisitors?: boolean;
  includeDemographics?: boolean;
  includeEngagement?: boolean;
  includePersonalInfo?: boolean;
}

export interface MemberReportSummary {
  title: string;
  startDate: string;
  endDate: string;
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembers: number;
  visitors: number;
  firstTimeVisitors: number;
  returningVisitors: number;
  growthRate: number;
  retentionRate: number;
  conversionRate: number;
  averageAge: number;
  maleMembers: number;
  femaleMembers: number;
}

export interface MemberReportData {
  period: string;
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembers: number;
  visitors: number;
  growthRate?: number;
  retentionRate?: number;
  conversionRate?: number;
}

export interface MemberDemographic {
  category: string;
  value: string;
  count: number;
  percentage: number;
}

export interface MemberEngagement {
  memberId: string;
  name: string;
  email?: string;
  attendanceCount: number;
  attendanceRate: number;
  lastAttendance?: string;
  eventParticipation: number;
  engagementScore: number;
}

export interface MemberGeographic {
  location: string;
  memberCount: number;
  percentage: number;
  averageAge?: number;
  primaryGender?: string;
}

export interface MemberReportChart {
  type: string;
  title: string;
  labels: string[];
  data: number[];
  colors: string[];
}

export interface MemberReport {
  id: string;
  summary: MemberReportSummary;
  data: MemberReportData[];
  demographics?: MemberDemographic[];
  engagement?: MemberEngagement[];
  geographic?: MemberGeographic[];
  charts?: MemberReportChart[];
  generatedAt: string;
  downloadUrl?: string;
}

export interface GenderDistribution {
  maleCount: number;
  femaleCount: number;
  otherCount: number;
  malePercentage: number;
  femalePercentage: number;
  otherPercentage: number;
}

export interface AgeGroup {
  range: string;
  count: number;
  percentage: number;
}

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembersInPeriod: number;
  visitorsInPeriod: number;
  growthRate: number;
  retentionRate: number;
  conversionRate: number;
  averageAge: number;
  genderDistribution: GenderDistribution;
  ageGroups: AgeGroup[];
}

// Hooks
export const useGenerateMemberReport = () => {
  const [generateReport, { data, loading, error }] = useLazyQuery<
    { generateMemberReport: MemberReport },
    { input: MemberReportInput }
  >(GENERATE_MEMBER_REPORT, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const executeReport = async (
    input: MemberReportInput,
  ): Promise<MemberReport | null> => {
    try {
      const result = await generateReport({ variables: { input } });
      return result.data?.generateMemberReport || null;
    } catch (error) {
      console.error("Error generating member report:", error);
      return null;
    }
  };

  return {
    generateReport: executeReport,
    data: data?.generateMemberReport,
    loading,
    error,
  };
};

export const useMemberStats = (organisationId?: string, branchId?: string) => {
  const { data, loading, error, refetch } = useQuery<
    { memberStatistics: MemberStats },
    { organisationId?: string; branchId?: string }
  >(GET_MEMBER_STATS, {
    variables: { organisationId, branchId },
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    skip: !organisationId && !branchId,
  });

  return {
    memberStats: data?.memberStatistics,
    loading,
    error,
    refetch,
  };
};

// Helper functions
export const getDefaultMemberReportConfig = (): Partial<MemberReportInput> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3); // Default to last 3 months

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    groupBy: MemberReportGroupBy.MONTH,
    includeInactive: true,
    includeVisitors: true,
    includeDemographics: true,
    includeEngagement: true,
    includePersonalInfo: false,
  };
};

export const getMemberReportTypeLabel = (type: MemberReportType): string => {
  const labels = {
    [MemberReportType.SUMMARY]: "Summary Report",
    [MemberReportType.DETAILED]: "Detailed Report",
    [MemberReportType.DEMOGRAPHICS]: "Demographics Report",
    [MemberReportType.GROWTH_TRENDS]: "Growth Trends Report",
    [MemberReportType.ENGAGEMENT]: "Engagement Report",
    [MemberReportType.RETENTION]: "Retention Report",
    [MemberReportType.GEOGRAPHIC]: "Geographic Report",
  };
  return labels[type] || type;
};

export const getMemberReportGroupByLabel = (
  groupBy: MemberReportGroupBy,
): string => {
  const labels = {
    [MemberReportGroupBy.DAY]: "Daily",
    [MemberReportGroupBy.WEEK]: "Weekly",
    [MemberReportGroupBy.MONTH]: "Monthly",
    [MemberReportGroupBy.QUARTER]: "Quarterly",
    [MemberReportGroupBy.YEAR]: "Yearly",
  };
  return labels[groupBy] || groupBy;
};

export const getMemberReportFormatLabel = (
  format: MemberReportFormat,
): string => {
  const labels = {
    [MemberReportFormat.JSON]: "JSON",
    [MemberReportFormat.CSV]: "CSV",
    [MemberReportFormat.PDF]: "PDF",
    [MemberReportFormat.EXCEL]: "Excel",
  };
  return labels[format] || format;
};
