'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useSettings, useUpdateSetting } from '@/graphql/hooks/useSettings';

type Branch = {
  id: string;
  name: string;
  address: string;
  role: string;
  isDefault: boolean;
  permissions: string[];
};

const permissionCategories = [
  { id: 'attendance', name: 'Attendance', permissions: ['view', 'create', 'edit', 'delete'] },
  { id: 'members', name: 'Members', permissions: ['view', 'create', 'edit', 'delete'] },
  { id: 'events', name: 'Events', permissions: ['view', 'create', 'edit', 'delete'] },
  { id: 'finances', name: 'Finances', permissions: ['view', 'create', 'edit', 'delete'] },
  { id: 'ministries', name: 'Ministries', permissions: ['view', 'create', 'edit', 'delete'] },
];

export default function BranchSettings() {
  // Use branch settings for default branch selection
  const { data, refetch } = useSettings();
  const [updateSetting] = useUpdateSetting();

  // Sample data for my branches (would come from API)
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: '1',
      name: 'St. Mary\'s Cathedral',
      address: '123 Main St, New York, NY',
      role: 'Branch Admin',
      isDefault: true,
      permissions: [
        'attendance.view', 'attendance.create', 'attendance.edit',
        'members.view', 'members.create', 'members.edit',
        'events.view', 'events.create', 'events.edit',
        'finances.view', 'finances.create',
        'ministries.view', 'ministries.create', 'ministries.edit'
      ]
    },
    {
      id: '2',
      name: 'St. Joseph\'s Parish',
      address: '456 Oak St, Brooklyn, NY',
      role: 'Staff',
      isDefault: false,
      permissions: [
        'attendance.view', 'attendance.create',
        'members.view',
        'events.view',
        'ministries.view'
      ]
    },
    {
      id: '3',
      name: 'Sacred Heart Church',
      address: '789 Pine St, Queens, NY',
      role: 'Ministry Leader',
      isDefault: false,
      permissions: [
        'attendance.view',
        'members.view',
        'events.view',
        'ministries.view', 'ministries.create'
      ]
    }
  ]);

  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0].id);
  const [defaultBranchId, setDefaultBranchId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load default branch setting from API (key: defaultBranchId)
  useEffect(() => {
    if (data?.settings) {
      const def = data.settings.find(s => s.key === 'defaultBranchId');
      if (def) setDefaultBranchId(def.value);
    }
  }, [data]);

  const selectedBranch = branches.find(branch => branch.id === selectedBranchId);

  const hasPermission = (categoryId: string, permission: string): boolean => {
    const permissionKey = `${categoryId}.${permission}`;
    return selectedBranch?.permissions.includes(permissionKey) || false;
  };

  const handleDefaultBranchChange = (branchId: string) => {
    setDefaultBranchId(branchId);
    setBranches(branches.map(branch => ({
      ...branch,
      isDefault: branch.id === branchId
    })));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settingsMap = {};
      if (data?.settings) {
        for (const s of data.settings) settingsMap[s.key] = s.id;
      }
      await updateSetting({
        variables: {
          id: settingsMap['defaultBranchId'],
          input: { key: 'defaultBranchId', value: defaultBranchId }
        },
      });
      setSaveSuccess(true);
      refetch();
    } catch {
      toast.error('An unexpected error occurred.');
    }
    setIsSaving(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Branch Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your branch preferences and access
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
        <div className="sm:col-span-2 space-y-4">
          <div>
            <label htmlFor="branch-select" className="block text-sm font-medium text-gray-700">
              Select Branch
            </label>
            <select
              id="branch-select"
              name="branch-select"
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} {branch.isDefault && '(Default)'}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-4">
            <h4 className="text-sm font-medium text-gray-900">Your Branches</h4>
            <ul className="mt-3 space-y-3">
              {branches.map((branch) => (
                <li key={branch.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {branch.name}
                      {branch.isDefault && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <p>{branch.address}</p>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">Role: {branch.role}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900">Default Branch</h4>
            <p className="mt-1 text-xs text-gray-500">
              Set your default branch for when you log in
            </p>
            <div className="mt-2 space-y-2">
              <select
                id="default-branch"
                name="defaultBranch"
                value={defaultBranchId}
                onChange={(e) => handleDefaultBranchChange(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-purple-100 bg-white/70 shadow-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200 backdrop-blur placeholder:text-purple-300 text-purple-900 font-medium transition-all duration-150"
              >
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="sm:col-span-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Branch Access Permissions</h4>
            <p className="text-xs text-gray-500 mb-4">
              Your assigned permissions for {selectedBranch?.name}
            </p>

            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Module
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      View
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Create
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Edit
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {permissionCategories.map((category) => (
                    <tr key={category.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      {category.permissions.map((permission) => (
                        <td key={permission} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {hasPermission(category.id, permission) ? (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              To request additional permissions, please contact your branch administrator.
            </p>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Branch Notification Preferences</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="branch-notifications"
                    name="branch-notifications"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="branch-notifications" className="font-medium text-gray-700">
                    Branch announcements
                  </label>
                  <p className="text-gray-500">Receive notifications about branch-wide announcements</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="branch-events"
                    name="branch-events"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="branch-events" className="font-medium text-gray-700">
                    Branch events
                  </label>
                  <p className="text-gray-500">Receive notifications about events at this branch</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="branch-ministry"
                    name="branch-ministry"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="branch-ministry" className="font-medium text-gray-700">
                    Ministry updates
                  </label>
                  <p className="text-gray-500">Receive notifications about ministry activities at this branch</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-6">
        {saveSuccess && (
          <div className="mr-4 flex items-center text-sm text-green-600">
            <CheckIcon className="mr-1.5 h-4 w-4" />
            Branch settings saved successfully
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
