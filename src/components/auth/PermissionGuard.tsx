'use client';

import React, { ReactNode } from 'react';
import { useUserPermissions, useUserModules } from '@/hooks/useRoles';

export interface PermissionGuardProps {
  children: ReactNode;
  userPermissions?: string[];
  userModules?: string[];
  requiredPermissions?: string[];
  requiredModules?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * Permission Guard Component
 * Conditionally renders children based on user permissions and modules
 * 
 * @example
 * ```tsx
 * <PermissionGuard
 *   userPermissions={user.permissions}
 *   requiredPermissions={['MANAGE_MEMBERS']}
 *   fallback={<div>Access Denied</div>}
 * >
 *   <MembersManagement />
 * </PermissionGuard>
 * ```
 */
export function PermissionGuard({
  children,
  userPermissions = [],
  userModules = [],
  requiredPermissions = [],
  requiredModules = [],
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) {
  const permissionChecker = useUserPermissions(userPermissions);
  const moduleChecker = useUserModules(userModules);

  // Check permissions
  let hasRequiredPermissions = true;
  if (requiredPermissions.length > 0) {
    hasRequiredPermissions = requireAll
      ? permissionChecker.hasAllPermissions(requiredPermissions)
      : permissionChecker.hasAnyPermission(requiredPermissions);
  }

  // Check modules
  let hasRequiredModules = true;
  if (requiredModules.length > 0) {
    hasRequiredModules = requireAll
      ? moduleChecker.canAccessAllModules(requiredModules)
      : moduleChecker.canAccessAnyModule(requiredModules);
  }

  // Render children if all checks pass
  if (hasRequiredPermissions && hasRequiredModules) {
    return <>{children}</>;
  }

  // Render fallback if checks fail
  return <>{fallback}</>;
}

/**
 * Module Guard Component
 * Conditionally renders children based on user module access
 */
export function ModuleGuard({
  children,
  userModules = [],
  requiredModules = [],
  requireAll = false,
  fallback = null,
}: Omit<PermissionGuardProps, 'userPermissions' | 'requiredPermissions'>) {
  const moduleChecker = useUserModules(userModules);

  const hasAccess = requireAll
    ? moduleChecker.canAccessAllModules(requiredModules)
    : moduleChecker.canAccessAnyModule(requiredModules);

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

/**
 * Permission Badge Component
 * Shows a badge indicating if user has permission
 */
export interface PermissionBadgeProps {
  userPermissions?: string[];
  requiredPermissions: string[];
  requireAll?: boolean;
  children?: ReactNode;
  className?: string;
}

export function PermissionBadge({
  userPermissions = [],
  requiredPermissions,
  requireAll = false,
  children,
  className = '',
}: PermissionBadgeProps) {
  const permissionChecker = useUserPermissions(userPermissions);

  const hasPermission = requireAll
    ? permissionChecker.hasAllPermissions(requiredPermissions)
    : permissionChecker.hasAnyPermission(requiredPermissions);

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
        hasPermission
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      } ${className}`}
    >
      {children || (hasPermission ? 'Allowed' : 'Denied')}
    </span>
  );
}
