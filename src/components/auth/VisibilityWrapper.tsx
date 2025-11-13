'use client';

import React, { ReactNode } from 'react';
import { useComponentVisibility, useActionVisibility, useFeatureFlags } from '@/hooks/useVisibility';

/**
 * Visibility Wrapper Component
 * Conditionally renders children based on permissions and modules
 */
export interface VisibilityWrapperProps {
  children: ReactNode;
  userPermissions?: string[];
  userModules?: string[];
  requiredPermissions?: string[];
  requiredModules?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export function VisibilityWrapper({
  children,
  userPermissions = [],
  userModules = [],
  requiredPermissions = [],
  requiredModules = [],
  requireAll = false,
  fallback = null,
}: VisibilityWrapperProps) {
  const visibility = useComponentVisibility(userPermissions, userModules);

  const canShow = visibility.canShow(requiredPermissions, requiredModules, requireAll);

  if (!canShow) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Feature Flag Component
 * Conditionally renders based on role-based feature flags
 */
export interface FeatureFlagProps {
  children: ReactNode;
  userRoles?: string[];
  featureName: string;
  enabledRoles: string[];
  fallback?: ReactNode;
}

export function FeatureFlag({
  children,
  userRoles = [],
  featureName,
  enabledRoles,
  fallback = null,
}: FeatureFlagProps) {
  const featureFlags = useFeatureFlags(userRoles);

  const isEnabled = featureFlags.isFeatureEnabled(featureName, enabledRoles);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Action Button Component
 * Shows/hides button based on user permissions
 */
export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  userPermissions?: string[];
  userModules?: string[];
  requiredPermissions?: string[];
  requiredModules?: string[];
  requireAll?: boolean;
  actionType?: 'create' | 'edit' | 'delete' | 'export' | 'import';
  entityType?: string;
}

export function ActionButton({
  children,
  userPermissions = [],
  userModules = [],
  requiredPermissions = [],
  requiredModules = [],
  requireAll = false,
  actionType,
  entityType,
  ...props
}: ActionButtonProps) {
  const visibility = useComponentVisibility(userPermissions, userModules);
  const actionVisibility = useActionVisibility(userPermissions, userModules);

  let canShow = true;

  if (actionType && entityType) {
    const actions = actionVisibility.getAvailableActions(entityType);
    canShow = actions[actionType] || false;
  } else if (requiredPermissions.length > 0 || requiredModules.length > 0) {
    canShow = visibility.canShow(requiredPermissions, requiredModules, requireAll);
  }

  if (!canShow) {
    return null;
  }

  return <button {...props}>{children}</button>;
}

/**
 * Conditional Section Component
 * Shows/hides entire section based on permissions
 */
export interface ConditionalSectionProps {
  children: ReactNode;
  userPermissions?: string[];
  userModules?: string[];
  requiredPermissions?: string[];
  requiredModules?: string[];
  requireAll?: boolean;
  title?: string;
  className?: string;
}

export function ConditionalSection({
  children,
  userPermissions = [],
  userModules = [],
  requiredPermissions = [],
  requiredModules = [],
  requireAll = false,
  title,
  className = '',
}: ConditionalSectionProps) {
  const visibility = useComponentVisibility(userPermissions, userModules);

  const canShow = visibility.canShow(requiredPermissions, requiredModules, requireAll);

  if (!canShow) {
    return null;
  }

  return (
    <section className={className}>
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
      {children}
    </section>
  );
}

/**
 * Dashboard Widget Component
 * Shows/hides dashboard widget based on permissions
 */
export interface DashboardWidgetProps {
  children: ReactNode;
  userPermissions?: string[];
  userModules?: string[];
  requiredPermissions?: string[];
  requiredModules?: string[];
  title?: string;
  className?: string;
}

export function DashboardWidget({
  children,
  userPermissions = [],
  userModules = [],
  requiredPermissions = [],
  requiredModules = [],
  title,
  className = '',
}: DashboardWidgetProps) {
  const visibility = useComponentVisibility(userPermissions, userModules);

  const canShow = visibility.canShow(requiredPermissions, requiredModules);

  if (!canShow) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {title && <h3 className="text-md font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
}

/**
 * Admin Only Component
 * Only visible to admin users
 */
export interface AdminOnlyProps {
  children: ReactNode;
  userRoles?: string[];
  fallback?: ReactNode;
}

export function AdminOnly({ children, userRoles = [], fallback = null }: AdminOnlyProps) {
  const featureFlags = useFeatureFlags(userRoles);

  if (!featureFlags.hasAdminFeatures()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Finance Only Component
 * Only visible to finance users
 */
export interface FinanceOnlyProps {
  children: ReactNode;
  userRoles?: string[];
  fallback?: ReactNode;
}

export function FinanceOnly({ children, userRoles = [], fallback = null }: FinanceOnlyProps) {
  const featureFlags = useFeatureFlags(userRoles);

  if (!featureFlags.hasFinanceFeatures()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Pastoral Only Component
 * Only visible to pastoral users
 */
export interface PastoralOnlyProps {
  children: ReactNode;
  userRoles?: string[];
  fallback?: ReactNode;
}

export function PastoralOnly({ children, userRoles = [], fallback = null }: PastoralOnlyProps) {
  const featureFlags = useFeatureFlags(userRoles);

  if (!featureFlags.hasPastoralFeatures()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
