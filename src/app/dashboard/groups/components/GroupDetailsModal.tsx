import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import Image from 'next/image';
import { XMarkIcon, UserPlusIcon, CalendarIcon, MapPinIcon, PencilIcon } from '@heroicons/react/24/outline';
import { SmallGroup, useSmallGroupMutations } from '../../../../graphql/hooks/useSmallGroups';
import EditGroupModal from './EditGroupModal';

interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: SmallGroup | null;
  onUpdate?: () => void;
}

export default function GroupDetailsModal({ isOpen, onClose, group, onUpdate }: GroupDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'members'>('overview');
  const { deleteSmallGroup } = useSmallGroupMutations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleDelete = async () => {
    if (!group) return;
    
    if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        await deleteSmallGroup(group.id);
        onClose();
      } catch (error) {
        console.error('Error deleting group:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (!group) return null;
  
  return (
    <Dialog as="div" className="relative z-50" open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50 bg-gray-700 bg-opacity-70 transition-opacity" />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="relative w-full max-w-3xl mx-auto transform overflow-hidden rounded-3xl bg-white px-0 pb-0 pt-0 text-left shadow-2xl transition-all">
            {/* Close button */}
            <button
              type="button"
              className="absolute right-6 top-6 z-10 rounded-full bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={onClose}
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 px-8 pt-8 pb-6 border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-white">
              {/* Group avatar/initials */}
              <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-100 text-indigo-700 text-3xl font-bold shadow-md">
                {group.name.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase()}
              </div>
              {/* Group info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl font-bold text-gray-900 truncate">{group.name}</span>
                  <span className={`inline-block text-xs font-semibold rounded-full px-3 py-1 ${
                        group.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                        group.status === 'INACTIVE' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                    {group.status === 'ACTIVE' ? 'Active' : group.status === 'INACTIVE' ? 'Inactive' : 'Archived'}
                  </span>
                </div>
                
                <p className="mt-2 text-sm text-gray-500">
                  {group.description || 'No description provided.'}
                </p>
                
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-900">Group Type</div>
                  <div className="mt-1 text-sm text-gray-500">{group.type}</div>
                </div>
                
                {group.meetingSchedule && (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>Meeting Schedule</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">{group.meetingSchedule}</div>
                  </div>
                )}
                
                {group.location && (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span>Meeting Location</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">{group.location}</div>
                  </div>
                )}
                
                {/* Tabs at the top */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`text-sm font-medium ${activeTab === 'overview' ? 'text-indigo-600' : 'text-gray-500'} hover:text-indigo-600`}
                      onClick={() => setActiveTab('overview')}
                    >
                      Overview
                    </button>
                    <button
                      type="button"
                      className={`text-sm font-medium ${activeTab === 'members' ? 'text-indigo-600' : 'text-gray-500'} hover:text-indigo-600`}
                      onClick={() => setActiveTab('members')}
                    >
                      Members ({group.members?.length || 0})
                    </button>
                  </div>
                  {activeTab === 'members' && (
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <UserPlusIcon className="h-4 w-4 mr-1" />
                      <span>Add Member</span>
                    </button>
                  )}
                </div>
                
                {/* Tab Content */}
                <div>
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="text-sm font-medium text-gray-900">Group Details</div>
                        <div className="mt-1 text-sm text-gray-500">{group.description}</div>
                      </div>
                      <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="text-sm font-medium text-gray-900">Meeting Schedule</div>
                        <div className="mt-1 text-sm text-gray-500">{group.meetingSchedule}</div>
                      </div>
                      <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="text-sm font-medium text-gray-900">Meeting Location</div>
                        <div className="mt-1 text-sm text-gray-500">{group.location}</div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'members' && (
                    <div className="max-h-72 overflow-y-auto">
                      {group.members && group.members.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {group.members.map((groupMember) => {
                            const member = groupMember.member;
                            const memberName = member ? `${member.firstName} ${member.lastName}` : 'Unknown Member';
                            const memberInitials = member ? 
                              `${member.firstName?.charAt(0) || ''}${member.lastName?.charAt(0) || ''}`.toUpperCase() : 
                              '??';
                            
                            return (
                              <li key={groupMember.id} className="py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                  {/* Profile image or initials */}
                                  {member?.profileImageUrl ? (
                                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                                      <Image
                                        className="object-cover"
                                        src={member.profileImageUrl}
                                        alt={memberName}
                                        fill
                                        sizes="40px"
                                      />
                                    </div>
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-medium text-indigo-700">
                                      {memberInitials}
                                    </div>
                                  )}
                                  
                                  {/* Member details */}
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">{memberName}</p>
                                    <div className="flex items-center">
                                      <span className="text-xs font-medium rounded-full px-2 py-0.5 mr-2 bg-indigo-50 text-indigo-700">
                                        {groupMember.role.replace('_', ' ')}
                                      </span>
                                      <p className="text-xs text-gray-500">
                                        {member?.email || 'No email available'}
                                      </p>
                                    </div>
                                    {member?.phoneNumber && (
                                      <p className="text-xs text-gray-500">
                                        {member.phoneNumber}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Member actions */}
                                <div className="flex items-center">
                                  <span className={`inline-flex mr-3 items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                    groupMember.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {groupMember.status}
                                  </span>
                                  <button
                                    type="button"
                                    className="text-sm text-red-600 hover:text-red-900"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="text-sm text-gray-500 py-4 text-center border border-gray-200 rounded-md">
                          No members in this group yet
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-6 flex items-center justify-between">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Group'}
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit Group
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={onClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
      
      {/* Edit Group Modal */}
      <EditGroupModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        group={group}
        afterUpdate={() => {
          setIsEditModalOpen(false);
          if (onUpdate) onUpdate();
        }}
      />
    </Dialog>
  );
}
