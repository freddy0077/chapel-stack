import { gql } from "@apollo/client";

// Create a new staff member (user with role assignment)
export const CREATE_STAFF_MEMBER = gql`
  mutation CreateStaffMember($input: CreateStaffMemberInput!) {
    createStaffMember(input: $input) {
      id
      email
      firstName
      lastName
      phoneNumber
      isActive
      createdAt
      userBranches {
        branchId
        roleId
        branch {
          id
          name
        }
        role {
          id
          name
          description
        }
      }
      roles {
        id
        name
        description
      }
    }
  }
`;

// Update existing staff member
export const UPDATE_STAFF_MEMBER = gql`
  mutation UpdateStaffMember($id: ID!, $input: UpdateStaffMemberInput!) {
    updateStaffMember(id: $id, input: $input) {
      id
      email
      firstName
      lastName
      phoneNumber
      isActive
      updatedAt
      userBranches {
        branchId
        roleId
        branch {
          id
          name
        }
        role {
          id
          name
          description
        }
      }
      roles {
        id
        name
        description
      }
    }
  }
`;

// Delete/deactivate staff member
export const DELETE_STAFF_MEMBER = gql`
  mutation DeleteStaffMember($id: ID!) {
    deleteStaffMember(id: $id) {
      success
      message
    }
  }
`;

// Activate/deactivate staff member
export const TOGGLE_STAFF_STATUS = gql`
  mutation ToggleStaffStatus($id: ID!, $isActive: Boolean!) {
    toggleStaffStatus(id: $id, isActive: $isActive) {
      id
      isActive
      updatedAt
    }
  }
`;

// Assign role to staff member
export const ASSIGN_STAFF_ROLE = gql`
  mutation AssignStaffRole($userId: String!, $branchId: String!, $roleId: String!) {
    assignUserRole(userId: $userId, branchId: $branchId, role: $roleId) {
      id
      firstName
      lastName
      email
      roles
      userBranches {
        branchId
        roleId
        branch {
          id
          name
        }
        role {
          id
          name
        }
      }
    }
  }
`;

// Remove role from staff member
export const REMOVE_STAFF_ROLE = gql`
  mutation RemoveStaffRole($userId: String!, $branchId: String!, $roleId: String!) {
    removeUserRole(userId: $userId, branchId: $branchId, role: $roleId) {
      id
      firstName
      lastName
      email
      roles
      userBranches {
        branchId
        roleId
        branch {
          id
          name
        }
        role {
          id
          name
        }
      }
    }
  }
`;
