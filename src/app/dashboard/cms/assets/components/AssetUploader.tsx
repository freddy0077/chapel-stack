"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  DocumentIcon,
  CheckIcon,
  ExclamationCircleIcon,
  TagIcon,
  PlusIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  Title,
  Text,
  Button,
  TextInput,
  Textarea,
  Select,
  SelectItem,
  Badge,
  ProgressBar,
} from "@tremor/react";
import { AssetsService } from "../services/assetsService";
import { AssetUploadStatus, MediaAsset } from "../types";

interface AssetUploaderProps {
  onUploadComplete?: (asset: MediaAsset) => void;
  onCancel?: () => void;
  allowedTypes?: string[]; // MIME types
  maxFileSize?: number; // In bytes
}

export default function AssetUploader({
  onUploadComplete,
  onCancel,
  allowedTypes = ["image/*", "video/*", "audio/*", "application/pdf"],
  maxFileSize = 1024 * 1024 * 500, // 500MB default
}: AssetUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<AssetUploadStatus | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [alt, setAlt] = useState("");
  const [branch, setBranch] = useState("all");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Branches mock data (in a real app, would be fetched from API)
  const branches = [
    { id: "all", name: "All Branches" },
    { id: "branch-1", name: "Main Campus" },
    { id: "branch-2", name: "North Campus" },
    { id: "branch-3", name: "South Campus" },
  ];

  const handleFileSelect = (file: File) => {
    // Validate file type
    const isValidType = allowedTypes.some((type) => {
      if (type.endsWith("/*")) {
        const category = type.replace("/*", "");
        return file.type.startsWith(category);
      }
      return file.type === type;
    });

    if (!isValidType) {
      setError(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`);
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setError(`File too large. Maximum size: ${formatFileSize(maxFileSize)}`);
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Generate preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    // Auto-fill title from filename (without extension)
    const titleFromFilename = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/-/g, " ");
    setTitle(titleCapitalize(titleFromFilename));
  };

  const titleCapitalize = (str: string): string => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  };

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith("image/"))
      return <div className="h-6 w-6 text-indigo-500">📷</div>;
    if (fileType.startsWith("video/"))
      return <div className="h-6 w-6 text-blue-500">🎬</div>;
    if (fileType.startsWith("audio/"))
      return <div className="h-6 w-6 text-purple-500">🎵</div>;
    return <DocumentIcon className="h-6 w-6 text-pink-500" />;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      // Build metadata
      const metadata: Partial<MediaAsset> = {
        alt,
        description,
        tags,
        branchId: branch !== "all" ? branch : undefined,
        permissions: {
          public: isPublic,
          branches:
            branch === "all"
              ? branches.map((b) => b.id).filter((id) => id !== "all")
              : [branch],
          roles: [],
        },
      };

      // Start upload
      const status = await AssetsService.uploadAsset(selectedFile, metadata);
      setUploadStatus(status);

      // In a real implementation, we would listen for upload progress updates
      // This mock simulates progress
      simulateUploadProgress(status.assetId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // This is just for the mock - in a real app, we would subscribe to server progress events
  const simulateUploadProgress = (assetId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Simulate complete status
        setUploadStatus((prev) => {
          if (!prev) return null;

          const complete: AssetUploadStatus = {
            ...prev,
            progress: 100,
            status: "complete",
            completedAt: new Date(),
          };

          // Call completion callback with mock asset
          if (onUploadComplete && selectedFile) {
            const mockAsset: any = {
              id: assetId,
              fileName: selectedFile.name,
              fileType: selectedFile.type,
              fileSize: selectedFile.size,
              fileUrl: preview || "https://example.com/placeholder",
              thumbnailUrl: preview || "https://example.com/placeholder-thumb",
              uploadedById: "current-user",
              uploadedAt: new Date(),
              alt,
              description,
              tags,
              usageLocations: [],
              branchId: branch !== "all" ? branch : undefined,
              transcoded: false,
              status: "processing",
              permissions: {
                public: isPublic,
                branches:
                  branch === "all"
                    ? branches.map((b) => b.id).filter((id) => id !== "all")
                    : [branch],
                roles: [],
              },
            };

            // Give a small delay before calling completion
            setTimeout(() => {
              onUploadComplete(mockAsset);
            }, 500);
          }

          return complete;
        });
      } else {
        setUploadStatus((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            progress,
            status: "uploading",
          };
        });
      }
    }, 300);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
      {uploadStatus?.status === "complete" ? (
        <div className="text-center py-8">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
          <Title className="mt-4">Upload Complete!</Title>
          <Text className="mt-2">
            Your file has been successfully uploaded and is now being processed.
          </Text>
          <div className="mt-8">
            <Button
              color="indigo"
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
                setUploadStatus(null);
                setTitle("");
                setDescription("");
                setAlt("");
                setTags([]);
                setBranch("all");
              }}
            >
              Upload Another
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <Title>Upload New Asset</Title>
            {onCancel && (
              <Button variant="light" icon={XMarkIcon} onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Drop Area */}
            <div>
              <Text className="font-medium mb-2">File</Text>
              <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : selectedFile
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                style={{ minHeight: "200px" }}
              >
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept={allowedTypes.join(",")}
                />

                {selectedFile ? (
                  <div className="text-center">
                    {preview ? (
                      <div className="w-full relative mb-4 flex justify-center">
                        <Image
                          src={preview}
                          alt="Preview"
                          width={200}
                          height={200}
                          className="object-contain max-h-40 rounded"
                        />
                      </div>
                    ) : (
                      <div className="text-center mb-4">
                        {getFileTypeIcon(selectedFile.type)}
                      </div>
                    )}
                    <div className="flex items-center justify-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-1" />
                      <span className="font-medium text-green-700">
                        File selected
                      </span>
                    </div>
                    <Text className="text-gray-500 mt-1">
                      {selectedFile.name}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </Text>
                  </div>
                ) : (
                  <>
                    <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 mb-3" />
                    <Text className="font-medium text-gray-700">
                      Drop your file here, or{" "}
                      <span className="text-indigo-600">browse</span>
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      Supports: {allowedTypes.join(", ")} up to{" "}
                      {formatFileSize(maxFileSize)}
                    </Text>
                  </>
                )}
              </div>

              {error && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}

              {uploadStatus && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>
                      {uploadStatus.status.charAt(0).toUpperCase() +
                        uploadStatus.status.slice(1)}
                    </span>
                    <span>{Math.round(uploadStatus.progress)}%</span>
                  </div>
                  <ProgressBar value={uploadStatus.progress} color="indigo" />
                </div>
              )}
            </div>

            {/* Metadata Form */}
            <div>
              <div className="space-y-4">
                <div>
                  <Text className="font-medium mb-2">Title</Text>
                  <TextInput
                    placeholder="Enter asset title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Text className="font-medium mb-2">Description</Text>
                  <Textarea
                    placeholder="Enter a description for this asset"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <Text className="font-medium mb-2">Alt Text</Text>
                  <TextInput
                    placeholder="Descriptive text for screen readers"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                  />
                </div>

                <div>
                  <Text className="font-medium mb-2">Branch Access</Text>
                  <Select
                    value={branch}
                    onValueChange={setBranch}
                    placeholder="Select branch access"
                  >
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div>
                  <Text className="font-medium mb-2">Tags</Text>
                  <div className="flex">
                    <TextInput
                      placeholder="Add tags..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      color="indigo"
                      variant="light"
                      className="ml-2"
                      icon={PlusIcon}
                      onClick={handleAddTag}
                    >
                      Add
                    </Button>
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          color="gray"
                          icon={TagIcon}
                          className="flex items-center"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-gray-400 hover:text-gray-600"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    id="public-access"
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="public-access"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Make publicly accessible
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            {onCancel && (
              <Button variant="secondary" className="mr-3" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              color="indigo"
              icon={ArrowUpTrayIcon}
              onClick={handleUpload}
              disabled={!selectedFile || uploadStatus?.status === "uploading"}
              loading={uploadStatus?.status === "uploading"}
              loadingText="Uploading..."
            >
              Upload Asset
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
