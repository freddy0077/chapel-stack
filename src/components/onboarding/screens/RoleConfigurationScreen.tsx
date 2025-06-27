import React, { useState, useMemo, useEffect } from 'react';
import { saveOnboardingStepData } from '../utils/onboardingStorage';
import { useMutation } from '@apollo/client';
import { CREATE_ROLE_WITH_PERMISSIONS } from '@/graphql/mutations/roleMutations';
import { usePermissionsGroupedBySubject } from '@/graphql/hooks/usePermissions';

const DEFAULT_PERMISSIONS = [
  'View Members',
  'Manage Members',
  'View Finances',
  'Manage Finances',
  'Manage Events',
  'Manage Settings',
];

interface Role {
  name: string;
  description: string;
  permissions: string[];
  isDefault?: boolean;
}

interface RoleConfigurationScreenProps {
  onNext: (roles: Role[]) => void;
  onBack?: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
}

const initialRoles: Role[] = [
  { name: 'SUPER_ADMIN', description: 'Highest level, manages all settings and users.', permissions: [...DEFAULT_PERMISSIONS], isDefault: true },
  { name: 'ADMIN', description: 'Administers the system and manages users and settings.', permissions: [...DEFAULT_PERMISSIONS], isDefault: true },
  { name: 'BRANCH_ADMIN', description: 'Manages a specific branch and its members.', permissions: ['View Members', 'Manage Members', 'Manage Events', 'Manage Settings'], isDefault: true },
  { name: 'MODERATOR', description: 'Moderates content and member activity.', permissions: ['View Members', 'Manage Members', 'Manage Events', 'Manage Settings'], isDefault: true },
  { name: 'USER', description: 'General user with limited access.', permissions: ['View Members'], isDefault: true },
  { name: 'MEMBER', description: 'Regular church member.', permissions: ['View Members'], isDefault: true },
  { name: 'PASTOR', description: 'Manages spiritual and member activities.', permissions: ['View Members', 'Manage Events'], isDefault: true },
  { name: 'FINANCE_MANAGER', description: 'Handles church finances.', permissions: ['View Finances', 'Manage Finances'], isDefault: true },
  { name: 'CONTENT_MANAGER', description: 'Manages and creates content.', permissions: ['Manage Events', 'Manage Settings'], isDefault: true },
];

// Utility for localStorage tracking
const COMPLETED_SCREENS_KEY = 'onboarding_completed_screens';
function getCompletedScreens(): string[] {
  try {
    return JSON.parse(localStorage.getItem(COMPLETED_SCREENS_KEY) || '[]');
  } catch {
    return [];
  }
}
function markScreenCompleted(screen: string) {
  const screens = getCompletedScreens();
  if (!screens.includes(screen)) {
    screens.push(screen);
    localStorage.setItem(COMPLETED_SCREENS_KEY, JSON.stringify(screens));
  }
}

