// Content types for the CMS
export interface BaseContent {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: "draft" | "review" | "published" | "archived";
  authorId: string;
  branchId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  expiresAt?: Date;
  tags: string[];
  categories: string[];
  viewCount: number;
  isGlobal: boolean; // Whether this content is visible across all branches
}

// Content Permissions
export interface ContentPermission {
  id: string;
  contentId: string;
  roleId: string; // Role that has this permission
  branchId?: string; // Optional - for branch-specific permissions
  canView: boolean;
  canEdit: boolean;
  canPublish: boolean;
  canDelete: boolean;
}

// Content Type: Sermon
export interface SermonContent extends BaseContent {
  contentType: "sermon";
  videoUrl?: string;
  audioUrl?: string;
  notesUrl?: string;
  thumbnailUrl: string;
  speaker: string;
  seriesId?: string;
  duration: number; // in seconds
  scriptureReferences: string[];
}

// Content Type: Event
export interface EventContent extends BaseContent {
  contentType: "event";
  startDate: Date;
  endDate: Date;
  location: string;
  thumbnailUrl?: string;
  registrationUrl?: string;
  registrationDeadline?: Date;
  maxAttendees?: number;
  cost?: number;
  contactPerson?: string;
  recurrence?: "none" | "daily" | "weekly" | "monthly" | "custom";
  recurrenceRule?: string; // for custom recurrence patterns
}

// Content Type: Announcement
export interface AnnouncementContent extends BaseContent {
  contentType: "announcement";
  priority: "low" | "medium" | "high" | "urgent";
  thumbnailUrl?: string;
  targetAudience?: string[]; // e.g., ['all', 'youth', 'seniors']
  displayLocations: ("website" | "app" | "inhouse" | "email")[];
  callToAction?: {
    text: string;
    url: string;
  };
}

// Content Type: Small Group Resource
export interface SmallGroupResourceContent extends BaseContent {
  contentType: "small-group-resource";
  resourceType: "document" | "video" | "audio" | "curriculum" | "presentation";
  fileUrl: string;
  thumbnailUrl?: string;
  targetGroups?: string[]; // IDs of groups this resource is for
  seriesId?: string; // If part of a curriculum series
  sessionNumber?: number; // If part of a sequence
}

// Content Type: Ministry Information
export interface MinistryInfoContent extends BaseContent {
  contentType: "ministry-info";
  ministryId: string;
  leaderIds: string[];
  meetingSchedule?: string;
  thumbnailUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  mission?: string;
  vision?: string;
  upcomingEvents?: string[]; // IDs of related events
}

// Content Type: Sacramental Record Template
export interface SacramentalTemplateContent extends BaseContent {
  contentType: "sacramental-template";
  sacramentType:
    | "baptism"
    | "communion"
    | "confirmation"
    | "marriage"
    | "anointing";
  templateHtml: string;
  fieldDefinitions: {
    fieldName: string;
    fieldType: "text" | "date" | "select" | "signature" | "image";
    isRequired: boolean;
    options?: string[]; // For select fields
  }[];
}

// Content Type: Page
export interface PageContent extends BaseContent {
  contentType: "page";
  pageType: "standard" | "landing" | "form" | "redirect";
  content: string; // HTML content
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  urlPath: string;
  parentPageId?: string;
  formFields?: {
    fieldName: string;
    fieldType:
      | "text"
      | "email"
      | "number"
      | "select"
      | "textarea"
      | "checkbox"
      | "date";
    isRequired: boolean;
    options?: string[]; // For select fields
  }[];
}

// Content Type: Visitor Follow-up Sequence
export interface FollowupSequenceContent extends BaseContent {
  contentType: "followup-sequence";
  steps: {
    stepNumber: number;
    stepType: "email" | "call" | "visit" | "letter" | "text";
    delayDays: number; // Days after previous step
    template: string;
    assignedRoleId?: string; // Role responsible for this step
  }[];
  autoAssign: boolean;
  targetVisitorType?: "first-time" | "returning" | "member-family" | "all";
}

// Media Asset
export interface MediaAsset {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  thumbnailUrl?: string;
  uploadedById: string;
  uploadedAt: Date;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // For video/audio
  alt?: string;
  caption?: string;
  tags: string[];
  usageLocations: string[]; // IDs of content using this asset
  transcoded: boolean;
  versions?: {
    quality: string;
    fileUrl: string;
    fileSize: number;
  }[];
}

// Content View Metrics
export interface ContentMetrics {
  contentId: string;
  views: number;
  uniqueViewers: number;
  downloads: number;
  avgTimeOnPage: number; // in seconds
  completionRate?: number; // % of video/audio played through
  interactions: {
    type: "click" | "share" | "download" | "comment" | "reaction";
    count: number;
  }[];
  deviceBreakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  conversionActions?: {
    type: string;
    count: number;
  }[];
}

// Content Activity Log
export interface ContentActivity {
  id: string;
  contentId: string;
  userId: string;
  actionType:
    | "created"
    | "edited"
    | "published"
    | "unpublished"
    | "deleted"
    | "restored"
    | "commented";
  timestamp: Date;
  details?: string;
  previousVersion?: string; // JSON of previous state for version tracking
}

// Union type for all content types
export type Content =
  | SermonContent
  | EventContent
  | AnnouncementContent
  | SmallGroupResourceContent
  | MinistryInfoContent
  | SacramentalTemplateContent
  | PageContent
  | FollowupSequenceContent;
