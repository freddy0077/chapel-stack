"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShareIcon, 
  DocumentIcon, 
  DocumentTextIcon,
  PhotoIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  FolderIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';

// Resource types
const resourceTypes = [
  { id: 'all', name: 'All Resources' },
  { id: 'documents', name: 'Documents' },
  { id: 'images', name: 'Images & Media' },
  { id: 'templates', name: 'Templates' },
  { id: 'liturgical', name: 'Liturgical Resources' }
];

// Status options for resource sharing
const statusOptions = [
  { id: 'all', name: 'All Statuses' },
  { id: 'shared', name: 'Shared' },
  { id: 'pending', name: 'Pending Approval' },
  { id: 'private', name: 'Private' }
];

// Mock resource data
const mockResources = [
  {
    id: 'res-001',
    name: 'Baptism Certificate Template',
    type: 'templates',
    format: 'docx',
    thumbnail: 'https://placehold.co/400x300/indigo/white?text=Baptism+Template',
    uploadedBy: 'St. Mary\'s Cathedral',
    uploadDate: '2025-03-15T10:30:00Z',
    size: '245 KB',
    status: 'shared',
    sharedWith: 'All Branches',
    downloads: 78
  },
  {
    id: 'res-002',
    name: 'Youth Ministry Handbook',
    type: 'documents',
    format: 'pdf',
    thumbnail: 'https://placehold.co/400x300/blue/white?text=Youth+Handbook',
    uploadedBy: 'Diocese Administration',
    uploadDate: '2025-03-10T14:15:00Z',
    size: '3.2 MB',
    status: 'shared',
    sharedWith: 'All Branches',
    downloads: 56
  },
  {
    id: 'res-003',
    name: 'Easter Service Program',
    type: 'liturgical',
    format: 'pdf',
    thumbnail: 'https://placehold.co/400x300/purple/white?text=Easter+Program',
    uploadedBy: 'Sacred Heart Parish',
    uploadDate: '2025-03-20T09:45:00Z',
    size: '1.8 MB',
    status: 'shared',
    sharedWith: 'Northern Region Branches',
    downloads: 42
  },
  {
    id: 'res-004',
    name: 'Church Logo Pack',
    type: 'images',
    format: 'zip',
    thumbnail: 'https://placehold.co/400x300/teal/white?text=Logo+Pack',
    uploadedBy: 'Diocese Administration',
    uploadDate: '2025-02-28T11:20:00Z',
    size: '8.5 MB',
    status: 'shared',
    sharedWith: 'All Branches',
    downloads: 104
  },
  {
    id: 'res-005',
    name: 'Financial Reporting Template',
    type: 'templates',
    format: 'xlsx',
    thumbnail: 'https://placehold.co/400x300/amber/white?text=Financial+Template',
    uploadedBy: 'Diocese Administration',
    uploadDate: '2025-03-05T16:40:00Z',
    size: '320 KB',
    status: 'shared',
    sharedWith: 'All Branches',
    downloads: 89
  },
  {
    id: 'res-006',
    name: 'Communion Service Guidelines',
    type: 'liturgical',
    format: 'pdf',
    thumbnail: 'https://placehold.co/400x300/rose/white?text=Communion+Guidelines',
    uploadedBy: 'St. Joseph\'s Church',
    uploadDate: '2025-03-18T13:10:00Z',
    size: '1.4 MB',
    status: 'pending',
    sharedWith: 'Pending Approval',
    downloads: 0
  },
  {
    id: 'res-007',
    name: 'Branch Event Photos',
    type: 'images',
    format: 'zip',
    thumbnail: 'https://placehold.co/400x300/green/white?text=Event+Photos',
    uploadedBy: 'St. Mary\'s Cathedral',
    uploadDate: '2025-03-22T10:00:00Z',
    size: '15.6 MB',
    status: 'private',
    sharedWith: 'Not Shared',
    downloads: 3
  }
];

// Shared resource requests for approval
const pendingRequests = [
  {
    id: 'req-001',
    resourceName: 'Communion Service Guidelines',
    requestedBy: 'St. Joseph\'s Church',
    requestDate: '2025-03-18T13:10:00Z',
    requestedSharing: 'Southern Region Branches',
    status: 'pending'
  },
  {
    id: 'req-002',
    resourceName: 'Member Transfer Process Document',
    requestedBy: 'Sacred Heart Parish',
    requestDate: '2025-03-17T11:45:00Z',
    requestedSharing: 'All Branches',
    status: 'pending'
  }
];

