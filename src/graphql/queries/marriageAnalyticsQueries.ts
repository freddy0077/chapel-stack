import { gql } from '@apollo/client';

export const GET_MARRIAGE_ANALYTICS = gql`
  query GetMarriageAnalytics($input: MarriageAnalyticsInput!) {
    marriageAnalytics(input: $input) {
      totalMarriages
      memberMarriages
      mixedMarriages
      externalMarriages
      thisYearMarriages
      lastYearMarriages
      growthPercentage
      averageAge
      upcomingAnniversaries
      monthlyTrends {
        month
        count
        memberMarriages
        mixedMarriages
        externalMarriages
      }
      topOfficiants {
        officiantId
        officiantName
        marriageCount
        memberOfficiant
      }
    }
  }
`;

export const GET_MEMBER_MARRIAGE_HISTORY = gql`
  query GetMemberMarriageHistory($input: MemberMarriageHistoryInput!) {
    memberMarriageHistory(input: $input) {
      memberId
      memberName
      spouseName
      spouseMemberId
      marriageDate
      marriageLocation
      officiantName
      yearsMarried
      nextAnniversary
      certificateUrl
    }
  }
`;

// Input type definitions for Apollo Client
export const MARRIAGE_ANALYTICS_INPUT = gql`
  input MarriageAnalyticsInput {
    branchId: ID!
    startDate: String
    endDate: String
    organisationId: ID
  }
`;

export const MEMBER_MARRIAGE_HISTORY_INPUT = gql`
  input MemberMarriageHistoryInput {
    memberId: ID!
    branchId: ID
  }
`;
