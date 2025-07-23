'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardRoute } from '@/config/role-dashboard.config';

export function DashboardRouter() {
  const { user, defaultDashboard, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (user && defaultDashboard) {
      // Auto-redirect to user's default dashboard
      const dashboardRoute = getDashboardRoute(defaultDashboard);
      router.push(dashboardRoute);
    }
  }, [user, defaultDashboard, isAuthenticated, isLoading, router]);
  
  return null; // This component only handles routing
}
