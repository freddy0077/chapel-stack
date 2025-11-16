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
  MicrophoneIcon,
  UserMinusIcon,
  UserPlusIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  EnvelopeIcon,
  GiftIcon,
  LockClosedIcon,
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
        moduleId: "dashboard",
      },
    ],
  },
];

// Role-specific navigation configurations
export const roleNavigationConfig: Record<string, NavigationCategory[]> = {
  GOD_MODE: [
    {
      category: "Main",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard/god-mode",
          icon: HomeIcon,
          // moduleId: "dashboard",
        },
      ],
    },
    {
      category: "System Management",
      items: [
        {
          name: "Role Assignment",
          href: "/dashboard/god-mode/role-assignment",
          icon: ShieldCheckIcon,
          description: "Manage role assignments for users",
        },
        {
          name: "Permission Assignment",
          href: "/dashboard/god-mode/permission-assignment",
          icon: LockClosedIcon,
          description: "Manage permission assignments for roles",
        },
        {
          name: "Audit Logs",
          href: "/dashboard/god-mode/audit-logs",
          icon: ClipboardDocumentListIcon,
          description: "View system audit logs",
        },
        {
          name: "System Config",
          href: "/dashboard/god-mode/config",
          icon: Cog6ToothIcon,
          description: "Configure system settings",
        },
      ],
    },
    {
      category: "Administration",
      items: [
        {
          name: "Organizations",
          href: "/dashboard/god-mode/organizations",
          icon: BuildingOfficeIcon,
          description: "Manage organizations and their branches",
        },
        {
          name: "Users",
          href: "/dashboard/god-mode/users",
          icon: UsersIcon,
          description: "Manage system users",
        },
      ],
    },
    {
      category: "Phase 1: Core Pages",
      items: [
        {
          name: "Licenses",
          href: "/dashboard/god-mode/licenses",
          icon: LockClosedIcon,
          description: "Manage system licenses",
        },
        {
          name: "Subscriptions",
          href: "/dashboard/god-mode/subscriptions",
          icon: CurrencyDollarIcon,
          description: "Manage subscriptions and billing",
        },
        {
          name: "Backups",
          href: "/dashboard/god-mode/backups",
          icon: CubeIcon,
          description: "Manage system backups",
        },
      ],
    },
    {
      category: "Phase 3: Advanced",
      items: [
        {
          name: "Data Operations",
          href: "/dashboard/god-mode/data-operations",
          icon: BoltIcon,
          description: "Import, export, and bulk operations",
        },
        {
          name: "Module Settings",
          href: "/dashboard/god-mode/module-settings",
          icon: Cog6ToothIcon,
          description: "Enable/disable modules and configure",
        },
      ],
    },
  ],

  SYSTEM_ADMIN: [
    {
      category: "Main",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard/god-mode",
          icon: HomeIcon,
          moduleId: "dashboard",
        },
      ],
    },
    {
      category: "System Management",
      items: [
        {
          name: "Role Assignment",
          href: "/dashboard/god-mode/role-assignment",
          icon: ShieldCheckIcon,
        },
        {
          name: "Permission Assignment",
          href: "/dashboard/god-mode/permission-assignment",
          icon: LockClosedIcon,
        },
        {
          name: "Audit Logs",
          href: "/dashboard/god-mode/audit-logs",
          icon: ClipboardDocumentListIcon,
        },
      ],
    },
    {
      category: "Administration",
      items: [
        {
          name: "Organizations",
          href: "/dashboard/god-mode/organizations",
          icon: BuildingOfficeIcon,
          description: "Manage organizations and their branches",
        },
        {
          name: "Users",
          href: "/dashboard/god-mode/users",
          icon: UsersIcon,
          description: "Manage system users",
        },
      ],
    },
  ],

  ADMIN: [
    {
      category: "Administration",
      items: [
        {
          name: "Subscription Manager",
          href: "/dashboard/subscription-manager",
          icon: BuildingOfficeIcon,
          moduleId: "subscription_manager",
        },
        {
          name: "Organizations",
          href: "/subscriptions/organisations",
          icon: BuildingOfficeIcon,
          moduleId: "subscription_organizations",
        },
        {
          name: "Billing",
          href: "/subscriptions/billing",
          icon: CurrencyDollarIcon,
          moduleId: "subscription_billing",
        },
        {
          name: "Branches",
          href: "/dashboard/branches",
          icon: GlobeAltIcon,
          moduleId: "branches",
        },
        {
          name: "Staff",
          href: "/dashboard/admin/staff",
          icon: ShieldCheckIcon,
          moduleId: "staff",
        },
      ],
    },
  ],

  SUBSCRIPTION_MANAGER: [
    {
      category: "Main",
      items: [
        {
          name: "Subscription Dashboard",
          href: "/dashboard/subscription-manager",
          icon: HomeIcon,
          moduleId: "subscription_dashboard",
        },
      ],
    },
  ],

  BRANCH_ADMIN: [
    {
      category: "Main",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard/branch",
          icon: HomeIcon,
          moduleId: "dashboard",
        },
        // {
        //   name: "My Profile",
        //   href: "/dashboard/profile",
        //   icon: UsersIcon,
        //   moduleId: "profile",
        // },
      ],
    },
    {
      category: "Community",
      items: [
        {
          name: "Members",
          href: "/dashboard/members",
          icon: UsersIcon,
          moduleId: "members",
        },
        {
          name: "Groups",
          href: "/dashboard/groups",
          icon: UserGroupIcon,
          moduleId: "groups",
        },
        {
          name: "Events",
          href: "/dashboard/calendar",
          icon: CalendarIcon,
          moduleId: "events",
        },
      ],
    },
    {
      category: "Operations",
      items: [
        {
          name: "Branch Finances",
          href: "/dashboard/branch-finances",
          icon: CurrencyDollarIcon,
          moduleId: "branch-finances",
        },
        // {
        //   name: "Assets",
        //   href: "/dashboard/assets",
        //   icon: CubeIcon,
        //   moduleId: "dashboard",
        // },
        {
          name: "Attendance",
          href: "/dashboard/attendance",
          icon: DocumentTextIcon,
          moduleId: "attendance",
        },
        {
          name: "Report Builder",
          href: "/dashboard/report-builder",
          icon: ChartBarIcon,
          moduleId: "report-builder",
        },
        {
          name: "Communication",
          href: "/dashboard/communication",
          icon: ChatBubbleLeftRightIcon,
          moduleId: "communication",
        },
        {
          name: "Broadcasts",
          href: "/dashboard/broadcasts",
          icon: MicrophoneIcon,
          moduleId: "broadcasts",
        },
      ],
    },
    {
      category: "Administration",
      items: [
        {
          name: "User Management",
          href: "/dashboard/user-management",
          icon: ShieldCheckIcon,
          moduleId: "user_management",
        },
        {
          name: "Zones",
          href: "/dashboard/zones",
          icon: GlobeAltIcon,
          moduleId: "zones",
        },
        {
          name: "Audits",
          href: "/dashboard/audits",
          icon: ClipboardDocumentListIcon,
          moduleId: "audits",
        },
        {
          name: "Settings",
          href: "/dashboard/settings",
          icon: Cog6ToothIcon,
          moduleId: "settings",
        },
      ],
    },
    {
      category: "Ministry",
      items: [
        {
          name: "Pastoral Care",
          href: "/dashboard/pastoral-care",
          icon: HeartIcon,
          moduleId: "pastoral_care",
        },
        {
          name: "Death Register",
          href: "/dashboard/death-register",
          icon: UserMinusIcon,
          moduleId: "death-registry",
        },
        {
          name: "Birth Registry",
          href: "/dashboard/birth-registry",
          icon: UserPlusIcon,
          moduleId: "birth-registry",
        },
        {
          name: "Sacraments",
          href: "/dashboard/sacraments",
          icon: PhotoIcon,
          moduleId: "sacraments",
        },
        {
          name: "Sermons",
          href: "/dashboard/sermons",
          icon: MicrophoneIcon,
          moduleId: "sermons",
        },
        // {
        //   name: "Branch Finances",
        //   href: "/dashboard/branch-finances",
        //   icon: CurrencyDollarIcon,
        //   moduleId: "finances",
        // },
      ],
    },
  ],

  ADMIN: [
    {
      category: "Main",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard/admin",
          icon: HomeIcon,
          moduleId: "dashboard",
        },
        {
          name: "My Profile",
          href: "/dashboard/profile",
          icon: UsersIcon,
          moduleId: "profile",
        },
      ],
    },
    {
      category: "Community",
      items: [
        {
          name: "Members",
          href: "/dashboard/members",
          icon: UsersIcon,
          moduleId: "members",
        },
        {
          name: "Groups",
          href: "/dashboard/groups",
          icon: UserGroupIcon,
          moduleId: "groups",
        },
        {
          name: "Events",
          href: "/dashboard/calendar",
          icon: CalendarIcon,
          moduleId: "events",
        },
      ],
    },
    {
      category: "Operations",
      items: [
        {
          name: "Finances",
          href: "/dashboard/finances",
          icon: CurrencyDollarIcon,
          moduleId: "finances",
        },
        // {
        //   name: "Assets",
        //   href: "/dashboard/assets",
        //   icon: CubeIcon,
        //   moduleId: "assets",
        // },
        {
          name: "Attendance",
          href: "/dashboard/attendance",
          icon: DocumentTextIcon,
          moduleId: "attendance",
        },
        {
          name: "Report Builder",
          href: "/dashboard/report-builder",
          icon: ChartBarIcon,
          moduleId: "report-builder",
        },
        {
          name: "Communication",
          href: "/dashboard/communication",
          icon: ChatBubbleLeftRightIcon,
          moduleId: "communication",
        },
      ],
    },
    // Removed Settings menu for ADMIN role per requirement
  ],

  FINANCE_MANAGER: [
    {
      category: "Main",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard/finance",
          icon: HomeIcon,
          moduleId: "dashboard",
        },
      ],
    },
    {
      category: "Financial Management",
      items: [
        {
          name: "Finances",
          href: "/finances",
          icon: CurrencyDollarIcon,
          moduleId: "finances",
        },
        {
          name: "Budgets",
          href: "/finances/budgets",
          icon: DocumentTextIcon,
          moduleId: "budgets",
        },
        {
          name: "Donations",
          href: "/finances/donations",
          icon: HeartIcon,
          moduleId: "donations",
        },
      ],
    },
  ],

  PASTORAL_STAFF: [
    {
      category: "Main",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard/pastoral",
          icon: HomeIcon,
          moduleId: "dashboard",
        },
      ],
    },
    {
      category: "Ministry",
      items: [
        {
          name: "Members",
          href: "/dashboard/members",
          icon: UsersIcon,
          moduleId: "members",
        },
        {
          name: "Pastoral Care",
          href: "/dashboard/pastoral-care",
          icon: HeartIcon,
          moduleId: "pastoral_care",
        },
        {
          name: "Birth Registry",
          href: "/dashboard/birth-registry",
          icon: UserPlusIcon,
          moduleId: "pastoral_care",
        },
        {
          name: "Sacraments",
          href: "/dashboard/sacraments",
          icon: PhotoIcon,
          moduleId: "sacraments",
        },
        {
          name: "Events",
          href: "/events",
          icon: CalendarIcon,
          moduleId: "events",
        },
      ],
    },
    {
      category: "Communication",
      items: [
        {
          name: "Messages",
          href: "/communication",
          icon: ChatBubbleLeftRightIcon,
          moduleId: "communication",
        },
      ],
    },
  ],

  MINISTRY_LEADER: [
    {
      category: "Main",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard/ministry",
          icon: HomeIcon,
          moduleId: "dashboard",
        },
      ],
    },
    {
      category: "Ministry",
      items: [
        {
          name: "Groups",
          href: "/groups",
          icon: UserGroupIcon,
          moduleId: "groups",
        },
        {
          name: "Events",
          href: "/events",
          icon: CalendarIcon,
          moduleId: "events",
        },
        {
          name: "Members",
          href: "/members",
          icon: UsersIcon,
          moduleId: "members",
        },
      ],
    },
  ],

  MEMBER: [
    {
      category: "Main",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard/member",
          icon: HomeIcon,
          moduleId: "dashboard",
        },
        {
          name: "My Profile",
          href: "/member/profile",
          icon: UsersIcon,
          moduleId: "profile",
        },
      ],
    },
    {
      category: "Community",
      items: [
        {
          name: "Events",
          href: "/member/events",
          icon: CalendarIcon,
          moduleId: "events",
        },
        {
          name: "Groups",
          href: "/member/groups",
          icon: UserGroupIcon,
          moduleId: "groups",
        },
        {
          name: "Announcements",
          href: "/member/announcements",
          icon: EnvelopeIcon,
          moduleId: "announcements",
        },
      ],
    },
    {
      category: "Personal",
      items: [
        {
          name: "Give / Donate",
          href: "/member/give",
          icon: GiftIcon,
          moduleId: "giving",
        },
        {
          name: "Prayer Requests",
          href: "/member/prayer-requests",
          icon: HeartIcon,
          moduleId: "prayer",
        },
      ],
    },
  ],
};

// Utility function to get navigation for a specific role
export function getNavigationForRole(role: string): NavigationCategory[] {
  if (!roleNavigationConfig[role]) {
    console.warn(
      `[Navigation] Role "${role}" not found in navigation config. ` +
      `Available roles: ${Object.keys(roleNavigationConfig).join(', ')}. ` +
      `Defaulting to MEMBER navigation.`
    );
  }
  return roleNavigationConfig[role] || roleNavigationConfig.MEMBER;
}

// Utility function to check if a user can access a specific navigation item
export function canAccessNavigationItem(
  userRole: string,
  href: string,
): boolean {
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
