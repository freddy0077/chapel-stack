"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  DocumentIcon,
  FolderIcon,
  ArrowDownTrayIcon,
  UserIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import type { Resource } from "../ResourceLibrary";

interface ResourceDetailsModalProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResourceDetailsModal({
  resource,
  isOpen,
  onClose,
}: ResourceDetailsModalProps) {
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
  const getFileIcon = () => {
    if (resource.type === "folder") {
      return (
        <FolderIcon className="h-8 w-8 text-yellow-500" aria-hidden="true" />
      );
    } else {
      return (
        <DocumentIcon className="h-8 w-8 text-blue-500" aria-hidden="true" />
      );
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div>
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center">
                      {getFileIcon()}
                    </div>
                    <div className="ml-4">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        {resource.title}
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        {resource.type === "folder"
                          ? "Folder"
                          : resource.fileType.toUpperCase()}
                        {" • "}
                        {resource.size}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500">
                      Description
                    </h4>
                    <p className="mt-2 text-sm text-gray-700">
                      {resource.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <UserIcon
                            className="mr-1 h-4 w-4"
                            aria-hidden="true"
                          />
                          Uploaded By
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {resource.uploadedBy}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <CalendarIcon
                            className="mr-1 h-4 w-4"
                            aria-hidden="true"
                          />
                          Upload Date
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatDate(resource.uploadDate)}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Category
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {resource.category}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {resource.type === "document" && (
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium text-gray-500">
                        Preview
                      </h4>
                      <div className="mt-2 bg-gray-50 p-6 rounded-md flex items-center justify-center">
                        <p className="text-sm text-gray-500 italic">
                          File preview would be displayed here in a full
                          implementation.
                        </p>
                      </div>
                    </div>
                  )}

                  {resource.type === "folder" && (
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium text-gray-500">
                        Contents
                      </h4>
                      <div className="mt-2">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Name
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Type
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Size
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {/* This would be populated with actual folder contents in a full implementation */}
                              <tr>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  <div className="flex items-center">
                                    <DocumentIcon
                                      className="h-5 w-5 text-blue-500 mr-2"
                                      aria-hidden="true"
                                    />
                                    Example File 1.pdf
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  PDF
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  2.3 MB
                                </td>
                              </tr>
                              <tr>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  <div className="flex items-center">
                                    <DocumentIcon
                                      className="h-5 w-5 text-blue-500 mr-2"
                                      aria-hidden="true"
                                    />
                                    Example File 2.docx
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  DOCX
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  1.1 MB
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <ArrowDownTrayIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Download
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
