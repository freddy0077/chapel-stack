"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import {
  XMarkIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  MusicalNoteIcon,
  UserGroupIcon,
  CheckIcon,
  XMarkIcon as XIcon,
  QuestionMarkCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Rehearsal, RehearsalAttendee } from "../features/RehearsalTracker";
import { ServicePlan } from "../ServicesList";

interface RehearsalDetailsModalProps {
  rehearsal: Rehearsal;
  services: ServicePlan[];
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (rehearsal: Rehearsal) => void;
  onUpdateAttendance?: (
    rehearsalId: number,
    attendance: RehearsalAttendee[],
  ) => void;
  onComplete?: (rehearsalId: number, completed: boolean) => void;
}

export default function RehearsalDetailsModal({
  rehearsal,
  services,
  isOpen,
  onClose,
  onEdit,
  onUpdateAttendance,
  onComplete,
}: RehearsalDetailsModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [attendanceData, setAttendanceData] = useState<RehearsalAttendee[]>(
    rehearsal.teamMembers,
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get service data if linked
  const linkedService = rehearsal.serviceId
    ? services.find((s) => s.id === rehearsal.serviceId)
    : null;

  // Calculate formatted duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours > 1 ? "s" : ""}${remainingMinutes > 0 ? ` ${remainingMinutes} minutes` : ""}`;
  };

  // Check if rehearsal is in the past
  const isRehearsalPast = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rehearsalDate = new Date(rehearsal.date);
    rehearsalDate.setHours(0, 0, 0, 0);
    return rehearsalDate < today;
  };

  // Update attendance status for a team member
  const updateAttendance = (teamMemberId: number, attended: boolean | null) => {
    const updatedAttendance = attendanceData.map((member) => {
      if (member.teamMemberId === teamMemberId) {
        return { ...member, attended };
      }
      return member;
    });

    setAttendanceData(updatedAttendance);

    if (onUpdateAttendance) {
      onUpdateAttendance(rehearsal.id, updatedAttendance);
    }
  };

  // Update note for a team member
  const updateNote = (teamMemberId: number, note: string) => {
    const updatedAttendance = attendanceData.map((member) => {
      if (member.teamMemberId === teamMemberId) {
        return { ...member, notes: note };
      }
      return member;
    });

    setAttendanceData(updatedAttendance);

    if (onUpdateAttendance) {
      onUpdateAttendance(rehearsal.id, updatedAttendance);
    }
  };

  // Toggle completion status
  const toggleCompletionStatus = () => {
    if (onComplete) {
      onComplete(rehearsal.id, !rehearsal.completed);
    }
  };

  // Tab content definitions
  const tabs = [
    { name: "Details", icon: CalendarDaysIcon },
    { name: "Attendance", icon: UserGroupIcon },
    { name: "Songs", icon: MusicalNoteIcon },
  ];

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                        <MusicalNoteIcon
                          className="h-6 w-6 text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-4">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-semibold leading-6 text-gray-900"
                        >
                          {rehearsal.title}
                        </Dialog.Title>
                        <p className="text-sm text-gray-500">
                          {linkedService?.title || "Independent Rehearsal"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-0 flex sm:mt-0">
                      <button
                        type="button"
                        onClick={toggleCompletionStatus}
                        className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
                          rehearsal.completed
                            ? "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-700/20 hover:bg-yellow-100"
                            : "bg-green-50 text-green-700 ring-1 ring-inset ring-green-700/20 hover:bg-green-100"
                        }`}
                      >
                        {rehearsal.completed
                          ? "Mark Incomplete"
                          : "Mark Complete"}
                      </button>

                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(rehearsal)}
                          className="ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <PencilSquareIcon className="h-5 w-5 mr-1 text-gray-400" />
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
                      <Tab.List className="flex space-x-1 rounded-xl bg-indigo-50 p-1">
                        {tabs.map((tab) => (
                          <Tab
                            key={tab.name}
                            className={({ selected }) =>
                              `flex items-center w-full rounded-lg py-2.5 px-3 text-sm font-medium leading-5 ${selected ? "bg-white shadow text-indigo-700" : "text-gray-600 hover:bg-white/[0.12] hover:text-indigo-600"}`
                            }
                          >
                            <tab.icon
                              className="mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                            {tab.name}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels className="mt-4">
                        {/* Details Tab */}
                        <Tab.Panel>
                          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                      <CalendarDaysIcon
                                        className="mr-1 h-4 w-4"
                                        aria-hidden="true"
                                      />
                                      Date
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {formatDate(rehearsal.date)}
                                    </dd>
                                  </div>
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                      <ClockIcon
                                        className="mr-1 h-4 w-4"
                                        aria-hidden="true"
                                      />
                                      Time
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {rehearsal.time} (
                                      {formatDuration(rehearsal.duration)})
                                    </dd>
                                  </div>
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                      <MapPinIcon
                                        className="mr-1 h-4 w-4"
                                        aria-hidden="true"
                                      />
                                      Location
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {rehearsal.location}
                                    </dd>
                                  </div>
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                      <UserGroupIcon
                                        className="mr-1 h-4 w-4"
                                        aria-hidden="true"
                                      />
                                      Team Members
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                      {rehearsal.teamMembers.length}
                                    </dd>
                                  </div>
                                  {linkedService && (
                                    <div className="sm:col-span-2">
                                      <dt className="text-sm font-medium text-gray-500">
                                        For Service
                                      </dt>
                                      <dd className="mt-1 text-sm text-gray-900">
                                        {linkedService.title} (
                                        {new Date(
                                          linkedService.date,
                                        ).toLocaleDateString()}
                                        )
                                      </dd>
                                    </div>
                                  )}
                                </dl>
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                  Description
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                                  {rehearsal.description}
                                </dd>

                                <dt className="text-sm font-medium text-gray-500 mt-4">
                                  Notes
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                                  {rehearsal.notes || "No notes"}
                                </dd>
                              </div>
                            </div>
                          </div>
                        </Tab.Panel>

                        {/* Attendance Tab */}
                        <Tab.Panel>
                          <div className="px-4 py-5 sm:px-6">
                            <h4 className="text-sm font-medium text-gray-900">
                              Team Attendance
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              {isRehearsalPast()
                                ? "Record who attended this rehearsal"
                                : "Track who has confirmed attendance"}
                            </p>

                            <div className="mt-4 flow-root">
                              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle">
                                  <table className="min-w-full border-separate border-spacing-0">
                                    <thead>
                                      <tr>
                                        <th
                                          scope="col"
                                          className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                                        >
                                          Name
                                        </th>
                                        <th
                                          scope="col"
                                          className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                          Role
                                        </th>
                                        <th
                                          scope="col"
                                          className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                          Status
                                        </th>
                                        <th
                                          scope="col"
                                          className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                                        >
                                          Notes
                                        </th>
                                        {isRehearsalPast() && (
                                          <th
                                            scope="col"
                                            className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                                          >
                                            <span className="sr-only">
                                              Actions
                                            </span>
                                          </th>
                                        )}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {attendanceData.map((member) => (
                                        <tr key={member.teamMemberId}>
                                          <td
                                            className={`border-b border-gray-200 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8`}
                                          >
                                            {member.name}
                                          </td>
                                          <td className="border-b border-gray-200 px-3 py-4 text-sm text-gray-500">
                                            {member.role}
                                          </td>
                                          <td className="border-b border-gray-200 px-3 py-4 text-sm text-gray-500">
                                            {isRehearsalPast() ? (
                                              <span
                                                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                                  member.attended === true
                                                    ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                                                    : member.attended === false
                                                      ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                                                      : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10"
                                                }`}
                                              >
                                                {member.attended === true
                                                  ? "Attended"
                                                  : member.attended === false
                                                    ? "Absent"
                                                    : "Not Marked"}
                                              </span>
                                            ) : (
                                              <span
                                                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                                  member.confirmed
                                                    ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                                                    : "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                                                }`}
                                              >
                                                {member.confirmed
                                                  ? "Confirmed"
                                                  : "Unconfirmed"}
                                              </span>
                                            )}
                                          </td>
                                          <td className="border-b border-gray-200 px-3 py-4 text-sm text-gray-500">
                                            <input
                                              type="text"
                                              value={member.notes}
                                              onChange={(e) =>
                                                updateNote(
                                                  member.teamMemberId,
                                                  e.target.value,
                                                )
                                              }
                                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                              placeholder="Add notes..."
                                            />
                                          </td>
                                          {isRehearsalPast() && (
                                            <td className="border-b border-gray-200 py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                                              <div className="flex space-x-2">
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    updateAttendance(
                                                      member.teamMemberId,
                                                      true,
                                                    )
                                                  }
                                                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                                    member.attended === true
                                                      ? "bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20"
                                                      : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10 hover:bg-green-50 hover:text-green-700"
                                                  }`}
                                                >
                                                  <CheckIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    updateAttendance(
                                                      member.teamMemberId,
                                                      false,
                                                    )
                                                  }
                                                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                                    member.attended === false
                                                      ? "bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/20"
                                                      : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10 hover:bg-red-50 hover:text-red-700"
                                                  }`}
                                                >
                                                  <XIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    updateAttendance(
                                                      member.teamMemberId,
                                                      null,
                                                    )
                                                  }
                                                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                                    member.attended === null
                                                      ? "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-600/20"
                                                      : "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10 hover:bg-gray-100"
                                                  }`}
                                                >
                                                  <QuestionMarkCircleIcon className="h-4 w-4" />
                                                </button>
                                              </div>
                                            </td>
                                          )}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Tab.Panel>

                        {/* Songs Tab */}
                        <Tab.Panel>
                          <div className="px-4 py-5 sm:px-6">
                            <h4 className="text-sm font-medium text-gray-900">
                              Songs to Rehearse
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              {rehearsal.songs.length} songs planned for this
                              rehearsal
                            </p>

                            {rehearsal.songs.length > 0 ? (
                              <ul className="mt-4 divide-y divide-gray-100">
                                {rehearsal.songs.map((song, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center justify-between gap-x-6 py-5"
                                  >
                                    <div className="flex min-w-0 gap-x-4">
                                      <div className="h-10 w-10 flex-none rounded-full bg-indigo-50 flex items-center justify-center">
                                        <MusicalNoteIcon className="h-5 w-5 text-indigo-500" />
                                      </div>
                                      <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">
                                          {song}
                                        </p>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                          {linkedService?.songs.find(
                                            (s) => s.title === song,
                                          )?.key || ""}
                                          {linkedService?.songs.find(
                                            (s) => s.title === song,
                                          )?.artist
                                            ? ` • ${linkedService.songs.find((s) => s.title === song)?.artist}`
                                            : ""}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="mt-4 text-center py-12 px-4">
                                <MusicalNoteIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                  No songs specified
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                  No specific songs have been listed for this
                                  rehearsal.
                                </p>
                              </div>
                            )}
                          </div>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={onClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
