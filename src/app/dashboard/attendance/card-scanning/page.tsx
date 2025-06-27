"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CreditCardIcon, 
  ChartBarIcon, 
  UsersIcon,
  QrCodeIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

import CardScanningStation from '../components/CardScanningStation';
import CardManagement from '../components/CardManagement';
import AttendanceAnalytics from '../components/AttendanceAnalytics';
import { AttendanceRecord } from '../types';

type TabType = 'scanner' | 'cards' | 'analytics';

export default function CardScanningDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('scanner');
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);

  const handleAttendanceRecorded = (record: AttendanceRecord) => {
    setRecentAttendance(prev => [record, ...prev].slice(0, 5));
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Card Scanning Attendance System</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage attendance with card scanning, track devices, and view analytics.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link
              href="/pwa/card-scanner"
              className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
            >
              <DevicePhoneMobileIcon className="h-5 w-5 mr-2 -ml-0.5" />
              Mobile Card Scanner
            </Link>
            <Link
              href="/dashboard/attendance"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Back to Attendance
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mt-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`${
                activeTab === 'scanner'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              <QrCodeIcon className="h-5 w-5 mr-2 -ml-0.5" />
              Scanner Station
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`${
                activeTab === 'cards'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              <CreditCardIcon className="h-5 w-5 mr-2 -ml-0.5" />
              Card Management
            </button>
            {/* <button
              onClick={() => setActiveTab('devices')}
              className={`${
                activeTab === 'devices'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              <DeviceTabletIcon className="h-5 w-5 mr-2 -ml-0.5" />
              Device Management
            </button> */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              <ChartBarIcon className="h-5 w-5 mr-2 -ml-0.5" />
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'scanner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CardScanningStation 
                deviceId="device_001" 
                branchId="branch_001"
                onAttendanceRecorded={handleAttendanceRecorded}
              />
            </div>
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Check-ins</h2>
                {recentAttendance.length > 0 ? (
                  <div className="space-y-4">
                    {recentAttendance.map((record, index) => (
                      <div key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{record.memberName}</div>
                            <div className="text-xs text-gray-500">{record.eventName}</div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(record.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        {record.familyCheckIn && record.familyMembers && (
                          <div className="mt-2">
                            <div className="text-xs font-medium text-gray-700">Family Check-in:</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {record.familyMembers.map((member, i) => (
                                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {member.memberName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <UsersIcon className="h-10 w-10 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm">No recent check-ins</p>
                    <p className="text-xs mt-1">Scan a card to record attendance</p>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Reference</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Card Types</h3>
                    <ul className="mt-1 text-xs text-gray-600 list-disc list-inside">
                      <li>RFID Cards - Standard proximity cards</li>
                      <li>NFC Cards - Compatible with smartphones</li>
                      <li>QR Codes - Printable for temporary use</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Device Types</h3>
                    <ul className="mt-1 text-xs text-gray-600 list-disc list-inside">
                      <li>Wall-mounted - Fixed scanning stations</li>
                      <li>Kiosk - Touch-screen check-in stations</li>
                      <li>Mobile - Portable scanners for events</li>
                      <li>Admin - Staff registration stations</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Helpful Tips</h3>
                    <ul className="mt-1 text-xs text-gray-600 list-disc list-inside">
                      <li>Family check-in available for main services</li>
                      <li>Members can check in 30 minutes before events</li>
                      <li>Late check-in allowed up to 30 minutes after start</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cards' && <CardManagement />}
        
        {/* {activeTab === 'devices' && <DeviceManagement />} */}
        
        {activeTab === 'analytics' && <AttendanceAnalytics />}
      </div>
    </div>
  );
}
