import { gql } from '@apollo/client';

// Query to search for users by specific roles (optimized for pastor search)
export const SEARCH_USERS_BY_ROLE = gql`
  query SearchUsersByRole(
    $organisationId: ID!
    $branchId: ID
    $search: String
    $roles: [String!]!
    $pagination: PaginationInput
  ) {
    searchUsersByRole(
      filter: {
        organisationId: $organisationId
        branchId: $branchId
        search: $search
        roles: $roles
      }
      pagination: $pagination
    ) {
      items {
        id
        firstName
        lastName
        email
        phoneNumber
        profileImageUrl
        userBranches {
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
      hasPreviousPage
    }
  }
`;

// Query specifically for searching pastors
export const SEARCH_PASTORS = gql`
  query SearchPastors(
    $organisationId: ID!
    $branchId: ID
    $search: String
    $pagination: PaginationInput
  ) {
    searchUsersByRole(
      filter: {
        organisationId: $organisationId
        branchId: $branchId
        search: $search
        roles: ["PASTOR"]
      }
      pagination: $pagination
    ) {
      items {
        id
        firstName
        lastName
        email
        phoneNumber
        profileImageUrl
        userBranches {
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
    }
  }
`;

// Query for searching pastoral staff (pastors, branch admins, staff)
export const SEARCH_PASTORAL_STAFF = gql`
  query SearchPastoralStaff(
    $organisationId: ID!
    $branchId: ID
    $search: String
    $pagination: PaginationInput
  ) {
    searchUsersByRole(
      filter: {
        organisationId: $organisationId
        branchId: $branchId
        search: $search
        roles: ["PASTOR", "BRANCH_ADMIN", "STAFF"]
      }
      pagination: $pagination
    ) {
      items {
        id
        firstName
        lastName
        email
        phoneNumber
        profileImageUrl
        userBranches {
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
    }
  }
`;
