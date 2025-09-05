"use client";

import { PlusCircleIcon } from "@heroicons/react/24/outline";

interface ChildrenHeaderProps {
  onOpenAddChild: () => void;
}

export default function ChildrenHeader({
  onOpenAddChild,
}: ChildrenHeaderProps) {
  return (
    <div className="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          Children's Ministry
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage children's profiles, check-ins, and classroom assignments
        </p>
      </div>
      <div className="mt-4 sm:mt-0">
        <button
          type="button"
          onClick={onOpenAddChild}
          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusCircleIcon className="h-5 w-5 inline mr-1 -mt-1" />
          Add Child
        </button>
      </div>
    </div>
  );
}
