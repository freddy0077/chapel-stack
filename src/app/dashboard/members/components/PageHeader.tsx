"use client";

import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

type PageHeaderProps = {
  title: string;
  description: string;
  actionLink?: string;
  actionLabel?: string;
};

export default function PageHeader({ 
  title, 
  description, 
  actionLink = "",
  actionLabel = "Add new"
}: PageHeaderProps) {
  return (
    <div className="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
      {actionLink && (
        <div className="mt-4 sm:mt-0">
          <Link href={actionLink}>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              {actionLabel}
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
