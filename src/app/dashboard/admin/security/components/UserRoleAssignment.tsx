"use client";

import React, { useState, useEffect } from 'react';
import { User, UserRole, Branch, UserBranchAccess } from '@/lib/auth/types';
import { PlusIcon, PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAssignRoleToUser } from '@/graphql/hooks/useAssignRoleToUser';
import { useAdminRoles } from '@/graphql/hooks/useAdminRoles';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Mock data for branches
const mockBranches: Branch[] = [
  { id: 'main', name: 'Main Campus', location: 'Downtown', region: 'Central' },
  { id: 'east', name: 'East Campus', location: 'Eastside', region: 'East' },
  { id: 'west', name: 'West Campus', location: 'Westside', region: 'West' },
  { id: 'south', name: 'South Campus', location: 'Southside', region: 'South' },
  { id: 'north', name: 'North Campus', location: 'Northside', region: 'North' },
];

// import real admin user data
import { useAdminUsers } from '@/graphql/hooks/useAdminUsers';

// Available roles for selection
const availableRoles: { value: UserRole; label: string }[] = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'BRANCH_ADMIN', label: 'Branch Admin' },
  { value: 'PASTOR', label: 'Pastor' },
  { value: 'MINISTRY_LEADER', label: 'Ministry Leader' },
  { value: 'STAFF', label: 'Staff Member' },
  { value: 'VOLUNTEER', label: 'Volunteer' },
  { value: 'MEMBER', label: 'Member' }
];

