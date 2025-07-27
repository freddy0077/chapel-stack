'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContextEnhanced';

interface RoleRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  allowedRoles?: string[];
  fallbackRoute?: string;
}

export function RoleRoute({ 
  children, 
  requiredRole, 
  allowedRoles, 
  fallbackRoute 
}: RoleRouteProps) {
  const { state, canAccessRoute, getDefaultRoute } = useAuth();
  const { user, isAuthenticated, isLoading, isHydrated } = state;
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Removed console.log for performance
    
    // Wait for authentication context to be fully initialized
    if (isLoading || !isHydrated) {
      return;
    }
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // Check role access
    if (requiredRole && user?.primaryRole !== requiredRole) {
      const defaultRoute = getDefaultRoute();
      router.push(fallbackRoute || defaultRoute || '/dashboard');
      return;
    }
    
    if (allowedRoles && !allowedRoles.includes(user?.primaryRole || '')) {
      const defaultRoute = getDefaultRoute();
      router.push(fallbackRoute || defaultRoute || '/dashboard');
      return;
    }
    
    // Check route access
    if (!canAccessRoute(pathname)) {
      const defaultRoute = getDefaultRoute();
      router.push(fallbackRoute || defaultRoute || '/dashboard');
      return;
    }
    
  }, [isAuthenticated, isLoading, isHydrated, user, pathname, requiredRole, allowedRoles, fallbackRoute, canAccessRoute, getDefaultRoute, router]);
  
  // Show loading state while authentication is being checked
  if (isLoading || !isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-indigo-600 border-indigo-200 animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
}
