import { gql } from '@apollo/client';

export const GET_BUDGET_VS_ACTUAL_REPORT = gql`
  query GetBudgetVsActualReport(
    $branchId: String
    $organisationId: String
    $dateRange: DateRangeInput
  ) {
    generateReport(
      input: {
        reportType: "FINANCIAL_CONTRIBUTIONS"
        filter: {
          branchId: $branchId
          organisationId: $organisationId
          dateRange: $dateRange
          searchTerm: "budget-vs-actual"
        }
        outputFormat: "JSON"
      }
    ) {
      data
    }
  }
`;

export const GET_PLEDGE_FULFILLMENT_REPORT = gql`
  query GetPledgeFulfillmentReport(
    $branchId: String
    $organisationId: String
    $dateRange: DateRangeInput
    $fundId: String
  ) {
    generateReport(
      input: {
        reportType: "FINANCIAL_CONTRIBUTIONS"
        filter: {
          branchId: $branchId
          organisationId: $organisationId
          dateRange: $dateRange
          fundId: $fundId
          searchTerm: "pledge-fulfillment"
        }
        outputFormat: "JSON"
      }
    ) {
      data
    }
  }
`;

export const GET_CONTRIBUTIONS_REPORT = gql`
  query GetContributionsReport(
    $branchId: String
    $organisationId: String
    $dateRange: DateRangeInput
    $fundId: String
  ) {
    generateReport(
      input: {
        reportType: "FINANCIAL_CONTRIBUTIONS"
        filter: {
          branchId: $branchId
          organisationId: $organisationId
          dateRange: $dateRange
          fundId: $fundId
          searchTerm: "contributions"
        }
        outputFormat: "JSON"
      }
    ) {
      data
    }
  }
`;

export const GET_MEMBER_DEMOGRAPHICS_REPORT = gql`
  query MemberDemographicsReport(
    $branchId: String
    $organisationId: String
    $dateRange: DateRangeInput
  ) {
    memberDemographicsReport(
      branchId: $branchId
      organisationId: $organisationId
      dateRange: $dateRange
    ) {
      totalMembers
      activeMembers
      inactiveMembers
      genderDistribution {
        gender
        count
        percentage
      }
      ageDistribution {
        ageGroup
        count
        percentage
      }
      membershipTrend {
        date
        newMembers
        totalMembers
      }
      membershipStatus {
        status
        count
        percentage
      }
    }
  }
`;

export const GET_ATTENDANCE_TREND_REPORT = gql`
  query AttendanceTrendReport(
    $branchId: String
    $organisationId: String
    $eventTypeId: String
    $dateRange: DateRangeInput
  ) {
    attendanceTrendReport(
      branchId: $branchId
      organisationId: $organisationId
      eventTypeId: $eventTypeId
      dateRange: $dateRange
    ) {
      totalAttendance
      averageAttendance
      attendanceTrend {
        date
        count
      }
      eventTypeBreakdown {
        eventType
        count
        percentage
      }
    }
  }
`;
