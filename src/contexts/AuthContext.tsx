'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { User, LoginResult } from '@/types/auth.types';
import { DashboardType } from '@/config/role-dashboard.config';
import { useAuth as useAuthHook } from '@/hooks/useAuth';

interface AuthContextType {
  // Core State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  
  // Role & Dashboard Info
  primaryRole: string | null;
  allowedDashboards: DashboardType[];
  defaultDashboard: DashboardType | null;
  defaultRoute: string;
  
  // Actions
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  
  // Route Checking
  canAccessRoute: (route: string) => boolean;
  canAccessDashboard: (dashboard: DashboardType) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authData = useAuthHook();
  
  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
