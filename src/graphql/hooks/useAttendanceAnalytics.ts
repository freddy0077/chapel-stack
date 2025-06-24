import { useQuery } from '@apollo/client';
import { GET_ATTENDANCE_ANALYTICS } from '../queries/attendanceAnalyticsQueries';

export interface AttendanceAnalyticsInput {
  branchId: string;
  startDate: string;
  endDate: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  statsTypes: string[];
}

// Alias for backend compatibility
export type AttendanceStatsInput = AttendanceAnalyticsInput;

export function useAttendanceAnalytics(input: AttendanceStatsInput, skip = false) {
  const { data, loading, error, refetch } = useQuery(
    GET_ATTENDANCE_ANALYTICS,
    {
      variables: { input },
      skip,
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    analytics: data?.attendanceStats,
    loading,
    error,
    refetch,
  };
}
