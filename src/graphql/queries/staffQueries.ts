import { gql } from "@apollo/client";

// Get all staff members using adminUsers query with organisationId filter
export const GET_STAFF_MEMBERS = gql`
  query AdminUsers($pagination: PaginationInput, $filter: UserFilterInput) {
    adminUsers(pagination: $pagination, filter: $filter) {
      items {
        id
        email
        firstName
        lastName
        isActive
        roles {
          id
          name
        }
      }
      totalCount
    }
  }
`;

// Alternative comprehensive staff query for detailed information
export const GET_STAFF_MEMBERS_DETAILED = gql`
  query GetStaffMembersDetailed($organisationId: String!, $pagination: PaginationInput) {
    users(organisationId: $organisationId, pagination: $pagination) {
      items {
        id
        email
        firstName
        lastName
        phoneNumber
        isActive
        isEmailVerified
        lastLoginAt
        createdAt
        updatedAt
        userBranches {
          branchId
          roleId
          branch {
            id
            name
          }
          role {
            id
            name
            description
          }
        }
        roles {
          id
          name
          description
        }
        member {
          id
          firstName
          lastName
          profileImageUrl
          status
        }
      }
      meta {
        totalItems
        totalPages
        currentPage
        itemsPerPage
      }
    }
  }
`;

// Get staff statistics for dashboard cards
export const GET_STAFF_STATISTICS = gql`
  query GetStaffStatistics($organisationId: String!) {
    staffStatistics(organisationId: $organisationId) {
      totalStaff
      activeStaff
      inactiveStaff
      totalDepartments
      totalBranches
      recentHires
    }
  }
`;

// Get available roles for staff assignment
export const GET_AVAILABLE_ROLES = gql`
  query GetAvailableRoles($organisationId: String!) {
    roles(organisationId: $organisationId) {
      id
      name
      description
      permissions {
        id
        name
        resource
        action
      }
    }
  }
`;

// Get available branches for staff assignment
export const GET_AVAILABLE_BRANCHES = gql`
  query GetAvailableBranches($organisationId: String!) {
    branches(organisationId: $organisationId) {
      id
      name
      address
      isActive
    }
  }
`;

// Get single staff member details
export const GET_STAFF_MEMBER = gql`
  query GetStaffMember($id: ID!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      phoneNumber
      isActive
      isEmailVerified
      lastLoginAt
      createdAt
      updatedAt
      userBranches {
        branchId
        roleId
        branch {
          id
          name
        }
        role {
          id
          name
          description
        }
      }
      roles {
        id
        name
        description
      }
      member {
        id
        firstName
        lastName
        profileImageUrl
        status
      }
    }
  }
`;