// Component for editing user roles
function UserRoleEditor({
  user,
  branches,
  onSave,
  onCancel
}: {
  user: User;
  branches: Branch[];
  onSave: (updatedAccessList: UserBranchAccess[]) => void;
  onCancel: () => void;
}) {


  const [accessList, setAccessList] = useState<UserBranchAccess[]>(
    (user?.userBranches ?? []).map(access => ({ ...access }))
  );
  
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('member');
  const [isPrimary, setIsPrimary] = useState(false);
  
  // Initialize available branches (ones user doesn't already have access to)
  useEffect(() => {
    const currentBranchIds = new Set(accessList.map(access => access.branchId));
    const remainingBranches = branches.filter(branch => !currentBranchIds.has(branch.id));
    setAvailableBranches(remainingBranches);
    
    if (remainingBranches.length > 0) {
      setSelectedBranchId(remainingBranches[0].id);
    }
  }, [branches, accessList]);
  
  // Add branch access for user
  const addBranchAccess = () => {
    if (!selectedBranchId) return;
    
    // Don't add if branch already exists in the list
    if (accessList.some(access => access.branchId === selectedBranchId)) {
      return;
    }
    
    // Create new access entry
    const newAccess: UserBranchAccess = {
      userId: user.id,
      branchId: selectedBranchId,
      role: selectedRole,
      isHomeBranch: isPrimary
    };
    
    // If setting as primary, update other branches to non-primary
    let updatedAccessList = [...accessList];
    if (isPrimary) {
      updatedAccessList = updatedAccessList.map(access => ({
        ...access,
        isHomeBranch: false
      }));
    }
    
    // Add the new access
    const newAccessList = [...updatedAccessList, newAccess];
    setAccessList(newAccessList);
    
    // Update available branches
    setAvailableBranches(availableBranches.filter(branch => branch.id !== selectedBranchId));
    
    // Reset form
    if (availableBranches.length > 1) {
      setSelectedBranchId(availableBranches.find(b => b.id !== selectedBranchId)?.id || '');
    } else {
      setSelectedBranchId('');
    }
    setSelectedRole('member');
    setIsPrimary(false);
  };
  
  // Remove branch access
  const removeBranchAccess = (branchId: string) => {
    const accessToRemove = accessList.find(access => access.branchId === branchId);
    if (!accessToRemove) return;
    
    // Remove the access
    const newAccessList = accessList.filter(access => access.branchId !== branchId);
    
    // If removing the primary branch, set the first remaining branch as primary (if any)
    if (accessToRemove.isHomeBranch && newAccessList.length > 0) {
      newAccessList[0].isHomeBranch = true;
    }
    
    setAccessList(newAccessList);
    
    // Update available branches
    const branchToAdd = branches.find(b => b.id === branchId);
    if (branchToAdd) {
      setAvailableBranches([...availableBranches, branchToAdd]);
    }
  };
  
  // Update role for a branch
  const updateBranchRole = (branchId: string, newRole: UserRole) => {
    setAccessList(accessList.map(access => 
      access.branchId === branchId ? { ...access, role: newRole } : access
    ));
  };
  
  // Set branch as primary
  const setBranchAsPrimary = (branchId: string) => {
    setAccessList(accessList.map(access => ({
      ...access,
      isHomeBranch: access.branchId === branchId
    })));
  };
  
  // Get branch name by ID
  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  const { assignRoleToUser, loading: assigning, error: assignError } = useAssignRoleToUser();
  const { roles: allRoles } = useAdminRoles();
  const [selectedRoleId, setSelectedRoleId] = useState('');

  const handleAssignRole = () => {
    if (!selectedRoleId) return;
    assignRoleToUser({ variables: { userId: user.id, roleId: selectedRoleId } })
      .then(() => {
        // Optionally refetch or update UI
      })
      .catch(() => {
        // Optionally show error toast
      });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Manage Branch Access for {user.name}
      </h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Current Branch Access</h3>
        {accessList.length === 0 ? (
          <p className="text-sm text-gray-500 italic">User has no branch access</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Primary
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accessList.map(access => (
                  <tr key={access.branchId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getBranchName(access.branchId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={access.role}
                        onChange={(e) => updateBranchRole(access.branchId, e.target.value as UserRole)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        {availableRoles.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={access.isHomeBranch}
                          onChange={() => setBranchAsPrimary(access.branchId)}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => removeBranchAccess(access.branchId)}
                        className="text-red-600 hover:text-red-900"
                        disabled={accessList.length === 1} // Can't remove the last branch
                        title={accessList.length === 1 ? "Can't remove the last branch" : "Remove branch access"}
                      >
                        <TrashIcon className={`h-5 w-5 ${accessList.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {availableBranches.length > 0 && (
        <div className="mb-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Add Branch Access</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                Branch
              </label>
              <select
                id="branch"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="" disabled>Select a branch</option>
                {availableBranches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} ({branch.location})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {availableRoles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <div className="flex items-center h-full">
                <input
                  id="is-primary"
                  type="checkbox"
                  checked={isPrimary}
                  onChange={() => setIsPrimary(!isPrimary)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="is-primary" className="ml-2 block text-sm text-gray-700">
                  Set as primary branch
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <button
              type="button"
              onClick={addBranchAccess}
              disabled={!selectedBranchId}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Branch
            </button>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-4 mt-6">
        <select
          className="rounded-lg border px-3 py-2 text-gray-700 bg-white shadow focus:ring-indigo-500 focus:border-indigo-500"
          value={selectedRoleId}
          onChange={e => setSelectedRoleId(e.target.value)}
          disabled={assigning}
        >
          <option value="">Select Role</option>
          {allRoles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
        <button
          className="bg-gradient-to-br from-indigo-600 to-purple-500 text-white px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 transition-transform duration-150"
          onClick={handleAssignRole}
          disabled={assigning || !selectedRoleId}
        >
          {assigning ? 'Assigning...' : 'Assign Role'}
        </button>
      </div>
      {assignError && <div className="text-red-500 mt-2">Failed to assign role.</div>}
      
      <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(accessList)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// New User Modal Component (with backend mutation)
import { useMutation } from '@apollo/client';
import { CREATE_USERS_WITH_ROLE } from '@/graphql/mutations/userMutations';
import { useAuth } from "@/contexts/AuthContextEnhanced";

function NewUserModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (user: any) => void }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', roleName: 'MEMBER' });
  const [createUsersWithRole, { loading }] = useMutation(CREATE_USERS_WITH_ROLE);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user } = useAuth();
  const organisationId = user?.organisationId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (form.password.length < 8) {
      setSubmitError('Password must be at least 8 characters');
      return;
    }
    try {
      const { data } = await createUsersWithRole({
        variables: {
          input: {
            users: [{ ...form }],
            organisationId,
          },
        },
      });
      if (data.createUsersWithRole && !data.createUsersWithRole[0].error) {
        onCreate(data.createUsersWithRole[0]);
        setForm({ firstName: '', lastName: '', email: '', password: '', roleName: 'MEMBER' });
        onClose();
      } else {
        setSubmitError(data.createUsersWithRole[0].error || 'Unknown error');
      }
    } catch (err: any) {
      setSubmitError(err.message);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gradient-to-br from-indigo-400/40 via-blue-200/60 to-white/80 backdrop-blur-sm transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white/90 p-8 text-left align-middle shadow-2xl ring-1 ring-indigo-100 transition-all">
                <Dialog.Title as="h3" className="text-2xl font-bold leading-7 text-indigo-900 mb-6 flex items-center gap-2">
                  <PlusIcon className="h-7 w-7 text-indigo-500 bg-indigo-100 rounded-full p-1" /> Add New User
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-indigo-700">First Name</label>
                      <input name="firstName" type="text" required value={form.firstName} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-indigo-200 bg-indigo-50/80 py-2 px-3 text-indigo-900 shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-indigo-700">Last Name</label>
                      <input name="lastName" type="text" required value={form.lastName} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-indigo-200 bg-indigo-50/80 py-2 px-3 text-indigo-900 shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-700">Email</label>
                    <input name="email" type="email" required value={form.email} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-indigo-200 bg-indigo-50/80 py-2 px-3 text-indigo-900 shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-700">Password</label>
                    <input name="password" type="password" required minLength={8} value={form.password} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-indigo-200 bg-indigo-50/80 py-2 px-3 text-indigo-900 shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-700">Role</label>
                    <select name="roleName" value={form.roleName} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-indigo-200 bg-indigo-50/80 py-2 px-3 text-indigo-900 shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                      {availableRoles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  {submitError && <div className="text-red-500 text-sm">{submitError}</div>}
                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" className="inline-flex justify-center rounded-lg border border-indigo-200 bg-white px-5 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200" onClick={onClose}>Cancel</button>
                    <button type="submit" className="inline-flex justify-center rounded-lg border border-transparent bg-gradient-to-r from-indigo-500 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-200" disabled={loading}>Add User</button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

// Main UserRoleAssignment component
export default function UserRoleAssignment() {
  const [branches] = useState<Branch[]>(mockBranches);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);

  // Fetch admin users from API
  const { adminUsers, loading, error, refetch } = useAdminUsers({
    pagination: { skip: 0, take: 20 },
    filter: { isActive: true }
  });

  // Filter users based on search term
  const filteredUsers = adminUsers.filter(user => 
    ((user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  if (loading) {
    return <div className="p-8 text-gray-500">Loading admin users...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-500">Error loading admin users.</div>;
  }
  
  // Edit user roles
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setIsEditing(true);
  };
  
  // Save user roles
  const handleSaveUserRoles = (updatedAccessList: UserBranchAccess[]) => {
    if (!currentUser) return;

    // Determine primary branch and roles
    const primaryBranchId = updatedAccessList.find(access => access.isHomeBranch)?.branchId || updatedAccessList[0]?.branchId;
    const roles = Array.from(new Set(updatedAccessList.map(access => access.role))) as UserRole[];

    // Update the user (local state only for now)
    // TODO: Integrate mutation to update user roles on backend
    setCurrentUser({
      ...currentUser,
      accessibleBranches: updatedAccessList,
      primaryBranchId,
      roles,
    });
    setIsEditing(false);
  };
  
  // Get main role label for display
  const getUserRoleLabel = (user: User): string => {
    if (user.roles && user.roles.includes('super_admin')) {
      return 'Super Admin';
    }
    const primaryBranchAccess = user.accessibleBranches?.find(access => access.isHomeBranch);
    if (!primaryBranchAccess) return 'Unknown';
    const roleLabel = availableRoles.find(r => r.value === primaryBranchAccess.role)?.label;
    return roleLabel || 'Unknown';
  };
  
  // Get branch count for display
  const getUserBranchCount = (user: User): number => {
    return user.accessibleBranches ? user.accessibleBranches.length : 0;
  };
  
  // Simulate user creation (replace with mutation in real app)
  const handleCreateUser = (user: any) => {
    // TODO: Integrate with backend
    refetch();
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <NewUserModal open={isNewUserOpen} onClose={() => setIsNewUserOpen(false)} onCreate={handleCreateUser} />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">User Role Assignment</h2>
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={() => setIsNewUserOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <PlusIcon className="h-5 w-5" /> Add User
            </button>
            <div className="w-80">
              <form
                onSubmit={e => { e.preventDefault(); }}
                className="relative flex items-center"
                role="search"
              >
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-xl py-2 pl-4 bg-white/90"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  tabIndex={-1}
                  aria-label="Search"
                >
                  <UserIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {isEditing && currentUser ? (
          <UserRoleEditor
            user={currentUser}
            branches={branches}
            onSave={handleSaveUserRoles}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 rounded-xl shadow-lg bg-white">
              <thead className="bg-gradient-to-r from-indigo-50 to-blue-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Primary Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Branches
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-indigo-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-base">
                        {user.firstName ? user.firstName[0] : '?'}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.roles && user.roles.length > 0 ? user.roles[0].name : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* Branch count not available in AdminUser, show N/A or 1 */}
                      N/A
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-full p-2 transition-colors duration-100"
                        title="Edit user roles"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
