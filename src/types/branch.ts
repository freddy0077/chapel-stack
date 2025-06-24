export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  mainPastor: string;
  establishedDate: string;
  logo?: string;
  coverImage?: string;
  status: 'active' | 'inactive';
  parentBranchId?: string; // For hierarchical structure
  regionId?: string; // For regional grouping
  settings: BranchSettings;
  statistics: BranchStatistics;
  customFields?: Record<string, any>;
}

export interface BranchSettings {
  allowMemberTransfers: boolean;
  allowResourceSharing: boolean;
  visibilityToOtherBranches: 'full' | 'limited' | 'none';
  financialReportingLevel: 'detailed' | 'summary' | 'none';
  attendanceReportingLevel: 'detailed' | 'summary' | 'none';
  memberDataVisibility: 'full' | 'limited' | 'none';
  timezone: string;
  currency: string;
  language: string;
  brandingSettings: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    customCSS?: string;
  };
  notificationSettings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    transferNotifications: boolean;
    financialNotifications: boolean;
  };
}

export interface BranchStatistics {
  totalMembers: number;
  activeMembersLastMonth: number;
  totalFamilies: number;
  averageWeeklyAttendance: number;
  totalMinistries: number;
  sacramentsCounts: {
    baptisms: number;
    firstCommunions: number;
    confirmations: number;
    marriages: number;
  };
  financialSummary: {
    annualBudget: number;
    ytdIncome: number;
    ytdExpenses: number;
    currentBalance: number;
  };
}

export interface Region {
  id: string;
  name: string;
  director: string;
  branchIds: string[];
  status: 'active' | 'inactive';
}

export interface Diocese {
  id: string;
  name: string;
  bishop: string;
  regionIds: string[];
  branchIds: string[];
  status: 'active' | 'inactive';
}

export interface BranchTransferRequest {
  id: string;
  memberId: string;
  memberName: string;
  sourceBranchId: string;
  destinationBranchId: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approverIds: string[];
  completedDate?: string;
  reason: string;
  notes?: string;
  transferredData: string[]; // Types of data transferred (e.g., 'personal', 'sacraments', 'ministries')
}

export type BranchRole = 
  | 'system_admin' 
  | 'diocese_admin' 
  | 'region_admin' 
  | 'branch_admin'
  | 'branch_pastor'
  | 'branch_staff'
  | 'ministry_leader'
  | 'volunteer'
  | 'member'
  | 'guest';

export interface BranchPermission {
  id: string;
  roleId: BranchRole;
  resource: string; // e.g., 'members', 'finances', 'reports', etc.
  action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export';
  constraints?: {
    branchId?: string;
    regionId?: string;
    dioceseId?: string;
    ownOnly?: boolean;
    limitedFields?: string[];
  };
}

export interface SharedResource {
  id: string;
  name: string;
  type: 'document' | 'template' | 'media' | 'equipment' | 'other';
  description?: string;
  url?: string;
  fileId?: string;
  ownerBranchId: string;
  sharedWithBranchIds: string[];
  sharedWithRegionIds: string[];
  sharedWithDioceseIds: string[];
  visibility: 'public' | 'shared' | 'private';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}
