import { gql } from '@apollo/client';

/**
 * God Mode Module Management Mutations
 * Mutations for managing system modules in God Mode
 * Maps to backend module-settings.resolver.ts
 */

export const UPDATE_GOD_MODE_MODULE = gql`
  mutation UpdateGodModeModule($moduleId: String!, $enabled: Boolean!, $settings: String) {
    godModeUpdateModuleSettings(moduleId: $moduleId, enabled: $enabled, settings: $settings) {
      success
      message
      module {
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
  }
`;

export const UPDATE_GOD_MODE_MODULES = gql`
  mutation UpdateGodModeModules($modules: [ModuleSettingsInputType!]!) {
    godModeUpdateModuleSettings(modules: $modules) {
      success
      message
      module {
        id
        name
        enabled
      }
    }
  }
`;

export const CONFIGURE_GOD_MODE_MODULE = gql`
  mutation ConfigureGodModeModule($moduleId: String!, $config: String!) {
    godModeConfigureModule(moduleId: $moduleId, config: $config) {
      success
      message
      module {
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
  }
`;

export const RESET_GOD_MODE_MODULE_CONFIG = gql`
  mutation ResetGodModeModuleConfig($moduleId: String!) {
    godModeResetModuleSettings(moduleId: $moduleId) {
      success
      message
      module {
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
  }
`;
