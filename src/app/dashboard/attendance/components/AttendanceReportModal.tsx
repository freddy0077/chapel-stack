"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface AttendanceRecord {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
  totalAttendees: number;
  childrenCount: number;
  youthCount: number;
  adultsCount: number;
  volunteers: number;
  firstTimeVisitors: number;
}

interface AttendanceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceData: AttendanceRecord[];
}

export default function AttendanceReportModal({
  isOpen,
  onClose,
  attendanceData,
}: AttendanceReportModalProps) {
  const [reportType, setReportType] = useState("summary");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [includeOptions, setIncludeOptions] = useState({
    demographics: true,
    visitors: true,
    volunteers: true,
    trends: true,
  });
  const [reportFormat, setReportFormat] = useState("pdf");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOptionChange = (option: keyof typeof includeOptions) => {
    setIncludeOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      onClose();

      // In a real app, this would trigger a download or open a new window
      alert(
        "Report generated successfully! In a real app, this would download the report.",
      );
    }, 2000);
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Generate Attendance Report
                    </Dialog.Title>
                    <div className="mt-4 space-y-6">
                      {/* Report Type Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Report Type
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              id="summary"
                              name="report-type"
                              type="radio"
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={reportType === "summary"}
                              onChange={() => setReportType("summary")}
                            />
                            <label
                              htmlFor="summary"
                              className="ml-3 block text-sm font-medium text-gray-700"
                            >
                              Summary Report
                              <p className="text-xs text-gray-500">
                                Overview of attendance with key metrics
                              </p>
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="detailed"
                              name="report-type"
                              type="radio"
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={reportType === "detailed"}
                              onChange={() => setReportType("detailed")}
                            />
                            <label
                              htmlFor="detailed"
                              className="ml-3 block text-sm font-medium text-gray-700"
                            >
                              Detailed Report
                              <p className="text-xs text-gray-500">
                                Complete breakdown of all attendance records
                              </p>
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="comparative"
                              name="report-type"
                              type="radio"
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={reportType === "comparative"}
                              onChange={() => setReportType("comparative")}
                            />
                            <label
                              htmlFor="comparative"
                              className="ml-3 block text-sm font-medium text-gray-700"
                            >
                              Comparative Report
                              <p className="text-xs text-gray-500">
                                Compare attendance across different time periods
                              </p>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Date Range Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date Range
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="start-date" className="sr-only">
                              Start Date
                            </label>
                            <input
                              type="date"
                              id="start-date"
                              name="start-date"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={dateRange.start}
                              onChange={(e) =>
                                setDateRange({
                                  ...dateRange,
                                  start: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label htmlFor="end-date" className="sr-only">
                              End Date
                            </label>
                            <input
                              type="date"
                              id="end-date"
                              name="end-date"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              value={dateRange.end}
                              onChange={(e) =>
                                setDateRange({
                                  ...dateRange,
                                  end: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Include Options */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Include in Report
                        </label>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              id="demographics"
                              name="demographics"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={includeOptions.demographics}
                              onChange={() =>
                                handleOptionChange("demographics")
                              }
                            />
                            <label
                              htmlFor="demographics"
                              className="ml-3 block text-sm font-medium text-gray-700"
                            >
                              Demographic Breakdown (adults, youth, children)
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="visitors"
                              name="visitors"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={includeOptions.visitors}
                              onChange={() => handleOptionChange("visitors")}
                            />
                            <label
                              htmlFor="visitors"
                              className="ml-3 block text-sm font-medium text-gray-700"
                            >
                              First-time Visitor Statistics
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="volunteers"
                              name="volunteers"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={includeOptions.volunteers}
                              onChange={() => handleOptionChange("volunteers")}
                            />
                            <label
                              htmlFor="volunteers"
                              className="ml-3 block text-sm font-medium text-gray-700"
                            >
                              Volunteer Participation
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="trends"
                              name="trends"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={includeOptions.trends}
                              onChange={() => handleOptionChange("trends")}
                            />
                            <label
                              htmlFor="trends"
                              className="ml-3 block text-sm font-medium text-gray-700"
                            >
                              Attendance Trends and Graphs
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Report Format */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Report Format
                        </label>
                        <select
                          id="report-format"
                          name="report-format"
                          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          value={reportFormat}
                          onChange={(e) => setReportFormat(e.target.value)}
                        >
                          <option value="pdf">PDF Document</option>
                          <option value="excel">Excel Spreadsheet</option>
                          <option value="csv">CSV File</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <ArrowDownTrayIcon
                          className="-ml-0.5 mr-1.5 h-4 w-4"
                          aria-hidden="true"
                        />
                        Generate Report
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    Cancel
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
