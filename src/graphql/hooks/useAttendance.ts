import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ATTENDANCE_RECORDS,
  GET_ATTENDANCE_RECORDS_FOR_SESSION,
  GET_ATTENDANCE_RECORDS_FOR_EVENT,
  GET_ALL_ATTENDANCE_RECORDS,
  GET_FILTERED_ATTENDANCE_SESSIONS,
  RECORD_ATTENDANCE,
  RECORD_BULK_ATTENDANCE,
} from "../queries/attendanceQueries";
import { PROCESS_CARD_SCAN } from "../mutations/attendanceMutations";

// Types for Attendance
export interface AttendanceRecord {
  id: string;
  checkInTime: string;
  checkOutTime?: string;
  checkInMethod?: string;
  notes?: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  recordedById?: string;
  branchId?: string;
  createdAt: string;
  updatedAt: string;
  session?: AttendanceSession;
  event?: AttendanceEvent;
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

export interface AttendanceEvent {
  id: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  category?: string;
}

export interface AttendanceMember {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface AttendanceBranch {
  id: string;
  name?: string;
}

export interface AttendanceUser {
  id: string;
}

export interface AttendanceFilterInput {
  sessionId?: string;
  eventId?: string;
  memberId?: string;
  checkInMethod?: string;
  visitorNameContains?: string;
  branchId?: string;
  startDate?: string;
  endDate?: string;
}

export interface UseAttendanceRecordsOptions {
  sessionId?: string;
  filter?: AttendanceFilterInput;
}

export interface UseEventAttendanceRecordsOptions {
  eventId: string;
  filter?: AttendanceFilterInput;
}

export interface UseAllAttendanceRecordsOptions {
  filter?: AttendanceFilterInput;
}

// Hook to fetch attendance records (supports both session and event filtering)
export function useAttendanceRecords(options: UseAttendanceRecordsOptions) {
  const { data, loading, error, refetch } = useQuery(GET_ATTENDANCE_RECORDS, {
    variables: options,
    skip: !options.sessionId && !options.filter?.eventId,
  });

  return {
    attendanceRecords: data?.attendanceRecords || [],
    loading,
    error,
    refetch,
  };
}

// Hook to fetch attendance records for a session with expanded fields
export function useAttendanceRecordsForSession(
  options: UseAttendanceRecordsOptions,
) {
  const { data, loading, error, refetch } = useQuery(
    GET_ATTENDANCE_RECORDS_FOR_SESSION,
    {
      variables: options,
      skip: !options.sessionId,
    },
  );

  return {
    attendanceRecords: data?.attendanceRecords || [],
    loading,
    error,
    refetch,
  };
}

// Hook to fetch attendance records for an event
export function useAttendanceRecordsForEvent(
  options: UseEventAttendanceRecordsOptions,
) {
  const { data, loading, error, refetch } = useQuery(
    GET_ATTENDANCE_RECORDS_FOR_EVENT,
    {
      variables: options,
      skip: !options.eventId,
    },
  );

  return {
    attendanceRecords: data?.eventAttendanceRecords || [],
    loading,
    error,
    refetch,
  };
}

// Hook to fetch all attendance records with flexible filtering
export function useAllAttendanceRecords(
  options: UseAllAttendanceRecordsOptions = {},
) {
  const { data, loading, error, refetch } = useQuery(
    GET_ALL_ATTENDANCE_RECORDS,
    {
      variables: options,
    },
  );

  return {
    attendanceRecords: data?.allAttendanceRecords || [],
    loading,
    error,
    refetch,
  };
}

// Hook for recording attendance (supports both session and event)
export function useRecordAttendance() {
  const [recordAttendance, { loading, error }] = useMutation(RECORD_ATTENDANCE);

  return {
    recordAttendance: async (input: RecordAttendanceInput) => {
      const result = await recordAttendance({
        variables: { input },
      });
      return result.data?.recordAttendance;
    },
    loading,
    error,
  };
}

// Hook for bulk attendance recording (supports both session and event)
export function useRecordBulkAttendance() {
  const [recordBulkAttendance, { loading, error }] = useMutation(
    RECORD_BULK_ATTENDANCE,
  );

  return {
    recordBulkAttendance: async (input: RecordBulkAttendanceInput) => {
      const result = await recordBulkAttendance({
        variables: { input },
      });
      return result.data?.recordBulkAttendance;
    },
    loading,
    error,
  };
}

// Types for attendance input
export interface RecordAttendanceInput {
  sessionId?: string;
  eventId?: string;
  memberId?: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  checkInTime?: string;
  checkInMethod?: string;
  notes?: string;
  branchId?: string;
  recordedById?: string;
}

export interface RecordBulkAttendanceInput {
  sessionId?: string;
  eventId?: string;
  attendanceRecords?: RecordAttendanceInput[];
  headcount?: number;
  branchId?: string;
  recordedById?: string;
}

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
}

// Custom hook for processCardScan mutation
export function useProcessCardScan() {
  const [processCardScan, { loading, error }] = useMutation(PROCESS_CARD_SCAN);

  return {
    processCardScan: async (input: CardScanInput) => {
      const result = await processCardScan({
        variables: { input },
      });
      return result.data?.processCardScan;
    },
    loading,
    error,
  };
}

// Helper to extract the current branch from the AuthUser object
import type { AuthUser, Branch } from "./useAuth";

export function getCurrentBranchFromAuthUser(
  user?: AuthUser,
): Branch | undefined {
  if (!user?.userBranches?.length) return undefined;
  return user.userBranches[0]?.branch;
}

// New hook that supports organization-based filtering
export interface AttendanceFilterParams {
  organisationId: string;
  branchId?: string;
}

export function useFilteredAttendanceSessions(filter: AttendanceFilterParams) {
  const { data, loading, error, refetch } = useQuery(
    GET_FILTERED_ATTENDANCE_SESSIONS,
    {
      variables: {
        filterInput: {
          ...(filter.organisationId && {
            organisationId: filter.organisationId,
          }),
          ...(filter.branchId && { branchId: filter.branchId }),
        },
      },
    },
  );

  return {
    sessions: data?.attendanceSessions || [],
    loading,
    error,
    refetch,
  };
}
