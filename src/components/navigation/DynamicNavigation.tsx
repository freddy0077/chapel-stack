"use client";

import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { usePermissions } from "@/hooks/usePermissions";
import { useModulePreferences } from "@/hooks/useModulePreferences";
import { useModuleContext } from "@/context/ModuleContext";
import { Bars3Icon, XMarkIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
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
  CreditCardIcon,
  UserMinusIcon,
  UserPlusIcon,
  CubeIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

import { isModuleEnabled } from "../onboarding/ModulePreferences";
import { getNavigationForRole, roleNavigationConfig } from "@/config/navigation.config";
import { getUserNavigation } from "@/utils/navigation.utils";

// The full navigation structure with module dependencies
const fullNavigation = [
  {
    category: "Main",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: HomeIcon,
        badge: null,
        moduleId: "dashboard", // Always visible (required module)
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
        badge: null,
        moduleId: "members",
      },
      {
        name: "Groups",
        href: "/dashboard/groups",
        icon: UserGroupIcon,
        badge: null,
        moduleId: "groups",
      },
      // HIDE Children menu item
      // {
      //   name: "Children",
      //   href: "/dashboard/children",
      //   icon: UserCircleIcon,
      //   badge: null,
      //   moduleId: "members"
      // },
      // {
      //   name: "Prayer Requests",
      //   href: "/dashboard/prayer-requests",
      //   icon: ChatBubbleLeftRightIcon,
      //   badge: null,
      //   moduleId: "members"
      // },
      {
        name: "Communication",
        href: "/dashboard/communication",
        icon: ChatBubbleLeftRightIcon,
        badge: null,
        moduleId: "communication",
      },
      {
        name: "Pastoral Care",
        href: "/dashboard/pastoral-care",
        icon: HeartIcon,
        badge: null,
        moduleId: "pastoral-care",
      },
      {
        name: "Death Register",
        href: "/dashboard/death-register",
        icon: UserMinusIcon,
        badge: null,
        moduleId: "death-registry",
      },
      {
        name: "Birth Registry",
        href: "/dashboard/birth-registry",
        icon: UserPlusIcon,
        badge: null,
        moduleId: "birth-registry",
      },
    ],
  },
  {
    category: "Activities",
    items: [
      {
        name: "Calendar",
        href: "/dashboard/calendar",
        icon: CalendarIcon,
        // badge: { count: 3, color: "bg-blue-500" },
        moduleId: "events",
      },
      {
        name: "Attendance",
        href: "/dashboard/attendance",
        icon: ChartBarIcon,
        badge: null,
        moduleId: "attendance",
      },
      // {
      //   name: "Check-in",
      //   href: "/dashboard/attendance/check-in",
      //   icon: UserCircleIcon,
      //   badge: { count: 12, color: "bg-green-500" },
      //   moduleId: "attendance"
      // },
      // {
      //   name: "Sacraments",
      //   href: "/dashboard/sacraments",
      //   icon: DocumentTextIcon,
      //   // badge: { count: 3, color: "bg-purple-500" },
      //   moduleId: "members"
      // },
      {
        name: "Ministries",
        href: "/dashboard/ministries",
        icon: UserGroupIcon,
        badge: null,
        moduleId: "ministries",
      },
      // {
      //   name: "Worship",
      //   href: "/dashboard/worship",
      //   icon: MusicalNoteIcon,
      //   badge: null,
      //   moduleId: "sermons"
      // },
      {
        name: "Sermons",
        href: "/dashboard/sermons",
        icon: DocumentTextIcon,
        badge: null,
        moduleId: "sermons",
      },
      {
        name: "Broadcasts",
        href: "/dashboard/broadcasts",
        icon: VideoCameraIcon,
        badge: null,
        moduleId: "broadcasts",
      },
    ],
  },
  {
    category: "Operations",
    items: [
      {
        name: "Branches",
        href: "/dashboard/branches",
        icon: HomeIcon,
        badge: null,
        moduleId: "multi-branch",
      },
      {
        name: "Finances",
        href: "/dashboard/finances",
        icon: CurrencyDollarIcon,
        badge: null,
        moduleId: "finances",
      },
      {
        name: "Branch Finances",
        href: "/dashboard/branch-finances",
        icon: CurrencyDollarIcon,
        badge: null,
        moduleId: "branch-finances",
      },
      {
        name: "Assets",
        href: "/dashboard/assets",
        icon: CubeIcon,
        badge: null,
        moduleId: "assets",
      },
      {
        name: "Communication",
        href: "/dashboard/communication",
        icon: ChatBubbleLeftRightIcon,
        badge: null,
        moduleId: "communication",
      },
      {
        name: "Reports",
        href: "/dashboard/reports",
        icon: ChartBarIcon,
        badge: null,
        moduleId: "reports",
      },
      {
        name: "Report Builder",
        href: "/dashboard/report-builder",
        icon: DocumentTextIcon,
        badge: null,
        moduleId: "report-builder",
      },
      {
        name: "Workflows",
        href: "/dashboard/workflows",
        icon: BoltIcon,
        badge: null,
        moduleId: "workflows",
      },
      {
        name: "Subscription Manager",
        href: "/dashboard/subscription-manager",
        icon: CreditCardIcon,
        badge: null,
        moduleId: "subscription-manager",
      },
    ],
  },
  {
    category: "Administration",
    items: [
      {
        name: "Branches",
        href: "/dashboard/branches",
        icon: GlobeAltIcon,
        badge: null,
        moduleId: "branches",
      },
      {
        name: "Staff",
        href: "/admin/staff",
        icon: ShieldCheckIcon,
        badge: null,
        moduleId: "staff",
      },
    ],
  },
  {
    category: "Volunteers",
    items: [
      // {
      //   name: "Volunteer Dashboard",
      //   href: "/dashboard/volunteers",
      //   icon: UsersIcon,
      //   badge: null,
      //   moduleId: "volunteers"
      // },
      // {
      //   name: "Scheduling",
      //   href: "/dashboard/volunteers/scheduling",
      //   icon: CalendarIcon,
      //   badge: null,
      //   moduleId: "volunteers"
      // },
      // {
      //   name: "Background Checks",
      //   href: "/dashboard/volunteers/background-checks",
      //   icon: ShieldCheckIcon,
      //   badge: null,
      //   moduleId: "volunteers"
      // },
      // {
      //   name: "Teams",
      //   href: "/dashboard/volunteers/teams",
      //   icon: UserGroupIcon,
      //   badge: null,
      //   moduleId: "volunteers"
      // },
      // {
      //   name: "Recognition",
      //   href: "/dashboard/volunteers/recognition",
      //   icon: BellIcon,
      //   badge: null,
      //   moduleId: "volunteers"
      // },
    ],
  },
  {
    category: "System",
    items: [
      {
        name: "Admin",
        href: "/dashboard/admin",
        icon: Cog6ToothIcon,
        badge: null,
        moduleId: "admin",
      },
      // {
      //   name: "Security",
      //   href: "/dashboard/admin/security",
      //   icon: ShieldCheckIcon,
      //   badge: null,
      //   moduleId: "security"
      // },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Cog6ToothIcon,
        badge: null,
        moduleId: "settings",
      },
      // {
      //   name: "Website",
      //   href: "/dashboard/website-integration",
      //   icon: GlobeAltIcon,
      //   badge: null,
      //   moduleId: "website"
      // },
    ],
  },
];

