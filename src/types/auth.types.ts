// Authentication Types
export interface User {
  id: string;
  email: string;
  name?: string; // Computed from firstName + lastName
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  organisationId?: string;
  roles: string[]; // Array of role names (simplified from UserRole objects)
  userBranches: UserBranch[];
  member?: Member;
  primaryRole: string; // The main role for dashboard routing
  branch?: Branch; // Primary branch (extracted from userBranches)
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRole {
  id: string;
  name: string;
}

export interface Branch {
  id: string;
  name: string;
  location?: string;
  region?: string;
}

export interface UserBranch {
  branch: Branch;
  role: UserRole;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  status?: string;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  requiresMFA?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}
