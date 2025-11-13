import { gql } from "@apollo/client";

/**
 * Get all permissions with optional filtering
 */
export const GOD_MODE_GET_PERMISSIONS = gql`
  query GodModePermissions($search: String, $category: String, $skip: Int, $take: Int) {
    godModePermissions(search: $search, category: $category, skip: $skip, take: $take) {
      permissions {
        id
        action
        subject
        description
        category
        roleCount
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
 * Get a single permission by ID
 */
export const GOD_MODE_GET_PERMISSION = gql`
  query GodModePermission($id: ID!) {
    godModePermission(id: $id) {
      id
      action
      subject
      description
      category
      roleCount
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get permission matrix (roles vs permissions)
 */
export const GOD_MODE_GET_PERMISSION_MATRIX = gql`
  query GodModePermissionMatrix {
    godModePermissionMatrix {
      roleIds
      permissionIds
      matrix
    }
  }
`;

/**
 * Get permissions for a role
 */
export const GOD_MODE_GET_ROLE_PERMISSIONS = gql`
  query GodModeRolePermissions($roleId: ID!) {
    godModeRolePermissions(roleId: $roleId) {
      id
      action
      subject
      description
      category
      roleCount
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get roles for a permission
 */
export const GOD_MODE_GET_PERMISSION_ROLES = gql`
  query GodModePermissionRoles($permissionId: ID!) {
    godModePermissionRoles(permissionId: $permissionId)
  }
`;

/**
 * Get permission categories
 */
export const GOD_MODE_GET_PERMISSION_CATEGORIES = gql`
  query GodModePermissionCategories {
    godModePermissionCategories
  }
`;

/**
 * Validate permission hierarchy
 */
export const GOD_MODE_VALIDATE_PERMISSION_HIERARCHY = gql`
  query GodModeValidatePermissionHierarchy($roleId: ID!) {
    godModeValidatePermissionHierarchy(roleId: $roleId)
  }
`;
