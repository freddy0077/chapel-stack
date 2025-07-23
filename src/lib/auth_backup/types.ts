// Authentication and Authorization Types

export type UserRole = 
  | 'super_admin'       // Organization-wide administration
  | 'branch_admin'      // Single branch administration
  | 'pastor'            // Pastoral staff
  | 'ministry_leader'   // Ministry/department leader
  | 'finance_manager'   // Can manage financial records and transactions
  | 'content_manager'   // Can manage sermons, events, and other content
  | 'volunteer'         // Church volunteer
  | 'member';           // Regular church member

export interface Branch {
  id: string;
  name: string;
  location: string;
  region?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;      // Which resource this permission applies to
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'; // Type of action
  scope: 'organization' | 'branch' | 'ministry' | 'personal'; // Scope of the permission
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Permission IDs
  isCustom: boolean;     // Whether this is a system role or custom role
  branchId?: string;     // If this is a branch-specific role
}

export interface UserPermission {
  userId: string;
  permissionId: string;
  branchId?: string;     // Optional branch context for the permission
  ministryId?: string;   // Optional ministry context for the permission
  granted: boolean;      // Whether the permission is granted or denied
}

export interface UserBranchAccess {
  userId: string;
  branchId: string;
  branchName?: string;    // Optional branch name for display
  location?: string;     // Optional branch location
  role: UserRole | string; // Role at this specific branch (could be string or UserRole enum)
  isHomeBranch?: boolean; // Whether this is the user's primary branch
}

export interface UserAuditEvent {
  id: string;
  userId: string;
  action: string;        // What action was performed
  resource: string;      // On what resource
  resourceId: string;    // Specific resource ID
  branchId?: string;     // Branch context if applicable
  timestamp: Date;
  metadata: Record<string, string | number | boolean | null>; // Additional context data
  ipAddress?: string;
  userAgent?: string;
}

export interface DataSharingPolicy {
  id: string;
  name: string;
  description: string;
  sourceType: 'branch' | 'ministry' | 'role';
  sourceId: string;
  targetType: 'branch' | 'ministry' | 'role';
  targetId: string;
  resourceType: string;  // What type of data is being shared
  permissions: ('read' | 'update' | 'delete')[];
  active: boolean;
}

// Interface for the older API response format
export interface UserBranch {
  branch: Branch;
  role: {
    name: string;
    id: string;
  };
}

// Role interface from backend API that might have different shapes
export interface ApiRole {
  id?: string;
  name?: string;
  role?: string;
  title?: string;
  type?: string;
  description?: string;
}

// Updated to handle both API response formats
export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[] | ApiRole[];
  userBranches?: UserBranch[];
  directPermissions?: UserPermission[];
  emailVerified?: Date;
  image?: string;
  isActive?: boolean; // Make optional for flexibility
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}
