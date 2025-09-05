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
      recordedBy {
        id
      }
      branch {
        id
      }
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
      member {
        id
        firstName
        lastName
      }
      visitorName
      visitorEmail
      visitorPhone
      recordedBy {
        id
      }
      branch {
        id
      }
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
    eventAttendanceRecords(eventId: $eventId, filter: $filter) {
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
      recordedBy {
        id
      }
      branch {
        id
      }
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
      recordedBy {
        id
      }
      branch {
        id
      }
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
  query GetFilteredAttendanceSessions($organisationId: ID, $branchId: ID) {
    attendanceSessions(organisationId: $organisationId, branchId: $branchId) {
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
      attendanceRecords {
        id
      }
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
      recordedBy {
        id
      }
      branch {
        id
      }
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

// Update attendance record mutation (now supported by backend)
export const UPDATE_ATTENDANCE_RECORD = gql`
  mutation UpdateAttendanceRecord(
    $id: ID!
    $input: UpdateAttendanceRecordInput!
  ) {
    updateAttendanceRecord(id: $id, input: $input) {
      id
      checkInTime
      checkOutTime
      checkInMethod
      notes
      session {
        id
        name
        date
        startTime
        endTime
      }
      event {
        id
        title
        startDate
        endDate
      }
      member {
        id
        firstName
        lastName
        email
      }
      visitorName
      visitorEmail
      visitorPhone
      recordedBy {
        id
      }
      branch {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

// Delete attendance record mutation (now supported by backend)
export const DELETE_ATTENDANCE_RECORD = gql`
  mutation DeleteAttendanceRecord($id: ID!) {
    deleteAttendanceRecord(id: $id)
  }
`;

// Single attendance record query (now supported by backend)
export const GET_ATTENDANCE_RECORD_DETAILS = gql`
  query GetAttendanceRecordDetails($id: ID!) {
    attendanceRecord(id: $id) {
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
        location
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
        email
        phone
      }
      visitorName
      visitorEmail
      visitorPhone
      recordedBy {
        id
        firstName
        lastName
      }
      branch {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

// Check-out functionality (still available)
export const CHECK_OUT_ATTENDANCE = gql`
  mutation CheckOut($input: CheckOutInput!) {
    checkOut(input: $input) {
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
      recordedBy {
        id
      }
      branch {
        id
      }
      createdAt
      updatedAt
    }
  }
`;
