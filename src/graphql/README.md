# Church Management System GraphQL API

This directory contains the GraphQL schema definitions for the Church Management System API. The schema is designed to support all the core features of the application while maintaining strict security controls through integration with the existing Security & Access Control system.

## Schema Architecture

The schema is modularized into domain-specific files for better organization and maintainability:

- `base.graphql` - Core scalar definitions, directives, and base types
- `auth.graphql` - Authentication and user management
- `branch.graphql` - Multi-branch parish management
- `member.graphql` - Member profiles and family management
- `attendance.graphql` - Attendance tracking and check-in system
- `ministry.graphql` - Ministry and small groups management
- `sacrament.graphql` - Sacramental records
- `event.graphql` - Events, calendars, and scheduling
- `finance.graphql` - Financial management and contributions
- `communication.graphql` - Messaging and notifications
- `content.graphql` - Sermon archives and content management system
- `reporting.graphql` - Reports, analytics, and data visualization
- `visitor.graphql` - Comprehensive visitor management and follow-up
- `volunteer.graphql` - Volunteer management and scheduling
- `settings.graphql` - User preferences and system settings
- `children.graphql` - Children's ministry and secure check-in system
- `prayer.graphql` - Prayer requests and prayer ministry coordination
- `admin.graphql` - System administration and configuration
- `forms.graphql` - Custom forms, surveys, and feedback collection
- `facilities.graphql` - Facility management and resource booking
- `dashboard.graphql` - Dashboard and analytics specific operations
- `website-integration.graphql` - Website integration and public API management
- `onboarding.graphql` - Member, staff, volunteer, and branch onboarding processes

## Security Integration

### Role-Based Access Control

All API endpoints are protected using the `@auth` directive which integrates directly with the existing Security & Access Control system. Example:

```graphql
# Only staff members and above can access this query
getUserDetails(id: ID!): User! @auth(requires: [STAFF])
```

The `@auth` directive supports the following roles:
- `SUPER_ADMIN` - Diocesan/organizational level admins
- `ADMIN` - System administrators
- `BRANCH_ADMIN` - Branch/parish administrators
- `PASTOR` - Clergy members
- `STAFF` - Church staff
- `MINISTRY_LEADER` - Ministry and group leaders
- `VOLUNTEER` - Church volunteers
- `MEMBER` - Regular church members
- `GUEST` - Unauthenticated or non-member users

### Branch-Specific Permissions

For multi-branch operations, the `@branchAccess` directive enforces branch-specific permissions:

```graphql
# Only staff members assigned to this branch can access this data
getBranchMembers(branchId: ID!): [Member!]! @auth(requires: [STAFF]) @branchAccess(requires: [STAFF])
```

### Audit Logging

All mutations automatically integrate with the AuditLogs system to track sensitive actions. This ensures compliance with security policies and provides detailed traceability of all operations.

## Getting Started

### Authentication

All authenticated requests must include a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are obtained through the authentication endpoints:

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    refreshToken
    user {
      id
      displayName
    }
  }
}
```

### Making Requests

GraphQL queries and mutations follow the standard GraphQL format:

```graphql
query GetMemberDetails($id: ID!) {
  member(id: $id) {
    id
    firstName
    lastName
    email
    branches {
      branch {
        name
      }
      role
    }
  }
}
```

### Pagination

List endpoints use cursor-based pagination for optimal performance:

```graphql
query GetMembers($first: Int!, $after: String) {
  members(pagination: { first: $first, after: $after }) {
    edges {
      node {
        id
        firstName
        lastName
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## Small Groups & Ministry Management Integration

The GraphQL API fully supports the Small Groups / Ministry Management system with the following features:

### Attendance Tracking

The attendance system allows for detailed tracking of attendance for all ministry events and small group meetings:

```graphql
mutation RecordAttendance($input: CreateAttendanceInput!) {
  createAttendance(input: $input) {
    id
    totalAttendees
    checkIns {
      member {
        name
      }
      status
    }
  }
}
```

### Group Leader Communication Tools

Communication tools for group leaders are integrated through the communication schema:

```graphql
mutation SendGroupMessage($input: SendMessageInput!) {
  sendMessage(input: $input) {
    id
    subject
    recipients {
      recipient {
        name
      }
      status
    }
  }
}
```

### Leadership Management

Leadership management features are provided through the ministry schema:

```graphql
mutation AssignTeamLeader($memberId: ID!, $ministryId: ID!, $role: MinistryMemberRole!) {
  updateMinistryMember(
    id: $memberId,
    input: {
      ministryId: $ministryId,
      role: $role
    }
  ) {
    id
    role
  }
}
```

## Development Setup

1. Install dependencies:
   ```
   npm install @graphql-tools/load-files @graphql-tools/merge graphql
   ```

2. Generate the complete schema:
   ```
   npm run generate-schema
   ```

3. Start the GraphQL server:
   ```
   npm run start-server
   ```

## API Documentation

Full API documentation is generated automatically from the schema and is available at `/graphql/docs` when running the development server.

## Security Considerations

- All mutations that modify sensitive data require appropriate authentication and permissions
- Data access is restricted based on user roles and branch assignments
- All sensitive operations are logged through the AuditLogs system
- Personal data is protected in accordance with privacy regulations
