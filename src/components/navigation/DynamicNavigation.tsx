'use client';

import { useState, useEffect } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/authContext";
import { usePermissions } from '@/hooks/usePermissions';
import { useModulePreferences } from '@/hooks/useModulePreferences';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  UserCircleIcon,
  MusicalNoteIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  PhotoIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

import { isModuleEnabled } from '../onboarding/ModulePreferences';

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
        moduleId: "dashboard" // Always visible (required module)
      },
    ]
  },
  {
    category: "Community",
    items: [
      { 
        name: "Members", 
        href: "/dashboard/members", 
        icon: UsersIcon, 
        badge: null,
        moduleId: "members" 
      },
      { 
        name: "Groups", 
        href: "/dashboard/groups", 
        icon: UserGroupIcon, 
        badge: null,
        moduleId: "groups" 
      },
      // HIDE Children menu item
      // { 
      //   name: "Children", 
      //   href: "/dashboard/children", 
      //   icon: UserCircleIcon, 
      //   badge: null,
      //   moduleId: "members" 
      // },
      {
        name: "Prayer Requests",
        href: "/dashboard/prayer-requests",
        icon: ChatBubbleLeftRightIcon,
        badge: null,
        moduleId: "members"
      },
    ]
  },
  {
    category: "Activities",
    items: [
      { 
        name: "Calendar", 
        href: "/dashboard/calendar", 
        icon: CalendarIcon, 
        // badge: { count: 3, color: "bg-blue-500" },
        moduleId: "events" 
      },
      { 
        name: "Attendance", 
        href: "/dashboard/attendance", 
        icon: ChartBarIcon, 
        badge: null,
        moduleId: "attendance" 
      },
      // { 
      //   name: "Check-in", 
      //   href: "/dashboard/attendance/check-in", 
      //   icon: UserCircleIcon, 
      //   badge: { count: 12, color: "bg-green-500" },
      //   moduleId: "attendance" 
      // },
      { 
        name: "Sacraments", 
        href: "/dashboard/sacraments", 
        icon: DocumentTextIcon, 
        // badge: { count: 3, color: "bg-purple-500" },
        moduleId: "members" 
      },
      { 
        name: "Ministries", 
        href: "/dashboard/ministries", 
        icon: UserGroupIcon, 
        badge: null,
        moduleId: "groups" 
      },
      // { 
      //   name: "Worship", 
      //   href: "/dashboard/worship", 
      //   icon: MusicalNoteIcon, 
      //   badge: null,
      //   moduleId: "sermons" 
      // },
      // HIDE Sermons menu item
      // { 
      //   name: "Sermons", 
      //   href: "/dashboard/sermons", 
      //   icon: MusicalNoteIcon, 
      //   badge: null,
      //   moduleId: "sermons" 
      // },
    ]
  },
  {
    category: "Operations",
    items: [
      { 
        name: "Branches", 
        href: "/dashboard/branches", 
        icon: HomeIcon, 
        badge: null,
        moduleId: "multi-branch" 
      },
      { 
        name: "Finances", 
        href: "/dashboard/finances", 
        icon: CurrencyDollarIcon, 
        badge: null,
        moduleId: "finances" 
      },
      {
        name: "Branch Finances",
        href: "/dashboard/branch-finances",
        icon: CurrencyDollarIcon,
        badge: null,
        moduleId: "branch-finances"
      },
      { 
        name: "Communication", 
        href: "/dashboard/communication", 
        icon: ChatBubbleLeftRightIcon, 
        // badge: { count: 5, color: "bg-rose-500" },
        moduleId: "communication" 
      },
      { 
        name: "Reports", 
        href: "/dashboard/reports", 
        icon: ChartBarIcon, 
        badge: null,
        moduleId: "dashboard" // Basic reporting is included in core dashboard
      },
    ]
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
    ]
  },
  {
    category: "System",
    items: [
      { 
        name: "Admin", 
        href: "/dashboard/admin", 
        icon: Cog6ToothIcon, 
        badge: null,
        moduleId: "dashboard" 
      },
      { 
        name: "Security", 
        href: "/dashboard/admin/security", 
        icon: ShieldCheckIcon, 
        badge: null,
        moduleId: "security" 
      },
      { 
        name: "Settings", 
        href: "/dashboard/settings", 
        icon: Cog6ToothIcon, 
        badge: null,
        moduleId: "dashboard" 
      },
      { 
        name: "Website", 
        href: "/dashboard/website-integration", 
        icon: GlobeAltIcon, 
        badge: null,
        moduleId: "website" 
      },
    ]
  },
];

