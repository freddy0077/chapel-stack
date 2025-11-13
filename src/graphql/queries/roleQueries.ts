import { gql } from '@apollo/client';

/**
 * Get all roles with optional filtering
 */
export const GOD_MODE_GET_ROLES = gql`
  query GodModeRoles($search: String, $level: Int, $skip: Int, $take: Int) {
    godModeRoles(search: $search, level: $level, skip: $skip, take: $take) {
      roles {
        id
        name
        description
        level
        userCount
        permissionIds
        createdAt
        updatedAt
      }
      total
      skip
      take
    }
  }
`;

/**
 * Get a single role by ID
 */
export const GOD_MODE_GET_ROLE = gql`
  query GodModeRole($id: ID!) {
    godModeRole(id: $id) {
      id
      name
      description
      level
      userCount
      permissionIds
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get role hierarchy
 */
export const GOD_MODE_GET_ROLE_HIERARCHY = gql`
  query GodModeRoleHierarchy {
    godModeRoleHierarchy {
      roles {
        id
        name
        description
        level
        userCount
        permissionIds
        createdAt
        updatedAt
      }
      levels
    }
  }
`;

/**
 * Get users with specific role
 */
export const GOD_MODE_GET_ROLE_USERS = gql`
  query GodModeRoleUsers($roleId: ID!, $skip: Int, $take: Int) {
    godModeRoleUsers(roleId: $roleId, skip: $skip, take: $take) {
      total
      skip
      take
    }
  }
`;

/**
 * Get user's roles
 */
export const GOD_MODE_GET_USER_ROLES = gql`
  query GodModeUserRoles($userId: ID!) {
    godModeUserRoles(userId: $userId) {
      id
      name
      description
      level
      userCount
      permissionIds
      createdAt
      updatedAt
    }
  }
`;
