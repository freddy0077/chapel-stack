import { gql } from "@apollo/client";

export const CREATE_USERS_WITH_ROLE = gql`
  mutation CreateUsersWithRole($input: CreateUsersWithRoleInput!) {
    createUsersWithRole(input: $input) {
      email
      firstName
      lastName
      roleName
      id
      error
    }
  }
`;

export const ASSIGN_USER_ROLE = gql`
  mutation AssignUserRole(
    $userId: String!
    $branchId: String!
    $role: String!
  ) {
    assignUserRole(userId: $userId, branchId: $branchId, role: $role) {
      id
      firstName
      lastName
      name
      email
      roles
    }
  }
`;

export const REMOVE_USER_ROLE = gql`
  mutation RemoveUserRole(
    $userId: String!
    $branchId: String!
    $role: String!
  ) {
    removeUserRole(userId: $userId, branchId: $branchId, role: $role) {
      id
      firstName
      lastName
      name
      email
      roles
    }
  }
`;

/**
 * Mutation to add a user to a branch with a role
 */
export const ADD_USER_TO_BRANCH = gql`
  mutation AddUserToBranch(
    $userId: String!
    $branchId: String!
    $role: String!
  ) {
    addUserToBranch(userId: $userId, branchId: $branchId, role: $role) {
      id
      email
      firstName
      lastName
      name
      roles
    }
  }
`;
