/**
 * Module Context - Global Module State Management
 * Provides module registry to entire application
 * Updates propagate to all components automatically
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { ModuleConfig, DEFAULT_MODULES } from '@/lib/modules/moduleRegistry';
import { GET_GOD_MODE_MODULES, GET_GOD_MODE_MODULE_STATS } from '@/graphql/queries/godModeModuleQueries';
import { UPDATE_GOD_MODE_MODULE, UPDATE_GOD_MODE_MODULES } from '@/graphql/mutations/godModeModuleMutations';

interface ModuleContextType {
  modules: ModuleConfig[];
  loading: boolean;
  error: string | null;
  updateModule: (moduleId: string, enabled: boolean) => Promise<void>;
  updateModules: (modules: ModuleConfig[]) => Promise<void>;
  refreshModules: () => Promise<void>;
  isModuleEnabled: (moduleId: string) => boolean;
  getEnabledModules: () => ModuleConfig[];
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<ModuleConfig[]>(DEFAULT_MODULES);
  const [error, setError] = useState<string | null>(null);
  const apolloClient = useApolloClient();

  // Load modules from backend using Apollo Client
  const { data, loading, refetch } = useQuery(GET_GOD_MODE_MODULES, {
    variables: { skip: 0, take: 100 },
    onCompleted: (data) => {
      if (data?.godModeAllModules?.modules) {
        // Convert backend response to ModuleConfig format
        const convertedModules = data.godModeAllModules.modules.map((m: any) => ({
          id: m.id,
          name: m.name,
          description: m.description,
          path: `/dashboard/${m.id}`, // Construct path from id
          icon: m.icon,
          category: m.category,
          enabled: m.enabled,
          version: '1.0.0',
          dependencies: m.dependencies || [],
          features: m.features || [],
          permissions: [],
          metadata: m.settings ? Object.fromEntries(m.settings.map((s: any) => [s.key, s.value])) : {},
        }));
        setModules(convertedModules);
        localStorage.setItem('moduleRegistry', JSON.stringify(convertedModules));
        setError(null);
      }
    },
    onError: (err) => {
      console.warn('Failed to load modules from backend, using localStorage:', err);
      // Fallback to localStorage
      const stored = localStorage.getItem('moduleRegistry');
      if (stored) {
        setModules(JSON.parse(stored));
      } else {
        setModules(DEFAULT_MODULES);
      }
      setError(null);
    },
    errorPolicy: 'all',
  });

  // Update modules on data change
  useEffect(() => {
    if (data?.godModeAllModules?.modules) {
      const convertedModules = data.godModeAllModules.modules.map((m: any) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        path: `/dashboard/${m.id}`,
        icon: m.icon,
        category: m.category,
        enabled: m.enabled,
        version: '1.0.0',
        dependencies: m.dependencies || [],
        features: m.features || [],
        permissions: [],
        metadata: m.settings ? Object.fromEntries(m.settings.map((s: any) => [s.key, s.value])) : {},
      }));
      setModules(convertedModules);
    }
  }, [data]);

  // Apollo mutation for updating a single module
  const [updateModuleMutation] = useMutation(UPDATE_GOD_MODE_MODULE, {
    onCompleted: (data) => {
      if (data?.godModeUpdateModuleSettings?.module) {
        const updatedModule = data.godModeUpdateModuleSettings.module;
        // Update local state
        const updated = modules.map((m) =>
          m.id === updatedModule.id ? { ...m, enabled: updatedModule.enabled } : m
        );
        setModules(updated);
        localStorage.setItem('moduleRegistry', JSON.stringify(updated));
        setError(null);
      }
    },
    onError: (err) => {
      setError(err.message);
    },
    refetchQueries: [{ query: GET_GOD_MODE_MODULES, variables: { skip: 0, take: 100 } }],
  });

  // Update a single module
  const updateModule = useCallback(
    async (moduleId: string, enabled: boolean) => {
      try {
        await updateModuleMutation({
          variables: { moduleId, enabled },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update module');
        throw err;
      }
    },
    [updateModuleMutation]
  );

  // Apollo mutation for updating multiple modules
  const [updateModulesMutation] = useMutation(UPDATE_GOD_MODE_MODULES, {
    onCompleted: (data) => {
      if (data?.godModeUpdateModules) {
        localStorage.setItem('moduleRegistry', JSON.stringify(modules));
        setError(null);
      }
    },
    onError: (err) => {
      setError(err.message);
    },
    refetchQueries: [{ query: GET_GOD_MODE_MODULES }],
  });

  // Update multiple modules
  const updateModules = useCallback(async (newModules: ModuleConfig[]) => {
    try {
      await updateModulesMutation({
        variables: {
          modules: newModules.map((m) => ({
            id: m.id,
            enabled: m.enabled,
          })),
        },
      });
      setModules(newModules);
      localStorage.setItem('moduleRegistry', JSON.stringify(newModules));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update modules');
      throw err;
    }
  }, [updateModulesMutation]);

  // Refresh modules from backend
  const refreshModules = useCallback(async () => {
    try {
      await refetch();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh modules');
    }
  }, [refetch]);

  // Check if module is enabled
  const isModuleEnabled = useCallback(
    (moduleId: string): boolean => {
      return modules.some((m) => m.id === moduleId && m.enabled);
    },
    [modules]
  );

  // Get all enabled modules
  const getEnabledModules = useCallback((): ModuleConfig[] => {
    return modules.filter((m) => m.enabled);
  }, [modules]);

  const value: ModuleContextType = {
    modules,
    loading,
    error,
    updateModule,
    updateModules,
    refreshModules,
    isModuleEnabled,
    getEnabledModules,
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
}

// Hook to use module context
export function useModuleContext() {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModuleContext must be used within ModuleProvider');
  }
  return context;
}
