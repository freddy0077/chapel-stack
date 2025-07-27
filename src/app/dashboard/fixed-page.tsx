"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useDashboardData, DashboardType, useUserDashboardPreference } from "@/hooks/useDashboardData";
import Link from "next/link";
import DashboardContent from "./components/DashboardContent";

// Interfaces for type safety
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  branches?: Branch[];
}

interface Branch {
  id: string;
  name: string;
}

// Auth user interface that matches what comes from the auth context
interface AuthUser {
  id: string;
  email: string;
  name?: string;
  isActive?: boolean;
  roles?: string[];
  branches?: Branch[];
}

import { 
  BellIcon,
  EnvelopeIcon,
  SunIcon,
  MoonIcon,
  ChartBarIcon,
  HomeIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function Dashboard() {
  // Use the useAuth hook with proper typing
  const { user: authUser, isLoading: authLoading } = useAuth() as {
    user: AuthUser | null;
    isLoading: boolean;
  };
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  // const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  // Determine which dashboard type to use based on user role
  const dashboardType = getDashboardTypeFromRole(user?.role);
  
  // Default to first branch if user has multiple branches
  const [selectedBranchId, setSelectedBranchId] = useState<string>('default-branch');
  
  // Fetch dashboard data
  const { 
    dashboardData, 
    loading: dashboardLoading, 
    error: dashboardError,
    refetch: refetchDashboard
  } = useDashboardData(selectedBranchId, dashboardType);
  
  // Fetch user dashboard preferences
  const {
    // preference and preferenceLoading are currently unused
    // preference,
    // loading: preferenceLoading,
    updateDashboardPreference
  } = useUserDashboardPreference(selectedBranchId, dashboardType);
  
  // Protect this route - requires authentication
  useProtectedRoute();
  
  // Initialize user and time
  useEffect(() => {
    // Use the user directly from auth context
    if (authUser) {
      const userObj = {
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.name?.split(' ')[0] || '',
        lastName: authUser.name?.split(' ')[1] || '',
        role: Array.isArray(authUser.roles) && authUser.roles.length > 0 ? String(authUser.roles[0]) : 'member',
        status: authUser.isActive ? 'active' : 'inactive'
      };
      setUser(userObj);
      
      // Set selected branch if available
      if (authUser && authUser.branches && authUser.branches.length > 0) {
        setSelectedBranchId(authUser.branches[0].id);
      }
    }
    setLoading(authLoading);
    setIsMounted(true);
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, [authUser, authLoading]);
  
  // Refetch dashboard data when branch changes
  useEffect(() => {
    if (selectedBranchId && user) {
      refetchDashboard();
    }
  }, [selectedBranchId, user, refetchDashboard]);

  // Check for dark mode preference
  useEffect(() => {
    if (isMounted) {
      const storedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(storedDarkMode);
    }
  }, [isMounted]);
  
  // Helper function to get dashboard type from user role
  function getDashboardTypeFromRole(role?: string): DashboardType {
    if (!role) return DashboardType.MEMBER;
    
    switch (role.toLowerCase()) {
      case 'admin':
        return DashboardType.ADMIN;
      case 'finance_manager':
      case 'treasurer':
        return DashboardType.FINANCE;
      case 'pastor':
      case 'associate_pastor':
        return DashboardType.PASTORAL;
      case 'ministry_leader':
        return DashboardType.MINISTRY;
      default:
        return DashboardType.MEMBER;
    }
  }
  
  // Save dashboard layout when user customizes it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const saveLayout = async (layoutConfig: Record<string, unknown>) => {
    if (!user) return;
    
    try {
      await updateDashboardPreference({
        layout: layoutConfig,
        dashboardType: dashboardType,
        branchId: selectedBranchId
      });
    } catch (error) {
      console.error('❌ Error saving dashboard layout:', error);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (isMounted) {
      localStorage.setItem('darkMode', String(newDarkMode));
    }
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
    { name: 'Members', href: '/members', icon: UserGroupIcon, current: false },
    { name: 'Ministries', href: '/ministries', icon: BuildingStorefrontIcon, current: false },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, current: false },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, current: false },
  ];

  // Early loading state
  if (!isMounted || loading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen justify-center items-center flex-col"> 
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`${sidebarOpen ? 'w-64' : 'w-20'} ${darkMode ? 'bg-gray-800' : 'bg-white'} 
            transition-all duration-300 shadow-md flex flex-col`}
        >
          {/* Logo */}
          <div className={`h-16 ${darkMode ? 'bg-gray-900' : 'bg-white border-b'} flex items-center px-4`}>
            <div className="flex items-center flex-1">
              {sidebarOpen ? (
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Divine System
                </span>
              ) : (
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">DS</span>
              )}
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                {sidebarOpen ? (
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <div className="mt-6 flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${item.current 
                    ? `${darkMode ? 'bg-gray-900' : 'bg-indigo-50'} ${darkMode ? 'text-white' : 'text-indigo-600'}` 
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                  } group flex items-center rounded-md px-2 py-3 text-sm font-medium transition-all duration-200`}
                >
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${item.current ? 'text-indigo-500' : ''}`} aria-hidden="true" />
                  {sidebarOpen && item.name}
                </Link>
              ))}
            </nav>
            
            {/* User profile */}
            <div className={`mt-auto p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
                </div>
                {sidebarOpen && (
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                      {user?.firstName} {user?.lastName}
                    </p>
                    <button 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'} hover:underline`}
                    >
                      View Profile
                    </button>
                  </div>
                )}
              </div>
              
              {sidebarOpen && dropdownOpen && (
                <div className={`mt-2 p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <a 
                    href="/profile" 
                    className={`block px-2 py-1 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} rounded-md`}
                  >
                    Profile
                  </a>
                  <a 
                    href="/settings" 
                    className={`block px-2 py-1 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} rounded-md`}
                  >
                    Settings
                  </a>
                  <a 
                    href="/logout" 
                    className={`block px-2 py-1 text-sm text-red-500 hover:bg-red-100 hover:text-red-700 rounded-md`}
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-auto">
          {/* Top navbar */}
          <div className={`h-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm flex items-center justify-between px-4`}>
            <div className="flex items-center space-x-4">
              {/* Branch selector */}
              <div className="relative">
                <select 
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className={`block w-48 rounded-md border-0 py-1.5 pl-3 pr-10 ${
                    darkMode 
                      ? 'bg-gray-700 text-white focus:ring-indigo-600' 
                      : 'bg-gray-50 text-gray-900 focus:ring-indigo-600'
                  } focus:ring-1 sm:text-sm sm:leading-6`}
                >
                  {(authUser?.branches || []).map((branch: Branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                  {(!authUser?.branches || authUser?.branches?.length === 0) && (
                    <option value="default-branch">Default Branch</option>
                  )}
                </select>
              </div>
              
              {/* Current time */}
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                {currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
                )}
              </button>
              
              {/* Messages button */}
              <button className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <BellIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                
                {notificationsOpen && (
                  <div className={`absolute right-0 mt-2 w-80 rounded-md shadow-lg ${darkMode ? 'bg-gray-800 ring-gray-700' : 'bg-white ring-black ring-opacity-5'} ring-1 overflow-hidden z-50`}>
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm font-medium">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {/* Sample notifications */}
                      <div className={`p-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}>
                        <p className="text-sm">New member registration: John Doe</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>5 minutes ago</p>
                      </div>
                      <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className="text-sm">Meeting reminder: Staff meeting</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>1 hour ago</p>
                      </div>
                    </div>
                    <div className={`p-2 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'} text-center`}>
                      <a href="/notifications" className="text-sm text-indigo-600 hover:text-indigo-500">View all notifications</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <DashboardContent
            dashboardData={dashboardData || null}
            isLoading={dashboardLoading}
            error={dashboardError || null}
            refetch={refetchDashboard}
          />
        </div>
      </div>
    </div>
  );
}
