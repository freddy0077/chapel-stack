'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContextEnhanced';

interface UseProtectedRouteOptions {
  requiredRole?: string;
  redirectTo?: string;
}

interface UserWithRoles {
  id?: string;
  roles?: Array<string | { name: string; id: string }>;
  primaryRole?: string;
  role?: string;
}

/**
 * A hook to protect routes on the client side
 * @param options Configuration options
 * @param options.requiredRole If specified, the user must have this role to access the route
 * @param options.redirectTo Where to redirect if authentication fails (defaults to /auth/login)
 * @returns Nothing, but will redirect if the user is not authenticated
 */
export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { requiredRole, redirectTo = '/auth/login' } = options;
  const router = useRouter();
  const { isAuthenticated, user, authLoading } = useAuth();
  const redirectInProgressRef = useRef(false);
  const effectRunCountRef = useRef(0);

  console.log("user from protected route", user);

  // Helper function to check if user has a role since useAuth may not provide hasRole
  const hasRequiredRole = (user: UserWithRoles, role: string): boolean => {
    console.log("Role from role", role)
    console.log("Role from role", user.primaryRole)
    if (!user) return false;
    
    // Check primaryRole if it exists
    if (user.primaryRole === role) return true;
    
    // Check roles array if it exists
    if (Array.isArray(user.roles)) {
      return user.roles.some(userRole => 
        typeof userRole === 'string' 
          ? userRole === role 
          : userRole?.name === role
      );
    }
    
    // Check role property directly
    return user.role === role;
  };
  
  useEffect(() => {
    // Track how many times this effect runs
    effectRunCountRef.current += 1;
    
    // Debug log
    console.log(`🔄 useProtectedRoute effect run #${effectRunCountRef.current}`);
    console.log(`🔐 Auth state: loading=${authLoading}, authenticated=${isAuthenticated}, user=${!!user}`);
    
    // Prevent redirect loops by checking if we're already handling a redirect
    if (redirectInProgressRef.current) {
      console.log('🚫 Redirect already in progress, skipping check');
      return;
    }
    
    // Skip if still loading authentication state to avoid premature redirects
    if (authLoading) {
      console.log('⏳ Auth still loading, waiting for completion');
      return;
    }
    
    // Check if we need to redirect to login
    const needsAuthRedirect = !isAuthenticated || !user;
    
    if (needsAuthRedirect) {
      console.log(`⚠️ Authentication check failed, redirecting to ${redirectTo}`);
      redirectInProgressRef.current = true;
      
      // Safe redirect approach
      if (typeof window !== 'undefined') {
        // If we're in the login page already, don't redirect again
        if (window.location.pathname.includes('/auth/login')) {
          console.log('🛑 Already on login page, preventing redirect loop');
          return;
        }
        
        console.log(`🔀 Redirecting to ${redirectTo}`);
        // Use setTimeout to ensure all state updates complete
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 100);
      }
      return;
    }
    
    // Role-based access control - if we get here, user is authenticated
    if (requiredRole && user) {
      console.log(`👑 Checking for required role: ${requiredRole}`);
      const userHasRequiredRole = hasRequiredRole(user, requiredRole);
      console.log(`🔍 User has required role: ${userHasRequiredRole}`);
      
      if (!userHasRequiredRole) {
        console.log('⚠️ User lacks required role, redirecting to /dashboard');
        redirectInProgressRef.current = true;
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, user, authLoading, router, requiredRole, redirectTo]);
}
