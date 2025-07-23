import { useState, useEffect } from 'react';

// Basic module preferences hook
// This is a simplified version - can be enhanced later with actual module management
export function useModulePreferences() {
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For now, enable all modules by default
    // In a real implementation, this would load from user preferences or organization settings
    const defaultModules = [
      'dashboard',
      'members',
      'groups',
      'events',
      'finances',
      'attendance',
      'communication',
      'pastoral_care',
      'sacraments',
      'reports',
      'settings',
      'organizations',
      'user_management',
      'analytics',
      'performance',
      'billing',
      'subscription_plans',
      'support',
      'budgets',
      'donations',
      'profile',
      'contributions'
    ];

    setEnabledModules(defaultModules);
    setIsLoading(false);
  }, []);

  const enableModule = (moduleId: string) => {
    setEnabledModules(prev => 
      prev.includes(moduleId) ? prev : [...prev, moduleId]
    );
  };

  const disableModule = (moduleId: string) => {
    setEnabledModules(prev => 
      prev.filter(id => id !== moduleId)
    );
  };

  const isModuleEnabled = (moduleId: string) => {
    return enabledModules.includes(moduleId);
  };

  return {
    enabledModules,
    isLoading,
    enableModule,
    disableModule,
    isModuleEnabled
  };
}
