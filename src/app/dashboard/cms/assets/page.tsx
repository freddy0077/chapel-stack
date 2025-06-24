"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  PhotoIcon,
  DocumentIcon,
  FilmIcon,
  SpeakerWaveIcon,
  ArrowUpTrayIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import { Button, TextInput, Badge } from "@tremor/react";

// Mock media assets
const mockAssets = [
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
    transcoded: true
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
    duration: 145,
    alt: "Youth Camp Promotional Video",
    tags: ["youth", "camp", "promo", "summer"],
    usageLocations: ["event-5", "page-7"],
    transcoded: true,
    versions: [
      { quality: "HD", fileUrl: "https://example.com/videos/youth-camp-promo-hd.mp4", fileSize: 28500000 },
      { quality: "SD", fileUrl: "https://example.com/videos/youth-camp-promo-sd.mp4", fileSize: 12400000 },
      { quality: "Mobile", fileUrl: "https://example.com/videos/youth-camp-promo-mobile.mp4", fileSize: 5600000 }
    ]
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
    duration: 2354,
    alt: "Sunday Worship Service Audio",
    tags: ["worship", "music", "sunday", "audio"],
    usageLocations: ["sermon-2"],
    transcoded: true
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
    transcoded: false
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
    transcoded: true
  }
];

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
  else return (bytes / 1073741824).toFixed(1) + " GB";
};
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default function CMSAssetsPage() {
  const router = useRouter();
  const [selectedAsset, setSelectedAsset] = useState<typeof mockAssets[0] | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");

  const filteredAssets = mockAssets.filter(asset =>
    asset.fileName.toLowerCase().includes(search.toLowerCase()) ||
    asset.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  function getAssetIcon(fileType: string, className = "h-10 w-10 text-indigo-400") {
    if (fileType.startsWith("image/")) return <PhotoIcon className={className} />;
    if (fileType.startsWith("video/")) return <FilmIcon className={className} />;
    if (fileType.startsWith("audio/")) return <SpeakerWaveIcon className={className} />;
    if (fileType === "application/pdf") return <DocumentIcon className={className} />;
    return <FolderIcon className={className} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Sticky indigo header */}
      <header className="sticky top-0 z-30 bg-gradient-to-br from-indigo-700 to-indigo-600 shadow flex items-center px-4 sm:px-8 py-4">
        <button
          type="button"
          className="rounded-full bg-white p-1 text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          aria-label="Back to Dashboard"
          onClick={() => router.push("/dashboard/cms")}
        >
          <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        <h1 className="ml-4 text-2xl font-bold text-white tracking-tight flex-1">Assets Library</h1>
        <Button color="indigo" className="flex items-center gap-2 shadow-md" onClick={() => setShowUpload(true)}>
          <ArrowUpTrayIcon className="h-5 w-5" /> Upload Asset
        </Button>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        {/* Card: Search & Filter */}
        <section className="bg-white rounded-2xl shadow p-6 mb-8 border border-indigo-50">
          <h2 className="font-semibold text-indigo-900 text-lg mb-4">Find Assets</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <TextInput
              icon={MagnifyingGlassIcon}
              placeholder="Search assets by name or tag..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </section>
        {/* Card: Asset Grid */}
        <section className="bg-white rounded-2xl shadow p-6 border border-indigo-50">
          <h2 className="font-semibold text-indigo-900 text-lg mb-6">Your Media Assets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Upload card */}
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 hover:border-indigo-400 transition-colors cursor-pointer h-52 rounded-xl bg-indigo-50/40 shadow-sm"
              onClick={() => setShowUpload(true)}
              tabIndex={0}
              role="button"
              aria-label="Upload New Asset"
              onKeyDown={e => (e.key === "Enter" || e.key === " ") && setShowUpload(true)}
            >
              <ArrowUpTrayIcon className="h-10 w-10 text-indigo-500 mb-2" />
              <span className="font-semibold text-indigo-700">Upload New Asset</span>
            </div>
            {/* Asset cards */}
            {filteredAssets.map(asset => (
              <div
                key={asset.id}
                className={`relative group cursor-pointer transition-shadow hover:shadow-lg border ${selectedAsset && selectedAsset.id === asset.id ? 'ring-2 ring-indigo-400' : 'border-indigo-100'} rounded-xl bg-white shadow-sm flex flex-col`}
                onClick={() => setSelectedAsset(asset)}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${asset.fileName}`}
                onKeyDown={e => (e.key === "Enter" || e.key === " ") && setSelectedAsset(asset)}
              >
                <div className="absolute top-2 right-2 z-10">
                  {asset.transcoded ? (
                    <Badge color="indigo" size="xs">Transcoded</Badge>
                  ) : (
                    <Badge color="gray" size="xs">Original</Badge>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center h-24 mb-2">
                  {getAssetIcon(asset.fileType)}
                  {asset.thumbnailUrl && (
                    <Image
                      src={asset.thumbnailUrl}
                      alt={asset.alt || asset.fileName}
                      width={56}
                      height={56}
                      className="rounded shadow-md object-cover mt-2"
                    />
                  )}
                </div>
                <span className="truncate font-semibold text-indigo-900 text-sm mb-1 text-center w-full px-2">{asset.fileName}</span>
                <span className="text-xs text-gray-500 text-center w-full mb-2">{formatFileSize(asset.fileSize)}</span>
                <div className="flex flex-wrap gap-1 justify-center mt-auto mb-3 px-2">
                  {asset.tags.slice(0, 2).map((tag, i) => (
                    <Badge key={i} color="gray" size="xs">{tag}</Badge>
                  ))}
                  {asset.tags.length > 2 && <Badge color="gray" size="xs">+{asset.tags.length - 2}</Badge>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      {/* Asset Details Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transition-transform duration-300 ${selectedAsset ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="sticky top-0 bg-gradient-to-br from-indigo-50 to-white/80 border-b border-indigo-100 px-6 py-4 flex items-center gap-3 z-10">
          <button
            type="button"
            className="rounded-full bg-white p-1 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-label="Back to Assets"
            onClick={() => setSelectedAsset(null)}
          >
            <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">Asset Details</h2>
        </div>
        {selectedAsset && (
          <div className="p-6 overflow-y-auto h-[calc(100vh-64px)]">
            <div className="flex flex-col items-center">
              {selectedAsset.thumbnailUrl ? (
                <Image src={selectedAsset.thumbnailUrl} alt={selectedAsset.alt || selectedAsset.fileName} width={120} height={120} className="rounded shadow-md object-cover" />
              ) : (
                getAssetIcon(selectedAsset.fileType, 'h-16 w-16 text-indigo-400')
              )}
              <span className="font-semibold text-indigo-900 text-lg mt-4 mb-2 text-center">{selectedAsset.fileName}</span>
              <span className="text-xs text-gray-500 mb-4 text-center">{formatFileSize(selectedAsset.fileSize)} • {selectedAsset.fileType}</span>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <span className="text-gray-500 text-sm">Tags</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedAsset.tags.map((tag, i) => (
                    <Badge key={i} icon={TagIcon} color="gray" size="sm" className="mr-1 mt-1">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-500 text-sm">Uploaded</span>
                  <span className="font-medium text-sm">{selectedAsset.uploadedAt.toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Used In</span>
                  <span className="font-medium text-sm">{selectedAsset.usageLocations.length} items</span>
                </div>
              </div>
              {selectedAsset.dimensions && (
                <div>
                  <span className="text-gray-500 text-sm">Dimensions</span>
                  <span className="font-medium text-sm">{selectedAsset.dimensions.width} x {selectedAsset.dimensions.height}</span>
                </div>
              )}
              {selectedAsset.duration && (
                <div>
                  <span className="text-gray-500 text-sm">Duration</span>
                  <span className="font-medium text-sm">{formatDuration(selectedAsset.duration)}</span>
                </div>
              )}
              <div>
                <span className="text-gray-500 text-sm">Alt Text</span>
                <span className="font-medium text-sm">{selectedAsset.alt || 'No alt text provided'}</span>
              </div>
              {selectedAsset.versions && selectedAsset.versions.length > 0 && (
                <div>
                  <span className="text-gray-500 text-sm">Transcoded Versions</span>
                  <div className="mt-1 space-y-2">
                    {selectedAsset.versions.map((version, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{version.quality}</span>
                        <span className="text-sm text-gray-500">{formatFileSize(version.fileSize)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex space-x-3">
              <Button variant="secondary" className="flex-1">Edit Details</Button>
              <Button color="indigo" className="flex-1">Download</Button>
            </div>
          </div>
        )}
      </div>
      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2"><ArrowUpTrayIcon className="h-5 w-5" /> Upload Asset</h3>
            <input type="file" className="block w-full mb-4" />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowUpload(false)}>
                Cancel
              </Button>
              <Button color="indigo" onClick={() => setShowUpload(false)}>
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
