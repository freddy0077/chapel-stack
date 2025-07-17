import { gql } from "@apollo/client";

export const GET_ATTENDANCE_RECORDS = gql`
  query GetAttendanceRecords($sessionId: ID, $filter: AttendanceFilterInput) {
    attendanceRecords(sessionId: $sessionId, filter: $filter) {
      id
      checkInTime
      checkOutTime
      checkInMethod
      notes
      session {
        id
        name
      }
      event {
        id
        title
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

// New query for event-based attendance records
export const GET_ATTENDANCE_RECORDS_FOR_EVENT = gql`
  query GetAttendanceRecordsForEvent(
    $eventId: ID!
    $filter: AttendanceFilterInput
  ) {
    eventAttendanceRecords(
      eventId: $eventId
      filter: $filter
    ) {
      id
      checkInTime
      checkOutTime
      checkInMethod
      notes
      event {
        id
        title
        startDate
        endDate
        location
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

// New query for flexible attendance records filtering
export const GET_ALL_ATTENDANCE_RECORDS = gql`
  query GetAllAttendanceRecords($filter: AttendanceFilterInput) {
    allAttendanceRecords(filter: $filter) {
      id
      checkInTime
      checkOutTime
      checkInMethod
      notes
      session {
        id
        name
        date
        type
      }
      event {
        id
        title
        startDate
        endDate
        location
        category
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
      organisationId
      createdAt
      updatedAt
    }
  }
`;

export const GET_FILTERED_ATTENDANCE_SESSIONS = gql`
  query GetFilteredAttendanceSessions(
    $organisationId: ID
    $branchId: ID
  ) {
    attendanceSessions(
      organisationId: $organisationId
      branchId: $branchId
    ) {
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
      organisationId
      createdAt
      updatedAt
    }
  }
`;

export const GET_ATTENDANCE_SESSION_DETAILS = gql`
  query GetAttendanceSessionDetails($id: ID!) {
    attendanceSession(id: $id) {
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
      organisationId
      createdAt
      updatedAt
      attendanceRecords {
        id
        checkInTime
        checkOutTime
        checkInMethod
        notes
        member {
          id
          fullName
        }
        visitorName
        visitorEmail
        visitorPhone
        recordedBy {
          id
          name
        }
      }
    }
  }
`;

export const RECORD_ATTENDANCE = gql`
  mutation RecordAttendance($input: RecordAttendanceInput!) {
    recordAttendance(input: $input) {
      id
      checkInTime
      checkOutTime
      checkInMethod
      notes
      session {
        id
        name
      }
      event {
        id
        title
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

export const RECORD_BULK_ATTENDANCE = gql`
  mutation RecordBulkAttendance($input: RecordBulkAttendanceInput!) {
    recordBulkAttendance(input: $input)
  }
`;
