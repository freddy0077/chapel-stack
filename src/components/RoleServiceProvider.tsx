'use client';

import { useEffect, ReactNode } from 'react';
import { useApolloClient } from '@apollo/client';
import { initializeRoleService } from '@/services/role.service';

/**
 * Role Service Provider Component
 * Initializes the role service on app startup
 * Must be wrapped inside ApolloWrapper
 */
export function RoleServiceProvider({ children }: { children: ReactNode }) {
  const apolloClient = useApolloClient();

  useEffect(() => {
    if (!apolloClient) {
      console.warn('Apollo Client not available');
      return;
    }

    try {
      // Initialize role service with Apollo Client
      const roleService = initializeRoleService(apolloClient);
      console.log('✅ Role service initialized successfully');

      // Optionally preload role data
      roleService
        .getAllRoles()
        .then((roles) => {
          console.log(`✅ Preloaded ${roles.length} roles`);
        })
        .catch((error) => {
          console.error('⚠️ Error preloading roles:', error);
        });
    } catch (error) {
      console.error('❌ Error initializing role service:', error);
    }
  }, [apolloClient]);

  return <>{children}</>;
}
