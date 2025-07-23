'use client';

import { useAuth } from '@/contexts/AuthContext';
import { getUserNavigation } from '@/utils/navigation.utils';
import { NavigationCategory } from './NavigationCategory';
import { useModulePreferences } from '@/hooks/useModulePreferences';

interface NavigationSidebarProps {
  className?: string;
}

export function NavigationSidebar({ className = "" }: NavigationSidebarProps) {
  const { user, primaryRole } = useAuth();
  const { enabledModules } = useModulePreferences();
  
  if (!user || !primaryRole) {
    return null;
  }

  const navigation = getUserNavigation(primaryRole, enabledModules);

  return (
    <div className={`flex flex-col w-64 ${className}`}>
      <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
        {/* Logo/Brand */}
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-600">
          <h1 className="text-white text-lg font-semibold">Chapel Stack</h1>
        </div>
        
        {/* User Info */}
        <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-sm font-medium text-indigo-600">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
              <p className="text-xs text-gray-500">{primaryRole.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((category) => (
            <NavigationCategory
              key={category.category}
              category={category}
              isMobile={false}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            {user.branch?.name && (
              <p className="mb-1">Branch: {user.branch.name}</p>
            )}
            <p>Chapel Stack v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
