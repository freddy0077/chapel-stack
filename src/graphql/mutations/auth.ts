import { gql } from '@apollo/client';

// Authentication mutations
export const LOGIN_MUTATION = gql`
  mutation Login($input: SignInDto!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
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
        }
        userBranches {
          branch {
            id
            name
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
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: SignUpDto!) {
    register(input: $input) {
      id
      email
      firstName
      lastName
      phoneNumber
      isActive
      isEmailVerified
      createdAt
      updatedAt
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout($input: RefreshTokenInput!) {
    logout(input: $input) {
      message
    }
  }
`;

// Note: LogoutAll may not be supported in the current backend schema
export const LOGOUT_ALL_MUTATION = gql`
  mutation LogoutAll {
    logout(input: { refreshToken: "" }) {
      message
    }
  }
`;

// Note: LogoutSession may not be supported in the current backend schema
export const LOGOUT_SESSION_MUTATION = gql`
  mutation LogoutSession($input: RefreshTokenInput!) {
    logout(input: $input) {
      message
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

// Note: MFA may not be supported in the current backend schema yet
export const VERIFY_MFA_MUTATION = gql`
  mutation VerifyMFA($input: VerifyMFAInput!) {
    verifyMFA(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
        isActive
        isEmailVerified
      }
    }
  }
`;

// Note: MFA setup may not be supported in the current backend schema yet
export const SETUP_MFA_MUTATION = gql`
  mutation SetupMFA($input: SetupMFAInput!) {
    setupMFA(input: $input) {
      secret
      qrCode
      backupCodes
      success
      message
    }
  }
`;

// Note: MFA setup verification may not be supported in the current backend schema yet
export const VERIFY_MFA_SETUP_MUTATION = gql`
  mutation VerifyMFASetup($input: VerifyMFASetupInput!) {
    verifyMFASetup(input: $input) {
      success
      message
    }
  }
`;

// Note: MFA disabling may not be supported in the current backend schema yet
export const DISABLE_MFA_MUTATION = gql`
  mutation DisableMFA($input: DisableMFAInput!) {
    disableMFA(input: $input) {
      success
      message
    }
  }
`;

// Note: Password reset may be structured differently in the current backend
export const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
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

export const REQUEST_EMAIL_VERIFICATION_MUTATION = gql`
  mutation RequestEmailVerification {
    requestEmailVerification {
      success
      message
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message
    }
  }
`;
