import { gql } from "@apollo/client";

export const GET_ATTENDANCE_ANALYTICS = gql`
  query AttendanceAnalytics($input: AttendanceStatsInput!) {
    attendanceStats(input: $input) {
      branchId
      startDate
      endDate
      period
      TOTAL_ATTENDANCE {
        period
        total
      }
      UNIQUE_MEMBERS {
        period
        unique_members
      }
      VISITORS {
        period
        visitors
      }
      FIRST_TIME_VISITORS {
        period
        first_time_visitors
      }
      GROWTH_RATE {
        period
        growth_rate
      }
      RETENTION_RATE {
        period
        retention_rate
      }
      BY_AGE_GROUP {
        group
        count
      }
      BY_GENDER {
        group
        count
      }
      BY_BRANCH {
        group
        count
      }
      BY_EVENT_TYPE {
        eventType
        count
      }
      FREQUENCY {
        label
        count
      }
    }
  }
`;
