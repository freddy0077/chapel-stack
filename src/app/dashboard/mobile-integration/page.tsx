"use client";

import { useState } from 'react';
import { 
  DevicePhoneMobileIcon, 
  QrCodeIcon, 
  WifiIcon, 
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import BranchSwitcher from '@/app/dashboard/components/BranchSwitcher';

// Mobile sync status types
type SyncStatus = 'synced' | 'syncing' | 'pending' | 'error';
type DeviceType = 'ios' | 'android' | 'web';

// Mock device data
interface Device {
  id: string;
  name: string;
  type: DeviceType;
  lastSync: Date;
  status: SyncStatus;
  userEmail: string;
  userRole: string;
  appVersion: string;
}

const mockDevices: Device[] = [
  {
    id: '1',
    name: 'iPhone 13 Pro',
    type: 'ios',
    lastSync: new Date('2025-04-13T10:23:15'),
    status: 'synced',
    userEmail: 'pastor@church.org',
    userRole: 'Pastor',
    appVersion: '2.3.1'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S23',
    type: 'android',
    lastSync: new Date('2025-04-12T18:45:30'),
    status: 'pending',
    userEmail: 'admin@church.org',
    userRole: 'Admin',
    appVersion: '2.3.0'
  },
  {
    id: '3',
    name: 'iPad Air',
    type: 'ios',
    lastSync: new Date('2025-04-10T08:12:45'),
    status: 'error',
    userEmail: 'ministry.leader@church.org',
    userRole: 'Ministry Leader',
    appVersion: '2.2.5'
  },
  {
    id: '4',
    name: 'Google Pixel 7',
    type: 'android',
    lastSync: new Date('2025-04-13T09:05:22'),
    status: 'synced',
    userEmail: 'volunteer@church.org',
    userRole: 'Volunteer',
    appVersion: '2.3.1'
  },
  {
    id: '5',
    name: 'Chrome Browser',
    type: 'web',
    lastSync: new Date('2025-04-13T11:30:10'),
    status: 'syncing',
    userEmail: 'member@church.org',
    userRole: 'Member',
    appVersion: 'Web App'
  }
];

// Helper function to format date
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Mobile Integration Page
export default function MobileIntegration() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  
  // Get icon for device type - using inline SVG data for reliability
  const getDeviceIcon = (type: DeviceType) => {
    switch(type) {
      case 'ios':
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMzE4LjcgMjY4LjdjLS4yLTM2LjcgMTYuNC02NC40IDQ5LTc5LjctMTIuNS0yNy4xLTI5LjktNTIuMS01MS41LTY2LjctNjQuMS00OS0xNjQuOS01LjItMjA4LjctMi41LTkgLjUtODYuMjEgNjguNS04Ni4yMSA3Ni42TDAtLjF2MzQ1LjhjMCA2LjcgMjggMTcwLjMgMTg0LjIgMTcwLjMgMTAxLjEgMCAxMjEuMC00My43IDEyMS0wVjI2OC43eiIvPjwvc3ZnPg==';
      case 'android':
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NzYgNTEyIj48cGF0aCBmaWxsPSIjM2RkYzg0IiBkPSJNNDcwLjYgMTA1LjRjMTIuNSAxMi41IDEyLjUgMzIuOCAwIDQ1LjNsLTE2MCAxNjBjLTEyLjUgMTIuNS0zMi44IDEyLjUtNDUuMyAwbC0xNjAtMTYwYy0xMi41LTEyLjUtMTIuNS0zMi44IDAtNDUuM3MzMi44LTEyLjUgNDUuMyAwTDI4OCAxOTMuNGwxMzcuNC0xMzguNGMxMi41LTEyLjUgMzIuOC0xMi41IDQ1LjMgMHoiLz48L3N2Zz4=';
      case 'web':
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjMzY4NmYyIiBkPSJNMTg0IDQ4SDEyOGM0LjQgMCA4IC0zLjYgOCAtOFYzMmMwIC00LjQgLTMuNiAtOCAtOCAtOEgyMy4zQzEwLjQgMjQgMCAzNC40IDAgNDcuM1Y0NjRjMCAxMi45IDEwLjQgMjMuMiAyMy4zIDIzLjJINDM2LjdjMTIuOSAwIDIzLjMgLTEwLjMgMjMuMyAtMjMuMlY0NTFjMCAtNC40IC0zLjYgLTggLTggLThIMTg0Yy00MC45IDAgLTc0LjEgLTMzLjEgLTc0LjEgLTc0VjEyMmMwIC00MC45IDMzLjIgLTc0IDc0LjEgLTc0em0zMTMuMiA3NkgzNzRjLTQuNCAwIC04IDMuNiAtOCA4djE2YzAgNC40IDMuNiA4IDggOGgxMjMuMmM1IDAgOS44IC0yLjQgOS44IC05LjJWMTQyYzAgLTUgLTQuOS05LjItOS44LTkuMkgzNzRjLTQuNCAwIC04IDMuNiAtOCA4djE2YzAgNC40IDMuNiA4IDggOGgxMjMuMiIvPjwvc3ZnPg==';
      default:
        return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjNmI3MjgwIiBkPSJNMTY0LjkgMjQuNkMxNjIuMiA5LjggMTQ4LjkgMCAxMzMuOCAwSDc4LjFDNTIuMSAwIDMxLjggMjAuMyAzMS44IDQ1LjNjMCAxOS43IDExLjkgMzcuMSAzMC4yIDQ0LjZMNTg2LjIgNDY3LjJjLTMuOCAtMTQuNiAtMTYuNyAtMjQuNyAtMzEuNiAtMjQuN0gzODRWMjE1LjJjMCAtNTkuMiAtNDggLTEwNy4yIC0xMDcuMiAtMTA3LjJIMjQwLjlMMTY0LjkgMjQuNnpNMjU2IDExMi4yYzQxLjUgMCA3NS4yIDMzLjcgNzUuMiA3NS4yVjQ0Mi41SDIzOC4yTDc1LjkgMTIzLjFjMTAuNCA2LjEgMjIuNCA5LjMgMzQuOCA5LjNIOTZ2MTYuMmMwIDI4LjggMjMuNCA1Mi4yIDUyLjIgNTIuMkgyNTZ6Ii8+PC9zdmc+';
    }
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: SyncStatus }) => {
    const getStatusProperties = () => {
      switch(status) {
        case 'synced':
          return { color: 'bg-green-100 text-green-800', text: 'Synced' };
        case 'syncing':
          return { color: 'bg-blue-100 text-blue-800', text: 'Syncing' };
        case 'pending':
          return { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' };
        case 'error':
          return { color: 'bg-red-100 text-red-800', text: 'Error' };
        default:
          return { color: 'bg-gray-100 text-gray-800', text: 'Unknown' };
      }
    };
    
    const { color, text } = getStatusProperties();
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {status === 'syncing' && (
          <ArrowPathIcon className="w-3 h-3 mr-1 animate-spin" aria-hidden="true" />
        )}
        {text}
      </span>
    );
  };
  
  // Handle NFC pairing mock function
  const handleNFCPairing = () => {
    alert('NFC pairing initiated. Please tap your device to the NFC reader.');
  };
  
  // Generate QR code mock function
  const handleGenerateQR = () => {
    setIsGeneratingQR(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsGeneratingQR(false);
      setShowQRCode(true);
    }, 1500);
  };
  
  // Force sync mock function
  const handleForceSync = (deviceId: string) => {
    // Update device status to syncing
    setDevices(devices.map(device => 
      device.id === deviceId ? { ...device, status: 'syncing' } : device
    ));
    
    // Simulate sync delay
    setTimeout(() => {
      setDevices(devices.map(device => 
        device.id === deviceId ? { ...device, status: 'synced', lastSync: new Date() } : device
      ));
    }, 3000);
  };
  
  // View device details
  const handleViewDevice = (device: Device) => {
    setSelectedDevice(device);
  };
  
  // Revoke device access
  const handleRevokeAccess = (deviceId: string) => {
    if (confirm('Are you sure you want to revoke access for this device? The user will need to re-authenticate.')) {
      setDevices(devices.filter(device => device.id !== deviceId));
      if (selectedDevice?.id === deviceId) {
        setSelectedDevice(null);
      }
    }
  };
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center">
          <DevicePhoneMobileIcon className="h-8 w-8 text-indigo-600 mr-3" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Mobile Integration</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage mobile devices, synchronization, and access control
            </p>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <BranchSwitcher />
        </div>
      </div>
      
      {/* Quick Actions Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div 
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          onClick={handleGenerateQR}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <QrCodeIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Generate QR Code</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create a QR code for quick device pairing
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div 
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          onClick={handleNFCPairing}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <WifiIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-lg font-medium text-gray-900">NFC Pairing</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tap to pair a device using NFC technology
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <CloudArrowDownIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Sync Status</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {devices.filter(d => d.status === 'synced').length} of {devices.length} devices synced
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="qr-code-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowQRCode(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  <QrCodeIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="qr-code-title">
                    Scan QR Code with Church App
                  </h3>
                  <div className="mt-4 flex justify-center">
                    {isGeneratingQR ? (
                      <div className="p-4 bg-white border border-gray-200 rounded-lg flex items-center justify-center" style={{ width: '200px', height: '200px' }}>
                        <ArrowPathIcon className="h-8 w-8 text-indigo-500 animate-spin" />
                        <span className="ml-2 text-sm text-gray-500">Generating...</span>
                      </div>
                    ) : (
                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      {/* Inline SVG QR code */}
                      <svg
                        width="200"
                        height="200"
                        viewBox="0 0 29 29"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto"
                      >
                        {/* QR code modules */}
                        <rect width="29" height="29" fill="white" />
                        <rect x="0" y="0" width="7" height="7" fill="#000" />
                        <rect x="1" y="1" width="5" height="5" fill="white" />
                        <rect x="2" y="2" width="3" height="3" fill="#000" />
                        
                        <rect x="22" y="0" width="7" height="7" fill="#000" />
                        <rect x="23" y="1" width="5" height="5" fill="white" />
                        <rect x="24" y="2" width="3" height="3" fill="#000" />
                        
                        <rect x="0" y="22" width="7" height="7" fill="#000" />
                        <rect x="1" y="23" width="5" height="5" fill="white" />
                        <rect x="2" y="24" width="3" height="3" fill="#000" />
                        
                        <rect x="9" y="3" width="1" height="1" fill="#000" />
                        <rect x="8" y="4" width="1" height="1" fill="#000" />
                        <rect x="11" y="5" width="1" height="1" fill="#000" />
                        <rect x="9" y="6" width="1" height="1" fill="#000" />
                        <rect x="13" y="7" width="1" height="1" fill="#000" />
                        <rect x="8" y="9" width="1" height="1" fill="#000" />
                        <rect x="12" y="10" width="1" height="1" fill="#000" />
                        <rect x="11" y="12" width="1" height="1" fill="#000" />
                        <rect x="15" y="13" width="2" height="1" fill="#000" />
                        <rect x="9" y="15" width="3" height="1" fill="#000" />
                        <rect x="16" y="14" width="1" height="1" fill="#000" />
                        <rect x="14" y="16" width="3" height="1" fill="#000" />
                        <rect x="18" y="14" width="3" height="1" fill="#000" />
                        <rect x="15" y="18" width="1" height="1" fill="#000" />
                        <rect x="21" y="17" width="3" height="2" fill="#000" />
                        <rect x="14" y="20" width="1" height="2" fill="#000" />
                        <rect x="17" y="20" width="4" height="1" fill="#000" />
                        <rect x="13" y="22" width="6" height="1" fill="#000" />
                        <rect x="19" y="21" width="1" height="1" fill="#000" />
                        
                        <rect x="19" y="8" width="6" height="1" fill="#000" />
                        <rect x="22" y="9" width="2" height="1" fill="#000" />
                        <rect x="19" y="10" width="1" height="3" fill="#000" />
                        <rect x="21" y="11" width="3" height="1" fill="#000" />
                        
                        {/* Embedded church logo in center */}
                        <rect x="12" y="12" width="5" height="5" fill="white" stroke="#000" />
                        <path d="M14.5 12 L16 15 L13 15 Z" fill="#4F46E5" />
                      </svg>
                      
                      {/* Connection info below QR code */}
                      <div className="mt-2 text-xs text-center text-gray-500">
                        ID: CM-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                      </div>
                    </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      This QR code will expire in 10 minutes for security reasons.
                      Scan it with your church mobile app to instantly connect the device.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowQRCode(false)}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Connected Devices Table and Device Details */}
      <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Connected Devices</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage devices connected to your church management system
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row">
          {/* Devices List */}
          <div className="md:w-2/3 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Sync
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices.map((device) => (
                  <tr 
                    key={device.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${selectedDevice?.id === device.id ? 'bg-indigo-50' : ''}`}
                    onClick={() => handleViewDevice(device)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <Image
                            src={getDeviceIcon(device.type)}
                            alt={device.type}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{device.name}</div>
                          <div className="text-sm text-gray-500">v{device.appVersion}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{device.userEmail}</div>
                      <div className="text-sm text-gray-500">{device.userRole}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(device.lastSync)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={device.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleForceSync(device.id);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        disabled={device.status === 'syncing'}
                      >
                        Sync
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRevokeAccess(device.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
                
                {devices.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No devices connected
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Device Details */}
          <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-gray-200">
            {selectedDevice ? (
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Device Details</h4>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Device Name</h5>
                    <p className="mt-1 text-sm text-gray-900">{selectedDevice.name}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Type</h5>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedDevice.type}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">App Version</h5>
                    <p className="mt-1 text-sm text-gray-900">{selectedDevice.appVersion}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">User</h5>
                    <p className="mt-1 text-sm text-gray-900">{selectedDevice.userEmail}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Role</h5>
                    <p className="mt-1 text-sm text-gray-900">{selectedDevice.userRole}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Last Synchronized</h5>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedDevice.lastSync)}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Status</h5>
                    <div className="mt-1">
                      <StatusBadge status={selectedDevice.status} />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleForceSync(selectedDevice.id)}
                        disabled={selectedDevice.status === 'syncing'}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {selectedDevice.status === 'syncing' ? (
                          <>
                            <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>Force Sync</>
                        )}
                      </button>
                      <button
                        onClick={() => handleRevokeAccess(selectedDevice.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Revoke Access
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <DevicePhoneMobileIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No device selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a device from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sync Statistics */}
      <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Synchronization Statistics</h3>
          <p className="mt-1 text-sm text-gray-500">
            Overview of data synchronization between mobile devices and the main system
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-50 overflow-hidden rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <CloudArrowUpIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Data Uploaded
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">127.8 MB</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 overflow-hidden rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <CloudArrowDownIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Data Downloaded
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">342.5 MB</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 overflow-hidden rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <DevicePhoneMobileIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Devices
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">42</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 overflow-hidden rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <ShieldCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Secure Connections
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">100%</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
