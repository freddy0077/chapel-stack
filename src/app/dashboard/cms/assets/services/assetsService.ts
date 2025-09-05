import {
  AnyMediaAsset,
  AssetSearchParams,
  AssetStatistics,
  AssetUploadStatus,
  MediaAsset,
  TranscodingJob,
  AssetFolder,
  AssetType,
} from "../types";

/**
 * Service for managing media assets in the CMS
 * This is a mock implementation that will be replaced with actual API calls
 */
export class AssetsService {
  // Mock data - will be replaced with actual API calls
  private static mockAssets = [
    {
      id: "asset-1",
      fileName: "sunday-sermon-thumbnail.jpg",
      fileType: "image/jpeg",
      fileSize: 245000,
      fileUrl: "https://via.placeholder.com/300/4f46e5/ffffff?text=Sermon",
      thumbnailUrl: "https://via.placeholder.com/150/4f46e5/ffffff?text=Sermon",
      uploadedById: "user-1",
      uploadedAt: new Date(2025, 3, 10),
      dimensions: { width: 1920, height: 1080 },
      alt: "Sunday Sermon Thumbnail",
      tags: ["sermon", "thumbnail", "sunday"],
      usageLocations: ["sermon-1", "page-3"],
      transcoded: true,
      status: "ready" as const,
    },
    {
      id: "asset-2",
      fileName: "youth-camp-promo.mp4",
      fileType: "video/mp4",
      fileSize: 28500000,
      fileUrl: "https://example.com/videos/youth-camp-promo.mp4",
      thumbnailUrl: "https://via.placeholder.com/150/2563eb/ffffff?text=Video",
      uploadedById: "user-2",
      uploadedAt: new Date(2025, 3, 8),
      duration: 145, // seconds
      alt: "Youth Camp Promotional Video",
      tags: ["youth", "camp", "promo", "summer"],
      usageLocations: ["event-5", "page-7"],
      transcoded: true,
      status: "ready" as const,
      versions: [
        {
          quality: "HD",
          fileUrl: "https://example.com/videos/youth-camp-promo-hd.mp4",
          fileSize: 28500000,
        },
        {
          quality: "SD",
          fileUrl: "https://example.com/videos/youth-camp-promo-sd.mp4",
          fileSize: 12400000,
        },
        {
          quality: "Mobile",
          fileUrl: "https://example.com/videos/youth-camp-promo-mobile.mp4",
          fileSize: 5600000,
        },
      ],
    },
    {
      id: "asset-3",
      fileName: "worship-service.mp3",
      fileType: "audio/mpeg",
      fileSize: 9800000,
      fileUrl: "https://example.com/audio/worship-service.mp3",
      thumbnailUrl: "https://via.placeholder.com/150/7c3aed/ffffff?text=Audio",
      uploadedById: "user-1",
      uploadedAt: new Date(2025, 3, 7),
      duration: 2354, // seconds
      alt: "Sunday Worship Service Audio",
      tags: ["worship", "music", "sunday", "audio"],
      usageLocations: ["sermon-2"],
      transcoded: true,
      status: "ready" as const,
    },
    {
      id: "asset-4",
      fileName: "small-group-study-guide.pdf",
      fileType: "application/pdf",
      fileSize: 1450000,
      fileUrl: "https://example.com/documents/small-group-study-guide.pdf",
      thumbnailUrl: "https://via.placeholder.com/150/db2777/ffffff?text=PDF",
      uploadedById: "user-3",
      uploadedAt: new Date(2025, 3, 5),
      alt: "Small Group Study Guide",
      tags: ["study", "small group", "pdf", "resource"],
      usageLocations: ["resource-8"],
      transcoded: false,
      status: "ready" as const,
    },
    {
      id: "asset-5",
      fileName: "church-logo.png",
      fileType: "image/png",
      fileSize: 256000,
      fileUrl: "https://via.placeholder.com/300/ca8a04/ffffff?text=Logo",
      thumbnailUrl: "https://via.placeholder.com/150/ca8a04/ffffff?text=Logo",
      uploadedById: "user-1",
      uploadedAt: new Date(2025, 3, 2),
      dimensions: { width: 600, height: 600 },
      alt: "Church Logo",
      tags: ["logo", "branding"],
      usageLocations: ["page-1", "page-2", "page-3", "page-4"],
      transcoded: true,
      status: "ready" as const,
    },
  ];

