'use client';

import { useMemo } from 'react';
import { useUserPermissions, useUserModules } from './useRoles';

/**
 * Hook for checking component visibility based on permissions
 */
export function useComponentVisibility(
  userPermissions: string[] = [],
  userModules: string[] = [],
) {
  const permissionChecker = useUserPermissions(userPermissions);
  const moduleChecker = useUserModules(userModules);

  return useMemo(
    () => ({
      /**
       * Check if component should be visible based on permissions
       */
      canShowByPermission: (requiredPermissions: string[], requireAll = false) => {
        if (requiredPermissions.length === 0) return true;
        return requireAll
          ? permissionChecker.hasAllPermissions(requiredPermissions)
          : permissionChecker.hasAnyPermission(requiredPermissions);
      },

      /**
       * Check if component should be visible based on modules
       */
      canShowByModule: (requiredModules: string[], requireAll = false) => {
        if (requiredModules.length === 0) return true;
        return requireAll
          ? moduleChecker.canAccessAllModules(requiredModules)
          : moduleChecker.canAccessAnyModule(requiredModules);
      },

      /**
       * Check if component should be visible based on both permissions and modules
       */
      canShow: (
        requiredPermissions: string[] = [],
        requiredModules: string[] = [],
        requireAll = false,
      ) => {
        const hasPermission =
          requiredPermissions.length === 0 ||
          (requireAll
            ? permissionChecker.hasAllPermissions(requiredPermissions)
            : permissionChecker.hasAnyPermission(requiredPermissions));

        const hasModule =
          requiredModules.length === 0 ||
          (requireAll
            ? moduleChecker.canAccessAllModules(requiredModules)
            : moduleChecker.canAccessAnyModule(requiredModules));

        return hasPermission && hasModule;
      },

      /**
       * Get visibility for multiple features
       */
      getVisibility: (
        features: Record<
          string,
          { permissions?: string[]; modules?: string[]; requireAll?: boolean }
        >,
      ) => {
        const visibility: Record<string, boolean> = {};
        for (const [key, config] of Object.entries(features)) {
          visibility[key] = this.canShow(
            config.permissions,
            config.modules,
            config.requireAll,
          );
        }
        return visibility;
      },
    }),
    [userPermissions, userModules],
  );
}

/**
 * Hook for feature flags based on roles
 */
export function useFeatureFlags(userRoles: string[] = []) {
  return useMemo(
    () => ({
      /**
       * Check if feature is enabled for user role
       */
      isFeatureEnabled: (featureName: string, enabledRoles: string[]) => {
        return enabledRoles.some((role) => userRoles.includes(role));
      },

      /**
       * Get feature flags for multiple features
       */
      getFeatureFlags: (
        features: Record<string, string[]>, // feature name -> enabled roles
      ) => {
        const flags: Record<string, boolean> = {};
        for (const [feature, enabledRoles] of Object.entries(features)) {
          flags[feature] = enabledRoles.some((role) => userRoles.includes(role));
        }
        return flags;
      },

      /**
       * Check if user has admin features
       */
      hasAdminFeatures: () => {
        return userRoles.some((role) =>
          ['ADMIN', 'SUBSCRIPTION_MANAGER', 'BRANCH_ADMIN', 'ADMIN'].includes(role),
        );
      },

      /**
       * Check if user has finance features
       */
      hasFinanceFeatures: () => {
        return userRoles.some((role) =>
          ['ADMIN', 'BRANCH_ADMIN', 'ADMIN', 'FINANCE_MANAGER'].includes(role),
        );
      },

      /**
       * Check if user has pastoral features
       */
      hasPastoralFeatures: () => {
        return userRoles.some((role) =>
          ['ADMIN', 'BRANCH_ADMIN', 'PASTORAL_STAFF', 'MINISTRY_LEADER'].includes(role),
        );
      },

      /**
       * Check if user has communication features
       */
      hasCommunicationFeatures: () => {
        return userRoles.some((role) =>
          ['ADMIN', 'BRANCH_ADMIN', 'ADMIN'].includes(role),
        );
      },
    }),
    [userRoles],
  );
}

/**
 * Hook for dashboard customization based on role
 */
