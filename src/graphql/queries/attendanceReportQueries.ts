import { gql } from "@apollo/client";

export const GENERATE_ATTENDANCE_REPORT = gql`
  query GenerateAttendanceReport(
    $input: AttendanceReportInput!
    $generatedBy: String
  ) {
    generateAttendanceReport(input: $input, generatedBy: $generatedBy) {
      id
      reportType
      title
      generatedAt
      generatedBy
      format
      summary {
        startDate
        endDate
        totalSessions
        totalEvents
        totalAttendance
        uniqueMembers
        totalVisitors
        firstTimeVisitors
        averageSessionAttendance
        averageEventAttendance
        memberRetentionRate
        visitorConversionRate
        overallGrowthRate
      }
      data {
        period
        totalAttendance
        uniqueMembers
        visitors
        firstTimeVisitors
        averageAttendance
        growthRate
        retentionRate
      }
      members {
        id
        memberId
        firstName
        middleName
        lastName
        title
        email
        phoneNumber
        dateOfBirth
        gender
        maritalStatus
        occupation
        employerName
        address
        city
        state
        postalCode
        country
        nationality
        placeOfBirth
        nlbNumber
        fatherName
        motherName
        fatherOccupation
        motherOccupation
        emergencyContactName
        emergencyContactPhone
        membershipDate
        baptismDate
        confirmationDate
        status
        branch {
          id
          name
        }
        branchId
        spouse {
          id
          firstName
          lastName
        }
        parent {
          id
          firstName
          lastName
        }
        children {
          id
          firstName
          lastName
        }
        attendanceCount
        attendanceRate
        lastAttendance
        attendanceDates
        profileImageUrl
        notes
        rfidCardId
        createdAt
        updatedAt
      }
      sessions {
        id
        name
        date
        type
        totalAttendance
        memberAttendance
        visitorAttendance
        attendanceRate
      }
      events {
        id
        title
        startDate
        category
        totalAttendance
        memberAttendance
        visitorAttendance
        attendanceRate
      }
      charts {
        type
        title
        labels
        data
        colors
      }
      downloadUrl
      branchId
      organisationId
    }
  }
`;

export const GET_ATTENDANCE_STATS = gql`
  query GetAttendanceStats($input: AttendanceStatsInput!) {
    attendanceStats(input: $input) {
      branchId
      organisationId
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
        ageGroup
        count
      }
      BY_GENDER {
        gender
        count
      }
      BY_BRANCH {
        branchId
        branchName
        count
      }
      BY_EVENT_TYPE {
        eventType
        count
      }
      FREQUENCY {
        memberId
        memberName
        frequency
      }
    }
  }
`;
