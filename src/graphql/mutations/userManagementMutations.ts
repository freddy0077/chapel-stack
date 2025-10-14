import { gql } from "@apollo/client";

// Create branch admin user
export const CREATE_BRANCH_ADMIN = gql`
  mutation CreateBranchAdmin($input: CreateBranchAdminInput!) {
    createBranchAdmin(input: $input) {
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
`;

// Update user active status
export const UPDATE_USER_ACTIVE_STATUS = gql`
  mutation UpdateUserActiveStatus($id: ID!, $isActive: Boolean!) {
    updateUserActiveStatus(id: $id, isActive: $isActive) {
      id
      email
      firstName
      lastName
      isActive
      updatedAt
    }
  }
`;

// Assign role to user (system-wide role)
export const ASSIGN_ROLE_TO_USER = gql`
  mutation AssignRoleToUser($userId: ID!, $roleId: ID!) {
    assignRoleToUser(userId: $userId, roleId: $roleId) {
      id
      email
      roles {
        id
        name
        description
      }
    }
  }
`;

// Remove role from user (system-wide role)
export const REMOVE_ROLE_FROM_USER = gql`
  mutation RemoveRoleFromUser($userId: ID!, $roleId: ID!) {
    removeRoleFromUser(userId: $userId, roleId: $roleId) {
      id
      email
      roles {
        id
        name
        description
      }
    }
  }
`;

// Assign branch-specific role to user
export const ASSIGN_BRANCH_ROLE_TO_USER = gql`
  mutation AssignBranchRoleToUser(
    $userId: ID!
    $branchId: ID!
    $roleId: ID!
    $assignedBy: ID
  ) {
    assignBranchRoleToUser(
      userId: $userId
      branchId: $branchId
      roleId: $roleId
      assignedBy: $assignedBy
    ) {
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
`;

// Remove branch-specific role from user
export const REMOVE_BRANCH_ROLE_FROM_USER = gql`
  mutation RemoveBranchRoleFromUser(
    $userId: ID!
    $branchId: ID!
    $roleId: ID!
  ) {
    removeBranchRoleFromUser(
      userId: $userId
      branchId: $branchId
      roleId: $roleId
    ) {
      userId
      branchId
      roleId
    }
  }
`;

// Update user password
export const UPDATE_USER_PASSWORD = gql`
  mutation UpdateUserPassword($userId: String!, $newPassword: String!) {
    updateUserPassword(userId: $userId, newPassword: $newPassword) {
      success
      message
    }
  }
`;

// Create users with roles (bulk creation)
export const CREATE_USERS_WITH_ROLE = gql`
  mutation CreateUsersWithRole($input: CreateUsersWithRoleInput!) {
    createUsersWithRole(input: $input) {
      id
      email
      firstName
      lastName
      roleName
      error
    }
  }
`;
