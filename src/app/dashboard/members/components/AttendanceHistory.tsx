"use client";

import { useState } from "react";
import { CalendarIcon, PlusIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export interface Branch {
  id: string;
  name: string;
  location: string;
  region: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  eventType: "SundayService" | "BibleStudy" | "PrayerMeeting" | "SpecialEvent" | "Other";
  eventName?: string;
  isPresent: boolean;
  notes?: string;
  branchId?: string;
  branchName?: string;
}

interface AttendanceHistoryProps {
  attendanceRecords: AttendanceRecord[];
  onAddRecord?: (record: AttendanceRecord) => void;
  onDeleteRecord?: (id: string) => void;
  isEditable?: boolean;
  availableBranches?: Branch[];
  showBranchFilter?: boolean;
  memberId?: number;
}

const formatEventType = (type: AttendanceRecord["eventType"]) => {
  switch (type) {
    case "SundayService":
      return "Sunday Service";
    case "BibleStudy":
      return "Bible Study";
    case "PrayerMeeting":
      return "Prayer Meeting";
    case "SpecialEvent":
      return "Special Event";
    default:
      return "Other";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function AttendanceHistory({
  attendanceRecords,
  onAddRecord,
  onDeleteRecord,
  isEditable = false,
  availableBranches = [],
  showBranchFilter = false,
}: AttendanceHistoryProps) {
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>("");
  const [newRecord, setNewRecord] = useState<Omit<AttendanceRecord, "id">>({
    date: new Date().toISOString().split("T")[0],
    eventType: "SundayService",
    isPresent: true,
    notes: "",
    branchId: availableBranches.length > 0 ? availableBranches[0].id : undefined,
    branchName: availableBranches.length > 0 ? availableBranches[0].name : undefined,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setNewRecord((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setNewRecord((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddRecord = () => {
    if (!onAddRecord) return;
    
    onAddRecord({
      ...newRecord,
      id: Date.now().toString(),
    });

    setNewRecord({
      date: new Date().toISOString().split("T")[0],
      eventType: "SundayService",
      isPresent: true,
      notes: "",
      branchId: newRecord.branchId,
      branchName: newRecord.branchName,
    });
    setIsAddingRecord(false);
  };

  // Filter records based on selected branch
  const filteredRecords = selectedBranchFilter
    ? attendanceRecords.filter(record => record.branchId === selectedBranchFilter)
    : attendanceRecords;
    
  // Calculate attendance stats
  const totalRecords = filteredRecords.length;
  const presentCount = filteredRecords.filter(record => record.isPresent).length;
  const attendanceRate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;
  
  // Calculate branch attendance stats
  const branchStats = availableBranches.map(branch => {
    const branchRecords = attendanceRecords.filter(record => record.branchId === branch.id);
    const branchTotal = branchRecords.length;
    const branchPresent = branchRecords.filter(record => record.isPresent).length;
    const branchRate = branchTotal > 0 ? Math.round((branchPresent / branchTotal) * 100) : 0;
    
    return {
      branchId: branch.id,
      branchName: branch.name,
      total: branchTotal,
      present: branchPresent,
      rate: branchRate
    };
  });

  // Group records by month for better display
  const recordsByMonth: Record<string, AttendanceRecord[]> = {};
  filteredRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .forEach(record => {
      const date = new Date(record.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!recordsByMonth[monthYear]) {
        recordsByMonth[monthYear] = [];
      }
      
      recordsByMonth[monthYear].push(record);
    });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Attendance History</h3>
        {isEditable && onAddRecord && (
          <button
            type="button"
            onClick={() => setIsAddingRecord(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Record
          </button>
        )}
      </div>
      
      <div className="p-6">
        {/* Branch Filter */}
        {showBranchFilter && availableBranches.length > 0 && (
          <div className="mb-6">
            <label htmlFor="branchFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Branch
            </label>
            <select
              id="branchFilter"
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Branches</option>
              {availableBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Attendance Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Total Events</h4>
            <p className="text-2xl font-semibold text-gray-900">{totalRecords}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Attended</h4>
            <p className="text-2xl font-semibold text-gray-900">{presentCount}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Attendance Rate</h4>
            <p className="text-2xl font-semibold text-gray-900">{attendanceRate}%</p>
          </div>
        </div>
        
        {/* Branch Attendance Comparison - Only show if we have branch data and more than one branch with attendance */}
        {showBranchFilter && branchStats.filter(s => s.total > 0).length > 1 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Branch Attendance Comparison</h4>
            <div className="space-y-4">
              {branchStats
                .filter(stat => stat.total > 0)
                .sort((a, b) => b.rate - a.rate)
                .map(stat => (
                  <div key={stat.branchId} className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{stat.branchName}</span>
                      <span className="text-sm font-medium text-gray-900">{stat.rate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div 
                        className={`h-2.5 rounded-full ${stat.rate > 75 ? 'bg-green-500' : stat.rate > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${stat.rate}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">{stat.present} attended</span>
                      <span className="text-xs text-gray-500">{stat.total} events</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Add New Record Form */}
        {isAddingRecord && isEditable && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Attendance Record</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newRecord.date}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={newRecord.eventType}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="SundayService">Sunday Service</option>
                  <option value="BibleStudy">Bible Study</option>
                  <option value="PrayerMeeting">Prayer Meeting</option>
                  <option value="SpecialEvent">Special Event</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-1">
                  Branch
                </label>
                <select
                  id="branchId"
                  name="branchId"
                  value={newRecord.branchId || ""}
                  onChange={(e) => {
                    const branchId = e.target.value;
                    const branch = availableBranches.find(b => b.id === branchId);
                    setNewRecord(prev => ({
                      ...prev,
                      branchId,
                      branchName: branch ? branch.name : undefined
                    }));
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {availableBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {newRecord.eventType === "SpecialEvent" || newRecord.eventType === "Other" ? (
              <div className="mb-4">
                <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={newRecord.eventName || ""}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter event name"
                />
              </div>
            ) : null}
            
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  id="isPresent"
                  name="isPresent"
                  type="checkbox"
                  checked={newRecord.isPresent}
                  onChange={(e) => setNewRecord(prev => ({ ...prev, isPresent: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isPresent" className="ml-2 block text-sm text-gray-700">
                  Was Present
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                value={newRecord.notes || ""}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Any additional notes"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingRecord(false)}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddRecord}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
              >
                Save Record
              </button>
            </div>
          </div>
        )}

        {/* Attendance Records */}
        {totalRecords === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No attendance records available.</p>
            {isEditable && onAddRecord && !isAddingRecord && (
              <button
                type="button"
                onClick={() => setIsAddingRecord(true)}
                className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
              >
                <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Add First Record
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(recordsByMonth).map(([month, records]) => (
              <div key={month}>
                <h4 className="text-md font-medium text-gray-700 mb-2">{month}</h4>
                <ul className="divide-y divide-gray-200">
                  {records.map((record) => (
                    <li key={record.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                          record.isPresent ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {record.isPresent ? (
                            <CheckIcon className="h-5 w-5 text-green-600" />
                          ) : (
                            <XMarkIcon className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {formatEventType(record.eventType)}
                            {record.eventName && ` - ${record.eventName}`}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(record.date)}</p>
                          {record.branchName && (
                            <p className="text-xs text-indigo-600">
                              {record.branchName}
                            </p>
                          )}
                          {record.notes && (
                            <p className="mt-1 text-xs text-gray-500 italic">{record.notes}</p>
                          )}
                        </div>
                      </div>
                      {isEditable && onDeleteRecord && (
                        <Menu as="div" className="relative inline-block text-left">
                          <Menu.Button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Open options</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                            </svg>
                          </Menu.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() => onDeleteRecord(record.id)}
                                      className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } group flex items-center px-4 py-2 text-sm w-full text-left`}
                                    >
                                      <XMarkIcon
                                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                      />
                                      Delete
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
