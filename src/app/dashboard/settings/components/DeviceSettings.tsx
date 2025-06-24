'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, DeviceTabletIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useSettings, useUpdateSetting, useCreateBranchSetting } from '@/graphql/hooks/useSettings';

type Device = {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'other';
  lastUsed: string;
  browser: string;
  operatingSystem: string;
  status: 'active' | 'inactive';
  isCurrentDevice: boolean;
  isTrusted: boolean;
};

export default function DeviceSettings() {
  const { data, loading, refetch } = useSettings();
  const [updateSetting] = useUpdateSetting();
  const [createSetting] = useCreateBranchSetting();

  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'iPhone 13',
      type: 'mobile',
      lastUsed: 'Now',
      browser: 'Safari',
      operatingSystem: 'iOS 16.5',
      status: 'active',
      isCurrentDevice: true,
      isTrusted: true
    },
    {
      id: '2',
      name: 'MacBook Pro',
      type: 'desktop',
      lastUsed: '2 hours ago',
      browser: 'Chrome',
      operatingSystem: 'macOS 13.2',
      status: 'active',
      isCurrentDevice: false,
      isTrusted: true
    },
    {
      id: '3',
      name: 'iPad Air',
      type: 'tablet',
      lastUsed: '3 days ago',
      browser: 'Safari',
      operatingSystem: 'iPadOS 15.6',
      status: 'active',
      isCurrentDevice: false,
      isTrusted: true
    },
    {
      id: '4',
      name: 'Dell Laptop',
      type: 'desktop',
      lastUsed: '2 weeks ago',
      browser: 'Firefox',
      operatingSystem: 'Windows 11',
      status: 'active',
      isCurrentDevice: false,
      isTrusted: false
    }
  ]);

  const [nfcCardRegistered, setNfcCardRegistered] = useState(true);
  const [nfcCardStatus, setNfcCardStatus] = useState<'active' | 'inactive'>('active');
  const [autoCheckIn, setAutoCheckIn] = useState(true);
  const [checkInNotifications, setCheckInNotifications] = useState(true);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (data?.settings) {
      setDevices(prev => prev.map(device => {
        const setting = data.settings.find(s => s.key === `trustedDevice_${device.id}`);
        return setting ? { ...device, isTrusted: setting.value === 'true' } : device;
      }));
    }
  }, [data]);

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(devices.filter(device => device.id !== deviceId));
  };

  const handleToggleTrustedDevice = (deviceId: string) => {
    setDevices(devices.map(device => 
      device.id === deviceId 
        ? { ...device, isTrusted: !device.isTrusted } 
        : device
    ));
  };

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'mobile':
        return <DevicePhoneMobileIcon className="h-6 w-6 text-gray-400" />;
      case 'desktop':
        return <ComputerDesktopIcon className="h-6 w-6 text-gray-400" />;
      case 'tablet':
        return <DeviceTabletIcon className="h-6 w-6 text-gray-400" />;
      default:
        return <DevicePhoneMobileIcon className="h-6 w-6 text-gray-400" />;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settingsMap = {};
      if (data?.settings) {
        for (const s of data.settings) settingsMap[s.key] = s.id;
      }
      await Promise.all(devices.map(device => {
        const key = `trustedDevice_${device.id}`;
        if (settingsMap[key]) {
          return updateSetting({
            variables: {
              id: settingsMap[key],
              input: { key, value: String(device.isTrusted) }
            },
          });
        } else {
          return createSetting({
            variables: {
              input: { key, value: String(device.isTrusted) },
            },
          });
        }
      }));
      setSaveSuccess(true);
      refetch();
    } catch (e) {}
    setIsSaving(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeviceNameChange = (deviceId: string, name: string) => {
    setDevices(devices.map(device => 
      device.id === deviceId 
        ? { ...device, name } 
        : device
    ));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Device Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your connected devices and check-in cards
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Connected Devices</h4>
          <p className="mt-1 text-xs text-gray-500">
            Devices that are currently signed in to your account
          </p>
          <ul className="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200">
            {devices.map((device) => (
              <li key={device.id} className="flex items-center py-4">
                <div className="flex-shrink-0 mr-4">
                  {getDeviceIcon(device.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={device.name}
                      onChange={e => handleDeviceNameChange(device.id, e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-yellow-100 bg-white/70 shadow-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 backdrop-blur placeholder:text-yellow-300 text-yellow-900 font-medium transition-all duration-150"
                    />
                    {device.isCurrentDevice && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Current Device
                      </span>
                    )}
                    {!device.isTrusted && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Untrusted
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex text-xs text-gray-500">
                    <p className="mr-4">{device.browser} on {device.operatingSystem}</p>
                    <p>Last active: {device.lastUsed}</p>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex gap-2">
                  {!device.isCurrentDevice && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleToggleTrustedDevice(device.id)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                          device.isTrusted 
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {device.isTrusted ? 'Untrust' : 'Trust'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveDevice(device.id)}
                        className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-gray-500">
            If you remove a device, you'll be signed out on that device and will need to sign in again.
          </p>
        </div>

        <div className="pt-6">
          <h4 className="text-sm font-medium text-gray-900">NFC Cards & Check-In Devices</h4>
          <p className="mt-1 text-xs text-gray-500">
            Manage your NFC cards and check-in preferences for attendance tracking
          </p>
          <div className="mt-4 rounded-md bg-white border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center">
                  <DevicePhoneMobileIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900">NFC Card Status</h5>
                  <p className="text-xs text-gray-500">For quick attendance check-in at services and events</p>
                </div>
              </div>
              <div className="flex items-center">
                {nfcCardRegistered ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <CheckIcon className="mr-1 h-3 w-3" />
                    Registered
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    Not Registered
                  </span>
                )}
                <div className="ml-4">
                  <select
                    id="nfc-status"
                    name="nfc-status"
                    value={nfcCardStatus}
                    onChange={(e) => setNfcCardStatus(e.target.value as 'active' | 'inactive')}
                    className="rounded-md border-gray-300 text-xs shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    disabled={!nfcCardRegistered}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            
            {!nfcCardRegistered && (
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Register New Card
                </button>
              </div>
            )}
            
            {nfcCardRegistered && (
              <div className="mt-4 grid grid-cols-1 gap-y-4 border-t border-gray-200 pt-4 sm:grid-cols-2 sm:gap-x-6">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="auto-check-in"
                      name="auto-check-in"
                      type="checkbox"
                      checked={autoCheckIn}
                      onChange={() => setAutoCheckIn(!autoCheckIn)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="auto-check-in" className="font-medium text-gray-700">
                      Automatic check-in
                    </label>
                    <p className="text-gray-500">Automatically check in when card is scanned</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="check-in-notifications"
                      name="check-in-notifications"
                      type="checkbox"
                      checked={checkInNotifications}
                      onChange={() => setCheckInNotifications(!checkInNotifications)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="check-in-notifications" className="font-medium text-gray-700">
                      Check-in notifications
                    </label>
                    <p className="text-gray-500">Receive notifications when checked in or out</p>
                  </div>
                </div>
              </div>
            )}
            
            {nfcCardRegistered && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Deactivate Card
                </button>
                <button
                  type="button"
                  className="ml-3 inline-flex items-center rounded-md border border-transparent bg-primary-100 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Replace Card
                </button>
              </div>
            )}
          </div>
          
          <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-xs text-gray-700">
                  If you lose your NFC card, please contact your branch administrator immediately to deactivate it.
                </p>
                <p className="mt-3 text-xs font-medium text-yellow-700 md:ml-6 md:mt-0">
                  <a href="/dashboard/admin/security" className="whitespace-nowrap">
                    Contact Admin <span aria-hidden="true">&rarr;</span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-6">
          <h4 className="text-sm font-medium text-gray-900">Mobile App Settings</h4>
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="location-services"
                  name="location-services"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="location-services" className="font-medium text-gray-700">
                  Location services
                </label>
                <p className="text-gray-500">Allow the app to use your location for check-ins</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="background-sync"
                  name="background-sync"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="background-sync" className="font-medium text-gray-700">
                  Background sync
                </label>
                <p className="text-gray-500">Sync data in the background for offline access</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="biometric-auth"
                  name="biometric-auth"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="biometric-auth" className="font-medium text-gray-700">
                  Biometric authentication
                </label>
                <p className="text-gray-500">Use Face ID or Touch ID to log in</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-6">
        {saveSuccess && (
          <div className="mr-4 flex items-center text-sm text-green-600">
            <CheckIcon className="mr-1.5 h-4 w-4" />
            Device settings saved successfully
          </div>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 shadow-lg hover:from-indigo-700 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 border-2 border-white/80 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