const RoleConfigurationScreen: React.FC<RoleConfigurationScreenProps> = ({ onNext, onBack, onSkip, isLoading }) => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createRoleWithPermissions, { loading: creating }] = useMutation(CREATE_ROLE_WITH_PERMISSIONS);

  const { grouped: groupedPermissions } = usePermissionsGroupedBySubject();

  const allPermissions = useMemo(() => {
    const map = new Map<string, { id: string; action: string; subject: string; description?: string }>();
    groupedPermissions.flat().forEach((perm: unknown) => {
      if (!map.has(perm.id)) map.set(perm.id, perm);
    });
    return Array.from(map.values());
  }, [groupedPermissions]);

  const permissionNameToId = useMemo(() => {
    const mapping: Record<string, string> = {};
    allPermissions.forEach(perm => {
      const label = perm.description || `${perm.action} ${perm.subject}`.replace(/_/g, ' ');
      mapping[label] = perm.id;
      mapping[`${perm.action} ${perm.subject}`.replace(/_/g, ' ')] = perm.id;
    });
    return mapping;
  }, [allPermissions]);

  const handleRoleChange = (idx: number, field: keyof Role, value: string | string[]) => {
    setRoles(roles => roles.map((role, i) => i === idx ? { ...role, [field]: value } : role));
  };

  const handlePermissionToggle = (idx: number, perm: string) => {
    setRoles(roles => roles.map((role, i) => {
      if (i !== idx) return role;
      const has = role.permissions.includes(perm);
      return {
        ...role,
        permissions: has ? role.permissions.filter(p => p !== perm) : [...role.permissions, perm],
      };
    }));
  };

  const addRole = () => setRoles([...roles, { name: '', description: '', permissions: [] }]);
  const removeRole = (idx: number) => setRoles(roles => roles.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      for (const role of roles) {
        if (!role.name.trim()) throw new Error('Role name cannot be empty.');
      }
      saveOnboardingStepData('RoleConfiguration', { roles });
      const customRoles = roles.filter(r => !r.isDefault);
      for (const role of customRoles) {
        const permissionIds = (role.permissions || []).map(
          name => permissionNameToId[name] || null
        ).filter(Boolean);
        if (permissionIds.length !== (role.permissions || []).length) {
          throw new Error('Some permissions could not be mapped to IDs. Please review your selections.');
        }
        await createRoleWithPermissions({
          variables: {
            input: {
              name: role.name,
              description: role.description,
              permissionIds,
            },
          },
        });
      }
      setSuccess('Roles saved successfully!');
      setTimeout(() => {
        setSuccess(null);
        onNext(roles);
      }, 1200);
    } catch (err: unknown) {
      setError(err.message || 'Failed to save roles.');
    }
  };

  // Mark this screen as completed when successful
  useEffect(() => {
    if (success) {
      markScreenCompleted('RoleConfiguration');
    }
  }, [success]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-2 text-indigo-700">Configure Roles & Permissions</h2>
        <p className="mb-6 text-gray-600">Set up user roles and permissions for your organization. You can add, edit, or remove roles as needed.</p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {roles.map((role, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex gap-4 mb-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                    <input
                      type="text"
                      value={role.name}
                      onChange={e => handleRoleChange(idx, 'name', e.target.value)}
                      className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      placeholder="e.g. Usher, Music Director"
                      required
                      disabled={role.isDefault}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={role.description}
                      onChange={e => handleRoleChange(idx, 'description', e.target.value)}
                      className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      placeholder="Short description"
                      required
                      disabled={role.isDefault}
                    />
                  </div>
                  {!role.isDefault && (
                    <button
                      type="button"
                      onClick={() => removeRole(idx)}
                      className="ml-2 px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 text-xs font-bold border border-red-200 self-end"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  {groupedPermissions.map((group, groupIdx) => (
                    <div key={groupIdx} className="mb-2">
                      <div className="font-semibold text-xs text-gray-500 mb-1">
                        {group[0]?.subject || 'Other'}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {group.map(perm => {
                          const label = perm.description || `${perm.action} ${perm.subject}`.replace(/_/g, ' ');
                          return (
                            <label key={perm.id} className="flex items-center gap-1 text-sm">
                              <input
                                type="checkbox"
                                checked={role.permissions.includes(label)}
                                onChange={() => handlePermissionToggle(idx, label)}
                                disabled={role.isDefault}
                              />
                              {label}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addRole}
            className="text-indigo-600 font-semibold hover:underline"
          >
            + Add another role
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
          <div className="flex justify-between items-center mt-8 gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
                disabled={isLoading || creating}
              >
                Back
              </button>
            )}
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="px-4 py-2 rounded-lg border border-transparent text-indigo-400 font-semibold hover:underline"
                disabled={isLoading || creating}
              >
                Skip
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              disabled={isLoading || creating}
            >
              {isLoading || creating ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleConfigurationScreen;