  private static mockFolders: AssetFolder[] = [
    {
      id: "folder-1",
      name: "Sermons",
      path: "/sermons",
      assetCount: 45,
      createdAt: new Date(2025, 1, 15),
      updatedAt: new Date(2025, 3, 10),
      createdById: "user-1",
    },
    {
      id: "folder-2",
      name: "Events",
      path: "/events",
      assetCount: 28,
      createdAt: new Date(2025, 1, 15),
      updatedAt: new Date(2025, 3, 8),
      createdById: "user-1",
    },
    {
      id: "folder-3",
      name: "Logo & Branding",
      path: "/branding",
      assetCount: 12,
      createdAt: new Date(2025, 1, 15),
      updatedAt: new Date(2025, 3, 5),
      createdById: "user-1",
    },
  ];

  /**
   * Get all assets with optional filtering
   */
  static async getAssets(params?: AssetSearchParams): Promise<AnyMediaAsset[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredAssets = [...this.mockAssets];

    // Apply filters if provided
    if (params) {
      if (params.query) {
        const query = params.query.toLowerCase();
        filteredAssets = filteredAssets.filter(
          (asset) =>
            asset.fileName.toLowerCase().includes(query) ||
            asset.tags.some((tag) => tag.toLowerCase().includes(query)),
        );
      }

      if (params.types && params.types.length > 0) {
        filteredAssets = filteredAssets.filter((asset) => {
          const type = asset.fileType.split("/")[0] as AssetType;
          return params.types?.includes(type);
        });
      }

      if (params.tags && params.tags.length > 0) {
        filteredAssets = filteredAssets.filter((asset) =>
          params.tags?.some((tag) => asset.tags.includes(tag)),
        );
      }

      // Apply sorting
      if (params.sort) {
        switch (params.sort) {
          case "newest":
            filteredAssets.sort(
              (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime(),
            );
            break;
          case "oldest":
            filteredAssets.sort(
              (a, b) => a.uploadedAt.getTime() - b.uploadedAt.getTime(),
            );
            break;
          case "name":
            filteredAssets.sort((a, b) => a.fileName.localeCompare(b.fileName));
            break;
          case "size":
            filteredAssets.sort((a, b) => b.fileSize - a.fileSize);
            break;
        }
      }

      // Apply pagination
      if (params.page !== undefined && params.limit) {
        const startIndex = params.page * params.limit;
        filteredAssets = filteredAssets.slice(
          startIndex,
          startIndex + params.limit,
        );
      }
    }

    return filteredAssets as AnyMediaAsset[];
  }

  /**
   * Get a single asset by ID
   */
  static async getAsset(id: string): Promise<AnyMediaAsset | null> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    const asset = this.mockAssets.find((asset) => asset.id === id);
    return asset ? (asset as AnyMediaAsset) : null;
  }

  /**
   * Upload a new asset
   */
  static async uploadAsset(
    file: File,
    metadata?: Partial<MediaAsset>,
  ): Promise<AssetUploadStatus> {
    // Simulate API call with progress updates
    const uploadId = "upload-" + Math.random().toString(36).substring(2, 11);

    // Return initial status
    const initialStatus: AssetUploadStatus = {
      assetId: uploadId,
      fileName: file.name,
      progress: 0,
      status: "queued",
      createdAt: new Date(),
    };

    // In a real implementation, this would connect to a WebSocket or use a polling mechanism
    // to track upload progress and apply the metadata to the created asset

    return initialStatus;
  }

