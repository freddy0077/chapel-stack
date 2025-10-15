import { gql } from "@apollo/client";

// Get all users with pagination (from user-admin.resolver.ts)
export const GET_ALL_USERS = gql`
  query GetAllUsers(
    $pagination: PaginationInput
    $filter: UserFilterInput
  ) {
    adminUsers(pagination: $pagination, filter: $filter) {
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
        member {
          id
          firstName
          lastName
          email
          phoneNumber
        }
        roles {
          id
          name
          description
        }
        userBranches {
          userId
          branchId
          roleId
          branch {
            id
            name
          }
          role {
            id
            name
          }
        }
      }
      totalCount
      hasNextPage
    }
  }
`;

// Get all available roles
export const GET_ALL_ROLES = gql`
  query GetAllRoles {
    adminRoles {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

// Get user by ID
export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    adminUser(id: $id) {
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
      roles {
        id
        name
        description
      }
      userBranches {
        id
        branchId
        branch {
          id
          name
        }
        role {
          id
          name
        }
      }
    }
  }
`;

// Get branches for organization
export const GET_BRANCHES = gql`
  query GetBranches($organisationId: String!) {
    branches(organisationId: $organisationId) {
      id
      name
      isActive
      address
      city
      state
      postalCode
      country
      phoneNumber
      email
    }
  }
`;

// Search users by role
export const SEARCH_USERS_BY_ROLE = gql`
  query SearchUsersByRole(
    $filter: UserRoleFilterInput!
    $pagination: PaginationInput
  ) {
    searchUsersByRole(filter: $filter, pagination: $pagination) {
      users {
        id
        email
        firstName
        lastName
        isActive
        roles {
          id
          name
        }
        userBranches {
          id
          branch {
            id
            name
          }
          role {
            id
            name
          }
        }
      }
      total
      hasMore
    }
  }
`;
