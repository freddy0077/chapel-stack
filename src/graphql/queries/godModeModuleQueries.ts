import { gql } from '@apollo/client';

/**
 * God Mode Module Management Queries
 * Queries for managing system modules in God Mode
 * Maps to backend module-settings.resolver.ts
 */

export const GET_GOD_MODE_MODULES = gql`
  query GetGodModeModules($skip: Int, $take: Int) {
    godModeAllModules(skip: $skip, take: $take) {
      modules {
        id
        name
        description
        enabled
        icon
        category
        dependencies
        settings {
          key
          value
          type
          description
        }
        features
      }
      total
      skip
      take
    }
  }
`;

export const GET_GOD_MODE_MODULE = gql`
  query GetGodModeModule($moduleId: String!) {
    godModeModuleById(moduleId: $moduleId) {
      id
      name
      description
      enabled
      icon
      category
      dependencies
      settings {
        key
        value
        type
        description
      }
      features
    }
  }
`;

export const GET_GOD_MODE_MODULE_CATEGORIES = gql`
  query GetGodModeModuleCategories {
    godModeModuleCategories {
      categories {
        name
        description
        modules
      }
    }
  }
`;

export const GET_GOD_MODE_MODULE_DEPENDENCIES = gql`
  query GetGodModeModuleDependencies($moduleId: String!) {
    godModeModuleDependencies(moduleId: $moduleId) {
      moduleId
      dependencies
      canDisable
      dependentModules
    }
  }
`;

export const GET_GOD_MODE_MODULE_USAGE_STATS = gql`
  query GetGodModeModuleUsageStats($moduleId: String!) {
    godModeModuleUsageStats(moduleId: $moduleId) {
      moduleId
      lastUsed
      usageCount
      activeUsers
      dataSize
      performance {
        avgResponseTime
        errorRate
        uptime
      }
    }
  }
`;
