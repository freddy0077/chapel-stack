import { gql } from '@apollo/client';

export const GENERATE_MEMBER_REPORT = gql`
  query GenerateMemberReport($input: MemberReportInput!) {
    generateMemberReport(input: $input) {
      id
      summary {
        title
        startDate
        endDate
        totalMembers
        activeMembers
        inactiveMembers
        newMembers
        visitors
        firstTimeVisitors
        returningVisitors
        growthRate
        retentionRate
        conversionRate
        averageAge
        maleMembers
        femaleMembers
      }
      data {
        period
        totalMembers
        activeMembers
        inactiveMembers
        newMembers
        visitors
        growthRate
        retentionRate
        conversionRate
      }
      demographics {
        category
        value
        count
        percentage
      }
      engagement {
        memberId
        name
        email
        attendanceCount
        attendanceRate
        lastAttendance
        eventParticipation
        engagementScore
      }
      geographic {
        location
        memberCount
        percentage
        averageAge
        primaryGender
      }
      charts {
        type
        title
        labels
        data
        colors
      }
      generatedAt
      downloadUrl
    }
  }
`;

export const GET_MEMBER_STATS = gql`
  query GetMemberStats($organisationId: String, $branchId: String) {
    memberStatistics(organisationId: $organisationId, branchId: $branchId) {
      totalMembers
      activeMembers
      inactiveMembers
      newMembersInPeriod
      visitorsInPeriod
      growthRate
      retentionRate
      conversionRate
      averageAge
      genderDistribution {
        maleCount
        femaleCount
        otherCount
        malePercentage
        femalePercentage
        otherPercentage
      }
      ageGroups {
        range
        count
        percentage
      }
    }
  }
`;
