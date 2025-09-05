"use client";

import { useState, useEffect, createElement, useCallback } from "react";
import Image from "next/image";
import {
  FolderIcon,
  FolderPlusIcon,
  ChevronRightIcon,
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
  SpeakerWaveIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Card, Title, Text, Button, TextInput, Badge } from "@tremor/react";
import { AssetsService } from "../services/assetsService";
import { AssetFolder, AnyMediaAsset } from "../types";

interface AssetFolderViewProps {
  onSelectFolder: (folderId: string | null) => void;
  onSelectAsset: (assetId: string) => void;
  selectedFolderId: string | null;
}

interface Breadcrumb {
  id: string | null;
  name: string;
}

export default function AssetFolderView({
  onSelectFolder,
  onSelectAsset,
  selectedFolderId,
}: AssetFolderViewProps) {
  const [folders, setFolders] = useState<AssetFolder[]>([]);
  const [assets, setAssets] = useState<AnyMediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Get file type icon based on MIME type
  const getAssetIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return PhotoIcon;
    if (fileType.startsWith("video/")) return FilmIcon;
    if (fileType.startsWith("audio/")) return SpeakerWaveIcon;
    return DocumentIcon;
  };

  // Load assets for the current folder
  const loadAssets = useCallback(async () => {
    try {
      setLoading(true);

      const fetchedAssets = await AssetsService.getAssets({
        folderId: selectedFolderId || undefined,
        limit: 50,
        page: 0,
        sort: "newest",
      });

      setAssets(fetchedAssets);
    } catch (error) {
      console.error("Failed to load assets", error);
    } finally {
      setLoading(false);
    }
  }, [selectedFolderId]);

  // Load folders on mount
  useEffect(() => {
    loadFolders();
  }, []);

  // When folder selection changes, update breadcrumbs and load assets
  useEffect(() => {
    if (selectedFolderId === null) {
      setBreadcrumbs([{ id: null, name: "All Assets" }]);
    } else {
      // Update breadcrumbs
      const folder = folders.find((f) => f.id === selectedFolderId);
      if (folder) {
        const path = folder.path.split("/").filter(Boolean);
        const newBreadcrumbs = [{ id: null, name: "All Assets" }];

        let currentPath = "";
        for (let i = 0; i < path.length; i++) {
          currentPath += "/" + path[i];
          const pathFolder = folders.find((f) => f.path === currentPath);
          if (pathFolder) {
            newBreadcrumbs.push({ id: pathFolder.id, name: pathFolder.name });
          }
        }

        setBreadcrumbs(newBreadcrumbs);
      }
    }

    // Load assets for the selected folder
    loadAssets();
  }, [selectedFolderId, folders, loadAssets]);

  // Load folders from API
  const loadFolders = async () => {
    try {
      setLoading(true);
      const fetchedFolders = await AssetsService.getFolders();
      setFolders(fetchedFolders);
    } catch (error) {
      console.error("Failed to load folders", error);
    } finally {
      setLoading(false);
    }
  };

  // Get current folder's subfolders
  const getCurrentSubfolders = () => {
    if (selectedFolderId === null) {
      // Root level - show folders with no parent
      return folders.filter((folder) => !folder.parentId);
    } else {
      // Show subfolders of the selected folder
      return folders.filter((folder) => folder.parentId === selectedFolderId);
    }
  };

  // Handle creating a new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      setLoading(true);
      await AssetsService.createFolder(
        newFolderName,
        selectedFolderId || undefined,
      );
      setNewFolderName("");
      setIsCreatingFolder(false);
      await loadFolders();
    } catch (error) {
      console.error("Failed to create folder", error);
    } finally {
      setLoading(false);
    }
  };

  const subfolders = getCurrentSubfolders();

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <Title>Folders</Title>
        <Button
          size="xs"
          variant="secondary"
          icon={loading ? ArrowPathIcon : FolderPlusIcon}
          disabled={loading}
          onClick={() => setIsCreatingFolder(true)}
        >
          New Folder
        </Button>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center flex-wrap mb-4 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-3 w-3 mx-1 text-gray-400" />
            )}
            <button
              className={`hover:text-indigo-600 ${
                index === breadcrumbs.length - 1
                  ? "font-medium text-indigo-600"
                  : "text-gray-600"
              }`}
              onClick={() => onSelectFolder(crumb.id)}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </div>

      {/* New folder input */}
      {isCreatingFolder && (
        <div className="mb-4 flex">
          <TextInput
            placeholder="Enter folder name..."
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateFolder();
              } else if (e.key === "Escape") {
                setIsCreatingFolder(false);
                setNewFolderName("");
              }
            }}
            autoFocus
            className="mr-2"
          />
          <Button
            size="xs"
            color="indigo"
            onClick={handleCreateFolder}
            loading={loading}
          >
            Create
          </Button>
          <Button
            size="xs"
            variant="light"
            onClick={() => {
              setIsCreatingFolder(false);
              setNewFolderName("");
            }}
            className="ml-2"
          >
            Cancel
          </Button>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Folders */}
          {subfolders.length > 0 ? (
            subfolders.map((folder) => (
              <div
                key={folder.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between group"
                onClick={() => onSelectFolder(folder.id)}
              >
                <div className="flex items-center">
                  <FolderIcon className="h-5 w-5 text-indigo-400 mr-2" />
                  <div>
                    <div className="font-medium">{folder.name}</div>
                    <div className="text-xs text-gray-500">
                      {folder.assetCount} assets
                    </div>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                  <button
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Edit folder name (not implemented)
                    }}
                  >
                    <PencilIcon className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-200 rounded ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Delete folder (not implemented)
                    }}
                  >
                    <TrashIcon className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 border rounded-lg bg-gray-50">
              <Text className="text-gray-500">No folders found</Text>
            </div>
          )}

          {/* Assets preview */}
          {assets.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <Text className="font-medium">Files in this folder</Text>
                <Badge color="gray">{assets.length} items</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {assets.slice(0, 8).map((asset) => (
                  <div
                    key={asset.id}
                    className="border rounded-md p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => onSelectAsset(asset.id)}
                  >
                    <div className="h-16 flex items-center justify-center bg-gray-100 rounded mb-2">
                      {asset.fileType.startsWith("image/") &&
                      asset.thumbnailUrl ? (
                        <Image
                          src={asset.thumbnailUrl}
                          alt={asset.alt || asset.fileName}
                          width={50}
                          height={50}
                          className="h-full object-cover rounded"
                        />
                      ) : (
                        createElement(getAssetIcon(asset.fileType), {
                          className: "h-8 w-8 text-gray-400",
                        })
                      )}
                    </div>
                    <div className="truncate text-xs">{asset.fileName}</div>
                  </div>
                ))}

                {assets.length > 8 && (
                  <div
                    className="border rounded-md p-2 bg-gray-50 flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      /* Show more assets */
                    }}
                  >
                    <div className="text-center">
                      <PlusIcon className="h-6 w-6 text-gray-400 mx-auto" />
                      <div className="text-xs text-gray-500 mt-1">
                        {assets.length - 8} more
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
