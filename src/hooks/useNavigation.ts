'use client';

import { useMemo } from 'react';
import { useUserPermissions, useUserModules } from './useRoles';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  requiredPermissions?: string[];
  requiredModules?: string[];
  requireAll?: boolean;
  children?: NavigationItem[];
  badge?: string;
}

export interface NavigationConfig {
  main: NavigationItem[];
  admin: NavigationItem[];
  settings: NavigationItem[];
}

/**
 * Default navigation configuration
 * Maps modules and permissions to navigation items
 */
const DEFAULT_NAVIGATION_CONFIG: NavigationConfig = {
  main: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: 'LayoutDashboard',
      requiredModules: ['dashboard'],
    },
    {
      id: 'members',
      label: 'Members',
      href: '/dashboard/members',
      icon: 'Users',
      requiredModules: ['members'],
      requiredPermissions: ['VIEW_MEMBERS'],
    },
    {
      id: 'groups',
      label: 'Groups & Ministries',
      href: '/dashboard/groups',
      icon: 'Users2',
      requiredModules: ['groups'],
    },
    {
      id: 'events',
      label: 'Events',
      href: '/dashboard/events',
      icon: 'Calendar',
      requiredModules: ['events'],
    },
    {
      id: 'finances',
      label: 'Finances',
      href: '/dashboard/finances',
      icon: 'DollarSign',
      requiredModules: ['finances'],
      requiredPermissions: ['VIEW_FINANCES'],
    },
    {
      id: 'attendance',
      label: 'Attendance',
      href: '/dashboard/attendance',
      icon: 'CheckSquare',
      requiredModules: ['attendance'],
      requiredPermissions: ['VIEW_ATTENDANCE'],
    },
    {
      id: 'communications',
      label: 'Communications',
      href: '/dashboard/communications',
      icon: 'MessageSquare',
      requiredModules: ['communication'],
      requiredPermissions: ['VIEW_COMMUNICATIONS'],
    },
    {
      id: 'pastoral',
      label: 'Pastoral Care',
      href: '/dashboard/pastoral',
      icon: 'Heart',
      requiredModules: ['pastoral_care'],
      requiredPermissions: ['MANAGE_PASTORAL_CARE'],
    },
  ],
  admin: [
    {
      id: 'users',
      label: 'Users',
      href: '/dashboard/admin/users',
      icon: 'Users',
      requiredPermissions: ['MANAGE_USERS'],
    },
    {
      id: 'roles',
      label: 'Roles & Permissions',
      href: '/dashboard/admin/roles',
      icon: 'Shield',
      requiredPermissions: ['MANAGE_ROLES', 'MANAGE_PERMISSIONS'],
      requireAll: false,
    },
    {
      id: 'branches',
      label: 'Branches',
      href: '/dashboard/admin/branches',
      icon: 'Building2',
      requiredPermissions: ['MANAGE_BRANCHES'],
    },
    {
      id: 'audits',
      label: 'Audit Logs',
      href: '/dashboard/admin/audits',
      icon: 'FileText',
      requiredPermissions: ['MANAGE_AUDIT_LOGS'],
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/dashboard/admin/settings',
      icon: 'Settings',
      requiredPermissions: ['MANAGE_SETTINGS'],
    },
  ],
  settings: [
    {
      id: 'profile',
      label: 'Profile',
      href: '/dashboard/profile',
      icon: 'User',
    },
    {
      id: 'preferences',
      label: 'Preferences',
      href: '/dashboard/preferences',
      icon: 'Sliders',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      href: '/dashboard/notifications',
      icon: 'Bell',
    },
  ],
};

/**
 * Hook for filtering navigation based on user permissions and modules
 */
export function useNavigation(
  userPermissions: string[] = [],
  userModules: string[] = [],
  config: NavigationConfig = DEFAULT_NAVIGATION_CONFIG,
) {
  const permissionChecker = useUserPermissions(userPermissions);
  const moduleChecker = useUserModules(userModules);

  const filterNavigation = (items: NavigationItem[]): NavigationItem[] => {
    return items
      .filter((item) => {
        // Check permissions
        if (item.requiredPermissions && item.requiredPermissions.length > 0) {
          const hasPermission = item.requireAll
            ? permissionChecker.hasAllPermissions(item.requiredPermissions)
            : permissionChecker.hasAnyPermission(item.requiredPermissions);

          if (!hasPermission) return false;
        }

        // Check modules
        if (item.requiredModules && item.requiredModules.length > 0) {
          const hasModule = item.requiredModules.some((moduleId) =>
            moduleChecker.canAccessModule(moduleId),
          );

          if (!hasModule) return false;
        }

        return true;
      })
      .map((item) => ({
        ...item,
        // Recursively filter children
        children: item.children ? filterNavigation(item.children) : undefined,
      }));
  };

  return useMemo(() => {
    return {
      main: filterNavigation(config.main),
      admin: filterNavigation(config.admin),
      settings: filterNavigation(config.settings),
      all: [
        ...filterNavigation(config.main),
        ...filterNavigation(config.admin),
        ...filterNavigation(config.settings),
      ],
    };
  }, [userPermissions, userModules, config]);
}

/**
 * Hook for getting accessible routes
 */
export function useAccessibleRoutes(
  userPermissions: string[] = [],
  userModules: string[] = [],
) {
  const navigation = useNavigation(userPermissions, userModules);

  return useMemo(() => {
    const extractRoutes = (items: NavigationItem[]): string[] => {
      return items.flatMap((item) => [
        item.href,
        ...(item.children ? extractRoutes(item.children) : []),
      ]);
    };

    return {
      all: extractRoutes(navigation.all),
      main: extractRoutes(navigation.main),
      admin: extractRoutes(navigation.admin),
      settings: extractRoutes(navigation.settings),
    };
  }, [navigation]);
}

/**
 * Hook for determining default dashboard based on role
 */
export function useDefaultDashboard(
  userRoles: string[] = [],
  userPermissions: string[] = [],
  userModules: string[] = [],
) {
  const permissionChecker = useUserPermissions(userPermissions);
  const moduleChecker = useUserModules(userModules);

  return useMemo(() => {
    // Determine dashboard based on role hierarchy
    // Higher privilege roles get admin dashboard first
    if (userRoles.includes('ADMIN') || userRoles.includes('SUBSCRIPTION_MANAGER')) {
      return '/dashboard/admin';
    }

    if (userRoles.includes('BRANCH_ADMIN') || userRoles.includes('ADMIN')) {
      return '/dashboard/admin';
    }

    // Check for specific module access
    if (moduleChecker.canAccessModule('finances')) {
      return '/dashboard/finances';
    }

    if (moduleChecker.canAccessModule('members')) {
      return '/dashboard/members';
    }

    if (moduleChecker.canAccessModule('communication')) {
      return '/dashboard/communications';
    }

    // Default to main dashboard
    return '/dashboard';
  }, [userRoles, userPermissions, userModules]);
}

/**
 * Hook for checking if user can access a specific route
 */
export function useCanAccessRoute(
  route: string,
  userPermissions: string[] = [],
  userModules: string[] = [],
) {
  const accessibleRoutes = useAccessibleRoutes(userPermissions, userModules);

  return useMemo(() => {
    return accessibleRoutes.all.includes(route);
  }, [route, accessibleRoutes]);
}
