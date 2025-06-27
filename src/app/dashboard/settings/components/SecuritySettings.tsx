'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { CheckIcon, ExclamationTriangleIcon, KeyIcon, ShieldCheckIcon, LockClosedIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useSettings } from '@/graphql/hooks/useSettings';
import { useMutation } from '@apollo/client';
import { gql } from 'graphql-tag';

const UPDATE_LOGIN_ALERTS = gql`
  mutation updateLoginAlerts($enabled: Boolean!) {
    updateLoginAlerts(enabled: $enabled) {
      id
      loginAlerts
    }
  }
`;

const UPDATE_SESSION_TIMEOUT = gql`
  mutation updateSessionTimeout($timeout: SessionTimeoutDuration!) {
    updateSessionTimeout(timeout: $timeout) {
      id
      sessionTimeout
    }
  }
`;

const ENABLE_TWO_FACTOR = gql`
  mutation enableTwoFactor($input: EnableTwoFactorInput!) {
    enableTwoFactor(input: $input) {
      id
      twoFactorEnabled
    }
  }
`;

const DISABLE_TWO_FACTOR = gql`
  mutation disableTwoFactor($password: String!) {
    disableTwoFactor(password: $password) {
      id
      twoFactorEnabled
    }
  }
`;

export default function SecuritySettings() {
  // Use global settings for security preferences
  const { data, refetch } = useSettings();
  const [updateLoginAlerts] = useMutation(UPDATE_LOGIN_ALERTS);
  const [updateSessionTimeout] = useMutation(UPDATE_SESSION_TIMEOUT);
  const [enableTwoFactor] = useMutation(ENABLE_TWO_FACTOR);
  const [disableTwoFactor] = useMutation(DISABLE_TWO_FACTOR);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Access tokens from recently authenticated sessions
  const [activeSessions, setActiveSessions] = useState([
    { id: '1', device: 'Chrome on MacBook Pro', location: 'New York, USA', lastActive: '2 minutes ago', current: true },
    { id: '2', device: 'Safari on iPhone', location: 'New York, USA', lastActive: '1 hour ago', current: false },
    { id: '3', device: 'Firefox on Windows PC', location: 'Boston, USA', lastActive: '2 days ago', current: false },
  ]);

  // Recent security events for audit trail integration
  const [securityEvents, setSecurityEvents] = useState([
    { id: '1', event: 'Password changed', date: '2023-10-15', time: '14:30', ip: '192.168.1.1', device: 'Chrome on MacBook Pro' },
    { id: '2', event: 'Login from new device', date: '2023-10-12', time: '09:15', ip: '192.168.1.2', device: 'Safari on iPhone' },
    { id: '3', event: 'Two-factor authentication enabled', date: '2023-10-05', time: '11:45', ip: '192.168.1.1', device: 'Chrome on MacBook Pro' },
  ]);

  // Load security settings from API (keys: twoFactorEnabled, loginAlerts, sessionTimeout)
  useEffect(() => {
    if (data?.settings) {
      for (const setting of data.settings) {
        if (setting.key === 'twoFactorEnabled') setTwoFactorEnabled(setting.value === 'true');
        if (setting.key === 'loginAlerts') setLoginAlerts(setting.value === 'true');
        if (setting.key === 'sessionTimeout') setSessionTimeout(setting.value);
      }
    }
  }, [data]);

  const handleChangePassword = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (!currentPassword) {
      alert('Please enter your current password');
      return;
    }
    
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Add to security events
      const newEvent = {
        id: (securityEvents.length + 1).toString(),
        event: 'Password changed',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        ip: '192.168.1.1',
        device: 'Chrome on MacBook Pro'
      };
      
      setSecurityEvents([newEvent, ...securityEvents]);
    }, 1000);
  };
  
  const handleRevokeSession = (id: string) => {
    setActiveSessions(activeSessions.filter(session => session.id !== id));
    
    // Add to security events
    const newEvent = {
      id: (securityEvents.length + 1).toString(),
      event: 'Session revoked',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      ip: '192.168.1.1',
      device: 'Chrome on MacBook Pro'
    };
    
    setSecurityEvents([newEvent, ...securityEvents]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateLoginAlerts({ variables: { enabled: loginAlerts } });
      await updateSessionTimeout({ variables: { timeout: sessionTimeout } });
      // Two-factor handled separately via enable/disable actions
      setSaveSuccess(true);
      refetch();
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleEnableTwoFactor = async () => {
    try {
      await enableTwoFactor({ variables: { input: {} } });
      setTwoFactorEnabled(true);
    } catch {
      // Removed unused error variable
    }
  };

  const handleDisableTwoFactor = async () => {
    try {
      await disableTwoFactor({ variables: { password: currentPassword } });
      setTwoFactorEnabled(false);
    } catch {
      // Removed unused error variable
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Security Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account security and access controls
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <KeyIcon className="mr-2 h-5 w-5 text-gray-500" />
            Change Password
          </h4>
          <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                name="current-password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-rose-100 bg-white/70 shadow-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-200 backdrop-blur placeholder:text-rose-300 text-rose-900 font-medium transition-all duration-150"
              />
            </div>
            
            <div className="sm:col-span-4">
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                name="new-password"
                id="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-rose-100 bg-white/70 shadow-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-200 backdrop-blur placeholder:text-rose-300 text-rose-900 font-medium transition-all duration-150"
              />
            </div>
            
            <div className="sm:col-span-4">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-rose-100 bg-white/70 shadow-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-200 backdrop-blur placeholder:text-rose-300 text-rose-900 font-medium transition-all duration-150"
              />
            </div>
            
            <div className="sm:col-span-4">
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={!password || !confirmPassword || !currentPassword || isSaving}
                className="mt-2 inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-6">
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <ShieldCheckIcon className="mr-2 h-5 w-5 text-gray-500" />
            Two-Factor Authentication
          </h4>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Require a verification code when logging in</p>
              <p className="text-xs text-gray-500">Adds an extra layer of security to your account</p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onChange={(enabled) => {
                if (enabled) {
                  handleEnableTwoFactor();
                } else {
                  handleDisableTwoFactor();
                }
              }}
              className={`${twoFactorEnabled ? 'bg-indigo-500/80 shadow-lg' : 'bg-gray-200/60'} relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-indigo-100`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-all duration-200 ${twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'}`}
              />
            </Switch>
          </div>
          {twoFactorEnabled && (
            <div className="mt-4 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Two-factor authentication is enabled
                  </p>
                  <p className="mt-1 text-xs text-green-700">
                    Your account is protected with an additional layer of security.
                  </p>
                </div>
              </div>
            </div>
          )}
          {!twoFactorEnabled && (
            <div className="mt-4 rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">
                    Two-factor authentication is disabled
                  </p>
                  <p className="mt-1 text-xs text-yellow-700">
                    We strongly recommend enabling two-factor authentication to protect your account.
                  </p>
                  <div className="mt-2">
                    <button
                      type="button"
                      className="rounded-md bg-yellow-100 px-2 py-1.5 text-xs font-medium text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
                      onClick={handleEnableTwoFactor}
                    >
                      Enable now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="pt-6">
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <LockClosedIcon className="mr-2 h-5 w-5 text-gray-500" />
            Login Alerts
          </h4>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Get notified of new logins to your account</p>
              <p className="text-xs text-gray-500">Receive email alerts when your account is accessed from a new device or location</p>
            </div>
            <Switch
              checked={loginAlerts}
              onChange={setLoginAlerts}
              className={`${loginAlerts ? 'bg-indigo-500/80 shadow-lg' : 'bg-gray-200/60'} relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 border border-indigo-100`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-all duration-200 ${loginAlerts ? 'translate-x-7' : 'translate-x-1'}`}
              />
            </Switch>
          </div>
        </div>
        
        <div className="pt-6">
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <ClockIcon className="mr-2 h-5 w-5 text-gray-500" />
            Session Timeout
          </h4>
          <div className="mt-4">
            <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700">
              Automatically log out after inactivity (minutes)
            </label>
            <select
              id="session-timeout"
              name="session-timeout"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
              <option value="480">8 hours</option>
            </select>
          </div>
        </div>
        
        <div className="pt-8">
          <h4 className="mb-4 text-sm font-medium text-gray-900">Active Sessions</h4>
          <div className="overflow-hidden rounded-md border border-gray-200 shadow-sm">
            <ul role="list" className="divide-y divide-gray-200">
              {activeSessions.map((session) => (
                <li key={session.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center min-w-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.device} {session.current && <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Current</span>}
                      </p>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <p>{session.location} • Last active {session.lastActive}</p>
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(session.id)}
                      className="ml-4 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      Revoke
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8">
          <h4 className="mb-4 text-sm font-medium text-gray-900">Recent Security Events</h4>
          <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Event
                  </th>
                  <th scope="col" className="hidden px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:table-cell">
                    Date & Time
                  </th>
                  <th scope="col" className="hidden px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500 lg:table-cell">
                    IP Address
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Device
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {securityEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {event.event}
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
                      {event.date} {event.time}
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                      {event.ip}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {event.device}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-right">
            <a href="/dashboard/admin/security" className="text-xs text-primary-600 hover:text-primary-900">
              View full security audit log →
            </a>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-6">
        {saveSuccess && (
          <div className="mr-4 flex items-center text-sm text-green-600">
            <CheckIcon className="mr-1.5 h-4 w-4" />
            Security settings updated successfully
          </div>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 shadow-lg hover:from-indigo-700 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 border-2 border-white/80 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
