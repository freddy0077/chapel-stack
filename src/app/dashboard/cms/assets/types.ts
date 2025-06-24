import { Branch } from '@/types/branch';
import { User } from '@/types/user';

// Media asset types
export type AssetType = 'image' | 'video' | 'audio' | 'document' | 'other';

// Video/Audio quality options
export type MediaQuality = 'HD' | 'SD' | 'Mobile' | 'Low';

// Media file version (transcoded variant)
export interface MediaVersion {
  quality: MediaQuality;
  fileUrl: string;
  fileSize: number;
  width?: number;
  height?: number;
  bitrate?: number;
}

// Base asset interface
export interface MediaAsset {
  id: string;
  fileName: string;
  fileType: string; // MIME type
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string;
  uploadedById: string;
  uploadedAt: Date;
  updatedAt?: Date;
  alt?: string;
  description?: string;
  tags: string[];
  usageLocations: string[]; // IDs of content where this asset is used
  branchId?: string; // Branch that owns this asset, null for global assets
  permissions?: AssetPermissions;
  transcoded: boolean;
  status: 'processing' | 'ready' | 'error';
  metadata?: Record<string, any>; // Flexible metadata for different asset types
}

// Image specific asset
export interface ImageAsset extends MediaAsset {
  dimensions: {
    width: number;
    height: number;
  };
  focalPoint?: {
    x: number;
    y: number;
  };
  versions?: MediaVersion[]; // Different sizes/formats
}

// Video specific asset
export interface VideoAsset extends MediaAsset {
  duration: number; // in seconds
  dimensions?: {
    width: number;
    height: number;
  };
  versions?: MediaVersion[]; // Different qualities/formats
  hasCaption?: boolean;
  captionUrl?: string;
  transcript?: string;
  poster?: string; // URL to poster image
}

// Audio specific asset
export interface AudioAsset extends MediaAsset {
  duration: number; // in seconds
  versions?: MediaVersion[]; // Different qualities/formats
  hasCaption?: boolean;
  captionUrl?: string;
  transcript?: string;
  waveform?: number[]; // Waveform data for visualization
}

// Document specific asset
export interface DocumentAsset extends MediaAsset {
  pageCount?: number;
  previewUrl?: string;
  versions?: {
    format: string; // e.g., 'pdf', 'docx', 'epub'
    fileUrl: string;
    fileSize: number;
  }[];
}

// Asset permissions
export interface AssetPermissions {
  public: boolean; // Can be viewed by unauthenticated users
  branches: string[]; // Branch IDs that can use this asset
  roles: string[]; // Role IDs that can manage this asset
}

// Asset upload status
export interface AssetUploadStatus {
  assetId: string;
  fileName: string;
  progress: number; // 0-100
  status: 'queued' | 'uploading' | 'processing' | 'complete' | 'error';
  errorMessage?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Transcoding job
export interface TranscodingJob {
  id: string;
  assetId: string;
  status: 'queued' | 'processing' | 'complete' | 'error';
  progress: number; // 0-100
  targetFormats: string[];
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

// Asset folder for organization
export interface AssetFolder {
  id: string;
  name: string;
  parentId?: string; // Parent folder ID, null for root folders
  path: string; // Full path e.g., "/images/events/"
  assetCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

// Asset search params
export interface AssetSearchParams {
  query?: string;
  types?: AssetType[];
  tags?: string[];
  branchId?: string;
  folderId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  uploadedBy?: string;
  sort?: 'newest' | 'oldest' | 'name' | 'size';
  page?: number;
  limit?: number;
}

// Asset statistics
export interface AssetStatistics {
  totalCount: number;
  totalSize: number;
  countByType: Record<AssetType, number>;
  sizeByType: Record<AssetType, number>;
  topTags: { tag: string; count: number }[];
  recentUploads: number;
  processingCount: number;
}

// Union type for all asset types
export type AnyMediaAsset = ImageAsset | VideoAsset | AudioAsset | DocumentAsset | MediaAsset;
