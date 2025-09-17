import { useLazyQuery } from "@apollo/client";
import {
  GENERATE_ATTENDANCE_REPORT,
  GET_ATTENDANCE_STATS,
} from "../queries/attendanceReportQueries";

// Types for attendance reports
export interface AttendanceReportInput {
  reportType: AttendanceReportType;
  startDate: string;
  endDate: string;
  branchId?: string;
  organisationId?: string;
  sessionIds?: string[];
  eventIds?: string[];
  memberIds?: string[];
  groupBy?: AttendanceReportGroupBy;
  format?: AttendanceReportFormat;
  title?: string;
  includeVisitors?: boolean;
  includeMemberDetails?: boolean;
  includeSessionDetails?: boolean;
  includeEventDetails?: boolean;
  includeStatistics?: boolean;
  includeCharts?: boolean;
}

export enum AttendanceReportType {
  SUMMARY = "SUMMARY",
  DETAILED = "DETAILED",
  COMPARATIVE = "COMPARATIVE",
  TRENDS = "TRENDS",
  MEMBER_ANALYSIS = "MEMBER_ANALYSIS",
  SESSION_ANALYSIS = "SESSION_ANALYSIS",
  EVENT_ANALYSIS = "EVENT_ANALYSIS",
}

export enum AttendanceReportFormat {
  JSON = "JSON",
  CSV = "CSV",
  PDF = "PDF",
  EXCEL = "EXCEL",
}

export enum AttendanceReportGroupBy {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  QUARTER = "QUARTER",
  YEAR = "YEAR",
  SESSION_TYPE = "SESSION_TYPE",
  EVENT_TYPE = "EVENT_TYPE",
  BRANCH = "BRANCH",
  AGE_GROUP = "AGE_GROUP",
  GENDER = "GENDER",
}

export interface AttendanceReportData {
  period: string;
  totalAttendance: number;
  uniqueMembers: number;
  visitors: number;
  firstTimeVisitors: number;
  averageAttendance: number;
  growthRate?: number;
  retentionRate?: number;
}

export interface AttendanceReportMember {
  id: string;
  memberId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  title?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  occupation?: string;
  employerName?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  nationality?: string;
  placeOfBirth?: string;
  nlbNumber?: string;
  
  // Family Information
  fatherName?: string;
  motherName?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  
  // Church Information
  membershipDate?: string;
  baptismDate?: string;
  confirmationDate?: string;
  status: string;
  
  // Branch Information
  branch?: {
    id: string;
    name: string;
  };
  branchId: string;
  
  // Family Relations
  spouse?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  parent?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  children?: Array<{
    id: string;
    firstName: string;
    lastName: string;
  }>;
  
  // Attendance Data
  attendanceCount: number;
  attendanceRate: number;
  lastAttendance?: string;
  attendanceDates: string[];
  
