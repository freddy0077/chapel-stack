"use client";

import { useEffect, useState, useMemo } from "react";
import DynamicNavigation from "@/components/navigation/DynamicNavigation";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContextEnhanced";

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
  const { state, user } = useAuth();
  const { isLoading, isHydrated, isAuthenticated } = state;
  
  // Helper: check if user is super admin - MEMOIZED to prevent infinite loops
  const isSuperAdmin = useMemo(() => {
    return user && Array.isArray(user.roles)
      ? user.roles.some((role: unknown) => {
          if (typeof role === 'string') return role.toLowerCase() === 'super_admin' || role.toLowerCase() === 'superadmin';
          if (role && typeof role === 'object' && 'name' in role && typeof role.name === 'string') return role.name.toLowerCase() === 'super_admin' || role.name.toLowerCase() === 'superadmin';
          return false;
        })
      : false;
  }, [user?.roles]);

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = () => {
      if (!isMounted) {
        return;
      }
      
      // Wait for authentication context to be fully initialized
      if (isLoading || !isHydrated) {
        setIsCheckingAuth(true); // Keep checking state active
        return;
      }

      // Always allow access to all /dashboard/settings and subpages
      if (pathname && (pathname === '/dashboard/settings' || pathname.startsWith('/dashboard/settings/'))) {
        setIsOnboardingCompleted(true);
        setIsCheckingAuth(false);
        return;
      }
      
      // For subscription manager and other non-super-admin pages, skip onboarding check
      if (pathname && pathname.startsWith('/dashboard/subscription-manager')) {
        console.log('[DashboardLayout] Subscription manager page detected, skipping onboarding check');
        setIsOnboardingCompleted(true);
        setIsCheckingAuth(false);
        return;
      }

      setIsOnboardingCompleted(true);
      setIsCheckingAuth(false);
    };

    if (typeof window !== 'undefined') {
      checkAuth();
    }
    
    return () => {
      isMounted = false;
    };
  }, [isLoading, isHydrated, isAuthenticated, user, pathname, router, isSuperAdmin]); // Run when auth state changes

  console.log("CHECKING AUTH:", isCheckingAuth);
  // If authentication or onboarding check is still in progress, show loading state
  if (isCheckingAuth) {
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
