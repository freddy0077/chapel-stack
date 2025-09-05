"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { Child } from "./ChildrenList";

interface ChildDetailModalProps {
  child: Child;
  onClose: () => void;
}

export default function ChildDetailModal({
  child,
  onClose,
}: ChildDetailModalProps) {
  // Calculate age more precisely for display
  const birthDate = new Date(child.birthdate);
  const formattedBirthdate = birthDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {child.firstName} {child.lastName}
              </h3>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <span className="mr-1">ID:</span>
                <span className="font-mono">{child.id}</span>
                <span
                  className={`ml-3 inline-flex rounded-full px-2 text-xs font-semibold ${
                    child.checkedIn
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {child.checkedIn ? "Checked In" : "Not Checked In"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {child.age} years old
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Age Group</dt>
                <dd className="mt-1 text-sm text-gray-900">{child.ageGroup}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Birthdate</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formattedBirthdate}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Classroom</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {child.classroom}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Parent/Guardian
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {child.parentName} • {child.parentPhone}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {child.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {child.allergies.map((allergy) => (
                        <span
                          key={allergy}
                          className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">No known allergies</span>
                  )}
                </dd>
              </div>
              {child.notes && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900">{child.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="mt-5 border-t border-gray-200 pt-5 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {child.checkedIn ? "Check Out" : "Check In"}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
