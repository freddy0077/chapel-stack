import { useAdminRoles } from '@/graphql/hooks/useAdminRoles';
import { useCreateRoleWithPermissions } from '@/graphql/hooks/useCreateRoleWithPermissions';
import React, { useState, useEffect } from 'react';
import { SparklesIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { UserIcon, LockClosedIcon, Cog6ToothIcon, UsersIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

function groupPermissionsBySubject(permissions: { subject: string }[]) {
  return permissions.reduce((acc, perm) => {
    if (!acc[perm.subject]) acc[perm.subject] = [];
    acc[perm.subject].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);
}

function getAllUniquePermissions(roles: any[]) {
  const map = new Map();
  roles.forEach(role => {
    role.permissions.forEach((perm: any) => {
      if (!map.has(perm.id)) map.set(perm.id, perm);
    });
  });
  return Array.from(map.values());
}

function prettifyRoleName(name: string) {
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

const subjectIcons: Record<string, React.ReactNode> = {
  User: <UserIcon className="h-5 w-5 text-indigo-400" />,
  Branch: <BuildingLibraryIcon className="h-5 w-5 text-green-400" />,
  Group: <UsersIcon className="h-5 w-5 text-pink-400" />,
  Security: <LockClosedIcon className="h-5 w-5 text-red-400" />,
  System: <Cog6ToothIcon className="h-5 w-5 text-yellow-400" />,
};

function getSubjectIcon(subject: string) {
  return subjectIcons[subject] || <Cog6ToothIcon className="h-5 w-5 text-gray-300" />;
}

export default function RolePermissionManager() {
  const { roles, loading, error } = useAdminRoles();
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', permissionIds: [] as string[] });
  const [formTouched, setFormTouched] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { createRoleWithPermissions, loading: creating, error: createError, data, reset } = useCreateRoleWithPermissions();

  // Build unique permissions for selection
  const allPermissions = getAllUniquePermissions(roles);
  const groupedPermissions = groupPermissionsBySubject(allPermissions);

  // Handle form changes
  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormTouched(true);
  }

  function handlePermissionToggle(id: string) {
    setForm(f => ({
      ...f,
      permissionIds: f.permissionIds.includes(id)
        ? f.permissionIds.filter(pid => pid !== id)
        : [...f.permissionIds, id],
    }));
    setFormTouched(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!form.name.trim() || !form.description.trim() || form.permissionIds.length === 0) {
      setFormError('All fields and at least one permission are required.');
      return;
    }
    try {
      await createRoleWithPermissions({ variables: { input: form } });
      setShowForm(false);
      setForm({ name: '', description: '', permissionIds: [] });
      setFormTouched(false);
      reset();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create role.');
    }
  }

  // Modal animation helpers
  function closeForm() {
    setShowForm(false);
    setFormError(null);
    setFormTouched(false);
    reset();
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading roles...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Failed to load roles: {error.message}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 text-indigo-800 flex items-center gap-2">
        <SparklesIcon className="h-7 w-7 text-yellow-400 animate-pulse" />
        Admin Roles & Permissions
      </h2>
      <div className="mb-8 flex justify-end">
        <button
          className="bg-gradient-to-br from-indigo-600 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:scale-105 hover:bg-indigo-700 transition-transform duration-200"
          onClick={() => { setShowForm(true); setFormError(null); setFormTouched(false); reset(); }}
        >
          Add New Role
        </button>
      </div>
      <Transition.Root show={showForm} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeForm}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white/80 shadow-2xl ring-1 ring-indigo-200 p-8 relative">
                <button
                  className="absolute top-4 right-4 text-indigo-400 hover:text-indigo-700 transition"
                  onClick={closeForm}
                  type="button"
                  aria-label="Close"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
                <Dialog.Title className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <SparklesIcon className="h-6 w-6 text-yellow-400 animate-pulse" />
                  Create New Role
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="relative mb-2">
                    <input
                      name="name"
                      className="peer w-full border-2 border-indigo-200 rounded-xl px-4 py-3 bg-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none placeholder-transparent"
                      value={form.name}
                      onChange={handleFormChange}
                      required
                      disabled={creating}
                      autoFocus
                      placeholder="Role Name"
                    />
                    <label className="absolute left-4 top-3 text-indigo-500 text-sm font-medium peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-indigo-600 transition-all duration-200 bg-white/80 px-1 rounded">
                      Role Name
                    </label>
                  </div>
                  <div className="relative mb-2">
                    <textarea
                      name="description"
                      className="peer w-full border-2 border-indigo-200 rounded-xl px-4 py-3 bg-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none placeholder-transparent resize-none min-h-[60px]"
                      value={form.description}
                      onChange={handleFormChange}
                      required
                      disabled={creating}
                      placeholder="Description"
                    />
                    <label className="absolute left-4 top-3 text-indigo-500 text-sm font-medium peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-indigo-600 transition-all duration-200 bg-white/80 px-1 rounded">
                      Description
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-indigo-700">Permissions</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(groupedPermissions).map(([subject, perms]) => (
                        <div key={subject}>
                          <div className="font-semibold text-indigo-600 mb-2 text-base">{subject}</div>
                          <div className="flex flex-wrap gap-2">
                            {perms.map((perm: any) => (
                              <label
                                key={perm.id}
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full shadow-sm border-2 transition-all cursor-pointer text-sm font-medium
                                  ${form.permissionIds.includes(perm.id)
                                    ? 'bg-indigo-600 text-white border-indigo-600 scale-105 shadow-indigo-200'
                                    : 'bg-white/70 text-indigo-700 border-indigo-200 hover:bg-indigo-50'}
                                `}
                              >
                                <input
                                  type="checkbox"
                                  checked={form.permissionIds.includes(perm.id)}
                                  onChange={() => handlePermissionToggle(perm.id)}
                                  disabled={creating}
                                  className="accent-indigo-600 h-4 w-4 rounded-md"
                                />
                                <span className="capitalize">{perm.action}</span>
                                <span className="text-gray-400 text-xs">{perm.description}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {formError && <div className="text-red-500 mb-2">{formError}</div>}
                  {createError && <div className="text-red-500 mb-2">{createError.message}</div>}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={creating || !formTouched}
                  >
                    {creating && <span className="animate-spin mr-2 h-5 w-5 border-2 border-t-transparent border-white rounded-full"></span>}
                    {creating ? 'Creating...' : 'Create Role'}
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Success Toast */}
      <Transition
        show={showSuccess}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <div className="fixed top-8 right-8 z-[60] flex items-center gap-3 bg-white/90 border border-green-200 shadow-xl rounded-2xl px-6 py-4">
          <CheckCircleIcon className="h-7 w-7 text-green-500 animate-pulse" />
          <span className="text-green-700 font-semibold text-lg">Role created!</span>
        </div>
      </Transition>
      <div className="space-y-8">
        {roles.map(role => {
          const grouped = groupPermissionsBySubject(role.permissions);
          const isExpanded = expandedRoleId === role.id;
          return (
            <div
              key={role.id}
              className={`transition-all duration-300 border rounded-3xl shadow-2xl bg-white/60 hover:shadow-3xl overflow-hidden backdrop-blur-md ${isExpanded ? 'ring-2 ring-indigo-400 scale-[1.015] shadow-indigo-200' : ''}`}
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.09) 0%, rgba(236,233,254,0.8) 100%)' }}
            >
              <button
                className="w-full flex justify-between items-center px-10 py-7 focus:outline-none hover:bg-indigo-50/40 transition-colors group"
                onClick={() => setExpandedRoleId(isExpanded ? null : role.id)}
              >
                <div className="flex flex-col text-left gap-1">
                  <span className="font-bold text-2xl text-indigo-800 tracking-tight flex items-center gap-2">
                    {getSubjectIcon(role.name)}
                    {prettifyRoleName(role.name)}
                  </span>
                  <span className="text-gray-500 text-base mt-1">{role.description}</span>
                </div>
                <ChevronDownIcon
                  className={`h-8 w-8 ml-6 text-indigo-400 transition-transform duration-200 group-hover:scale-125 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>
              <Transition
                show={isExpanded}
                enter="transition-all duration-300"
                enterFrom="opacity-0 max-h-0"
                enterTo="opacity-100 max-h-[1000px]"
                leave="transition-all duration-200"
                leaveFrom="opacity-100 max-h-[1000px]"
                leaveTo="opacity-0 max-h-0"
              >
                <div className="px-10 pb-8 pt-3 border-t bg-gradient-to-br from-indigo-50/80 to-white/80 rounded-b-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Object.entries(grouped).map(([subject, perms]) => (
                      <div key={subject} className="mb-2">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm">
                            {getSubjectIcon(subject)}
                            {subject}
                          </span>
                        </div>
                        <ul className="flex flex-wrap gap-2">
                          {perms.map((perm: any) => (
                            <li
                              key={perm.id}
                              className="flex items-center gap-2 bg-white/90 border border-indigo-100 rounded-full px-4 py-2 shadow-sm hover:bg-indigo-50/80 transition text-sm font-medium"
                            >
                              <span className="font-semibold capitalize text-indigo-700">{perm.action}</span>
                              <span className="text-gray-500">{perm.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </Transition>
            </div>
          );
        })}
        {roles.length === 0 && (
          <div className="text-gray-400 text-center">No admin roles found.</div>
        )}
      </div>
    </div>
  );
}
