import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
// If Transition.Root is not available in your version, use <Transition> instead of <Transition.Root> below.
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { useAttendanceRecordsForSession } from '@/graphql/hooks/useAttendance';

interface AttendanceSessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  sessionName?: string;
}

export default function AttendanceSessionDetailsModal({
  isOpen,
  onClose,
  sessionId,
  sessionName,
}: AttendanceSessionDetailsModalProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { attendanceRecords: records, loading, error } = useAttendanceRecordsForSession({ sessionId });

  const filtered = records.filter((rec) => {
    const query = search.toLowerCase();
    return (
      rec.visitorName?.toLowerCase().includes(query) ||
      rec.notes?.toLowerCase().includes(query) ||
      rec.memberId?.toLowerCase().includes(query) ||
      rec.id.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-pink-50 px-0 pb-0 pt-0 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-indigo-100">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                {/* Stats bar */}
                <div className="px-6 pt-2 pb-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="bg-indigo-100 rounded-lg p-3 flex flex-col items-center shadow">
                      <span className="text-xl font-bold text-indigo-700">{records.length}</span>
                      <span className="text-xs text-indigo-700">Total Records</span>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3 flex flex-col items-center shadow">
                      <span className="text-xl font-bold text-green-700">{records.filter(r => r.visitorName).length}</span>
                      <span className="text-xs text-green-700">Visitors</span>
                    </div>
                    <div className="bg-pink-100 rounded-lg p-3 flex flex-col items-center shadow">
                      <span className="text-xl font-bold text-pink-700">{records.filter(r => r.checkInTime).length}</span>
                      <span className="text-xs text-pink-700">Checked In</span>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3 flex flex-col items-center shadow">
                      <span className="text-xl font-bold text-blue-700">{records.filter(r => r.checkOutTime).length}</span>
                      <span className="text-xs text-blue-700">Checked Out</span>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-2">
                  {loading && (
                    <div className="my-6 text-center text-gray-500">Loading records...</div>
                  )}
                  {error && (
                    <div className="my-6 text-center text-red-500">Error loading records. Please try again.</div>
                  )}
                  {!loading && !error && (
                    <>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            className="block w-full rounded-md border border-pink-200 bg-pink-50 py-2 pl-10 pr-3 text-sm placeholder-pink-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 shadow-sm transition"
                            placeholder="Search by name, email, note, or ID..."
                            value={search}
                            onChange={(e) => {
                              setSearch(e.target.value);
                              setPage(1);
                            }}
                          />
                          <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <select
                            className="block rounded-full border border-indigo-200 bg-indigo-50 text-sm px-3 py-1 focus:border-pink-400 focus:ring-pink-200 text-indigo-700 font-semibold shadow"
                            value={pageSize}
                            onChange={(e) => {
                              setPageSize(Number(e.target.value));
                              setPage(1);
                            }}
                          >
                            {[10, 20, 50, 100].map((size) => (
                              <option key={size} value={size}>{size} / page</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="overflow-x-auto rounded-2xl border border-indigo-100 bg-white/90 shadow-lg mt-4">
                        <table className="min-w-full divide-y divide-indigo-100 text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-semibold">Name</th>
                              <th className="px-4 py-2 text-left font-semibold">Check-in</th>
                              <th className="px-4 py-2 text-left font-semibold">Check-out</th>
                              <th className="px-4 py-2 text-left font-semibold">Type</th>
                              <th className="px-4 py-2 text-left font-semibold">Notes</th>
                              <th className="px-4 py-2 text-left font-semibold">Visitor?</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {paginated.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-400">No attendance records found.</td>
                              </tr>
                            ) : (
                              paginated.map((rec) => (
                                <tr key={rec.id} className="hover:bg-indigo-50 transition-colors duration-150">
                                  <td className="px-4 py-2">
                                    {rec.visitorName ? (
                                      <span>{rec.visitorName}</span>
                                    ) : rec.memberId ? (
                                      <span className="text-xs text-gray-500">Member ID: {rec.memberId}</span>
                                    ) : (
                                      <span className="italic text-gray-400">Unknown</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    {rec.checkInTime ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                        <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                                        {new Date(rec.checkInTime).toLocaleString()}
                                      </span>
                                    ) : <span className="text-gray-400">--</span>}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    {rec.checkOutTime ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full inline-block"></span>
                                        {new Date(rec.checkOutTime).toLocaleString()}
                                      </span>
                                    ) : <span className="text-gray-400">--</span>}
                                  </td>
                                  <td className="px-4 py-2">
                                    {rec.checkInMethod ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold">
                                        {rec.checkInMethod}
                                      </span>
                                    ) : <span className="text-gray-400">--</span>}
                                  </td>
                                  <td className="px-4 py-2">{rec.notes || ""}</td>
                                  <td className="px-4 py-2">
                                    {rec.visitorName ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-200 text-green-800 font-semibold">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        Visitor
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 font-semibold">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        Member
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 px-2">
                        <span className="text-sm text-indigo-700 font-medium bg-indigo-50 px-3 py-1 rounded-full shadow-sm">
                          Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}
                          -{Math.min(page * pageSize, filtered.length)} of {filtered.length}
                        </span>
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 rounded-full border border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold shadow disabled:opacity-50"
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                          >
                            Previous
                          </button>
                          <span className="px-2 text-indigo-700 font-semibold">Page {page} of {totalPages}</span>
                          <button
                            className="px-3 py-1 rounded-full border border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold shadow disabled:opacity-50"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
