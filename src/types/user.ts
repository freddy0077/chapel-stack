export enum Role {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  LEADER = "LEADER",
  PASTOR = "PASTOR",
  STAFF = "STAFF",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  role: Role;
  primaryBranchId?: string;
  isEmailVerified: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  type: "MAIN" | "SATELLITE" | "PLANT" | "OUTREACH";
  status: "ACTIVE" | "INACTIVE";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
