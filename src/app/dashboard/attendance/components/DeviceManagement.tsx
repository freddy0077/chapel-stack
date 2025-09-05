"use client";

import React, { useState, useEffect } from "react";
import { CardDevice, AttendanceEvent } from "../types";
import { mockDevices, mockEvents } from "../services/mockData";
import {
  ComputerDesktopIcon,
  DeviceTabletIcon,
  DevicePhoneMobileIcon,
  WifiIcon,
  BoltIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function DeviceManagement() {
  const [devices, setDevices] = useState<CardDevice[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<CardDevice[]>([]);
  const [events, setEvents] = useState<AttendanceEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "online" | "offline" | "maintenance"
  >("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState("branch_001");
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState<
    "wall-mounted" | "kiosk" | "admin" | "mobile"
  >("wall-mounted");
  const [newDeviceLocation, setNewDeviceLocation] = useState("loc_001");
  const [isAssignEventModalOpen, setIsAssignEventModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load devices and events
  useEffect(() => {
    // In a real app, these would be API calls
    setDevices(mockDevices);
    setEvents(mockEvents.filter((event) => event.status === "scheduled"));
    setIsLoading(false);
  }, []);

  // Filter devices based on search and status
  useEffect(() => {
    let filtered = [...devices];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((device) => device.status === statusFilter);
    }

    // Apply search filter (device name or location)
    if (searchTerm) {
      filtered = filtered.filter(
        (device) =>
          device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.locationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.branchId.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredDevices(filtered);
  }, [devices, searchTerm, statusFilter]);

  const getDeviceIcon = (deviceType: string, className = "h-6 w-6") => {
    switch (deviceType) {
      case "wall-mounted":
        return <ComputerDesktopIcon className={className} />;
      case "kiosk":
        return <DeviceTabletIcon className={className} />;
      case "mobile":
        return <DevicePhoneMobileIcon className={className} />;
      case "admin":
        return <ComputerDesktopIcon className={className} />;
      default:
        return <DeviceTabletIcon className={className} />;
    }
  };

  const getDeviceTypeName = (deviceType: string) => {
    switch (deviceType) {
      case "wall-mounted":
        return "Wall-Mounted Scanner";
      case "kiosk":
        return "Check-in Kiosk";
      case "mobile":
        return "Mobile Scanner";
      case "admin":
        return "Admin Station";
      default:
        return "Unknown Device Type";
    }
  };

  const getBatteryStatusClass = (batteryLevel: number | undefined) => {
    if (batteryLevel === undefined) return "text-gray-600";
    if (batteryLevel >= 70) return "text-green-600";
    if (batteryLevel >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getAssignedEventName = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId);
    if (!device || !device.assignedEventId) return "Not assigned";

    const event = events.find((e) => e.id === device.assignedEventId);
    return event ? event.name : "Unknown Event";
  };

  const handleAddDevice = () => {
    if (!newDeviceName) return;

    const newDevice: CardDevice = {
      id: `device_${Date.now().toString()}`,
      name: newDeviceName,
      locationId: newDeviceLocation,
      branchId: selectedBranchId,
      status: "online",
      lastConnected: new Date(),
      deviceType: newDeviceType,
      ipAddress: "192.168.1.100", // Placeholder
      firmwareVersion: "2.1.0",
      batteryLevel: newDeviceType === "mobile" ? 100 : undefined,
    };

    setDevices([...devices, newDevice]);

    // Reset form
    setIsAddModalOpen(false);
    setNewDeviceName("");
    setNewDeviceType("wall-mounted");
    setNewDeviceLocation("loc_001");
  };

  const handleAssignEvent = () => {
    if (!selectedDeviceId || !selectedEventId) return;

    const updatedDevices = devices.map((device) =>
      device.id === selectedDeviceId
        ? { ...device, assignedEventId: selectedEventId }
        : device,
    );

    setDevices(updatedDevices);
    setIsAssignEventModalOpen(false);
    setSelectedDeviceId("");
    setSelectedEventId("");
  };

  const handleDeviceStatusChange = (
    deviceId: string,
    newStatus: "online" | "offline" | "maintenance",
  ) => {
    const updatedDevices = devices.map((device) =>
      device.id === deviceId ? { ...device, status: newStatus } : device,
    );
    setDevices(updatedDevices);
  };

  const openAssignEventModal = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setIsAssignEventModalOpen(true);
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "online":
        return (
          <span className="flex items-center text-green-600">
            <CheckCircleIcon className="h-5 w-5 mr-1" />
            Online
          </span>
        );
      case "offline":
        return (
          <span className="flex items-center text-red-600">
            <XCircleIcon className="h-5 w-5 mr-1" />
            Offline
          </span>
        );
      case "maintenance":
        return (
          <span className="flex items-center text-yellow-600">
            <ExclamationTriangleIcon className="h-5 w-5 mr-1" />
            Maintenance
          </span>
        );
      default:
        return (
          <span className="flex items-center text-gray-600">
            <XCircleIcon className="h-5 w-5 mr-1" />
            Unknown
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin" />
        <span className="ml-2 text-gray-600">Loading device data...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Card Scanning Device Management
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Device
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by device name or location"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label
            htmlFor="status-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status Filter
          </label>
          <select
            id="status-filter"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "online" | "offline" | "maintenance",
              )
            }
          >
            <option value="all">All Statuses</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredDevices.map((device) => (
          <div
            key={device.id}
            className="border border-gray-300 rounded-lg overflow-hidden shadow-sm"
          >
            <div className="p-4 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-indigo-100 rounded-md p-2">
                  {getDeviceIcon(device.deviceType)}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {device.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {getDeviceTypeName(device.deviceType)}
                  </p>
                </div>
              </div>
              <div>{getStatusIndicator(device.status)}</div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div>
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-1 text-gray-800">
                    {device.locationId}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Branch:</span>
                  <span className="ml-1 text-gray-800">{device.branchId}</span>
                </div>
                <div>
                  <span className="text-gray-500">IP Address:</span>
                  <span className="ml-1 text-gray-800">
                    {device.ipAddress || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500">Signal:</span>
                  <WifiIcon className="h-4 w-4 ml-1 text-green-600" />
                </div>
                <div>
                  <span className="text-gray-500">Firmware:</span>
                  <span className="ml-1 text-gray-800">
                    {device.firmwareVersion}
                  </span>
                </div>
                {device.batteryLevel !== undefined && (
                  <div className="flex items-center">
                    <span className="text-gray-500">Battery:</span>
                    <BoltIcon
                      className={`h-4 w-4 ml-1 ${getBatteryStatusClass(device.batteryLevel)}`}
                    />
                    <span
                      className={`ml-1 ${getBatteryStatusClass(device.batteryLevel)}`}
                    >
                      {device.batteryLevel}%
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-2 border-t border-gray-200 pt-3">
                <div className="text-sm">
                  <span className="text-gray-500">Current event:</span>
                  <span className="ml-1 text-gray-800">
                    {getAssignedEventName(device.id)}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Last connected:</span>
                  <span className="ml-1 text-gray-800">
                    {device.lastConnected.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => openAssignEventModal(device.id)}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-md hover:bg-indigo-200 transition-colors"
                >
                  Assign Event
                </button>
                <div className="space-x-2">
                  {device.status === "online" ? (
                    <>
                      <button
                        onClick={() =>
                          handleDeviceStatusChange(device.id, "maintenance")
                        }
                        className="px-2 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-md hover:bg-yellow-200 transition-colors"
                      >
                        Maintenance
                      </button>
                      <button
                        onClick={() =>
                          handleDeviceStatusChange(device.id, "offline")
                        }
                        className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition-colors"
                      >
                        Disable
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        handleDeviceStatusChange(device.id, "online")
                      }
                      className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200 transition-colors"
                    >
                      Enable
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Device Statistics */}
      <div className="mt-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Online Devices
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {
                        devices.filter((device) => device.status === "online")
                          .length
                      }
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Offline Devices
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {
                        devices.filter((device) => device.status === "offline")
                          .length
                      }
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Maintenance Mode
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {
                        devices.filter(
                          (device) => device.status === "maintenance",
                        ).length
                      }
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <ArrowPathIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Low Battery
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {
                        devices.filter(
                          (device) =>
                            device.batteryLevel !== undefined &&
                            device.batteryLevel < 20,
                        ).length
                      }
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Device Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add New Device
            </h3>

            <div className="mb-4">
              <label
                htmlFor="device-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Device Name
              </label>
              <input
                type="text"
                id="device-name"
                placeholder="Enter device name"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="device-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Device Type
              </label>
              <select
                id="device-type"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={newDeviceType}
                onChange={(e) =>
                  setNewDeviceType(
                    e.target.value as
                      | "wall-mounted"
                      | "kiosk"
                      | "admin"
                      | "mobile",
                  )
                }
              >
                <option value="wall-mounted">Wall-Mounted Scanner</option>
                <option value="kiosk">Check-in Kiosk</option>
                <option value="mobile">Mobile Scanner</option>
                <option value="admin">Admin Station</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="device-location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <select
                id="device-location"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={newDeviceLocation}
                onChange={(e) => setNewDeviceLocation(e.target.value)}
              >
                <option value="loc_001">Main Campus</option>
                <option value="loc_002">North Campus</option>
                <option value="loc_003">Community Center</option>
              </select>
            </div>

            <div className="mb-6">
              <label
                htmlFor="device-branch"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Branch
              </label>
              <select
                id="device-branch"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
              >
                <option value="branch_001">Main Branch</option>
                <option value="branch_002">North Branch</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDevice}
                disabled={!newDeviceName}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                Add Device
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Event Modal */}
      {isAssignEventModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Assign Device to Event
            </h3>

            <div className="mb-6">
              <label
                htmlFor="event-select"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Event
              </label>
              <select
                id="event-select"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {new Date(event.startTime).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsAssignEventModalOpen(false)}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignEvent}
                disabled={!selectedEventId}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
