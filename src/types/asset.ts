// ============================================
// ASSET ENUMS
// ============================================

export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  IN_MAINTENANCE = 'IN_MAINTENANCE',
  DISPOSED = 'DISPOSED',
  LOST = 'LOST',
  DAMAGED = 'DAMAGED',
}

export enum AssetCondition {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
}

export enum AssetCategory {
  FIXED_ASSET = 'FIXED_ASSET',
  CURRENT_ASSET = 'CURRENT_ASSET',
  INTANGIBLE_ASSET = 'INTANGIBLE_ASSET',
}

export enum DisposalMethod {
  SOLD = 'SOLD',
  DONATED = 'DONATED',
  SCRAPPED = 'SCRAPPED',
  LOST = 'LOST',
  STOLEN = 'STOLEN',
  DAMAGED = 'DAMAGED',
}

// ============================================
// ASSET TYPE INTERFACES
// ============================================

export interface AssetType {
  id: string;
  name: string;
  description?: string;
  defaultDepreciationRate?: number;
  category?: string;
  icon?: string;
  color?: string;
  customFields?: any;
  assetCount?: number;
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssetTypeInput {
  name: string;
  description?: string;
  defaultDepreciationRate?: number;
  category?: string;
  icon?: string;
  color?: string;
  customFields?: any;
  organisationId: string;
}

export interface UpdateAssetTypeInput {
  id: string;
  name?: string;
  description?: string;
  defaultDepreciationRate?: number;
  category?: string;
  icon?: string;
  color?: string;
  customFields?: any;
}

// ============================================
// ASSET INTERFACES
// ============================================

export interface Asset {
  id: string;
  assetCode: string;
  name: string;
  description?: string;
  assetTypeId: string;
  assetType: AssetType;
  purchaseDate?: Date;
  purchasePrice?: number;
  currentValue?: number;
  depreciationRate?: number;
  location?: string;
  assignedToMemberId?: string;
  assignedToMember?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  assignedToDepartment?: string;
  status: string;
  condition?: string;
  warrantyExpiryDate?: Date;
  supplier?: string;
  serialNumber?: string;
  modelNumber?: string;
  photos?: string[];
  attachments?: string[];
  notes?: string;
  customData?: any;
  branchId?: string;
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssetInput {
  name: string;
  assetTypeId: string;
  description?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  currentValue?: number;
  depreciationRate?: number;
  location?: string;
  assignedToMemberId?: string;
  assignedToDepartment?: string;
  status?: string;
  condition?: string;
  warrantyExpiryDate?: Date;
  supplier?: string;
  serialNumber?: string;
  modelNumber?: string;
  photos?: string[];
  attachments?: string[];
  notes?: string;
  customData?: any;
  branchId?: string;
  organisationId: string;
}

export interface UpdateAssetInput {
  id: string;
  name?: string;
  assetTypeId?: string;
  description?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  currentValue?: number;
  depreciationRate?: number;
  location?: string;
  assignedToMemberId?: string;
  assignedToDepartment?: string;
  status?: string;
  condition?: string;
  warrantyExpiryDate?: Date;
  supplier?: string;
  serialNumber?: string;
  modelNumber?: string;
  photos?: string[];
  attachments?: string[];
  notes?: string;
  customData?: any;
}

export interface AssetFilterInput {
  organisationId: string;
  branchId?: string;
  assetTypeId?: string;
  status?: string;
  condition?: string;
  assignedToMemberId?: string;
  search?: string;
}

// ============================================
// ASSET DISPOSAL INTERFACES
// ============================================

export interface AssetDisposal {
  id: string;
  assetId: string;
  asset: Asset;
  disposalDate: Date;
  disposalMethod: string;
  disposalReason?: string;
  salePrice?: number;
  buyerRecipient?: string;
  approvedByMemberId?: string;
  approvedByMember?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  disposalNotes?: string;
  bookValueAtDisposal?: number;
  gainLossOnDisposal?: number;
  documents?: string[];
  branchId?: string;
  organisationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssetDisposalInput {
  assetId: string;
  disposalDate: Date;
  disposalMethod: string;
  disposalReason?: string;
  salePrice?: number;
  buyerRecipient?: string;
  approvedByMemberId?: string;
  disposalNotes?: string;
  bookValueAtDisposal?: number;
  branchId?: string;
  organisationId: string;
}

export interface AssetDisposalFilterInput {
  organisationId: string;
  branchId?: string;
  disposalMethod?: string;
  startDate?: Date;
  endDate?: Date;
}

// ============================================
// ASSET STATISTICS INTERFACE
// ============================================

export interface AssetStatistics {
  totalAssets: number;
  activeAssets: number;
  disposedAssets: number;
  inMaintenanceAssets: number;
  totalValue: number;
  totalPurchaseValue: number;
  totalDepreciation: number;
}
