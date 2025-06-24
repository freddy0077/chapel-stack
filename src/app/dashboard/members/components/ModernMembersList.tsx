"use client";

import { useState, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import {
  EllipsisVerticalIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  ChatBubbleLeftEllipsisIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

// import MessageModal from './MessageModal'; // Assuming this will be recreated or available

// This type should align with the DisplayMember type from page.tsx
// or the transformed member data passed as props.
export type ModernMemberListRowProps = {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  status: string; // Expecting formatted status string
  memberSince?: string;
  branch?: string;
  profileImage?: string | null;
  role?: string;
};

const getStatusPresentation = (status: string): { badgeColor: "emerald" | "sky" | "amber" | "rose" | "gray" | "indigo" } => {
  switch (status.toLowerCase()) {
    case 'active': return { badgeColor: 'indigo' };
    case 'pending': return { badgeColor: 'amber' };
    case 'visitor':
    case 'first time visitor':
    case 'returning visitor': return { badgeColor: 'sky' };
    case 'inactive':
    case 'transferred out':
    case 'excommunicated': return { badgeColor: 'rose' };
    case 'deceased':
    case 'prospective':
    default: return { badgeColor: 'gray' };
  }
};

const getInitials = (name: string): string => {
  if (!name) return '??';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

type SortField = 'name' | 'status' | 'memberSince' | 'branch';
type SortDirection = 'asc' | 'desc';

interface ModernMembersListProps {
  members: ModernMemberListRowProps[];
  isLoading?: boolean;
  onSort?: (field: SortField, direction: SortDirection) => void; // Optional: if sorting is handled by parent
}

export default function ModernMembersList({
  members,
  isLoading = false,
  onSort,
}: ModernMembersListProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  

  const handleSort = (field: SortField) => {
    const newDirection = (field === sortField && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    if (onSort) {
      onSort(field, newDirection);
    }
  };

  const sortedMembers = onSort ? members : [...members].sort((a, b) => {
    let valA: string | number = '';
    let valB: string | number = '';

    switch (sortField) {
      case 'name':
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
        break;
      case 'status':
        valA = a.status.toLowerCase();
        valB = b.status.toLowerCase();
        break;
      case 'memberSince':
        valA = a.memberSince ? new Date(a.memberSince).getTime() : 0;
        valB = b.memberSince ? new Date(b.memberSince).getTime() : 0;
        break;
      case 'branch':
        valA = a.branch?.toLowerCase() || '';
        valB = b.branch?.toLowerCase() || '';
        break;
      default: break;
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      scope="col"
      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-indigo-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center group">
        {label}
        {sortField === field && (
          sortDirection === 'asc' ?
            <ArrowUpIcon className="ml-2 h-4 w-4 text-indigo-600" /> :
            <ArrowDownIcon className="ml-2 h-4 w-4 text-indigo-600" />
        )}
        {sortField !== field && (
          <ArrowUpIcon className="ml-2 h-4 w-4 text-gray-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </th>
  );

  if (isLoading) {
    return (
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    {[...Array(5)].map((_, i) => (
                      <th key={i} className="px-4 py-3.5">
                        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                      </th>
                    ))}
                     <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                          <div className="space-y-1">
                            <div className="h-4 bg-gray-300 rounded w-24"></div>
                            <div className="h-3 bg-gray-300 rounded w-32"></div>
                          </div>
                        </div>
                      </td>
                      {[...Array(4)].map((_, j) => (
                        <td key={j} className="whitespace-nowrap px-4 py-4 text-sm">
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                        </td>
                      ))}
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                         <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!members || members.length === 0) {
    // return <div className="mt-8 text-center text-gray-500">No members found.</div>;
    return null; // Or return an empty state component
  }

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-2xl ring-1 ring-black ring-opacity-5 rounded-2xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-indigo-50 via-white to-indigo-50">
                <tr>
                  <SortableHeader field="name" label="Member" />
                  <th scope="col" className="px-4 py-4 text-left text-base font-semibold text-indigo-700">Contact</th>
                  <SortableHeader field="status" label="Status" />
                  <SortableHeader field="memberSince" label="Member Since" />
                  <SortableHeader field="branch" label="Branch" />
                  <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {sortedMembers.map((member, idx) => {
                  const { badgeColor } = getStatusPresentation(member.status);
                  return (
                    <tr key={member.id} className={`hover:bg-indigo-50/50 transition-colors duration-150 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 mr-3">
                            {member.profileImage ? (
                              <Image
                                src={member.profileImage}
                                alt={member.name}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-medium`}>
                                {getInitials(member.name)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 truncate max-w-xs" title={member.name}>{member.name}</div>
                            <div className="text-gray-500 text-xs truncate max-w-xs" title={member.role}>{member.role || 'Member'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                        {member.email && <div className="truncate max-w-[200px] flex items-center gap-2" title={member.email}>
                          <EnvelopeIcon className="h-4 w-4 text-indigo-300" />
                          <a href={`mailto:${member.email}`} className="text-indigo-700 hover:text-indigo-900 hover:underline font-medium">{member.email}</a>
                        </div>}
                        {member.phone && <div className="text-xs mt-1 truncate max-w-[200px] flex items-center gap-2"><PhoneIcon className="h-4 w-4 text-indigo-200" /><a href={`tel:${member.phone}`} className="text-indigo-600 hover:text-indigo-900 hover:underline">{member.phone}</a></div>}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 bg-opacity-70 text-xs font-semibold shadow-sm ring-1 ring-inset ${
                          badgeColor === 'indigo' ? 'bg-indigo-100 text-indigo-700 ring-indigo-200' :
                          badgeColor === 'emerald' ? 'bg-emerald-100 text-emerald-700 ring-emerald-200' :
                          badgeColor === 'amber' ? 'bg-amber-100 text-amber-700 ring-amber-200' :
                          badgeColor === 'sky' ? 'bg-sky-100 text-sky-700 ring-sky-200' :
                          badgeColor === 'rose' ? 'bg-rose-100 text-rose-700 ring-rose-200' :
                          'bg-gray-100 text-gray-700 ring-gray-200'
                        }`}>{member.status}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                        {member.memberSince ? new Date(member.memberSince).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 truncate max-w-[150px]" title={member.branch}>{member.branch || 'N/A'}</td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Menu as="div" className="relative inline-block text-left">
                          <Menu.Button className="p-1.5 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1">
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </Menu.Button>
                          <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                            <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <Menu.Item>
                                {({ active }) => <Link href={`/dashboard/members/${member.id}`} className={`${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'} group flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-700`}><UserCircleIcon className={`mr-3 h-5 w-5 ${active ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'}`} /> View Profile</Link>}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => <Link href={`/dashboard/members/${member.id}/edit`} className={`${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'} group flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-700`}><PencilSquareIcon className={`mr-3 h-5 w-5 ${active ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'}`} /> Edit Member</Link>}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => <button onClick={() => { setSelectedMemberForModal(member); setIsMessageModalOpen(true); }} className={`${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'} group flex w-full items-center rounded-md px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-700`}><ChatBubbleLeftEllipsisIcon className={`mr-3 h-5 w-5 ${active ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'}`} /> Send Message</button>}
                              </Menu.Item>
                              <div className="my-1 h-px bg-gray-100" />
                              <Menu.Item>
                                {({ active }) => (
                                  <button className={`${active ? 'bg-red-50 text-red-700' : 'text-gray-700'} group flex w-full items-center rounded-md px-3 py-2 text-sm`}>
                                    <TrashIcon className={`mr-3 h-5 w-5 ${active ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'}`} /> Delete Member
                                  </button>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* 
      {selectedMemberForModal && (
        <MessageModal 
          isOpen={isMessageModalOpen} 
          onClose={() => { setIsMessageModalOpen(false); setSelectedMemberForModal(null); }}
          memberName={selectedMemberForModal.name}
          memberEmail={selectedMemberForModal.email || ''}
          // memberId={selectedMemberForModal.id} // If needed by modal
        />
      )}
      */}
    </div>
  );
}