"use client";

import { useState, useEffect } from 'react';
import { 
  UserPlusIcon,
  MagnifyingGlassIcon,
  UserMinusIcon,
  EnvelopeIcon,
  PhoneIcon,
  PencilIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';

// Mock authentication context for demo purposes
// In a real implementation, this would use the actual AuthContext from the security system
const useAuth = () => {
  return {
    hasPermission: (permission: string) => {
      // For demo purposes, just return true to show admin controls
      // In a real implementation, this would check against the user's actual permissions
      console.log(`[AUDIT] Permission check: ${permission}`);
      return true;
    }
  };
};

// Types
interface MinistryMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinDate: Date;
  status: 'active' | 'inactive';
  imageUrl: string;
  attendance: number; // percentage
  notes: string;
}

// Mock data for ministry members
const MOCK_MEMBERS: MinistryMember[] = [
  {
    id: 'm1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '(555) 123-4567',
    role: 'Vocalist',
    joinDate: new Date('2022-03-15'),
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    attendance: 92,
    notes: 'Talented soprano vocalist. Available for special services.'
  },
  {
    id: 'm2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    phone: '(555) 987-6543',
    role: 'Guitarist',
    joinDate: new Date('2021-11-08'),
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    attendance: 85,
    notes: 'Lead guitarist with 10 years experience.'
  },
  {
    id: 'm3',
    name: 'Carol Davis',
    email: 'carol.davis@example.com',
    phone: '(555) 234-5678',
    role: 'Drummer',
    joinDate: new Date('2023-01-20'),
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    attendance: 78,
    notes: 'New to the team but showing great potential.'
  },
  {
    id: 'm4',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    phone: '(555) 876-5432',
    role: 'Sound Engineer',
    joinDate: new Date('2020-08-12'),
    status: 'inactive',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    attendance: 65,
    notes: 'Currently on leave due to family commitments.'
  },
  {
    id: 'm5',
    name: 'Eva Garcia',
    email: 'eva.garcia@example.com',
    phone: '(555) 345-6789',
    role: 'Pianist',
    joinDate: new Date('2022-06-30'),
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    attendance: 95,
    notes: 'Classically trained pianist with a passion for worship.'
  }
];

interface MembersTabProps {
  ministryId: string;
  ministryName: string;
}

export default function MembersTab({ ministryId }: MembersTabProps) {
  const { hasPermission } = useAuth();
  const [members, setMembers] = useState<MinistryMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<MinistryMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  // Modal states
  const [showAddMemberModal, setShowAddMemberModal] = useState(false); // For future implementation
  const [selectedMember, setSelectedMember] = useState<MinistryMember | null>(null);
  
  // Check if user has permission to manage members
  const canManageMembers = hasPermission(`ministry:${ministryId}:manage_members`);
  
  // Fetch members data
  useEffect(() => {
    const fetchMembers = () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setMembers(MOCK_MEMBERS);
        setFilteredMembers(MOCK_MEMBERS);
        setLoading(false);
      }, 500);
    };
    
    fetchMembers();
  }, [ministryId]);
  
  // Handle search and filtering
  useEffect(() => {
    let filtered = members;
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }
    
    setFilteredMembers(filtered);
  }, [searchTerm, statusFilter, members]);
  
  // Handle member selection
  const handleViewMember = (member: MinistryMember) => {
    setSelectedMember(member);
  };
  
  // Handle member status change with audit logging
  const handleStatusChange = (memberId: string, newStatus: 'active' | 'inactive') => {
    // Update members list
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, status: newStatus } : member
    ));
    
    // Log action for audit trail (connects with Security & Access Control)
    console.log(`[AUDIT] User changed status of member ${memberId} to ${newStatus} in ministry ${ministryId}`);
    
    // Close member details modal if open
    if (selectedMember?.id === memberId) {
      setSelectedMember({ ...selectedMember, status: newStatus });
    }
  };
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with search and filters */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-3 sm:mb-0">
            Ministry Members <span className="text-gray-500 text-sm">({filteredMembers.length})</span>
          </h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            {/* Search box */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search members..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Status filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FunnelIcon className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Members</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            {/* Add Member button (conditionally rendered based on permissions) */}
            {canManageMembers && (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  setShowAddMemberModal(true);
                  // Log this action in the audit system
                  console.log(`[AUDIT] User initiated add member action for ministry ${ministryId}`);
                  // In a real implementation, this would open a modal form
                  alert('Add member functionality will be implemented in a future update');
                }}
              >
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Add Member
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Members Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr 
                  key={member.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewMember(member)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image className="h-10 w-10 rounded-full object-cover" src={member.imageUrl} alt={member.name} width={40} height={40} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{member.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(member.joinDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            member.attendance >= 90 ? 'bg-green-500' : 
                            member.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${member.attendance}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">{member.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {canManageMembers && (
                      <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Member"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        {member.status === 'active' ? (
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-900"
                            title="Deactivate Member"
                            onClick={() => handleStatusChange(member.id, 'inactive')}
                          >
                            <UserMinusIcon className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="text-green-600 hover:text-green-900"
                            title="Activate Member"
                            onClick={() => handleStatusChange(member.id, 'active')}
                          >
                            <UserPlusIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No members found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Member Details Modal */}
      <Transition.Root show={!!selectedMember} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => setSelectedMember(null)}>
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* Center modal contents */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {selectedMember && (
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Image 
                        src={selectedMember.imageUrl} 
                        alt={selectedMember.name} 
                        className="h-12 w-12 rounded-full object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                        {selectedMember.name}
                      </Dialog.Title>
                      <div className="mt-1">
                        <p className="text-sm text-gray-500">{selectedMember.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 border-t border-gray-200 pt-4">
                    <dl className="divide-y divide-gray-200">
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                          {selectedMember.email}
                          <a 
                            href={`mailto:${selectedMember.email}`}
                            className="ml-2 text-indigo-600 hover:text-indigo-900"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <EnvelopeIcon className="h-4 w-4" />
                          </a>
                        </dd>
                      </div>
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                          {selectedMember.phone}
                          <a 
                            href={`tel:${selectedMember.phone}`}
                            className="ml-2 text-indigo-600 hover:text-indigo-900"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <PhoneIcon className="h-4 w-4" />
                          </a>
                        </dd>
                      </div>
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Joined</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {formatDate(selectedMember.joinDate)}
                        </dd>
                      </div>
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            selectedMember.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
                          </span>
                        </dd>
                      </div>
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Attendance</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  selectedMember.attendance >= 90 ? 'bg-green-500' : 
                                  selectedMember.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${selectedMember.attendance}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-900">{selectedMember.attendance}%</span>
                          </div>
                        </dd>
                      </div>
                      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Notes</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {selectedMember.notes || 'No notes available.'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setSelectedMember(null)}
                    >
                      Close
                    </button>
                    
                    {canManageMembers && (
                      <>
                        <button
                          type="button"
                          className="ml-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                          onClick={() => {
                            // This would open the edit form in a real implementation
                            alert(`Edit ${selectedMember.name} (not implemented)`);
                          }}
                        >
                          Edit Member
                        </button>
                        
                        {selectedMember.status === 'active' ? (
                          <button
                            type="button"
                            className="ml-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={() => handleStatusChange(selectedMember.id, 'inactive')}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="ml-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={() => handleStatusChange(selectedMember.id, 'active')}
                          >
                            Activate
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
