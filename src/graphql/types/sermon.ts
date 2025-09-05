/**
 * Enum for sermon status
 */
export enum SermonStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

/**
 * Speaker entity
 */
export interface Speaker {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  imageUrl?: string;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Series entity
 */
export interface Series {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Sermon entity
 */
export interface Sermon {
  id: string;
  title: string;
  description?: string;
  speakerId: string;
  seriesId?: string;
  date: string | Date;
  duration: number; // Duration in seconds
  tags?: string[];
  mediaUrl: string;
  thumbnailUrl?: string;
  status: SermonStatus;
  views?: number;
  branchId: string;
  createdById: string;
  createdAt: string | Date;
  updatedAt: string | Date;

  // These are used for UI state, not from backend
  speaker?: Speaker;
  series?: Series;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

// export interface SermonFilterInput {
//   searchTerm?: string;
//   speakerId?: string;
//   seriesId?: string;
//   branchId?: string;
//   startDate?: string | Date;
//   endDate?: string | Date;
//   status?: SermonStatus;
// }

/**
 * Pagination input
 */
export interface PaginationInput {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: "ASC" | "DESC";
}

/**
 * Create sermon input
 */
export interface CreateSermonInput {
  title: string;
  description?: string;
  speakerId: string;
  seriesId?: string;
  date: string | Date;
  duration: number;
  tags?: string[];
  mediaUrl: string;
  thumbnailUrl?: string;
  status?: SermonStatus;
  branchId: string;
}

/**
 * Update sermon input
 */
export interface UpdateSermonInput {
  title?: string;
  description?: string;
  speakerId?: string;
  seriesId?: string;
  date?: string | Date;
  duration?: number;
  tags?: string[];
  mediaUrl?: string;
  thumbnailUrl?: string;
  status?: SermonStatus;
  branchId?: string;
}

/**
 * Media upload result
 */
export interface MediaUploadResult {
  url: string;
  type: string;
  filename: string;
  mimetype: string;
  encoding: string;
  size: number;
}

/**
 * Media type for uploads
 */
export type MediaType = "AUDIO" | "VIDEO" | "THUMBNAIL";
