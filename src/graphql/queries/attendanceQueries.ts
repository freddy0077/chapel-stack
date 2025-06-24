import { gql } from "@apollo/client";

export const GET_ATTENDANCE_RECORDS = gql`
  query GetAttendanceRecords($sessionId: ID!, $filter: AttendanceFilterInput) {
    attendanceRecords(sessionId: $sessionId, filter: $filter) {
      id
      checkInTime
      checkOutTime
      checkInMethod
      notes
      sessionId
      memberId
      visitorName
      visitorEmail
      visitorPhone
      recordedBy { id }
      branch { id }
      createdAt
      updatedAt
    }
  }
`;

// Query to list attendance records by session with expanded fields
export const GET_ATTENDANCE_RECORDS_FOR_SESSION = gql`
  query GetAttendanceRecordsForSession(
    $sessionId: ID!
    $filter: AttendanceFilterInput
  ) {
    attendanceRecords(
      sessionId: $sessionId
      filter: $filter
    ) {
      id
      checkInTime
      checkOutTime
      checkInMethod
      notes
      session {
        id
        name
      }
      member {
        id
        firstName
        lastName
      }
      visitorName
      visitorEmail
      visitorPhone
      recordedBy { id }
      branch { id }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ATTENDANCE_SESSION = gql`
  mutation CreateAttendanceSession($input: CreateAttendanceSessionInput!) {
    createAttendanceSession(input: $input) {
      id
      name
      description
      date
      startTime
      endTime
      type
      status
      location
      branchId
      createdAt
      updatedAt
    }
  }
`;

export const GET_ATTENDANCE_SESSIONS_BY_BRANCH_WITH_DETAILS = gql`
  query GetAttendanceSessionsByBranchWithDetails($branchId: ID!) {
    attendanceSessions(branchId: $branchId) {
      id
      name
      description
      date
      startTime
      endTime
      type
      status
      location
      latitude
      longitude
      branchId
      createdAt
      updatedAt
    }
  }
`;
