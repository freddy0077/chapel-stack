"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/graphql/hooks/useAuth';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * A component that restricts access to authenticated users only
 * @param children The components to render if the user is authenticated
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // We don't want to redirect while the auth state is still being determined.
    if (isLoading) {
      return;
    }

    // If not authenticated and not loading, redirect to login.
    // This is a robust fallback to the server-side middleware.
    if (!isAuthenticated) {
      console.log('AuthGuard: Not authenticated, redirecting to login.');
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // While loading, or if the user is not yet authenticated (and the redirect is about to happen),
  // show a loading indicator. This prevents a flash of the unprotected page.
  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  // If authenticated, render the children.
  return <>{children}</>;
}
