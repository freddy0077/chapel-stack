/**
 * Navigation Builder - Dynamically build navigation based on enabled modules
 * This utility generates sidebar, breadcrumb, and menu items based on module registry
 */

import { ModuleConfig } from './moduleRegistry';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  children?: NavItem[];
  badge?: number;
  disabled?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/**
 * Build sidebar navigation from enabled modules
 */
export function buildSidebarNavigation(modules: ModuleConfig[]): NavGroup[] {
  const enabledModules = modules.filter((m) => m.enabled && m.category !== 'Shared');

  // Group modules by category
  const adminModules = enabledModules.filter((m) => m.category === 'Admin');
  const coreModules = enabledModules.filter((m) => m.category === 'Core');

  const groups: NavGroup[] = [];

  // Add admin group
  if (adminModules.length > 0) {
    groups.push({
      title: 'Administration',
      items: adminModules.map((m) => ({
        id: m.id,
        label: m.name,
        href: m.path,
        icon: m.icon,
      })),
    });
  }

  // Add core modules grouped by type
  if (coreModules.length > 0) {
    // Member Management
    const memberModules = coreModules.filter((m) =>
      ['members', 'member', 'families', 'groups', 'volunteers', 'children', 'user-management'].includes(m.id)
    );
    if (memberModules.length > 0) {
      groups.push({
        title: 'Members',
        items: memberModules.map((m) => ({
          id: m.id,
          label: m.name,
          href: m.path,
          icon: m.icon,
        })),
      });
    }

    // Financial Management
    const financeModules = coreModules.filter((m) =>
      ['finances', 'branch-finances', 'subscription-manager'].includes(m.id)
    );
    if (financeModules.length > 0) {
      groups.push({
        title: 'Finances',
        items: financeModules.map((m) => ({
          id: m.id,
          label: m.name,
          href: m.path,
          icon: m.icon,
        })),
      });
    }

    // Events & Activities
    const eventModules = coreModules.filter((m) =>
      ['events', 'calendar', 'attendance', 'pastoral-care', 'prayer-requests', 'worship'].includes(m.id)
    );
    if (eventModules.length > 0) {
      groups.push({
        title: 'Events & Activities',
        items: eventModules.map((m) => ({
          id: m.id,
          label: m.name,
          href: m.path,
          icon: m.icon,
        })),
      });
    }

    // Communication
    const commModules = coreModules.filter((m) =>
      ['communication', 'broadcasts', 'notifications', 'sermons'].includes(m.id)
    );
    if (commModules.length > 0) {
      groups.push({
        title: 'Communication',
        items: commModules.map((m) => ({
          id: m.id,
          label: m.name,
          href: m.path,
          icon: m.icon,
        })),
      });
    }

    // Sacraments & Registries
    const sacramentModules = coreModules.filter((m) =>
      ['sacraments', 'birth-registry', 'death-register'].includes(m.id)
    );
    if (sacramentModules.length > 0) {
      groups.push({
        title: 'Sacraments & Registries',
        items: sacramentModules.map((m) => ({
          id: m.id,
          label: m.name,
          href: m.path,
          icon: m.icon,
        })),
      });
    }

    // Organization
    const orgModules = coreModules.filter((m) =>
      ['admin', 'branches', 'branch', 'branch-admin', 'zones', 'ministries'].includes(m.id)
    );
    if (orgModules.length > 0) {
      groups.push({
        title: 'Organization',
        items: orgModules.map((m) => ({
          id: m.id,
          label: m.name,
          href: m.path,
          icon: m.icon,
        })),
      });
    }

    // Reporting & Analytics
    const reportModules = coreModules.filter((m) =>
      ['analytics', 'reports', 'report-builder', 'audits'].includes(m.id)
    );
    if (reportModules.length > 0) {
      groups.push({
        title: 'Reporting & Analytics',
        items: reportModules.map((m) => ({
          id: m.id,
          label: m.name,
          href: m.path,
          icon: m.icon,
        })),
      });
    }

    // Content & Integration
    const contentModules = coreModules.filter((m) =>
      ['cms', 'website-integration', 'mobile-integration', 'workflows'].includes(m.id)
    );
    if (contentModules.length > 0) {
      groups.push({
        title: 'Content & Integration',
        items: contentModules.map((m) => ({
          id: m.id,
          label: m.name,
          href: m.path,
          icon: m.icon,
        })),
      });
    }

    // Assets & Settings
    const settingsModules = coreModules.filter((m) =>
      ['assets', 'settings', 'profile'].includes(m.id)
    );
    if (settingsModules.length > 0) {
      groups.push({
        title: 'Assets & Settings',
        items: settingsModules.map((m) => ({
          id: m.id,
          label: m.name,
          href: m.path,
          icon: m.icon,
        })),
      });
    }
  }

  return groups;
}

/**
 * Build branch admin navigation (limited modules)
 */
export function buildBranchAdminNavigation(modules: ModuleConfig[]): NavGroup[] {
  const enabledModules = modules.filter(
    (m) =>
      m.enabled &&
      m.category === 'Core' &&
      !['admin', 'god-mode', 'super-admin', 'user-management', 'audits'].includes(m.id)
  );

  return buildSidebarNavigation(enabledModules);
}

/**
 * Check if a route should be accessible based on enabled modules
 */
export function isRouteAccessible(path: string, modules: ModuleConfig[]): boolean {
  const enabledModules = modules.filter((m) => m.enabled);
  return enabledModules.some((m) => m.path === path);
}

/**
 * Get module for a given route
 */
export function getModuleForRoute(path: string, modules: ModuleConfig[]): ModuleConfig | undefined {
  return modules.find((m) => m.path === path);
}

/**
 * Get breadcrumb for a route
 */
export function getBreadcrumb(path: string, modules: ModuleConfig[]): Array<{ label: string; href: string }> {
  const module = getModuleForRoute(path, modules);
  if (!module) return [];

  const breadcrumb: Array<{ label: string; href: string }> = [
    { label: 'Dashboard', href: '/dashboard' },
  ];

  if (module.category === 'Admin') {
    breadcrumb.push({ label: 'Administration', href: '#' });
  }

  breadcrumb.push({ label: module.name, href: module.path });

  return breadcrumb;
}
