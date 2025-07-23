// Role-Dashboard Configuration
export enum DashboardType {
  PASTORAL = 'PASTORAL',
  ADMIN = 'ADMIN',
  FINANCE = 'FINANCE',
  MINISTRY = 'MINISTRY',
  MEMBER = 'MEMBER',
  BRANCH_ADMIN = 'BRANCH_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface RoleConfig {
  defaultDashboard: DashboardType;
  allowedDashboards: DashboardType[];
  defaultRoute: string;
  allowedRoutes: string[];
}

export const ROLE_DASHBOARD_MAP: Record<string, RoleConfig> = {
  SUPER_ADMIN: {
    defaultDashboard: DashboardType.SUPER_ADMIN,
    allowedDashboards: [DashboardType.SUPER_ADMIN, DashboardType.ADMIN, DashboardType.FINANCE],
    defaultRoute: '/dashboard/super-admin',
    allowedRoutes: ['/dashboard/*', '/admin/*', '/organizations/*']
  },
  BRANCH_ADMIN: {
    defaultDashboard: DashboardType.BRANCH_ADMIN,
    allowedDashboards: [DashboardType.ADMIN, DashboardType.FINANCE, DashboardType.PASTORAL],
    defaultRoute: '/dashboard/branch',
    allowedRoutes: ['/dashboard/*', '/members/*', '/finances/*', '/attendance/*']
  },
  SUBSCRIPTION_MANAGER: {
    defaultDashboard: DashboardType.ADMIN,
    allowedDashboards: [DashboardType.ADMIN],
    defaultRoute: '/dashboard/subscription-manager',
    allowedRoutes: ['/dashboard/subscription-manager/*', '/dashboard/subscriptions/*', '/subscriptions/*']
  },
  FINANCE_MANAGER: {
    defaultDashboard: DashboardType.FINANCE,
    allowedDashboards: [DashboardType.FINANCE],
    defaultRoute: '/dashboard/finance',
    allowedRoutes: ['/dashboard/finance/*', '/finances/*', '/reports/*']
  },
  PASTORAL_STAFF: {
    defaultDashboard: DashboardType.PASTORAL,
    allowedDashboards: [DashboardType.PASTORAL, DashboardType.MINISTRY],
    defaultRoute: '/dashboard/pastoral',
    allowedRoutes: ['/dashboard/pastoral/*', '/members/*', '/pastoral-care/*', '/sacraments/*']
  },
  MINISTRY_LEADER: {
    defaultDashboard: DashboardType.MINISTRY,
    allowedDashboards: [DashboardType.MINISTRY],
    defaultRoute: '/dashboard/ministry',
    allowedRoutes: ['/dashboard/ministry/*', '/groups/*', '/events/*', '/communication/*']
  },
  MEMBER: {
    defaultDashboard: DashboardType.MEMBER,
    allowedDashboards: [DashboardType.MEMBER],
    defaultRoute: '/dashboard/member',
    allowedRoutes: ['/dashboard/member/*', '/profile/*', '/giving/*']
  }
};

export function getDashboardRoute(dashboard: DashboardType): string {
  const routes = {
    [DashboardType.SUPER_ADMIN]: '/dashboard/super-admin',
    [DashboardType.BRANCH_ADMIN]: '/dashboard/branch',
    [DashboardType.ADMIN]: '/dashboard/admin',
    [DashboardType.FINANCE]: '/dashboard/finance',
    [DashboardType.PASTORAL]: '/dashboard/pastoral',
    [DashboardType.MINISTRY]: '/dashboard/ministry',
    [DashboardType.MEMBER]: '/dashboard/member',
  };
  
  return routes[dashboard] || '/dashboard';
}

export function getRoleConfig(role: string): RoleConfig | null {
  return ROLE_DASHBOARD_MAP[role] || null;
}

export function canAccessRoute(userRole: string, route: string): boolean {
  const roleConfig = getRoleConfig(userRole);
  if (!roleConfig) return false;
  
  return roleConfig.allowedRoutes.some(pattern => 
    route.match(new RegExp(pattern.replace('*', '.*')))
  );
}

export function canAccessDashboard(userRole: string, dashboard: DashboardType): boolean {
  const roleConfig = getRoleConfig(userRole);
  if (!roleConfig) return false;
  
  return roleConfig.allowedDashboards.includes(dashboard);
}
