/**
 * useModules Hook - Access enabled modules throughout the application
 * This hook provides access to the current module registry and filters
 * based on enabled status, permissions, and dependencies
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ModuleConfig, DEFAULT_MODULES } from '@/lib/modules/moduleRegistry';

interface UseModulesOptions {
  category?: 'Admin' | 'Core' | 'Shared';
  enabled?: boolean;
  permissions?: string[];
}

export function useModules(options?: UseModulesOptions) {
  const [modules, setModules] = useState<ModuleConfig[]>(DEFAULT_MODULES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch modules from God Mode settings (backend)
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual GraphQL query to God Mode
        // const response = await fetch('/api/modules');
        // const data = await response.json();
        // setModules(data.modules);
        
        // For now, use default modules
        setModules(DEFAULT_MODULES);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch modules');
        setModules(DEFAULT_MODULES);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // Filter modules based on options
  const filteredModules = useMemo(() => {
    let result = modules;

    // Filter by enabled status
    if (options?.enabled !== undefined) {
      result = result.filter((m) => m.enabled === options.enabled);
    }

    // Filter by category
    if (options?.category) {
      result = result.filter((m) => m.category === options.category);
    }

    // Filter by permissions
    if (options?.permissions && options.permissions.length > 0) {
      result = result.filter((m) => {
        if (!m.permissions || m.permissions.length === 0) return true;
        return options.permissions!.some((p) => m.permissions!.includes(p));
      });
    }

    return result;
  }, [modules, options]);

  // Get enabled modules only
  const enabledModules = useMemo(
    () => modules.filter((m) => m.enabled),
    [modules]
  );

  // Check if a specific module is enabled
  const isModuleEnabled = useCallback(
    (moduleId: string): boolean => {
      return modules.some((m) => m.id === moduleId && m.enabled);
    },
    [modules]
  );

  // Get a specific module
  const getModule = useCallback(
    (moduleId: string): ModuleConfig | undefined => {
      return modules.find((m) => m.id === moduleId);
    },
    [modules]
  );

  // Get modules for sidebar navigation
  const getSidebarModules = useCallback((): ModuleConfig[] => {
    return modules.filter((m) => m.enabled && m.category !== 'Shared');
  }, [modules]);

  // Get modules for branch admin
  const getBranchAdminModules = useCallback((): ModuleConfig[] => {
    return modules.filter(
      (m) =>
        m.enabled &&
        m.category === 'Core' &&
        !['admin', 'god-mode', 'super-admin'].includes(m.id)
    );
  }, [modules]);

  // Get modules for a specific category
  const getModulesByCategory = useCallback(
    (category: 'Admin' | 'Core' | 'Shared'): ModuleConfig[] => {
      return modules.filter((m) => m.enabled && m.category === category);
    },
    [modules]
  );

  // Check dependencies
  const checkDependencies = useCallback(
    (moduleId: string): { satisfied: boolean; missing: string[] } => {
      const module = modules.find((m) => m.id === moduleId);
      if (!module || module.dependencies.length === 0) {
        return { satisfied: true, missing: [] };
      }

      const missing = module.dependencies.filter(
        (dep) => !modules.some((m) => m.id === dep && m.enabled)
      );

      return {
        satisfied: missing.length === 0,
        missing,
      };
    },
    [modules]
  );

  // Refresh modules (call this after God Mode updates)
  const refreshModules = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual GraphQL query
      setModules(DEFAULT_MODULES);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh modules');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    modules: filteredModules,
    allModules: modules,
    enabledModules,
    loading,
    error,
    isModuleEnabled,
    getModule,
    getSidebarModules,
    getBranchAdminModules,
    getModulesByCategory,
    checkDependencies,
    refreshModules,
  };
}
