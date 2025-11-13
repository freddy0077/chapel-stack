import { gql } from '@apollo/client';

/**
 * Get all roles
 */
export const GET_ROLES = gql`
  query GetRoles {
    getRoles {
      id
      name
      displayName
      description
      icon
      color
      level
      parentId
      isSystem
    }
  }
`;

/**
 * Get a single role by ID
 */
export const GET_ROLE = gql`
  query GetRole($id: ID!) {
    getRole(id: $id) {
      id
      name
      displayName
      description
      icon
      color
      level
      parentId
      isSystem
    }
  }
`;

/**
 * Get all permissions for a role
 */
export const GET_ROLE_PERMISSIONS = gql`
  query GetRolePermissions($roleId: ID!) {
    getRolePermissions(roleId: $roleId) {
      id
      action
      subject
      description
      category
      isSystem
    }
  }
`;

/**
 * Get all modules for a role
 */
export const GET_ROLE_MODULES = gql`
  query GetRoleModules($roleId: ID!) {
    getRoleModules(roleId: $roleId) {
      id
      name
      displayName
      description
      icon
      path
      category
      isSystem
    }
  }
`;

/**
 * Get all permissions
 */
export const GET_PERMISSIONS = gql`
  query GetPermissions {
    getPermissions {
      id
      action
      subject
      description
      category
      isSystem
    }
  }
`;

/**
 * Get permissions by category
 */
export const GET_PERMISSION_BY_CATEGORY = gql`
  query GetPermissionsByCategory($category: String!) {
    getPermissionsByCategory(category: $category) {
      id
      action
      subject
      description
      category
      isSystem
    }
  }
`;

/**
 * Get all modules
 */
export const GET_MODULES = gql`
  query GetModules {
    getModules {
      id
      name
      displayName
      description
      icon
      path
      category
      isSystem
    }
  }
`;

/**
 * Get module by path
 */
export const GET_MODULE_BY_PATH = gql`
  query GetModuleByPath($path: String!) {
    getModuleByPath(path: $path) {
      id
      name
      displayName
      description
      icon
      path
      category
      isSystem
    }
  }
`;