  // Additional Information
  profileImageUrl?: string;
  notes?: string;
  rfidCardId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceReportSession {
  id: string;
  name: string;
  date: string;
  type?: string;
  totalAttendance: number;
  memberAttendance: number;
  visitorAttendance: number;
  attendanceRate: number;
}

export interface AttendanceReportEvent {
  id: string;
  title: string;
  startDate: string;
  category?: string;
  totalAttendance: number;
  memberAttendance: number;
  visitorAttendance: number;
  attendanceRate: number;
}

export interface AttendanceReportSummary {
  startDate: string;
  endDate: string;
  totalSessions: number;
  totalEvents: number;
  totalAttendance: number;
  uniqueMembers: number;
  totalVisitors: number;
  firstTimeVisitors: number;
  averageSessionAttendance: number;
  averageEventAttendance: number;
  memberRetentionRate: number;
  visitorConversionRate: number;
  overallGrowthRate: number;
}

export interface AttendanceReportChart {
  type: string;
  title: string;
  labels: string[];
  data: number[];
  colors?: string[];
}

export interface AttendanceReport {
  id: string;
  reportType: AttendanceReportType;
  title: string;
  generatedAt: string;
  generatedBy: string;
  format: AttendanceReportFormat;
  summary: AttendanceReportSummary;
  data: AttendanceReportData[];
  members?: AttendanceReportMember[];
  sessions?: AttendanceReportSession[];
  events?: AttendanceReportEvent[];
  charts?: AttendanceReportChart[];
  downloadUrl?: string;
  branchId?: string;
  organisationId?: string;
}

export interface AttendanceStatsInput {
  branchId?: string;
  organisationId?: string;
  sessionTypeId?: string;
  startDate: string;
  endDate: string;
  period?: string;
  statsTypes?: string[];
}

/**
 * Hook for generating attendance reports
 */
export const useGenerateAttendanceReport = () => {
  const [generateReport, { loading, error, data }] = useLazyQuery(
    GENERATE_ATTENDANCE_REPORT,
    {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
  );

  const handleGenerateReport = async (
    input: AttendanceReportInput,
    generatedBy?: string,
  ) => {
    try {
      const result = await generateReport({
        variables: {
          input,
          generatedBy: generatedBy || "user",
        },
      });
      return result.data?.generateAttendanceReport;
    } catch (error) {
      console.error("Error generating attendance report:", error);
      throw error;
    }
  };

  return {
    generateReport: handleGenerateReport,
    loading,
    error,
    report: data?.generateAttendanceReport,
  };
};

/**
 * Hook for getting attendance statistics
 */
export const useAttendanceStats = () => {
  const [getStats, { loading, error, data }] = useLazyQuery(
    GET_ATTENDANCE_STATS,
    {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
  );

  const handleGetStats = async (input: AttendanceStatsInput) => {
    try {
      const result = await getStats({
        variables: { input },
      });
      return result.data?.attendanceStats;
    } catch (error) {
      console.error("Error getting attendance stats:", error);
      throw error;
    }
  };

  return {
    getStats: handleGetStats,
    loading,
    error,
    stats: data?.attendanceStats,
  };
};

/**
 * Utility function to format report data for charts
 */
export const formatReportDataForChart = (
  data: AttendanceReportData[],
  metric: keyof AttendanceReportData,
): { labels: string[]; values: number[] } => {
  return {
    labels: data.map((item) => item.period),
    values: data.map((item) => Number(item[metric]) || 0),
  };
};

/**
 * Utility function to calculate percentage change
 */
export const calculatePercentageChange = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Utility function to format numbers for display
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Utility function to format percentages
 */
export const formatPercentage = (num: number, decimals: number = 1): string => {
  return `${formatNumber(num, decimals)}%`;
};

/**
 * Utility function to get report type display name
 */
export const getReportTypeDisplayName = (
  reportType: AttendanceReportType,
): string => {
  const displayNames = {
    [AttendanceReportType.SUMMARY]: "Summary Report",
    [AttendanceReportType.DETAILED]: "Detailed Report",
    [AttendanceReportType.COMPARATIVE]: "Comparative Report",
    [AttendanceReportType.TRENDS]: "Trends Report",
    [AttendanceReportType.MEMBER_ANALYSIS]: "Member Analysis",
    [AttendanceReportType.SESSION_ANALYSIS]: "Session Analysis",
    [AttendanceReportType.EVENT_ANALYSIS]: "Event Analysis",
  };
  return displayNames[reportType] || reportType;
};

/**
 * Utility function to get default report configuration
 */
export const getDefaultReportConfig = (
  reportType: AttendanceReportType,
): Partial<AttendanceReportInput> => {
  const baseConfig = {
    groupBy: AttendanceReportGroupBy.WEEK,
    includeStatistics: true,
    includeCharts: true,
  };

  switch (reportType) {
    case AttendanceReportType.DETAILED:
      return {
        ...baseConfig,
        includeMemberDetails: true,
        includeSessionDetails: true,
        includeEventDetails: true,
        includeVisitors: true,
        includeCharts: true,
        includeStatistics: true,
      };
    case AttendanceReportType.MEMBER_ANALYSIS:
      return {
        ...baseConfig,
        includeMemberDetails: true,
        groupBy: AttendanceReportGroupBy.MONTH,
      };
    case AttendanceReportType.SESSION_ANALYSIS:
      return {
        ...baseConfig,
        includeSessionDetails: true,
        groupBy: AttendanceReportGroupBy.WEEK,
      };
    case AttendanceReportType.EVENT_ANALYSIS:
      return {
        ...baseConfig,
        includeEventDetails: true,
        groupBy: AttendanceReportGroupBy.MONTH,
      };
    default:
      return baseConfig;
  }
};