export default function ResourceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Filter resources based on search, type, and status
  const filteredResources = mockResources
    .filter(resource => 
      resource.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(resource => selectedType === 'all' || resource.type === selectedType)
    .filter(resource => selectedStatus === 'all' || resource.status === selectedStatus);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center mb-2">
          <Link 
            href="/dashboard/admin" 
            className="inline-flex items-center justify-center mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resource Sharing</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Manage and coordinate resources shared between branches
        </p>
      </header>

      <Tab.Group selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-6">
          <Tab 
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-colors
               ${selected 
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-white/[0.12] dark:hover:bg-gray-700/[0.5]'}`
            }
          >
            All Resources
          </Tab>
          <Tab 
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-colors
               ${selected 
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-white/[0.12] dark:hover:bg-gray-700/[0.5]'}`
            }
          >
            Pending Approvals ({pendingRequests.length})
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="relative max-w-xs w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                  placeholder="Search resources..."
                />
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                >
                  {resourceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>

                <Link
                  href="/dashboard/admin/resources/upload"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  <span>Upload</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <div key={resource.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                    <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={resource.thumbnail}
                        alt={resource.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${resource.status === 'shared' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 
                           resource.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' : 
                           'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
                        >
                          {resource.status === 'shared' ? 'Shared' : 
                           resource.status === 'pending' ? 'Pending' : 'Private'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          {resource.format === 'pdf' && <DocumentTextIcon className="h-8 w-8 text-red-500 mr-3" />}
                          {resource.format === 'docx' && <DocumentIcon className="h-8 w-8 text-blue-500 mr-3" />}
                          {resource.format === 'xlsx' && <DocumentIcon className="h-8 w-8 text-green-500 mr-3" />}
                          {resource.format === 'zip' && <FolderIcon className="h-8 w-8 text-amber-500 mr-3" />}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {resource.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {resource.format.toUpperCase()} • {resource.size}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <div className="flex justify-between mb-1">
                          <span>Uploaded by:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{resource.uploadedBy}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Date:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{formatDate(resource.uploadDate)}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span>Shared with:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{resource.sharedWith}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Downloads:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{resource.downloads}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between">
                        <button
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          onClick={() => {
                            // In a real app, would show sharing options
                            alert(`Manage sharing for ${resource.name}`);
                          }}
                        >
                          <ShareIcon className="h-4 w-4 mr-1.5" />
                          Share
                        </button>
                        <Link
                          href="#"
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
                          Download
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-white dark:bg-gray-800 rounded-lg">
                  <DocumentIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No resources found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/admin/resources/upload"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      <PlusCircleIcon className="mr-2 h-5 w-5" />
                      Upload New Resource
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pending Resource Sharing Requests</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Review and approve resource sharing requests from branches
                </p>
              </div>
              
              {pendingRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Resource
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Requested By
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Sharing Level
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {pendingRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 p-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                <DocumentIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {request.resourceName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {request.requestedBy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(request.requestDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                              {request.requestedSharing}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                className="inline-flex items-center px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                onClick={() => {
                                  // In a real app, would show confirmation dialog
                                  alert(`Reject request for ${request.resourceName}`);
                                }}
                              >
                                Reject
                              </button>
                              <button
                                className="inline-flex items-center px-3 py-1.5 rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                                onClick={() => {
                                  // In a real app, would process approval
                                  alert(`Approve request for ${request.resourceName}`);
                                }}
                              >
                                Approve
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <ShareIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pending requests</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    There are currently no pending resource sharing requests.
                  </p>
                </div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resource Sharing Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-2">
                <BookmarkIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white">Sharing Best Practices</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2"></span>
                <span>Ensure all shared resources comply with copyright laws and diocesan guidelines.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2"></span>
                <span>Use descriptive file names and include relevant metadata for searchability.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2"></span>
                <span>Consider the appropriate sharing level (diocesan, regional, or branch-specific).</span>
              </li>
            </ul>
          </div>

          <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg mr-2">
                <ShareIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white">Approval Process</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Resources submitted for sharing require approval:
            </p>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                <span>Branch-level resources: Approved by branch administrators</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                <span>Regional resources: Approved by regional directors</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                <span>Diocesan resources: Approved by diocesan administrators</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