// Remove Member Activity menu item from navigation due to dynamic segment
// (No static menu item for /dashboard/members/[id]/activity)

export default function DynamicNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user data from authentication context
  const { state, logout } = useAuth();
  const user = state.user;
  const { canCustomizeModules } = usePermissions();
  const { enabledModules } = useModulePreferences();
  const { isModuleEnabled } = useModuleContext(); // Get module context
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [filteredNavigation, setFilteredNavigation] = useState(fullNavigation);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    // Get user's highest role from roles array
    // Roles are now consistently role IDs (strings): ['GOD_MODE', 'SYSTEM_ADMIN', etc.]
    let userRole = "MEMBER";
    
    if (user?.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      // Check for highest privilege role first
      const roleHierarchy = ['GOD_MODE', 'SYSTEM_ADMIN', 'ADMIN', 'SUBSCRIPTION_MANAGER', 'BRANCH_ADMIN'];
      
      for (const role of roleHierarchy) {
        if (user.roles.includes(role)) {
          userRole = role;
          break;
        }
      }
    }

    console.log('=== NAVIGATION DEBUG START ===');
    console.log('👤 User object:', user);
    console.log('👤 User roles array:', user?.roles);
    console.log('🔍 Navigation: User role detected:', userRole, 'Available roles:', user?.roles);
    console.log('📋 Available roles in config:', Object.keys(roleNavigationConfig));
    console.log('📋 roleNavigationConfig["GOD_MODE"] exists?', !!roleNavigationConfig['GOD_MODE']);
    console.log('📋 roleNavigationConfig["GOD_MODE"] items count:', roleNavigationConfig['GOD_MODE']?.length || 0);

    // Use our new role-based navigation configuration
    // Don't pass enabledModules here, we'll filter with ModuleContext instead
    const roleBasedNavigation = getUserNavigation(userRole, []);
    
    console.log('📊 roleBasedNavigation categories:', roleBasedNavigation.length);
    console.log('📊 roleBasedNavigation:', roleBasedNavigation);
    console.log('📊 Total items in roleBasedNavigation:', roleBasedNavigation.reduce((sum, cat) => sum + cat.items.length, 0));

    // Convert our new navigation format to the existing format expected by the UI
    // Filter by ModuleContext to ensure only enabled modules are shown
    const convertedNavigation = roleBasedNavigation.map((category) => ({
      category: category.category,
      items: category.items.filter((item) => {
        const moduleId = item.moduleId;
        
        // Always show items without moduleId (admin pages, system pages)
        if (!moduleId) {
          console.log(`📌 Navigation: Item "${item.name}" shown (admin/system page, no module)`);
          return true;
        }
        
        // Always show dashboard
        if (moduleId === 'dashboard') {
          console.log(`📌 Navigation: Item "${item.name}" shown (dashboard)`);
          return true;
        }
        
        // Check if feature module is enabled in ModuleContext
        const enabled = isModuleEnabled(moduleId);
        console.log(`📌 Navigation: Item "${item.name}" (module: ${moduleId}) enabled: ${enabled}`);
        return enabled;
      }).map((item) => ({
        name: item.name,
        href: item.href,
        icon: item.icon,
        badge: item.badge || null,
        moduleId: item.moduleId,
      })),
    })).filter((category) => category.items.length > 0); // Remove empty categories

    console.log('📋 Navigation: Filtered navigation categories:', convertedNavigation.length);
    console.log('📋 Navigation: Categories:', convertedNavigation.map(c => `${c.category} (${c.items.length} items)`).join(', '));
    console.log('📋 Final convertedNavigation:', convertedNavigation);
    console.log('=== NAVIGATION DEBUG END ===');

    setFilteredNavigation(convertedNavigation);
  }, [user?.roles, isModuleEnabled]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".profile-dropdown-btn") &&
        !target.closest(".profile-dropdown-menu")
      ) {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // Helper functions to get user information
  const getUserInitials = () => {
    if (!user?.name) return "U";

    const nameParts = user.firstName.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    }
    return nameParts[0][0] || "U";
  };

  const getUserDisplayName = () => {
    return user?.firstName || "User";
  };

  const getUserEmail = () => {
    return user?.email || "";
  };

  const getUserRole = () => {
    const role = user?.primaryRole || "member";
    // Convert snake_case to Title Case, e.g. 'admin' → 'Super Admin'
    return role
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col overflow-y-auto bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-900 pb-4">
                  <div className="flex h-16 items-center px-6 border-b border-indigo-700/50">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-lg bg-white/10 mr-3 flex items-center justify-center">
                        <HomeIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="text-white text-xl font-bold">
                        Church Manager
                      </div>
                    </div>
                  </div>

                  {/* Mobile user profile */}
                  <div className="flex items-center gap-2 py-4 px-6 border-b border-indigo-700/30">
                    <div className="relative h-9 w-9 rounded-full overflow-hidden bg-indigo-600 flex-shrink-0 ring-2 ring-white/20">
                      <div className="absolute inset-0 flex items-center justify-center text-indigo-200 font-bold text-sm">
                        AU
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        Admin User
                      </p>
                      <p className="text-xs text-indigo-200 truncate">
                        admin@churchchurch.org
                      </p>
                    </div>
                  </div>

                  <nav className="flex-1 px-3 py-3">
                    <div className="space-y-1">
                      {filteredNavigation.map((section) => (
                        <div key={section.category} className="mb-6">
                          <div className="px-3 mb-2">
                            <h3 className="text-xs font-medium uppercase tracking-wider text-indigo-300/70">
                              {section.category}
                            </h3>
                          </div>

                          <ul className="space-y-1">
                            {section.items.map((item) => {
                              const IconComponent = item?.icon || Cog6ToothIcon;
                              return (
                                <li key={item.name}>
                                  <Link
                                    href={item.href}
                                    className={`
                                      group flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium
                                      ${
                                        pathname === item.href
                                          ? "bg-indigo-700/70 text-white backdrop-blur-sm shadow-sm"
                                          : "text-indigo-100 hover:text-white hover:bg-indigo-700/40"
                                      }
                                    `}
                                  >
                                    <span className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-md bg-indigo-800/40 group-hover:bg-indigo-800/60">
                                      <IconComponent className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <span className="flex-1">{item.name}</span>
                                    {item.badge && (item as any).badge?.count && (
                                      <span
                                        className={`inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-medium ${(item as any).badge?.color || "bg-indigo-500"} text-white`}
                                      >
                                        {(item as any).badge?.count}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                      {/*{canCustomizeModules && (*/}
                      {/*  <li className="mt-auto">*/}
                      {/*    <Link*/}
                      {/*      href="/dashboard/settings/modules"*/}
                      {/*      className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"*/}
                      {/*    >*/}
                      {/*      <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />*/}
                      {/*      Customize Modules*/}
                      {/*    </Link>*/}
                      {/*  </li>*/}
                      {/*)}*/}
                    </div>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-900 pb-4">
          <div className="flex h-16 items-center px-6 border-b border-indigo-700/30">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-white/10 mr-3 flex items-center justify-center">
                <HomeIcon className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div className="text-white text-xl font-bold">Church Manager</div>
            </div>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-2 px-6 border-b border-indigo-700/30 pb-4">
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-indigo-600 flex-shrink-0 ring-2 ring-white/20">
              <div className="absolute inset-0 flex items-center justify-center text-indigo-200 font-bold">
                {getUserInitials()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-indigo-200 truncate">
                {getUserEmail()}
              </p>
              <div className="mt-1">
                <span className="text-[10px] font-medium bg-indigo-500 text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                  {getUserRole()}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex flex-1 flex-col px-6">
            <ul className="flex flex-1 flex-col gap-y-7">
              {filteredNavigation.map((section) => (
                <li key={section.category}>
                  <div className="text-xs font-semibold leading-6 text-indigo-200 uppercase tracking-wider">
                    {section.category}
                  </div>
                  <ul className="mt-2 space-y-1">
                    {section.items.map((item) => {
                      const IconComponent = item?.icon || Cog6ToothIcon;
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={`
                              group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-medium
                              ${
                                pathname === item.href
                                  ? "bg-indigo-700 text-white"
                                  : "text-indigo-200 hover:text-white hover:bg-indigo-700/40"
                              }
                            `}
                          >
                            <IconComponent className="h-5 w-5 shrink-0" aria-hidden="true" />
                            {item.name}
                            {item.badge && item.badge.count && (
                              <span
                                className={`ml-auto inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${item.badge.color || "bg-indigo-500"} text-white leading-none`}
                              >
                                {item.badge.count}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
              {/*{canCustomizeModules && (*/}
              {/*  <li className="mt-auto">*/}
              {/*    <Link*/}
              {/*      href="/dashboard/settings/modules"*/}
              {/*      className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"*/}
              {/*    >*/}
              {/*      <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />*/}
              {/*      Customize Modules*/}
              {/*    </Link>*/}
              {/*  </li>*/}
              {/*)}*/}
            </ul>

            <div className="mt-auto pb-3 text-xs text-indigo-200 text-center">
              {/*<p>*/}
              {/*  <Link href="/dashboard/settings/modules" className="hover:text-white underline">*/}
              {/*    Customize Modules*/}
              {/*  </Link>*/}
              {/*</p>*/}
            </div>
          </nav>
        </div>
      </div>

      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <Link
                href="/dashboard/notifications"
                className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors"
                title="Notifications"
              >
                <EnvelopeIcon className="h-6 w-6" aria-hidden="true" />
              </Link>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="profile-dropdown-btn flex items-center gap-x-2 rounded-full bg-indigo-700 p-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => setProfileDropdownOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={profileDropdownOpen}
                >
                  <span className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-lg font-bold">
                    {getUserInitials()}
                  </span>
                  <span className="hidden md:block text-base font-medium text-white pr-2">
                    {getUserDisplayName()}
                  </span>
                  <svg
                    className="h-4 w-4 text-white ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {profileDropdownOpen && (
                  <div className="profile-dropdown-menu absolute right-0 z-50 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center text-lg font-bold text-white">
                          {getUserInitials()}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {getUserDisplayName()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getUserEmail()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onMouseDown={async (e) => {
                          e.preventDefault(); // Prevent document mousedown from closing dropdown
                          setProfileDropdownOpen(false);
                          try {
                            await logout();
                            if (typeof window !== "undefined") {
                              window.location.href = "/auth/login";
                            }
                          } catch {
                            if (typeof window !== "undefined") {
                              window.location.href = "/auth/login";
                            }
                          }
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="pb-10">{children}</main>
      </div>
    </div>
  );
}
