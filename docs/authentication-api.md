# Authentication GraphQL API Documentation

This document provides comprehensive documentation for the Authentication GraphQL APIs used in the Church Management System. These APIs handle user authentication, registration, session management, and permission verification.

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [GraphQL Mutations](#graphql-mutations)
   - [Login](#login)
   - [Register](#register)
   - [Logout](#logout)
   - [Refresh Token](#refresh-token)
3. [GraphQL Queries](#graphql-queries)
   - [Current User (Me)](#current-user-me)
   - [Users List](#users-list)
   - [User by ID](#user-by-id)
   - [My Sessions](#my-sessions)
   - [My Permissions](#my-permissions)
4. [Branch-Based Tenancy](#branch-based-tenancy)

## Authentication Flow

The authentication flow in the Church Management System follows these steps:

1. User logs in with email and password
2. Backend validates credentials and returns a JWT token
3. Frontend stores the token in localStorage and cookies
4. Token is included in the Authorization header for subsequent API requests
5. Token expires after a set time and can be refreshed using the refresh token mutation
6. User can explicitly logout, which invalidates the token on the server

## GraphQL Mutations

### Login

Authenticates a user and returns an authentication payload.

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      firstName
      lastName
      role
      status
      createdAt
      updatedAt
    }
  }
}
```

**Input:**

```typescript
interface LoginInput {
  email: string;
  password: string;
}
```

**Response:**

```typescript
interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    accessibleBranches?: {
      branchId: string;
      role: string;
      isHomeBranch: boolean;
    }[];
  };
}
```

### Register

Creates a new user account.

```graphql
mutation Register($input: RegisterInput!) {
  register(registerInput: $input) {
    id
    email
    firstName
    lastName
    role
    status
    createdAt
    updatedAt
  }
}
```

**Input:**

```typescript
interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```

### Logout

Logs out the current user and invalidates their token.

```graphql
mutation Logout {
  logout {
    success
    message
  }
}
```

### Refresh Token

Refreshes an expired JWT token.

```graphql
mutation RefreshToken {
  refreshToken {
    access_token
    refresh_token
  }
}
```

## GraphQL Queries

### Current User (Me)

Fetches the currently authenticated user's information.

```graphql
query Me {
  me {
    id
    email
    firstName
    lastName
    role
    status
    createdAt
    updatedAt
  }
}
```

### Users List

Fetches a list of all users (requires admin privileges).

```graphql
query Users {
  users {
    id
    email
    firstName
    lastName
    role
    status
    createdAt
    updatedAt
  }
}
```

### User by ID

Fetches a specific user by ID.

```graphql
query User($id: String!) {
  user(id: $id) {
    id
    email
    firstName
    lastName
    role
    status
    createdAt
    updatedAt
  }
}
```

### My Sessions

Fetches the current user's active sessions.

```graphql
query MySessions {
  mySessions {
    id
    device
    ipAddress
    lastActiveAt
    createdAt
  }
}
```

### My Permissions

Fetches the current user's permissions.

```graphql
query MyPermissions {
  myPermissions {
    id
    resource
    action
    attributes
    conditions
  }
}
```

## Branch-Based Tenancy

The Church Management System implements branch-based tenancy, where users can have different roles and permissions across multiple church branches. The authentication system handles this by:

1. Storing accessible branches for each user
2. Allowing users to switch between branches
3. Applying branch-specific permissions
4. Filtering data based on the current branch context

## Admin Authentication APIs

The following APIs are available for user and role management by administrators:

### User Management

#### Admin Users Query

Returns a paginated list of all users (requires SUPER_ADMIN or SYSTEM_ADMIN role).

```graphql
query AdminUsers($pagination: PaginationInput, $filter: UserFilterInput) {
  adminUsers(pagination: $pagination, filter: $filter) {
    items {
      id
      email
      firstName
      lastName
      role
      status
      createdAt
      updatedAt
    }
    total
    hasMore
  }
}
```

#### Admin User Query

Returns a specific user by ID (requires SUPER_ADMIN, SYSTEM_ADMIN, or BRANCH_ADMIN role).

```graphql
query AdminUser($id: ID!) {
  adminUser(id: $id) {
    id
    email
    firstName
    lastName
    role
    status
    createdAt
    updatedAt
  }
}
```

#### Update User Active Status

Updates a user's active status (requires SUPER_ADMIN or SYSTEM_ADMIN role).

```graphql
mutation UpdateUserActiveStatus($id: ID!, $isActive: Boolean!) {
  updateUserActiveStatus(id: $id, isActive: $isActive) {
    id
    email
    status
  }
}
```

### Role Management

#### Assign Role to User

Assigns a role to a user (requires SUPER_ADMIN or SYSTEM_ADMIN role).

```graphql
mutation AssignRoleToUser($userId: ID!, $roleId: ID!) {
  assignRoleToUser(userId: $userId, roleId: $roleId) {
    id
    email
    role
  }
}
```

#### Remove Role from User

Removes a role from a user (requires SUPER_ADMIN or SYSTEM_ADMIN role).

```graphql
mutation RemoveRoleFromUser($userId: ID!, $roleId: ID!) {
  removeRoleFromUser(userId: $userId, roleId: $roleId) {
    id
    email
    role
  }
}
```

### Branch-Based Role Management

#### Assign Branch Role to User

Assigns a branch-specific role to a user (requires SUPER_ADMIN, SYSTEM_ADMIN, or BRANCH_ADMIN role).

```graphql
mutation AssignBranchRoleToUser(
  $userId: ID!
  $branchId: ID!
  $roleId: ID!
  $assignedBy: ID
) {
  assignBranchRoleToUser(
    userId: $userId
    branchId: $branchId
    roleId: $roleId
    assignedBy: $assignedBy
  ) {
    id
    userId
    branchId
    roleId
    assignedBy
    createdAt
  }
}
```

#### Remove Branch Role from User

Removes a branch-specific role from a user (requires SUPER_ADMIN, SYSTEM_ADMIN, or BRANCH_ADMIN role).

```graphql
mutation RemoveBranchRoleFromUser($userId: ID!, $branchId: ID!, $roleId: ID!) {
  removeBranchRoleFromUser(
    userId: $userId
    branchId: $branchId
    roleId: $roleId
  ) {
    id
    userId
    branchId
    roleId
  }
}
```

## Permission Management APIs

### Admin Permissions Query

Returns a list of all permissions (requires SUPER_ADMIN or SYSTEM_ADMIN role).

```graphql
query AdminPermissions {
  adminPermissions {
    id
    resource
    action
    attributes
    conditions
    description
  }
}
```

### Admin Permission Query

Returns a specific permission by ID (requires SUPER_ADMIN or SYSTEM_ADMIN role).

```graphql
query AdminPermission($id: ID!) {
  adminPermission(id: $id) {
    id
    resource
    action
    attributes
    conditions
    description
  }
}
```

## Authentication API Usage Guidelines

### Authentication Flow

1. **Login Process**:
   - Call the `login` mutation with email and password
   - Store the returned tokens (accessToken and refreshToken) securely
   - Include the accessToken in subsequent API requests via the Authorization header

2. **Session Management**:
   - Use the `refreshToken` mutation to renew expired tokens
   - Call `logout` mutation to end a session
   - Query `mySessions` to view and manage active sessions

3. **User Information**:
   - Use the `me` query to get current user details
   - Check permissions with the `myPermissions` query

4. **Branch Context**:
   - The user object contains `accessibleBranches` information
   - Include the current branch ID in relevant API requests
   - Branch-specific permissions are enforced server-side

### Security Considerations

1. **Token Storage**:
   - Store tokens in secure, HttpOnly cookies when possible
   - For SPA applications, use a combination of localStorage and memory storage
   - Implement token refresh mechanisms to maintain sessions

2. **Permission Checking**:
   - Always verify permissions server-side
   - Use the `myPermissions` query to determine UI elements to show/hide
   - Consider branch context when checking permissions

3. **Multi-Branch Security**:
   - Each API request should include branch context when relevant
   - Users should only see data for branches they have access to
   - Role-based permissions may vary between branches

This documentation provides a comprehensive guide to the authentication APIs in the Church Management System, including their usage in a branch-based tenancy context.
