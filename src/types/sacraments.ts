import { SACRAMENT_TYPES, type SacramentType } from '@/constants/sacramentTypes';

/**
 * Base interface for all sacrament records
 */
export interface BaseSacramentRecord {
  id: string;
  memberId: string;
  sacramentType: SacramentType;
  dateOfSacrament: string;
  locationOfSacrament: string;
  officiantName: string;
  officiantId?: string | null;
  certificateNumber?: string | null;
  certificateUrl?: string | null;
  notes?: string | null;
  branchId: string;
  organisationId?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Member information interface
 */
export interface SacramentMember {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  profileImageUrl?: string | null;
}

/**
 * Enhanced sacrament record with member details
 */
export interface SacramentRecord extends BaseSacramentRecord {
  member?: SacramentMember;
  memberName?: string;
  displayName?: string;
}

/**
 * Baptism-specific record interface
 */
export interface BaptismRecord extends SacramentRecord {
  sacramentType: typeof SACRAMENT_TYPES.BAPTISM;
  godparent1Name?: string | null;
  godparent2Name?: string | null;
  godparent1Id?: string | null;
  godparent2Id?: string | null;
}

/**
 * Communion-specific record interface
 */
export interface CommunionRecord extends SacramentRecord {
  sacramentType: typeof SACRAMENT_TYPES.COMMUNION;
  sponsorName?: string | null;
  sponsorId?: string | null;
}

/**
 * Confirmation-specific record interface
 */
export interface ConfirmationRecord extends SacramentRecord {
  sacramentType: typeof SACRAMENT_TYPES.CONFIRMATION;
  sponsorName?: string | null;
  sponsorId?: string | null;
  confirmationName?: string | null;
}

/**
 * Marriage-specific record interface
 */
export interface MarriageRecord extends SacramentRecord {
  sacramentType: typeof SACRAMENT_TYPES.MARRIAGE;
  groomName?: string | null;
  brideName?: string | null;
  groomMemberId?: string | null;
  brideMemberId?: string | null;
  witness1Name?: string | null;
  witness2Name?: string | null;
  witness1Id?: string | null;
  witness2Id?: string | null;
  marriageLicenseNumber?: string | null;
}

/**
 * Reconciliation-specific record interface
 */
export interface ReconciliationRecord extends SacramentRecord {
  sacramentType: typeof SACRAMENT_TYPES.RECONCILIATION;
  confessorName?: string | null;
  confessorId?: string | null;
}

/**
 * Anointing-specific record interface
 */
export interface AnointingRecord extends SacramentRecord {
  sacramentType: typeof SACRAMENT_TYPES.ANOINTING;
  reason?: string | null;
  familyPresent?: boolean;
}

/**
 * Holy Orders (Diaconate) record interface
 */
export interface DiaconateRecord extends SacramentRecord {
  sacramentType: typeof SACRAMENT_TYPES.DIACONATE;
  sponsorName?: string | null;
  sponsorId?: string | null;
  ordinationClass?: string | null;
}

/**
 * Holy Orders (Priesthood) record interface
 */
export interface PriesthoodRecord extends SacramentRecord {
  sacramentType: typeof SACRAMENT_TYPES.PRIESTHOOD;
  sponsorName?: string | null;
  sponsorId?: string | null;
  ordinationClass?: string | null;
  assignedParish?: string | null;
}

/**
 * RCIA record interface
 */
export interface RciaRecord extends SacramentRecord {
  sacramentType: typeof SACRAMENT_TYPES.RCIA;
  sponsorName?: string | null;
  sponsorId?: string | null;
  rciaClass?: string | null;
}

/**
 * Union type for all sacrament record types
 */
export type AnySacramentRecord = 
  | BaptismRecord 
  | CommunionRecord 
  | ConfirmationRecord 
  | MarriageRecord 
  | ReconciliationRecord 
  | AnointingRecord 
  | DiaconateRecord 
  | PriesthoodRecord 
  | RciaRecord;

/**
 * Search and filtering interfaces
 */
export interface SacramentSearchFilters {
  searchTerm: string;
  sacramentType: SacramentType | 'all';
  dateRange: {
    start: string;
    end: string;
  };
  location: string;
  officiant: string;
  hasNotes: boolean | null;
  hasCertificate: boolean | null;
  sortBy: 'dateOfSacrament' | 'memberName' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}

/**
 * Pagination interface
 */
export interface SacramentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * API response interfaces
 */
export interface SacramentRecordsResponse<T extends AnySacramentRecord = AnySacramentRecord> {
  records: T[];
  pagination: SacramentPagination;
  filters: SacramentSearchFilters;
}

export interface SacramentStatsResponse {
  totalRecords: number;
  recordsByType: Record<SacramentType, number>;
  recentRecords: number;
  certificatesGenerated: number;
  monthlyStats: {
    month: string;
    count: number;
  }[];
}

/**
 * Form input interfaces
 */
export interface SacramentFormData {
  memberId: string;
  sacramentType: SacramentType;
  dateOfSacrament: string;
  locationOfSacrament: string;
  officiantName: string;
  officiantId?: string;
  notes?: string;
  // Additional fields based on sacrament type
  [key: string]: any;
}

export interface BaptismFormData extends SacramentFormData {
  sacramentType: typeof SACRAMENT_TYPES.BAPTISM;
  godparent1Name?: string;
  godparent2Name?: string;
  godparent1Id?: string;
  godparent2Id?: string;
}

export interface MarriageFormData extends SacramentFormData {
  sacramentType: typeof SACRAMENT_TYPES.MARRIAGE;
  groomName?: string;
  brideName?: string;
  groomMemberId?: string;
  brideMemberId?: string;
  witness1Name?: string;
  witness2Name?: string;
  witness1Id?: string;
  witness2Id?: string;
  marriageLicenseNumber?: string;
}

/**
 * Certificate interfaces
 */
export interface SacramentCertificate {
  id: string;
  recordId: string;
  certificateNumber: string;
  certificateUrl: string;
  generatedAt: string;
  generatedBy: string;
  templateId?: string;
  isValid: boolean;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  sacramentType: SacramentType;
  templateUrl: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Export interfaces
 */
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  filters?: Partial<SacramentSearchFilters>;
  recordIds?: string[];
  includeFields?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ExportResult {
  success: boolean;
  downloadUrl?: string;
  fileName?: string;
  recordCount?: number;
  error?: string;
}

/**
 * Bulk operation interfaces
 */
export interface BulkOperationResult {
  success: boolean;
  processedCount: number;
  errorCount: number;
  errors?: string[];
  successIds?: string[];
}

export interface BulkDeleteOptions {
  recordIds: string[];
  confirmDelete: boolean;
}

export interface BulkUpdateOptions {
  recordIds: string[];
  updates: Partial<SacramentFormData>;
}

/**
 * Modal and UI state interfaces
 */
export interface SacramentModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view';
  record?: AnySacramentRecord;
  sacramentType?: SacramentType;
}

export interface SacramentPageState {
  activeTab: string;
  searchFilters: SacramentSearchFilters;
  selectedRecords: string[];
  pagination: SacramentPagination;
  loading: {
    records: boolean;
    export: boolean;
    delete: boolean;
    certificate: boolean;
  };
}

/**
 * Error interfaces
 */
export interface SacramentError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export interface ValidationError extends SacramentError {
  field: string;
  value?: any;
  constraint?: string;
}

/**
 * Analytics interfaces
 */
export interface SacramentAnalytics {
  overview: {
    totalRecords: number;
    thisMonth: number;
    thisYear: number;
    growthRate: number;
  };
  byType: Record<SacramentType, {
    count: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  monthly: {
    month: string;
    year: number;
    counts: Record<SacramentType, number>;
  }[];
  certificates: {
    generated: number;
    pending: number;
    downloadRate: number;
  };
}
