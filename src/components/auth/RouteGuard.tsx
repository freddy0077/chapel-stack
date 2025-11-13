'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useCanAccessRoute } from '@/hooks/useNavigation';

export interface RouteGuardProps {
  children: ReactNode;
  userPermissions?: string[];
  userModules?: string[];
  fallbackRoute?: string;
  loading?: boolean;
}

/**
 * Route Guard Component
 * Protects routes based on user permissions and modules
 * Redirects to fallback route if user doesn't have access
 * 
 * @example
 * ```tsx
 * <RouteGuard
 *   userPermissions={user.permissions}
 *   userModules={user.modules}
 *   fallbackRoute="/dashboard"
 * >
 *   <AdminPage />
 * </RouteGuard>
 * ```
 */
export function RouteGuard({
  children,
  userPermissions = [],
  userModules = [],
  fallbackRoute = '/dashboard',
  loading = false,
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const canAccess = useCanAccessRoute(pathname, userPermissions, userModules);

  useEffect(() => {
    // Don't check access while loading
    if (loading) return;

    // If user doesn't have access, redirect to fallback
    if (!canAccess && pathname !== fallbackRoute) {
      router.push(fallbackRoute);
    }
  }, [canAccess, pathname, fallbackRoute, router, loading]);

  // Show loading state while checking access
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Show nothing while redirecting
  if (!canAccess) {
    return null;
  }

  // Render children if user has access
  return <>{children}</>;
}

/**
 * Protected Route Component
 * Wraps a route to protect it based on permissions
 */
export interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requiredModules?: string[];
  userPermissions?: string[];
  userModules?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requiredModules = [],
  userPermissions = [],
  userModules = [],
  requireAll = false,
  fallback = null,
}: ProtectedRouteProps) {
  // Check permissions
  let hasRequiredPermissions = true;
  if (requiredPermissions.length > 0) {
    if (requireAll) {
      hasRequiredPermissions = requiredPermissions.every((perm) =>
        userPermissions.includes(perm),
      );
    } else {
      hasRequiredPermissions = requiredPermissions.some((perm) =>
        userPermissions.includes(perm),
      );
    }
  }

  // Check modules
  let hasRequiredModules = true;
  if (requiredModules.length > 0) {
    if (requireAll) {
      hasRequiredModules = requiredModules.every((mod) =>
        userModules.includes(mod),
      );
    } else {
      hasRequiredModules = requiredModules.some((mod) =>
        userModules.includes(mod),
      );
    }
  }

  if (hasRequiredPermissions && hasRequiredModules) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

/**
 * Redirect Guard Component
 * Redirects user based on their role
 */
export interface RedirectGuardProps {
  children: ReactNode;
  userRoles?: string[];
  userPermissions?: string[];
  userModules?: string[];
  loading?: boolean;
}

export function RedirectGuard({
  children,
  userRoles = [],
  userPermissions = [],
  userModules = [],
  loading = false,
}: RedirectGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Determine if user should be redirected based on role
    const isAdminRoute = pathname.startsWith('/dashboard/admin');
    const isAdminUser =
      userRoles.includes('ADMIN') ||
      userRoles.includes('SUBSCRIPTION_MANAGER') ||
      userRoles.includes('BRANCH_ADMIN') ||
      userRoles.includes('ADMIN');

    // Redirect non-admin users away from admin routes
    if (isAdminRoute && !isAdminUser) {
      router.push('/dashboard');
    }
  }, [userRoles, pathname, router, loading]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
}
