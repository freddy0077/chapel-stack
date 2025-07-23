'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user, isAuthenticated, isLoading, canAccessRoute, defaultRoute } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // Check role access
    if (requiredRole && user?.primaryRole !== requiredRole) {
      router.push(fallbackRoute || defaultRoute || '/dashboard');
      return;
    }
    
    if (allowedRoles && !allowedRoles.includes(user?.primaryRole || '')) {
      router.push(fallbackRoute || defaultRoute || '/dashboard');
      return;
    }
    
    // Check route access
    if (!canAccessRoute(pathname)) {
      router.push(fallbackRoute || defaultRoute || '/dashboard');
      return;
    }
  }, [isAuthenticated, isLoading, user, pathname, requiredRole, allowedRoles, fallbackRoute, defaultRoute, canAccessRoute, router]);
  
  if (isLoading) {
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
