'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from './AuthProvider';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

/**
 * A component to protect routes that require authentication
 * 
 * @param children Components to render if authentication passes
 * @param requiredRole Optional role required to access this route
 * @param redirectTo Path to redirect to if authentication fails (defaults to /login)
 */
export default function PrivateRoute({
  children,
  requiredRole,
  redirectTo = '/auth/login'
}: PrivateRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const router = useRouter();
  
  useEffect(() => {
    // Wait until auth check completes
    if (isLoading) return;
    
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      router.replace(redirectTo);
      return;
    }
    
    // If role is required, check if user has that role
    if (requiredRole && user?.role !== requiredRole) {
      // If user doesn't have required role, redirect to dashboard
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, requiredRole, redirectTo, router]);
  
  // Show loading state while checking authentication
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
  
  // If authentication passed and required role is met, render children
  if (isAuthenticated && (!requiredRole || user?.role === requiredRole)) {
    return <>{children}</>;
  }
  
  // Return null while redirecting
  return null;
}
