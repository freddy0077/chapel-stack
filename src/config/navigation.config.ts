import {
  HomeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  PhotoIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  BoltIcon,
  HeartIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  badge?: string | null;
  moduleId?: string;
  description?: string;
}

export interface NavigationCategory {
  category: string;
  items: NavigationItem[];
}

// Base navigation items available to all roles
export const baseNavigation: NavigationCategory[] = [
  {
    category: "Main",
    items: [
      { 
        name: "Dashboard", 
        href: "/dashboard", 
        icon: HomeIcon, 
        badge: null,
        moduleId: "dashboard"
      },
    ]
  }
];

// Role-specific navigation configurations
export const roleNavigationConfig: Record<string, NavigationCategory[]> = {
  SUPER_ADMIN: [
    {
      category: "Main",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: HomeIcon, moduleId: "dashboard" },
      ]
    },
    {
      category: "Community",
      items: [
        { name: "Members", href: "/dashboard/members", icon: UsersIcon, moduleId: "members" },
        { name: "Groups", href: "/dashboard/groups", icon: UserGroupIcon, moduleId: "groups" },
        { name: "Events", href: "/dashboard/calendar", icon: CalendarIcon, moduleId: "events" },
      ]
    },
    {
      category: "Operations",
      items: [
        { name: "Finances", href: "/dashboard/finances", icon: CurrencyDollarIcon, moduleId: "finances" },
        { name: "Attendance", href: "/dashboard/attendance", icon: DocumentTextIcon, moduleId: "attendance" },
        { name: "Communication", href: "/dashboard/communication", icon: ChatBubbleLeftRightIcon, moduleId: "communication" },
        { name: "Reports", href: "/dashboard/reports", icon: ChartBarIcon, moduleId: "reports" },
        { name: "Workflows", href: "/dashboard/workflows", icon: BoltIcon, moduleId: "workflows" },
      ]
    },
    {
      category: "Ministry",
      items: [
        { name: "Pastoral Care", href: "/dashboard/pastoral-care", icon: HeartIcon, moduleId: "pastoral_care" },
        { name: "Sacraments", href: "/dashboard/sacraments", icon: PhotoIcon, moduleId: "sacraments" },
        { name: "Sermons", href: "/dashboard/sermons", icon: DevicePhoneMobileIcon, moduleId: "sermons" },
      ]
    },
    {
      category: "Subscription Management",
      items: [
        { name: "Organizations", href: "/subscriptions/organisations", icon: BuildingOfficeIcon, moduleId: "subscription_organizations" },
        { name: "Billing", href: "/subscriptions/billing", icon: CurrencyDollarIcon, moduleId: "subscription_billing" },
      ]
    },
    {
      category: "Administration",
      items: [
        { name: "Branches", href: "/admin/branches", icon: GlobeAltIcon, moduleId: "branches" },
        { name: "Staff", href: "/admin/staff", icon: ShieldCheckIcon, moduleId: "staff" },
        { name: "Settings", href: "/admin/settings", icon: Cog6ToothIcon, moduleId: "settings" },
      ]
    }
  ],

  SUBSCRIPTION_MANAGER: [
    {
      category: "Main",
      items: [
        { name: "Dashboard", href: "/dashboard/subscription", icon: HomeIcon, moduleId: "dashboard" },
      ]
    },
    {
      category: "Subscription Management",
      items: [
        { name: "Organizations", href: "/subscriptions/organisations", icon: BuildingOfficeIcon, moduleId: "subscription_organizations" },
        { name: "Billing", href: "/subscriptions/billing", icon: CurrencyDollarIcon, moduleId: "subscription_billing" },
        { name: "Analytics", href: "/subscriptions/analytics", icon: ChartBarIcon, moduleId: "subscription_analytics" },
        { name: "Plans", href: "/subscriptions/plans", icon: DocumentTextIcon, moduleId: "subscription_plans" },
      ]
    },
    {
      category: "Operations",
      items: [
        { name: "Reports", href: "/subscriptions/reports", icon: ChartBarIcon, moduleId: "subscription_reports" },
        { name: "Support", href: "/subscriptions/support", icon: ChatBubbleLeftRightIcon, moduleId: "subscription_support" },
      ]
    }
  ],

  BRANCH_ADMIN: [
    {
      category: "Main",
      items: [
        { name: "Dashboard", href: "/dashboard/branch", icon: HomeIcon, moduleId: "dashboard" },
      ]
    },
    {
      category: "Community",
      items: [
        { name: "Members", href: "/dashboard/members", icon: UsersIcon, moduleId: "members" },
        { name: "Groups", href: "/dashboard/groups", icon: UserGroupIcon, moduleId: "groups" },
        { name: "Events", href: "/dashboard/calendar", icon: CalendarIcon, moduleId: "events" },
      ]
    },
    {
      category: "Operations",
      items: [
        { name: "Branch Finances", href: "/dashboard/branch-finances", icon: CurrencyDollarIcon, moduleId: "branch-finances" },
        { name: "Attendance", href: "/dashboard/attendance", icon: DocumentTextIcon, moduleId: "attendance" },
        { name: "Communication", href: "/dashboard/communication", icon: ChatBubbleLeftRightIcon, moduleId: "communication" },
      ]
    },
    {
      category: "Ministry",
      items: [
        { name: "Pastoral Care", href: "/dashboard/pastoral-care", icon: HeartIcon, moduleId: "pastoral_care" },
        { name: "Sacraments", href: "/dashboard/sacraments", icon: PhotoIcon, moduleId: "sacraments" },
      ]
    }
  ],

  ADMIN: [
    {
      category: "Main",
      items: [
        { name: "Dashboard", href: "/dashboard/admin", icon: HomeIcon, moduleId: "dashboard" },
      ]
    },
    {
      category: "Community",
      items: [
        { name: "Members", href: "/dashboard/members", icon: UsersIcon, moduleId: "members" },
        { name: "Groups", href: "/dashboard/groups", icon: UserGroupIcon, moduleId: "groups" },
        { name: "Events", href: "/dashboard/calendar", icon: CalendarIcon, moduleId: "events" },
      ]
    },
    {
      category: "Operations",
      items: [
        { name: "Finances", href: "/dashboard/finances", icon: CurrencyDollarIcon, moduleId: "finances" },
        { name: "Attendance", href: "/dashboard/attendance", icon: DocumentTextIcon, moduleId: "attendance" },
        { name: "Communication", href: "/dashboard/communication", icon: ChatBubbleLeftRightIcon, moduleId: "communication" },
        { name: "Reports", href: "/dashboard/reports", icon: ChartBarIcon, moduleId: "reports" },
      ]
    },
    {
      category: "Settings",
      items: [
        { name: "Branch Settings", href: "/admin/settings", icon: Cog6ToothIcon, moduleId: "settings" },
      ]
    }
  ],

  FINANCE_MANAGER: [
    {
      category: "Main",
      items: [
        { name: "Dashboard", href: "/dashboard/finance", icon: HomeIcon, moduleId: "dashboard" },
      ]
    },
    {
      category: "Financial Management",
      items: [
        { name: "Finances", href: "/finances", icon: CurrencyDollarIcon, moduleId: "finances" },
        { name: "Reports", href: "/finances/reports", icon: ChartBarIcon, moduleId: "reports" },
        { name: "Budgets", href: "/finances/budgets", icon: DocumentTextIcon, moduleId: "budgets" },
        { name: "Donations", href: "/finances/donations", icon: HeartIcon, moduleId: "donations" },
      ]
    }
  ],

  PASTORAL_STAFF: [
    {
      category: "Main",
      items: [
        { name: "Dashboard", href: "/dashboard/pastoral", icon: HomeIcon, moduleId: "dashboard" },
      ]
    },
    {
      category: "Ministry",
      items: [
        { name: "Members", href: "/dashboard/members", icon: UsersIcon, moduleId: "members" },
        { name: "Pastoral Care", href: "/dashboard/pastoral-care", icon: HeartIcon, moduleId: "pastoral_care" },
        { name: "Sacraments", href: "/dashboard/sacraments", icon: PhotoIcon, moduleId: "sacraments" },
        { name: "Events", href: "/events", icon: CalendarIcon, moduleId: "events" },
      ]
    },
    {
      category: "Communication",
      items: [
        { name: "Messages", href: "/communication", icon: ChatBubbleLeftRightIcon, moduleId: "communication" },
      ]
    }
  ],

  MINISTRY_LEADER: [
    {
      category: "Main",
      items: [
        { name: "Dashboard", href: "/dashboard/ministry", icon: HomeIcon, moduleId: "dashboard" },
      ]
    },
    {
      category: "Ministry",
      items: [
        { name: "Groups", href: "/groups", icon: UserGroupIcon, moduleId: "groups" },
        { name: "Events", href: "/events", icon: CalendarIcon, moduleId: "events" },
        { name: "Members", href: "/members", icon: UsersIcon, moduleId: "members" },
      ]
    }
  ],

  MEMBER: [
    {
      category: "Main",
      items: [
        { name: "Dashboard", href: "/dashboard/member", icon: HomeIcon, moduleId: "dashboard" },
        { name: "My Profile", href: "/member/profile", icon: UsersIcon, moduleId: "profile" },
        { name: "Events", href: "/member/events", icon: CalendarIcon, moduleId: "events" },
        { name: "Groups", href: "/member/groups", icon: UserGroupIcon, moduleId: "groups" },
      ]
    }
  ]
};

// Utility function to get navigation for a specific role
export function getNavigationForRole(role: string): NavigationCategory[] {
  return roleNavigationConfig[role] || roleNavigationConfig.MEMBER;
}

// Utility function to check if a user can access a specific navigation item
export function canAccessNavigationItem(userRole: string, href: string): boolean {
  const navigation = getNavigationForRole(userRole);
  
  for (const category of navigation) {
    for (const item of category.items) {
      if (item.href === href) {
        return true;
      }
    }
  }
  
  return false;
}

// Utility function to get all accessible routes for a role
export function getAccessibleRoutes(role: string): string[] {
  const navigation = getNavigationForRole(role);
  const routes: string[] = [];
  
  for (const category of navigation) {
    for (const item of category.items) {
      routes.push(item.href);
    }
  }
  
  return routes;
}
