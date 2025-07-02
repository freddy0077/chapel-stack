"use client";

import { useEffect, useState } from "react";
import DynamicNavigation from "@/components/navigation/DynamicNavigation";
import { loadModulePreferences } from "@/components/onboarding/ModulePreferences";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/authContext";

// This layout will check if onboarding is completed and use dynamic navigation based on selected modules
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  
  // Helper: check if user is super admin
  const isSuperAdmin = user && Array.isArray(user.roles)
    ? user.roles.some((role: unknown) => {
        if (typeof role === 'string') return role.toLowerCase() === 'super_admin' || role.toLowerCase() === 'superadmin';
        if (role && typeof role === 'object' && 'name' in role && typeof role.name === 'string') return role.name.toLowerCase() === 'super_admin' || role.name.toLowerCase() === 'superadmin';
        return false;
      })
    : false;

  // Check authentication and onboarding status when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[DashboardLayout] Pathname:', pathname);
      // First check if user is authenticated
      if (!isAuthenticated) {
        console.log('[DashboardLayout] Not authenticated, redirecting to /auth/login');
        router.push('/auth/login');
        return;
      }
      
      // Always allow access to all /dashboard/settings and subpages
      if (pathname && (pathname === '/dashboard/settings' || pathname.startsWith('/dashboard/settings/'))) {
        console.log('[DashboardLayout] Settings page detected, skipping onboarding check');
        setIsOnboardingCompleted(true);
        setIsCheckingAuth(false);
        return;
      }
      
      // Only check onboarding status for SUPER_ADMIN
      const { isOnboardingCompleted } = loadModulePreferences();
      console.log('[DashboardLayout] Onboarding completed?', isOnboardingCompleted);
      
      if (isSuperAdmin && !isOnboardingCompleted) {
        console.log('[DashboardLayout] SUPER_ADMIN onboarding not completed, redirecting to /onboarding');
        router.push('/onboarding');
      } else {
        setIsOnboardingCompleted(true);
      }
      
      setIsCheckingAuth(false);
    }
  }, [router, isAuthenticated, pathname, isSuperAdmin]);
  
  // If authentication or onboarding check is still in progress, show loading state
  if (isCheckingAuth || !isOnboardingCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-indigo-600 border-indigo-200 animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900">Loading...</h2>
          <p className="mt-2 text-gray-600">Setting up your dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Use dynamic navigation based on selected modules
  return (
    <DynamicNavigation>
      {children}
    </DynamicNavigation>
  );
}
