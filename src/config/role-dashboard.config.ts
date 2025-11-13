// Role-Dashboard Configuration
export enum DashboardType {
  PASTORAL = "PASTORAL",
  ADMIN = "ADMIN",
  FINANCE = "FINANCE",
  MINISTRY = "MINISTRY",
  MEMBER = "MEMBER",
  BRANCH_ADMIN = "BRANCH_ADMIN",
  ADMIN = "ADMIN",
}

export interface RoleConfig {
  defaultDashboard: DashboardType;
  allowedDashboards: DashboardType[];
  defaultRoute: string;
  allowedRoutes: string[];
}

export const ROLE_DASHBOARD_MAP: Record<string, RoleConfig> = {
  ADMIN: {
    defaultDashboard: DashboardType.ADMIN,
    allowedDashboards: [
      DashboardType.ADMIN,
      DashboardType.ADMIN,
      DashboardType.FINANCE,
    ],
    defaultRoute: "/dashboard/super-admin",
    allowedRoutes: ["/dashboard/*", "/admin/*", "/organizations/*"],
  },
  BRANCH_ADMIN: {
    defaultDashboard: DashboardType.BRANCH_ADMIN,
    allowedDashboards: [
      DashboardType.ADMIN,
      DashboardType.FINANCE,
      DashboardType.PASTORAL,
    ],
    defaultRoute: "/dashboard/branch",
    allowedRoutes: [
      "/dashboard/branch",
      "/dashboard/branch/*",
      "/dashboard/user-management",
      "/dashboard/user-management/*",
      "/dashboard/members",
      "/dashboard/members/*",
      "/dashboard/groups",
      "/dashboard/groups/*",
      "/dashboard/calendar",
      "/dashboard/calendar/*",
      "/dashboard/branch-finances",
      "/dashboard/branch-finances/*",
      "/dashboard/assets",
      "/dashboard/assets/*",
      "/dashboard/attendance",
      "/dashboard/attendance/*",
      "/dashboard/report-builder",
      "/dashboard/report-builder/*",
      "/dashboard/communication",
      "/dashboard/communication/*",
      "/dashboard/pastoral-care",
      "/dashboard/pastoral-care/*",
      "/dashboard/death-register",
      "/dashboard/death-register/*",
      "/dashboard/birth-registry",
      "/dashboard/birth-registry/*",
      "/dashboard/sacraments",
      "/dashboard/sacraments/*",
      "/dashboard/sermons",
      "/dashboard/sermons/*",
      "/members/*",
      "/finances/*",
      "/attendance/*",
    ],
  },
  SUBSCRIPTION_MANAGER: {
    defaultDashboard: DashboardType.ADMIN,
    allowedDashboards: [DashboardType.ADMIN],
    defaultRoute: "/dashboard/subscription-manager",
    allowedRoutes: [
      "/dashboard/subscription-manager/*",
      "/dashboard/subscriptions/*",
      "/subscriptions/*",
    ],
  },
  FINANCE_MANAGER: {
    defaultDashboard: DashboardType.FINANCE,
    allowedDashboards: [DashboardType.FINANCE],
    defaultRoute: "/dashboard/finance",
    allowedRoutes: ["/dashboard/finance/*", "/finances/*", "/reports/*"],
  },
  PASTORAL_STAFF: {
    defaultDashboard: DashboardType.PASTORAL,
    allowedDashboards: [DashboardType.PASTORAL, DashboardType.MINISTRY],
    defaultRoute: "/dashboard/pastoral",
    allowedRoutes: [
      "/dashboard/pastoral/*",
      "/members/*",
      "/pastoral-care/*",
      "/sacraments/*",
    ],
  },
  MINISTRY_LEADER: {
    defaultDashboard: DashboardType.MINISTRY,
    allowedDashboards: [DashboardType.MINISTRY],
    defaultRoute: "/dashboard/ministry",
    allowedRoutes: [
      "/dashboard/ministry/*",
      "/groups/*",
      "/events/*",
      "/communication/*",
    ],
  },
  MEMBER: {
    defaultDashboard: DashboardType.MEMBER,
    allowedDashboards: [DashboardType.MEMBER],
    defaultRoute: "/dashboard/member",
    allowedRoutes: [
      "/dashboard/member",
      "/dashboard/member/*",
      "/member/profile",
      "/member/profile/*",
      "/member/events",
      "/member/events/*",
      "/member/groups",
      "/member/groups/*",
      "/member/announcements",
      "/member/announcements/*",
      "/member/give",
      "/member/give/*",
      "/member/prayer-requests",
      "/member/prayer-requests/*",
    ],
  },
};

export function getDashboardRoute(dashboard: DashboardType): string {
  const routes = {
    [DashboardType.ADMIN]: "/dashboard/super-admin",
    [DashboardType.BRANCH_ADMIN]: "/dashboard/branch",
    [DashboardType.ADMIN]: "/dashboard/admin",
    [DashboardType.FINANCE]: "/dashboard/finance",
    [DashboardType.PASTORAL]: "/dashboard/pastoral",
    [DashboardType.MINISTRY]: "/dashboard/ministry",
    [DashboardType.MEMBER]: "/dashboard/member",
  };

  return routes[dashboard] || "/dashboard";
}

export function getRoleConfig(role: string): RoleConfig | null {
  return ROLE_DASHBOARD_MAP[role] || null;
}

export function canAccessRoute(route: string, userRole: string): boolean {
  const roleConfig = getRoleConfig(userRole);
  if (!roleConfig) return false;

  return roleConfig.allowedRoutes.some((pattern) => {
    // Convert wildcard pattern to regex
    // Escape special regex characters except *
    const regexPattern = pattern
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')  // Escape special chars
      .replace(/\*/g, '.*');  // Convert * to .*
    
    // Add anchors to match the entire route
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(route);
  });
}

export function canAccessDashboard(
  userRole: string,
  dashboard: DashboardType,
): boolean {
  const roleConfig = getRoleConfig(userRole);
  if (!roleConfig) return false;

  return roleConfig.allowedDashboards.includes(dashboard);
}
