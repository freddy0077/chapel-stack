import { gql } from "@apollo/client";

export const GET_BRANCHES = gql`
  query GetBranches($filter: BranchFilterInput, $pagination: PaginationInput) {
    branches(filterInput: $filter, paginationInput: $pagination) {
      items {
        id
        name
        address
        city
        state
        postalCode
        country
        email
        phoneNumber
        website
        isActive
        establishedAt
        createdAt
        updatedAt
        settings {
          id
          branchId
          allowMemberTransfers
          allowResourceSharing
          visibilityToOtherBranches
          financialReportingLevel
          attendanceReportingLevel
          memberDataVisibility
          timezone
          currency
          language
          brandingSettings {
            primaryColor
            secondaryColor
            fontFamily
          }
          notificationSettings {
            emailNotifications
            smsNotifications
            transferNotifications
            financialNotifications
          }
          createdAt
          updatedAt
        }
        statistics {
          activeMembers
          inactiveMembers
          totalMembers
        }
      }
      totalCount
      hasNextPage
    }
  }
`;

export const GET_BRANCH = gql`
  query GetBranch($branchId: String!) {
    branch(id: $branchId) {
      id
      name
      address
      city
      state
      postalCode
      country
      email
      phoneNumber
      website
      isActive
      establishedAt
      createdAt
      updatedAt
      settings {
        id
        branchId
        allowMemberTransfers
        allowResourceSharing
        visibilityToOtherBranches
        financialReportingLevel
        attendanceReportingLevel
        memberDataVisibility
        timezone
        currency
        language
        brandingSettings {
          primaryColor
          secondaryColor
          fontFamily
        }
        notificationSettings {
          emailNotifications
          smsNotifications
          transferNotifications
          financialNotifications
        }
        createdAt
        updatedAt
      }
      statistics {
        activeMembers
        inactiveMembers
        totalMembers
      }
    }
  }
`;

/**
 * Query to fetch recent activities for a branch
 */
export const GET_BRANCH_ACTIVITIES = gql`
  query GetBranchActivities($branchId: String!, $limit: Float, $skip: Float) {
    branchActivities(branchId: $branchId, limit: $limit, skip: $skip) {
      id
      type
      description
      timestamp
      branchId
      user {
        id
        firstName
        lastName
        name
      }
      metadata {
        entityId
        entityType
        details
      }
    }
  }
`;

/**
 * Query to fetch upcoming events for a branch
 */
export const GET_BRANCH_UPCOMING_EVENTS = gql`
  query GetBranchUpcomingEvents($branchId: String!, $limit: Float) {
    branchUpcomingEvents(branchId: $branchId, limit: $limit) {
      id
      title
      description
      category
      startDate
      endDate
      location
      branchId
      attendees {
        id
        firstName
        lastName
        name
      }
    }
  }
`;

/**
 * Query to fetch users associated with a branch
 */
export const GET_BRANCH_USERS = gql`
  query GetBranchUsers($branchId: String!) {
    branchUsers(branchId: $branchId) {
      id
      firstName
      lastName
      name
      email
      roles
    }
  }
`;
