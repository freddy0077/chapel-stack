import { gql } from '@apollo/client';

// Current user profile query with comprehensive data
export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      phoneNumber
      isActive
      isEmailVerified
      lastLoginAt
      createdAt
      updatedAt
      organisationId
      roles {
        id
        name
        description
      }
      userBranches {
        branchId
        roleId
        branch {
          id
          name
          organisation {
            id
            name
          }
        }
        role {
          id
          name
        }
      }
      member {
        id
        firstName
        lastName
        profileImageUrl
        status
      }
      primaryRole
      branch {
        id
        name
      }
    }
  }
`;

// Users list query with pagination - may need adjustment based on actual backend implementation
export const USERS_QUERY = gql`
  query Users($pagination: PaginationInput) {
    users(pagination: $pagination) {
      items {
        id
        email
        firstName
        lastName
        phoneNumber
        isActive
        isEmailVerified
        lastLoginAt
        createdAt
        updatedAt
      }
      meta {
        totalItems
        totalPages
        currentPage
        itemsPerPage
      }
    }
  }
`;

// Single user query with detailed information
export const USER_QUERY = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      phoneNumber
      isActive
      isEmailVerified
      lastLoginAt
      createdAt
      updatedAt
    }
  }
`;

// Active sessions query - simplified based on backend capabilities
export const MY_SESSIONS_QUERY = gql`
  query MySessions {
    mySessions {
      id
      userId
      userAgent
      ipAddress
      lastActiveAt
      createdAt
    }
  }
`;

// User permissions query - may need adjustment based on actual backend implementation
export const MY_PERMISSIONS_QUERY = gql`
  query MyPermissions {
    myPermissions {
      id
      name
      resource
      action
    }
  }
`;

// MFA Status query - simplified based on backend capabilities
export const MFA_STATUS_QUERY = gql`
  query MfaStatus {
    mfaStatus {
      isEnabled
      methods
    }
  }
`;

// Validate reset token query
export const VALIDATE_RESET_TOKEN_QUERY = gql`
  query ValidateResetToken($token: String!) {
    validateResetToken(token: $token) {
      success
      message
    }
  }
`;
