import { gql } from '@apollo/client';

export const GET_ABSENTEES = gql`
  query GetAbsentees(
    $organisationId: String!
    $branchId: String!
    $eventId: String
    $attendanceSessionId: String
    $filters: AbsenteeFiltersInput
  ) {
    getAbsentees(
      organisationId: $organisationId
      branchId: $branchId
      eventId: $eventId
      attendanceSessionId: $attendanceSessionId
      filters: $filters
    ) {
      member {
        id
        firstName
        lastName
        email
        phoneNumber
        profileImageUrl
      }
      lastAttendance
      consecutiveAbsences
      isRegularAttender
      attendanceRate
    }
  }
`;

export const GET_MULTI_WEEK_ABSENTEES = gql`
  query GetMultiWeekAbsentees(
    $organisationId: String!
    $branchId: String!
    $weeks: Float!
  ) {
    getMultiWeekAbsentees(
      organisationId: $organisationId
      branchId: $branchId
      weeks: $weeks
    ) {
      member {
        id
        firstName
        lastName
        email
        phoneNumber
        profileImageUrl
      }
      consecutiveAbsences
      lastAttendance
    }
  }
`;