export function useDashboardCustomization(
  userRoles: string[] = [],
  userPermissions: string[] = [],
) {
  const featureFlags = useFeatureFlags(userRoles);
  const visibility = useComponentVisibility(userPermissions);

  return useMemo(
    () => ({
      /**
       * Get dashboard widgets to show
       */
      getWidgets: () => {
        const widgets = {
          statistics: true,
          recentActivity: true,
          quickActions: true,
          alerts: featureFlags.hasAdminFeatures(),
          analytics: featureFlags.hasAdminFeatures(),
          financialSummary: featureFlags.hasFinanceFeatures(),
          attendanceSummary: visibility.canShowByPermission(['VIEW_ATTENDANCE']),
          communicationStats: featureFlags.hasCommunicationFeatures(),
          pastoralCareStats: featureFlags.hasPastoralFeatures(),
        };
        return widgets;
      },

      /**
       * Get dashboard layout based on role
       */
      getLayout: () => {
        if (featureFlags.hasAdminFeatures()) {
          return 'admin'; // 3-column admin layout
        }
        if (featureFlags.hasFinanceFeatures()) {
          return 'finance'; // Finance-focused layout
        }
        return 'standard'; // Standard 2-column layout
      },

      /**
       * Get dashboard theme based on role
       */
      getTheme: () => {
        if (featureFlags.hasAdminFeatures()) {
          return 'dark'; // Dark theme for admin
        }
        return 'light'; // Light theme for others
      },

      /**
       * Get dashboard sections to show
       */
      getSections: () => {
        return {
          overview: true,
          members: visibility.canShowByPermission(['VIEW_MEMBERS']),
          finances: visibility.canShowByPermission(['VIEW_FINANCES']),
          attendance: visibility.canShowByPermission(['VIEW_ATTENDANCE']),
          communications: visibility.canShowByPermission(['VIEW_COMMUNICATIONS']),
          pastoral: visibility.canShowByPermission(['MANAGE_PASTORAL_CARE']),
          admin: featureFlags.hasAdminFeatures(),
        };
      },
    }),
    [userRoles, userPermissions],
  );
}

/**
 * Hook for button/action visibility
 */
export function useActionVisibility(
  userPermissions: string[] = [],
  userModules: string[] = [],
) {
  const visibility = useComponentVisibility(userPermissions, userModules);

  return useMemo(
    () => ({
      /**
       * Check if add/create action is visible
       */
      canCreate: (entityType: string) => {
        const permissionMap: Record<string, string[]> = {
          member: ['MANAGE_MEMBERS'],
          group: ['MANAGE_MEMBER_GROUPS'],
          event: ['MANAGE_EVENTS'],
          finance: ['MANAGE_FINANCES'],
          communication: ['MANAGE_COMMUNICATIONS'],
          automation: ['MANAGE_AUTOMATIONS'],
          announcement: ['MANAGE_ANNOUNCEMENTS'],
        };
        return visibility.canShowByPermission(permissionMap[entityType] || []);
      },

      /**
       * Check if edit action is visible
       */
      canEdit: (entityType: string) => {
        const permissionMap: Record<string, string[]> = {
          member: ['MANAGE_MEMBERS'],
          group: ['MANAGE_MEMBER_GROUPS'],
          event: ['MANAGE_EVENTS'],
          finance: ['MANAGE_FINANCES'],
          communication: ['MANAGE_COMMUNICATIONS'],
          automation: ['MANAGE_AUTOMATIONS'],
          announcement: ['MANAGE_ANNOUNCEMENTS'],
        };
        return visibility.canShowByPermission(permissionMap[entityType] || []);
      },

      /**
       * Check if delete action is visible
       */
      canDelete: (entityType: string) => {
        const permissionMap: Record<string, string[]> = {
          member: ['MANAGE_MEMBERS'],
          group: ['MANAGE_MEMBER_GROUPS'],
          event: ['MANAGE_EVENTS'],
          finance: ['MANAGE_FINANCES'],
          communication: ['MANAGE_COMMUNICATIONS'],
          automation: ['MANAGE_AUTOMATIONS'],
          announcement: ['MANAGE_ANNOUNCEMENTS'],
        };
        return visibility.canShowByPermission(permissionMap[entityType] || []);
      },

      /**
       * Check if export action is visible
       */
      canExport: (entityType: string) => {
        return visibility.canShowByPermission(['EXPORT_DATA']);
      },

      /**
       * Check if import action is visible
       */
      canImport: (entityType: string) => {
        return visibility.canShowByPermission(['IMPORT_DATA']);
      },

      /**
       * Get all available actions for entity
       */
      getAvailableActions: (entityType: string) => {
        return {
          create: this.canCreate(entityType),
          edit: this.canEdit(entityType),
          delete: this.canDelete(entityType),
          export: this.canExport(entityType),
          import: this.canImport(entityType),
        };
      },
    }),
    [userPermissions, userModules],
  );
}