  /**
   * Update asset metadata
   */
  static async updateAsset(
    id: string,
    updates: Partial<MediaAsset>,
  ): Promise<AnyMediaAsset> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 400));

    const assetIndex = this.mockAssets.findIndex((asset) => asset.id === id);
    if (assetIndex === -1) {
      throw new Error(`Asset with ID ${id} not found`);
    }

    // Update the asset - make a new object with the updates
    const updatedAsset = {
      ...this.mockAssets[assetIndex],
      ...updates,
    };

    // Add updatedAt separately to avoid type conflicts
    (updatedAsset as MediaAsset & { updatedAt: Date }).updatedAt = new Date();

    // Assign back to the array
    this.mockAssets[assetIndex] = updatedAsset;

    return this.mockAssets[assetIndex] as AnyMediaAsset;
  }

  /**
   * Delete an asset
   */
  static async deleteAsset(id: string): Promise<boolean> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600));

    const assetIndex = this.mockAssets.findIndex((asset) => asset.id === id);
    if (assetIndex === -1) {
      throw new Error(`Asset with ID ${id} not found`);
    }

    // Remove the asset
    this.mockAssets.splice(assetIndex, 1);

    return true;
  }

  /**
   * Get asset statistics
   */
  static async getAssetStatistics(): Promise<AssetStatistics> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 700));

    // Calculate statistics
    const totalCount = this.mockAssets.length;
    const totalSize = this.mockAssets.reduce(
      (sum, asset) => sum + asset.fileSize,
      0,
    );

    // Count by type
    const countByType = this.mockAssets.reduce(
      (counts, asset) => {
        const type = asset.fileType.split("/")[0] as AssetType;
        counts[type] = (counts[type] || 0) + 1;
        return counts;
      },
      {} as Record<AssetType, number>,
    );

    // Size by type
    const sizeByType = this.mockAssets.reduce(
      (sizes, asset) => {
        const type = asset.fileType.split("/")[0] as AssetType;
        sizes[type] = (sizes[type] || 0) + asset.fileSize;
        return sizes;
      },
      {} as Record<AssetType, number>,
    );

    // Top tags
    const tagCounts: Record<string, number> = {};
    this.mockAssets.forEach((asset) => {
      asset.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent uploads (in the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUploads = this.mockAssets.filter(
      (asset) => asset.uploadedAt > sevenDaysAgo,
    ).length;

    // Processing count
    const processingCount = this.mockAssets.filter(
      (asset) =>
        asset.status === ("processing" as "processing" | "ready" | "error"),
    ).length;

    return {
      totalCount,
      totalSize,
      countByType: countByType as Record<AssetType, number>,
      sizeByType: sizeByType as Record<AssetType, number>,
      topTags,
      recentUploads,
      processingCount,
    };
  }

  /**
   * Get asset folders
   */
  static async getFolders(): Promise<AssetFolder[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [...this.mockFolders];
  }

  /**
   * Create a new folder
   */
  static async createFolder(
    name: string,
    parentId?: string,
  ): Promise<AssetFolder> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    let path = "/";

    if (parentId) {
      const parentFolder = this.mockFolders.find(
        (folder) => folder.id === parentId,
      );
      if (!parentFolder) {
        throw new Error(`Parent folder with ID ${parentId} not found`);
      }
      path = `${parentFolder.path}/${name}`;
    } else {
      path = `/${name}`;
    }

    const newFolder: AssetFolder = {
      id: "folder-" + Math.random().toString(36).substring(2, 11),
      name,
      parentId,
      path,
      assetCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: "user-1", // In reality, this would be the current user's ID
    };

    this.mockFolders.push(newFolder);

    return newFolder;
  }

  /**
   * Start transcoding for an asset
   */
  static async startTranscoding(
    assetId: string,
    formats: string[],
  ): Promise<TranscodingJob> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check if asset exists
    const asset = this.mockAssets.find((asset) => asset.id === assetId);
    if (!asset) {
      throw new Error(`Asset with ID ${assetId} not found`);
    }

    // Create transcoding job
    const job: TranscodingJob = {
      id: "job-" + Math.random().toString(36).substring(2, 11),
      assetId,
      status: "queued",
      progress: 0,
      targetFormats: formats,
      createdAt: new Date(),
    };

    // Update asset status - need as assertion since we're modifying a readonly type
    (
      asset as MediaAsset & { status: "processing" | "ready" | "error" }
    ).status = "processing";

    return job;
  }
}