// Remove Member Activity menu item from navigation due to dynamic segment
// (No static menu item for /dashboard/members/[id]/activity)

export default function DynamicNavigation({ children }: { children: React.ReactNode }) {
  // Get user data from authentication context
  const { user, logout } = useAuth();
  const { canCustomizeModules } = usePermissions();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [filteredNavigation, setFilteredNavigation] = useState(fullNavigation);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const userRole = user?.primaryRole?.toUpperCase() || 'MEMBER';

    // --- Refactored navigation filtering for clarity ---
    const getMemberNavigation = () =>
      fullNavigation
        .filter(section => ["Main", "Community", "Activities"].includes(section.category))
        .map(section => {
          // For member, make dashboard link point to /dashboard/member
          if (section.category === "Main" && user?.primaryRole?.toLowerCase() === "member") {
            return {
              ...section,
              items: section.items.map(item =>
                item.name === "Dashboard"
                  ? { ...item, href: "/dashboard/member" }
                  : item
              )
            };
          }
          // For branch_admin, make dashboard link point to /dashboard/branch
          if (section.category === "Main" && user?.primaryRole?.toLowerCase() === "branch_admin") {
            return {
              ...section,
              items: section.items.map(item =>
                item.name === "Dashboard"
                  ? { ...item, href: "/dashboard/branch" }
                  : item
              )
            };
          }
          return section;
        })
        .map(section => ({
          ...section,
          items: section.items.filter(item =>
            ["Dashboard", "Prayer Requests", "Calendar", "Sermons"].includes(item.name)
          )
        }))
        .filter(section => section.items.length > 0);

    const getBranchAdminNavigation = () =>
      fullNavigation
        .map(section => {
          if (section.category === "Main") {
            // Remove Branch Admin Dashboard link and make Dashboard point to /dashboard/branch
            let items = section.items
              .filter(i => i.name !== "Branch Admin Dashboard")
              .map(item =>
                item.name === "Dashboard"
                  ? { ...item, href: "/dashboard/branch" }
                  : item
              );
            return { ...section, items };
          }
          if (["Community", "Activities"].includes(section.category)) {
            return section;
          }
          if (section.category === "Operations") {
            return {
              ...section,
              items: section.items.filter(item => item.name === "Branch Finances")
            };
          }
          if (section.category === "System") {
            return {
              ...section,
              items: section.items.filter(item =>
                !["Admin", "Security"].includes(item.name)
              )
            };
          }
          // Hide Volunteers and any unhandled categories
          return { ...section, items: [] };
        })
        .filter(section => section.items.length > 0);

    if (userRole === 'MEMBER') {
      setFilteredNavigation(getMemberNavigation());
      return;
    }
    if (userRole === 'BRANCH_ADMIN') {
      setFilteredNavigation(getBranchAdminNavigation());
      return;
    }

    const isSuperAdmin = userRole === 'SUPER_ADMIN';

    // 1. Filter navigation based on roles and enabled modules
    const newFilteredNavigation = fullNavigation.map(category => ({
      ...category,
      items: category.items.filter(item => {
        if (category.category === "Operations" && ["Branch Finances", "Reports"].includes(item.name)) {
          // Only show Branch Finances to branch_admin and super_admin, always hide Reports
          if (item.name === "Branch Finances") {
            return ["branch_admin", "super_admin", "SUPER_ADMIN"].includes(user?.primaryRole?.toLowerCase?.());
          }
          return false; // Hide Reports for all
        }
        if (category.category === "System" && item.name === "Admin") {
          // Hide Admin menu item for all users
          return false;
        }
        if (item.name === "Mobile App") {
          // Hide Mobile App menu item for all users
          return false;
        }
        // Hide Prayer Requests for super_admin in navigation
        if (isSuperAdmin && item.name === "Prayer Requests") {
          return false;
        }
        // Super Admins see everything, always (except hidden above).
        if (isSuperAdmin) {
          return true;
        }

        // For other users, perform role-based checks for any protected routes
        if (item.href.startsWith('/dashboard/admin')) {
          // Only branch_admin should be checked here, as super_admin is already handled
          if (userRole !== 'BRANCH_ADMIN') {
            return false;
          }
        }

        // Next, check if the item should be visible based on module selection.
        // An item is visible if its module is enabled OR if it's a core dashboard item.
        const moduleEnabled = isModuleEnabled(item.moduleId);
        const isCoreItem = item.moduleId === 'dashboard';

        return moduleEnabled || isCoreItem;
      })
    })).filter(category => category.items.length > 0);

    setFilteredNavigation(newFilteredNavigation);

    // 2. Perform redirect if user is on a page they don't have access to
    const isCurrentPathAllowed = newFilteredNavigation
      .flatMap(category => category.items)
      .some(item => pathname === item.href || pathname.startsWith(`${item.href}/`));

    if (!isCurrentPathAllowed && pathname !== '/dashboard') {
      const isPotentiallyProtected = fullNavigation
        .flatMap(c => c.items)
        .some(item => pathname.startsWith(item.href) && item.href !== '/dashboard');

      if (isPotentiallyProtected) {
        console.warn(`[DynamicNavigation] User with role '${userRole}' not allowed to access '${pathname}'. Redirecting to /dashboard.`);
        router.push('/dashboard');
      }
    }
  }, [user, pathname, router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown-btn')) {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  console.log("Auth user:", user);
  // Helper functions to get user information
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    }
    return nameParts[0][0] || 'U';
  };
  
  const getUserDisplayName = () => {
    return user?.name || 'User';
  };
  
  const getUserEmail = () => {
    return user?.email || '';
  };
  
  const getUserRole = () => {
    const role = user?.primaryRole || 'member';
    // Convert snake_case to Title Case, e.g. 'super_admin' → 'Super Admin'
    return role
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
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
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col overflow-y-auto bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-900 pb-4">
                  <div className="flex h-16 items-center px-6 border-b border-indigo-700/50">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-lg bg-white/10 mr-3 flex items-center justify-center">
                        <HomeIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="text-white text-xl font-bold">
                        Church Manager
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile user profile */}
                  <div className="flex items-center gap-2 py-4 px-6 border-b border-indigo-700/30">
                    <div className="relative h-9 w-9 rounded-full overflow-hidden bg-indigo-600 flex-shrink-0 ring-2 ring-white/20">
                      <div className="absolute inset-0 flex items-center justify-center text-indigo-200 font-bold text-sm">AU</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">Admin User</p>
                      <p className="text-xs text-indigo-200 truncate">admin@churchchurch.org</p>
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
                            {section.items.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={`
                                    group flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium
                                    ${pathname === item.href 
                                      ? 'bg-indigo-700/70 text-white backdrop-blur-sm shadow-sm' 
                                      : 'text-indigo-100 hover:text-white hover:bg-indigo-700/40'}
                                  `}
                                >
                                  <span className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-md bg-indigo-800/40 group-hover:bg-indigo-800/60">
                                    <item.icon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                  <span className="flex-1">{item.name}</span>
                                  {item.badge && (
                                    <span className={`inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-medium ${item.badge.color} text-white`}>
                                      {item.badge.count}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {canCustomizeModules && (
                        <li className="mt-auto">
                          <Link
                            href="/dashboard/settings/modules"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                          >
                            <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            Customize Modules
                          </Link>
                        </li>
                      )}
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
              <div className="text-white text-xl font-bold">
                Church Manager
              </div>
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
              <p className="text-sm font-medium text-white truncate">{getUserDisplayName()}</p>
              <p className="text-xs text-indigo-200 truncate">{getUserEmail()}</p>
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
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`
                            group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-medium
                            ${pathname === item.href 
                              ? 'bg-indigo-700 text-white' 
                              : 'text-indigo-200 hover:text-white hover:bg-indigo-700/40'}
                          `}
                        >
                          <item.icon
                            className="h-5 w-5 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                          {item.badge && (
                            <span className={`ml-auto inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${item.badge.color} text-white leading-none`}>
                              {item.badge.count}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              {canCustomizeModules && (
                <li className="mt-auto">
                  <Link
                    href="/dashboard/settings/modules"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    Customize Modules
                  </Link>
                </li>
              )}
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
                  <svg className="h-4 w-4 text-white ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center text-lg font-bold text-white">
                          {getUserInitials()}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-900">{getUserDisplayName()}</div>
                          <div className="text-xs text-gray-500">{getUserEmail()}</div>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <a
                        href="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition"
                      >
                        Profile
                      </a>
                      <a
                        href="/dashboard/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition"
                      >
                        Settings
                      </a>
                      <button
                        onMouseDown={async (e) => {
                          e.preventDefault(); // Prevent document mousedown from closing dropdown
                          setProfileDropdownOpen(false);
                          try {
                            await logout();
                            if (typeof window !== 'undefined') {
                              window.location.href = '/auth/login';
                            }
                          } catch {
                            if (typeof window !== 'undefined') {
                              window.location.href = '/auth/login';
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

        <main className="pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
