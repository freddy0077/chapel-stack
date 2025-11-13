'use client';

import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useModuleContext } from '@/context/ModuleContext';
import { isRouteAccessible } from '@/lib/modules/navigationBuilder';

interface RouteGuardProps {
  children: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

export function RouteGuard({
  children,
  requiredRoles = [],
  requiredPermissions = [],
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { allModules } = useModuleContext();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Get user from localStorage (stored as 'chapel_user_data')
        const userStr = localStorage.getItem('chapel_user_data');
        if (!userStr) {
          console.warn('[RouteGuard] No user found in localStorage');
          setErrorMessage('User session not found. Please log in again.');
          // TEMPORARILY DISABLED: setTimeout(() => router.push('/login'), 2000);
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        console.log('[RouteGuard] User data:', { 
          id: user.id, 
          email: user.email,
          roles: user.roles,
          roleIds: user.roleIds,
          primaryRole: user.primaryRole,
          userBranches: user.userBranches
        });

        // Check roles
        if (requiredRoles.length > 0) {
          // User roles can be in multiple formats
          let userRoles: string[] = [];
          
          // Try different role sources
          if (Array.isArray(user.roles)) {
            userRoles = user.roles;
          } else if (Array.isArray(user.roleIds)) {
            userRoles = user.roleIds;
          } else if (user.primaryRole) {
            userRoles = [user.primaryRole];
          } else if (user.userBranches && Array.isArray(user.userBranches)) {
            // Extract roles from userBranches
            userRoles = user.userBranches
              .filter((ub: any) => ub.role)
              .map((ub: any) => ub.role.name || ub.role.id);
          }
          
          console.log('[RouteGuard] Role check:', {
            required: requiredRoles,
            userHas: userRoles,
          });
          
          // Check if user has any of the required roles
          const hasRole = requiredRoles.some((role) =>
            userRoles.includes(role)
          );
          
          if (!hasRole) {
            console.warn(
              `[RouteGuard] User does not have required roles. ` +
              `Required: ${requiredRoles.join(', ')}, ` +
              `User has: ${userRoles.join(', ')}`
            );
            setErrorMessage(
              `Access Denied: You need one of these roles: ${requiredRoles.join(', ')}`
            );
            setIsLoading(false);
            return;
          }
        }

        // Check permissions
        if (requiredPermissions.length > 0) {
          const userPermissions = user.permissions || [];
          const hasPermission = requiredPermissions.some((perm) =>
            userPermissions.includes(perm)
          );
          
          if (!hasPermission) {
            console.warn(
              `[RouteGuard] User does not have required permissions. ` +
              `Required: ${requiredPermissions.join(', ')}, ` +
              `User has: ${userPermissions.join(', ')}`
            );
            setErrorMessage(
              `Access Denied: You need one of these permissions: ${requiredPermissions.join(', ')}`
            );
            setIsLoading(false);
            return;
          }
        }

        // Check if route's module is enabled
        if (allModules && allModules.length > 0) {
          const routeAccessible = isRouteAccessible(pathname, allModules);
          
          if (!routeAccessible) {
            console.warn(
              `[RouteGuard] Route not accessible - module may be disabled. Route: ${pathname}`
            );
            setErrorMessage(
              'This module is currently disabled by the system administrator.'
            );
            setIsLoading(false);
            return;
          }
        }

        console.log(
          `[RouteGuard] Authorization successful for user with roles: ${(user.roles || []).join(', ')}`
        );
        setIsAuthorized(true);
      } catch (error) {
        console.error('[RouteGuard] Authorization check failed:', error);
        setErrorMessage('An error occurred while checking your access. Please try again.');
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [router, pathname, requiredRoles, requiredPermissions, allModules]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7a2 2 0 012-2h2.586a1 1 0 00.707-.293l-2.414-2.414a1 1 0 00-.707-.293H12a2 2 0 00-2 2v2m0 0H7a2 2 0 00-2 2v2m0 0v2a2 2 0 002 2h2m0 0h2a2 2 0 002-2v-2m0 0V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m0 0H7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Access Denied</h2>
          <p className="text-gray-600 text-center mb-6">
            {errorMessage || 'You do not have permission to access this page.'}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
