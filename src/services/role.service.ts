/**
 * Frontend Role Service
 * Manages role, permission, and module data from the backend
 * Provides caching and utility functions for role-based access control
 */

import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  GET_ROLES,
  GET_ROLE,
  GET_ROLE_PERMISSIONS,
  GET_ROLE_MODULES,
  GET_PERMISSIONS,
  GET_PERMISSION_BY_CATEGORY,
  GET_MODULES,
  GET_MODULE_BY_PATH,
} from '@/graphql/queries/roleSystemQueries';

export interface RoleData {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  icon?: string;
  color?: string;
  level: number;
  parentId?: string;
  isSystem: boolean;
  permissions?: PermissionData[];
  modules?: ModuleData[];
}

export interface PermissionData {
  id: string;
  action: string;
  subject: string;
  description?: string;
  category: string;
  isSystem: boolean;
}

export interface ModuleData {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  path: string;
  category?: string;
  isSystem: boolean;
}

/**
 * Role Service for frontend
 * Handles role, permission, and module data management
 */
export class RoleService {
  private apolloClient: ApolloClient<NormalizedCacheObject>;
  private roleCache = new Map<string, RoleData>();
  private permissionCache = new Map<string, PermissionData>();
  private moduleCache = new Map<string, ModuleData>();
  private allRolesCache: RoleData[] | null = null;
  private allPermissionsCache: PermissionData[] | null = null;
  private allModulesCache: ModuleData[] | null = null;

  constructor(apolloClient: ApolloClient<NormalizedCacheObject>) {
    this.apolloClient = apolloClient;
  }

  /**
   * Get all roles
   */
  async getAllRoles(): Promise<RoleData[]> {
    if (this.allRolesCache) {
      return this.allRolesCache;
    }

    try {
      const { data } = await this.apolloClient.query({
        query: GET_ROLES,
      });

      if (!data || !data.getRoles) {
        console.warn('GET_ROLES returned empty or null data');
        this.allRolesCache = [];
        return [];
      }

      this.allRolesCache = data.getRoles;
      data.getRoles.forEach((role: RoleData) => {
        this.roleCache.set(role.id, role);
      });

      return data.getRoles;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  /**
   * Get a single role by ID
   */
  async getRole(roleId: string): Promise<RoleData | null> {
    if (this.roleCache.has(roleId)) {
      return this.roleCache.get(roleId) || null;
    }

    try {
      const { data } = await this.apolloClient.query({
        query: GET_ROLE,
        variables: { id: roleId },
      });

      this.roleCache.set(roleId, data.getRole);
      return data.getRole;
    } catch (error) {
      console.error(`Error fetching role ${roleId}:`, error);
      return null;
    }
  }

  /**
   * Get all permissions for a role
   */
  async getRolePermissions(roleId: string): Promise<PermissionData[]> {
    try {
      const { data } = await this.apolloClient.query({
        query: GET_ROLE_PERMISSIONS,
        variables: { roleId },
      });

      return data.getRolePermissions;
    } catch (error) {
      console.error(`Error fetching permissions for role ${roleId}:`, error);
      return [];
    }
  }

  /**
   * Get all modules for a role
   */
  async getRoleModules(roleId: string): Promise<ModuleData[]> {
    try {
      const { data } = await this.apolloClient.query({
        query: GET_ROLE_MODULES,
        variables: { roleId },
      });

      return data.getRoleModules;
    } catch (error) {
      console.error(`Error fetching modules for role ${roleId}:`, error);
      return [];
    }
  }

  /**
   * Get all permissions
   */
  async getAllPermissions(): Promise<PermissionData[]> {
    if (this.allPermissionsCache) {
      return this.allPermissionsCache;
    }

    try {
      const { data } = await this.apolloClient.query({
        query: GET_PERMISSIONS,
      });

      this.allPermissionsCache = data.getPermissions;
      data.getPermissions.forEach((perm: PermissionData) => {
        this.permissionCache.set(perm.id, perm);
      });

      return data.getPermissions;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
  }

  /**
   * Get permissions by category
   */
  async getPermissionsByCategory(category: string): Promise<PermissionData[]> {
    try {
      const { data } = await this.apolloClient.query({
        query: GET_PERMISSION_BY_CATEGORY,
        variables: { category },
      });

      return data.getPermissionsByCategory;
    } catch (error) {
      console.error(`Error fetching permissions for category ${category}:`, error);
      return [];
    }
  }

  /**
   * Get all modules
   */
  async getAllModules(): Promise<ModuleData[]> {
    if (this.allModulesCache) {
      return this.allModulesCache;
    }

    try {
      const { data } = await this.apolloClient.query({
        query: GET_MODULES,
      });

      this.allModulesCache = data.getModules;
      data.getModules.forEach((mod: ModuleData) => {
        this.moduleCache.set(mod.id, mod);
      });

      return data.getModules;
    } catch (error) {
      console.error('Error fetching modules:', error);
      return [];
    }
  }

  /**
   * Get module by path
   */
  async getModuleByPath(path: string): Promise<ModuleData | null> {
    try {
      const { data } = await this.apolloClient.query({
        query: GET_MODULE_BY_PATH,
        variables: { path },
      });

      return data.getModuleByPath;
    } catch (error) {
      console.error(`Error fetching module for path ${path}:`, error);
      return null;
    }
  }

  /**
   * Check if user has permission
   */
  hasPermission(userPermissions: string[], permissionId: string): boolean {
    return userPermissions.includes(permissionId);
  }

  /**
   * Check if user can access module
   */
  canAccessModule(userModules: string[], moduleId: string): boolean {
    return userModules.includes(moduleId);
  }

  /**
   * Check if user has any of the required permissions
   */
  hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.some((perm) => userPermissions.includes(perm));
  }

  /**
   * Check if user has all required permissions
   */
  hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.every((perm) => userPermissions.includes(perm));
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.roleCache.clear();
    this.permissionCache.clear();
    this.moduleCache.clear();
    this.allRolesCache = null;
    this.allPermissionsCache = null;
    this.allModulesCache = null;
  }

  /**
   * Refresh all caches
   */
  async refreshCache(): Promise<void> {
    this.clearCache();
    await Promise.all([
      this.getAllRoles(),
      this.getAllPermissions(),
      this.getAllModules(),
    ]);
  }
}

/**
 * Create a singleton instance of RoleService
 */
let roleServiceInstance: RoleService | null = null;

export function initializeRoleService(
  apolloClient: ApolloClient<NormalizedCacheObject>,
): RoleService {
  if (!roleServiceInstance) {
    roleServiceInstance = new RoleService(apolloClient);
  }
  return roleServiceInstance;
}

export function getRoleService(): RoleService {
  if (!roleServiceInstance) {
    throw new Error('RoleService not initialized. Call initializeRoleService first.');
  }
  return roleServiceInstance;
}
