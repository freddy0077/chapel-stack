"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/graphql/hooks/useAuth';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

/**
 * A component that restricts access to children based on user roles
 * @param children The components to render if the user has the required role
 * @param allowedRoles Array of roles that are allowed to access the children
 * @param fallbackPath Path to redirect to if the user doesn't have the required role (defaults to /dashboard)
 */
export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = '/dashboard' 
}: RoleGuardProps) {
  const { isAuthenticated, getCurrentUser } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // First check if the user is authenticated
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }
    
    // Then check if the user has the required role
    const user = getCurrentUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    // Check if the user's role is in the allowed roles
    const hasRequiredRole = allowedRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      router.push(fallbackPath);
    }
  }, [allowedRoles, fallbackPath, router, isAuthenticated, getCurrentUser]);
  
  // Render children only if the user has the required role
  // We'll let the useEffect handle the redirection
  return <>{children}</>;
}
