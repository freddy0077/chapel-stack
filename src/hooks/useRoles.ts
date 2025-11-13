'use client';

import { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { getRoleService, initializeRoleService, RoleData, PermissionData, ModuleData } from '@/services/role.service';

/**
 * Hook for accessing role, permission, and module data
 * Provides caching and utility functions for role-based access control
 */
export function useRoles() {
  const apolloClient = useApolloClient();
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [permissions, setPermissions] = useState<PermissionData[]>([]);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadRoleData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize role service if not already done
        const roleService = initializeRoleService(apolloClient);

        // Load all data in parallel
        const [rolesData, permissionsData, modulesData] = await Promise.all([
          roleService.getAllRoles(),
          roleService.getAllPermissions(),
          roleService.getAllModules(),
        ]);

        setRoles(rolesData);
        setPermissions(permissionsData);
        setModules(modulesData);
      } catch (err) {
        console.error('Error loading role data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadRoleData();
  }, [apolloClient]);

  const roleService = getRoleService();

  return {
    roles,
    permissions,
    modules,
    loading,
    error,
    roleService,
    // Utility functions
    hasPermission: (userPermissions: string[], permissionId: string) =>
      roleService.hasPermission(userPermissions, permissionId),
    canAccessModule: (userModules: string[], moduleId: string) =>
      roleService.canAccessModule(userModules, moduleId),
    hasAnyPermission: (userPermissions: string[], requiredPermissions: string[]) =>
      roleService.hasAnyPermission(userPermissions, requiredPermissions),
    hasAllPermissions: (userPermissions: string[], requiredPermissions: string[]) =>
      roleService.hasAllPermissions(userPermissions, requiredPermissions),
  };
}

/**
 * Hook for checking user permissions
 * Requires user permissions array from context or props
 */
export function useUserPermissions(userPermissions: string[] = []) {
  const { roleService } = useRoles();

  return {
    hasPermission: (permissionId: string) =>
      roleService.hasPermission(userPermissions, permissionId),
    hasAnyPermission: (requiredPermissions: string[]) =>
      roleService.hasAnyPermission(userPermissions, requiredPermissions),
    hasAllPermissions: (requiredPermissions: string[]) =>
      roleService.hasAllPermissions(userPermissions, requiredPermissions),
  };
}

/**
 * Hook for checking user module access
 * Requires user modules array from context or props
 */
export function useUserModules(userModules: string[] = []) {
  const { roleService } = useRoles();

  return {
    canAccessModule: (moduleId: string) =>
      roleService.canAccessModule(userModules, moduleId),
    canAccessAnyModule: (moduleIds: string[]) =>
      moduleIds.some((moduleId) => roleService.canAccessModule(userModules, moduleId)),
    canAccessAllModules: (moduleIds: string[]) =>
      moduleIds.every((moduleId) => roleService.canAccessModule(userModules, moduleId)),
  };
}
