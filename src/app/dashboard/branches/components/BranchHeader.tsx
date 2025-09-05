"use client";

import Link from "next/link";
import Image from "next/image";
import {
  PencilIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

interface BranchHeaderProps {
  branch: {
    id: string;
    name: string;
    code: string;
    address?: string;
    city: string;
    state: string;
    mainPastor: string;
    establishedDate: string;
    isActive: boolean;
    logo?: string;
    coverImage?: string;
    website?: string;
  };
}

export default function BranchHeader({ branch }: BranchHeaderProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600">
        {branch.coverImage ? (
          <Image
            src={branch.coverImage}
            alt={`${branch.name} cover`}
            fill
            priority
            className="object-cover w-full"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/dashboard/branches"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm text-gray-700 dark:text-gray-200 hover:bg-white hover:text-indigo-600 dark:hover:bg-gray-800 dark:hover:text-indigo-400 transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Back to branches</span>
          </Link>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          {branch.isActive ? (
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-medium text-white shadow-md border border-white/20">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </div>
              Active
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-4 py-2 text-sm font-medium text-white shadow-md border border-white/20">
              <XCircleIcon className="h-4 w-4 text-white" />
              Inactive
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 mb-6 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
            {/* Logo/Avatar */}
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-xl ring-4 ring-white dark:ring-gray-800 shadow-lg bg-white dark:bg-gray-700 flex-shrink-0">
              {branch.logo ? (
                <Image
                  src={branch.logo}
                  alt={branch.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                  <span className="text-2xl font-bold">{branch.code}</span>
                </div>
              )}
            </div>

            {/* Branch Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {branch.name}
                </h1>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/branches/${branch.id}/edit`}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <PencilIcon
                      className="-ml-0.5 mr-2 h-4 w-4"
                      aria-hidden="true"
                    />
                    Edit Branch
                  </Link>

                  {branch.website && (
                    <Link
                      href={branch.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                    >
                      <ArrowTopRightOnSquareIcon
                        className="-ml-0.5 mr-2 h-4 w-4"
                        aria-hidden="true"
                      />
                      Visit Website
                    </Link>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPinIcon
                    className="h-4 w-4 mr-2 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    {branch.city}, {branch.state}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <CalendarIcon
                    className="h-4 w-4 mr-2 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    Established{" "}
                    {new Date(branch.establishedDate).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <UserIcon
                    className="h-4 w-4 mr-2 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span>Pastor: {branch.mainPastor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
