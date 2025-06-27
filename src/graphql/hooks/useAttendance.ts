import { useQuery, useMutation } from "@apollo/client";
import { 
  GET_ATTENDANCE_RECORDS, 
  GET_ATTENDANCE_RECORDS_FOR_SESSION,
  GET_FILTERED_ATTENDANCE_SESSIONS 
} from "../queries/attendanceQueries";
import { PROCESS_CARD_SCAN } from "../mutations/attendanceMutations";


// Types for Attendance
export interface AttendanceRecord {
  id: string;
  checkInTime: string;
  checkOutTime?: string;
  checkInMethod?: string;
  notes?: string;
  sessionId?: string;
  memberId?: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  recordedById?: string;
  branchId?: string;
  createdAt: string;
  updatedAt: string;
  session?: AttendanceSession;
  member?: AttendanceMember;
  recordedBy?: AttendanceUser;
  branch?: AttendanceBranch;
}

export interface AttendanceSession {
  id: string;
  name?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  type?: string;
  status?: string;
  location?: string;
}

export interface AttendanceMember {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface AttendanceUser {
  id: string;
  firstName?: string;
  lastName?: string;
}

export interface AttendanceBranch {
  id: string;
  name?: string;
}

export interface AttendanceFilterInput {
  // Add a member to fix @typescript-eslint/no-empty-object-type
  dummy?: string;
}

export interface UseAttendanceRecordsOptions {
  sessionId: string;
  filter?: AttendanceFilterInput;
}

export const useAttendanceRecords = (options: UseAttendanceRecordsOptions) => {
  const { sessionId, filter } = options;
  const { data, loading, error, refetch } = useQuery<{ attendanceRecords: AttendanceRecord[] }>(GET_ATTENDANCE_RECORDS, {
    variables: { sessionId, filter },
    fetchPolicy: "cache-and-network"
  });

  return {
    attendanceRecords: data?.attendanceRecords ?? [],
    loading,
    error,
    refetch
  };
};

// Hook to fetch attendance records for a session with expanded fields
export const useAttendanceRecordsForSession = (options: UseAttendanceRecordsOptions) => {
  const { sessionId, filter } = options;
  const { data, loading, error, refetch } = useQuery<{ attendanceRecords: AttendanceRecord[] }>(GET_ATTENDANCE_RECORDS_FOR_SESSION, {
    variables: { sessionId, filter },
    fetchPolicy: "cache-and-network"
  });

  return {
    attendanceRecords: data?.attendanceRecords ?? [],
    loading,
    error,
    refetch
  };
};

// Types for processCardScan input and output
export interface CardScanInput {
  sessionId: string;
  cardId: string;
  scanMethod?: string;
  scanTime?: string;
  notes?: string;
  recordedById?: string;
  branchId?: string;
}

export interface CardScanResult {
  id: string;
  checkInTime: string;
  checkOutTime?: string;
  member?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  session?: {
    id: string;
    name?: string;
  };
  // Add other AttendanceRecord fields as needed
}

// Custom hook for processCardScan mutation
export function useProcessCardScan() {
  const [processCardScanMutation, { data, loading, error }] = useMutation<
    { processCardScan: CardScanResult },
    { input: CardScanInput }
  >(PROCESS_CARD_SCAN);

  // Usage: runProcessCardScan({ input: { ... } })
  const runProcessCardScan = async (input: CardScanInput) => {
    return processCardScanMutation({ variables: { input } });
  };

  return {
    processCardScan: runProcessCardScan,
    data: data?.processCardScan,
    loading,
    error,
  };
}

// Helper to extract the current branch from the AuthUser object
import type { AuthUser, Branch } from './useAuth';

export function getCurrentBranchFromAuthUser(user?: AuthUser): Branch | undefined {
  if (user?.userBranches && user.userBranches.length > 0) {
    return user.userBranches[0].branch;
  }
  return undefined;
}

// New hook that supports organization-based filtering
export interface AttendanceFilterParams {
  organisationId: string;
  branchId?: string;
}

export const useFilteredAttendanceSessions = (filter: AttendanceFilterParams) => {
  const { data, loading, error, refetch } = useQuery(
    GET_FILTERED_ATTENDANCE_SESSIONS,
    {
      variables: {
        organisationId: filter.organisationId,
        branchId: filter.branchId,
      },
      skip: !filter.organisationId && !filter.branchId,
    },
  );

  return {
    sessions: data?.attendanceSessions ?? [],
    loading,
    error,
    refetch,
  };
};
