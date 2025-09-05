"use client";

import {
  DocumentIcon,
  FolderIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

// Mock data for resources
export const mockResources = [
  {
    id: 1,
    title: "Easter Worship Guide",
    type: "document",
    fileType: "pdf",
    size: "1.2 MB",
    uploadedBy: "Pastor John Smith",
    uploadDate: "2025-03-15",
    description:
      "Complete worship guide for Easter service including order of service and readings.",
    url: "#",
    category: "Service Guides",
  },
  {
    id: 2,
    title: "Church Branding Kit",
    type: "folder",
    fileType: "folder",
    size: "15 MB",
    uploadedBy: "Admin Team",
    uploadDate: "2025-01-10",
    description:
      "Church logos, colors, and branding resources for use in worship presentations.",
    url: "#",
    category: "Media Assets",
  },
  {
    id: 3,
    title: "Amazing Grace - Lead Sheet",
    type: "document",
    fileType: "pdf",
    size: "250 KB",
    uploadedBy: "Sarah Williams",
    uploadDate: "2025-02-20",
    description:
      "Lead sheet with lyrics, chords, and melody for Amazing Grace.",
    url: "#",
    category: "Sheet Music",
  },
  {
    id: 4,
    title: "How Great Thou Art - Piano Score",
    type: "document",
    fileType: "pdf",
    size: "450 KB",
    uploadedBy: "Tiffany Rodriguez",
    uploadDate: "2025-02-20",
    description: "Full piano arrangement for How Great Thou Art.",
    url: "#",
    category: "Sheet Music",
  },
  {
    id: 5,
    title: "Communion Service Guide",
    type: "document",
    fileType: "docx",
    size: "320 KB",
    uploadedBy: "Pastor Michelle Davis",
    uploadDate: "2025-01-25",
    description: "Script and order of service for communion Sundays.",
    url: "#",
    category: "Service Guides",
  },
  {
    id: 6,
    title: "Easter Background Loops",
    type: "folder",
    fileType: "folder",
    size: "1.5 GB",
    uploadedBy: "Media Team",
    uploadDate: "2025-03-10",
    description:
      "Collection of motion backgrounds for Easter service projections.",
    url: "#",
    category: "Media Assets",
  },
  {
    id: 7,
    title: "Worship Team Handbook",
    type: "document",
    fileType: "pdf",
    size: "2.1 MB",
    uploadedBy: "Sarah Williams",
    uploadDate: "2025-01-15",
    description:
      "Guidelines, expectations, and resources for worship team members.",
    url: "#",
    category: "Team Resources",
  },
  {
    id: 8,
    title: "Sound System Manual",
    type: "document",
    fileType: "pdf",
    size: "5.6 MB",
    uploadedBy: "Tech Team",
    uploadDate: "2025-01-05",
    description:
      "Comprehensive guide to operating the church sound system and equipment.",
    url: "#",
    category: "Technical Guides",
  },
  {
    id: 9,
    title: "10,000 Reasons - Chord Chart",
    type: "document",
    fileType: "pdf",
    size: "180 KB",
    uploadedBy: "David Chen",
    uploadDate: "2025-02-12",
    description: "Simple chord chart with lyrics for 10,000 Reasons.",
    url: "#",
    category: "Sheet Music",
  },
  {
    id: 10,
    title: "ProPresenter Templates",
    type: "folder",
    fileType: "folder",
    size: "350 MB",
    uploadedBy: "Tech Team",
    uploadDate: "2025-02-01",
    description: "Template files for ProPresenter worship presentations.",
    url: "#",
    category: "Technical Guides",
  },
  {
    id: 11,
    title: "Good Friday Script",
    type: "document",
    fileType: "docx",
    size: "410 KB",
    uploadedBy: "Pastor John Smith",
    uploadDate: "2025-03-20",
    description:
      "Complete script for Good Friday service including readings and cues.",
    url: "#",
    category: "Service Guides",
  },
  {
    id: 12,
    title: "Living Hope - Full Band Score",
    type: "document",
    fileType: "pdf",
    size: "1.4 MB",
    uploadedBy: "Sarah Williams",
    uploadDate: "2025-03-01",
    description: "Complete arrangements for all instruments for Living Hope.",
    url: "#",
    category: "Sheet Music",
  },
];

export interface Resource {
  id: number;
  title: string;
  type: "document" | "folder";
  fileType: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  description: string;
  url: string;
  category: string;
}

interface ResourceLibraryProps {
  resources: Resource[];
  onViewResource: (resource: Resource) => void;
  onUploadResource: () => void;
}

export default function ResourceLibrary({
  resources,
  onViewResource,
  onUploadResource,
}: ResourceLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  // Get all unique categories from resources
  const allCategories = [
    "All Categories",
    ...new Set(resources.map((resource) => resource.category)),
  ].sort();

  // Filter resources based on search term and category
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All Categories" ||
      resource.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get icon based on file type
  const getFileIcon = (resource: Resource) => {
    if (resource.type === "folder") {
      return (
        <FolderIcon className="h-6 w-6 text-yellow-500" aria-hidden="true" />
      );
    } else {
      return (
        <DocumentIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          {filteredResources.length} resources in library
        </div>
        <button
          type="button"
          onClick={onUploadResource}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <ArrowDownTrayIcon
            className="-ml-0.5 mr-1.5 h-5 w-5"
            aria-hidden="true"
          />
          Upload Resource
        </button>
      </div>

      <div className="mt-2 flex flex-col sm:flex-row gap-4">
        <div className="relative rounded-md shadow-sm flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search resources..."
          />
        </div>
        <div className="w-full sm:w-60">
          <select
            id="category-filter"
            name="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Resource
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Size
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Uploaded
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredResources.map((resource) => (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <div className="flex items-center">
                          {getFileIcon(resource)}
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">
                              {resource.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {resource.fileType.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {resource.category}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {resource.size}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div>{formatDate(resource.uploadDate)}</div>
                        <div className="text-xs text-gray-400">
                          by {resource.uploadedBy}
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => onViewResource(resource)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                          <span className="sr-only">, {resource.title}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
